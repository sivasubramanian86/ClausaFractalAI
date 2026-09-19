"""Main FastAPI application entry point for ClausaFractalAI.

Exposes REST and SSE endpoints with dynamic security headers, CORS protection,
and liveness health probes.
"""

from contextlib import asynccontextmanager
from typing import AsyncIterator, Dict

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from config import get_settings


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

    # Security Headers Middleware
    app.add_middleware(SecurityHeadersMiddleware)

    # CORS Whitelist Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

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


app: FastAPI = create_application()
