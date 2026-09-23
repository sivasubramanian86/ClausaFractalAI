"""Integration test package for ClausaFractalAI backend.

Tests in this package exercise multiple components together using the
FastAPI TestClient (httpx.ASGITransport). External GCP services (Vertex AI,
Firestore, BigQuery) use in-memory stubs — no live cloud calls are made.

Coverage target: 100% statement and branch coverage.
"""
