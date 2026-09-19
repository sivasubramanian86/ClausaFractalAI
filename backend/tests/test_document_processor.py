"""Comprehensive unit tests for DocumentProcessor, RAGEngine, PIIScrubber,
BoilerplatePruner, and AudioProcessor services.
"""

import io
from unittest.mock import MagicMock

import pypdf
import pytest

from services.audio_processor import AudioProcessor
from services.boilerplate_pruner import BoilerplatePruner
from services.document_processor import DocumentProcessor
from services.pii_scrubber import PIIScrubber
from services.rag_engine import LegalTriple, RAGEngine

# ============================================================================
# PIIScrubber Tests
# ============================================================================


def test_pii_scrubber_empty() -> None:
    """Verify scrubber handles empty strings gracefully."""
    scrubber = PIIScrubber()
    result = scrubber.scrub("")
    assert result.cleaned_text == ""
    assert result.total_redactions == 0
    assert result.redaction_counts == {}


def test_pii_scrubber_all_patterns() -> None:
    """Verify scrubber detects and redacts SSN, credit cards, emails, phones, and addresses."""
    scrubber = PIIScrubber()
    raw = (
        "Employee SSN is 123-45-6789. Payment via 4111-2222-3333-4444. "
        "Email him at lawyer@contractfirm.com or call 555-123-4567. "
        "Deliver docs to 100 Main Street."
    )
    res = scrubber.scrub(raw)
    assert "[REDACTED_SSN]" in res.cleaned_text
    assert "[REDACTED_CREDIT_CARD]" in res.cleaned_text
    assert "[REDACTED_EMAIL]" in res.cleaned_text
    assert "[REDACTED_PHONE]" in res.cleaned_text
    assert "[REDACTED_ADDRESS]" in res.cleaned_text
    assert res.total_redactions == 5
    assert res.redaction_counts["ssn"] == 1
    assert res.redaction_counts["credit_card"] == 1
    assert res.redaction_counts["email"] == 1
    assert res.redaction_counts["phone"] == 1
    assert res.redaction_counts["address"] == 1


def test_pii_scrubber_clean_text() -> None:
    """Verify clean contract text passes through without redactions."""
    scrubber = PIIScrubber()
    clean = "The Vendor agrees to deliver the software within 30 days."
    res = scrubber.scrub(clean)
    assert res.cleaned_text == clean
    assert res.total_redactions == 0


# ============================================================================
# BoilerplatePruner Tests
# ============================================================================


def test_boilerplate_pruner_empty() -> None:
    """Verify pruner handles empty inputs."""
    pruner = BoilerplatePruner()
    assert pruner.prune_text("") == ""
    assert pruner.prune_pages([]) == []
    assert pruner.prune_pages(["Single page"]) == ["Single page"]


def test_boilerplate_pruner_stamps_and_numbers() -> None:
    """Verify removal of page counters, stamps, and newline collapse."""
    pruner = BoilerplatePruner()
    text = (
        "CONFIDENTIAL\n"
        "Page 1 of 5\n"
        "Section 1: Obligations\n"
        "- 1 -\n"
        "[Page 2]\n"
        "Page 3\n"
        "5 / 10\n"
        "Strictly Confidential\n"
        "Attorney-Client Privilege\n"
        "All Rights Reserved\n\n\n\n\n"
        "End of clause."
    )
    pruned = pruner.prune_text(text)
    assert "Section 1: Obligations" in pruned
    assert "End of clause." in pruned
    assert "Page 1 of 5" not in pruned
    assert "CONFIDENTIAL" not in pruned
    assert "\n\n\n" not in pruned


def test_boilerplate_pruner_pages_header_footer() -> None:
    """Verify repeated running headers and footers across pages are pruned."""
    pruner = BoilerplatePruner()
    page1 = "Acme Corp Master Agreement\nClause 1 Content\nConfidential Acme 2026"
    page2 = "Acme Corp Master Agreement\nClause 2 Content\nConfidential Acme 2026"
    result = pruner.prune_pages([page1, page2])
    assert len(result) == 2
    assert "Acme Corp Master Agreement" not in result[0]
    assert "Confidential Acme 2026" not in result[0]
    assert "Clause 1 Content" in result[0]
    assert "Clause 2 Content" in result[1]


