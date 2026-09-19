"""Tests for configuration settings and legal baseline templates."""

from config import BASELINE_CONTRACT_TEMPLATES, get_settings


def test_settings_defaults() -> None:
    """Verify default values for configuration settings."""
    settings = get_settings()
    assert settings.app_name == "ClausaFractalAI"
    assert settings.app_version == "1.0.0"
    assert settings.router_model == "gemini-2.0-flash-lite-preview"
    assert settings.analyst_model == "gemini-3.8-flash-001"
    assert settings.synthesis_model == "gemini-3.8-pro-001"
    assert settings.context_caching_threshold == 32768
    assert len(settings.allowed_origins) >= 3


def test_baseline_contract_templates() -> None:
    """Verify that all baseline contract schemas are properly registered."""
    assert "mutual_nda" in BASELINE_CONTRACT_TEMPLATES
    assert "saas_sla" in BASELINE_CONTRACT_TEMPLATES
    assert "employment_agreement" in BASELINE_CONTRACT_TEMPLATES

    nda = BASELINE_CONTRACT_TEMPLATES["mutual_nda"]
    assert "definition_of_confidential_information" in nda["mandatory_clauses"]
    assert nda["critical_thresholds"]["max_confidentiality_term_years"] == 5

    sla = BASELINE_CONTRACT_TEMPLATES["saas_sla"]
    assert "mutual_indemnification_scope" in sla["mandatory_clauses"]
    assert sla["critical_thresholds"]["min_uptime_percentage"] == 99.9

    emp = BASELINE_CONTRACT_TEMPLATES["employment_agreement"]
    assert "intellectual_property_assignment" in emp["mandatory_clauses"]
    assert emp["critical_thresholds"]["max_non_compete_months"] == 12
