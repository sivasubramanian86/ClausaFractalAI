"""Actionable Copilot Agent for ClausaFractalAI.

Generates tangible end-user deliverables:
1. Attorney Consultation Prep Sheet (structured questions, risk summary, and leverage points).
2. Favorable Counter-Clause Rewriter (balanced mutual redlines and negotiation tactics).
"""

from typing import List, Optional

from pydantic import BaseModel, Field

from agents.blindspot import BlindspotReport


class AttorneyQuestion(BaseModel):
    """Specific question tailored for the user to ask their legal counsel.

    Attributes:
        category: Risk domain (e.g. 'Liability Cap', 'Indemnification', 'Termination').
        question: Precise question phrasing for the attorney consultation.
        context_rationale: Why this question matters and the underlying legal risk.
    """

    category: str
    question: str
    context_rationale: str


class AttorneyPrepSheet(BaseModel):
    """Deliverable sheet prepared for an attorney consultation.

    Attributes:
        document_id: Identifier of the document under consultation.
        executive_summary: High-level overview of the agreement's balance of power.
        critical_red_flags: List of highest-severity risks identified in the agreement.
        attorney_questions: 5 prioritized questions to ask legal counsel.
        negotiation_leverage_points: Tactical advice on pushbacks to propose.
    """

    document_id: str
    executive_summary: str
    critical_red_flags: List[str] = Field(default_factory=list)
    attorney_questions: List[AttorneyQuestion] = Field(default_factory=list)
    negotiation_leverage_points: List[str] = Field(default_factory=list)


class CounterClauseProposal(BaseModel):
    """Favorable counter-clause revision to negotiate a balanced contract.

    Attributes:
        original_clause: Original one-sided or aggressive clause language.
        counter_clause: Favorable, commercially reasonable redline language.
        strategic_rationale: Legal justification for the proposed replacement.
        negotiation_tip: Tactical phrasing to present this counter-offer to the counterparty.
    """

    original_clause: str
    counter_clause: str
    strategic_rationale: str
    negotiation_tip: str


class ActionableCopilotAgent:
    """Produces actionable real-world deliverables for contract negotiation and legal prep."""

    def generate_attorney_prep_sheet(
        self,
        document_id: str,
        blindspot_report: Optional[BlindspotReport] = None,
        key_risks: Optional[List[str]] = None,
    ) -> AttorneyPrepSheet:
        """Generate a strategic preparation sheet for consulting an attorney.

        Args:
            document_id: Target document identifier.
            blindspot_report: Optional report from BlindspotDetectorAgent.
            key_risks: Optional list of identified vulnerabilities.

        Returns:
            AttorneyPrepSheet with prioritized questions and negotiation leverage points.
        """
        risks = key_risks or []
        if blindspot_report and blindspot_report.omitted_findings:
            risks.extend(
                f"{f.severity}: {f.title} - {f.risk_description}"
                for f in blindspot_report.omitted_findings[:4]
            )

        if not risks:
            risks = [
                "Standard commercial provisions appear balanced; verify governing law jurisdiction."
            ]

        questions = [
            AttorneyQuestion(
                category="Liability Allocation",
                question=(
                    "Is the limitation of liability mutual, and does the dollar cap adequately "
                    "reflect potential contract value?"
                ),
                context_rationale=(
                    "One-sided caps or uncapped counterparty liability can create catastrophic "
                    "financial exposure."
                ),
            ),
            AttorneyQuestion(
                category="Indemnification Scope",
                question=(
                    "Are there carve-outs to the indemnification obligations for third-party "
                    "intellectual property claims?"
                ),
                context_rationale=(
                    "Broad indemnities often obligate you to pay counterparty legal defense "
                    "fees before guilt is determined."
                ),
            ),
            AttorneyQuestion(
                category="Termination Rights",
                question=(
                    "Can either party terminate for convenience, and what is the exact cure "
                    "period for non-material breaches?"
                ),
                context_rationale=(
                    "Lacking a termination for convenience clause can lock you into long-term "
                    "payments regardless of service quality."
                ),
            ),
            AttorneyQuestion(
                category="Data Rights & IP",
                question=(
                    "Does this agreement grant any perpetual or irrevocable license to customer "
                    "data or derived models?"
                ),
                context_rationale=(
                    "Prevents silent forfeiture of proprietary company data or machine learning "
                    "assets."
                ),
            ),
            AttorneyQuestion(
                category="Dispute Resolution Venue",
                question=(
                    "What is the governing jurisdiction, and does the contract require mandatory "
                    "individual arbitration?"
                ),
                context_rationale=(
                    "Unfavorable out-of-state venues dramatically increase litigation and "
                    "arbitration costs."
                ),
            ),
        ]

        leverage = [
            "Propose a mutual 12-month fees liability cap as standard enterprise practice.",
            "Insert a 30-day written notice and cure period before any termination for default.",
            (
                "Condition any indemnification obligation on immediate written notice and sole "
                "control of defense."
            ),
        ]

        summary = (
            f"Attorney Prep Sheet generated for Document '{document_id}'. "
            f"Detected {len(risks)} key areas of focus across liability, indemnity, "
            f"and termination."
        )

        return AttorneyPrepSheet(
            document_id=document_id,
            executive_summary=summary,
            critical_red_flags=risks,
            attorney_questions=questions,
            negotiation_leverage_points=leverage,
        )

    def rewrite_clause(
        self,
        clause_text: str,
        clause_type: str = "liability",
    ) -> CounterClauseProposal:
        """Propose a balanced, commercially reasonable counter-clause.

        Args:
            clause_text: Original contract clause.
            clause_type: Domain category ('liability', 'indemnity', 'termination', 'ip').

        Returns:
            CounterClauseProposal containing redlined language and negotiation rationale.
        """
        clean_type = clause_type.lower()
        if "liab" in clean_type:
            counter = (
                "Neither party shall be liable for any indirect, incidental, or "
                "consequential damages. Each party's total cumulative liability under "
                "this Agreement shall not exceed the total fees paid or payable by Customer "
                "in the twelve (12) months preceding the claim."
            )
            rationale = (
                "Establishes a reciprocal mutual cap and excludes speculative "
                "consequential damages."
            )
            tip = (
                "Tell counterparty: 'Our standard procurement policy requires reciprocal "
                "limitation of liability tied to trailing 12-month contract fees.'"
            )
        elif "indemn" in clean_type:
            counter = (
                "Each party ('Indemnifying Party') agrees to defend and indemnify the other "
                "against third-party claims arising solely from the Indemnifying Party's gross "
                "negligence, willful misconduct, or direct infringement of valid intellectual "
                "property rights, provided the indemnified party gives prompt written notice "
                "of any claim."
            )
            rationale = (
                "Limits indemnification to third-party claims caused by fault, requiring "
                "prompt notice."
            )
            tip = (
                "Propose: 'We provide mutual indemnity for our own gross negligence and "
                "IP infringement, provided reciprocal protections apply.'"
            )
        else:
            counter = (
                "Either party may terminate this Agreement for convenience upon thirty (30) "
                "days' prior written notice to the other party, without penalty or "
                "continuing liability."
            )
            rationale = (
                "Guarantees bilateral flexibility to exit the contract with reasonable "
                "advance notice."
            )
            tip = (
                "Suggest: 'Both organizations benefit from a standard 30-day exit window if "
                "commercial needs change.'"
            )

        return CounterClauseProposal(
            original_clause=clause_text,
            counter_clause=counter,
            strategic_rationale=rationale,
            negotiation_tip=tip,
        )
