"""Model Context Protocol (MCP) Server for ClausaFractalAI.

Exposes standardized MCP tool endpoints for citation verification,
contract blindspot auditing, and attorney consultation checklist generation.
"""

from typing import Dict, List, Optional

from pydantic import BaseModel, Field

from agents.blindspot import BlindspotDetectorAgent
from agents.copilot_actions import ActionableCopilotAgent
from agents.verification_guard import Citation, VerificationGuard
from services.rag_engine import DocumentChunk


class MCPToolParameter(BaseModel):
    """Parameter definition for an MCP tool."""

    type: str
    description: str
    required: bool = True


class MCPToolDefinition(BaseModel):
    """Schema descriptor for a Model Context Protocol tool."""

    name: str
    description: str
    parameters: Dict[str, object] = Field(default_factory=dict)


class ModelContextProtocolServer:
    """Standardized MCP Server implementing tool discovery and deterministic execution."""

    def __init__(
        self,
        blindspot_agent: Optional[BlindspotDetectorAgent] = None,
        copilot_agent: Optional[ActionableCopilotAgent] = None,
    ) -> None:
        """Initialize MCP Server with legal reasoning agents.

        Args:
            blindspot_agent: Optional BlindspotDetectorAgent instance.
            copilot_agent: Optional ActionableCopilotAgent instance.
        """
        self.blindspot_agent = blindspot_agent or BlindspotDetectorAgent()
        self.copilot_agent = copilot_agent or ActionableCopilotAgent()

    def list_tools(self) -> List[MCPToolDefinition]:
        """Enumerate all available MCP tools supported by ClausaFractalAI.

        Returns:
            List of MCPToolDefinition objects adhering to the MCP schema.
        """
        return [
            MCPToolDefinition(
                name="verify_citation",
                description=(
                    "Verify whether a cited clause and snippet exist verbatim in document text."
                ),
                parameters={
                    "type": "object",
                    "properties": {
                        "clause": {"type": "string", "description": "Section or clause title"},
                        "page": {"type": "integer", "description": "1-indexed page number"},
                        "snippet": {
                            "type": "string",
                            "description": "Exact excerpt text to verify",
                        },
                        "source_text": {
                            "type": "string",
                            "description": "Underlying document page text",
                        },
                    },
                    "required": ["clause", "page", "snippet", "source_text"],
                },
            ),
            MCPToolDefinition(
                name="audit_blindspots",
                description=(
                    "Audit a contract against baseline standard templates "
                    "(mutual_nda, saas_sla, employment_agreement)."
                ),
                parameters={
                    "type": "object",
                    "properties": {
                        "document_text": {"type": "string", "description": "Full text of contract"},
                        "baseline": {
                            "type": "string",
                            "description": "Template name to audit against",
                        },
                        "document_id": {"type": "string", "description": "Document identifier"},
                    },
                    "required": ["document_text"],
                },
            ),
            MCPToolDefinition(
                name="generate_attorney_checklist",
                description=(
                    "Generate a strategic attorney consultation prep sheet and "
                    "prioritized questions."
                ),
                parameters={
                    "type": "object",
                    "properties": {
                        "document_id": {"type": "string", "description": "Document identifier"},
                        "identified_risks": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "List of detected risk topics",
                        },
                    },
                    "required": ["document_id"],
                },
            ),
        ]

    def call_tool(self, name: str, arguments: Dict[str, object]) -> Dict[str, object]:
        """Execute a declared MCP tool and return standardized JSON result.

        Args:
            name: Tool name ('verify_citation', 'audit_blindspots', 'generate_attorney_checklist').
            arguments: Dictionary of arguments conforming to tool schema.

        Returns:
            Structured dictionary with execution result or error message.
        """
        if name == "verify_citation":
            clause = str(arguments.get("clause", "Unknown"))
            page = int(arguments.get("page", 1))  # type: ignore[arg-type]
            snippet = str(arguments.get("snippet", ""))
            source_text = str(arguments.get("source_text", ""))

            mock_chunk = DocumentChunk(
                chunk_id="mcp_chunk",
                document_id="mcp_doc",
                page_number=page,
                start_char=0,
                end_char=len(source_text),
                text=source_text,
            )
            citation = Citation(
                clause=clause,
                page=page,
                snippet=snippet,
            )
            res = VerificationGuard.verify_response(
                answer="Citation check",
                citations=[citation],
                retrieved_chunks=[mock_chunk],
            )
            is_valid = len(res.grounded_citations) > 0
            return {
                "status": "success",
                "is_grounded": is_valid,
                "clause": clause,
                "page": page,
                "verified_snippet": snippet if is_valid else None,
            }

        if name == "audit_blindspots":
            doc_text = str(arguments.get("document_text", ""))
            baseline = str(arguments.get("baseline", "mutual_nda"))
            doc_id = str(arguments.get("document_id", "doc_mcp"))

            report = self.blindspot_agent.audit(
                document_text=doc_text,
                document_id=doc_id,
                template_name=baseline,
            )
            return {
                "status": "success",
                "template": report.template_name,
                "compliance_score": report.compliance_score,
                "omitted_count": len(report.omitted_findings),
                "critical_count": report.critical_count,
                "omitted_findings": [f.model_dump() for f in report.omitted_findings],
            }

        if name == "generate_attorney_checklist":
            doc_id = str(arguments.get("document_id", "doc_mcp"))
            risks = arguments.get("identified_risks", [])
            risk_list = [str(r) for r in risks] if isinstance(risks, list) else []

            sheet = self.copilot_agent.generate_attorney_prep_sheet(
                document_id=doc_id,
                key_risks=risk_list,
            )
            return {
                "status": "success",
                "document_id": sheet.document_id,
                "executive_summary": sheet.executive_summary,
                "questions_count": len(sheet.attorney_questions),
                "questions": [q.model_dump() for q in sheet.attorney_questions],
                "leverage_points": sheet.negotiation_leverage_points,
            }

        return {
            "status": "error",
            "error": f"Unknown MCP tool: '{name}'. Use list_tools() to inspect supported tools.",
        }

    def execute_tool(self, name: str, arguments: Dict[str, object]) -> Dict[str, object]:
        """Execute a declared MCP tool or raise ValueError if unrecognized.

        Args:
            name: Tool name to execute.
            arguments: Dictionary of arguments.

        Returns:
            Dict[str, object]: Tool output payload.

        Raises:
            ValueError: If tool name is unrecognized.
        """
        res = self.call_tool(name=name, arguments=arguments)
        if res.get("status") == "error":
            raise ValueError(str(res.get("error", f"Unknown tool: {name}")))
        return res
