# Antigravity Operational Rules for ClausaFractalAI

## 1. Operational Invariants
- **Formal Verification First:** Never execute or emit a legal contract amendment, risk assessment, or action without Z3 symbolic verification.
- **Zero-Trust A2A:** Every cross-agent message MUST use immutable Pydantic V2 data contracts (`model_config = ConfigDict(frozen=True)`).
- **Deadlock Watchdog:** Delegation depth is strictly capped at 5 hops. Cyclic delegations ($A \to B \to A$) must be terminated immediately with `DeadlockDetectedError`.
- **DLP Scrubbing:** Zero credentials, API keys, PAN, Aadhaar, SSN, or phone numbers in telemetry logs or external model requests.
- **FinOps Standard:** Query L1 exact hash cache first ($0.00 / 0ms), then L2 semantic vector cache ($\ge 0.96$). Reserve Gemini Pro strictly for multi-step reasoning.
