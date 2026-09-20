# Security Policy — ClausaFractalAI

## 1. Zero-Trust Security Philosophy

ClausaFractalAI is an autonomous legal intelligence and action platform designed to handle sensitive commercial agreements, nondisclosure agreements (NDAs), and enterprise contracts. As such, security, confidentiality, and data privacy are foundational architectural tenets.

### Core Security Guarantees:
- **Client-Side & Edge PII Scrubbing**: All documents undergo deterministic regex-based PII redaction (masking SSNs, credit cards, telephone numbers, and email addresses) before textual chunks are indexed into FAISS or submitted to Gemini LLM APIs.
- **Zero-Key Credential Management**: In production environments (Google Cloud Run), all Vertex AI model invocations authenticate strictly via **Application Default Credentials (ADC)** and **Workload Identity Federation (WIF)**. No static API keys, service account private keys, or passwords are hardcoded or tracked in version control.
- **Memory-Only Document Isolation**: Ingested contracts and extracted legal triples are maintained in ephemeral per-session vector stores without permanent multi-tenant retention.
- **Defense-in-Depth HTTP Headers**: The FastAPI gateway enforces strict security headers:
  - `Content-Security-Policy: default-src 'self'`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`

---

## 2. Supported Versions

Security updates and vulnerability patches are applied to the active production branch:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## 3. Reporting a Vulnerability

We take the security of ClausaFractalAI seriously. If you discover a security vulnerability or potential privacy defect, please do **NOT** open a public GitHub issue.

### Reporting Procedure:
1. Email your report directly to the security lead at `sivasubramanian86@gmail.com`.
2. Include:
   - A detailed description of the vulnerability.
   - Steps to reproduce or proof-of-concept (PoC) exploit code.
   - Potential impact of the defect.
   - Any suggested mitigations.
3. You will receive an initial acknowledgment within **24 hours**.
4. We will coordinate a remediation timeline and public disclosure advisory once a fix is verified.

---

## 4. Automated Security CI/CD Gates

Every commit to this repository must pass automated security audits:
- **Gitleaks**: Scans git history and working trees for credentials, tokens, and secrets.
- **Bandit AST Security Analysis**: Strict Python static analysis (`bandit -r src/ -c pyproject.toml`) ensuring 0 issues across all severity levels.
- **Dependency Audit**: Python dependencies audited with `pip audit` and Node packages with `npm audit`.
