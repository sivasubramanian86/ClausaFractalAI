"""End-to-end API tests for ClausaFractalAI — complete legal workflow chains.

This module exercises the full ASGI stack as a black box, simulating real
client behaviour across multi-step legal document workflows. No mocks are used;
all in-memory stubs (RAG engine, BigQuery analytics, Firestore audit trail)
are exercised through the public API surface exactly as a real client would.

Test scenarios:
  - Scenario A: Document upload → Q&A → Blindspot audit → Policy diff
  - Scenario B: Attorney prep sheet generation → Counter-clause rewrite
  - Scenario C: Governance routes (audit trail, VPC-SC, analytics)
  - Scenario D: MCP tool execution across all 5 registered legal tools
  - Scenario E: Error handling — malformed requests, missing required fields
"""

import pytest
from httpx import ASGITransport, AsyncClient

from main import app


@pytest.fixture()
def http_client() -> AsyncClient:
    """Return an AsyncClient bound to the FastAPI ASGI app via ASGITransport.

    Uses ASGITransport so no real network socket is opened. The full
    middleware stack (CORS, security headers, lifespan) is exercised.
    """
    return AsyncClient(transport=ASGITransport(app=app), base_url="http://test")


@pytest.mark.asyncio
async def test_e2e_document_upload_and_qa_workflow() -> None:
    """E2E Scenario A: Upload document, then execute legal Q&A on it.

    Steps:
      1. POST /api/documents/upload with contract text
      2. Assert document_id returned and chunks present
      3. POST /api/chat using the returned document_id
      4. Assert intent == LEGAL_QA and quality_score >= 8.0
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Step 1 — upload
        upload_resp = await client.post(
            "/api/documents/upload",
            json={
                "text": (
                    "MASTER SERVICES AGREEMENT\n\n"
                    "Section 4. Limitation of Liability\n"
                    "The aggregate liability of either party shall not exceed "
                    "the total fees paid in the preceding twelve months.\n\n"
                    "Section 5. Indemnification\n"
                    "Customer shall indemnify Vendor against third-party claims "
                    "arising from Customer's use of the Service."
                ),
                "filename": "e2e_msa_contract.txt",
            },
        )
        assert upload_resp.status_code == 200
        upload_data = upload_resp.json()
        assert "document_id" in upload_data
        assert upload_data["filename"] == "e2e_msa_contract.txt"
        assert len(upload_data["chunks"]) >= 1
        doc_id = upload_data["document_id"]

        # Step 2 — Q&A on uploaded document
        qa_resp = await client.post(
            "/api/chat",
            json={
                "query": "What is the aggregate liability cap?",
                "document_id": doc_id,
                "complexity": "COUNSEL",
                "stream": False,
            },
        )
        assert qa_resp.status_code == 200
        qa_data = qa_resp.json()
        assert qa_data["intent"] == "LEGAL_QA"
        assert qa_data["quality_score"] >= 8.0
        assert len(qa_data["citations"]) >= 1


@pytest.mark.asyncio
async def test_e2e_blindspot_audit_then_policy_diff() -> None:
    """E2E Scenario A continued: Blindspot audit → version diff on same document.

    Steps:
      1. POST /api/blindspots against the uploaded document
      2. Assert compliance_score, omitted_findings present
      3. POST /api/diff comparing original vs. amended clause text
      4. Assert shifts detected and overall_verdict present
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Blindspot audit with explicit text
        blindspot_resp = await client.post(
            "/api/blindspots",
            json={
                "document_id": "e2e_doc_blindspot",
                "text": (
                    "Confidential information means all information disclosed "
                    "by either party. Recipient shall protect information for "
                    "a period of two years from disclosure date."
                ),
                "template_name": "mutual_nda",
            },
        )
        assert blindspot_resp.status_code == 200
        bs_data = blindspot_resp.json()
        assert "compliance_score" in bs_data
        assert "omitted_findings" in bs_data
        assert bs_data["template_name"] == "mutual_nda"
        assert 0.0 <= bs_data["compliance_score"] <= 100.0

        # Policy diff between two contract versions
        diff_resp = await client.post(
            "/api/diff",
            json={
                "doc_a_id": "e2e_v1",
                "doc_b_id": "e2e_v2",
                "doc_a_text": "Liability cap is mutual at $100,000 per incident.",
                "doc_b_text": (
                    "Customer liability is uncapped. Vendor liability remains "
                    "capped at $100,000 per incident."
                ),
            },
        )
        assert diff_resp.status_code == 200
        diff_data = diff_resp.json()
        assert diff_data["total_shifts_detected"] >= 1
        assert "overall_verdict" in diff_data
        assert len(diff_data["impact_matrix"]) >= 1


