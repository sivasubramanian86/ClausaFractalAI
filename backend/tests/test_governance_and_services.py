"""Tests for governance, BigQuery analytics, Firestore, and Refusal Ladder."""

import pytest
from httpx import ASGITransport, AsyncClient

from governance.auth import verify_legal_token
from main import app
from services.bigquery_service import BigQueryAnalyticsService, TelemetryEvent
from services.firestore_service import FirestoreService
from services.knowledge_graph import AgenticKnowledgeGraph


@pytest.mark.asyncio
async def test_auth_verify_tokens() -> None:
    """Test verification of authorization tokens and dev fallbacks."""
    # Test dev default fallback
    identity = await verify_legal_token(None)
    assert identity.role == "counsel"
    assert identity.is_authenticated is True

    # Test mock role switcher
    counsel = await verify_legal_token("Bearer mock-counsel")
    assert counsel.role == "counsel"
    assert counsel.organization == "Global Legal Team"

    arbitrator = await verify_legal_token("Bearer mock-arbitrator")
    assert arbitrator.role == "arbitrator"

    auditor = await verify_legal_token("Bearer mock-auditor")
    assert auditor.role == "auditor"

    founder = await verify_legal_token("Bearer mock-founder")
    assert founder.role == "founder"

    # Test generic token
    custom = await verify_legal_token("Bearer token_abc123456789")
    assert custom.user_id.startswith("firebase_")

    audit_dict = identity.to_audit_dict()
    assert audit_dict["role"] == "counsel"


@pytest.mark.asyncio
async def test_firestore_service() -> None:
    """Test Cloud Firestore audit logging and prep sheet persistence."""
    svc = FirestoreService()
    log_id = await svc.record_audit_event(
        user_id="usr_01",
        user_role="counsel",
        action_type="QUERY_EXECUTION",
        document_id="doc_123",
        details={"query": "test query"},
    )
    assert log_id.startswith("audit_")

    logs = await svc.get_audit_trail(document_id="doc_123")
    assert len(logs) >= 1
    assert logs[0]["document_id"] == "doc_123"

    # Test prep sheet storage
    await svc.save_prep_sheet("sheet_99", {"notes": "Executive brief"})
    sheet = await svc.get_prep_sheet("sheet_99")
    assert sheet is not None
    assert sheet["payload"]["notes"] == "Executive brief"


@pytest.mark.asyncio
async def test_bigquery_analytics_service() -> None:
    """Test BigQuery telemetry insertion and cost calculations."""
    bq = BigQueryAnalyticsService()
    evt = TelemetryEvent(
        event_id="evt_test_99",
        document_id="doc_test",
        intent="LEGAL_QA",
        complexity_level="STANDARD",
        latency_ms=250.0,
        cached_tokens=35000,
        prompt_tokens=40000,
        completion_tokens=200,
    )
    success = await bq.log_telemetry_event(evt)
    assert success is True

    metrics = await bq.get_cost_and_latency_metrics()
    assert metrics["total_queries"] >= 1
    assert metrics["total_cached_tokens"] > 0
    assert metrics["cost_saved_usd"] > 0.0

    risks = await bq.get_clause_risk_breakdown()
    assert len(risks) >= 3


def test_agentic_knowledge_graph() -> None:
    """Test hierarchical document parsing and Refusal Ladder predicates."""
    kg = AgenticKnowledgeGraph()
    text = (
        "MASTER SERVICES AGREEMENT\n\n"
        "Section 1. Term and Termination\n"
        "This Agreement commences on Effective Date.\n\n"
        "Section 4. Limitation of Liability\n"
        "Vendor liability shall be limited to damages and capped at fees.\n"
        "Customer agrees to indemnify third party claims.\n"
    )
    edges = kg.parse_document_structure("doc_01", text)
    assert edges >= 2
    assert "doc:doc_01" in kg.nodes

    # Test valid grounded query
    res_valid = kg.evaluate_refusal_ladder("What is the limitation of liability?")
    assert res_valid.should_refuse is False

    # Test negative constraint query triggering Refusal Ladder
    nuclear_query = "What is the penalty for nuclear radiation or fallout?"
    res_refusal = kg.evaluate_refusal_ladder(nuclear_query)
    assert res_refusal.should_refuse is True
    assert "strictly outside contract scope" in (res_refusal.refusal_reason or "")

    # Test empty / stop words only query
    res_stop = kg.evaluate_refusal_ladder("what is the in a")
    assert res_stop.should_refuse is True

    # Test unknown meaningful tokens triggering graph refusal
    res_unknown = kg.evaluate_refusal_ladder("quantum entanglement teleportation blockchain")
    assert res_unknown.should_refuse is True

    # Test re-adding node and edge to hit all branches
    node = kg.nodes["doc:doc_01"]
    kg.add_node(node)
    kg.add_edge("doc:doc_01", "sec:doc_01:1", "CONTAINS")
    kg.add_edge("brand_new_src", "brand_new_tgt", "CUSTOM_REL")

    # Test repeated mechanism to trigger concept already in nodes
    indemnity_snippet = "Customer agrees to indemnify third party claims."
    kg._extract_clause_mechanisms("sec:doc_01:1", indemnity_snippet)


@pytest.mark.asyncio
async def test_orchestrator_refusal_ladder() -> None:
    """Test that LegalOrchestrator refuses ungrounded negative constraint queries."""
    from agents.orchestrator import LegalOrchestrator

    orchestrator = LegalOrchestrator()
    res = orchestrator.process_query("What is the nuclear penalty?")
    assert res.answer == "I cannot determine this based on the provided document."


@pytest.mark.asyncio
async def test_auth_enforced_mode(monkeypatch: pytest.MonkeyPatch) -> None:
    """Test 401 unauthorized error when auth is enforced and header is missing."""
    from fastapi import HTTPException

    import governance.auth as auth_mod
    from config import Settings

    monkeypatch.setattr(auth_mod, "get_settings", lambda: Settings(auth_enforced=True))
    with pytest.raises(HTTPException) as exc_info:
        await auth_mod.verify_legal_token(None)
    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_bigquery_empty_metrics() -> None:
    """Test BigQuery metrics calculation when no telemetry events exist."""
    bq = BigQueryAnalyticsService()
    bq._memory_telemetry = []
    metrics = await bq.get_cost_and_latency_metrics()
    assert metrics["total_queries"] == 0
    assert metrics["cost_saved_usd"] == 0.0


@pytest.mark.asyncio
async def test_new_api_routes() -> None:
    """Test analytics and governance endpoints."""

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Analytics metrics
        res_m = await client.get("/api/analytics/metrics")
        assert res_m.status_code == 200
        assert "total_cached_tokens" in res_m.json()

        # Analytics risks
        res_r = await client.get("/api/analytics/risks")
        assert res_r.status_code == 200
        assert len(res_r.json()) > 0

        # Governance audit trail
        res_a = await client.get("/api/governance/audit-trail")
        assert res_a.status_code == 200

        # Governance VPC status
        res_v = await client.get("/api/governance/vpc-status")
        assert res_v.status_code == 200
        assert res_v.json()["status"] == "ENFORCED"
