"""Agent Harness 2.0 Core Orchestrator.

Implements the Harness 2.0 pattern:
- Separate Planning from Execution (Task -> Plan -> Review -> Execute -> Verify).
- Multi-Layered Verification (Syntax -> Behavior -> Architecture).
- Finite Recovery Loop with MAX_ATTEMPTS = 3.
- Infinite Loop Detection using error_hash tracking.
- Git Safety Guard and Rollback on forbidden file access.
- Structured feedback injection for autonomous recovery.
"""

from typing import Any, Callable, Dict, List, Optional, Set, Tuple

from harness.git_guard import GitGuard
from harness.memory_store import HarnessMemoryStore
from harness.models import (
    AgentPlan,
    HarnessFeedback,
    HarnessResult,
    VerificationReport,
)
from harness.verification_engine import VerificationEngine


class AgentHarness:
    """Enterprise execution environment enforcing constraints and verification around AI agents."""

    MAX_ATTEMPTS = 3

    def __init__(
        self,
        memory_store: Optional[HarnessMemoryStore] = None,
        git_guard: Optional[GitGuard] = None,
        verification_engine: Optional[VerificationEngine] = None,
    ) -> None:
        """Initialize the Agent Harness 2.0 with memory, git guard, and verification engine."""
        self.memory = memory_store or HarnessMemoryStore()
        self.git_guard = git_guard or GitGuard()
        self.verifier = verification_engine or VerificationEngine()
        self._seen_error_hashes: Set[str] = set()

    def formulate_plan(
        self,
        task: str,
        target_files: List[str],
        proposed_changes: List[str],
        architecture_rationale: str = "",
    ) -> AgentPlan:
        """Stage 1: Formulate explicit plan prior to modifying files."""
        return AgentPlan(
            task=task,
            target_files=target_files,
            proposed_changes=proposed_changes,
            architecture_rationale=architecture_rationale,
            is_approved=False,
        )

    def review_plan(self, plan: AgentPlan) -> Tuple[bool, List[str]]:
        """Stage 2: Inspect plan against Git safety constraints and architecture rules."""
        is_safe, violations = self.git_guard.inspect_changes(plan.target_files)
        if is_safe:
            plan.is_approved = True
        return is_safe, violations

    def execute_with_recovery(
        self,
        task: str,
        plan: AgentPlan,
        executor: Callable[[int, Optional[HarnessFeedback]], Dict[str, Any]],
    ) -> HarnessResult:
        """Stage 3 & 4: Execute within the bounded recovery loop."""
        feedback_history: List[HarnessFeedback] = []
        last_verification: Optional[VerificationReport] = None
        current_feedback: Optional[HarnessFeedback] = None

        if not plan.is_approved:
            is_safe, violations = self.review_plan(plan)
            if not is_safe:
                self.git_guard.rollback()
                return HarnessResult(
                    success=False,
                    task=task,
                    total_attempts=0,
                    message=f"Plan rejected by GitGuard: Forbidden files targeted {violations}",
                    plan=plan,
                )

        for attempt in range(1, self.MAX_ATTEMPTS + 1):
            executor(attempt, current_feedback)

            verification = self.verifier.verify()
            last_verification = verification

            if verification.success:
                self.memory.record_progress(task, f"Completed on attempt {attempt}")
                if plan.architecture_rationale:
                    self.memory.record_decision(
                        title=f"Decision for {task}",
                        decision="; ".join(plan.proposed_changes),
                        reason=plan.architecture_rationale,
                    )
                return HarnessResult(
                    success=True,
                    task=task,
                    total_attempts=attempt,
                    message="Task completed and independently verified across all layers.",
                    plan=plan,
                    verification=verification,
                    feedback_history=feedback_history,
                )

            # Verification failed: check for repeated identical failure
            err_hash = verification.error_hash
            if err_hash in self._seen_error_hashes:
                self.memory.record_failure(
                    task=task,
                    error=verification.error_summary or "Repeated failure",
                    lesson_learned=(
                        "Avoid repeating identical action without architectural mutation."
                    ),
                )
                self.git_guard.rollback()
                return HarnessResult(
                    success=False,
                    task=task,
                    total_attempts=attempt,
                    message=(
                        "Harness halted: Infinite loop detected with repeated "
                        f"error hash [{err_hash}]."
                    ),
                    plan=plan,
                    verification=verification,
                    feedback_history=feedback_history,
                )

            self._seen_error_hashes.add(err_hash)

            # Construct structured actionable feedback for recovery
            current_feedback = HarnessFeedback(
                attempt=attempt,
                what_failed=verification.failing_layer or "unknown",
                why_it_failed=verification.error_summary or "Verification check failed",
                what_changed=f"Attempt {attempt} executed changes",
                what_to_try_next=f"Fix issues identified in {verification.failing_layer} layer.",
                error_hash=err_hash,
            )
            feedback_history.append(current_feedback)

        # Exceeded MAX_ATTEMPTS
        self.git_guard.rollback()
        return HarnessResult(
            success=False,
            task=task,
            total_attempts=self.MAX_ATTEMPTS,
            message=f"Task failed safely after {self.MAX_ATTEMPTS} attempts.",
            plan=plan,
            verification=last_verification,
            feedback_history=feedback_history,
        )
