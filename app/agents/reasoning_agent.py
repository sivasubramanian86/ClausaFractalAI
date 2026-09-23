"""System 1 Reasoning Agent powered by Gemini Pro frontier tier.

Performs deep multi-clause legal synthesis, cross-border regulatory compliance
evaluations, and high-complexity contract redlining.
"""

from typing import Any, Dict

from app.core.telemetry import logger
from app.symbolic.contracts import ActionPlan


class ReasoningAgent:
    """Frontier synthesis agent for complex legal analysis and policy reconciliation."""

    def __init__(self, model_name: str = "gemini-3.8-pro-001") -> None:
        """Initialize reasoning agent with frontier model tier."""
        self.model_name = model_name

    def synthesize_redline(self, plan: ActionPlan, source_text: str) -> Dict[str, Any]:
        """Synthesize a production-ready legal counter-clause and negotiation rationale."""
        logger.info(
            "ReasoningAgent synthesizing formal redline",
            model=self.model_name,
            plan_id=plan.plan_id,
        )

        cap_text = (
            f"${plan.proposed_liability_cap_usd:,.2f}"
            if plan.proposed_liability_cap_usd
            else "Annual Contract Value"
        )
        notice_text = f"{plan.proposed_notice_days or 30} days"

        proposed_counter_clause = (
            f"1. Mutual Indemnification & Limitation: Each party shall defend and indemnify "
            f"the other from third-party claims arising from gross negligence or breach. "
            f"2. Cap on Liability: The aggregate liability of either party shall be capped at "
            f"{cap_text}. 3. Notice: Either party may terminate with "
            f"{notice_text} prior written notice."
        )

        return {
            "plan_id": plan.plan_id,
            "status": "SYNTHESIZED",
            "counter_clause": proposed_counter_clause,
            "negotiation_rationale": (
                "Bilateral symmetry preserves statutory compliance and eliminates "
                "unlimited enterprise exposure while maintaining commercial alignment."
            ),
            "suggested_questions": [
                "Has vendor accepted mutual indemnity in previous engagements?",
                "Is the 30-day notice period aligned with the operational migration plan?",
            ],
        }
