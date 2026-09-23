"""Enterprise Circuit Breaker & Resilience Guard.

Implements the Circuit Breaker pattern for external MCP tools and LLM endpoints:
- CLOSED: Requests flow normally. Failures increment failure counter.
- OPEN: After 3 consecutive failures, trips immediately without calling external dependency.
- HALF_OPEN: After 30s recovery cooldown, permits 1 trial request. Success resets to CLOSED;
  failure trips back to OPEN.
"""

import time
from enum import Enum
from typing import Any, Callable

from app.core.exceptions import ClausaFractalError
from app.core.telemetry import logger


class CircuitState(str, Enum):
    """Operational states of a Circuit Breaker."""

    CLOSED = "CLOSED"
    OPEN = "OPEN"
    HALF_OPEN = "HALF_OPEN"


class CircuitBreakerOpenError(ClausaFractalError):
    """Raised when an execution is attempted while the circuit is tripped OPEN."""

    pass


class CircuitBreaker:
    """Manages failure thresholds and cooldown states for external service calls."""

    def __init__(
        self,
        name: str,
        failure_threshold: int = 3,
        recovery_timeout_seconds: float = 30.0,
    ) -> None:
        """Initialize circuit breaker with name and failure thresholds."""
        self.name = name
        self.failure_threshold = failure_threshold
        self.recovery_timeout_seconds = recovery_timeout_seconds
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.last_failure_time: float = 0.0

    def can_execute(self) -> bool:
        """Check whether the circuit allows execution."""
        if self.state == CircuitState.CLOSED:
            return True

        if self.state == CircuitState.OPEN:
            now = time.time()
            if now - self.last_failure_time >= self.recovery_timeout_seconds:
                logger.info(
                    "Circuit Breaker transitioning to HALF_OPEN",
                    breaker=self.name,
                    elapsed=round(now - self.last_failure_time, 2),
                )
                self.state = CircuitState.HALF_OPEN
                return True
            return False

        # HALF_OPEN allows trial call
        return True

    def record_success(self) -> None:
        """Record successful execution, resetting circuit to CLOSED."""
        if self.state != CircuitState.CLOSED:
            logger.info("Circuit Breaker recovered to CLOSED", breaker=self.name)
        self.state = CircuitState.CLOSED
        self.failure_count = 0

    def record_failure(self) -> None:
        """Record execution failure, potentially tripping circuit to OPEN."""
        self.failure_count += 1
        self.last_failure_time = time.time()

        if self.state == CircuitState.HALF_OPEN or self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN
            logger.error(
                "Circuit Breaker TRIPPED to OPEN",
                breaker=self.name,
                failure_count=self.failure_count,
                threshold=self.failure_threshold,
                cooldown_seconds=self.recovery_timeout_seconds,
            )

    def execute(self, func: Callable[..., Any], *args: Any, **kwargs: Any) -> Any:
        """Execute a callable protected by this circuit breaker."""
        if not self.can_execute():
            raise CircuitBreakerOpenError(
                f"Circuit breaker '{self.name}' is OPEN. Fast-failing request."
            )

        try:
            result = func(*args, **kwargs)
            self.record_success()
            return result
        except Exception as e:
            self.record_failure()
            raise e
