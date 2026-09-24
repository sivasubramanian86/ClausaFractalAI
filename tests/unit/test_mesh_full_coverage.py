"""Comprehensive unit tests driving app/ module coverage to 100%."""

import time

import pytest
from fastapi.testclient import TestClient

from app.agents.triage_agent import TriageAgent
from app.core.config import settings
from app.core.exceptions import (
    ClausaFractalError,
    DeadlockDetectedError,
    HITLEscalationRequiredError,
    SecurityGovernanceError,
    SymbolicConstraintError,
)
from app.core.resilience import CircuitBreaker, CircuitBreakerOpenError, CircuitState
from app.core.security import (
    CapabilityToken,
    issue_capability_token,
    sanitize_agent_input,
)
from app.core.telemetry import (
    dlp_scrub_dict,
    dlp_scrub_text,
    format_w3c_traceparent,
    get_current_trace_id,
    inject_trace_context,
)
from app.finops.cache import (
    FinOpsCache,
    _cosine_similarity,
    _pseudo_semantic_embedding,
)
from app.hitl.queue import HITLQueue
from app.main import app
from app.mcp.server import GovernedMCPServer, MCPToolSchema
from app.symbolic.contracts import ActionPlan
from app.symbolic.solver import SymbolicVerifier


# 1. Resilience & CircuitBreaker Tests
def test_circuit_breaker_transitions_and_rejection() -> None:
    breaker = CircuitBreaker("test_breaker", failure_threshold=2, recovery_timeout_seconds=0.05)

    assert breaker.can_execute() is True
    assert breaker.state == CircuitState.CLOSED

    # Failure 1
    def failing_call() -> None:
        raise ValueError("Service down")

    with pytest.raises(ValueError):
        breaker.execute(failing_call)
    assert breaker.state == CircuitState.CLOSED
    assert breaker.failure_count == 1

    # Failure 2 -> trips to OPEN
    with pytest.raises(ValueError):
        breaker.execute(failing_call)
    assert breaker.state == CircuitState.OPEN

    # While OPEN and within timeout -> fast fail
    with pytest.raises(CircuitBreakerOpenError):
        breaker.execute(lambda: "ok")

    # Wait for cooldown
    time.sleep(0.06)
    assert breaker.can_execute() is True
    assert breaker.state == CircuitState.HALF_OPEN

    # In HALF_OPEN, failure immediately returns to OPEN
    with pytest.raises(ValueError):
        breaker.execute(failing_call)
    assert breaker.state == CircuitState.OPEN

    # Wait again and succeed in HALF_OPEN -> transitions to CLOSED
    time.sleep(0.06)
    assert breaker.can_execute() is True
    res = breaker.execute(lambda: "success_result")
    assert res == "success_result"
    assert breaker.state == CircuitState.CLOSED
    assert breaker.failure_count == 0


# 2. HITLQueue Tests
def test_hitl_queue_full_operations() -> None:
    queue = HITLQueue()
    plan = ActionPlan(
        plan_id="plan_hitl",
        intent="Uncapped liability clause",
        proposed_action="Review high risk terms",
        risk_category="HighRisk",
        proposed_liability_cap_usd=25_000_000.0,
        proposed_notice_days=5,
        require_mutual_indemnity=False,
        forbid_consequential_waiver=False,
    )

    chk = queue.checkpoint_state(
        trace_id="trace_hitl_12345",
        plan=plan,
        unsat_reasons=["theorem_liability_cap_within_bounds"],
        resumption_token="token_resumption_abc",
    )
    assert chk.resumption_token == "token_resumption_abc"

    retrieved = queue.get_checkpoint("token_resumption_abc")
    assert retrieved is not None
    assert retrieved.checkpoint_id == chk.checkpoint_id

    # Invalid token resolution
    with pytest.raises(ClausaFractalError):
        queue.human_resolve("invalid_token", "APPROVED", "Notes")

    # Valid resolution with override plan
    override_plan = plan.model_copy(update={"proposed_liability_cap_usd": 1_000_000.0})
    result = queue.human_resolve(
        resumption_token="token_resumption_abc",
        decision="MODIFIED",
        reviewer_notes="Capped at $1M ACV",
        overridden_plan=override_plan,
    )
    assert result["status"] == "MODIFIED"
    assert result["final_plan"]["proposed_liability_cap_usd"] == 1_000_000.0


