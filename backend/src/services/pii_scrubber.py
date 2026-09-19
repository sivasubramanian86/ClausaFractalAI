"""PII Scrubber service for ClausaFractalAI.

Deterministic regex pipeline scrubbing sensitive data before LLM dispatch or vector storage.
Redacts SSNs, credit cards, emails, phone numbers, and physical street addresses with
audit tracking.
"""

import re
from typing import Dict, Pattern, Tuple

from pydantic import BaseModel, Field


class ScrubResult(BaseModel):
    """Result of the PII scrubbing pipeline.

    Attributes:
        cleaned_text: The sanitized document text with sensitive values replaced by tokens.
        redaction_counts: Breakdown of redaction counts by PII category.
        total_redactions: Total number of redacted sensitive elements.
    """

    cleaned_text: str
    redaction_counts: Dict[str, int] = Field(default_factory=dict)
    total_redactions: int = 0


class PIIScrubber:
    """Deterministic, high-throughput regex scrubber for sensitive personal information."""

    # Compile regexes once at class level for maximum throughput
    PATTERNS: Dict[str, Tuple[Pattern[str], str]] = {
        "ssn": (
            re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
            "[REDACTED_SSN]",
        ),
        "credit_card": (
            re.compile(r"\b(?:\d{4}[-\s]?){3}\d{4}\b"),
            "[REDACTED_CREDIT_CARD]",
        ),
        "email": (
            re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"),
            "[REDACTED_EMAIL]",
        ),
        "phone": (
            re.compile(r"(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b"),
            "[REDACTED_PHONE]",
        ),
        "address": (
            re.compile(
                r"\b\d+\s+[A-Za-z0-9\s,.'-]{3,35}\s+"
                r"(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Way|Suite|Ste|Apt)\b",
                re.IGNORECASE,
            ),
            "[REDACTED_ADDRESS]",
        ),
    }

    def scrub(self, text: str) -> ScrubResult:
        """Sanitize raw document text by replacing identified PII with deterministic tokens.

        Args:
            text: Raw input string containing contract or user query text.

        Returns:
            ScrubResult containing cleaned text and an audit dictionary of redactions.
        """
        if not text:
            return ScrubResult(cleaned_text="", redaction_counts={}, total_redactions=0)

        cleaned = text
        counts: Dict[str, int] = {}
        total = 0

        for key, (pattern, token) in self.PATTERNS.items():
            matches = pattern.findall(cleaned)
            count = len(matches)
            if count > 0:
                counts[key] = count
                total += count
                cleaned = pattern.sub(token, cleaned)

        return ScrubResult(
            cleaned_text=cleaned,
            redaction_counts=counts,
            total_redactions=total,
        )