def test_boilerplate_pruner_pages_different_headers() -> None:
    """Verify unique headers across pages are preserved."""
    pruner = BoilerplatePruner()
    page1 = "Unique Header 1\nBody 1"
    page2 = "Unique Header 2\nBody 2"
    result = pruner.prune_pages([page1, page2])
    assert result[0] == "Unique Header 1\nBody 1"
    assert result[1] == "Unique Header 2\nBody 2"


# ============================================================================
# AudioProcessor Tests
# ============================================================================


def test_audio_processor_empty() -> None:
    """Verify audio processor handles empty audio bytes."""
    proc = AudioProcessor()
    res = proc.transcribe(b"")
    assert res.status == "empty_input"
    assert res.confidence == 0.0


def test_audio_processor_mock_override() -> None:
    """Verify audio processor honors deterministic mock response."""
    proc = AudioProcessor()
    res = proc.transcribe(b"fake-audio", mock_response="What is the termination period?")
    assert res.transcript == "What is the termination period?"
    assert res.status == "success"
    assert res.confidence == 0.99


def test_audio_processor_offline_mode() -> None:
    """Verify audio processor fallback when no client is configured."""
    proc = AudioProcessor(gemini_client=None)
    res = proc.transcribe(b"audio-bytes-without-client")
    assert "offline" in res.transcript
    assert res.status == "offline_mode"


def test_audio_processor_client_success() -> None:
    """Verify audio processor with mocked Google GenAI client."""
    mock_client = MagicMock()
    mock_resp = MagicMock()
    mock_resp.text = "Does the NDA have a non-solicit clause?"
    mock_client.models.generate_content.return_value = mock_resp

    proc = AudioProcessor(gemini_client=mock_client)
    res = proc.transcribe(b"real-audio-bytes")
    assert res.transcript == "Does the NDA have a non-solicit clause?"
    assert res.status == "success"


def test_audio_processor_client_fallback() -> None:
    """Verify audio processor falls back to 2.5 if 3.8 throws an exception."""
    mock_client = MagicMock()
    fallback_resp = MagicMock()
    fallback_resp.text = "Fallback audio transcription"

    # First call (3.8) raises, second call (2.5) succeeds
    mock_client.models.generate_content.side_effect = [
        Exception("3.8 model not available"),
        fallback_resp,
    ]

    proc = AudioProcessor(gemini_client=mock_client)
    res = proc.transcribe(b"audio-payload")
    assert res.transcript == "Fallback audio transcription"
    assert res.status == "success"


def test_audio_processor_client_fatal_error() -> None:
    """Verify audio processor returns failure status if all API attempts fail."""
    mock_client = MagicMock()
    mock_client.models.generate_content.side_effect = Exception("Vertex network timeout")

    proc = AudioProcessor(gemini_client=mock_client)
    res = proc.transcribe(b"audio-payload")
    assert res.status.startswith("transcription_failed")
    assert res.confidence == 0.0


# ============================================================================
# RAGEngine Tests
# ============================================================================


def test_rag_engine_embedding() -> None:
    """Verify deterministic embedding calculation and edge cases."""
    rag = RAGEngine(vector_dimension=64)
    assert rag.compute_embedding("").shape == (64,)
    assert (rag.compute_embedding("") == 0).all()
    assert (rag.compute_embedding("   ") == 0).all()

    v1 = rag.compute_embedding("Confidentiality agreement obligations")
    assert v1.shape == (64,)
    norm = float(rag.compute_embedding("Test").dot(rag.compute_embedding("Test")))
    assert pytest.approx(norm, 0.01) == 1.0


def test_rag_engine_chunking() -> None:
    """Verify chunk generation with overlap, whitespace skipping, and citation coordinates."""
    rag = RAGEngine()
    assert rag.chunk_text("", document_id="doc1") == []

    text = "Word " * 150  # ~750 characters
    chunks = rag.chunk_text(text, document_id="doc1", page_number=2, chunk_size=300, overlap=50)
    assert len(chunks) >= 2
    assert chunks[0].page_number == 2
    assert chunks[0].start_char == 0
    assert chunks[0].end_char <= 300
    assert chunks[0].chunk_id.startswith("doc1_p2_c")

    # Verify whitespace slice skipping branch
    gapped_text = "Start block." + (" " * 400) + "End block."
    gapped_chunks = rag.chunk_text(
        gapped_text, document_id="doc_gap", page_number=1, chunk_size=100, overlap=20
    )
    assert len(gapped_chunks) >= 2


