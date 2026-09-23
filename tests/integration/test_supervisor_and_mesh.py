"""Integration tests for Master Supervisor Agent and Deadlock Watchdog."""

import pytest

from app.agents.supervisor import AgentSupervisor
from app.core.exceptions import DeadlockDetectedError, HITLEscalationRequiredError
from app.symbolic.contracts import ActionPlan
from app.symbolic.solver import SymbolicVerifier


def test_supervisor_pipeline_success() -> None:
    """Verify end-to-end execution of neuro-symbolic pipeline."""
    supervisor = AgentSupervisor()
    clause_text = "Vendor warrants the software shall perform in accordance with SLA."
    output = supervisor.run_neuro_symbolic_pipeline(clause_text)

    assert output["status"] == "PROVEN_AND_SYNTHESIZED"
    assert output["verification"]["is_satisfiable"] is True
    assert output["verification"]["status"] == "SAT"
    assert "counter_clause" in output["synthesis"]
    assert output["delegation_depth"] == 3  # Supervisor -> TriageAgent -> ReasoningAgent


def test_supervisor_watchdog_detects_circular_delegation() -> None:
    """Verify that circular agent delegation raises DeadlockDetectedError."""
    supervisor = AgentSupervisor()
    clause_text = "Customer agrees to unilateral indemnification."

    with pytest.raises(DeadlockDetectedError) as exc_info:
        # Simulate circular call where TriageAgent already in stack
        supervisor.run_neuro_symbolic_pipeline(
            clause_text=clause_text,
            delegation_stack=["Supervisor", "TriageAgent"],
        )

    assert "Circular agent delegation detected" in exc_info.value.message
    assert "TriageAgent" in exc_info.value.call_stack


def test_supervisor_watchdog_detects_max_hops_exceeded() -> None:
    """Verify that exceeding 5 hops triggers DeadlockDetectedError."""
    supervisor = AgentSupervisor(max_hops=3)
    clause_text = "Standard terms."

    with pytest.raises(DeadlockDetectedError) as exc_info:
        supervisor.run_neuro_symbolic_pipeline(
            clause_text=clause_text,
            delegation_stack=["Hop1", "Hop2", "Hop3"],
        )

    assert "exceeded maximum depth" in exc_info.value.message


def test_supervisor_single_shot_repair_loop() -> None:
    """Verify that an initial UNSAT plan is repaired by the targeted repair loop."""
    supervisor = AgentSupervisor()
    # "unilateral" text triggers initial is_mutual=False, which is UNSAT, then repaired to True!
    clause_text = "Customer agrees to sole and unilateral indemnification without cap."
    output = supervisor.run_neuro_symbolic_pipeline(clause_text)

    assert output["status"] == "PROVEN_AND_SYNTHESIZED"
    assert output["verification"]["is_satisfiable"] is True
    # The repaired plan should have required mutual indemnity
    assert output["plan"]["require_mutual_indemnity"] is True


def test_supervisor_hitl_escalation_on_exhaustion(monkeypatch: pytest.MonkeyPatch) -> None:
    """Verify that when repair cannot satisfy constraints, HITL checkpoint is created."""
    supervisor = AgentSupervisor()

    # Mock symbolic verifier to always return UNSAT
    class AlwaysUnsatVerifier(SymbolicVerifier):
        """Mock symbolic verifier designed to simulate permanent constraint unsatisfiability."""

        def verify_action_plan(self, plan: ActionPlan) -> VerificationResult:
            """Return deterministic UNSAT result with a synthetic impossible theorem."""
            res = super().verify_action_plan(plan)
            return res.model_copy(
                update={
                    "is_satisfiable": False,
                    "status": "UNSAT",
                    "unsat_core": ["theorem_impossible"],
                }
            )

    supervisor.symbolic_verifier = AlwaysUnsatVerifier()

    with pytest.raises(HITLEscalationRequiredError) as exc_info:
        supervisor.run_neuro_symbolic_pipeline("Impossible clause")

    assert "Checkpointed for Human-in-the-Loop" in exc_info.value.message
    assert exc_info.value.resumption_token in supervisor.hitl_checkpoints
