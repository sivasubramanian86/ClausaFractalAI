"""Hermetic unit tests for Zero-Trust Capability Tokens and DLP Sanitization."""

import time

import pytest

from app.core.exceptions import SecurityGovernanceError
from app.core.security import CapabilityToken, issue_capability_token
from app.core.telemetry import dlp_scrub_dict, dlp_scrub_text


def test_capability_token_sign_and_verify_valid() -> None:
    """Verify that a freshly minted capability token verifies successfully."""
    token_str = issue_capability_token(
        tenant_id="tenant_123",
        agent_id="agent_alpha",
        allowed_tools=["formal_verify_clause", "scrub_pii_dlp"],
        ttl_seconds=3600,
    )
    token = CapabilityToken.verify(token_str)
    assert token.tenant_id == "tenant_123"
    assert token.agent_id == "agent_alpha"
    assert "formal_verify_clause" in token.allowed_tools


def test_capability_token_signature_tampering() -> None:
    """Verify that tampering with the token payload breaks HMAC verification."""
    token_str = issue_capability_token(
        tenant_id="tenant_123",
        agent_id="agent_alpha",
        allowed_tools=["scrub_pii_dlp"],
    )
    # Tamper payload
    tampered = token_str.replace("tenant_123", "tenant_hacker")
    with pytest.raises(SecurityGovernanceError) as exc:
        CapabilityToken.verify(tampered)
    assert "Invalid capability token signature" in str(exc.value)


def test_capability_token_expired() -> None:
    """Verify that an expired capability token is rejected."""
    token = CapabilityToken(
        tenant_id="tenant_exp",
        agent_id="agent_exp",
        allowed_tools=["*"],
        expires_at=int(time.time()) - 10,  # Expired 10s ago
    )
    signed_expired = token.sign()
    with pytest.raises(SecurityGovernanceError) as exc:
        CapabilityToken.verify(signed_expired)
    assert "expired" in str(exc.value).lower()


def test_capability_token_malformed() -> None:
    """Verify that non-period-separated or garbage tokens raise SecurityGovernanceError."""
    with pytest.raises(SecurityGovernanceError):
        CapabilityToken.verify("invalid_token_without_period")


def test_dlp_scrubbing_pii_and_credentials() -> None:
    """Verify that sensitive patterns are scrubbed from text strings."""
    dirty_text = (
        "User with PAN ABCDE1234F and SSN 123-45-6789 and card 4111-2222-3333-4444 "
        "and email legal@acme.com called +1 (555) 123-4567 with Bearer secret_jwt_token_here "
        "and secret='supersecretpass123'."
    )
    clean = dlp_scrub_text(dirty_text)

    assert "ABCDE1234F" not in clean
    assert "[REDACTED_PAN]" in clean
    assert "123-45-6789" not in clean
    assert "[REDACTED_SSN]" in clean
    assert "4111-2222-3333-4444" not in clean
    assert "[REDACTED_CARD]" in clean
    assert "legal@acme.com" not in clean
    assert "[REDACTED_EMAIL]" in clean
    assert "secret_jwt_token_here" not in clean
    assert "[REDACTED_TOKEN]" in clean


def test_dlp_scrub_dict_nested() -> None:
    """Verify recursive scrubbing across nested dictionaries and lists."""
    dirty_dict = {
        "event": "audit",
        "details": {
            "contact_email": "counsel@firm.com",
            "items": ["User SSN 987-65-4321", "Clean item"],
        },
    }
    scrubbed = dlp_scrub_dict(dirty_dict)
    assert "[REDACTED_EMAIL]" in scrubbed["details"]["contact_email"]
    assert "[REDACTED_SSN]" in scrubbed["details"]["items"][0]
    assert scrubbed["details"]["items"][1] == "Clean item"
