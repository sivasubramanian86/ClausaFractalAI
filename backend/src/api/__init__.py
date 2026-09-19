"""API package for ClausaFractalAI.

Exposes REST and SSE endpoints for document ingestion, multi-agent chat,
blindspot auditing, policy diffing, copilot actions, and MCP tools.
"""

from api.routes import api_router

__all__ = ["api_router"]
