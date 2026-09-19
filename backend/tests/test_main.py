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
