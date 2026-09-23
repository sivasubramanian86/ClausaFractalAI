"""End-to-end test package for ClausaFractalAI backend.

Tests in this package exercise the complete API surface as a black box,
simulating real client behaviour across multi-step legal workflow chains.
Uses httpx.AsyncClient with ASGITransport to hit the full ASGI stack.

Test scenarios mirror real hackathon demo flows:
  1. Document upload → Q&A → Blindspot audit → Policy diff
  2. Attorney prep sheet generation → Counter-clause rewrite
  3. Governance: audit trail persistence, VPC-SC status, RBAC enforcement

Coverage target: all public API routes covered end-to-end.
"""
