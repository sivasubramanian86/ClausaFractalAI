"""API route definitions for ClausaFractalAI.

Provides modular endpoints for document ingestion, real-time SSE chat streaming,
blindspot detection, policy collision analysis, copilot actionable tools, and MCP servers.
"""

from typing import Dict, List, Optional

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from agents.blindspot import BlindspotReport
from agents.copilot_actions import AttorneyPrepSheet, CounterClauseProposal
from agents.orchestrator import LegalOrchestrator
from agents.policy_collider import PolicyCollisionReport
from agents.qa_analyst import QAResponse
from agents.router import RouterResult
from mcp.server import MCPToolDefinition
from services.audio_processor import AudioTranscriptionResult
from services.document_processor import ProcessedDocument
from services.rag_engine import QueryResult

api_router = APIRouter()


class TextUploadRequest(BaseModel):
    """Payload for raw text contract upload."""

    text: str
    filename: str = "contract.txt"


class QueryRequest(BaseModel):
    """Payload for RAG retrieval and contradiction checking."""

    query: str
    top_k: int = Field(default=5, ge=1, le=20)


class RouteRequest(BaseModel):
    """Payload for query routing and intent detection."""

    query: str


class QARequest(BaseModel):
    """Payload for direct legal question answering."""

    query: str
    complexity_level: str = "STANDARD"


class ChatRequest(BaseModel):
    """Payload for multi-agent conversational consultation."""

    query: str
    document_id: str = "doc_default"
    complexity: str = "STANDARD"
    stream: bool = True


class BlindspotRequest(BaseModel):
    """Payload for missing clause audit."""

    document_id: str = "doc_audit"
    text: Optional[str] = None
    template_name: str = "mutual_nda"


class PolicyDiffRequest(BaseModel):
    """Payload for comparing two contract drafts or policy versions."""

    doc_a_id: str = "doc_v1"
    doc_b_id: str = "doc_v2"
    doc_a_text: Optional[str] = None
    doc_b_text: Optional[str] = None


class AttorneyPrepRequest(BaseModel):
    """Payload for generating attorney consultation prep sheets."""

    document_id: str = "doc_prep"
    key_risks: List[str] = Field(default_factory=list)


class RewriteRequest(BaseModel):
    """Payload for drafting counter-proposals."""

    clause_text: str
    clause_type: str = "liability"


class MCPCallRequest(BaseModel):
    """Payload for executing an MCP tool contract."""

    name: str
    arguments: Dict[str, object] = Field(default_factory=dict)


# ============================================================================
# Document Ingestion & Multimodal Audio Endpoints
# ============================================================================


@api_router.post("/documents/upload", response_model=ProcessedDocument, tags=["Documents"])
async def upload_document(
    request: Request,
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    filename: Optional[str] = Form(None),
) -> ProcessedDocument:
    """Ingest, scrub PII, prune boilerplate, and index a legal document.

    Args:
        request: Active FastAPI request containing application state.
        file: Optional uploaded file (PDF or text).
        text: Optional raw text passed via form parameter.
        filename: Optional filename label.

    Returns:
        ProcessedDocument containing sanitized text, chunks, and metadata.

    Raises:
        HTTPException: If no content is provided or upload fails.
    """
    doc_processor = request.app.state.doc_processor

    if file is not None:
        file_bytes = await file.read()
        target_filename = file.filename or "uploaded_contract.pdf"
        if target_filename.lower().endswith(".pdf"):
            return doc_processor.process_pdf(pdf_bytes=file_bytes, filename=target_filename)
        text_content = file_bytes.decode("utf-8", errors="replace")
        return doc_processor.process_text(raw_text=text_content, filename=target_filename)

    if text is not None and text.strip():
        target_filename = filename or "pasted_contract.txt"
        return doc_processor.process_text(raw_text=text, filename=target_filename)

    # Fallback to JSON body if provided
    try:
        body = await request.json()
        req_obj = TextUploadRequest(**body)
        return doc_processor.process_text(
            raw_text=req_obj.text,
            filename=req_obj.filename,
        )
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Must provide either file or text content for ingestion.",
        ) from None


@api_router.post("/audio/transcribe", response_model=AudioTranscriptionResult, tags=["Audio"])
async def transcribe_audio(
    request: Request,
    file: Optional[UploadFile] = File(None),
) -> AudioTranscriptionResult:
    """Transcribe spoken attorney notes or voice queries into clean legal text.

    Args:
        request: Active FastAPI request.
        file: Audio file attachment (WAV, MP3, M4A, etc.).

    Returns:
        AudioTranscriptionResult containing transcribed text and metadata.

    Raises:
        HTTPException: If no audio payload is attached.
    """
    if file is None:
        raise HTTPException(status_code=422, detail="Audio file required.")

    audio_processor = request.app.state.audio_processor
    audio_bytes = await file.read()
    mime_type = file.content_type or "audio/wav"

    return audio_processor.transcribe(audio_bytes=audio_bytes, mime_type=mime_type)


