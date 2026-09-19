"""Boilerplate Pruner service for ClausaFractalAI.

Strips repeating headers, footers, page numbers, and confidentiality stamps
to maximize Gemini Context Caching efficiency and reduce vector index noise.
"""

import re
from typing import List, Pattern


class BoilerplatePruner:
    """Removes redundant contract boilerplate, headers, footers, and page counters."""

    PAGE_NUMBER_PATTERNS: List[Pattern[str]] = [
        re.compile(r"(?i)^\s*page\s+\d+\s+of\s+\d+\s*$", re.MULTILINE),
        re.compile(r"(?i)^\s*page\s+\d+\s*$", re.MULTILINE),
        re.compile(r"(?i)^\s*\[page\s+\d+\]\s*$", re.MULTILINE),
        re.compile(r"^\s*-\s*\d+\s*-\s*$", re.MULTILINE),
        re.compile(r"^\s*\d+\s*/\s*\d+\s*$", re.MULTILINE),
    ]

    STAMP_PATTERNS: List[Pattern[str]] = [
        re.compile(
            r"(?i)^\s*(?:strictly\s+)?confidential\s*$",
            re.MULTILINE,
        ),
        re.compile(
            r"(?i)^\s*attorney-client\s+(?:privileged|privilege)\s*$",
            re.MULTILINE,
        ),
        re.compile(
            r"(?i)^\s*all\s+rights\s+reserved\s*$",
            re.MULTILINE,
        ),
    ]

    def prune_text(self, text: str) -> str:
        """Strip boilerplate headers, footers, stamps, and redundant blank lines from text.

        Args:
            text: Raw string containing contract page or document text.

        Returns:
            Sanitized, compressed string with boilerplate eliminated.
        """
        if not text:
            return ""

        pruned = text

        for pattern in self.PAGE_NUMBER_PATTERNS:
            pruned = pattern.sub("", pruned)

        for pattern in self.STAMP_PATTERNS:
            pruned = pattern.sub("", pruned)

        # Collapse 3 or more consecutive newlines into 2
        pruned = re.sub(r"\n{3,}", "\n\n", pruned)

        return pruned.strip()

    def prune_pages(self, pages: List[str]) -> List[str]:
        """Prune repeated header and footer lines across multiple document pages.

        Args:
            pages: List of strings, each representing text from a single page.

        Returns:
            List of sanitized page strings with common headers and footers removed.
        """
        if not pages:
            return []

        cleaned_pages = [self.prune_text(p) for p in pages]
        if len(cleaned_pages) < 2:
            return cleaned_pages

        # Detect repeated top lines (running headers)
        first_lines = [p.split("\n", 1)[0].strip() for p in cleaned_pages if p]
        repeated_header = None
        if first_lines and all(line == first_lines[0] and line for line in first_lines):
            repeated_header = first_lines[0]

        # Detect repeated bottom lines (running footers)
        last_lines = [p.split("\n")[-1].strip() for p in cleaned_pages if p]
        repeated_footer = None
        if last_lines and all(line == last_lines[0] and line for line in last_lines):
            repeated_footer = last_lines[0]

        result: List[str] = []
        for page in cleaned_pages:
            lines = page.split("\n")
            if repeated_header and lines and lines[0].strip() == repeated_header:
                lines = lines[1:]
            if repeated_footer and lines and lines[-1].strip() == repeated_footer:
                lines = lines[:-1]
            result.append("\n".join(lines).strip())

        return result
