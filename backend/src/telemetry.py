"""Enterprise Observability, OpenTelemetry, and Google Cloud Trace for backend.

Configures structured JSON logging via structlog, W3C traceparent propagation,
and OpenTelemetry distributed tracing correlated to Google Cloud Trace.
"""

import logging
import sys
from typing import Any, Dict, Optional

import structlog
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter


def inject_trace_context(
    logger: logging.Logger, method_name: str, event_dict: Dict[str, Any]
) -> Dict[str, Any]:
    """Structlog processor injecting active W3C OpenTelemetry trace_id and span_id."""
    span = trace.get_current_span()
    span_ctx = span.get_span_context() if span else None
    if span_ctx and span_ctx.is_valid:
        trace_id = f"{span_ctx.trace_id:032x}"
        span_id = f"{span_ctx.span_id:016x}"
        event_dict["trace_id"] = trace_id
        event_dict["span_id"] = span_id
        event_dict["logging.googleapis.com/trace"] = f"projects/clausafractalai/traces/{trace_id}"
        event_dict["logging.googleapis.com/spanId"] = span_id
    return event_dict


# Initialize OpenTelemetry TracerProvider
_tracer_provider = TracerProvider()
_tracer_provider.add_span_processor(SimpleSpanProcessor(InMemorySpanExporter()))
trace.set_tracer_provider(_tracer_provider)
tracer = trace.get_tracer("clausafractalai-backend", "2.0.0")

# Structlog Configuration
structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        inject_trace_context,
        structlog.processors.JSONRenderer(),
    ],
    logger_factory=structlog.PrintLoggerFactory(file=sys.stdout),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger("clausafractalai.backend")


def get_current_trace_id() -> str:
    """Extract current W3C OpenTelemetry trace ID or return empty string."""
    span = trace.get_current_span()
    span_ctx = span.get_span_context() if span else None
    if span_ctx and span_ctx.is_valid:
        return f"{span_ctx.trace_id:032x}"
    return "00000000000000000000000000000000"


def format_w3c_traceparent(trace_id: Optional[str] = None, span_id: Optional[str] = None) -> str:
    """Format a standard W3C traceparent header string: 00-{trace_id}-{span_id}-01."""
    t_id = trace_id or get_current_trace_id()
    s_id = span_id or "0000000000000001"
    return f"00-{t_id}-{s_id}-01"
