"""Hermetic unit tests for System 2 Symbolic Verification Engine (Z3)."""

import pytest

from app.core.exceptions import SymbolicConstraintError
from app.symbolic.contracts import ActionPlan
from app.symbolic.solver import SymbolicVerifier


def test_symbolic_verifier_sat_happy_path() -> None:
    """Verify that an ActionPlan satisfying all policy theorems yields SAT."""
    verifier = SymbolicVerifier(
        max_permitted_liability_usd=1_000_000.0,
        min_statutory_notice_days=30,
        annual_contract_value_usd=500_000.0,
    )
    plan = ActionPlan(
        plan_id="plan_valid_001",
        intent="Review SaaS Agreement",
        proposed_action="Standardize liability and notice terms",
        risk_category="Limitation of Liability",
        proposed_liability_cap_usd=250_000.0,
        proposed_notice_days=60,
        require_mutual_indemnity=True,
        forbid_consequential_waiver=True,
    )

    result = verifier.verify_action_plan(plan)
    assert result.is_satisfiable is True
    assert result.status == "SAT"
    assert len(result.unsat_core) == 0
    assert "theorem_cap_must_be_positive" in result.model_assignments


def test_symbolic_verifier_unsat_liability_cap_exceeded() -> None:
    """Verify that a plan proposing a $5M liability cap on a $1M ceiling yields UNSAT."""
    verifier = SymbolicVerifier(max_permitted_liability_usd=1_000_000.0)
    plan = ActionPlan(
        plan_id="plan_invalid_cap",
        intent="Uncapped enterprise liability",
        proposed_action="Accept vendor unlimited indemnification",
        risk_category="Limitation of Liability",
        proposed_liability_cap_usd=5_000_000.0,
        proposed_notice_days=30,
        require_mutual_indemnity=True,
        forbid_consequential_waiver=True,
    )

    result = verifier.verify_action_plan(plan)
    assert result.is_satisfiable is False
    assert result.status == "UNSAT"
    assert any("cap" in core.lower() for core in result.unsat_core)


def test_symbolic_verifier_unsat_insufficient_notice_days() -> None:
    """Verify that a 5-day termination notice yields UNSAT against a 30-day requirement."""
    verifier = SymbolicVerifier(min_statutory_notice_days=30)
    plan = ActionPlan(
        plan_id="plan_invalid_notice",
        intent="Immediate termination",
        proposed_action="Shorten notice period to 5 days",
        risk_category="Termination",
        proposed_liability_cap_usd=100_000.0,
        proposed_notice_days=5,
        require_mutual_indemnity=True,
        forbid_consequential_waiver=True,
    )

    result = verifier.verify_action_plan(plan)
    assert result.is_satisfiable is False
    assert result.status == "UNSAT"
    assert any("notice" in core.lower() for core in result.unsat_core)


def test_symbolic_verifier_unsat_unilateral_indemnity() -> None:
    """Verify that asymmetric unilateral indemnity yields UNSAT."""
    verifier = SymbolicVerifier()
    plan = ActionPlan(
        plan_id="plan_unilateral_indemnity",
        intent="Vendor indemnity demand",
        proposed_action="Accept unilateral customer indemnification",
        risk_category="Indemnification",
        proposed_liability_cap_usd=200_000.0,
        proposed_notice_days=30,
        require_mutual_indemnity=False,
        forbid_consequential_waiver=True,
    )

    result = verifier.verify_action_plan(plan)
    assert result.is_satisfiable is False
    assert result.status == "UNSAT"
    assert any(
        "mutual" in core.lower() or "indemnity" in core.lower() for core in result.unsat_core
    )


def test_symbolic_verifier_assert_valid_or_raise() -> None:
    """Verify that assert_valid_or_raise raises SymbolicConstraintError on UNSAT."""
    verifier = SymbolicVerifier()
    plan = ActionPlan(
        plan_id="plan_raise",
        intent="Test exception",
        proposed_action="Test",
        risk_category="Test",
        proposed_liability_cap_usd=-100.0,  # Negative cap
        proposed_notice_days=10,
        require_mutual_indemnity=False,
    )

    with pytest.raises(SymbolicConstraintError) as exc_info:
        verifier.assert_valid_or_raise(plan)

    assert "violated" in exc_info.value.message
    assert len(exc_info.value.unsat_core) > 0
