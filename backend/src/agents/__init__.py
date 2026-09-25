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
from agents.courtroom_judge import (
    AdvocateStrategy,
    CaseDossier,
    CourtroomAnalysisResult,
    CourtroomDeliberationEngine,
    JudicialVerdict,
    StatutoryElementProof,
)
from agents.critic_reflection import CriticReflectionAgent, CriticReviewResult
from agents.orchestrator import LegalOrchestrator, OrchestratedResponse
from agents.policy_collider import ImpactItem, PolicyColliderAgent, PolicyCollisionReport
from agents.qa_analyst import LegalQAAnalystAgent, QAResponse
from agents.router import RouterAgent, RouterResult
from agents.verification_guard import Citation, VerificationGuard, VerificationResult

__all__ = [
    "ActionableCopilotAgent",
    "AdvocateStrategy",
    "AttorneyPrepSheet",
    "AttorneyQuestion",
    "BlindspotDetectorAgent",
    "BlindspotFinding",
    "BlindspotReport",
    "CaseDossier",
    "Citation",
    "ComplexityTuner",
    "CounterClauseProposal",
    "CourtroomAnalysisResult",
    "CourtroomDeliberationEngine",
    "CriticReflectionAgent",
    "CriticReviewResult",
    "ImpactItem",
    "JudicialVerdict",
    "LegalOrchestrator",
    "LegalQAAnalystAgent",
    "OrchestratedResponse",
    "PolicyColliderAgent",
    "PolicyCollisionReport",
    "QAResponse",
    "RouterAgent",
    "RouterResult",
    "StatutoryElementProof",
    "VerificationGuard",
    "VerificationResult",
]
