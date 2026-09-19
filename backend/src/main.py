"""Main FastAPI application entry point for ClausaFractalAI.

Exposes REST and SSE endpoints with dynamic security headers, CORS protection,
multimodal document ingestion, multi-agent legal reasoning, and Model Context Protocol tools.
"""

from contextlib import asynccontextmanager
from typing import AsyncIterator, Dict, List, Optional

from fastapi import FastAPI, File, Form, HTTPException, Request, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from agents.blindspot import BlindspotDetectorAgent, BlindspotReport
from agents.copilot_actions import (
    ActionableCopilotAgent,
    AttorneyPrepSheet,
    CounterClauseProposal,
)
from agents.critic_reflection import CriticReflectionAgent
from agents.policy_collider import PolicyColliderAgent, PolicyCollisionReport
from agents.qa_analyst import LegalQAAnalystAgent, QAResponse
from agents.router import RouterAgent, RouterResult
from config import get_settings
from mcp.server import MCPToolDefinition, ModelContextProtocolServer
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


class RouteRequest(BaseModel):
    """Request payload for user intent classification."""

    query: str


class QARequest(BaseModel):
    """Request payload for deep legal question answering."""

    query: str
    complexity_level: str = "STANDARD"


class BlindspotRequest(BaseModel):
    """Request payload for contract blindspot auditing."""

    text: str
    template_name: str = "mutual_nda"
    document_id: str = "doc_audit"


class PolicyDiffRequest(BaseModel):
    """Request payload for comparing two policy or contract drafts."""

    doc_a_text: str
    doc_b_text: str
    doc_a_id: str = "v1"
    doc_b_id: str = "v2"


class AttorneyPrepRequest(BaseModel):
    """Request payload for generating attorney consultation materials."""

    document_id: str = "doc_prep"
    key_risks: List[str] = Field(default_factory=list)


class RewriteRequest(BaseModel):
    """Request payload for drafting a favorable counter-clause."""

    clause_text: str
    clause_type: str = "liability"


class MCPCallRequest(BaseModel):
    """Request payload for executing a Model Context Protocol tool."""

    name: str
    arguments: Dict[str, object] = Field(default_factory=dict)


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

    # ========================================================================
    # Multi-Agent State Graph REST Endpoints
    # ========================================================================

    @app.post(
        "/api/v1/agents/route",
        response_model=RouterResult,
        tags=["Agent Graph"],
    )
    async def route_intent(request: RouteRequest) -> RouterResult:
        """Classify user query intent into the appropriate legal agent workflow."""
        return router_agent.classify(query=request.query)

    @app.post(
        "/api/v1/agents/qa",
        response_model=QAResponse,
        tags=["Agent Graph"],
    )
    async def legal_qa(request: QARequest) -> QAResponse:
        """Perform deep legal question answering with citation grounding and reflection review."""
        qa_resp = qa_agent.answer_query(
            query=request.query, complexity_level=request.complexity_level
        )
        # Execute critic reflection review
        if qa_resp.is_grounded and qa_resp.citations:
            review_res = critic_agent.review(
                query=request.query,
                answer=qa_resp.answer,
                citations=qa_resp.citations,
                retrieved_chunks=rag_engine.chunks,
            )
            qa_resp.answer = review_res.improved_answer
        return qa_resp

    @app.post(
        "/api/v1/agents/blindspots",
        response_model=BlindspotReport,
        tags=["Agent Graph"],
    )
    async def detect_blindspots(request: BlindspotRequest) -> BlindspotReport:
        """Audit contract text against baseline enterprise schemas to uncover omitted terms."""
        return blindspot_agent.audit(
            document_text=request.text,
            document_id=request.document_id,
            template_name=request.template_name,
        )

    @app.post(
        "/api/v1/agents/policy-diff",
        response_model=PolicyCollisionReport,
        tags=["Agent Graph"],
    )
    async def policy_diff(request: PolicyDiffRequest) -> PolicyCollisionReport:
        """Compare two contract or policy drafts to construct the Practical Impact Matrix."""
        return collider_agent.compare(
            doc_a_text=request.doc_a_text,
            doc_b_text=request.doc_b_text,
            doc_a_id=request.doc_a_id,
            doc_b_id=request.doc_b_id,
        )

    @app.post(
        "/api/v1/agents/attorney-prep",
        response_model=AttorneyPrepSheet,
        tags=["Agent Copilot"],
    )
    async def attorney_prep(request: AttorneyPrepRequest) -> AttorneyPrepSheet:
        """Generate a strategic consultation prep sheet and prioritized attorney questions."""
        return copilot_agent.generate_attorney_prep_sheet(
            document_id=request.document_id,
            key_risks=request.key_risks,
        )

    @app.post(
        "/api/v1/agents/rewrite-clause",
        response_model=CounterClauseProposal,
        tags=["Agent Copilot"],
    )
    async def rewrite_clause(request: RewriteRequest) -> CounterClauseProposal:
        """Draft a favorable, balanced counter-clause proposal with strategic negotiation tips."""
        return copilot_agent.rewrite_clause(
            clause_text=request.clause_text,
            clause_type=request.clause_type,
        )

    # ========================================================================
    # Model Context Protocol (MCP) Endpoints
    # ========================================================================

    @app.get(
        "/api/v1/mcp/tools",
        response_model=List[MCPToolDefinition],
        tags=["Model Context Protocol"],
    )
    async def list_mcp_tools() -> List[MCPToolDefinition]:
        """List all registered MCP tools and JSON schemas."""
        return mcp_server.list_tools()

    @app.post(
        "/api/v1/mcp/call",
        tags=["Model Context Protocol"],
    )
    async def call_mcp_tool(request: MCPCallRequest) -> Dict[str, object]:
        """Execute a declared Model Context Protocol tool."""
        return mcp_server.call_tool(name=request.name, arguments=request.arguments)

    return app


app: FastAPI = create_application()
