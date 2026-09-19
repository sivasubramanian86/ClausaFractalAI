# ClausaFractalAI: Autonomous System Architecture Specification
## GenAI-Powered Multi-Agent Legal Intelligence Platform

---

## 1. Executive Summary & Problem Framing

Navigating legal contracts, SaaS SLAs, privacy policies, and non-disclosure agreements is a critical barrier for consumers, freelancers, and small business owners. Traditional professional legal review is costly ($300–$800/hr) and inaccessible for everyday agreements. Conversely, standard consumer chatbots pose substantial risks:
- **Hallucination & Fabricated Clauses**: Models extrapolate facts not present in the contract.
- **Lack of Verifiable Grounding**: Chat responses cannot be independently verified against original document pages.
- **Passive Summarization**: Simple summaries fail to detect what is *missing* (omitted indemnities, missing liability caps).

**ClausaFractalAI** solves this by establishing an autonomous, multi-agent legal intelligence platform built with **Spec-Driven Development (SDD)**, **Multi-Agentic RAG**, **Model Context Protocol (MCP)**, and a **Self-Improving Reflection Critic Loop**.

---

## 2. End-to-End System Topology

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

## 3. Multi-Agentic RAG & Graph Triples Architecture

Rather than relying purely on naive vector distance, ClausaFractalAI implements a hybrid multi-agentic RAG model:
1. **Semantic Chunk Indexing**:
   - 400-token chunks with 50-token overlap stored in an in-memory FAISS index.
   - Metadata payload: `{chunk_id, page_number, section_header, text, cleaned_text}`.
2. **Entity-Relation Graph Triples**:
   - Extracts legal triples linking entities:
     - `[Party A]` -- `ASSUMES_LIABILITY_FOR` --> `[Data Breach]`
     - `[Vendor]` -- `MAY_TERMINATE_WITH` --> `[30_DAYS_NOTICE]`
     - `[Customer]` -- `SURRENDERS_RIGHT_TO` --> `[Class Action Lawsuit]`
   - Enables multi-hop causal reasoning for complex contract analysis.

---

## 4. Self-Improving Engine & Memory Hierarchy

Following the **Kasana (2026)** framework (*"LLMs don't learn during inference. Systems do"*):
1. **The Learning Loop**:
   - Plan $\rightarrow$ Execute $\rightarrow$ Critic Evaluation $\rightarrow$ Success (Save Pattern) / Failure (Save Lesson).
2. **Critic Reflection**:
   - Internal `CriticReflectionAgent` audits candidate answers for:
     - Citation validity (`[Clause X.Y, Page Z]` must match retrieved text).
     - Adherence to negative constraints (no unverified speculation).
     - If score < 8.0, triggers one automated refinement pass before user delivery.
3. **Multi-Tiered Memory**:
   - *Session Memory*: In-memory cache of current document and active citation cursor.
   - *User Preferences*: Complexity slider position and preferred language.
   - *Playbook Store*: Reusable, verified execution workflows and clause baseline templates.

---

## 5. Security Governance & Well-Architected Framework

- **Pre-LLM PII Scrubber**: Deterministic regex masks SSNs, credit cards, phones, and emails before tokens leave memory.
- **Zero-Key Authentication**: Production deployments authenticate to Vertex AI using Google Cloud Application Default Credentials (ADC) and Workload Identity Federation (WIF).
- **Hardened HTTP Headers**: HSTS, Content Security Policy (CSP), X-Frame-Options: DENY, X-Content-Type-Options: nosniff.
- **Strict Size Bounds**: Hardened `.gitignore` guarantees the git repository stays strictly under the **10 MB limit**.
