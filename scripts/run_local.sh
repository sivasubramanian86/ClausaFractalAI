#!/usr/bin/env bash
set -e

echo "🚀 Launching ClausaFractalAI Fullstack Studio..."

# Launch Backend
(cd "$(dirname "$0")/../backend" && python -m uvicorn src.main:app --reload --port 8000) &

# Launch Frontend
(cd "$(dirname "$0")/../frontend" && npm run dev) &

wait
