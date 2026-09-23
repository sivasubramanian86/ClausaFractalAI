"""System 2 Symbolic Verification Engine powered by Z3 Theorem Prover.

Translates candidate legal ActionPlans into formal first-order logic and linear
arithmetic assertions. Proves satisfiability (SAT) or extracts minimal unsatisfiable
cores (UNSAT) for single-shot targeted neural repair.
"""

import z3

from app.core.exceptions import SymbolicConstraintError
from app.core.telemetry import logger
from app.symbolic.contracts import ActionPlan, VerificationResult


class SymbolicVerifier:
    """Formal mathematical verification engine for legal and operational invariants."""

    def __init__(
        self,
        max_permitted_liability_usd: float = 1_000_000.0,
        min_statutory_notice_days: int = 30,
        annual_contract_value_usd: float = 500_000.0,
    ) -> None:
        """Initialize formal verifier with enterprise policy thresholds."""
        self.max_permitted_liability_usd = max_permitted_liability_usd
        self.min_statutory_notice_days = min_statutory_notice_days
        self.annual_contract_value_usd = annual_contract_value_usd

    def verify_action_plan(self, plan: ActionPlan) -> VerificationResult:
        """Mathematically prove whether an ActionPlan satisfies policy theorems.

        Args:
            plan: The proposed ActionPlan from System 1 Neural Perception.

        Returns:
            VerificationResult with SAT/UNSAT status, unsat core, and diagnostics.
        """
        solver = z3.Solver()
        solver.set(unsat_core=True)

        # Declare Z3 symbolic variables
        liability_cap = z3.Real("liability_cap")
        notice_days = z3.Int("notice_days")
        is_mutual = z3.Bool("is_mutual")
        forbid_consequential = z3.Bool("forbid_consequential")

        # Encode Policy Theorems as tracked boolean propositions
        p_cap_positive = z3.Bool("theorem_cap_must_be_positive")
        p_cap_within_limit = z3.Bool("theorem_cap_under_maximum_ceiling")
        p_cap_vs_acv = z3.Bool("theorem_cap_reasonable_vs_acv")
        p_notice_adequate = z3.Bool("theorem_notice_exceeds_statutory_min")
        p_mutual_required = z3.Bool("theorem_indemnity_must_be_mutual")
        p_consequential_safe = z3.Bool("theorem_consequential_damages_bounded")

        # Attach formal assertions to tracked theorems
        # 1. Liability Cap must be strictly positive and bounded
        solver.assert_and_track(liability_cap > 0, p_cap_positive)
        solver.assert_and_track(
            liability_cap <= self.max_permitted_liability_usd, p_cap_within_limit
        )
        solver.assert_and_track(liability_cap <= 2 * self.annual_contract_value_usd, p_cap_vs_acv)

        # 2. Termination Notice must be >= statutory minimum
        solver.assert_and_track(notice_days >= self.min_statutory_notice_days, p_notice_adequate)

        # 3. Indemnity Symmetry
        solver.assert_and_track(is_mutual == True, p_mutual_required)  # noqa: E712

        # 4. Consequential Damages Waiver
        solver.assert_and_track(forbid_consequential == True, p_consequential_safe)  # noqa: E712

        # Now bind proposed plan values into the solver
        proposed_cap_val = (
            plan.proposed_liability_cap_usd if plan.proposed_liability_cap_usd is not None else 0.0
        )
        proposed_notice_val = (
            plan.proposed_notice_days if plan.proposed_notice_days is not None else 0
        )

        b_plan_cap = z3.Bool("plan_assert_liability_cap")
        b_plan_notice = z3.Bool("plan_assert_notice_days")
        b_plan_mutual = z3.Bool("plan_assert_mutual_indemnity")
        b_plan_consequential = z3.Bool("plan_assert_forbid_consequential")

        solver.assert_and_track(liability_cap == proposed_cap_val, b_plan_cap)
        solver.assert_and_track(notice_days == proposed_notice_val, b_plan_notice)
        solver.assert_and_track(is_mutual == plan.require_mutual_indemnity, b_plan_mutual)
        solver.assert_and_track(
            forbid_consequential == plan.forbid_consequential_waiver,
            b_plan_consequential,
        )

        # Check satisfiability
        check_status = solver.check()

        if check_status == z3.sat:
            model = solver.model()
            assignments = {str(d): str(model[d]) for d in model.decls()}
            logger.info(
                "System 2 Symbolic Verification SAT",
                plan_id=plan.plan_id,
                assignments=assignments,
            )
            return VerificationResult(
                is_satisfiable=True,
                status="SAT",
                unsat_core=[],
                model_assignments=assignments,
                diagnostics="All legal and mathematical constraints proven SAT.",
            )

        if check_status == z3.unsat:
            unsat_core = [str(expr) for expr in solver.unsat_core()]
            diagnostics = (
                f"ActionPlan '{plan.plan_id}' violated {len(unsat_core)} formal constraints: "
                + ", ".join(unsat_core)
            )
            logger.warning(
                "System 2 Symbolic Verification UNSAT",
                plan_id=plan.plan_id,
                unsat_core=unsat_core,
            )
            return VerificationResult(
                is_satisfiable=False,
                status="UNSAT",
                unsat_core=unsat_core,
                model_assignments={},
                diagnostics=diagnostics,
            )

        return VerificationResult(
            is_satisfiable=False,
            status="UNKNOWN",
            unsat_core=[],
            model_assignments={},
            diagnostics="Z3 solver timed out or returned UNKNOWN.",
        )

    def assert_valid_or_raise(self, plan: ActionPlan) -> VerificationResult:
        """Verify plan and raise SymbolicConstraintError on UNSAT."""
        res = self.verify_action_plan(plan)
        if not res.is_satisfiable:
            raise SymbolicConstraintError(
                message=res.diagnostics,
                unsat_core=res.unsat_core,
                violated_clauses=[c.clause_id for c in plan.target_clauses],
            )
        return res
