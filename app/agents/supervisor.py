"""Master Supervisor Agent with A2A Loop & Deadlock Watchdog.

Orchestrates the Dual-Pass Neuro-Symbolic lifecycle:
1. System 1 Neural Perception (TriageAgent / ReasoningAgent)
2. System 2 Symbolic Verification (Z3 Solver)
3. Automated targeted repair loop (max 2 attempts)
4. Deadlock & Cycle Watchdog protection (<= 5 hops, no A -> B -> A cycles)
5. HITL escalation checkpointing
"""

import uuid
from typing import Any, Dict, List, Optional, Tuple

from app.agents.reasoning_agent import ReasoningAgent
from app.agents.triage_agent import TriageAgent
from app.core.exceptions import DeadlockDetectedError, HITLEscalationRequiredError
from app.core.telemetry import logger
from app.symbolic.contracts import ActionPlan, HITLCheckpoint, VerificationResult
from app.symbolic.solver import SymbolicVerifier


class AgentSupervisor:
    """Master orchestrator enforcing zero-trust A2A delegation and formal verification."""

    def __init__(
        self,
        triage_agent: Optional[TriageAgent] = None,
        reasoning_agent: Optional[ReasoningAgent] = None,
        symbolic_verifier: Optional[SymbolicVerifier] = None,
        max_hops: int = 5,
    ) -> None:
        """Initialize supervisor with subagents and formal verifier."""
        self.triage_agent = triage_agent or TriageAgent()
        self.reasoning_agent = reasoning_agent or ReasoningAgent()
        self.symbolic_verifier = symbolic_verifier or SymbolicVerifier()
        self.max_hops = max_hops
        self.hitl_checkpoints: Dict[str, HITLCheckpoint] = {}

    def run_neuro_symbolic_pipeline(
        self,
        clause_text: str,
        trace_id: Optional[str] = None,
        delegation_stack: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """Execute the end-to-end Dual-Pass Neuro-Symbolic execution loop.

        Args:
            clause_text: Raw legal clause text to analyze.
            trace_id: OpenTelemetry W3C trace ID.
            delegation_stack: Call stack of agents traversed in this execution.

        Returns:
            Dict containing verified ActionPlan, formal Z3 proof, and redline output.
        """
        active_trace_id = trace_id or f"trace_{uuid.uuid4().hex[:12]}"
        stack = list(delegation_stack or ["Supervisor"])

        # 1. A2A Deadlock & Hop Watchdog
        self._enforce_watchdog(stack, target_agent="TriageAgent")
        stack.append("TriageAgent")

        logger.info(
            "Supervisor initiating neuro-symbolic pipeline",
            trace_id=active_trace_id,
            stack=stack,
        )

        # 2. System 1: Neural Perception (Initial ActionPlan proposal)
        candidate_plan = self.triage_agent.analyze_clause_intent(clause_text)

        # 3. System 2: Formal Verification Loop (with single-shot auto-repair)
        verified_plan, verification_result = self._execute_verification_loop(
            candidate_plan=candidate_plan,
            active_trace_id=active_trace_id,
        )

        # 4. If verified SAT, delegate to ReasoningAgent for synthesis
        self._enforce_watchdog(stack, target_agent="ReasoningAgent")
        stack.append("ReasoningAgent")

        synthesis_result = self.reasoning_agent.synthesize_redline(
            plan=verified_plan, source_text=clause_text
        )

        return {
            "trace_id": active_trace_id,
            "status": "PROVEN_AND_SYNTHESIZED",
            "plan": verified_plan.model_dump(),
            "verification": verification_result.model_dump(),
            "synthesis": synthesis_result,
            "delegation_depth": len(stack),
            "delegation_stack": stack,
        }

    def _execute_verification_loop(
        self, candidate_plan: ActionPlan, active_trace_id: str
    ) -> Tuple[ActionPlan, VerificationResult]:
        """Execute Z3 verification and handle self-repair up to 2 attempts."""
        current_plan = candidate_plan
        max_repairs = 2

        for attempt in range(max_repairs + 1):
            ver_result = self.symbolic_verifier.verify_action_plan(current_plan)
            if ver_result.is_satisfiable:
                return current_plan, ver_result

            logger.warning(
                "System 2 verification UNSAT; attempting neural repair",
                attempt=attempt + 1,
                unsat_core=ver_result.unsat_core,
            )

            if attempt < max_repairs:
                # Targeted repair
                current_plan = self.triage_agent.repair_plan(
                    original_plan=current_plan,
                    unsat_core=ver_result.unsat_core,
                )
            else:
                # Exhausted repair attempts: checkpoint to HITL queue
                resumption_token = f"hitl_token_{uuid.uuid4().hex}"
                checkpoint = HITLCheckpoint(
                    checkpoint_id=f"chk_{uuid.uuid4().hex[:8]}",
                    trace_id=active_trace_id,
                    plan=current_plan,
                    unsat_reasons=ver_result.unsat_core,
                    resumption_token=resumption_token,
                )
                self.hitl_checkpoints[resumption_token] = checkpoint
                raise HITLEscalationRequiredError(
                    message=(
                        f"Autonomous repair failed after {max_repairs} attempts. "
                        f"Checkpointed for Human-in-the-Loop review."
                    ),
                    resumption_token=resumption_token,
                    state_id=checkpoint.checkpoint_id,
                )

        return current_plan, ver_result

    def _enforce_watchdog(self, call_stack: List[str], target_agent: str) -> None:
        """Verify delegation hop threshold and detect directed cycles."""
        # Check hop threshold
        if len(call_stack) >= self.max_hops:
            raise DeadlockDetectedError(
                message=f"A2A delegation threshold exceeded maximum depth ({self.max_hops}).",
                call_stack=call_stack,
            )

        # Detect direct cycle: A -> ... -> A
        if target_agent in call_stack:
            raise DeadlockDetectedError(
                message=(
                    f"Circular agent delegation detected: {target_agent} "
                    f"already in stack {call_stack}."
                ),
                call_stack=call_stack + [target_agent],
            )
