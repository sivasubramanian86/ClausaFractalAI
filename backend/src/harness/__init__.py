"""Agent Harness 2.0 package for ClausaFractalAI.

Implements the Sachin Kasana Agent Harness 2.0 architecture:
Context -> Action -> Execution -> Multi-Layered Verification -> Feedback -> Recovery.
"""

from harness.agent_harness import AgentHarness
from harness.git_guard import GitGuard
from harness.memory_store import HarnessMemoryStore
from harness.models import (
    AgentAction,
    AgentPlan,
    HarnessFeedback,
    HarnessResult,
    VerificationCheck,
    VerificationReport,
)
from harness.verification_engine import VerificationEngine

__all__ = [
    "AgentAction",
    "AgentHarness",
    "AgentPlan",
    "GitGuard",
    "HarnessFeedback",
    "HarnessMemoryStore",
    "HarnessResult",
    "VerificationCheck",
    "VerificationReport",
    "VerificationEngine",
]
