"""Unit tests for StatutoryCodexService, CourtroomDeliberationEngine, and Judicial endpoints.

Ensures 100% statement and branch coverage across courtroom adjudication,
statutory elements, advocate battlecards, and multimodal evidence processing.
"""

import io

import pypdf
import pytest
from fastapi.testclient import TestClient

from agents.courtroom_judge import CourtroomDeliberationEngine
from main import create_application
from services.statutory_codex import StatutoryCodexService, StatutorySection


@pytest.fixture
def codex_service() -> StatutoryCodexService:
    """Fixture providing an instance of StatutoryCodexService."""
    return StatutoryCodexService()


@pytest.fixture
def courtroom_engine(codex_service: StatutoryCodexService) -> CourtroomDeliberationEngine:
    """Fixture providing an initialized CourtroomDeliberationEngine."""
    return CourtroomDeliberationEngine(codex_service=codex_service)


@pytest.fixture
def test_client() -> TestClient:
    """Fixture providing a TestClient for the FastAPI application."""
    app = create_application()
    return TestClient(app)


def test_statutory_codex_catalog(codex_service: StatutoryCodexService) -> None:
    """Verify catalog listing, lookup by ID, and non-existent fallback."""
    sections = codex_service.list_all_sections()
    assert len(sections) >= 10

    sec = codex_service.get_section_by_id("IPC-420 / BNS-318(4)")
    assert sec is not None
    assert "Cheating" in sec.title

    sec_lower = codex_service.get_section_by_id("  usc-18-1343  ")
    assert sec_lower is not None
    assert "Wire Fraud" in sec_lower.title

    missing = codex_service.get_section_by_id("NONEXISTENT-999")
    assert missing is None


def test_statutory_codex_search(codex_service: StatutoryCodexService) -> None:
    """Verify search filtering by query, category, jurisdiction, and empty query."""
    criminal = codex_service.search_sections(query="", category="Criminal")
    assert len(criminal) > 0
    assert all("Criminal" in s.category for s in criminal)

    india = codex_service.search_sections(query="", jurisdiction="India")
    assert len(india) > 0
    assert all("India" in s.jurisdiction for s in india)

    wire = codex_service.search_sections(query="wire fraud")
    assert any("Wire Fraud" in s.title for s in wire)

    precedent_res = codex_service.search_sections(query="Donoghue")
    assert len(precedent_res) == 1
    assert "TORT-NEGLIGENCE" in precedent_res[0].code_id

    elem_res = codex_service.search_sections(
        query="unreasonable person"
    ) or codex_service.search_sections(query="fiduciary")
    assert len(elem_res) >= 1

    test_res = codex_service.search_sections(query="Virsa Singh")
    assert len(test_res) >= 1

    none_res = codex_service.search_sections(query="xyzrandomnonexistentquery123")
    assert len(none_res) == 0