@api_router.post("/rag/query", response_model=QueryResult, tags=["RAG"])
async def query_rag(
    request: Request,
    query_req: QueryRequest,
) -> QueryResult:
    """Query semantic vector space and knowledge graph triples.

    Args:
        request: Active FastAPI request.
        query_req: QueryRequest containing search query and top_k limit.

    Returns:
        QueryResult with ranked chunks, contradiction flags, and certainty score.
    """
    rag_engine = request.app.state.rag_engine
    return rag_engine.query(query=query_req.query, top_k=query_req.top_k)


# ============================================================================
# Multi-Agent State Graph & Real-Time Chat Streaming Endpoints
# ============================================================================


@api_router.post("/chat", tags=["Agents"])
async def chat_endpoint(
    request: Request,
    chat_req: ChatRequest,
) -> object:
    """Stream or batch multi-agent legal consultation answers.

    Args:
        request: Active FastAPI request.
        chat_req: ChatRequest specifying query, document ID, and complexity mode.

    Returns:
        StreamingResponse (SSE) if stream=True, or OrchestratedResponse if stream=False.
    """
    orchestrator: LegalOrchestrator = request.app.state.orchestrator

    if chat_req.stream:
        return StreamingResponse(
            orchestrator.stream_chat(
                query=chat_req.query,
                document_id=chat_req.document_id,
                complexity_level=chat_req.complexity,
            ),
            media_type="text/event-stream",
        )

    return orchestrator.process_query(
        query=chat_req.query,
        document_id=chat_req.document_id,
        complexity_level=chat_req.complexity,
    )


@api_router.post("/agents/route", response_model=RouterResult, tags=["Agents"])
async def route_query(
    request: Request,
    route_req: RouteRequest,
) -> RouterResult:
    """Classify user query into specialized legal reasoning workflows.

    Args:
        request: Active FastAPI request.
        route_req: RouteRequest containing user query string.

    Returns:
        RouterResult containing selected intent and confidence score.
    """
    router_agent = request.app.state.router_agent
    return router_agent.classify(query=route_req.query)


@api_router.post("/agents/qa", response_model=QAResponse, tags=["Agents"])
async def direct_qa(
    request: Request,
    qa_req: QARequest,
) -> QAResponse:
    """Execute direct grounded QA analysis with reflection review.

    Args:
        request: Active FastAPI request.
        qa_req: QARequest containing query and complexity tier.

    Returns:
        QAResponse with answer text, citations, and ground truth veracity flags.
    """
    qa_agent = request.app.state.qa_agent
    critic_agent = request.app.state.critic_agent

    raw_qa = qa_agent.answer_query(
        query=qa_req.query,
        complexity_level=qa_req.complexity_level,
    )

    critic_res = critic_agent.review(
        query=qa_req.query,
        answer=raw_qa.answer,
        citations=raw_qa.citations,
        retrieved_chunks=raw_qa.retrieved_chunks,
    )

    return QAResponse(
        answer=critic_res.improved_answer,
        citations=critic_res.verified_citations,
        is_grounded=critic_res.passed,
        retrieved_chunks=raw_qa.retrieved_chunks,
        complexity_level=qa_req.complexity_level,
    )


@api_router.post("/blindspots", response_model=BlindspotReport, tags=["Agents"])
@api_router.post("/agents/blindspots", response_model=BlindspotReport, tags=["Agents"])
async def audit_blindspots(
    request: Request,
    blindspot_req: BlindspotRequest,
) -> BlindspotReport:
    """Audit document against baseline templates to detect omitted protective clauses.

    Args:
        request: Active FastAPI request.
        blindspot_req: BlindspotRequest with text, document ID, and template name.

    Returns:
        BlindspotReport with compliance score and categorized omissions.
    """
    blindspot_agent = request.app.state.blindspot_agent
    text = blindspot_req.text

    if not text:
        rag_engine = request.app.state.rag_engine
        chunks = rag_engine.get_document_chunks(blindspot_req.document_id)
        text = " ".join(c.text for c in chunks)

    return blindspot_agent.audit(
        document_text=text,
        document_id=blindspot_req.document_id,
        template_name=blindspot_req.template_name,
    )


