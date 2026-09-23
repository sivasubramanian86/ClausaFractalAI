"""Zero-Trust Agent Security & Capability Token Management.

Implements cryptographically signed HMAC-SHA256 capability tokens that gate
MCP tool execution, agent delegation permissions, and data boundaries.
"""

import hashlib
import hmac
import json
import time
from typing import Any, Dict, List, Optional

from app.core.config import settings
from app.core.exceptions import SecurityGovernanceError
from app.core.telemetry import dlp_scrub_text


class CapabilityToken:
    """Represents a signed capability claim allowing specific agent actions."""

    def __init__(
        self,
        tenant_id: str,
        agent_id: str,
        allowed_tools: List[str],
        expires_at: int,
        max_executions: int = 10,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Initialize capability token claims."""
        self.tenant_id = tenant_id
        self.agent_id = agent_id
        self.allowed_tools = allowed_tools
        self.expires_at = expires_at
        self.max_executions = max_executions
        self.metadata = metadata or {}

    def to_dict(self) -> Dict[str, Any]:
        """Convert token claims to dictionary."""
        return {
            "tenant_id": self.tenant_id,
            "agent_id": self.agent_id,
            "allowed_tools": self.allowed_tools,
            "expires_at": self.expires_at,
            "max_executions": self.max_executions,
            "metadata": self.metadata,
        }

    def sign(self, secret_key: Optional[str] = None) -> str:
        """Sign token claims with HMAC-SHA256 and return serialized bearer string."""
        secret = (secret_key or settings.capability_secret_key).encode("utf-8")
        payload_bytes = json.dumps(self.to_dict(), sort_keys=True).encode("utf-8")
        signature = hmac.new(secret, payload_bytes, hashlib.sha256).hexdigest()
        raw_token = f"{json.dumps(self.to_dict(), sort_keys=True)}.{signature}"
        return raw_token

    @classmethod
    def verify(cls, raw_token: str, secret_key: Optional[str] = None) -> "CapabilityToken":
        """Verify HMAC-SHA256 signature and validity of a capability token string."""
        if not raw_token or "." not in raw_token:
            raise SecurityGovernanceError("Malformed capability token format.")

        payload_part, signature = raw_token.rsplit(".", 1)
        secret = (secret_key or settings.capability_secret_key).encode("utf-8")
        expected_sig = hmac.new(secret, payload_part.encode("utf-8"), hashlib.sha256).hexdigest()

        if not hmac.compare_digest(signature, expected_sig):
            raise SecurityGovernanceError("Invalid capability token signature.")

        try:
            claims = json.loads(payload_part)
        except Exception as e:
            raise SecurityGovernanceError(f"Corrupted capability token payload: {e}") from e

        if int(time.time()) > claims.get("expires_at", 0):
            raise SecurityGovernanceError("Capability token has expired.")

        return cls(
            tenant_id=claims["tenant_id"],
            agent_id=claims["agent_id"],
            allowed_tools=claims.get("allowed_tools", []),
            expires_at=claims["expires_at"],
            max_executions=claims.get("max_executions", 10),
            metadata=claims.get("metadata", {}),
        )


def issue_capability_token(
    tenant_id: str,
    agent_id: str,
    allowed_tools: List[str],
    ttl_seconds: int = 3600,
) -> str:
    """Helper to mint a new signed capability token for an agent session."""
    token = CapabilityToken(
        tenant_id=tenant_id,
        agent_id=agent_id,
        allowed_tools=allowed_tools,
        expires_at=int(time.time()) + ttl_seconds,
    )
    return token.sign()


def sanitize_agent_input(text: str) -> str:
    """Scrub PII and normalize user or agent text before processing."""
    return dlp_scrub_text(text.strip())