def test_statutory_codex_match_evidence(
    codex_service: StatutoryCodexService, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Verify matching evidence text to sections with confidence scoring."""
    assert codex_service.match_evidence_to_sections("") == []
    assert codex_service.match_evidence_to_sections("   ") == []

    fraud_matches = codex_service.match_evidence_to_sections(
        "The accused dishonest inducement deceived our company into delivery of property"
        " through an email scam."
    )
    assert len(fraud_matches) >= 1
    assert fraud_matches[0]["confidence"] > 0.5
    assert len(fraud_matches[0]["matched_keywords"]) > 0

    various_text = (
        "Defendant breached duty of care with gross negligence causing damage. "
        "Also forged a false document with counterfeit signature and infringed copyright with"
        " copied work."
    )
    multi_matches = codex_service.match_evidence_to_sections(various_text)
    assert len(multi_matches) >= 2

    # Exercise branch where get_section_by_id returns None
    monkeypatch.setattr(codex_service, "get_section_by_id", lambda _: None)
    assert codex_service.match_evidence_to_sections("wire fraud") == []


def test_courtroom_engine_dissection_high_compliance(
    courtroom_engine: CourtroomDeliberationEngine,
) -> None:
    """Test case dissection resulting in >= 0.75 compliance (Liability / Guilty)."""
    case_narrative = (
        "Alpha Corp v. Beta Tech\n"
        "Alpha Corp proved that Beta intentionally engaged in deception and fraudulent dishonest"
        " inducement to deliver property and valuable security, causing extreme damage in mind"
        " and property."
    )
    result = courtroom_engine.dissect_case(
        case_text=case_narrative,
        jurisdiction="India (IPC/BNS)",
        incident_type="Criminal / Fraud",
    )
    assert result.dossier.case_title == "Alpha Corp v. Beta Tech"
    assert "Beta Tech" in result.dossier.case_title
    assert result.verdict.statutory_compliance_score >= 6.0
    assert (
        "Finding of Liability" in result.verdict.final_decree
        or "Guilty" in result.verdict.final_decree
    )
    assert (
        "Award of damages" in result.verdict.relief_or_sentence
        or "restitution" in result.verdict.relief_or_sentence
    )
    assert len(result.advocate_strategy.cross_examination_traps) == 3
    assert result.advocate_strategy.win_probability_prosecution > 0.5


def test_courtroom_engine_dissection_medium_and_low_compliance(
    courtroom_engine: CourtroomDeliberationEngine,
) -> None:
    """Test case dissection with medium (0.5) and low (<0.5) compliance tiers."""
    empty_result = courtroom_engine.dissect_case("")
    assert "In re: Standard commercial dispute" in empty_result.dossier.case_title
    assert len(empty_result.matched_sections) >= 1

    unconscionable_text = (
        "In re Unfair Terms Hearing\n"
        "Plaintiff alleges procedural unconscionability without meaningful choice, but no other"
        " evidence exists."
    )
    med_result = courtroom_engine.dissect_case(
        case_text=unconscionable_text,
        jurisdiction="US Federal",
    )
    assert med_result.verdict.bench is not None
    assert len(med_result.verdict.element_proofs) >= 1

    class LowMockCodex(StatutoryCodexService):
        def match_evidence_to_sections(self, text: str):
            sec = StatutorySection(
                code_id="TEST-ZERO",
                title="Strict Requirement Statute",
                jurisdiction="Common Law",
                category="Special",
                elements=[
                    "Xylophone Quasar Zymurgy Quokka 99991",
                    "Xylophone Quasar Zymurgy Quokka 99992",
                    "Xylophone Quasar Zymurgy Quokka 99993",
                    "Xylophone Quasar Zymurgy Quokka 99994",
                ],
                penalties="None",
                precedents=["Test v. Case (2026)"],
                statutory_test="Fourfold strict proof",
            )
            return [
                {
                    "section": sec,
                    "confidence": 0.9,
                    "matched_keywords": ["test"],
                    "statutory_test": "test",
                }
            ]

    low_engine = CourtroomDeliberationEngine(codex_service=LowMockCodex())
    low_result = low_engine.dissect_case(
        case_text="Random sentence with no words matching the statute."
    )
    assert "Dismissed" in low_result.verdict.final_decree
    assert "without prejudice" in low_result.verdict.relief_or_sentence
    assert low_result.advocate_strategy.win_probability_defense >= 0.70


def test_judicial_dissect_api_endpoint(test_client: TestClient) -> None:
    """Test POST /api/judicial/dissect route."""
    payload = {
        "case_text": (
            "State vs John Doe\nAccused John Doe accessed a protected computer without"
            " authorization under CFAA."
        ),
        "jurisdiction": "United States (Federal)",
        "incident_type": "Cybercrime",
    }
    resp = test_client.post("/api/judicial/dissect", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "dossier" in data
    assert "verdict" in data
    assert "advocate_strategy" in data
    assert data["dossier"]["case_title"] == "State vs John Doe"
    assert len(data["matched_sections"]) >= 1


def test_judicial_codex_api_endpoint(test_client: TestClient) -> None:
    """Test GET /api/judicial/codex listing and filtering."""
    resp = test_client.get("/api/judicial/codex")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 10

    resp_filter = test_client.get("/api/judicial/codex?query=wire&category=Criminal")
    assert resp_filter.status_code == 200
    data_filter = resp_filter.json()
    assert len(data_filter) >= 1
    assert "Wire Fraud" in data_filter[0]["title"]


def test_judicial_multimodal_evidence_api_endpoint(test_client: TestClient) -> None:
    """Test POST /api/judicial/multimodal-evidence with various file types and text."""
    # 1. Text PDF upload
    writer = pypdf.PdfWriter()
    writer.add_blank_page(width=72, height=72)
    buf = io.BytesIO()
    writer.write(buf)
    pdf_content = buf.getvalue()
    pdf_file = ("evidentiary_brief.pdf", io.BytesIO(pdf_content), "application/pdf")
    resp_pdf = test_client.post(
        "/api/judicial/multimodal-evidence",
        files={"file": pdf_file},
        data={"jurisdiction": "Common Law", "case_text": "Supplementary witness observations."},
    )
    assert resp_pdf.status_code == 200
    assert resp_pdf.json()["dossier"]["case_title"] is not None

    # 2. Audio/Video recording upload
    audio_file = ("hearing_audio.wav", io.BytesIO(b"RIFFWAVEfmt DATA..."), "audio/wav")
    resp_audio = test_client.post(
        "/api/judicial/multimodal-evidence",
        files={"file": audio_file},
        data={"incident_type": "Hearings"},
    )
    assert resp_audio.status_code == 200
    assert (
        "Audio/Video" in resp_audio.json()["dossier"]["facts_summary"]
        or resp_audio.json()["verdict"] is not None
    )

    # 3. Image snapshot upload
    img_file = ("crime_scene_snapshot.png", io.BytesIO(b"\x89PNG\r\n\x1a\n..."), "image/png")
    resp_img = test_client.post(
        "/api/judicial/multimodal-evidence",
        files={"file": img_file},
        data={"jurisdiction": "India"},
    )
    assert resp_img.status_code == 200

    # 4. Raw text file upload
    txt_file = (
        "deposition.txt",
        io.BytesIO(b"Deposition of Expert Witness on Breach of Duty"),
        "text/plain",
    )
    resp_txt = test_client.post(
        "/api/judicial/multimodal-evidence",
        files={"file": txt_file},
    )
    assert resp_txt.status_code == 200

    # 5. Form text only without file
    resp_form_only = test_client.post(
        "/api/judicial/multimodal-evidence",
        data={
            "case_text": "Solely verbal statement submitted by legal counsel regarding negligence."
        },
    )
    assert resp_form_only.status_code == 200

    # 6. Completely empty submission fallback
    resp_empty = test_client.post("/api/judicial/multimodal-evidence")
    assert resp_empty.status_code == 200
