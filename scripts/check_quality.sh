#!/usr/bin/env bash
set -e

echo "🛡️ Running ClausaFractalAI Quality & Security Gates..."

cd "$(dirname "$0")/../backend"

echo "1. Ruff Linter..."
python -m ruff check src tests
python -m ruff format --check src tests

echo "2. Bandit Security Audit..."
python -m bandit -r src/ -c pyproject.toml

echo "3. Pytest with 100% Statement & Branch Coverage Gate..."
python -m pytest tests -v --cov=src --cov-branch --cov-fail-under=100

echo "4. Frontend Type Check..."
cd ../frontend
if [ -d "node_modules" ]; then
    npm run type-check
else
    echo "Node modules not installed yet. Skipping npm type-check."
fi

echo "✅ All Quality & Security Gates Passed Successfully!"
