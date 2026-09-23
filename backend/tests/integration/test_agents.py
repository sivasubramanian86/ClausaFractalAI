"""Unit tests for ClausaFractalAI Multi-Agent State Graph and MCP Server.

Covers RouterAgent, LegalQAAnalystAgent, CriticReflectionAgent,
BlindspotDetectorAgent, PolicyColliderAgent, ActionableCopilotAgent,
VerificationGuard, ComplexityTuner, and ModelContextProtocolServer.
"""

from unittest.mock import MagicMock

from agents.blindspot import BlindspotDetectorAgent, BlindspotReport
from agents.complexity import ComplexityTuner
from agents.copilot_actions import ActionableCopilotAgent
from agents.critic_reflection import CriticReflectionAgent
from agents.policy_collider import ImpactItem, PolicyColliderAgent
from agents.qa_analyst import LegalQAAnalystAgent
from agents.router import RouterAgent
from agents.verification_guard import Citation, VerificationGuard
from mcp.server import ModelContextProtocolServer
from services.rag_engine import DocumentChunk, RAGEngine

# ============================================================================
# ComplexityTuner Tests
# ============================================================================


def test_complexity_tuner_validation_and_directives() -> None:
    """Verify complexity level validation and directive extraction."""
    assert ComplexityTuner.validate_level("") == "STANDARD"
    assert ComplexityTuner.validate_level("eli5") == "ELI5"
    assert ComplexityTuner.validate_level("counsel") == "COUNSEL"
    assert ComplexityTuner.validate_level("paranoid") == "PARANOID"
    assert ComplexityTuner.validate_level("nonexistent") == "STANDARD"

    eli5_dir = ComplexityTuner.get_directive("ELI5")
    assert "5-year-old" in eli5_dir

    paranoid_dir = ComplexityTuner.get_directive("PARANOID")
    assert "adversarial" in paranoid_dir


# ============================================================================
# VerificationGuard Tests
# ============================================================================


def test_verification_guard_uncertain_or_empty_chunks() -> None:
    """Verify guard returns deterministic unknown message when retrieval is uncertain or empty."""
    res_uncertain = VerificationGuard.verify_response(
        answer="Some answer",
        citations=[],
        retrieved_chunks=[],
        is_retrieval_uncertain=True,
    )
    assert res_uncertain.is_grounded is False
    assert res_uncertain.verified_answer == VerificationGuard.DETERMINISTIC_UNKNOWN_MESSAGE

    res_no_chunks = VerificationGuard.verify_response(
        answer="Some answer",
        citations=[],
        retrieved_chunks=[],
        is_retrieval_uncertain=False,
    )
    assert res_no_chunks.is_grounded is False
    assert res_no_chunks.verified_answer == VerificationGuard.DETERMINISTIC_UNKNOWN_MESSAGE


def test_verification_guard_citations_verification() -> None:
    """Verify verification of grounded citations versus hallucinated citations."""
    chunk = DocumentChunk(
        chunk_id="c1",
        document_id="d1",
        page_number=1,
        start_char=0,
        end_char=100,
        text="Customer agrees to pay invoices within thirty (30) days.",
    )

    valid_cit = Citation(
        clause="Payment Terms",
        page=1,
        snippet="pay invoices within thirty (30) days",
    )
    invalid_cit = Citation(
        clause="Penalties",
        page=1,
        snippet="pay 50% compounding interest per month",
    )

    # Mixed citations: grounded passes, invalid ungrounded
    res_mixed = VerificationGuard.verify_response(
        answer="Customer has 30 days to pay.",
        citations=[valid_cit, invalid_cit],
        retrieved_chunks=[chunk],
    )
    assert res_mixed.is_grounded is True
    assert len(res_mixed.grounded_citations) == 1
    assert res_mixed.grounded_citations[0].is_grounded is True
    assert len(res_mixed.unverified_citations) == 1
    assert res_mixed.unverified_citations[0].is_grounded is False

    # Completely ungrounded citations trigger fallback
    res_hallucinated = VerificationGuard.verify_response(
        answer="Customer has 50% penalty.",
        citations=[invalid_cit],
        retrieved_chunks=[chunk],
    )
    assert res_hallucinated.is_grounded is False
    assert res_hallucinated.verified_answer == VerificationGuard.DETERMINISTIC_UNKNOWN_MESSAGE