def test_rag_engine_triple_extraction_and_search() -> None:
    """Verify legal triple extraction for obligations, prohibitions, indemnities, and caps."""
    rag = RAGEngine()
    assert rag.extract_triples("") == []

    clause = (
        "The Vendor shall deliver source code within 30 days. "
        "The Contractor shall not disclose trade secrets to third parties. "
        "The Customer shall indemnify and hold harmless Vendor against damages. "
        "The aggregate liability shall be limited to $500,000."
    )
    triples = rag.extract_triples(clause, page=1, clause_ref="Sec 3")
    assert len(triples) == 4

    relations = [t.relation for t in triples]
    assert "OBLIGATED_TO" in relations
    assert "PROHIBITED_FROM" in relations
    assert "INDEMNIFIES" in relations
    assert "LIMITS_LIABILITY_TO" in relations

    # Check entity search by subject and object
    vendor_triples = rag.get_triples_for_entity("Vendor")
    assert len(vendor_triples) >= 1

    source_code_triples = rag.get_triples_for_entity("source code")
    assert len(source_code_triples) >= 1

    empty_triples = rag.get_triples_for_entity("NonexistentEntity")
    assert len(empty_triples) == 0


def test_rag_engine_contradiction_detection() -> None:
    """Verify graph traversal identifies conflicting obligations and handles valid pairs."""
    rag = RAGEngine()
    # Conflicting pair (overlap >= 2)
    rag.graph_triples.append(
        LegalTriple(
            subject="Vendor",
            relation="OBLIGATED_TO",
            object="disclose proprietary source code immediately",
            clause_ref="Sec 1",
            page=1,
        )
    )
    rag.graph_triples.append(
        LegalTriple(
            subject="Vendor",
            relation="PROHIBITED_FROM",
            object="disclose proprietary source code under any circumstances",
            clause_ref="Sec 5",
            page=3,
        )
    )
    # Non-conflicting pair (overlap < 2)
    rag.graph_triples.append(
        LegalTriple(
            subject="Vendor",
            relation="OBLIGATED_TO",
            object="maintain security compliance",
            clause_ref="Sec 2",
            page=1,
        )
    )
    rag.graph_triples.append(
        LegalTriple(
            subject="Vendor",
            relation="PROHIBITED_FROM",
            object="assign rights to third parties",
            clause_ref="Sec 6",
            page=4,
        )
    )

    contradictions = rag.find_contradictions()
    assert len(contradictions) >= 1
    assert contradictions[0]["subject"] == "Vendor"
    assert contradictions[0]["type"] == "obligation_vs_prohibition"
    assert contradictions[0]["obligation_page"] == 1
    assert contradictions[0]["prohibition_page"] == 3


def test_rag_engine_query_grounded_and_uncertainty() -> None:
    """Verify hybrid search returns matches and enforces uncertainty for unanswerable queries."""
    rag = RAGEngine()

    # Query against empty index
    empty_res = rag.query("What is the governing law?")
    assert empty_res.is_uncertain is True
    expected_msg = "I cannot determine this based on the provided document."
    assert empty_res.uncertainty_message == expected_msg

    # Index some chunks and triples
    chunks = rag.chunk_text(
        "Governing law is the State of Delaware. All disputes settled in Wilmington.",
        document_id="doc1",
        page_number=1,
    )
    rag.add_chunks([])  # Test empty list guard
    rag.add_chunks(chunks)

    rag.graph_triples.append(
        LegalTriple(
            subject="Customer",
            relation="INDEMNIFIES",
            object="Vendor from third party claims",
            clause_ref="Sec 4",
            page=1,
        )
    )

    # Grounded match
    match_res = rag.query("governing law Delaware", top_k=2, similarity_threshold=0.1)
    assert match_res.is_uncertain is False
    assert len(match_res.chunks) >= 1
    assert "Delaware" in match_res.chunks[0].text

    # Relation match in triples
    rel_res = rag.query("indemnifies against claims", top_k=2, similarity_threshold=0.1)
    assert len(rel_res.triples) >= 1

    # High threshold / unanswerable question triggers deterministic uncertainty
    unmatched_res = rag.query("quantum mechanics astrophysics", top_k=2, similarity_threshold=0.99)
    assert unmatched_res.is_uncertain is True
    assert (
        unmatched_res.uncertainty_message
        == "I cannot determine this based on the provided document."
    )


# ============================================================================
# DocumentProcessor Tests
# ============================================================================


