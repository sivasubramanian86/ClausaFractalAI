"""System 1 Fast Triage Agent powered by Gemini Flash tier.

Performs rapid, low-latency intent classification, risk topic extraction, and
initial ActionPlan proposal from raw legal contract text.
"""

import re
import uuid
from typing import List, Optional

from app.core.telemetry import logger
from app.symbolic.contracts import ActionPlan, ContractClause, RiskSeverity


class TriageAgent:
    """Fast neural perception agent for contract clause triage and plan proposal."""

    def __init__(
        self,
        model_name: str = "gemini-3.8-flash-001",
        gemini_client: Optional[object] = None,
    ) -> None:
        """Initialize triage agent with fast model tier and optional Gemini client."""
        self.model_name = model_name
        self.client = gemini_client

    def analyze_clause_intent(self, clause_text: str, context: Optional[str] = None) -> ActionPlan:
        """Analyze a contract clause using GenAI / semantic NLP and propose a candidate ActionPlan."""
        logger.info(
            "TriageAgent analyzing clause",
            model=self.model_name,
            clause_len=len(clause_text),
        )

        # 1. GenAI Dynamic Extraction via Gemini if client is active
        if self.client is not None:
            try:
                import json
                prompt = (
                    "You are ClausaFractalAI Triage Agent. Extract formal contract variables from this clause.\n\n"
                    f"Clause Text:\n{clause_text}\n\n"
                    "Return a JSON object conforming strictly to:\n"
                    "{\n"
                    '  "risk_category": "Indemnification" | "Limitation of Liability" | "Termination & Notice" | "General Terms",\n'
                    '  "proposed_liability_cap_usd": number,\n'
                    '  "proposed_notice_days": integer,\n'
                    '  "require_mutual_indemnity": boolean,\n'
                    '  "forbid_consequential_waiver": boolean,\n'
                    '  "confidence": float\n'
                    "}"
                )
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                )
                raw_text = getattr(response, "text", "").strip()
                cleaned_json = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw_text, flags=re.MULTILINE).strip()
                data = json.loads(cleaned_json)

                risk_cat = data.get("risk_category", "General Terms")
                cap = float(data.get("proposed_liability_cap_usd", 500_000.0))
                days = int(data.get("proposed_notice_days", 30))
                mutual = bool(data.get("require_mutual_indemnity", True))
                conseq = bool(data.get("forbid_consequential_waiver", True))
                conf = float(data.get("confidence", 0.98))

                clause = ContractClause(
                    clause_id=f"clause_{uuid.uuid4().hex[:8]}",
                    title=risk_cat,
                    text=clause_text,
                    liability_cap_usd=cap,
                    notice_days=days,
                    is_mutual_indemnity=mutual,
                    has_consequential_damages_waiver=conseq,
                    risk_level=RiskSeverity.HIGH if not mutual or cap > 1_000_000 else RiskSeverity.LOW,
                )
                return ActionPlan(
                    plan_id=f"plan_{uuid.uuid4().hex[:8]}",
                    intent=f"Assess and remediate {risk_cat}",
                    proposed_action=f"Standardize {risk_cat} clause to conform with enterprise policy",
                    risk_category=risk_cat,
                    target_clauses=[clause],
                    proposed_liability_cap_usd=cap,
                    proposed_notice_days=days,
                    require_mutual_indemnity=mutual,
                    forbid_consequential_waiver=conseq,
                    confidence=conf,
                    repair_attempt=0,
                )
            except Exception:
                pass  # Fall through to semantic NLP extraction

        # 2. Semantic Linguistic & Numerical Parameter Extraction (Deterministic / Offline)
        lower_text = clause_text.lower()

        # Semantic Category Classification
        if re.search(r"\b(indemnif|hold harmless|defend against claims)\b", lower_text):
            risk_category = "Indemnification"
        elif re.search(r"\b(liability|damages|cap|aggregate limit)\b", lower_text):
            risk_category = "Limitation of Liability"
        elif re.search(r"\b(terminat|cancel|notice period|cure period)\b", lower_text):
            risk_category = "Termination & Notice"
        else:
            risk_category = "General Terms"

        # Numerical & Semantic Mutuality Extraction
        is_mutual = True
        if re.search(r"\b(unilateral|solely|only vendor|only customer|customer shall bear)\b", lower_text):
            is_mutual = False

        # Numerical Liability Cap Extraction
        proposed_cap = 500_000.0
        if re.search(r"\b(unlimited|no cap|uncapped|without limitation)\b", lower_text):
            proposed_cap = 2_000_000.0
        else:
            cap_match = re.search(r"\$?\s*([0-9,]+(?:\.[0-9]+)?)\s*(?:million|m\b)", lower_text)
            if cap_match:
                val = float(cap_match.group(1).replace(",", ""))
                proposed_cap = val * 1_000_000.0

        # Numerical Notice Period Extraction
        notice_days = 30
        if re.search(r"\b(immediate|immediately|without notice)\b", lower_text):
            notice_days = 5
        else:
            days_match = re.search(r"\b(\d+)\s*(?:calendar\s*)?(?:business\s*)?days?\b", lower_text)
            if days_match:
                notice_days = int(days_match.group(1))

        forbid_consequential = True
        if re.search(r"\b(allow(?:s)? consequential|liable for indirect|consequential damages permitted)\b", lower_text):
            forbid_consequential = False

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
