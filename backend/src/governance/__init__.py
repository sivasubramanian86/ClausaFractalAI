"""Governance and zero-trust security module for ClausaFractalAI."""

from governance.auth import LegalIdentity, verify_legal_token

__all__ = ["LegalIdentity", "verify_legal_token"]