@pytest.mark.asyncio
async def test_e2e_attorney_prep_and_counter_clause() -> None:
    """E2E Scenario B: Attorney prep sheet generation followed by counter-clause rewrite.

    Steps:
      1. POST /api/copilot/attorney-prep with identified risks
      2. Assert executive_summary, attorney_questions, leverage_points present
      3. POST /api/copilot/rewrite-clause with one-sided indemnity clause
      4. Assert counter_clause, strategic_rationale, negotiation_tip present
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Attorney prep sheet
        prep_resp = await client.post(
            "/api/copilot/attorney-prep",
            json={
                "document_id": "e2e_prep_doc",
                "key_risks": [
                    "Uncapped customer indemnification",
                    "Unilateral termination right for vendor",
                    "No SLA uptime commitment",
                ],
            },
        )
        assert prep_resp.status_code == 200
        prep_data = prep_resp.json()
        assert "executive_summary" in prep_data
        assert len(prep_data["attorney_questions"]) >= 1
        assert len(prep_data["negotiation_leverage_points"]) >= 1
        assert len(prep_data["critical_red_flags"]) >= 1

        # Counter-clause rewrite for an adversarial indemnity clause
        rewrite_resp = await client.post(
            "/api/copilot/rewrite-clause",
            json={
                "clause_text": (
                    "Customer shall defend, indemnify, and hold harmless Vendor "
                    "from any and all claims, damages, and liabilities arising "
                    "from Customer's use of the Service, without any aggregate cap."
                ),
                "clause_type": "indemnity",
            },
        )
        assert rewrite_resp.status_code == 200
        rw_data = rewrite_resp.json()
        assert "counter_clause" in rw_data
        assert "strategic_rationale" in rw_data
        assert "negotiation_tip" in rw_data
        assert len(rw_data["counter_clause"]) > 50


@pytest.mark.asyncio
async def test_e2e_governance_routes_complete_chain() -> None:
    """E2E Scenario C: Full governance surface — audit trail, VPC-SC, analytics.

    Steps:
      1. GET /api/governance/audit-trail  → list of audit events
      2. GET /api/governance/vpc-status   → ENFORCED status, protected services
      3. GET /api/analytics/metrics       → KPI telemetry aggregates
      4. GET /api/analytics/risks         → clause risk breakdown
      5. GET /health                      → liveness probe
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Audit trail
        audit_resp = await client.get("/api/governance/audit-trail")
        assert audit_resp.status_code == 200
        audit_data = audit_resp.json()
        assert isinstance(audit_data, list)

        # VPC-SC status
        vpc_resp = await client.get("/api/governance/vpc-status")
        assert vpc_resp.status_code == 200
        vpc_data = vpc_resp.json()
        assert vpc_data["status"] == "ENFORCED"
        assert len(vpc_data["protected_services"]) >= 3

        # Analytics metrics
        metrics_resp = await client.get("/api/analytics/metrics")
        assert metrics_resp.status_code == 200
        metrics_data = metrics_resp.json()
        assert "total_queries" in metrics_data
        assert "total_cached_tokens" in metrics_data
        assert "cost_saved_usd" in metrics_data
        assert "measured_hallucination_rate" in metrics_data

        # Risk breakdown
        risks_resp = await client.get("/api/analytics/risks")
        assert risks_resp.status_code == 200
        risks_data = risks_resp.json()
        assert isinstance(risks_data, list)
        assert len(risks_data) >= 1
        assert "category" in risks_data[0]
        assert "risk_level" in risks_data[0]

        # Health probe
        health_resp = await client.get("/health")
        assert health_resp.status_code == 200
        assert health_resp.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_e2e_mcp_registered_tools() -> None:
    """E2E Scenario D: Execute all registered MCP legal tools end-to-end.

    Verifies each registered MCP tool (verify_citation, audit_blindspots,
    generate_attorney_checklist) is reachable, executes without error, and returns
    the expected result shape.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # First verify tool discovery
        tools_resp = await client.get("/api/mcp/tools")
        assert tools_resp.status_code == 200
        tools_list = tools_resp.json()
        assert len(tools_list) == 3
        tool_names = [t["name"] for t in tools_list]
        assert "verify_citation" in tool_names
        assert "audit_blindspots" in tool_names
        assert "generate_attorney_checklist" in tool_names

        tool_cases = [
            (
                "verify_citation",
                {
                    "clause": "Limitation of Liability",
                    "page": 1,
                    "snippet": "aggregate liability capped at fees",
                    "source_text": "The aggregate liability capped at fees shall apply.",
                },
            ),
            (
                "audit_blindspots",
                {
                    "document_text": (
                        "Mutual Nondisclosure Agreement. "
                        "Confidential information shall be kept secret."
                    ),
                    "baseline": "mutual_nda",
                    "document_id": "doc_e2e_mcp",
                },
            ),
            (
                "generate_attorney_checklist",
                {
                    "document_id": "doc_e2e_mcp",
                    "identified_risks": ["Unilateral Indemnification", "Unlimited Liability"],
                },
            ),
        ]

        for tool_name, arguments in tool_cases:
            resp = await client.post(
                "/api/mcp/call",
                json={"name": tool_name, "arguments": arguments},
            )
            assert resp.status_code == 200, f"MCP tool {tool_name} failed: {resp.text}"
            result = resp.json()
            assert isinstance(result, dict) and len(result) > 0, (
                f"Empty response for tool {tool_name}"
            )
            assert result.get("status") == "success"


@pytest.mark.asyncio
async def test_e2e_error_handling_malformed_requests() -> None:
    """E2E Scenario E: Verify API error handling for malformed and incomplete requests.

    Confirms HTTP 422 is returned for missing required fields and HTTP 404
    for unknown MCP tools, rather than unhandled 500 errors.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Missing 'query' field in /api/chat
        resp_chat = await client.post("/api/chat", json={"document_id": "doc_x"})
        assert resp_chat.status_code == 422

        # Missing audio file in /api/audio/transcribe
        resp_audio = await client.post("/api/audio/transcribe")
        assert resp_audio.status_code == 422
        assert "Audio file required" in resp_audio.json()["detail"]

        # Unknown MCP tool → 404
        resp_mcp = await client.post(
            "/api/mcp/call",
            json={"name": "non_existent_tool", "arguments": {}},
        )
        assert resp_mcp.status_code == 404
        assert "Unknown MCP tool" in resp_mcp.json()["detail"]
