"""Router Agent for ClausaFractalAI.

Performs low-latency query intent classification (< 200ms) to route user tasks
to the specialized legal agent: LEGAL_QA, BLINDSPOT_AUDIT, POLICY_DIFF,
ATTORNEY_PREP, or CLAUSE_REWRITE.
"""

import re
from typing import Optional

from pydantic import BaseModel, Field

from config import get_settings


class RouterResult(BaseModel):
    """Result of intent routing classification.

    Attributes:
        intent: Classified operational intent category.
        confidence: Confidence score of classification (0.0 to 1.0).
        reasoning: Brief diagnostic explanation for the routing decision.
    """

    intent: str
    confidence: float = Field(default=0.95, ge=0.0, le=1.0)
    reasoning: str = ""


class RouterAgent:
    """Fast intent classifier routing legal user queries to specialized agents."""

    VALID_INTENTS = {
        "LEGAL_QA",
        "BLINDSPOT_AUDIT",
        "POLICY_DIFF",
        "ATTORNEY_PREP",
        "CLAUSE_REWRITE",
    }

    INTENT_KEYWORDS = {
        "BLINDSPOT_AUDIT": [
            "blindspot",
            "missing",
            "omitted",
            "baseline",
            "audit",
            "gap",
            "omission",
            "standard nda",
            "standard sla",
        ],
        "POLICY_DIFF": [
            "compare",
            "difference",
            "diff",
            "versus",
            "vs",
            "changes",
            "new version",
            "previous version",
            "collider",
        ],
        "ATTORNEY_PREP": [
            "attorney",
            "lawyer",
            "consultation",
            "prep sheet",
            "checklist",
            "questions to ask",
            "counsel advice",
        ],
        "CLAUSE_REWRITE": [
            "rewrite",
            "counter",
            "redline",
            "negotiate",
            "favorable",
            "alternative language",
            "protect me",
        ],
    }

    def __init__(self, gemini_client: Optional[object] = None) -> None:
        """Initialize RouterAgent.

        Args:
            gemini_client: Optional google-genai Client instance.
        """
        self.settings = get_settings()
        self.client = gemini_client

    def classify(
        self,
        query: str,
        mock_intent: Optional[str] = None,
    ) -> RouterResult:
        """Classify user query into canonical legal agent intent.

        Args:
            query: User's natural language question or instruction.
            mock_intent: Deterministic override for unit tests.

        Returns:
            RouterResult with target intent and confidence score.
        """
        if not query or not query.strip():
            return RouterResult(
                intent="LEGAL_QA",
                confidence=1.0,
                reasoning="Defaulted to LEGAL_QA for empty input",
            )

        if mock_intent is not None and mock_intent in self.VALID_INTENTS:
            return RouterResult(
                intent=mock_intent,
                confidence=0.99,
                reasoning=f"Explicitly assigned to {mock_intent}",
            )

        # Fast keyword heuristic check (< 2ms)
        clean_query = query.lower()
        for intent_cat, kws in self.INTENT_KEYWORDS.items():
            for kw in kws:
                if re.search(rf"\b{re.escape(kw)}\b", clean_query):
                    return RouterResult(
                        intent=intent_cat,
                        confidence=0.92,
                        reasoning=f"Keyword '{kw}' matched category {intent_cat}",
                    )

        # If Gemini client is provided, execute low-latency model routing
        if self.client is not None:
            try:
                prompt = (
                    "You are a legal query intent router. Classify the user prompt into exactly "
                    "ONE of: [LEGAL_QA, BLINDSPOT_AUDIT, POLICY_DIFF, "
                    "ATTORNEY_PREP, CLAUSE_REWRITE]. "
                    f"Prompt: '{query}'\nRespond with only the category name."
                )
                model_name = self.settings.router_model
                try:
                    response = self.client.models.generate_content(
                        model=model_name, contents=prompt
                    )
                except Exception:
                    response = self.client.models.generate_content(
                        model=self.settings.router_model_fallback, contents=prompt
                    )

                text = getattr(response, "text", "").strip().upper()
                for valid in self.VALID_INTENTS:
                    if valid in text:
                        return RouterResult(
                            intent=valid,
                            confidence=0.96,
                            reasoning=f"Classified by model as {valid}",
                        )
            except Exception as err:
                _ = err

        # Default fallback
        return RouterResult(
            intent="LEGAL_QA",
            confidence=0.85,
            reasoning="Default fallback to core legal question answering",
        )
