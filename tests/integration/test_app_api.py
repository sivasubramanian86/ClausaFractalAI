"""Integration tests for ClausaFractalAI FastAPI Microservice endpoints."""

import pytest
from fastapi.testclient import TestClient

from app.core.security import issue_capability_token
from app.main import app


@pytest.fixture
def client() -> TestClient:
    """Create test client for FastAPI application."""
    return TestClient(app)


def test_api_health_check(client: TestClient) -> None:
    """Verify health endpoint returns healthy status and component states."""
    resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert data["service"] == "ClausaFractalAI"
    assert data["mesh_components"]["supervisor"] == "ACTIVE"


def test_api_analyze_clause_flow(client: TestClient) -> None:
    """Verify analyze clause endpoint executes pipeline and handles caching."""
    clause = "Either party may terminate upon 45 days written notice."
    resp1 = client.post("/api/v2/analyze", json={"clause_text": clause})
    assert resp1.status_code == 200
    data1 = resp1.json()
    assert data1["cached"] is False
    assert data1["result"]["status"] == "PROVEN_AND_SYNTHESIZED"
    assert "traceparent" in resp1.headers

    # Second call -> cached
    resp2 = client.post("/api/v2/analyze", json={"clause_text": clause})
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert data2["cached"] is True
    assert data2["cache_tier"] in ["L1", "L2"]


def test_api_mcp_governed_tools_and_security(client: TestClient) -> None:
    """Verify governed MCP gateway with capability token issuance and enforcement."""
    # 1. List tools
    tools_resp = client.get("/api/v2/mcp/tools")
    assert tools_resp.status_code == 200
    tools = tools_resp.json()
    assert len(tools) >= 4

    # 2. Mint capability token
    token_resp = client.post("/api/v2/mcp/token")
    assert token_resp.status_code == 200
    token_str = token_resp.json()["token"]

    # 3. Call tool with valid token
    call_resp = client.post(
        "/api/v2/mcp/call",
        json={
            "tool_name": "scrub_pii_dlp",
            "arguments": {"text": "User PAN ABCDE1234F"},
            "capability_token": token_str,
        },
    )
    assert call_resp.status_code == 200
    assert "[REDACTED_PAN]" in call_resp.json()["scrubbed_text"]

    # 4. Call tool with invalid token -> 403 Forbidden
    call_invalid = client.post(
        "/api/v2/mcp/call",
        json={
            "tool_name": "scrub_pii_dlp",
            "arguments": {"text": "hello"},
            "capability_token": "tampered_token.12345",
        },
    )
    assert call_invalid.status_code == 403
    assert "Security Governance violation" in call_invalid.json()["detail"]


def test_api_mcp_formal_verify_clause(client: TestClient) -> None:
    """Verify formal_verify_clause tool proves SAT via Z3."""
    token = issue_capability_token(
        tenant_id="tenant_test",
        agent_id="agent_mcp",
        allowed_tools=["formal_verify_clause"],
    )
    resp = client.post(
        "/api/v2/mcp/call",
        json={
            "tool_name": "formal_verify_clause",
            "arguments": {
                "clause_text": "Standard terms",
                "proposed_cap_usd": 300_000.0,
                "notice_days": 45,
                "require_mutual": True,
            },
            "capability_token": token,
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["is_satisfiable"] is True
    assert data["z3_status"] == "SAT"


def test_api_hitl_ticket_listing_and_resolution(client: TestClient) -> None:
    """Verify HITL ticket listing and resolution endpoint."""
    # List tickets
    list_resp = client.get("/api/v2/hitl/tickets")
    assert list_resp.status_code == 200
    assert isinstance(list_resp.json(), list)

    # Attempt resolving non-existent ticket -> 404
    resolve_resp = client.post(
        "/api/v2/hitl/resolve",
        json={
            "resumption_token": "non_existent_token_123",
            "decision": "APPROVED",
            "reviewer_notes": "Reviewed and overridden by General Counsel",
        },
    )
    assert resolve_resp.status_code == 404