# ============================================================================
# RouterAgent Tests
# ============================================================================


def test_router_agent_empty_and_mock() -> None:
    """Verify router handles empty input and mock overrides."""
    router = RouterAgent()
    assert router.classify("").intent == "LEGAL_QA"
    assert router.classify("   ").intent == "LEGAL_QA"
    assert router.classify("query", mock_intent="POLICY_DIFF").intent == "POLICY_DIFF"


def test_router_agent_keyword_heuristics() -> None:
    """Verify fast keyword heuristic routing across all legal intent categories."""
    router = RouterAgent()
    assert router.classify("Audit the blindspots in this mutual NDA").intent == "BLINDSPOT_AUDIT"
    assert router.classify("Compare this version vs the earlier contract").intent == "POLICY_DIFF"
    assert router.classify("Generate an attorney consultation prep sheet").intent == "ATTORNEY_PREP"
    assert router.classify("Please rewrite this clause favorably").intent == "CLAUSE_REWRITE"
    assert router.classify("What is the governing jurisdiction?").intent == "LEGAL_QA"


def test_router_agent_gemini_client_interaction() -> None:
    """Verify router with mocked Gemini client (success, fallback, and error)."""
    mock_client = MagicMock()
    mock_resp = MagicMock()
    mock_resp.text = "POLICY_DIFF"
    mock_client.models.generate_content.return_value = mock_resp

    router_client = RouterAgent(gemini_client=mock_client)
    res = router_client.classify("Examine contract differences")
    assert res.intent == "POLICY_DIFF"

    # Fallback to secondary model
    mock_client.models.generate_content.side_effect = [
        Exception("3.8 unavailable"),
        mock_resp,
    ]
    res_fallback = router_client.classify("Examine contract differences")
    assert res_fallback.intent == "POLICY_DIFF"

    # Unknown model output falls back to LEGAL_QA
    mock_unknown = MagicMock()
    mock_unknown.text = "SOMETHING_UNRECOGNIZED"
    mock_client.models.generate_content.side_effect = None
    mock_client.models.generate_content.return_value = mock_unknown
    res_unrec = router_client.classify("Examine contract differences")
    assert res_unrec.intent == "LEGAL_QA"

    # General error fallback
    mock_client.models.generate_content.side_effect = Exception("Fatal network error")
    res_err = router_client.classify("Random general question")
    assert res_err.intent == "LEGAL_QA"


# ============================================================================
# LegalQAAnalystAgent Tests
# ============================================================================


def test_qa_analyst_unanswerable_query() -> None:
    """Verify analyst strictly returns unknown message when retrieval fails."""
    rag = RAGEngine()
    analyst = LegalQAAnalystAgent(rag_engine=rag)
    resp = analyst.answer_query(query="What is the indemnity clause?")
    assert resp.answer == VerificationGuard.DETERMINISTIC_UNKNOWN_MESSAGE
    assert resp.is_grounded is False
    assert resp.citations == []


def test_qa_analyst_mock_answer() -> None:
    """Verify analyst with deterministic mock answer override and context caching."""
    rag = RAGEngine()
    # Populate large text to trigger context caching token threshold
    large_text = "Standard clause text. " * 3500  # ~77,000 characters (~19,000 tokens)
    chunks = rag.chunk_text(large_text, document_id="doc_large", page_number=1, chunk_size=500)
    rag.add_chunks(chunks)

    # Temporarily set context caching threshold lower to assert caching branch
    analyst = LegalQAAnalystAgent(rag_engine=rag)
    analyst.settings.context_caching_threshold = 1000

    cit = Citation(
        clause="Standard clause",
        page=1,
        snippet="Standard clause text.",
    )
    resp = analyst.answer_query(
        query="Standard clause",
        complexity_level="COUNSEL",
        mock_answer="According to the contract, standard clause text applies.",
        mock_citations=[cit],
    )
    assert resp.is_grounded is True
    assert resp.complexity_level == "COUNSEL"
    assert resp.cached_tokens > 0


