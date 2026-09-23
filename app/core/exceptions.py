"""Hierarchical error taxonomy for ClausaFractalAI Neuro-Symbolic Agent Mesh."""

from typing import Any, Dict, List, Optional


class ClausaFractalError(Exception):
    """Base exception for all ClausaFractalAI domain and runtime errors."""

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None) -> None:
        """Initialize base exception with error message and contextual details."""
        super().__init__(message)
        self.message = message
        self.details = details or {}


class SymbolicConstraintError(ClausaFractalError):
    """Raised when System 2 Symbolic Verifier proves an action plan is UNSAT."""

    def __init__(
        self,
        message: str,
        unsat_core: Optional[List[str]] = None,
        violated_clauses: Optional[List[str]] = None,
    ) -> None:
        """Initialize symbolic constraint error with unsatisfiable core details."""
        super().__init__(
            message=message,
            details={
                "unsat_core": unsat_core or [],
                "violated_clauses": violated_clauses or [],
            },
        )
        self.unsat_core = unsat_core or []
        self.violated_clauses = violated_clauses or []


class SecurityGovernanceError(ClausaFractalError):
    """Raised on capability token validation failure or capability violation."""

    pass


class DeadlockDetectedError(ClausaFractalError):
    """Raised when an A2A circular delegation or max-hop threshold is exceeded."""

    def __init__(self, message: str, call_stack: Optional[List[str]] = None) -> None:
        """Initialize deadlock exception with agent delegation trace stack."""
        super().__init__(message=message, details={"call_stack": call_stack or []})
        self.call_stack = call_stack or []


class FinOpsBudgetExceededError(ClausaFractalError):
    """Raised when a tenant or execution consumes more tokens than permitted."""

    pass


class HITLEscalationRequiredError(ClausaFractalError):
    """Raised when autonomous self-repair attempts are exhausted."""

    def __init__(self, message: str, resumption_token: str, state_id: str) -> None:
        """Initialize HITL escalation error with resumption token for human review."""
        super().__init__(
            message=message,
            details={"resumption_token": resumption_token, "state_id": state_id},
        )
        self.resumption_token = resumption_token
        self.state_id = state_id


class ModelExecutionError(ClausaFractalError):
    """Raised when an upstream neural perception model call fails."""

    pass
