"""Enterprise Observability, OpenTelemetry, Cloud Trace, and DLP Scrubbing.

Configures structured JSON logging via structlog, W3C traceparent propagation,
and pre-egress DLP scrubbing for Aadhaar, PAN, SSN, credit cards, and tokens.
"""

import logging
import re
import sys
from typing import Any, Dict, Optional

import structlog
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider

# Regex patterns for high-risk PII / Credentials
_AADHAAR_RE = re.compile(r"\b[2-9]\d{3}\s\d{4}\s\d{4}\b")
_PAN_RE = re.compile(r"\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b")
_SSN_RE = re.compile(r"\b\d{3}-\d{2}-\d{4}\b")
_CARD_RE = re.compile(r"\b(?:\d{4}[-\s]){3}\d{4}\b")
_PHONE_RE = re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b")
_EMAIL_RE = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
_BEARER_TOKEN_RE = re.compile(r"(?i)bearer\s+[A-Za-z0-9\-_.]+")
_SECRET_KEY_RE = re.compile(
    r"(?i)(?:api_key|secret|password|token)\s*[:=]\s*['\"]?[A-Za-z0-9_\-]{8,}['\"]?"
)


def dlp_scrub_text(text: str) -> str:
    """Scrub sensitive PII, PHI, and credentials from a text string."""
    if not text:
        return text
    scrubbed = _BEARER_TOKEN_RE.sub("Bearer [REDACTED_TOKEN]", text)
    scrubbed = _SECRET_KEY_RE.sub("[REDACTED_CREDENTIAL]", scrubbed)
    scrubbed = _AADHAAR_RE.sub("[REDACTED_AADHAAR]", scrubbed)
    scrubbed = _PAN_RE.sub("[REDACTED_PAN]", scrubbed)
    scrubbed = _SSN_RE.sub("[REDACTED_SSN]", scrubbed)
    scrubbed = _CARD_RE.sub("[REDACTED_CARD]", scrubbed)
    scrubbed = _EMAIL_RE.sub("[REDACTED_EMAIL]", scrubbed)
    scrubbed = _PHONE_RE.sub("[REDACTED_PHONE]", scrubbed)
    return scrubbed


def dlp_scrub_dict(data: Dict[str, Any]) -> Dict[str, Any]:
    """Recursively scrub values in a dictionary."""
    scrubbed: Dict[str, Any] = {}
    for k, v in data.items():
        if isinstance(v, str):
            scrubbed[k] = dlp_scrub_text(v)
        elif isinstance(v, dict):
            scrubbed[k] = dlp_scrub_dict(v)
        elif isinstance(v, list):
            scrubbed[k] = [
                dlp_scrub_text(item)
                if isinstance(item, str)
                else dlp_scrub_dict(item)
                if isinstance(item, dict)
                else item
                for item in v
            ]
        else:
            scrubbed[k] = v
    return scrubbed


def dlp_processor(
    logger: logging.Logger, method_name: str, event_dict: Dict[str, Any]
) -> Dict[str, Any]:
    """Structlog processor that redacts PII/credentials before serialization."""
    return dlp_scrub_dict(event_dict)


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


# Initialize OpenTelemetry with BatchSpanProcessor
tracer_provider = TracerProvider()

try:
    from opentelemetry.exporter.cloud_trace import CloudTraceSpanExporter
    from opentelemetry.sdk.trace.export import BatchSpanProcessor

    tracer_provider.add_span_processor(BatchSpanProcessor(CloudTraceSpanExporter()))
except (ImportError, Exception):
    from opentelemetry.sdk.trace.export import SimpleSpanProcessor
    from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter

    tracer_provider.add_span_processor(SimpleSpanProcessor(InMemorySpanExporter()))

trace.set_tracer_provider(tracer_provider)
tracer = trace.get_tracer("clausafractalai-mesh", "2.0.0")

# Structlog Configuration with Trace-to-Log Correlation
structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        inject_trace_context,
        dlp_processor,
        structlog.processors.JSONRenderer(),
    ],
    logger_factory=structlog.PrintLoggerFactory(file=sys.stdout),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger("clausafractalai")


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
