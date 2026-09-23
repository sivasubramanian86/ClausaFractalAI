"""Enterprise SLO and OpenTelemetry Metrics Registry for ClausaFractalAI.

Defines formal Service Level Objectives (SLOs) and OpenTelemetry metric instruments:
- Availability: Target >= 99.9% uptime
- Triage Latency: p95 < 2.5s for fast perception & routing
- Reasoning Latency: p95 < 8.0s for multi-step counter-clause synthesis
- Tool Error Rate: Target < 1.0% error rate
- FinOps: Token consumption, L1/L2 cache hits and misses
- AIOps: Deadlock breaker trips, HITL escalation count
"""

from typing import Any, Dict

from opentelemetry import metrics

# Initialize OpenTelemetry Meter
meter = metrics.get_meter("clausafractalai-metrics", "2.0.0")

# 1. SLO: Request & Availability Counters
request_counter = meter.create_counter(
    name="clausafractal_requests_total",
    description="Total HTTP requests received by endpoint and status code",
    unit="1",
)

error_counter = meter.create_counter(
    name="clausafractal_errors_total",
    description="Total failed requests violating the < 1.0% error rate SLO",
    unit="1",
)

# 2. SLO: Latency Histograms
triage_latency_histogram = meter.create_histogram(
    name="clausafractal_triage_duration_seconds",
    description="Latency for System 1 Triage Agent (SLO: p95 < 2.5s)",
    unit="s",
)

reasoning_latency_histogram = meter.create_histogram(
    name="clausafractal_reasoning_duration_seconds",
    description="Latency for System 1 Reasoning Agent (SLO: p95 < 8.0s)",
    unit="s",
)

# 3. FinOps & Cache Metrics
cache_hit_counter = meter.create_counter(
    name="clausafractal_cache_hits_total",
    description="Total cache hits segmented by tier (L1 exact, L2 semantic)",
    unit="1",
)

cache_miss_counter = meter.create_counter(
    name="clausafractal_cache_misses_total",
    description="Total cache misses requiring LLM invocation",
    unit="1",
)

token_usage_counter = meter.create_counter(
    name="clausafractal_token_usage_total",
    description="Cumulative token usage attributed to tenant and model tier",
    unit="1",
)

# 4. AIOps & Watchdog Metrics
deadlock_breaker_counter = meter.create_counter(
    name="clausafractal_deadlock_breaker_trips_total",
    description="Number of times A2A Watchdog tripped on circular delegation or max hops",
    unit="1",
)

hitl_escalation_counter = meter.create_counter(
    name="clausafractal_hitl_escalations_total",
    description="Number of contract clauses escalated to Human-in-the-Loop review",
    unit="1",
)

# In-memory tracking for observability endpoints
SLO_TARGETS: Dict[str, Any] = {
    "availability_slo": ">= 99.9%",
    "triage_p95_latency_slo": "< 2.5s",
    "reasoning_p95_latency_slo": "< 8.0s",
    "tool_call_error_rate_slo": "< 1.0%",
    "max_agent_delegation_hops": 5,
}
