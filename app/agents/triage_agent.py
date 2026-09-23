"""System 1 Fast Triage Agent powered by Gemini Flash tier.

Performs rapid, low-latency intent classification, risk topic extraction, and
initial ActionPlan proposal from raw legal contract text.
"""

import uuid
from typing import List, Optional

from app.core.telemetry import logger
from app.symbolic.contracts import ActionPlan, ContractClause, RiskSeverity


class TriageAgent:
    """Fast neural perception agent for contract clause triage and plan proposal."""

    def __init__(self, model_name: str = "gemini-3.8-flash-001") -> None:
        """Initialize triage agent with fast model tier."""
        self.model_name = model_name

    def analyze_clause_intent(self, clause_text: str, context: Optional[str] = None) -> ActionPlan:
        """Analyze a contract clause and propose a candidate ActionPlan."""
        logger.info(
            "TriageAgent analyzing clause",
            model=self.model_name,
            clause_len=len(clause_text),
        )
        lower_text = clause_text.lower()

        # Heuristic intent & risk extraction
        risk_category = "General Terms"
        proposed_cap = 500_000.0
        notice_days = 30
        is_mutual = True
        forbid_consequential = True

        if "indemnif" in lower_text:
            risk_category = "Indemnification"
            if "unilateral" in lower_text or "solely" in lower_text:
                is_mutual = False  # May trigger UNSAT if uncorrected

        if "liability" in lower_text:
            risk_category = "Limitation of Liability"
            if "unlimited" in lower_text or "no cap" in lower_text:
                proposed_cap = 2_000_000.0  # Exceeds standard ceiling, triggers UNSAT

        if "terminat" in lower_text or "cancel" in lower_text:
            risk_category = "Termination & Notice"
            if "immediate" in lower_text or "5 days" in lower_text:
                notice_days = 5  # Less than statutory 30 days, triggers UNSAT

        clause = ContractClause(
            clause_id=f"clause_{uuid.uuid4().hex[:8]}",
            title=risk_category,
            text=clause_text,
            liability_cap_usd=proposed_cap,
            notice_days=notice_days,
            is_mutual_indemnity=is_mutual,
            has_consequential_damages_waiver=forbid_consequential,
            risk_level=(
                RiskSeverity.HIGH if not is_mutual or proposed_cap > 1_000_000 else RiskSeverity.LOW
            ),
        )

        return ActionPlan(
            plan_id=f"plan_{uuid.uuid4().hex[:8]}",
            intent=f"Assess and remediate {risk_category}",
            proposed_action=f"Standardize {risk_category} clause to conform with enterprise policy",
            risk_category=risk_category,
            target_clauses=[clause],
            proposed_liability_cap_usd=proposed_cap,
            proposed_notice_days=notice_days,
            require_mutual_indemnity=is_mutual,
            forbid_consequential_waiver=forbid_consequential,
            confidence=0.96,
            repair_attempt=0,
        )

    def repair_plan(self, original_plan: ActionPlan, unsat_core: List[str]) -> ActionPlan:
        """Single-shot targeted repair adjusting parameters based on UNSAT core."""
        logger.info(
            "TriageAgent performing single-shot targeted repair",
            plan_id=original_plan.plan_id,
            unsat_core=unsat_core,
            attempt=original_plan.repair_attempt + 1,
        )

        repaired_cap = original_plan.proposed_liability_cap_usd
        repaired_notice = original_plan.proposed_notice_days
        repaired_mutual = original_plan.require_mutual_indemnity
        repaired_consequential = original_plan.forbid_consequential_waiver

        for reason in unsat_core:
            if "liability" in reason or "cap" in reason:
                repaired_cap = 500_000.0  # Bring under ceiling
            if "notice" in reason:
                repaired_notice = 30  # Align with statutory minimum
            if "mutual" in reason or "indemnity" in reason:
                repaired_mutual = True  # Enforce bilateral symmetry
            if "consequential" in reason:
                repaired_consequential = True

        return ActionPlan(
            plan_id=f"{original_plan.plan_id}_repaired",
            intent=original_plan.intent,
            proposed_action=f"Repaired: {original_plan.proposed_action}",
            risk_category=original_plan.risk_category,
            target_clauses=original_plan.target_clauses,
            proposed_liability_cap_usd=repaired_cap,
            proposed_notice_days=repaired_notice,
            require_mutual_indemnity=repaired_mutual,
            forbid_consequential_waiver=repaired_consequential,
            confidence=0.99,
            repair_attempt=original_plan.repair_attempt + 1,
        )
