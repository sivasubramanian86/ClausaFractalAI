"""Configuration module for ClausaFractalAI backend.

Provides settings management, Vertex AI model configuration, baseline contract templates,
and security parameters.
"""

from typing import Any, Dict, List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings and cloud service configurations.

    Attributes:
        app_name: Name of the application service.
        app_version: Semantic release version string.
        environment: Deployment environment (development, staging, production).
        port: Port number on which the ASGI server listens.
        gcp_project_id: Google Cloud Platform Project ID for Vertex AI.
        gcp_location: Regional endpoint for Vertex AI Model Garden.
        router_model: Low-latency intent classification model name.
        analyst_model: Core legal reasoning and context caching model name.
        synthesis_model: Deep strategic synthesis and attorney prep model name.
        context_caching_threshold: Minimum tokens required to activate native Vertex AI caching.
        allowed_origins: CORS origin whitelist.
    """

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "ClausaFractalAI"
    app_version: str = "1.0.0"
    environment: str = Field(default="development", alias="ENVIRONMENT")
    port: int = Field(default=8000, alias="PORT")
    gcp_project_id: str = Field(default="genai-apac-2026-491004", alias="GOOGLE_CLOUD_PROJECT")
    gcp_location: str = Field(default="us-central1", alias="GOOGLE_CLOUD_LOCATION")
    google_genai_use_vertexai: bool = Field(default=True, alias="GOOGLE_GENAI_USE_VERTEXAI")

    # Vertex AI Model Topology (Gemini 3.8 Generation)
    router_model: str = "gemini-3.8-flash-001"
    analyst_model: str = "gemini-3.8-flash-001"
    synthesis_model: str = "gemini-3.8-pro-001"
    agent_framework: str = "google-adk"
    context_caching_threshold: int = 32768

    # Security & CORS Whitelist
    allowed_origins: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://clausafractalai.web.app",
    ]


# Baseline Legal Schemas for Blindspot Detection
BASELINE_CONTRACT_TEMPLATES: Dict[str, Dict[str, Any]] = {
    "mutual_nda": {
        "title": "Standard Mutual Non-Disclosure Agreement",
        "mandatory_clauses": [
            "definition_of_confidential_information",
            "obligations_of_receiving_party",
            "exclusions_from_confidentiality",
            "term_and_termination",
            "return_or_destruction_of_materials",
            "remedies_and_injunctive_relief",
            "governing_law_and_jurisdiction",
            "non_solicitation_limitation",
        ],
        "critical_thresholds": {
            "max_confidentiality_term_years": 5,
            "return_period_days": 30,
        },
    },
    "saas_sla": {
        "title": "Enterprise Cloud SaaS Agreement & SLA",
        "mandatory_clauses": [
            "service_availability_uptime_commitment",
            "scheduled_maintenance_windows",
            "data_ownership_and_intellectual_property",
            "limitation_of_liability_and_caps",
            "mutual_indemnification_scope",
            "data_security_and_breach_notification",
            "termination_for_convenience",
            "data_export_and_transition_assistance",
        ],
        "critical_thresholds": {
            "min_uptime_percentage": 99.9,
            "breach_notification_window_hours": 72,
        },
    },
    "employment_agreement": {
        "title": "Standard Executive / Specialist Employment Agreement",
        "mandatory_clauses": [
            "duties_and_responsibilities",
            "compensation_and_benefits",
            "intellectual_property_assignment",
            "non_compete_geography_and_duration",
            "severance_and_termination_conditions",
            "confidentiality_obligations",
            "dispute_resolution_and_arbitration",
        ],
        "critical_thresholds": {
            "max_non_compete_months": 12,
            "notice_period_days": 30,
        },
    },
}


def get_settings() -> Settings:
    """Instantiate and return the cached application configuration settings.

    Returns:
        Settings: Configured application settings instance.
    """
    return Settings()