@api_router.post("/diff", response_model=PolicyCollisionReport, tags=["Agents"])
@api_router.post("/agents/policy-diff", response_model=PolicyCollisionReport, tags=["Agents"])
async def policy_diff(
    request: Request,
    diff_req: PolicyDiffRequest,
) -> PolicyCollisionReport:
    """Analyze contract versions and output Practical Impact Matrix.

    Args:
        request: Active FastAPI request.
        diff_req: PolicyDiffRequest containing two documents or texts.

    Returns:
        PolicyCollisionReport with impact items and overall strategic verdict.
    """
    collider_agent = request.app.state.collider_agent
    doc_a_text = diff_req.doc_a_text or ""
    doc_b_text = diff_req.doc_b_text or ""

    rag_engine = request.app.state.rag_engine
    if not doc_a_text:
        chunks_a = rag_engine.get_document_chunks(diff_req.doc_a_id)
        doc_a_text = " ".join(c.text for c in chunks_a)

    if not doc_b_text:
        chunks_b = rag_engine.get_document_chunks(diff_req.doc_b_id)
        doc_b_text = " ".join(c.text for c in chunks_b)

    return collider_agent.compare(
        doc_a_text=doc_a_text,
        doc_b_text=doc_b_text,
        doc_a_id=diff_req.doc_a_id,
        doc_b_id=diff_req.doc_b_id,
    )


@api_router.post(
    "/copilot/attorney-prep",
    response_model=AttorneyPrepSheet,
    tags=["Copilot Actions"],
)
@api_router.post(
    "/agents/attorney-prep",
    response_model=AttorneyPrepSheet,
    tags=["Copilot Actions"],
)
async def generate_attorney_prep(
    request: Request,
    prep_req: AttorneyPrepRequest,
) -> AttorneyPrepSheet:
    """Generate executive consultation prep sheet with tailored questions and leverage points.

    Args:
        request: Active FastAPI request.
        prep_req: AttorneyPrepRequest specifying document ID and detected red flags.

    Returns:
        AttorneyPrepSheet ready for legal consultation.
    """
    copilot_agent = request.app.state.copilot_agent
    return copilot_agent.generate_attorney_prep_sheet(
        document_id=prep_req.document_id,
        key_risks=prep_req.key_risks or None,
    )


@api_router.post(
    "/copilot/rewrite-clause",
    response_model=CounterClauseProposal,
    tags=["Copilot Actions"],
)
@api_router.post(
    "/agents/rewrite-clause",
    response_model=CounterClauseProposal,
    tags=["Copilot Actions"],
)
async def rewrite_clause_endpoint(
    request: Request,
    rewrite_req: RewriteRequest,
) -> CounterClauseProposal:
    """Draft a commercially balanced, protective counter-clause proposal.

    Args:
        request: Active FastAPI request.
        rewrite_req: RewriteRequest containing clause text and category.

    Returns:
        CounterClauseProposal with counter-clause, strategic rationale, and negotiation tip.
    """
    copilot_agent = request.app.state.copilot_agent
    return copilot_agent.rewrite_clause(
        clause_text=rewrite_req.clause_text,
        clause_type=rewrite_req.clause_type,
    )


# ============================================================================
# Model Context Protocol (MCP) Endpoints
# ============================================================================


@api_router.get("/mcp/tools", response_model=List[MCPToolDefinition], tags=["MCP"])
async def list_mcp_tools(request: Request) -> List[MCPToolDefinition]:
    """Expose available MCP tool specifications for external agent runtimes.

    Args:
        request: Active FastAPI request.

    Returns:
        List[MCPToolDefinition] containing available MCP tools and JSON schemas.
    """
    mcp_server = request.app.state.mcp_server
    return mcp_server.list_tools()


@api_router.post("/mcp/call", tags=["MCP"])
async def call_mcp_tool(request: Request, call_req: MCPCallRequest) -> Dict[str, object]:
    """Execute an MCP tool invocation dynamically.

    Args:
        request: Active FastAPI request.
        call_req: MCPCallRequest containing tool name and argument dictionary.

    Returns:
        Dict[str, object]: Result produced by the tool execution.

    Raises:
        HTTPException: If tool name is unrecognized or execution fails.
    """
    mcp_server = request.app.state.mcp_server
    try:
        return mcp_server.execute_tool(name=call_req.name, arguments=call_req.arguments)
    except ValueError as val_err:
        raise HTTPException(status_code=404, detail=str(val_err)) from val_err
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"MCP tool execution failed: {err}") from err
