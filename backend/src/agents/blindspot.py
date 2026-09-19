"""Blindspot Detector Agent for ClausaFractalAI.

Audits uploaded contracts against baseline enterprise templates (Mutual NDA, SaaS SLA,
Employment Agreement) to uncover omitted protective terms, uncapped risks, and silent exposures.
"""

from typing import Dict, List

from pydantic import BaseModel, Field

from config import BASELINE_CONTRACT_TEMPLATES, get_settings


class BlindspotFinding(BaseModel):
    """An omitted protective term or critical contractual vulnerability.

    Attributes:
        clause_key: Canonical clause identifier from baseline template.
        severity: Risk classification level ('CRITICAL', 'WARNING', 'RECOMMENDED').
        title: Human-readable finding headline.
        risk_description: Practical risk explanation if this clause remains omitted.
        recommendation: Proposed remediation or standard language to request.
    """

    clause_key: str
    severity: str
    title: str
    risk_description: str
    recommendation: str


class BlindspotReport(BaseModel):
    """Comprehensive blindspot audit report for a contract.

    Attributes:
        document_id: Identifier of the audited document.
        template_name: Baseline standard used for audit ('mutual_nda', 'saas_sla', etc.).
        compliance_score: Calculated contract coverage percentage (0.0 to 100.0).
        present_clauses: Mandatory clauses identified in the document.
        omitted_findings: Missing terms categorized by risk severity.
        critical_count: Number of critical omissions requiring immediate attorney intervention.
    """

    document_id: str
    template_name: str
    compliance_score: float = Field(ge=0.0, le=100.0)
    present_clauses: List[str] = Field(default_factory=list)
    omitted_findings: List[BlindspotFinding] = Field(default_factory=list)
    critical_count: int = 0


class BlindspotDetectorAgent:
    """Audits contracts against standard industry baseline schemas to identify omissions."""

    # Keywords used to detect presence of mandatory clauses in text
    CLAUSE_KEYWORDS: Dict[str, List[str]] = {
        "definition_of_confidential_information": [
            "confidential information",
            "proprietary information",
            "definition",
        ],
        "obligations_of_receiving_party": [
            "receiving party shall",
            "duty of care",
            "protect confidential",
        ],
        "exclusions_from_confidentiality": [
            "exclusions",
            "publicly known",
            "rightfully received",
        ],
        "term_and_termination": [
            "term and termination",
            "term of this agreement",
            "termination notice",
        ],
        "return_or_destruction_of_materials": [
            "return or destroy",
            "destruction of materials",
            "promptly return",
        ],
        "remedies_and_injunctive_relief": [
            "injunctive relief",
            "equitable remedies",
            "irreparable harm",
        ],
        "governing_law_and_jurisdiction": [
            "governing law",
            "jurisdiction",
            "laws of the state",
        ],
        "non_solicitation_limitation": [
            "non-solicitation",
            "shall not solicit",
            "recruit employees",
        ],
        "service_availability_uptime_commitment": [
            "uptime",
            "availability",
            "99.9%",
            "service levels",
        ],
        "scheduled_maintenance_windows": [
            "maintenance window",
            "scheduled downtime",
            "maintenance",
        ],
        "data_ownership_and_intellectual_property": [
            "data ownership",
            "customer data",
            "intellectual property rights",
        ],
        "limitation_of_liability_and_caps": [
            "limitation of liability",
            "aggregate liability",
            "liability cap",
        ],
        "mutual_indemnification_scope": [
            "indemnification",
            "indemnify and hold harmless",
            "defense of claims",
        ],
        "data_security_and_breach_notification": [
            "data security",
            "breach notification",
            "security incident",
        ],
        "termination_for_convenience": [
            "termination for convenience",
            "terminate without cause",
        ],
        "data_export_and_transition_assistance": [
            "data export",
            "transition assistance",
            "post-termination export",
        ],
        "duties_and_responsibilities": [
            "duties and responsibilities",
            "position and duties",
            "scope of work",
        ],
        "compensation_and_benefits": [
            "base salary",
            "compensation",
            "benefits",
            "bonus",
        ],
        "intellectual_property_assignment": [
            "assignment of inventions",
            "work made for hire",
            "ip assignment",
        ],
        "non_compete_geography_and_duration": [
            "non-compete",
            "covenant not to compete",
            "restrictive covenant",
        ],
        "severance_and_termination_conditions": [
            "severance",
            "termination for cause",
            "termination without cause",
        ],
        "confidentiality_obligations": [
            "confidentiality obligations",
            "nondisclosure",
        ],
        "dispute_resolution_and_arbitration": [
            "arbitration",
            "dispute resolution",
            "binding arbitration",
        ],
    }

    def __init__(self) -> None:
        """Initialize BlindspotDetectorAgent with baseline templates."""
        self.settings = get_settings()
        self.templates = BASELINE_CONTRACT_TEMPLATES

    def audit(
        self,
        document_text: str,
        document_id: str = "doc_audit",
        template_name: str = "mutual_nda",
    ) -> BlindspotReport:
        """Audit document text against the specified baseline schema.

        Args:
            document_text: Full sanitized text of the contract.
            document_id: Associated document identifier.
            template_name: Key in BASELINE_CONTRACT_TEMPLATES ('mutual_nda', 'saas_sla', etc.).

        Returns:
            BlindspotReport with compliance score and categorized omissions.
        """
        chosen_template = template_name if template_name in self.templates else "mutual_nda"
        schema = self.templates[chosen_template]
        mandatory_clauses: List[str] = schema["mandatory_clauses"]

        clean_text = document_text.lower() if document_text else ""
        present: List[str] = []
        omitted: List[BlindspotFinding] = []

        for clause in mandatory_clauses:
            kws = self.CLAUSE_KEYWORDS.get(clause, [clause.replace("_", " ")])
            is_present = any(kw in clean_text for kw in kws)

            if is_present:
                present.append(clause)
            else:
                # Assign risk severity based on contractual importance
                severity = (
                    "CRITICAL"
                    if any(
                        k in clause
                        for k in ["liability", "indemnif", "ownership", "remedies", "return"]
                    )
                    else "WARNING"
                )

                nice_title = clause.replace("_", " ").title()
                finding = BlindspotFinding(
                    clause_key=clause,
                    severity=severity,
                    title=f"Omitted: {nice_title}",
                    risk_description=(
                        f"The document lacks a protective '{nice_title}' clause. "
                        "Without this term, your rights and recourse in a dispute may "
                        "be severely restricted."
                    ),
                    recommendation=(
                        f"Insert standard mutual language covering {nice_title} before executing."
                    ),
                )
                omitted.append(finding)

        total_clauses = len(mandatory_clauses)
        score = round((len(present) / total_clauses) * 100.0, 1) if total_clauses > 0 else 0.0
        critical_count = sum(1 for o in omitted if o.severity == "CRITICAL")

        return BlindspotReport(
            document_id=document_id,
            template_name=chosen_template,
            compliance_score=score,
            present_clauses=present,
            omitted_findings=omitted,
            critical_count=critical_count,
        )
