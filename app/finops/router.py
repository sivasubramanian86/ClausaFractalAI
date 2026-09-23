"""Dynamic Model Routing and Token Budgeting Gateway.

Routes workloads to the most cost-effective model tier (Gemini Flash vs. Pro)
while tracking tenant token consumption, cost-per-execution, and cumulative savings.
"""

from typing import Any, Dict

from app.core.config import settings
from app.core.exceptions import FinOpsBudgetExceededError
from app.core.telemetry import logger

# Cost constants ($ per million tokens)
COST_FLASH_INPUT_PER_M = 0.075
COST_FLASH_OUTPUT_PER_M = 0.30
COST_PRO_INPUT_PER_M = 1.25
COST_PRO_OUTPUT_PER_M = 5.00


class ModelRouter:
    """Routes legal tasks to appropriate model tiers and manages token budgets."""

    def __init__(self) -> None:
        """Initialize router with tenant budget stores."""
        self._tenant_budgets: Dict[str, int] = {}
        self._tenant_consumed: Dict[str, int] = {}
        self._total_cost_saved_usd: float = 0.0

    def select_model(self, task_type: str) -> str:
        """Dynamically pick model tier based on task complexity.

        - Triage, extraction, validation, repair -> Gemini Flash
        - Multi-clause synthesis, strategic attorney prep -> Gemini Pro
        """
        if task_type in ["synthesis", "strategic_redline", "cross_border_reconcile"]:
            logger.info("Routing to frontier tier", model=settings.model_pro, task=task_type)
            return settings.model_pro
        logger.info("Routing to fast tier", model=settings.model_flash, task=task_type)
        return settings.model_flash

    def record_usage(
        self,
        tenant_id: str,
        input_tokens: int,
        output_tokens: int,
        model_name: str,
        cache_hit: bool = False,
    ) -> Dict[str, Any]:
        """Record token consumption and enforce tenant token budgets."""
        budget = self._tenant_budgets.get(tenant_id, settings.default_tenant_token_budget)
        consumed = self._tenant_consumed.get(tenant_id, 0)

        total_tokens = input_tokens + output_tokens

        # If cache hit, compute cost saved
        if cache_hit:
            saved_cost = (input_tokens / 1_000_000.0) * COST_PRO_INPUT_PER_M + (
                output_tokens / 1_000_000.0
            ) * COST_PRO_OUTPUT_PER_M
            self._total_cost_saved_usd += saved_cost
            return {
                "tenant_id": tenant_id,
                "consumed_tokens": consumed,
                "remaining_budget": budget - consumed,
                "cost_usd": 0.00,
                "cost_saved_usd": round(saved_cost, 6),
                "cache_intercepted": True,
            }

        # Check budget
        if consumed + total_tokens > budget:
            raise FinOpsBudgetExceededError(
                f"Tenant '{tenant_id}' exceeded token budget ({budget} tokens)."
            )

        self._tenant_consumed[tenant_id] = consumed + total_tokens

        # Compute cost
        is_pro = "pro" in model_name.lower()
        in_rate = COST_PRO_INPUT_PER_M if is_pro else COST_FLASH_INPUT_PER_M
        out_rate = COST_PRO_OUTPUT_PER_M if is_pro else COST_FLASH_OUTPUT_PER_M
        cost = (input_tokens / 1_000_000.0) * in_rate + (output_tokens / 1_000_000.0) * out_rate

        return {
            "tenant_id": tenant_id,
            "consumed_tokens": consumed + total_tokens,
            "remaining_budget": budget - (consumed + total_tokens),
            "cost_usd": round(cost, 6),
            "cost_saved_usd": 0.0,
            "cache_intercepted": False,
        }

    def set_budget(self, tenant_id: str, token_budget: int) -> None:
        """Configure custom token budget for a tenant."""
        self._tenant_budgets[tenant_id] = token_budget
