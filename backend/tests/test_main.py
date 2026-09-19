"""Tests for main FastAPI application endpoints and security headers middleware."""

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
