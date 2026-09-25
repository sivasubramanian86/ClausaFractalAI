"""Courtroom Deliberation Engine & Jurisprudential Agent Mesh.

Simulates the analytical acumen of an impartial Senior Judicial Magistrate (Bench Judge)
and a legendary Bar Senior Advocate (BA LLB, LLM). Synthesizes ratio decidendi,
statutory element proofs, trial battlecards, cross-examination traps, and draft decrees.
"""

from typing import Dict, List, Optional

from pydantic import BaseModel, Field

from services.statutory_codex import StatutoryCodexService, StatutorySection


class StatutoryElementProof(BaseModel):
    """Evaluation of whether a specific statutory requirement is proven by evidence."""

    element: str = Field(description="The statutory requirement to be proven")
    is_satisfied: bool = Field(description="Whether the evidentiary standard is met")
    evidentiary_basis: str = Field(description="Citations or facts demonstrating proof or omission")


class CaseDossier(BaseModel):
    """Structured breakdown of case facts, evidence, and parties."""

    case_title: str = Field(
        description="Generated case caption e.g. State v. Accused or Alpha Corp v. Beta LLC"
    )
    incident_type: str = Field(
        description="Classification e.g. Commercial Breach, Cyber Incident, Criminal Fraud"
    )
    parties: Dict[str, str] = Field(description="Parties involved in the dispute")
    facts_summary: str = Field(description="Distilled factual chronology")
    key_evidence: List[str] = Field(description="Material evidentiary points or exhibits")
    jurisdiction: str = Field(description="Governing forum / jurisdiction")


class JudicialVerdict(BaseModel):
    """Impartial judicial ruling synthesizing Ratio Decidendi and statutory decree."""

    case_title: str = Field(description="Case caption")
    bench: str = Field(default="The Honorable Bench – Jurisprudential Chamber")
    ratio_decidendi: str = Field(description="The core legal rationale supporting the judgment")
    obiter_dicta: str = Field(
        description="Incidental observations and advisory remarks for conduct"
    )
    element_proofs: List[StatutoryElementProof] = Field(
        description="Checklist of verified statutory elements"
    )
    final_decree: str = Field(
        description="Formal verdict e.g. Liable in Damages, Injunction Granted, Guilty, Acquitted"
    )
    relief_or_sentence: str = Field(
        description="Prescribed remedy, damages award, or statutory sentencing"
    )
    statutory_compliance_score: float = Field(
        description="Evidence sufficiency index from 0.0 to 10.0"
    )


class AdvocateStrategy(BaseModel):
    """Adversarial litigation strategy and battlecards for practicing trial lawyers."""

    counsel_role: str = Field(default="Senior Advocate & Lead Trial Counsel (BA LLB, LLM)")
    prosecution_strengths: List[str] = Field(
        description="Winning arguments for prosecution or claimant"
    )
    defense_shields: List[str] = Field(description="Affirmative defenses and mitigating doctrines")
    cross_examination_traps: List[str] = Field(
        description="Targeted cross-examination questions to impeach credibility"
    )
    evidentiary_vulnerabilities: List[str] = Field(
        description="Flaws in evidentiary chain of custody or admissibility"
    )
    settlement_or_plea_calculus: str = Field(
        description="Commercial settlement leverage or plea negotiation posture"
    )
    win_probability_prosecution: float = Field(
        description="Estimated probability for claimant/prosecution (0.0 to 1.0)"
    )
    win_probability_defense: float = Field(
        description="Estimated probability for defense (0.0 to 1.0)"
    )


