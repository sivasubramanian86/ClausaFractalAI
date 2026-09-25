"""Google Cloud Storage (GCS) Sample Asset Management Service.

Provides remote GCS asset catalog and metadata streaming for multimodal legal
case demonstrations (document PDF, photographic snapshot, audio hearing, video deposition)
without storing heavy binary files in git repository history.
"""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class SampleCaseMedia(BaseModel):
    """Multimodal media references hosted in Google Cloud Storage."""

    pdf_url: str = Field(description="URL to the evidentiary contract or brief on GCS")
    image_url: str = Field(description="URL to photographic snapshot on GCS")
    audio_url: str = Field(description="URL to recorded audio hearing or wiretap on GCS")
    video_url: str = Field(description="URL to deposition or courtroom video on GCS")
    gcs_bucket: str = Field(description="Google Cloud Storage target bucket")


class SampleCase(BaseModel):
    """Curated legal case dossier backed by Google Cloud Storage media."""

    case_id: str
    title: str
    jurisdiction: str
    incident_type: str
    parties: Dict[str, str]
    facts_summary: str
    statutory_focus: str
    media: SampleCaseMedia
    is_gcs_hosted: bool = True


class GCSSampleAssetsService:
    """Service providing curated multimodal case dossiers backed by GCS."""

    def __init__(
        self,
        bucket_name: str = "clausafractalai-demo-assets",
        base_url: Optional[str] = None,
    ) -> None:
        """Initialize GCS sample asset service with target bucket and base URL.

        Args:
            bucket_name: Name of the Google Cloud Storage bucket.
            base_url: Optional public base URL for GCS assets.
        """
        self.bucket_name = bucket_name
        self.base_url = (base_url or f"https://storage.googleapis.com/{bucket_name}").rstrip("/")
        self._cases: Dict[str, SampleCase] = self._build_catalog()

    def _build_catalog(self) -> Dict[str, SampleCase]:
        """Construct deterministic catalog of sample multimodal cases hosted on GCS."""
        b_url = self.base_url
        b_name = self.bucket_name

        cases = [
            SampleCase(
                case_id="nexus_wire_fraud",
                title="State of California v. Nexus Enterprise (Wire Fraud & Forgery)",
                jurisdiction="US Federal / State",
                incident_type="Commercial Fraud & Forgery",
                parties={
                    "Prosecution_or_Plaintiff": "California Dept. of Financial Protection",
                    "Defense_or_Respondent": "Nexus Enterprise Ltd. & Ex-CFO Marcus Vance",
                },
                facts_summary=(
                    "Executive leadership altered payment milestone schedules and "
                    "forged electronic authorizations to siphon $2.4M into undisclosed "
                    "offshore accounts. Defense claims authorized commercial restructuring."
                ),
                statutory_focus=(
                    "18 U.S.C. § 1343 (Wire Fraud), UCC § 2-302 (Unconscionability), IPC 463"
                ),
                media=SampleCaseMedia(
                    pdf_url=f"{b_url}/contracts/nexus_fraudulent_vendor_agreement.pdf",
                    image_url=f"{b_url}/evidence/forged_signature_forensic_comparison.png",
                    audio_url=f"{b_url}/audio/wiretap_cfo_admission_call.mp3",
                    video_url=f"{b_url}/video/deposition_deposition_excerpt.mp4",
                    gcs_bucket=b_name,
                ),
                is_gcs_hosted=True,
            ),
            SampleCase(
                case_id="cyberextort_cfaa",
                title="In re: CyberExtort Cloud Data Penetration (CFAA § 1030 & GDPR Art. 83)",
                jurisdiction="Federal / Multi-Jurisdiction",
                incident_type="Cybercrime & Privacy Exfiltration",
                parties={
                    "Prosecution_or_Plaintiff": "Federal Trade Commission & Healthcare Network",
                    "Defense_or_Respondent": "Anonymous Threat Actor Group 'ZeroByte'",
                },
                facts_summary=(
                    "External threat actors intentionally breached healthcare cloud databases, "
                    "exfiltrated 450,000 protected medical records, and delivered a 15 BTC demand. "
                    "Cloud provider audited for gross omission of encryption at rest."
                ),
                statutory_focus="18 U.S.C. § 1030 (CFAA), GDPR Art. 83, IPC 420 (Cheating)",
                media=SampleCaseMedia(
                    pdf_url=f"{b_url}/contracts/ransom_demand_and_incident_report.pdf",
                    image_url=f"{b_url}/evidence/terminal_exfiltration_packet_dump.png",
                    audio_url=f"{b_url}/audio/extortion_voip_negotiation_snippet.mp3",
                    video_url=f"{b_url}/video/incident_investigation_briefing.mp4",
                    gcs_bucket=b_name,
                ),
                is_gcs_hosted=True,
            ),
            SampleCase(
                case_id="biovance_patent_theft",
                title="Global Oncology Inc. v. Biovance Labs (Patent Piracy & Trade Secrets)",
                jurisdiction="UK & International Common Law",
                incident_type="Intellectual Property & Commercial Secret Piracy",
                parties={
                    "Prosecution_or_Plaintiff": "Global Oncology Inc.",
                    "Defense_or_Respondent": "Biovance Labs Ltd. & Lead Chemist Dr. Rostova",
                },
                facts_summary=(
                    "Former research directors downloaded proprietary molecular compound data "
                    "before resigning, subsequently filing priority patents in duplicate "
                    "jurisdictions in breach of confidentiality covenants."
                ),
                statutory_focus=(
                    "17 U.S.C. § 501 (Copyright/IP Infringement), UK CRA 2015, Negligence"
                ),
                media=SampleCaseMedia(
                    pdf_url=f"{b_url}/contracts/biovance_nda_and_licensing_agreement.pdf",
                    image_url=f"{b_url}/evidence/molecular_patent_claim_comparison.png",
                    audio_url=f"{b_url}/audio/deposed_director_examination_recording.mp3",
                    video_url=f"{b_url}/video/court_preliminary_injunction_hearing.mp4",
                    gcs_bucket=b_name,
                ),
                is_gcs_hosted=True,
            ),
            SampleCase(
                case_id="bns_consortium_cheating",
                title="Consortium Bank of India v. Sovereign Infra (IPC 405/420 & BNS 318)",
                jurisdiction="India (IPC / BNS)",
                incident_type="Criminal Breach of Trust & Cheating",
                parties={
                    "Prosecution_or_Plaintiff": "Central Bureau of Investigation (Consortium)",
                    "Defense_or_Respondent": "Sovereign Infra Ltd. Board & Promoters",
                },
                facts_summary=(
                    "Promoters induced consortium banks to disburse ₹140 Crores for procuring "
                    "machinery. On-site audits verified that the machinery was non-existent and "
                    "funds were laundered into real estate shell companies."
                ),
                statutory_focus=(
                    "IPC Section 405 (Breach of Trust), IPC Section 420 / BNS 318(4) (Cheating)"
                ),
                media=SampleCaseMedia(
                    pdf_url=f"{b_url}/contracts/hypothecation_deed_and_sanction_letter.pdf",
                    image_url=f"{b_url}/evidence/site_audit_non_existent_machinery_photo.png",
                    audio_url=f"{b_url}/audio/whistleblower_statement_recording.mp3",
                    video_url=f"{b_url}/video/board_meeting_inquiry_session.mp4",
                    gcs_bucket=b_name,
                ),
                is_gcs_hosted=True,
            ),
        ]
        return {c.case_id: c for c in cases}

    def list_sample_cases(self) -> List[SampleCase]:
        """Return all curated sample cases."""
        return list(self._cases.values())

    def get_case(self, case_id: str) -> Optional[SampleCase]:
        """Fetch a specific sample case by case_id."""
        return self._cases.get(case_id)

    def get_gcs_bucket_info(self) -> Dict[str, Any]:
        """Return bucket configuration and connectivity metadata."""
        return {
            "bucket_name": self.bucket_name,
            "base_url": self.base_url,
            "total_sample_cases": len(self._cases),
            "storage_class": "STANDARD",
            "region": "us-central1",
            "git_footprint_bytes": 0,
        }
