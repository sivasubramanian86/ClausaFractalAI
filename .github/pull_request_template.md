## Description
Briefly describe the change and motivation. Reference any related issues or tickets.

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing behavior to change)
- [ ] Documentation update
- [ ] CI/CD or build pipeline improvement

## Quality & Security Verification Checklist
- [ ] **100% Statement & Branch Coverage**: All backend tests pass with `--cov-fail-under=100` (Zero `# pragma: no cover`).
- [ ] **Linter & Formatting**: `ruff check src tests scripts` passes with 0 warnings.
- [ ] **Security Audit**: `bandit -r src/ -c pyproject.toml` returns 0 issues.
- [ ] **Secret Scan**: Confirmed zero API keys, passwords, or tokens in changed files.
- [ ] **Frontend Validation**: `npm run type-check` (0 errors), `npm test` (passes), `npm run build` succeeds.
- [ ] **Documentation**: Updated README / docs where appropriate.
