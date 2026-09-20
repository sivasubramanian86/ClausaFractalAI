"""Data models for Agent Harness 2.0.

Defines schemas for planning, action execution, multi-layered verification,
structured feedback, and recovery snapshots.
"""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class AgentPlan(BaseModel):
    """Execution plan formulated before mutating repository or state."""

    task: str
    target_files: List[str] = Field(default_factory=list)
    proposed_changes: List[str] = Field(default_factory=list)
    architecture_rationale: str = ""
    is_approved: bool = False


class AgentAction(BaseModel):
    """Discrete executable step undertaken by an AI agent."""

    action_type: str
    target: str
    payload: Dict[str, Any] = Field(default_factory=dict)
    rationale: str = ""


class VerificationCheck(BaseModel):
    """Outcome of a single verification probe across syntax, behavior, or architecture."""

    name: str
    layer: str  # 'syntax', 'behavior', 'architecture'
    success: bool
    output: str = ""
    error_message: Optional[str] = None


class VerificationReport(BaseModel):
    """Aggregate multi-layered verification report."""

    success: bool
    checks: List[VerificationCheck] = Field(default_factory=list)
    failing_layer: Optional[str] = None
    error_summary: Optional[str] = None
    error_hash: str = ""


class HarnessFeedback(BaseModel):
    """Actionable feedback injected back to the agent for recovery."""

    attempt: int
    what_failed: str
    why_it_failed: str
    what_changed: str
    what_to_try_next: str
    error_hash: str


class HarnessResult(BaseModel):
    """Final outcome of the Harness 2.0 execution loop."""

    success: bool
    task: str
    total_attempts: int
    message: str
    plan: Optional[AgentPlan] = None
    verification: Optional[VerificationReport] = None
    feedback_history: List[HarnessFeedback] = Field(default_factory=list)
