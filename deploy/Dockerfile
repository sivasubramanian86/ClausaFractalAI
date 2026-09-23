# syntax=docker/dockerfile:1.4
# Multi-stage, non-root, gVisor-ready production Dockerfile for ClausaFractalAI

# Stage 1: Build & Dependencies
FROM python:3.12-slim-bookworm AS builder

WORKDIR /build

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --target=/build/deps -r requirements.txt

# Stage 2: Minimal Distroless / Hardened Non-Root Runtime
FROM python:3.12-slim-bookworm AS runner

# Create non-root system user and group (UID 10001)
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -s /sbin/nologin -d /app appuser

WORKDIR /app

ENV PYTHONPATH="/app:/app/deps" \
    PORT=8000 \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Copy dependencies from builder
COPY --from=builder /build/deps /app/deps

# Copy application source code
COPY --chown=appuser:appgroup app /app/app
COPY --chown=appuser:appgroup pyproject.toml /app/pyproject.toml

# Switch to unprivileged non-root user
USER 10001:10001

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD ["python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"]

ENTRYPOINT ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
