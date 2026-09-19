"""Tests for main FastAPI application endpoints and security headers middleware."""

import io

import pypdf
import pytest
from httpx import ASGITransport, AsyncClient

from main import app, lifespan


@pytest.mark.asyncio
async def test_lifespan() -> None:
    """Verify that lifespan initializes settings and yields successfully."""
    async with lifespan(app):
        pass


@pytest.mark.asyncio
async def test_health_check_endpoint() -> None:
    """Verify that the /health endpoint returns 200 OK with correct payload."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["app"] == "ClausaFractalAI"
        assert data["version"] == "1.0.0"


@pytest.mark.asyncio
async def test_root_endpoint() -> None:
    """Verify that the root / endpoint returns welcome message."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "Welcome" in data["message"]
        assert data["docs"] == "/docs"


@pytest.mark.asyncio
async def test_security_headers_present() -> None:
    """Verify that all defense-in-depth security headers are injected into responses."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
        assert "Content-Security-Policy" in response.headers
        assert "default-src 'self'" in response.headers["Content-Security-Policy"]
        assert "Strict-Transport-Security" in response.headers
        assert response.headers["X-Content-Type-Options"] == "nosniff"
        assert response.headers["X-Frame-Options"] == "DENY"
        assert response.headers["Referrer-Policy"] == "strict-origin-when-cross-origin"
        assert "microphone=*" in response.headers["Permissions-Policy"]


@pytest.mark.asyncio
async def test_upload_document_text_form() -> None:
    """Verify document upload endpoint with form text content."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/documents/upload",
            data={"text": "Party A shall deliver reports.", "filename": "sample.txt"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["filename"] == "sample.txt"
        assert data["page_count"] == 1
        assert len(data["chunks"]) >= 1


@pytest.mark.asyncio
async def test_upload_document_pdf_file() -> None:
    """Verify document upload endpoint with PDF binary file."""
    writer = pypdf.PdfWriter()
    writer.add_blank_page(width=100, height=100)
    buf = io.BytesIO()
    writer.write(buf)
    pdf_bytes = buf.getvalue()

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        files = {"file": ("contract.pdf", pdf_bytes, "application/pdf")}
        response = await client.post("/api/v1/documents/upload", files=files)
        assert response.status_code == 200
        data = response.json()
        assert data["filename"] == "contract.pdf"
        assert data["page_count"] == 1


@pytest.mark.asyncio
async def test_upload_document_text_file() -> None:
    """Verify document upload endpoint with non-PDF text file."""
    text_bytes = b"Contractor agrees to indemnify Client for all breach actions."
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        files = {"file": ("agreement.txt", text_bytes, "text/plain")}
        response = await client.post("/api/v1/documents/upload", files=files)
        assert response.status_code == 200
        data = response.json()
        assert data["filename"] == "agreement.txt"


@pytest.mark.asyncio
async def test_upload_document_missing_payload() -> None:
    """Verify document upload endpoint rejects empty request with 400."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/v1/documents/upload")
        assert response.status_code == 400
        assert "Must provide either" in response.json()["detail"]


@pytest.mark.asyncio
async def test_audio_transcription_endpoint() -> None:
    """Verify audio transcription endpoint accepts audio file upload."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        files = {"file": ("voice_clip.webm", b"audio-binary-stream", "audio/webm")}
        response = await client.post("/api/v1/audio/transcribe", files=files)
        assert response.status_code == 200
        data = response.json()
        assert "transcript" in data
        assert "confidence" in data


@pytest.mark.asyncio
async def test_rag_query_endpoint() -> None:
    """Verify RAG query endpoint retrieves results and uncertainty flags."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {"query": "Who is liable?", "top_k": 3}
        response = await client.post("/api/v1/rag/query", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "query" in data
        assert "is_uncertain" in data


@pytest.mark.asyncio
async def test_agents_route_endpoint() -> None:
    """Verify intent routing endpoint classifies user query."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/agents/route", json={"query": "Audit blindspots in NDA"}
        )
        assert response.status_code == 200
        assert response.json()["intent"] == "BLINDSPOT_AUDIT"


@pytest.mark.asyncio
async def test_agents_qa_endpoint_unindexed() -> None:
    """Verify QA endpoint returns unknown message on ungrounded query."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/agents/qa", json={"query": "What is the penalty?", "complexity_level": "ELI5"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "cannot determine" in data["answer"]


@pytest.mark.asyncio
async def test_agents_qa_endpoint_grounded_with_reflection() -> None:
    """Verify QA endpoint with grounded context triggers critic reflection review."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Ingest document so RAG engine has chunks
        await client.post(
            "/api/v1/documents/upload",
            data={
                "text": "The Vendor agrees to deliver quarterly audit reports within 30 days.",
                "filename": "audit_agreement.txt",
            },
        )
        # 2. Query QA endpoint
        response = await client.post(
            "/api/v1/agents/qa",
            json={"query": "quarterly audit reports", "complexity_level": "STANDARD"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["is_grounded"] is True
        assert len(data["citations"]) >= 1


@pytest.mark.asyncio
async def test_agents_blindspots_endpoint() -> None:
    """Verify contract blindspot detection endpoint."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/agents/blindspots",
            json={
                "text": "Short NDA without liability cap.",
                "template_name": "mutual_nda",
                "document_id": "doc_101",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert "compliance_score" in data
        assert len(data["omitted_findings"]) >= 1


@pytest.mark.asyncio
async def test_agents_policy_diff_endpoint() -> None:
    """Verify policy collision diff endpoint."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/agents/policy-diff",
            json={
                "doc_a_text": "Data retention 30 days.",
                "doc_b_text": "Data retention indefinite with waiver.",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["total_shifts_detected"] >= 1
        assert "impact_matrix" in data


@pytest.mark.asyncio
async def test_agents_attorney_prep_endpoint() -> None:
    """Verify attorney preparation sheet generation endpoint."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/agents/attorney-prep",
            json={"document_id": "doc_202", "key_risks": ["Uncapped damages"]},
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data["attorney_questions"]) == 5
        assert len(data["negotiation_leverage_points"]) >= 3


@pytest.mark.asyncio
async def test_agents_rewrite_clause_endpoint() -> None:
    """Verify counter-clause proposal rewriting endpoint."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/agents/rewrite-clause",
            json={"clause_text": "Customer assumes all risks.", "clause_type": "liability"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "twelve (12) months" in data["counter_clause"]


@pytest.mark.asyncio
async def test_mcp_endpoints() -> None:
    """Verify MCP list tools and tool invocation endpoints."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # GET tools
        tools_resp = await client.get("/api/v1/mcp/tools")
        assert tools_resp.status_code == 200
        tools = tools_resp.json()
        assert len(tools) == 3

        # POST call
        call_resp = await client.post(
            "/api/v1/mcp/call",
            json={
                "name": "generate_attorney_checklist",
                "arguments": {"document_id": "mcp_test_doc"},
            },
        )
        assert call_resp.status_code == 200
        assert call_resp.json()["status"] == "success"
