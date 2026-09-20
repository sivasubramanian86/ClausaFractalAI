# Contributing to ClausaFractalAI

Thank you for your interest in contributing to **ClausaFractalAI**! We welcome contributions that improve contract intelligence, multi-agent coordination, and developer ergonomics.

---

## 1. Code of Conduct

All contributors and maintainers are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat all participants with respect, empathy, and constructive professionalism.

---

## 2. Development Workflow & Standards

### Quality Prerequisites:
Before submitting any pull request, ensure your branch satisfies our **Non-Negotiable Quality Gates**:
1. **100% Test Coverage**:
   - Every Python module under `backend/src/` must maintain **100.00% Statement and Branch Coverage**.
   - Cheat tags (`# pragma: no cover` or `/* v8 ignore */`) are strictly prohibited.
   - Run: `pytest --cov=src --cov-branch --cov-fail-under=100`
2. **Zero Linter Warnings**:
   - Run: `ruff check src tests scripts` (Must return 0 errors, 0 warnings).
   - Run: `ruff format --check src tests scripts`.
3. **Bandit Security Audit**:
   - Run: `bandit -r src/ -c pyproject.toml` (0 issues across all severities).
4. **TypeScript & Frontend Tests**:
   - Run: `npm run type-check` (`tsc --noEmit` returns 0 errors).
   - Run: `npm test` (all Vitest component tests pass).
   - Run: `npm run build` (production Vite build succeeds).
5. **Zero Secret Leaks**:
   - Ensure no `.env`, API keys, or private certificates are staged.

---

## 3. Local Setup Instructions

### Backend (Python 3.12+):
```bash
cd backend
cp .env.example .env
uv sync   # or: pip install -e ".[dev]"
pytest
uvicorn src.main:app --reload --port 8000
```

### Frontend (React 19 + TypeScript):
```bash
cd frontend
npm install
npm run type-check
npm test
npm run dev
```

### Monorepo Quality Gate Script:
```powershell
# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts\check_quality.ps1
```

---

## 4. Branching & Commit Conventions

- Create feature branches from `main`:
  - `feat/feature-name`
  - `fix/bug-description`
  - `docs/documentation-update`
- Follow Conventional Commits format:
  - `feat(agent): add multi-hop contradiction detector`
  - `fix(rag): correct cosine similarity threshold calculation`
  - `test(api): add tests for SSE streaming endpoint`

---

## 5. Pull Request Guidelines

1. Open PR against the `main` branch.
2. Fill out the [Pull Request Template](.github/pull_request_template.md).
3. Ensure all CI/CD checks (Gitleaks, Bandit, Ruff, 100% Pytest Coverage, Vitest) pass.
4. Request review from maintainers.
