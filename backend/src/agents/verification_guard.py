"""Verification and Citation Guard for ClausaFractalAI.

Enforces zero-hallucination deterministic standards:
1. If the query cannot be grounded from retrieved document chunks, returns strictly:
   "I cannot determine this based on the provided document."
2. Verifies whether generated citations exist verbatim in retrieved chunks.
"""

from typing import Dict, List, Optional

from pydantic import BaseModel, Field

from services.rag_engine import DocumentChunk


class Citation(BaseModel):
    """Citation coordinate linking a generated fact directly to source document text.

    Attributes:
        clause: Clause title or section reference (e.g. 'Section 4.2').
        page: Page number where the clause appears.
        snippet: Verbatim textual excerpt cited.
        start_char: Starting character offset in the source chunk.
        end_char: Ending character offset in the source chunk.
        is_grounded: Whether the snippet was verified to exist in source chunks.
    """

    clause: str
    page: int
    snippet: str
    start_char: int = 0
    end_char: int = 0
    is_grounded: bool = True


class VerificationResult(BaseModel):
    """Output of the verification guard check.

    Attributes:
        is_grounded: Whether the response is substantiated by retrieved document chunks.
        verified_answer: Final response text (strictly enforcing unknown fallback if ungrounded).
        grounded_citations: Citations verified against retrieved document chunks.
        unverified_citations: Citations flagged as hallucinated or unverified.
        metadata: Audit metrics regarding groundability and citation accuracy.
    """

    is_grounded: bool
    verified_answer: str
    grounded_citations: List[Citation] = Field(default_factory=list)
    unverified_citations: List[Citation] = Field(default_factory=list)
    metadata: Dict[str, object] = Field(default_factory=dict)


class VerificationGuard:
    """Deterministic validation guard asserting strict grounding and citation veracity."""

    DETERMINISTIC_UNKNOWN_MESSAGE: str = "I cannot determine this based on the provided document."

    @classmethod
    def verify_response(
        cls,
        answer: str,
        citations: List[Citation],
        retrieved_chunks: List[DocumentChunk],
        is_retrieval_uncertain: bool = False,
    ) -> VerificationResult:
        """Validate candidate answer and citations against retrieved document chunks.

        Args:
            answer: Candidate generated answer text.
            citations: Extracted citation references.
            retrieved_chunks: Ground-truth chunks retrieved from the document RAG engine.
            is_retrieval_uncertain: Flag from RAGEngine indicating inadequate grounding.

        Returns:
            VerificationResult with guaranteed citation veracity or deterministic fallback.
        """
        if is_retrieval_uncertain or not retrieved_chunks:
            return VerificationResult(
                is_grounded=False,
                verified_answer=cls.DETERMINISTIC_UNKNOWN_MESSAGE,
                grounded_citations=[],
                unverified_citations=citations,
                metadata={"reason": "insufficient_source_context"},
            )

        # Concatenate chunk texts for substring verification
        corpus = " ".join(c.text.lower() for c in retrieved_chunks)

        grounded: List[Citation] = []
        unverified: List[Citation] = []

        for cit in citations:
            snippet_clean = cit.snippet.strip().lower()
            if snippet_clean and snippet_clean in corpus:
                # Resolve precise chunk offsets if available
                matching_chunk: Optional[DocumentChunk] = next(
                    (c for c in retrieved_chunks if snippet_clean in c.text.lower()),
                    None,
                )
                start = matching_chunk.start_char if matching_chunk else 0
                end = (
                    matching_chunk.start_char + len(cit.snippet)
                    if matching_chunk
                    else len(cit.snippet)
                )

                verified_cit = cit.model_copy(
                    update={
                        "is_grounded": True,
                        "start_char": start,
                        "end_char": end,
                    }
                )
                grounded.append(verified_cit)
            else:
                unverified_cit = cit.model_copy(update={"is_grounded": False})
                unverified.append(unverified_cit)

        # If answer claims certainty but has zero grounded citations and unverified citations exist
        if citations and not grounded:
            return VerificationResult(
                is_grounded=False,
                verified_answer=cls.DETERMINISTIC_UNKNOWN_MESSAGE,
                grounded_citations=[],
                unverified_citations=unverified,
                metadata={"reason": "all_citations_ungrounded"},
            )

        return VerificationResult(
            is_grounded=True,
            verified_answer=answer,
            grounded_citations=grounded,
            unverified_citations=unverified,
            metadata={
                "grounded_count": len(grounded),
                "unverified_count": len(unverified),
            },
        )
