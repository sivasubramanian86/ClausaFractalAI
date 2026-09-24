"""Unit tests for backend OpenTelemetry and structlog trace correlation."""

import pytest
from fastapi import FastAPI, Request
from fastapi.testclient import TestClient
from opentelemetry import trace

from telemetry import (
    format_w3c_traceparent,
    get_current_trace_id,
    inject_trace_context,
    logger,
)
from main import TraceTelemetryMiddleware


def test_telemetry_traceparent_formatter() -> None:
    """Verify standard W3C traceparent formatting and default fallbacks."""
    tp = format_w3c_traceparent("00112233445566778899aabbccddeeff", "0011223344556677")
    assert tp == "00-00112233445566778899aabbccddeeff-0011223344556677-01"

    # Default fallback when no span is active
    default_tp = format_w3c_traceparent()
    assert default_tp.startswith("00-")
    assert default_tp.endswith("-01")


def test_telemetry_get_current_trace_id_and_inject_context() -> None:
    """Verify trace ID extraction and structlog processor context injection."""
    # When no span is active
    tid = get_current_trace_id()
    assert isinstance(tid, str)

    event_dict = {"event": "test_event"}
    processed = inject_trace_context(logger, "info", event_dict)
    assert processed["event"] == "test_event"

    # When span is actively running
    tracer = trace.get_tracer("test-tracer")
    with tracer.start_as_current_span("unit-test-span") as span:
        active_tid = get_current_trace_id()
        assert active_tid != "00000000000000000000000000000000"

        span_event = {"event": "span_event"}
        span_processed = inject_trace_context(logger, "info", span_event)
        assert span_processed["trace_id"] == active_tid
        assert "logging.googleapis.com/trace" in span_processed
        assert span_processed["logging.googleapis.com/trace"].endswith(active_tid)

    logger.info("Test telemetry log output", test_key="telemetry_val")


def test_trace_telemetry_middleware_execution() -> None:
    """Verify middleware extracts or generates traceparent and attaches latency header."""
    app = FastAPI()
    app.add_middleware(TraceTelemetryMiddleware)

    @app.get("/ping")
    async def ping() -> dict:
        return {"status": "ok"}

    client = TestClient(app)

    # Call with pre-existing traceparent
    custom_tp = "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01"
    res1 = client.get("/ping", headers={"traceparent": custom_tp})
    assert res1.status_code == 200
    assert res1.headers["traceparent"] == custom_tp
    assert "X-Processing-Time-Ms" in res1.headers

    # Call without traceparent (should auto-generate)
    res2 = client.get("/ping")
    assert res2.status_code == 200
    assert res2.headers["traceparent"].startswith("00-")
    assert "X-Processing-Time-Ms" in res2.headers