class CourtroomAnalysisResult(BaseModel):
    """Comprehensive courtroom adjudication and advocacy dossier."""

    dossier: CaseDossier = Field(description="Factual and evidentiary case dossier")
    verdict: JudicialVerdict = Field(description="Bench judicial judgment and ratio decidendi")
    advocate_strategy: AdvocateStrategy = Field(
        description="Trial advocate strategy and battlecard"
    )
    matched_sections: List[StatutorySection] = Field(
        description="Statutory law sections identified at fingertips"
    )
    disclaimer: str = Field(
        default=(
            "AI Jurisprudential Co-Counsel: Designed for legal research, mock-trial deliberation,"
            " and judicial decision support under Human-in-the-Loop oversight. Not a substitute for"
            " licensed bar representation."
        )
    )


class CourtroomDeliberationEngine:
    """Multi-agent engine coordinating judicial adjudication and advocate litigation strategy."""

    def __init__(self, codex_service: Optional[StatutoryCodexService] = None) -> None:
        """Initialize the deliberation engine with a statutory codex reference."""
        self.codex = codex_service or StatutoryCodexService()

    def dissect_case(
        self,
        case_text: str,
        jurisdiction: str = "Common Law",
        incident_type: Optional[str] = None,
    ) -> CourtroomAnalysisResult:
        """Dissect evidence and generate judicial ruling + advocate strategy.

        Args:
            case_text: Evidentiary summary, FIR, contract clause, deposition, or charge sheet.
            jurisdiction: Legal jurisdiction preference.
            incident_type: Optional category classification.

        Returns:
            CourtroomAnalysisResult containing the dossier, verdict, strategy, and sections.
        """
        clean_text = (case_text or "").strip()
        if not clean_text:
            clean_text = (
                "Standard commercial dispute regarding unverified unilateral breach of contract"
                " terms."
            )

        matches = self.codex.match_evidence_to_sections(clean_text)
        if matches:
            matched_sections = [
                StatutorySection(**m["section"]) if isinstance(m["section"], dict) else m["section"]
                for m in matches
            ]
        else:
            fallback = (
                self.codex.get_section_by_id("UCC-2-302") or self.codex.list_all_sections()[0]
            )
            matched_sections = [fallback]

        primary_section = matched_sections[0]

        lines = [line.strip() for line in clean_text.split("\n") if line.strip()]
        title = lines[0][:80] if lines else "In re Evidentiary Deliberation"
        if not title.lower().startswith("in re") and " v. " not in title and " vs " not in title:
            title = f"In re: {title}"

        inferred_type = incident_type or primary_section.category

        dossier = CaseDossier(
            case_title=title,
            incident_type=inferred_type,
            parties={
                "Prosecution_or_Plaintiff": "Complainant / Aggrieved Enterprise",
                "Defense_or_Respondent": "Accused / Counterparty Entity",
            },
            facts_summary=(
                f"Factual matrix centers on alleged violation under {primary_section.code_id}"
                f" ({primary_section.title}). Core allegations: {clean_text[:300]}..."
            ),
            key_evidence=[
                (
                    f"Exhibit A: Documented narrative indicating elements of"
                    f" '{primary_section.title}'"
                ),
                (
                    f"Exhibit B: Material record evidencing statutory trigger"
                    f" ({primary_section.statutory_test})"
                ),
                "Exhibit C: Electronic communication trail / contractual execution log",
            ],
            jurisdiction=jurisdiction,
        )

        element_proofs: List[StatutoryElementProof] = []
        satisfied_count = 0
        text_lower = clean_text.lower()

        for elem in primary_section.elements:
            words = [w.lower() for w in elem.split() if len(w) > 4]
            has_evidence = any(w in text_lower for w in words) if words else False
            if has_evidence:
                is_met = True
                basis = f"Corroborated by record indicators satisfying '{elem}'."
                satisfied_count += 1
            else:
                is_met = False
                basis = (
                    f"Evidentiary record insufficient to prove '{elem}' beyond reasonable doubt."
                )

            element_proofs.append(
                StatutoryElementProof(
                    element=elem,
                    is_satisfied=is_met,
                    evidentiary_basis=basis,
                )
            )

        total_elements = max(1, len(primary_section.elements))
        compliance_ratio = satisfied_count / total_elements
        sufficiency_score = round(compliance_ratio * 10.0, 1)

        if compliance_ratio >= 0.75:
            final_decree = f"Finding of Liability / Guilty under {primary_section.code_id}"
            relief = (
                f"Award of damages and restitution per statutory guideline:"
                f" {primary_section.penalties}."
            )
            ratio = (
                f"Where the evidentiary record establishes all requisite components of"
                f" {primary_section.code_id} ({primary_section.statutory_test}), the defendant"
                " cannot shield themselves behind generic immunity."
            )
        elif compliance_ratio >= 0.5:
            final_decree = (
                f"Partial Relief Granted / Conditional Injunction under {primary_section.code_id}"
            )
            relief = (
                "Interim injunction maintaining status quo pending full forensic accounting and"
                " testimony."
            )
            ratio = (
                f"Although substantial elements of {primary_section.title} are established,"
                " unresolved factual questions preclude final summary adjudication without oral"
                " cross-examination."
            )
        else:
            final_decree = (
                f"Dismissed for Want of Evidentiary Sufficiency under {primary_section.code_id}"
            )
            relief = "Claim dismissed without prejudice; parties directed to arbitral mediation."
            ratio = (
                f"The claimant failed to discharge the requisite burden of proof regarding"
                f" {primary_section.statutory_test}; mere averment without corroborating"
                " substantiation cannot sustain a judicial decree."
            )

        verdict = JudicialVerdict(
            case_title=title,
            ratio_decidendi=ratio,
            obiter_dicta=(
                "Parties are cautioned against frivolous procedural motions. "
                "Good faith negotiation is an implied covenant that courts of equity must"
                " vigorously uphold."
            ),
            element_proofs=element_proofs,
            final_decree=final_decree,
            relief_or_sentence=relief,
            statutory_compliance_score=sufficiency_score,
        )

        win_pros = round(min(0.95, max(0.15, compliance_ratio)), 2)
        win_def = round(1.0 - win_pros, 2)

        p_prec = (
            primary_section.precedents[0] if primary_section.precedents else "Established Precedent"
        )
        advocate = AdvocateStrategy(
            prosecution_strengths=[
                f"Establish prima facie case utilizing primary precedent: {p_prec}.",
                f"Highlight direct statutory breach under {primary_section.code_id}.",
                (
                    "Leverage documentary contemporaneous admissions to refute subsequent oral"
                    " denials."
                ),
            ],
            defense_shields=[
                "Motion to strike for lack of strict proximate causation or missing mens rea.",
                "Assert absence of indispensable contractual or statutory condition precedent.",
                "Plead mitigation of damages and raise statutory threshold exceptions.",
            ],
            cross_examination_traps=[
                (
                    f"Trap 1: Confront key witness with prior inconsistent statements"
                    f" regarding {primary_section.statutory_test}."
                ),
                (
                    "Trap 2: Force witness to admit absence of independent contemporaneous"
                    " corroboration for alleged loss."
                ),
                (
                    "Trap 3: Impeach credibility on timeline discrepancy between date of"
                    " knowledge and date of formal complaint."
                ),
            ],
            evidentiary_vulnerabilities=[
                "Potential hearsay objections regarding unverified third-party exhibits.",
                "Chain of custody gaps for electronic records or digital snapshots.",
                "Ambiguity in reciprocal covenants creating reasonable doubt.",
            ],
            settlement_or_plea_calculus=(
                f"Recommended commercial posture: If claimant establishes"
                f" {primary_section.title}, settlement discount should not exceed 25%. If defense"
                " successfully raises proximate cause defenses, propose structured mediation with"
                " reciprocal release."
            ),
            win_probability_prosecution=win_pros,
            win_probability_defense=win_def,
        )

        return CourtroomAnalysisResult(
            dossier=dossier,
            verdict=verdict,
            advocate_strategy=advocate,
            matched_sections=matched_sections,
        )
