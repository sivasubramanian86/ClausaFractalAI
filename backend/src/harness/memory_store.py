"""Persistent Memory Store for Agent Harness 2.0.

Maintains four focused memory channels:
- decisions: Architectural decisions and rationale.
- progress: Milestones and completed tasks.
- failures: Past errors and rejected approaches to prevent repeated mistakes.
- architecture: System boundaries, layers, and constraints.
"""

from typing import Dict, List


class HarnessMemoryStore:
    """Manages persistent memory channels across agent execution loops."""

    def __init__(self) -> None:
        """Initialize empty in-memory memory channels."""
        self._decisions: List[Dict[str, str]] = []
        self._progress: List[Dict[str, str]] = []
        self._failures: List[Dict[str, str]] = []
        self._architecture: List[str] = [
            "Controllers must not access database directly.",
            "Business logic belongs in services layer.",
            "Database access belongs in repository/service layer.",
            "All API changes require automated tests.",
            "Zero hallucination policy: unsupported facts must trigger refusal.",
        ]

    def record_decision(self, title: str, decision: str, reason: str) -> None:
        """Record an architectural decision."""
        self._decisions.append(
            {
                "title": title,
                "decision": decision,
                "reason": reason,
            }
        )

    def record_progress(self, task: str, details: str) -> None:
        """Record task completion progress."""
        self._progress.append(
            {
                "task": task,
                "details": details,
            }
        )

    def record_failure(self, task: str, error: str, lesson_learned: str) -> None:
        """Record a failure and lesson learned to prevent future regressions."""
        self._failures.append(
            {
                "task": task,
                "error": error,
                "lesson_learned": lesson_learned,
            }
        )

    def get_decisions(self) -> List[Dict[str, str]]:
        """Return list of recorded decisions."""
        return list(self._decisions)

    def get_progress(self) -> List[Dict[str, str]]:
        """Return list of recorded progress entries."""
        return list(self._progress)

    def get_failures(self) -> List[Dict[str, str]]:
        """Return list of recorded failures."""
        return list(self._failures)

    def get_architecture_rules(self) -> List[str]:
        """Return canonical architectural boundary rules."""
        return list(self._architecture)

    def format_context_memory(self) -> str:
        """Format a focused memory summary for context injection."""
        lines = ["# HARNESS 2.0 MEMORY CONTEXT"]

        if self._architecture:
            lines.append("## Architectural Constraints")
            for rule in self._architecture:
                lines.append(f"- {rule}")

        if self._failures:
            lines.append("## Prior Failures & Anti-Patterns (DO NOT REPEAT)")
            for f in self._failures[-3:]:
                lines.append(
                    f"- Task: {f['task']} | Error: {f['error']} | Avoid: {f['lesson_learned']}"
                )

        if self._decisions:
            lines.append("## Past Architectural Decisions")
            for d in self._decisions[-3:]:
                lines.append(f"- {d['title']}: {d['decision']} (Reason: {d['reason']})")

        return "\n".join(lines)
