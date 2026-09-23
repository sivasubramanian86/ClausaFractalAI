"""Hermetic unit tests for FinOps Two-Tier Cache and Token Router."""

import pytest

from app.core.exceptions import FinOpsBudgetExceededError
from app.finops.cache import FinOpsCache
from app.finops.router import ModelRouter


def test_finops_l1_exact_cache_hit() -> None:
    """Verify L1 exact hash cache hit returns 0 token spend payload."""
    cache = FinOpsCache(semantic_threshold=0.96)
    sys_prompt = "LegalTriage"
    user_input = "What is the liability cap in clause 4?"
    payload = {"result": "Liability capped at $500k"}

    # Initially MISS
    res1, tier1 = cache.get(sys_prompt, user_input)
    assert res1 is None
    assert tier1 == "MISS"

    # Store
    cache.put(sys_prompt, user_input, payload)

    # Second query -> L1 HIT
    res2, tier2 = cache.get(sys_prompt, user_input)
    assert res2 == payload
    assert tier2 == "L1"


def test_finops_l2_semantic_cache_hit() -> None:
    """Verify L2 semantic vector similarity matches slightly differing text."""
    cache = FinOpsCache(semantic_threshold=0.90)
    sys_prompt = "LegalTriage"
    input1 = "customer indemnification liability without limit"
    input2 = "customer indemnification liability without limit."  # identical terms with punctuation
    payload = {"status": "UNSAT", "reason": "unlimited liability"}

    cache.put(sys_prompt, input1, payload)
    res, tier = cache.get(sys_prompt, input2)
    assert res == payload
    assert tier in ["L1", "L2"]


def test_model_router_tier_selection() -> None:
    """Verify router picks fast tier for triage and frontier tier for synthesis."""
    router = ModelRouter()
    flash_model = router.select_model("triage")
    assert "flash" in flash_model.lower()

    pro_model = router.select_model("synthesis")
    assert "pro" in pro_model.lower()


def test_model_router_budget_consumption_and_limit() -> None:
    """Verify router tracks consumption and raises FinOpsBudgetExceededError."""
    router = ModelRouter()
    tenant = "tenant_test_small"
    router.set_budget(tenant, 1000)

    # First call within budget
    usage1 = router.record_usage(
        tenant_id=tenant,
        input_tokens=300,
        output_tokens=200,
        model_name="gemini-3.8-flash-001",
        cache_hit=False,
    )
    assert usage1["consumed_tokens"] == 500
    assert usage1["remaining_budget"] == 500

    # Second call exceeding budget -> raises FinOpsBudgetExceededError
    with pytest.raises(FinOpsBudgetExceededError):
        router.record_usage(
            tenant_id=tenant,
            input_tokens=400,
            output_tokens=300,
            model_name="gemini-3.8-flash-001",
            cache_hit=False,
        )


def test_model_router_cache_hit_savings() -> None:
    """Verify that cache hits calculate cost savings without consuming budget."""
    router = ModelRouter()
    usage = router.record_usage(
        tenant_id="tenant_cache",
        input_tokens=1000,
        output_tokens=500,
        model_name="gemini-3.8-pro-001",
        cache_hit=True,
    )
    assert usage["cache_intercepted"] is True
    assert usage["cost_usd"] == 0.00
    assert usage["cost_saved_usd"] > 0.0
