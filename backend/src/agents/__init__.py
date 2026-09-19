"""Agents package for ClausaFractalAI.

Exposes specialized legal agents, reflection critics, blindspot auditors,
policy colliders, and copilot action tools.
"""

from agents.blindspot import BlindspotDetectorAgent, BlindspotFinding, BlindspotReport
from agents.complexity import ComplexityTuner
from agents.copilot_actions import (
    ActionableCopilotAgent,
    AttorneyPrepSheet,
    AttorneyQuestion,
    CounterClauseProposal,
)
from agents.critic_reflection import CriticReflectionAgent, CriticReviewResult
from agents.policy_collider import ImpactItem, PolicyColliderAgent, PolicyCollisionReport
from agents.qa_analyst import LegalQAAnalystAgent, QAResponse
from agents.router import RouterAgent, RouterResult
from agents.verification_guard import Citation, VerificationGuard, VerificationResult

__all__ = [
    "ActionableCopilotAgent",
    "AttorneyPrepSheet",
    "AttorneyQuestion",
    "BlindspotDetectorAgent",
    "BlindspotFinding",
    "BlindspotReport",
    "Citation",
    "ComplexityTuner",
    "CounterClauseProposal",
    "CriticReflectionAgent",
    "CriticReviewResult",
    "ImpactItem",
    "LegalQAAnalystAgent",
    "PolicyColliderAgent",
    "PolicyCollisionReport",
    "QAResponse",
    "RouterAgent",
    "RouterResult",
    "VerificationGuard",
    "VerificationResult",
]
