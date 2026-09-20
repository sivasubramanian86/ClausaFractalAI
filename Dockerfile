# ==============================================================================
# Stage 1: Build React 19 Frontend
# ==============================================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ==============================================================================
# Stage 2: Production Python 3.12 Backend Runtime for Cloud Run
# ==============================================================================
FROM python:3.12-slim AS runtime

# Prevent Python from writing .pyc and buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

WORKDIR /app

# Install security updates and dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install backend dependencies
COPY backend/pyproject.toml ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir fastapi uvicorn[standard] sse-starlette pydantic pydantic-settings httpx

# Copy backend source code
COPY backend/src/ ./src/

# Copy built frontend assets to static mount
COPY --from=frontend-builder /app/frontend/dist ./static/

# Create unprivileged service user for least-privilege container execution
RUN useradd -u 1001 -m clausa && \
    chown -R clausa:clausa /app
USER clausa

EXPOSE 8080

# Health check probe for Cloud Run container lifecycle
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Launch production server with Uvicorn
CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]
