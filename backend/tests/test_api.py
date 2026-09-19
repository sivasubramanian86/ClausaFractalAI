"""Integration and unit tests for ClausaFractalAI API routes and orchestrator.

Validates SSE chat streaming, document upload variations, blindspot detection,
policy diffing, copilot actionable tools, MCP endpoints, and LegalOrchestrator workflows.
"""

from typing import List
from unittest.mock import MagicMock

import pytest
from httpx import ASGITransport, AsyncClient

from agents.orchestrator import LegalOrchestrator
from main import app
from services.rag_engine import DocumentChunk, RAGEngine

# ============================================================================
# LegalOrchestrator Tests
# ============================================================================


@pytest.mark.asyncio
async def test_orchestrator_all_intents() -> None:
    """Verify LegalOrchestrator processes every legal intent branch."""
    rag = RAGEngine()
    chunk = DocumentChunk(
        chunk_id="c1",
        document_id="doc_test",
        page_number=1,
        start_char=0,
        end_char=60,
        text="The aggregate liability shall not exceed the trailing fees.",
    )
    rag.add_chunks([chunk])

    orchestrator = LegalOrchestrator(rag_engine=rag)

    # 1. LEGAL_QA route
    res_qa = orchestrator.process_query(
        query="What is the aggregate liability?",
        document_id="doc_test",
        forced_intent="LEGAL_QA",
    )
    assert res_qa.intent == "LEGAL_QA"
    assert res_qa.quality_score >= 8.0

    # 2. BLINDSPOT_AUDIT with explicit text
    res_blindspot = orchestrator.process_query(
        query="Audit blindspots",
        document_id="doc_test",
        document_text="Confidentiality shall be protected for three years.",
        forced_intent="BLINDSPOT_AUDIT",
    )
    assert res_blindspot.intent == "BLINDSPOT_AUDIT"
    assert res_blindspot.blindspot_report is not None

    # 3. BLINDSPOT_AUDIT with text pulled from RAG
    res_blindspot_rag = orchestrator.process_query(
        query="Audit blindspots",
        document_id="doc_test",
        document_text="",
        forced_intent="BLINDSPOT_AUDIT",
    )
    assert res_blindspot_rag.intent == "BLINDSPOT_AUDIT"
    assert res_blindspot_rag.blindspot_report is not None

    # 4. POLICY_DIFF with explicit text
    res_diff = orchestrator.process_query(
        query="Compare policy drafts",
        document_id="doc_test",
        document_text="Liability cap is $50,000.",
        comparison_text="Liability cap is unlimited.",
        forced_intent="POLICY_DIFF",
    )
    assert res_diff.intent == "POLICY_DIFF"
    assert res_diff.collision_report is not None

    # 5. POLICY_DIFF with text pulled from RAG
    res_diff_rag = orchestrator.process_query(
        query="Compare policy drafts",
        document_id="doc_test",
        document_text="",
        comparison_text="Liability cap is unlimited.",
        forced_intent="POLICY_DIFF",
    )
    assert res_diff_rag.intent == "POLICY_DIFF"
    assert res_diff_rag.collision_report is not None

    # 6. ATTORNEY_PREP
    res_prep = orchestrator.process_query(
        query="Prepare for attorney meeting",
        document_id="doc_test",
        forced_intent="ATTORNEY_PREP",
    )
    assert res_prep.intent == "ATTORNEY_PREP"
    assert res_prep.attorney_prep_sheet is not None

    # 7. CLAUSE_REWRITE
    res_rewrite = orchestrator.process_query(
        query="The customer assumes unlimited liability.",
        forced_intent="CLAUSE_REWRITE",
    )
    assert res_rewrite.intent == "CLAUSE_REWRITE"
    assert res_rewrite.counter_clause is not None

    # 8. Unforced auto-routing
    res_auto = orchestrator.process_query(query="What is the liability cap?")
    assert res_auto.intent == "LEGAL_QA"


@pytest.mark.asyncio
async def test_orchestrator_stream_chat_sse() -> None:
    """Verify stream_chat yields intent, token, citation, and done SSE events."""
    rag = RAGEngine()
    chunk = DocumentChunk(
        chunk_id="c1",
        document_id="doc_stream",
        page_number=1,
        start_char=0,
        end_char=50,
        text="All notices shall be delivered in writing via email.",
    )
    rag.add_chunks([chunk])
    orchestrator = LegalOrchestrator(rag_engine=rag)

    events: List[str] = []
    async for sse_chunk in orchestrator.stream_chat(
        query="How must notices be delivered?",
        document_id="doc_stream",
    ):
        events.append(sse_chunk)

    assert len(events) >= 4
    full_stream = "".join(events)
    assert "event: intent" in full_stream
    assert "event: token" in full_stream
    assert "event: citation" in full_stream
    assert "event: done" in full_stream
    assert "completed" in full_stream


# ============================================================================
# API Routes Integration Tests
# ============================================================================


