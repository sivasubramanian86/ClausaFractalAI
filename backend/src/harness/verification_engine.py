"""Multi-Layered Verification Engine for Agent Harness 2.0.

Implements the multi-layered verification paradigm:
1. Syntax Layer: Typecheck and linting.
2. Behavior Layer: Unit tests and integration tests.
3. Architecture Layer: Architectural rules, security scans, and data isolation.
"""

import hashlib
from typing import Callable, Dict, List, Optional

from harness.models import VerificationCheck, VerificationReport


class VerificationEngine:
    """Executes multi-layered verification pipelines with deterministic error hashing."""

    def __init__(self) -> None:
        """Initialize verification suites per layer."""
        self._check_runners: Dict[str, List[Callable[[], VerificationCheck]]] = {
            "syntax": [],
            "behavior": [],
            "architecture": [],
        }

    def register_check(
        self,
        layer: str,
        name: str,
        runner: Callable[[], bool],
        error_msg: str = "",
    ) -> None:
        """Register a verification check into a specific layer."""
        if layer not in self._check_runners:
            self._check_runners[layer] = []

        def wrapped_probe() -> VerificationCheck:
            try:
                success = runner()
                return VerificationCheck(
                    name=name,
                    layer=layer,
                    success=success,
                    output="Passed" if success else error_msg,
                    error_message=None if success else error_msg,
                )
            except Exception as exc:
                return VerificationCheck(
                    name=name,
                    layer=layer,
                    success=False,
                    output=str(exc),
                    error_message=str(exc),
                )

        self._check_runners[layer].append(wrapped_probe)

    def verify(self) -> VerificationReport:
        """Run all verification layers in order: syntax -> behavior -> architecture."""
        all_checks: List[VerificationCheck] = []
        failing_layer: Optional[str] = None
        error_summary: Optional[str] = None

        for layer in ["syntax", "behavior", "architecture"]:
            runners = self._check_runners.get(layer, [])
            for runner in runners:
                result = runner()
                all_checks.append(result)
                if not result.success and failing_layer is None:
                    failing_layer = layer
                    error_msg = result.error_message or "Check failed"
                    error_summary = f"[{layer.upper()}] {result.name}: {error_msg}"

        overall_success = failing_layer is None
        error_hash = ""
        if error_summary:
            error_hash = hashlib.sha256(error_summary.encode("utf-8")).hexdigest()[:12]

        return VerificationReport(
            success=overall_success,
            checks=all_checks,
            failing_layer=failing_layer,
            error_summary=error_summary,
            error_hash=error_hash,
        )
