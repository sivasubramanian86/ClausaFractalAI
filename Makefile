# ClausaFractalAI: Enterprise Neuro-Symbolic Agent Mesh Makefile
.PHONY: help install lint test eval run-backend run-frontend docker-build deploy clean

PYTHON ?= python
PIP ?= pip

help:
	@echo "Available commands:"
	@echo "  make install       Install all Python and Node.js dependencies"
	@echo "  make lint          Run Ruff, Mypy, and code quality formatting"
	@echo "  make test          Run hermetic unit and integration test suites"
	@echo "  make eval          Execute Continuous EvalOps Golden Dataset benchmark"
	@echo "  make run-backend   Start FastAPI microservice with OpenTelemetry on port 8000"
	@echo "  make run-frontend  Start Vite/Next.js frontend development server"
	@echo "  make docker-build  Build multi-stage non-root gVisor-ready container"
	@echo "  make deploy        Deploy infrastructure using Terraform on Google Cloud Run"
	@echo "  make clean         Remove build artifacts, caches, and test coverage output"

install:
	$(PIP) install -r requirements.txt
	cd frontend && npm install

lint:
	$(PYTHON) -m ruff check app/ backend/ tests/
	$(PYTHON) -m ruff format --check app/ backend/ tests/

test:
	$(PYTHON) -m pytest tests/ backend/tests/ -v

eval:
	$(PYTHON) tests/eval/run_evals.py

run-backend:
	$(PYTHON) -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

run-frontend:
	cd frontend && npm run dev

docker-build:
	docker build -t clausafractalai:latest -f deploy/Dockerfile .

deploy:
	cd deploy/terraform && terraform init && terraform apply -auto-approve

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	rm -rf .coverage htmlcov
