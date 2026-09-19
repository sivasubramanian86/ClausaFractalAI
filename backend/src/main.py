"""Main FastAPI application entry point for ClausaFractalAI.

Exposes REST and SSE endpoints with dynamic security headers, CORS protection,
multimodal document ingestion, voice dictation transcription, and hybrid RAG querying.
"""

from contextlib import asynccontextmanager
from typing import AsyncIterator, Dict, Optional

from fastapi import FastAPI, File, Form, HTTPException, Request, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from config import get_settings
from services.audio_processor import AudioProcessor, AudioTranscriptionResult
from services.document_processor import DocumentProcessor, ProcessedDocument
from services.rag_engine import QueryResult, RAGEngine


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


class TextUploadRequest(BaseModel):
    """Request payload for raw contract text ingestion."""

    text: str
    filename: str = "contract.txt"


class QueryRequest(BaseModel):
    """Request payload for RAG semantic search and graph triple reasoning."""

    query: str
    top_k: int = Field(default=5, ge=1, le=20)


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

    # Initialize shared in-memory RAG and ingestion components
    rag_engine = RAGEngine()
    doc_processor = DocumentProcessor(rag_engine=rag_engine)
    audio_processor = AudioProcessor()

    app.state.rag_engine = rag_engine
    app.state.doc_processor = doc_processor
    app.state.audio_processor = audio_processor

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

    @app.post(
        "/api/v1/documents/upload",
        response_model=ProcessedDocument,
        tags=["Document Ingestion"],
    )
    async def upload_document(
        file: Optional[UploadFile] = File(None),
        text: Optional[str] = Form(None),
        filename: Optional[str] = Form(None),
    ) -> ProcessedDocument:
        """Ingest and process a contract document (PDF binary or plain text).

        Args:
            file: Optional uploaded file (PDF).
            text: Optional plain text content.
            filename: Optional document filename.

        Returns:
            ProcessedDocument containing chunks, redactions, and graph triples.

        Raises:
            HTTPException: If neither file nor text is provided.
        """
        if file is not None:
            content = await file.read()
            fname = file.filename or "uploaded.pdf"
            if fname.lower().endswith(".pdf"):
                return doc_processor.process_pdf(pdf_bytes=content, filename=fname)
            # Process non-pdf text files
            text_content = content.decode("utf-8", errors="replace")
            return doc_processor.process_text(raw_text=text_content, filename=fname)

        if text is not None and text.strip():
            fname = filename or "pasted_contract.txt"
            return doc_processor.process_text(raw_text=text, filename=fname)

        raise HTTPException(
            status_code=400,
            detail="Must provide either a file upload or text content.",
        )

    @app.post(
        "/api/v1/audio/transcribe",
        response_model=AudioTranscriptionResult,
        tags=["Multimodal Audio"],
    )
    async def transcribe_audio(
        file: UploadFile = File(...),
    ) -> AudioTranscriptionResult:
        """Transcribe a spoken audio clip from the microphone.

        Args:
            file: Uploaded audio file (WebM, WAV, MP3).

        Returns:
            AudioTranscriptionResult containing verbatim transcript.
        """
        content = await file.read()
        mime_type = file.content_type or "audio/webm"
        return audio_processor.transcribe(audio_bytes=content, mime_type=mime_type)

    @app.post(
        "/api/v1/rag/query",
        response_model=QueryResult,
        tags=["Multi-Agentic RAG"],
    )
    async def rag_query(request: QueryRequest) -> QueryResult:
        """Execute hybrid semantic vector search and legal knowledge graph retrieval.

        Args:
            request: Search query and top_k parameter.

        Returns:
            QueryResult containing top chunks, legal triples, and uncertainty status.
        """
        return rag_engine.query(query_text=request.query, top_k=request.top_k)

    return app


app: FastAPI = create_application()
