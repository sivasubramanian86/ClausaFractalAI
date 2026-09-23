"""Human-in-the-Loop (HITL) Checkpoint and Resumption Queue.

Stores failed or high-blast-radius execution states when automated self-repair
attempts are exhausted. Issues unique resumption tokens for human attorney review.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from app.core.exceptions import ClausaFractalError
from app.core.telemetry import logger
from app.symbolic.contracts import ActionPlan, HITLCheckpoint


class HITLQueue:
    """Async HITL review queue managing execution checkpoints and human approvals."""

    def __init__(self, redis_client: Optional[Any] = None) -> None:
        """Initialize HITL queue with optional Redis client."""
        self.redis_client = redis_client
        self._checkpoints: Dict[str, HITLCheckpoint] = {}

    def checkpoint_state(
        self,
        trace_id: str,
        plan: ActionPlan,
        unsat_reasons: List[str],
        resumption_token: str,
    ) -> HITLCheckpoint:
        """Checkpoint an execution state to the queue for human review."""
        checkpoint = HITLCheckpoint(
            checkpoint_id=f"chk_{trace_id[-8:]}",
            trace_id=trace_id,
            plan=plan,
            unsat_reasons=unsat_reasons,
            resumption_token=resumption_token,
            status="PENDING_REVIEW",
        )
        self._checkpoints[resumption_token] = checkpoint
        logger.warning(
            "Execution state checkpointed to HITL queue",
            resumption_token=resumption_token,
            unsat_reasons=unsat_reasons,
        )
        return checkpoint

    def get_checkpoint(self, resumption_token: str) -> Optional[HITLCheckpoint]:
        """Retrieve a checkpoint by its resumption token."""
        return self._checkpoints.get(resumption_token)

    def list_pending_checkpoints(self) -> List[HITLCheckpoint]:
        """List all tickets waiting for human attorney or operator review."""
        return [chk for chk in self._checkpoints.values() if chk.status == "PENDING_REVIEW"]

    def human_resolve(
        self,
        resumption_token: str,
        decision: str,  # "APPROVED", "REJECTED", "MODIFIED"
        reviewer_notes: str,
        overridden_plan: Optional[ActionPlan] = None,
    ) -> Dict[str, Any]:
        """Process human reviewer decision and update ticket status."""
        chk = self.get_checkpoint(resumption_token)
        if not chk:
            raise ClausaFractalError(f"Checkpoint not found for token '{resumption_token}'.")

        updated_plan = overridden_plan or chk.plan
        resolved_at = datetime.now(timezone.utc).isoformat()

        logger.info(
            "HITL Checkpoint resolved by human reviewer",
            resumption_token=resumption_token,
            decision=decision,
            notes=reviewer_notes,
        )

        return {
            "resumption_token": resumption_token,
            "status": decision,
            "reviewer_notes": reviewer_notes,
            "resolved_at": resolved_at,
            "final_plan": updated_plan.model_dump(),
        }
