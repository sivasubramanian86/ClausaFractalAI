"""Actionable Copilot Agent for ClausaFractalAI.

Generates tangible end-user deliverables:
1. Attorney Consultation Prep Sheet (structured questions, risk summary, and leverage points).
2. Favorable Counter-Clause Rewriter (balanced mutual redlines and negotiation tactics).
"""

import json
import re
from typing import List, Optional

from pydantic import BaseModel, Field

from agents.blindspot import BlindspotReport
from config import get_settings


class AttorneyQuestion(BaseModel):
    """Specific question tailored for the user to ask their legal counsel.

    Attributes:
        category: Risk domain (e.g. 'Liability', 'Indemnity', 'Termination').
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

    def __init__(self, gemini_client: Optional[object] = None) -> None:
        """Initialize ActionableCopilotAgent with optional Gemini client.

        Args:
            gemini_client: Optional google-genai Client instance for dynamic LLM generation.
        """
        self.settings = get_settings()
        self.client = gemini_client

    def generate_attorney_prep_sheet(
        self,
        document_id: str,
        document_text: Optional[str] = None,
        blindspot_report: Optional[BlindspotReport] = None,
        key_risks: Optional[List[str]] = None,
    ) -> AttorneyPrepSheet:
        """Generate a strategic preparation sheet for consulting an attorney.

        Args:
            document_id: Target document identifier.
            document_text: Optional full contract text for context-aware analysis.
            blindspot_report: Optional report from BlindspotDetectorAgent.
            key_risks: Optional list of identified vulnerabilities.

        Returns:
            AttorneyPrepSheet with prioritized questions and negotiation leverage points.
        """
        risks = list(key_risks or [])
        if blindspot_report and blindspot_report.omitted_findings:
            risks.extend(
                f"{f.severity}: {f.title} - {f.risk_description}"
                for f in blindspot_report.omitted_findings[:4]
            )

        if not risks:
            risks = [
                "Standard commercial provisions appear balanced; verify governing law jurisdiction."
            ]

        # 1. GenAI Dynamic Generation via Gemini if client is active
        if self.client is not None:
            try:
                context_summary = "\n".join(f"- {r}" for r in risks[:6])
                text_snippet = (document_text or "")[:1500]
                prompt = (
                    "You are ClausaFractalAI Action Copilot, an elite contract strategist.\n"
                    "Analyze identified contract risks and document excerpt to generate a tailored "
                    "Attorney Consultation Preparation Sheet.\n\n"
                    f"Document ID: {document_id}\n"
                    f"Key Identified Risks:\n{context_summary}\n\n"
                    f"Document Excerpt:\n{text_snippet}\n\n"
                    "Respond with a JSON object strictly conforming to this schema:\n"
                    "{\n"
                    '  "executive_summary": "overview string",\n'
                    '  "attorney_questions": [\n'
                    '    {"category": "Name", "question": "Question", "context_rationale": "Why"}\n'
                    "  ],\n"
                    '  "negotiation_leverage_points": ["point 1", "point 2", "point 3"]\n'
                    "}\n"
                    "Generate exactly 5 distinct, high-impact attorney questions across Liability, "
                    "Indemnity, Termination, IP/Data Rights, and Dispute Resolution."
                )

                response = self.client.models.generate_content(
                    model=self.settings.analyst_model,
                    contents=prompt,
                )
                raw_text = getattr(response, "text", "").strip()
                cleaned_json = re.sub(
                    r"^```(?:json)?\s*|\s*```$", "", raw_text, flags=re.MULTILINE
                ).strip()
                data = json.loads(cleaned_json)

                gen_questions = [
                    AttorneyQuestion(
                        category=q.get("category", "Contract Risk"),
                        question=q.get("question", ""),
                        context_rationale=q.get("context_rationale", ""),
                    )
                    for q in data.get("attorney_questions", [])
                ]
                return AttorneyPrepSheet(
                    document_id=document_id,
                    executive_summary=data.get(
                        "executive_summary",
                        f"Attorney Prep Sheet generated for Document '{document_id}' "
                        f"with {len(risks)} key focus areas.",
                    ),
                    critical_red_flags=risks,
                    attorney_questions=gen_questions[:5],
                    negotiation_leverage_points=data.get(
                        "negotiation_leverage_points",
                        [
                            "Propose a mutual 12-month fees liability cap as standard practice.",
                            "Insert a 30-day written notice and cure period before termination.",
                            "Condition indemnification on written notice and control of defense.",
                        ],
                    ),
                )
            except Exception:  # noqa: S110
                pass  # Fall through to dynamic contextual offline synthesis

        # 2. Dynamic Context-Aware Synthesis (Offline / Deterministic Fallback)
        risk_text = " ".join(risks).lower()
        has_liability = "liab" in risk_text or "cap" in risk_text or "damage" in risk_text
        has_indemnity = "indemn" in risk_text or "hold harmless" in risk_text
        has_termination = "terminat" in risk_text or "notice" in risk_text or "cure" in risk_text

        q_liability = AttorneyQuestion(
            category="Liability Allocation",
            question=(
                f"Given the identified risk of '{risks[0][:60]}', is liability mutual, "
                "and does the dollar cap adequately reflect potential contract value?"
                if has_liability
                else (
                    "Is the limitation of liability mutual, and does the dollar cap "
                    "adequately reflect potential contract value?"
                )
            ),
            context_rationale=(
                "One-sided caps or uncapped counterparty liability create severe, asymmetric "
                "financial exposure."
            ),
        )

        q_indemnity = AttorneyQuestion(
            category="Indemnification Scope",
            question=(
                "Are there carve-outs to the indemnification obligations for third-party "
                "intellectual property claims and consequential damages?"
                if has_indemnity
                else (
                    "Are there carve-outs to the indemnification obligations for "
                    "third-party intellectual property claims?"
                )
            ),
            context_rationale=(
                "Broad indemnities often obligate you to pay counterparty legal defense "
                "fees before guilt is determined."
            ),
        )

        q_termination = AttorneyQuestion(
            category="Termination Rights",
            question=(
                "Can either party terminate for convenience, and what is the exact cure "
                "period for non-material breaches under this agreement?"
                if has_termination
                else (
                    "Can either party terminate for convenience, and what is the exact cure "
                    "period for non-material breaches?"
                )
            ),
            context_rationale=(
                "Lacking a termination for convenience clause can lock you into long-term "
                "payments regardless of service quality."
            ),
        )

        q_ip = AttorneyQuestion(
            category="Data Rights & IP",
            question=(
                "Does this agreement grant any perpetual or irrevocable license to customer "
                "data or derived models?"
            ),
            context_rationale=(
                "Prevents silent forfeiture of proprietary company data or machine learning assets."
            ),
        )

        q_dispute = AttorneyQuestion(
            category="Dispute Resolution Venue",
            question=(
                "What is the governing jurisdiction, and does the contract require mandatory "
                "individual arbitration?"
            ),
            context_rationale=(
                "Unfavorable out-of-state venues dramatically increase litigation and "
                "arbitration costs."
            ),
        )

        questions = [q_liability, q_indemnity, q_termination, q_ip, q_dispute]

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
        user_role: str = "Client",
    ) -> CounterClauseProposal:
        """Propose a balanced, commercially reasonable counter-clause using GenAI.

        Args:
            clause_text: Original contract clause.
            clause_type: Domain category ('liability', 'indemnity', 'termination', 'ip').
            user_role: Persona role to protect ('Tenant', 'Freelancer', 'Client', 'Buyer').

        Returns:
            CounterClauseProposal containing redlined language and negotiation rationale.
        """
        # 1. GenAI Dynamic Counter-Proposal via Gemini
        if self.client is not None:
            try:
                prompt = (
                    "You are ClausaFractalAI Action Copilot, an expert contract attorney.\n"
                    f"Draft a balanced counter-clause proposal protecting {user_role}.\n\n"
                    f"Original One-Sided Clause:\n{clause_text}\n\n"
                    f"Clause Category: {clause_type}\n\n"
                    "Respond with a JSON object strictly conforming to this schema:\n"
                    "{\n"
                    '  "counter_clause": "balanced redlined language",\n'
                    '  "strategic_rationale": "legal justification for the modification",\n'
                    '  "negotiation_tip": "tactical phrasing to persuade the counterparty"\n'
                    "}"
                )

                response = self.client.models.generate_content(
                    model=self.settings.analyst_model,
                    contents=prompt,
                )
                raw_text = getattr(response, "text", "").strip()
                cleaned_json = re.sub(
                    r"^```(?:json)?\s*|\s*```$", "", raw_text, flags=re.MULTILINE
                ).strip()
                data = json.loads(cleaned_json)

                counter = data.get("counter_clause", "").strip()
                rationale = data.get("strategic_rationale", "").strip()
                tip = data.get("negotiation_tip", "").strip()

                return CounterClauseProposal(
                    original_clause=clause_text,
                    counter_clause=counter or clause_text,
                    strategic_rationale=rationale
                    or "Balanced mutual terms based on legal standards.",
                    negotiation_tip=tip
                    or "Propose mutual parity as standard procurement practice.",
                )
            except Exception:  # noqa: S110
                pass  # Fall through to dynamic deterministic synthesis

        # 2. Dynamic Semantic Parsing & Redlining (Offline / Deterministic Fallback)
        clean_type = clause_type.lower()
        original_clean = clause_text.strip()

        if "liab" in clean_type or "damage" in clean_type:
            counter = (
                "Neither party shall be liable for any indirect, incidental, or "
                "consequential damages. Each party's total cumulative liability under "
                "this Agreement shall not exceed the total fees paid or payable by Customer "
                "in the twelve (12) months preceding the claim."
            )
            rationale = (
                f"Redlines one-sided liability exposure from '{original_clean[:60]}...' by "
                "establishing a reciprocal mutual cap and excluding speculative damages."
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
                f"Balances unilateral indemnity in '{original_clean[:60]}...' by limiting "
                "obligations to third-party claims caused by fault and requiring prompt notice."
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
                f"Modifies rigid termination terms in '{original_clean[:60]}...' to guarantee "
                "bilateral flexibility to exit the contract with reasonable advance notice."
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