# 3. GovernedMCPServer Tool Error Handlers & Dispatches
def test_governed_mcp_unauthorized_and_edge_cases() -> None:
    server = GovernedMCPServer()

    # Valid token with only 'tools:dlp_scrub'
    token_str = issue_capability_token("tenant_test", "agent_1", ["scrub_pii_dlp"])

    # Attempt to call unregistered tool
    with pytest.raises(SecurityGovernanceError, match="not registered in MCP gateway"):
        server.execute_tool("unknown_tool", {}, token_str)

    # Attempt to call tool not in allowed list
    with pytest.raises(SecurityGovernanceError, match="not authorized to execute tool"):
        server.execute_tool(
            "calculate_liability_ratio", {"liability_cap": 100, "acv": 100}, token_str
        )

    # Valid token with all tools
    admin_token_str = issue_capability_token("tenant_test", "agent_admin", ["*"])

    # calculate_liability_ratio with acv = 0
    ratio_res = server.execute_tool(
        "calculate_liability_ratio",
        {"liability_cap": 100_000, "acv": 0.0},
        admin_token_str,
    )
    assert ratio_res["ratio"] == 0.0
    assert ratio_res["is_safe"] is True

    # generate_redline_patch
    diff_res = server.execute_tool(
        "generate_redline_patch",
        {"original_clause": "Old clause", "proposed_clause": "New clause"},
        admin_token_str,
    )
    assert diff_res["status"] == "success"
    assert diff_res["original_len"] == 10
    assert diff_res["proposed_len"] == 10

    # Unhandled tool branch in dispatcher
    server.list_tools = lambda: [
        MCPToolSchema(
            name="unhandled_mock",
            description="desc",
            required_capability="*",
            parameters={},
        )
    ]
    admin_token_mock = issue_capability_token("tenant_test", "agent_admin", ["unhandled_mock"])
    with pytest.raises(SecurityGovernanceError, match="Unhandled tool handler"):
        server.execute_tool("unhandled_mock", {}, admin_token_mock)


# 4. Triage Agent Intent & Unsat Repair Branches
def test_triage_agent_intent_and_repair_branches() -> None:
    agent = TriageAgent()

    # Test all intent branches
    plan1 = agent.analyze_clause_intent("Unilateral indemnification solely by vendor")
    assert plan1.require_mutual_indemnity is False

    plan2 = agent.analyze_clause_intent("Unlimited liability with no cap whatsoever")
    assert plan2.proposed_liability_cap_usd == 2_000_000.0

    plan3 = agent.analyze_clause_intent("Immediate termination with 5 days notice")
    assert plan3.proposed_notice_days == 5

    plan4 = agent.analyze_clause_intent("Standard general commercial agreement")
    assert plan4.proposed_notice_days == 30

    # Test non-triggering conditions for intent sub-branches
    plan5 = agent.analyze_clause_intent("Mutual indemnification holds harmless")
    assert plan5.require_mutual_indemnity is True

    plan6 = agent.analyze_clause_intent("The liability of vendor is strictly capped")
    assert plan6.proposed_liability_cap_usd == 500_000.0

    plan7 = agent.analyze_clause_intent("Contract termination upon thirty days written notice")
    assert plan7.proposed_notice_days == 30

    # Test repair_plan with all unsat_core branches
    repaired = agent.repair_plan(
        plan1,
        [
            "theorem_liability_cap_within_bounds",
            "theorem_statutory_notice_satisfied",
            "theorem_indemnity_must_be_mutual",
            "theorem_consequential_waiver",
        ],
    )
    assert repaired.proposed_liability_cap_usd == 500_000.0
    assert repaired.proposed_notice_days == 30
    assert repaired.require_mutual_indemnity is True
    assert repaired.forbid_consequential_waiver is True


