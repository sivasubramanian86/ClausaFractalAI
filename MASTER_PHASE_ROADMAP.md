# ClausaFractalAI – Master Phase Execution Roadmap
## GenAI-Powered Autonomous Legal Document Intelligence & Action Platform | PromptWars Exclusive Challenge

---

## 1. Executive Vision & AGI/ASI-Class Autonomous Agent Strategy

**ClausaFractalAI** is an autonomous, multi-agent legal intelligence platform built for the **PromptWars Exclusive Legal AI Challenge**. It moves beyond passive screen mockups and simple chatbot summarization by providing an **end-user actionable legal copilot** that operates with the analytical rigor, verification discipline, and depth of an elite legal associate.

### Core Breakthrough Innovations
1. **Multi-Agentic RAG & Knowledge Graph**: Combines chunk-level semantic search (FAISS) with entity-relation Graph RAG linking `[Parties]`, `[Obligations]`, `[Liabilities]`, `[Jurisdictions]`, and `[Remedies]` for multi-hop causal reasoning.
2. **Model Context Protocol (MCP) Integration**: Native MCP Server layer exposing standardized legal analysis tools (`verify_clause_grounding`, `detect_contract_blindspots`, `synthesize_policy_collision`, `generate_attorney_briefing`) allowing both internal agents and external MCP clients to interact with document state.
3. **Self-Improving Learning Loop (Kasana 2026)**:
   - **Critic-in-the-Loop Reflection**: Before returning analysis to the user, an internal Critic Agent reviews the output. If the groundedness score is < 8.0/10.0, the generator iteratively refines the response.
   - **Playbook & Skill Library**: Successful analysis patterns and verified clause baselines are saved into a reusable execution playbook store rather than forgotten.
4. **Spec-Driven Development (SDD) & Strict Intent Verification (Wasowski 2026)**:
   - Zero tolerance for verification debt: "All tests passed" is not the same as "Matches intent."
   - Deterministic handling of unknowns: Missing contract data strictly outputs:  
     `"I cannot determine this based on the provided document."`
5. **Bidirectional PDF Traceability**: Every claim generates structured citations `{clause, page, text_snippet}` that dynamically scroll and illuminate text in the React PDF viewer.
6. **Multi-Modal Input & Real-World Usability**:
   - Ingests digital PDFs, mobile phone camera photos/scans (via Gemini 3.8 Flash Vision), and spoken voice dictation questions (Web Speech / Cloud Speech).
   - Generates immediate, practical end-user outputs: **Actionable Risk Checklist**, **Attorney Consultation Prep Sheet**, and **Favorable Counter-Clause Rewrites**.
7. **Production Multi-Lingual (i18n) Support**: Full runtime internationalization with type-safe language dictionaries (English, Spanish, French, German, Japanese, Hindi).

---

## 2. Model Topology & Technical Stack Matrix

| Layer | Technology Choice | Architectural Role |
|---|---|---|
| **Deep Reasoning & Synthesis** | **Vertex AI Gemini 3.8 Flash (`gemini-3.8-flash-001`)** & **Gemini 3.8 Pro (`gemini-3.8-pro-001`)** with native Context Caching | Deep clause decomposition, blindspot detection, policy collision, and attorney briefing synthesis. Context Caching drops latency by 75% for large agreements (>32k tokens). |
| **Instant Intent Router** | **Vertex AI Gemini 2.0 Flash-Lite (`gemini-2.0-flash-lite-preview`)** | Sub-200ms intent classification and query dispatch. |
| **Vision Multimodal Fallback** | **Gemini 3.8 Flash Vision** | Native visual document parsing for scanned PDFs and paper contract photos without heavy OCR dependencies. |
| **Agent Protocols & RAG** | **Model Context Protocol (MCP) + In-Memory FAISS + Graph Triples** | Multi-Agentic RAG with entity relationship linking and standardized MCP tool interfaces. |
| **Self-Improving Engine** | **Critic Reflection Agent + Multi-Tier Memory Store** | Self-checking verification loop asserting groundedness and saving verified workflows into the Playbook Store. |
| **Backend Framework** | **Python 3.12+ via FastAPI (`uv` package manager)** | Asynchronous REST endpoints, Server-Sent Events (SSE) token streaming, and MCP server endpoints. |
| **Frontend GUI** | **React 19 + TypeScript 5.8+ + Vite 6 + Tailwind CSS** | Obsidian dark glassmorphism, `react-pdf` text layer highlighting, voice input, complexity slider, and i18n selector. |
| **Repository Size Guard** | **Strictly < 10 MB Limit** | Hardened `.gitignore` excluding all binaries, cache, node_modules, and virtual environments. |

---

## 3. Master 8-Phase Execution Matrix

| Phase | Dedicated File | Core Deliverables & Milestones |
|---|---|---|
| **Phase 0** | `docs/ARCHITECTURE_CLAUSA_FRACTAL_AI.md` | System Architecture Blueprint, Multi-Agentic RAG & Graph Topology, MCP Server Contract, Self-Improving Critic Loop, Zero-Hallucination Grounding Spec |
| **Phase 1** | `backend/pyproject.toml`, `frontend/package.json` | Monorepo layout, strict `< 10MB` `.gitignore`, `config.py` (Vertex AI ADC, baseline templates), `scripts/check_quality.ps1` |
| **Phase 2** | `backend/src/services/` | Multimodal Ingestion Layer: Native PDF parsing + Gemini 3.8 Flash Vision scan fallback + Voice audio input support + Deterministic PII Regex Scrubber + In-Memory FAISS & Graph RAG Index, 100% tests |
| **Phase 3** | `backend/src/agents/` | Multi-Agent State Graph & MCP Server: Router Agent (Gemini 2.0 Flash-Lite) + QA Analyst (Gemini 3.8 Flash with Context Caching) + Blindspot Detector + Policy Collider + Complexity Tuner + Self-Improving Critic Loop + Verification Guard (*"I cannot determine this based on the provided document."*), 100% tests |
| **Phase 4** | `backend/src/api/` | Asynchronous API & MCP Layer: `/api/documents/upload`, `/api/chat` (SSE token + citation streaming), `/api/blindspots`, `/api/diff`, `/api/attorney-checklist`, `/api/rewrite-clause`, `/health`, CSP/HSTS middleware, 100% tests |
| **Phase 5** | `frontend/src/` | Glassmorphic React 19 Studio UI: `DocumentViewer.tsx` (PDF canvas with citation jump & highlight), `ChatInterface.tsx` (SSE stream, citation chips, 4-step slider, voice dictation), `BlindspotMatrix.tsx`, `PolicyCollider.tsx`, `AttorneyPrepView.tsx`, i18n language toggle, A11y tests |
| **Phase 6** | `docs/PERFECTION_AUDIT_REPORT.md` | 100% Perfection Pre-Submission Audit: Automated benchmark runner `evaluate_hallucinations.py` (10 golden test cases), Ruff 0 warnings, Bandit 0 issues, Pytest 100% statement/branch coverage, Gitleaks scan, Repository size verification (`git count-objects -vH` < 10 MB) |
| **Phase 7** | `docs/DEMO_VIDEO_SCRIPT.md` | PromptWars Winning Submission Deliverables: Timed 3m45s (< 4 min) OBS Screen Recording Script showing live typing, GenAI streaming, unanswerable question edge case, attorney prep sheet generation, production `README.md`, and incognito link checklist |
