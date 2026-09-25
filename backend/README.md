# ClausaFractalAI Backend

> Autonomous Legal Intelligence Engine with 100% Hermetic Test Coverage.

## Overview
The ClausaFractalAI backend microservice powers document extraction, agentic legal reasoning, policy collision detection, and attorney preparation workflows.

## Key Capabilities
- **Document Processing:** Multimodal PDF parsing, OCR image processing, and audio transcription.
- **Agentic Knowledge Mesh:** Multi-agent state machine orchestrating QA Analyst, Policy Collider, and Redline Rewriters.
- **RAG & Vector Retrieval:** FAISS CPU vector index with semantic triple extraction and contradiction detection.
- **Courtroom Deliberation Engine:** Autonomous senior bench judge and advocate war room dissecting cases into formal decrees, Ratio Decidendi, prosecution strategies, defense shields, cross-examination traps, and settlement calculus.
- **Global Statutory Codex:** In-memory indexed penal, civil, commercial, IP, and cyber statutory intelligence across IPC/BNS, US Code, UCC, UK Common Law, and GDPR.
- **Zero-Trust Telemetry:** W3C distributed tracing with Google Cloud Trace correlation and `structlog` single-line JSON logging.

## Running Tests & Coverage
```bash
pytest --cov=src --cov-branch --cov-report=term-missing tests/
```

## Running Service
```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000
```
