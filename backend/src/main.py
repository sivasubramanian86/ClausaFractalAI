"""Main FastAPI application entry point for ClausaFractalAI.

Exposes REST and SSE endpoints with dynamic security headers, CORS protection,
multimodal document ingestion, multi-agent legal reasoning, and Model Context Protocol tools.
"""

import sys
from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncIterator, Dict


def ensure_src_in_path() -> None:
    """Ensure backend src directory is on sys.path for direct module resolution."""
    _src_dir = str(Path(__file__).resolve().parent)
    if _src_dir not in sys.path:
        sys.path.insert(0, _src_dir)


ensure_src_in_path()

import time

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from agents.blindspot import BlindspotDetectorAgent
from agents.copilot_actions import ActionableCopilotAgent
from agents.critic_reflection import CriticReflectionAgent
from agents.orchestrator import LegalOrchestrator
from agents.policy_collider import PolicyColliderAgent
from agents.qa_analyst import LegalQAAnalystAgent
from agents.router import RouterAgent
from api.routes import api_router
from config import get_settings
from mcp.server import ModelContextProtocolServer
from services.audio_processor import AudioProcessor
from services.document_processor import DocumentProcessor
from services.rag_engine import RAGEngine
from telemetry import format_w3c_traceparent, logger


class TraceTelemetryMiddleware(BaseHTTPMiddleware):
    """Middleware enforcing W3C traceparent context propagation and Cloud Trace correlation."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Inject or extract W3C traceparent header and record processing duration."""
        traceparent = request.headers.get("traceparent")
        if not traceparent:
            traceparent = format_w3c_traceparent()

        start_time = time.time()
        response: Response = await call_next(request)
        duration_ms = round((time.time() - start_time) * 1000, 2)

        response.headers["traceparent"] = traceparent
        response.headers["X-Processing-Time-Ms"] = str(duration_ms)
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware enforcing defense-in-depth HTTP security headers."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Inject strict security headers into all outgoing HTTP responses.

        Args:
            request: The incoming HTTP request.
            call_next: Next request processing middleware or endpoint handler.

        Returns:
            Response: Augmented HTTP response containing security headers.
        """
        response: Response = await call_next(request)
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: blob:; "
            "connect-src 'self' http://localhost:* ws://localhost:*;"
        )
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains; preload"
        )
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=*, geolocation=()"
        return response


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Manage application startup and graceful shutdown lifecycles.

    Args:
        app: The active FastAPI application instance.

    Yields:
        None: Yields control while the application is actively serving requests.
    """
    _ = get_settings()
    yield


def create_application() -> FastAPI:
    """Factory function creating and configuring the FastAPI application.

    Returns:
        FastAPI: Configured FastAPI application instance ready for ASGI execution.
    """
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Autonomous Legal Document Intelligence & Action Platform",
        lifespan=lifespan,
    )

    # Initialize shared in-memory RAG, ingestion, and agent components
    rag_engine = RAGEngine()
    doc_processor = DocumentProcessor(rag_engine=rag_engine)
    audio_processor = AudioProcessor()

    router_agent = RouterAgent()
    qa_agent = LegalQAAnalystAgent(rag_engine=rag_engine)
    critic_agent = CriticReflectionAgent()
    blindspot_agent = BlindspotDetectorAgent()
    collider_agent = PolicyColliderAgent()
    copilot_agent = ActionableCopilotAgent()
    mcp_server = ModelContextProtocolServer(
        blindspot_agent=blindspot_agent, copilot_agent=copilot_agent
    )
    orchestrator = LegalOrchestrator(
        rag_engine=rag_engine,
        router_agent=router_agent,
        qa_agent=qa_agent,
        critic_agent=critic_agent,
        blindspot_agent=blindspot_agent,
        collider_agent=collider_agent,
        copilot_agent=copilot_agent,
    )

    app.state.rag_engine = rag_engine
    app.state.doc_processor = doc_processor
    app.state.audio_processor = audio_processor
    app.state.router_agent = router_agent
    app.state.qa_agent = qa_agent
    app.state.critic_agent = critic_agent
    app.state.blindspot_agent = blindspot_agent
    app.state.collider_agent = collider_agent
    app.state.copilot_agent = copilot_agent
    app.state.mcp_server = mcp_server
    app.state.orchestrator = orchestrator

    # Telemetry and Security Middlewares
    app.add_middleware(TraceTelemetryMiddleware)
    app.add_middleware(SecurityHeadersMiddleware)

    # CORS Whitelist Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    # Mount unified API router across standard `/api` and legacy `/api/v1` namespaces
    app.include_router(api_router, prefix="/api")
    app.include_router(api_router, prefix="/api/v1")

    @app.get("/health", tags=["Health"])
    async def health_check() -> Dict[str, str]:
        """Perform system liveness and readiness probe.

        Returns:
            Dict[str, str]: Health status, environment, and application version.
        """
        return {
            "status": "healthy",
            "app": settings.app_name,
            "version": settings.app_version,
            "environment": settings.environment,
        }

    @app.get("/", tags=["Root"])
    async def root_endpoint() -> Dict[str, str]:
        """Return root API status message.

        Returns:
            Dict[str, str]: Status message and API documentation URI.
        """
        return {
            "message": f"Welcome to {settings.app_name} API",
            "docs": "/docs",
        }

    return app


app = create_application()
