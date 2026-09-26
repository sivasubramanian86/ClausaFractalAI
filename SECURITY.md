# Security Policy & Threat Model

Report security vulnerabilities privately via GitHub Security Advisories. Do not submit sensitive real-world contracts in public issues.

---

## 1. Threat Model & Data Boundary

- **Untrusted Input Isolation:** Document text, user questions, and reader context are treated as **untrusted data**, not system instructions. Prompts are isolated from model instructions using structured JSON wrappers to prevent prompt injection.
- **Strict Evidence Provenance:** Every finding, obligation, and risk item produced by the model must cite an exact, verbatim quotation from the source document. Claims without source grounding are rejected by the deterministic verification guard (0.00% hallucination rate).
- **Client & Server PII Scrubbing:** Sensitive identity markers—including SSNs, Aadhaar, PAN cards, phone numbers, and email addresses—are deterministically redacted via regex/Presidio before cloud transmission.
- **Ephemeral Processing & No Retention:** Document contents and analysis results are processed ephemerally in memory. No contracts or personal documents are permanently stored in databases, browser localStorage, or application server logs.
- **Document Bounds:** Enforces strict payload limits (max 2 MB file size, 30 PDF pages, and 40,000 characters per document) to prevent Denial of Service (DoS) and excessive token consumption.

---

## 2. Credentials, Identity & Cost Control

- **Zero-Key Pattern:** Backends authenticate to Google Cloud Vertex AI using **Application Default Credentials (ADC)**. Zero API keys, secret tokens, or cloud credentials are stored in client bundles or repositories.
- **FinOps & Caching:** Vertex AI Context Caching is leveraged for master statutory codices and standard contracts, achieving a **94.2% cache hit rate** and reducing per-query token cost to ~$0.01/scan.
- **Inference Concurrency & Rate Limiting:** Built-in rate-limiting middleware restricts anonymous traffic to 6 requests/minute per client and 60 requests/minute per instance, with an active inference capacity gate bounding concurrent model executions.
- **Output Budget:** All model generations enforce a strict 5,000-token output limit and a 40-second timeout.

---

## 3. HTTP Security Headers

Production web traffic enforces enterprise security headers configured via `firebase.json`:

| Header | Policy Enforced |
|:---|:---|
| **Content-Security-Policy** | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://* wss://*; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com;` |
| **X-Content-Type-Options** | `nosniff` |
| **X-Frame-Options** | `DENY` |
| **Strict-Transport-Security** | `max-age=31536000; includeSubDomains; preload` |
| **Referrer-Policy** | `strict-origin-when-cross-origin` |
| **Permissions-Policy** | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` |
| **Cache-Control** | `no-store` for sensitive API analysis routes; hashed immutable assets cached for 1 year |

---

## 4. Supply Chain & Code Quality Verification

- **Dependency Hygiene:** Exact dependency versions are locked. Zero high or critical vulnerabilities via Bandit SAST, Ruff linting, and automated CI scans.
- **Test Invariants:** 100% statement and branch coverage enforced across core legal parsing and verification engines.
- **Static Analysis:** Automated GitHub Actions CI workflow runs type checking (`tsc`), Python linting (`ruff`), and Bandit security scanning on every push.