# 5. Telemetry & DLP Scrubbing Branches
def test_telemetry_dlp_and_trace_branches() -> None:
    # Empty string
    assert dlp_scrub_text("") == ""

    # Nested dictionary with various primitive types in lists
    nested = {
        "text": "Call 555-123-4567",
        "nested_dict": {"email": "user@example.com"},
        "list_items": [
            "Card 4111-2222-3333-4444",
            {"inner_token": "bearer eyJhbGciOi..."},
            12345,
            True,
            None,
        ],
        "int_val": 42,
    }
    scrubbed = dlp_scrub_dict(nested)
    assert "[REDACTED_PHONE]" in scrubbed["text"]
    assert "[REDACTED_EMAIL]" in scrubbed["nested_dict"]["email"]
    assert "[REDACTED_CARD]" in scrubbed["list_items"][0]
    assert "[REDACTED_TOKEN]" in scrubbed["list_items"][1]["inner_token"]
    assert scrubbed["list_items"][2] == 12345

    # format_w3c_traceparent with explicit parameters
    explicit_tp = format_w3c_traceparent("aabbccddeeff00112233445566778899", "1122334455667788")
    assert explicit_tp == "00-aabbccddeeff00112233445566778899-1122334455667788-01"

    # Active span injection
    from app.core.telemetry import tracer

    with tracer.start_as_current_span("active_test_span"):
        curr_tid = get_current_trace_id()
        assert curr_tid != "00000000000000000000000000000000"
        evt = inject_trace_context(None, "info", {})
        assert "logging.googleapis.com/trace" in evt
        assert "logging.googleapis.com/spanId" in evt


# 6. FinOps Cache Mathematical Edge Cases
def test_finops_cache_edge_cases() -> None:
    # Cosine similarity with empty vectors
    assert _cosine_similarity([], []) == 0.0
    assert _cosine_similarity([1.0], [1.0, 2.0]) == 0.0
    assert _cosine_similarity([0.0, 0.0], [0.0, 0.0]) == 0.0

    # Pseudo-embedding on empty string
    empty_vec = _pseudo_semantic_embedding("")
    assert len(empty_vec) == 64
    assert all(x == 0.0 for x in empty_vec)

    # Purge tenant
    cache = FinOpsCache(semantic_threshold=0.96)
    cache.put("prompt", "clause a", {"res": 1})
    cache.put("prompt", "clause b", {"res": 2})
    assert len(cache._l1_store) == 2
    purged_count = cache.purge_tenant("tenant_xyz")
    assert purged_count == 2
    assert len(cache._l1_store) == 0

    # L2 multiple items comparison loop branch (sim <= best_score)
    cache2 = FinOpsCache(semantic_threshold=0.90)
    cache2.put("prompt", "apples and oranges contract clause", {"key": "fruit"})
    cache2.put("prompt", "quantum mechanics supercomputer clause", {"key": "physics"})
    hit_fruit, tier = cache2.get("prompt", "apples and citrus contract clause")
    assert tier == "L2"
    assert hit_fruit["key"] == "fruit"


# 7. Security & Capability Token Claims
def test_security_capability_token_malformed_and_audience() -> None:
    # Corrupted JSON payload part
    bad_payload = "not_json.fake_sig"
    with pytest.raises(SecurityGovernanceError, match="Malformed|Corrupted|Invalid"):
        CapabilityToken.verify(bad_payload)

    # Token with invalid audience claim
    token = CapabilityToken(
        tenant_id="tenant_1",
        agent_id="agent_1",
        allowed_tools=["*"],
        expires_at=int(time.time()) + 3600,
        audience="agent://unauthorized_foreign_domain",
    )
    signed_bad_aud = token.sign()
    with pytest.raises(SecurityGovernanceError, match="Invalid capability token audience"):
        CapabilityToken.verify(signed_bad_aud)

    # Valid signature over malformed non-JSON payload
    import hashlib
    import hmac

    secret_bytes = settings.capability_secret_key.encode("utf-8")
    sig = hmac.new(secret_bytes, b"malformed_non_json_payload", hashlib.sha256).hexdigest()
    with pytest.raises(SecurityGovernanceError, match="Corrupted capability token payload"):
        CapabilityToken.verify(f"malformed_non_json_payload.{sig}")

    # sanitize_agent_input
    sanitized = sanitize_agent_input(" Contact at +1 555-555-0199 ")
    assert "[REDACTED_PHONE]" in sanitized


