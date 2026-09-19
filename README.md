# ClausaFractalAI ⚖️
## Autonomous Legal Document Intelligence & Action Platform
**PromptWars Exclusive Challenge (September 2026)**

[![CI Quality Pipeline](https://github.com/sivasubramanian86/ClausaFractalAI/actions/workflows/ci.yaml/badge.svg)](https://github.com/sivasubramanian86/ClausaFractalAI/actions/workflows/ci.yaml)
[![Python 3.12+](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/downloads/)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)]()
[![Code style: ruff](https://img.shields.io/badge/code%20style-ruff-000000.svg)](https://github.com/astral-sh/ruff)
[![Security: bandit](https://img.shields.io/badge/security-bandit-yellow.svg)](https://github.com/PyCQA/bandit)
[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

---

## 🌟 Executive Vision & Core Breakthrough

Navigating dense legal contracts, SaaS SLAs, and privacy policies is intimidating and error-prone for non-lawyers. Standard consumer chatbots hallucinate clauses and lack verifiable grounding.

**ClausaFractalAI** is an **AGI/ASI-class autonomous legal intelligence copilot** that transforms dense legal legalese into transparent, verifiable, and actionable intelligence:
- **Bidirectional PDF Traceability**: Every claim generates structured citations `[Clause X.Y, Page Z]` that dynamically scroll and illuminate the text layer in the React PDF viewer.
- **Zero Hallucination Guarantee**: Deterministic verification gates enforce that any query not deducible from the document strictly outputs:  
  `"I cannot determine this based on the provided document."`
- **Multi-Agentic RAG & Knowledge Graph**: Combines in-memory FAISS semantic chunk search with entity-relation Graph RAG linking `[Parties]`, `[Obligations]`, `[Liabilities]`, and `[Remedies]`.
- **Model Context Protocol (MCP) Server**: Standardized tool interface exposing `verify_citation`, `audit_blindspots`, and `generate_attorney_briefing`.
- **Self-Improving Learning Loop (Kasana 2026)**: Critic-in-the-Loop reflection audits candidate answers before user delivery, saving proven workflows into a reusable Playbook Store.
- **End-User Actionable Deliverables (Beyond Screens)**:
  - **Attorney Consultation Prep Sheet**: Automatically compiles prioritized, high-risk questions for legal counsel.
  - **Favorable Counter-Clause Rewriter**: Generates balanced negotiation redlines for one-sided contractual terms.
- **Multimodal Ingestion**: Ingests digital PDFs, mobile phone camera photo scans (via Gemini 3.8 Flash Vision), and voice dictation audio.
- **Production Multilingual Support (i18n)**: Type-safe translation dictionaries supporting English, Spanish, French, German, Japanese, and Hindi.

---

## 📐 System Architecture

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                     REACT 19 + TYPESCRIPT STUDIO HUD                          │
│  - DocumentViewer (react-pdf + canvas text-layer highlight synchronization)    │
│  - ChatInterface (SSE token streaming + clickable citation chips)             │
│  - Multimodal Ingest (PDF drag-drop, mobile photo scan, voice dictation mic) │
│  - "Explain Like I'm..." Slider (ELI5 -> Standard -> Counsel -> Paranoid)     │
│  - Attorney Consultation Prep Sheet & Counter-Clause Rewriter Views           │
│  - Type-safe i18n Multilingual Switcher (EN, ES, FR, DE, JA, HI)             │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │ HTTP / Server-Sent Events (SSE)
                                       ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                       FASTAPI ASYNC BACKEND (uv)                              │
│  - Dynamic Security Middleware (CSP, HSTS, X-Frame-Options: DENY, nosniff)    │
│  - PII Regex Scrubber (Pre-LLM SSN, credit card, phone, email redaction)       │
│  - In-Memory FAISS Vector Index + Entity-Relation Graph Triple Engine         │
│  - Standardized Model Context Protocol (MCP) Server Layer                     │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │
                                       ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                    AUTONOMOUS MULTI-AGENT STATE GRAPH                         │
│                                                                               │
│  [Router Agent] (Gemini 2.0 Flash-Lite: Sub-200ms intent classification)       │
│         │                                                                     │
│         ├──> [Legal QA & Citation Agent]                                      │
│         │    (Gemini 3.8 Flash + native Gemini Context Caching)               │
│         │                                                                     │
│         ├──> [Blindspot Risk Detector Agent]                                  │
│         │    (Audits contract structure against baseline legal schemas)       │
│         │                                                                     │
│         ├──> [Policy Collider / Semantic Diff Agent]                          │
│         │    (Computes Practical Impact Matrix: rights vs. liabilities)       │
│         │                                                                     │
│         └──> [Actionable Copilot Agent]                                       │
│              (Generates Attorney Prep Sheet & Counter-Clause Redlines)        │
│                                                                               │
│  [Critic Reflection Agent] (Kasana 2026 Loop: Score >= 8.0/10.0 or Self-Repair)│
│                                                                               │
│  [Deterministic Verification Guard]                                           │
│  Asserts Grounding Invariant: If ungrounded in chunks ->                       │
│  Output strictly: "I cannot determine this based on the provided document."   │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart & Local Execution

### 1. Quality & Security Gates Verification
```powershell
# Run all linter, security, and 100% test coverage gates
.\scripts\check_quality.ps1
```

### 2. Launch Local Fullstack Stack
```powershell
# Concurrently launches FastAPI (8000) and Vite React Studio (5173)
.\scripts\run_local.ps1
```

- **Backend API**: `http://localhost:8000` (Docs: `/docs`, Health: `/health`)
- **Frontend Studio HUD**: `http://localhost:5173`

---

## 🛡️ Non-Negotiable Quality Standards

1. **100% Statement & Branch Coverage Gate**: Pytest fails if coverage drops below 100% (`--cov-fail-under=100`).
2. **Bandit Security Audit**: Zero vulnerabilities across all severities.
3. **Strict Git Hygiene**: Repository size strictly guaranteed `< 10 MB` for public GitHub submission.
4. **Zero-Key Authentication**: Production deployments authenticate to Vertex AI using Application Default Credentials (ADC) and Workload Identity Federation (WIF).