def test_qa_analyst_gemini_client_interaction() -> None:
    """Verify analyst interaction with mocked Gemini client (success, fallback, error)."""
    rag = RAGEngine()
    chunks = rag.chunk_text(
        "Governing law is Delaware. Disputes heard in New Castle County.",
        document_id="doc1",
        page_number=1,
    )
    rag.add_chunks(chunks)

    mock_client = MagicMock()
    mock_resp = MagicMock()
    mock_resp.text = "Delaware is the governing law."
    mock_client.models.generate_content.return_value = mock_resp

    analyst = LegalQAAnalystAgent(rag_engine=rag, gemini_client=mock_client)
    res = analyst.answer_query(query="governing law", complexity_level="ELI5")
    assert res.complexity_level == "ELI5"
    assert "Delaware" in res.answer

    # Fallback 3.8 -> 2.5
    mock_client.models.generate_content.side_effect = [
        Exception("3.8 unavailable"),
        mock_resp,
    ]
    res_fb = analyst.answer_query(query="governing law")
    assert "Delaware" in res_fb.answer

    # Fatal error falls back to offline chunk synthesis
    mock_client.models.generate_content.side_effect = Exception("API error")
    res_err = analyst.answer_query(query="governing law")
    assert "Delaware" in res_err.answer
    assert len(res_err.citations) >= 1


def test_qa_analyst_offline_mode() -> None:
    """Verify analyst offline chunk fallback when client is None."""
    rag = RAGEngine()
    chunks = rag.chunk_text(
        "Termination notice required is thirty days.",
        document_id="doc1",
        page_number=2,
    )
    rag.add_chunks(chunks)

    analyst = LegalQAAnalystAgent(rag_engine=rag, gemini_client=None)
    resp = analyst.answer_query(query="termination notice", complexity_level="PARANOID")
    assert resp.complexity_level == "PARANOID"
    assert "thirty days" in resp.answer
    assert resp.citations[0].page == 2


# ============================================================================
# CriticReflectionAgent Tests
# ============================================================================


def test_critic_reflection_evaluation_and_repair() -> None:
    """Verify reflection scoring and self-repair loop."""
    critic = CriticReflectionAgent()

    # Empty answer
    assert critic.evaluate_quality("", [], []) == 0.0

    # Deterministic unknown message gets perfect fidelity
    assert critic.evaluate_quality(VerificationGuard.DETERMINISTIC_UNKNOWN_MESSAGE, [], []) == 10.0

    chunk = DocumentChunk(
        chunk_id="c1",
        document_id="d1",
        page_number=1,
        start_char=0,
        end_char=50,
        text="The liability is strictly capped at $100,000.",
    )

    # Coherent answer without citations gets baseline minus penalty
    score_no_cit = critic.evaluate_quality("A coherent response.", [], [chunk])
    assert score_no_cit >= 5.0

    # Answer with words that do not match chunk corpus
    score_no_match = critic.evaluate_quality("xyzqwerty", [], [chunk])
    assert score_no_match >= 5.0

    # Substandard response triggers repair
    bad_answer = "Vague summary without exact details."
    bad_cits = [Citation(clause="Sec 1", page=1, snippet="Vague details", is_grounded=False)]

    res_repair = critic.review(
        query="What is the cap?",
        answer=bad_answer,
        citations=bad_cits,
        retrieved_chunks=[chunk],
    )
    assert res_repair.passed is True
    assert res_repair.iterations_count >= 1
    assert "strictly capped" in res_repair.improved_answer

    # Substandard response with no chunks triggers deterministic unknown fallback
    res_no_chunks = critic.review(
        query="What is the cap?",
        answer="Some hallucination",
        citations=bad_cits,
        retrieved_chunks=[],
    )
    assert res_no_chunks.passed is True
    assert res_no_chunks.improved_answer == VerificationGuard.DETERMINISTIC_UNKNOWN_MESSAGE

    # Already high-quality response passes immediately
    good_answer = "The liability is strictly capped at $100,000."
    good_cits = [
        Citation(
            clause="Sec 1",
            page=1,
            snippet="liability is strictly capped",
            is_grounded=True,
        )
    ]
    res_good = critic.review(
        query="What is the cap?",
        answer=good_answer,
        citations=good_cits,
        retrieved_chunks=[chunk],
    )
    assert res_good.passed is True
    assert res_good.iterations_count == 1