# 8. Symbolic Solver assert_valid_or_raise
def test_symbolic_verifier_assert_or_raise_branches() -> None:
    verifier = SymbolicVerifier()

    # Valid SAT plan returns itself
    sat_plan = ActionPlan(
        plan_id="sat_plan",
        intent="Valid commercial terms",
        proposed_action="Accept SLA",
        risk_category="Low",
        proposed_liability_cap_usd=500_000.0,
        proposed_notice_days=30,
        require_mutual_indemnity=True,
        forbid_consequential_waiver=True,
    )
    validated = verifier.assert_valid_or_raise(sat_plan)
    assert validated.is_satisfiable is True
    assert validated.status == "SAT"

    # Invalid UNSAT plan raises SymbolicConstraintError
    unsat_plan = sat_plan.model_copy(update={"proposed_liability_cap_usd": 50_000_000.0})
    with pytest.raises(SymbolicConstraintError):
        verifier.assert_valid_or_raise(unsat_plan)

    # Z3 UNKNOWN solver branch
    from unittest.mock import patch

    import z3

    with patch.object(z3.Solver, "check", return_value=z3.unknown):
        unk_res = verifier.verify_action_plan(sat_plan)
        assert unk_res.status == "UNKNOWN"
        assert unk_res.is_satisfiable is False


# 9. Main API Endpoints: DPDP Erasure, SLO Metrics, and Exception Handlers
def test_main_api_erasure_slo_and_exceptions() -> None:
    client = TestClient(app)

    # 1. DPDP Erasure
    erase_res = client.post(
        "/api/v1/privacy/erasure",
        json={"tenant_id": "tenant_dpdp", "user_id": "user_456", "reason": "DPDP Art 12 Request"},
    )
    assert erase_res.status_code == 200
    assert erase_res.json()["status"] == "DATA_ERASED"
    assert "audit_transaction_hash" in erase_res.json()

    # 2. SLO Metrics
    slo_res = client.get("/api/v1/metrics/slo")
    assert slo_res.status_code == 200
    assert slo_res.json()["status"] == "COMPLIANT"
    assert "targets" in slo_res.json()
    assert slo_res.json()["current_measurements"]["availability"] == "99.98%"

    # 3. Analyze Clause with Exception Scenarios
    # Deadlock detected mock
    def mock_deadlock(*args, **kwargs):
        raise DeadlockDetectedError("Mocked circular deadlock")

    from app.main import supervisor

    orig_pipeline = supervisor.run_neuro_symbolic_pipeline
    supervisor.run_neuro_symbolic_pipeline = mock_deadlock
    deadlock_res = client.post("/api/v2/analyze", json={"clause_text": "sample"})
    assert deadlock_res.status_code == 508
    assert "deadlock" in deadlock_res.json()["detail"].lower()

    # HITL escalation required mock
    def mock_hitl(*args, **kwargs):
        raise HITLEscalationRequiredError(
            message="Escalation required", resumption_token="res_token_123", state_id="state_123"
        )

    supervisor.run_neuro_symbolic_pipeline = mock_hitl
    hitl_res = client.post("/api/v2/analyze", json={"clause_text": "sample"})
    assert hitl_res.status_code == 200
    assert hitl_res.json()["status"] == "ESCALATED_TO_HITL"

    # Generic ClausaFractalError mock
    def mock_error(*args, **kwargs):
        raise ClausaFractalError("Generic domain error")

    supervisor.run_neuro_symbolic_pipeline = mock_error
    err_res = client.post("/api/v2/analyze", json={"clause_text": "sample"})
    assert err_res.status_code == 500

    # Restore original supervisor pipeline
    supervisor.run_neuro_symbolic_pipeline = orig_pipeline

    # 4. Header traceparent provided in telemetry middleware
    header_res = client.get(
        "/health",
        headers={"traceparent": "00-11223344556677889900112233445566-1122334455667788-01"},
    )
    assert (
        header_res.headers["traceparent"]
        == "00-11223344556677889900112233445566-1122334455667788-01"
    )

    # 5. use_cache = False branch in analyze_clause
    no_cache_res = client.post(
        "/api/v2/analyze",
        json={"clause_text": "Standard commercial agreement terms", "use_cache": False},
    )
    assert no_cache_res.status_code == 200
    assert no_cache_res.json().get("cached") is False
