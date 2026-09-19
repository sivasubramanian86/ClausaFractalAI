"""Policy Collider Agent for ClausaFractalAI.

Compares two contracts or policy versions to generate a Practical Impact Matrix,
highlighting surrendered rights, liability escalations, and newly gained protections.
"""

import re
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class ImpactItem(BaseModel):
    """An individual clause shift detected between two document versions.

    Attributes:
        clause_topic: Domain or clause subject (e.g. 'Data Retention', 'Liability Cap').
        previous_term: Clause language or terms in Document A.
        new_term: Updated clause language or terms in Document B.
        impact_type: Category (RIGHTS_SURRENDERED, LIABILITY_INCREASE, BENEFIT_GAINED, NEUTRAL).
        plain_english_takeaway: Consumer-friendly explanation of real-world consequences.
        risk_level: Assessed risk level ('HIGH', 'MEDIUM', 'LOW').
    """

    clause_topic: str
    previous_term: str
    new_term: str
    impact_type: str
    plain_english_takeaway: str
    risk_level: str = "MEDIUM"


class PolicyCollisionReport(BaseModel):
    """Comprehensive comparison report across two contracts or policy drafts.

    Attributes:
        doc_a_id: Identifier of the baseline document (Version 1).
        doc_b_id: Identifier of the comparison document (Version 2).
        total_shifts_detected: Number of impactful changes identified.
        impact_matrix: List of granular ImpactItem shifts.
        overall_verdict: High-level strategic recommendation on the proposed changes.
    """

    doc_a_id: str
    doc_b_id: str
    total_shifts_detected: int
    impact_matrix: List[ImpactItem] = Field(default_factory=list)
    overall_verdict: str


class PolicyColliderAgent:
    """Detects and categorizes contractual evolution between policy versions."""

    TOPIC_EXTRACTORS: Dict[str, str] = {
        "Data Retention": r"(?:data retention|retain data|deletion period|destroy data)[^.;\n]*",
        "Liability Cap": (
            r"(?:liability cap|aggregate liability|limited to \$|maximum liability)[^.;\n]*"
        ),
        "Termination": r"(?:termination notice|terminate for convenience|notice period)[^.;\n]*",
        "Arbitration": r"(?:binding arbitration|dispute resolution|class action waiver)[^.;\n]*",
        "Indemnification": r"(?:indemnify and hold harmless|indemnification scope)[^.;\n]*",
    }

    def compare(
        self,
        doc_a_text: str,
        doc_b_text: str,
        doc_a_id: str = "doc_v1",
        doc_b_id: str = "doc_v2",
        mock_items: Optional[List[ImpactItem]] = None,
    ) -> PolicyCollisionReport:
        """Compare two document versions and construct the Practical Impact Matrix.

        Args:
            doc_a_text: Full text of baseline Document A.
            doc_b_text: Full text of updated Document B.
            doc_a_id: Baseline document identifier.
            doc_b_id: Comparison document identifier.
            mock_items: Optional deterministic impact matrix override for testing.

        Returns:
            PolicyCollisionReport with ImpactItems and overall verdict.
        """
        if mock_items is not None:
            return PolicyCollisionReport(
                doc_a_id=doc_a_id,
                doc_b_id=doc_b_id,
                total_shifts_detected=len(mock_items),
                impact_matrix=mock_items,
                overall_verdict="Manual evaluation provided for comparison.",
            )

        matrix: List[ImpactItem] = []
        text_a_lower = doc_a_text.lower() if doc_a_text else ""
        text_b_lower = doc_b_text.lower() if doc_b_text else ""

        for topic, pattern in self.TOPIC_EXTRACTORS.items():
            match_a = re.search(pattern, text_a_lower, re.IGNORECASE)
            match_b = re.search(pattern, text_b_lower, re.IGNORECASE)

            excerpt_a = match_a.group(0).strip() if match_a else "Not explicitly addressed"
            excerpt_b = match_b.group(0).strip() if match_b else "Not explicitly addressed"

            if excerpt_a != excerpt_b:
                impact_type = "NEUTRAL"
                risk_level = "LOW"
                takeaway = f"Clause language for {topic} has evolved between versions."

                if "indefinite" in excerpt_b or "waiver" in excerpt_b:
                    impact_type = "RIGHTS_SURRENDERED"
                    risk_level = "HIGH"
                    takeaway = (
                        f"The new terms for {topic} surrender key consumer protections "
                        "or impose mandatory waivers."
                    )
                elif "uncapped" in excerpt_b or "unlimited" in excerpt_b:
                    impact_type = "LIABILITY_INCREASE"
                    risk_level = "HIGH"
                    takeaway = f"Your legal liability exposure for {topic} has escalated."
                elif (
                    "not explicitly addressed" in excerpt_a.lower()
                    and excerpt_b != "Not explicitly addressed"
                ):
                    impact_type = "BENEFIT_GAINED"
                    risk_level = "LOW"
                    takeaway = f"New explicit clause coverage added for {topic}."

                matrix.append(
                    ImpactItem(
                        clause_topic=topic,
                        previous_term=excerpt_a,
                        new_term=excerpt_b,
                        impact_type=impact_type,
                        plain_english_takeaway=takeaway,
                        risk_level=risk_level,
                    )
                )

        surrendered_count = sum(1 for item in matrix if item.impact_type == "RIGHTS_SURRENDERED")
        if surrendered_count > 0:
            verdict = (
                f"CAUTION: Detected {surrendered_count} surrendered rights in the new version. "
                "Do not sign without legal counsel review."
            )
        elif matrix:
            verdict = (
                f"MODERATE EVOLUTION: Detected {len(matrix)} updated terms. "
                "Review shifts carefully."
            )
        else:
            verdict = "Identical or negligible contractual differences between both documents."

        return PolicyCollisionReport(
            doc_a_id=doc_a_id,
            doc_b_id=doc_b_id,
            total_shifts_detected=len(matrix),
            impact_matrix=matrix,
            overall_verdict=verdict,
        )