# ============================================================================
# BlindspotDetectorAgent Tests
# ============================================================================


def test_blindspot_detector_empty_and_full() -> None:
    """Verify blindspot detection against baseline schemas."""
    detector = BlindspotDetectorAgent()

    # Empty text -> 0% compliance, all omissions flagged
    empty_report = detector.audit(
        document_text="", document_id="doc_empty", template_name="mutual_nda"
    )
    assert empty_report.compliance_score == 0.0
    assert len(empty_report.omitted_findings) >= 6
    assert empty_report.critical_count >= 1

    # Text containing all mandatory NDA clauses
    complete_nda_text = (
        "Definition of confidential information. "
        "Receiving party shall protect confidential information. "
        "Exclusions from confidentiality include public information. "
        "Term and termination notice within thirty days. "
        "Return or destroy materials promptly upon request. "
        "Remedies and injunctive relief for breach. "
        "Governing law and jurisdiction of Delaware. "
        "Non-solicitation of employees limitation."
    )
    full_report = detector.audit(
        document_text=complete_nda_text,
        document_id="doc_full",
        template_name="mutual_nda",
    )
    assert full_report.compliance_score == 100.0
    assert len(full_report.omitted_findings) == 0

    # Non-existent template defaults to mutual_nda
    default_report = detector.audit(
        document_text=complete_nda_text,
        document_id="doc_def",
        template_name="invalid_template",
    )
    assert default_report.template_name == "mutual_nda"


# ============================================================================
# PolicyColliderAgent Tests
# ============================================================================


def test_policy_collider_shifts_and_verdicts() -> None:
    """Verify policy version collision detection and Practical Impact Matrix."""
    collider = PolicyColliderAgent()

    # Mock override test
    mock_items = [
        ImpactItem(
            clause_topic="Arbitration",
            previous_term="Court litigation",
            new_term="Mandatory binding arbitration",
            impact_type="RIGHTS_SURRENDERED",
            plain_english_takeaway="Surrendered right to jury trial.",
            risk_level="HIGH",
        )
    ]
    mock_report = collider.compare(
        doc_a_text="",
        doc_b_text="",
        mock_items=mock_items,
    )
    assert mock_report.total_shifts_detected == 1

    # Real collision detection
    doc_a = (
        "Data retention: all data deleted within 30 days of termination. "
        "Liability cap: aggregate liability limited to $50,000. "
        "Termination notice: 30 days prior notice."
    )
    doc_b = (
        "Data retention: retain data for indefinite period for model training with rights waiver. "
        "Liability cap: unlimited and uncapped liability. "
        "Termination notice: 30 days prior notice. "
        "Binding arbitration applies to all disputes."
    )
    report = collider.compare(doc_a_text=doc_a, doc_b_text=doc_b)
    assert report.total_shifts_detected >= 2
    assert any(i.impact_type == "RIGHTS_SURRENDERED" for i in report.impact_matrix)
    assert any(i.impact_type == "LIABILITY_INCREASE" for i in report.impact_matrix)
    assert "CAUTION" in report.overall_verdict

    # Identical texts
    identical_report = collider.compare(doc_a_text=doc_a, doc_b_text=doc_a)
    assert identical_report.total_shifts_detected == 0
    assert "Identical" in identical_report.overall_verdict

    # Moderate evolution (neutral shifts only)
    doc_c = doc_a.replace("30 days prior notice", "60 days prior notice")
    mod_report = collider.compare(doc_a_text=doc_a, doc_b_text=doc_c)
    assert "MODERATE EVOLUTION" in mod_report.overall_verdict

    # Benefit gained (term previously not addressed, now explicitly provided)
    doc_prior = "Termination notice: 30 days prior notice."
    doc_new = (
        "Termination notice: 30 days prior notice. "
        "Indemnification scope: Mutual indemnification holds harmless both parties."
    )
    benefit_report = collider.compare(doc_a_text=doc_prior, doc_b_text=doc_new)
    assert any(i.impact_type == "BENEFIT_GAINED" for i in benefit_report.impact_matrix)