def test_document_processor_empty() -> None:
    """Verify document processor handles empty PDF bytes."""
    dp = DocumentProcessor()
    doc = dp.process_pdf(b"")
    assert doc.page_count == 0
    assert doc.total_characters == 0


def test_document_processor_process_text() -> None:
    """Verify processing of raw text document."""
    dp = DocumentProcessor()
    raw = (
        "CONFIDENTIAL\n"
        "Page 1 of 1\n"
        "The Vendor shall deliver quarterly audits. "
        "Contact: admin@vendor.com. Phone: 555-456-7890."
    )
    doc = dp.process_text(raw, filename="vendor_contract.txt")
    assert doc.page_count == 1
    assert doc.filename == "vendor_contract.txt"
    assert "[REDACTED_EMAIL]" in doc.pages[0].clean_text
    assert "[REDACTED_PHONE]" in doc.pages[0].clean_text
    assert len(doc.chunks) >= 1
    assert len(doc.triples) >= 1


def test_document_processor_digital_pdf(monkeypatch: pytest.MonkeyPatch) -> None:
    """Verify extraction and processing of native digital PDF with PII."""
    writer = pypdf.PdfWriter()
    writer.add_blank_page(width=100, height=100)
    buf = io.BytesIO()
    writer.write(buf)
    pdf_bytes = buf.getvalue()

    dp = DocumentProcessor()

    long_clause = (
        "This Master Services Agreement is entered into by and between Acme Corp and Beta LLC. "
        "Acme Corp shall provide cloud maintenance services on a weekly basis. "
        "Contact legal counsel at legal@acmecorp.com or phone 555-019-2834."
    )
    monkeypatch.setattr(pypdf._page.PageObject, "extract_text", lambda self: long_clause)

    doc = dp.process_pdf(pdf_bytes, filename="agreement.pdf")
    assert doc.page_count == 1
    assert doc.is_scanned_detected is False
    assert "Acme Corp" in doc.pages[0].clean_text
    assert "[REDACTED_EMAIL]" in doc.pages[0].clean_text
    assert doc.total_redactions >= 1
    assert len(doc.chunks) >= 1


def test_document_processor_scanned_pdf_multimodal_vision() -> None:
    """Verify low-density page triggers multimodal Gemini Vision fallback with PII."""
    writer = pypdf.PdfWriter()
    writer.add_blank_page(width=100, height=100)
    buf = io.BytesIO()
    writer.write(buf)
    blank_pdf = buf.getvalue()

    dp = DocumentProcessor()
    mock_ocr = (
        "Section 9: The Contractor indemnifies the Client against third-party claims. "
        "Notices sent to contact@clientcorp.com."
    )
    doc = dp.process_pdf(blank_pdf, filename="scanned_scan.pdf", mock_ocr_override=mock_ocr)

    assert doc.page_count == 1
    assert doc.is_scanned_detected is True
    assert doc.pages[0].is_scanned is True
    assert "Contractor indemnifies" in doc.pages[0].clean_text
    assert "[REDACTED_EMAIL]" in doc.pages[0].clean_text
    assert doc.total_redactions >= 1


def test_document_processor_vision_client_interaction() -> None:
    """Verify internal _ocr_with_gemini_vision logic with client success, fallback, and offline."""
    # Offline mode (no client)
    dp_offline = DocumentProcessor(gemini_client=None)
    offline_txt = dp_offline._ocr_with_gemini_vision(b"pdf-bytes")
    assert "offline" in offline_txt

    # Mock client success
    mock_client = MagicMock()
    mock_resp = MagicMock()
    mock_resp.text = "Extracted Vision Clause"
    mock_client.models.generate_content.return_value = mock_resp

    dp_client = DocumentProcessor(gemini_client=mock_client)
    res_txt = dp_client._ocr_with_gemini_vision(b"pdf-bytes")
    assert res_txt == "Extracted Vision Clause"

    # Mock client fallback 3.8 -> 2.5
    mock_client.models.generate_content.side_effect = [
        Exception("3.8 unavailable"),
        mock_resp,
    ]
    fallback_txt = dp_client._ocr_with_gemini_vision(b"pdf-bytes")
    assert fallback_txt == "Extracted Vision Clause"

    # Mock client fatal error
    mock_client.models.generate_content.side_effect = Exception("Quota exceeded")
    err_txt = dp_client._ocr_with_gemini_vision(b"pdf-bytes")
    assert "failed" in err_txt
