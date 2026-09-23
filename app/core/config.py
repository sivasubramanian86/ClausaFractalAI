"""Core configuration and settings for ClausaFractalAI Neuro-Symbolic Platform.

Provides strongly typed configuration via Pydantic BaseSettings, Google Cloud
Workload Identity / ADC zero-key authentication, and security parameters.
"""

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings and environment configuration."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "ClausaFractalAI"
    app_version: str = "2.0.0"
    environment: str = "development"
    debug: bool = False

    # Google Cloud & Vertex AI
    gcp_project_id: str = Field(default="genai-apac-2026-491004", alias="GCP_PROJECT_ID")
    gcp_location: str = Field(default="us-central1", alias="GCP_LOCATION")
    model_flash: str = Field(default="gemini-3.8-flash-001", alias="MODEL_FLASH")
    model_pro: str = Field(default="gemini-3.8-pro-001", alias="MODEL_PRO")

    # Redis & FinOps Caching
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")
    semantic_cache_threshold: float = Field(default=0.96, alias="SEMANTIC_CACHE_THRESHOLD")
    default_tenant_token_budget: int = Field(default=1_000_000, alias="TENANT_TOKEN_BUDGET")

    # Zero-Trust Governance & Security
    capability_secret_key: str = Field(
        default="clausafractalai-invariable-master-secret-token-2026",
        alias="CAPABILITY_SECRET_KEY",
    )
    max_agent_hops: int = Field(default=5, alias="MAX_AGENT_HOPS")
    enable_dlp_scrubbing: bool = Field(default=True, alias="ENABLE_DLP_SCRUBBING")

    # OpenTelemetry & Cloud Trace
    otel_service_name: str = "clausafractalai-mesh"
    enable_cloud_trace: bool = Field(default=False, alias="ENABLE_CLOUD_TRACE")


settings = Settings()