# ============================================================================
# ActionableCopilotAgent Tests
# ============================================================================


def test_copilot_attorney_prep_and_counter_clause() -> None:
    """Verify generation of Attorney Consultation Prep Sheets and Counter-Clauses."""
    copilot = ActionableCopilotAgent()

    # Prep sheet with blindspot report
    blindspot_rep = BlindspotReport(
        document_id="d1",
        template_name="mutual_nda",
        compliance_score=50.0,
        omitted_findings=[BlindspotDetectorAgent().audit("").omitted_findings[0]],
        critical_count=1,
    )
    sheet = copilot.generate_attorney_prep_sheet(document_id="d1", blindspot_report=blindspot_rep)
    assert len(sheet.critical_red_flags) >= 1
    assert len(sheet.attorney_questions) == 5
    assert len(sheet.negotiation_leverage_points) >= 3

    # Prep sheet without blindspot report
    empty_sheet = copilot.generate_attorney_prep_sheet(document_id="d2")
    assert len(empty_sheet.critical_red_flags) >= 1

    # Counter-clause rewriter for liability
    proposal_liab = copilot.rewrite_clause("Customer is liable for all damages.", "liability")
    assert "twelve (12) months" in proposal_liab.counter_clause
    assert "procurement policy" in proposal_liab.negotiation_tip

    # Counter-clause rewriter for indemnity
    proposal_ind = copilot.rewrite_clause("Vendor indemnifies all claims.", "indemnification")
    assert "gross negligence" in proposal_ind.counter_clause

    # Counter-clause rewriter for termination
    proposal_term = copilot.rewrite_clause("No termination allowed.", "termination")
    assert "thirty (30) days" in proposal_term.counter_clause


# ============================================================================
# ModelContextProtocolServer Tests
# ============================================================================


def test_mcp_server_tools_and_execution() -> None:
    """Verify MCP tool enumeration and JSON execution contracts."""
    server = ModelContextProtocolServer()

    # List tools
    tools = server.list_tools()
    tool_names = [t.name for t in tools]
    assert "verify_citation" in tool_names
    assert "audit_blindspots" in tool_names
    assert "generate_attorney_checklist" in tool_names

    # Call verify_citation (valid)
    res_verify = server.call_tool(
        "verify_citation",
        {
            "clause": "Payment",
            "page": 1,
            "snippet": "pay invoices within 30 days",
            "source_text": "Customer agrees to pay invoices within 30 days of receipt.",
        },
    )
    assert res_verify["status"] == "success"
    assert res_verify["is_grounded"] is True

    # Call verify_citation (invalid)
    res_invalid_verify = server.call_tool(
        "verify_citation",
        {
            "clause": "Payment",
            "page": 1,
            "snippet": "penalty 100% per day",
            "source_text": "Customer agrees to pay invoices within 30 days of receipt.",
        },
    )
    assert res_invalid_verify["is_grounded"] is False

    # Call audit_blindspots
    res_audit = server.call_tool(
        "audit_blindspots",
        {
            "document_text": "Confidential information agreement.",
            "baseline": "mutual_nda",
            "document_id": "doc_mcp_1",
        },
    )
    assert res_audit["status"] == "success"
    assert "compliance_score" in res_audit

    # Call generate_attorney_checklist
    res_checklist = server.call_tool(
        "generate_attorney_checklist",
        {
            "document_id": "doc_mcp_2",
            "identified_risks": ["Uncapped liability", "Missing IP assignment"],
        },
    )
    assert res_checklist["status"] == "success"
    assert res_checklist["questions_count"] == 5

    # Call unknown tool
    res_unknown = server.call_tool("nonexistent_tool", {})
    assert res_unknown["status"] == "error"
