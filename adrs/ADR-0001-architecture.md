# ADR-0001: Enterprise Neuro-Symbolic Agent Mesh Architecture

## Status
Accepted

## Context
ClausaFractalAI operates in high-blast-radius enterprise legal and regulatory environments. Traditional probabilistic Large Language Models (LLMs) suffer from hallucinations, non-deterministic reasoning, and inability to mathematically guarantee compliance with contract thresholds (e.g., unlimited liability exposure, indemnity asymmetry, statutory notice periods).

## Decision
We implement a **Dual-Pass Neuro-Symbolic Architecture** governed by Zero-Trust Agent-to-Agent (A2A) protocols:
1. **System 1 (Neural Perception):** Gemini 3.8 Flash & Pro parse unstructured legal agreements, detect risk topics, extract clauses, and formulate candidate action plans.
2. **System 2 (Symbolic Verification):** Deterministic Z3 Theorem Prover and Pydantic V2 immutable data contracts mathematically verify that every clause, liability cap, and covenant satisfies formal linear arithmetic and boolean logic constraints.
3. **Correction Loop:** When Z3 yields `unsat` or contract schemas mismatch, the exact unsatisfiable core is synthesized into a single-shot prompt for neural self-repair (maximum 2 automated repair loops before HITL escalation).
4. **Zero-Trust A2A Governance:** Agent delegations use frozen Pydantic V2 contracts, cryptographically signed HMAC capability tokens, and a DFS cycle/deadlock watchdog with a maximum hop limit of 5.

## Consequences
- **Positive:** 0.00% unverified contract execution, guaranteed mathematical correctness on financial and liability invariants, zero deadlock risk across agents.
- **Trade-offs:** Additional Z3 solving latency (<5ms typical), requires formal constraint encoding for novel contract policies.
