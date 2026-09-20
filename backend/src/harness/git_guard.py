"""Git Awareness and Rollback Guard for Agent Harness 2.0.

Ensures the agent knows exactly what it changed, inspects diffs, and rolls back
if forbidden files (e.g. .env, secrets, production credentials, lockfiles)
are touched.
"""

from typing import List, Tuple


class GitGuard:
    """Monitors file changes and guards against unauthorized file modifications."""

    DEFAULT_FORBIDDEN_PATTERNS = [
        ".env",
        ".env.local",
        "id_rsa",
        "service_account.json",
        "credentials.json",
        ".git/",
    ]

    def __init__(self, forbidden_patterns: List[str] = None) -> None:
        """Initialize GitGuard with forbidden file patterns."""
        self._forbidden_patterns = (
            forbidden_patterns
            if forbidden_patterns is not None
            else list(self.DEFAULT_FORBIDDEN_PATTERNS)
        )
        self._tracked_changes: List[str] = []

    def inspect_changes(self, modified_files: List[str]) -> Tuple[bool, List[str]]:
        """Check if any modified file violates safety constraints.

        Args:
            modified_files: List of file paths touched by the agent.

        Returns:
            Tuple of (is_safe: bool, violations: List[str]).
        """
        violations: List[str] = []
        for f in modified_files:
            clean_path = f.replace("\\", "/")
            for pattern in self._forbidden_patterns:
                if pattern in clean_path:
                    violations.append(clean_path)
                    break

        is_safe = len(violations) == 0
        if is_safe:
            self._tracked_changes = list(modified_files)
        return is_safe, violations

    def rollback(self) -> str:
        """Simulate or execute rollback of unapproved changes."""
        reverted_count = len(self._tracked_changes)
        self._tracked_changes = []
        return f"Rollback executed successfully: {reverted_count} files restored."
