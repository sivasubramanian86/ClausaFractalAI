"""Complexity Tuner for ClausaFractalAI agents.

Dynamically modulates agent prompt directives and explanations based on user
expertise slider: ELI5, STANDARD, COUNSEL, or PARANOID.
"""

from typing import Dict


class ComplexityTuner:
    """Modulates agent prompts and synthesis tone according to target audience sophistication."""

    COMPLEXITY_DIRECTIVES: Dict[str, str] = {
        "ELI5": (
            "Explain this contract as if explaining to a 5-year-old or non-technical consumer. "
            "Use simple everyday language, vivid real-world analogies, and zero legal jargon. "
            "Highlight what the user must do, what they cannot do, and what happens "
            "if things go wrong."
        ),
        "STANDARD": (
            "Provide a balanced, highly accessible analysis suitable for business owners and "
            "individuals. Define legal terms clearly, outline specific rights and obligations, "
            "and highlight concrete practical risks."
        ),
        "COUNSEL": (
            "Adopt the rigorous, formal tone of in-house legal counsel and attorneys. "
            "Analyze statutory implications, jurisdictional exposure, standard boilerplate "
            "clauses, indemnification carve-outs, and standard commercial doctrines."
        ),
        "PARANOID": (
            "Adopt an adversarial, hyper-vigilant risk auditor perspective. "
            "Assume the counterparty is drafting with hostile intent to exploit ambiguities. "
            "Flag every loophole, uncapped indirect liability, unilateral termination trap, "
            "and subtle rights surrender under worst-case scenarios."
        ),
    }

    @classmethod
    def validate_level(cls, level: str) -> str:
        """Sanitize and validate complexity level, falling back to STANDARD if unknown.

        Args:
            level: User-provided complexity string.

        Returns:
            Canonical uppercase complexity identifier.
        """
        if not level:
            return "STANDARD"
        upper = level.strip().upper()
        if upper in cls.COMPLEXITY_DIRECTIVES:
            return upper
        return "STANDARD"

    @classmethod
    def get_directive(cls, level: str) -> str:
        """Retrieve system directive prompt snippet for the requested complexity level.

        Args:
            level: Complexity level name (ELI5, STANDARD, COUNSEL, PARANOID).

        Returns:
            Instructional string to inject into agent system prompts.
        """
        canonical = cls.validate_level(level)
        return cls.COMPLEXITY_DIRECTIVES[canonical]