@pytest.mark.asyncio
async def test_api_chat_sse_and_json() -> None:
    """Verify POST /api/chat supports both SSE stream and JSON output."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Stream=True (SSE)
        resp_stream = await client.post(
            "/api/chat",
            json={
                "query": "What is the liability policy?",
                "document_id": "doc_chat",
                "complexity": "STANDARD",
                "stream": True,
            },
        )
        assert resp_stream.status_code == 200
        assert "text/event-stream" in resp_stream.headers["content-type"]
        body = resp_stream.text
        assert "event: intent" in body
        assert "event: done" in body

        # Stream=False (JSON)
        resp_json = await client.post(
            "/api/chat",
            json={
                "query": "What is the liability policy?",
                "document_id": "doc_chat",
                "complexity": "STANDARD",
                "stream": False,
            },
        )
        assert resp_json.status_code == 200
        data = resp_json.json()
        assert "intent" in data
        assert "answer" in data


@pytest.mark.asyncio
async def test_api_documents_upload_json_body() -> None:
    """Verify POST /api/documents/upload accepts JSON body with text."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post(
            "/api/documents/upload",
            json={"text": "Client agrees to maintain insurance.", "filename": "insure.txt"},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["filename"] == "insure.txt"
        assert len(data["chunks"]) >= 1


@pytest.mark.asyncio
async def test_api_blindspots_with_and_without_text() -> None:
    """Verify POST /api/blindspots with explicit text and RAG-stored text."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Explicit text
        resp = await client.post(
            "/api/blindspots",
            json={
                "document_id": "doc_b1",
                "text": "Confidential information shall be kept secret.",
                "template_name": "mutual_nda",
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["template_name"] == "mutual_nda"
        assert "compliance_score" in data

        # Without text (retrieves chunks from state)
        resp_rag = await client.post(
            "/api/blindspots",
            json={
                "document_id": "doc_b1",
                "template_name": "mutual_nda",
            },
        )
        assert resp_rag.status_code == 200


@pytest.mark.asyncio
async def test_api_diff_with_and_without_text() -> None:
    """Verify POST /api/diff with explicit texts and RAG-stored texts."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Explicit texts
        resp = await client.post(
            "/api/diff",
            json={
                "doc_a_id": "v1",
                "doc_b_id": "v2",
                "doc_a_text": "Termination notice: 30 days.",
                "doc_b_text": "Termination notice: 60 days.",
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_shifts_detected"] >= 1
        assert "overall_verdict" in data

        # Without text (retrieves from RAG state)
        resp_rag = await client.post(
            "/api/diff",
            json={
                "doc_a_id": "v1",
                "doc_b_id": "v2",
            },
        )
        assert resp_rag.status_code == 200


@pytest.mark.asyncio
async def test_api_copilot_endpoints() -> None:
    """Verify POST /api/copilot/attorney-prep and /api/copilot/rewrite-clause."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Attorney Prep
        resp_prep = await client.post(
            "/api/copilot/attorney-prep",
            json={"document_id": "doc_prep_test", "key_risks": ["Uncapped liability"]},
        )
        assert resp_prep.status_code == 200
        data_prep = resp_prep.json()
        assert "executive_summary" in data_prep
        assert len(data_prep["attorney_questions"]) >= 1

        # Rewrite Clause
        resp_rewrite = await client.post(
            "/api/copilot/rewrite-clause",
            json={"clause_text": "Customer shall indemnify Vendor.", "clause_type": "indemnity"},
        )
        assert resp_rewrite.status_code == 200
        data_rewrite = resp_rewrite.json()
        assert "counter_clause" in data_rewrite
        assert "strategic_rationale" in data_rewrite


@pytest.mark.asyncio
async def test_api_audio_transcribe_missing_file() -> None:
    """Verify POST /api/audio/transcribe rejects missing audio attachment with 422."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post("/api/audio/transcribe")
        assert resp.status_code == 422
        assert "Audio file required" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_api_mcp_exceptions() -> None:
    """Verify POST /api/mcp/call handles unknown tools (404) and server errors (500)."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Unknown tool -> 404
        resp_404 = await client.post(
            "/api/mcp/call",
            json={"name": "non_existent_tool", "arguments": {}},
        )
        assert resp_404.status_code == 404
        assert "Unknown MCP tool" in resp_404.json()["detail"]

        # Mock exception in MCP server -> 500
        mock_mcp = MagicMock()
        mock_mcp.execute_tool.side_effect = RuntimeError("Internal server error")
        orig_mcp = app.state.mcp_server
        app.state.mcp_server = mock_mcp
        try:
            resp_500 = await client.post(
                "/api/mcp/call",
                json={"name": "verify_citation", "arguments": {}},
            )
            assert resp_500.status_code == 500
            assert "MCP tool execution failed" in resp_500.json()["detail"]
        finally:
            app.state.mcp_server = orig_mcp
