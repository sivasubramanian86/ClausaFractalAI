"""FinOps Two-Tier Semantic & Exact Hash Cache.

Implements:
- L1 (Exact): SHA-256 hash match on (system_prompt + ":" + normalized_input) -> 0ms, $0.00 cost.
- L2 (Semantic): Vector cosine similarity >= 0.96 using deterministic embeddings.
- In-memory fallback layer ensuring hermetic local execution and testing.
"""

import hashlib
import math
import re
from typing import Any, Dict, List, Optional, Tuple

from app.core.telemetry import logger


def _compute_sha256(text: str) -> str:
    """Compute normalized SHA-256 hash of a string."""
    normalized = re.sub(r"\s+", " ", text.strip().lower())
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def _cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Compute cosine similarity between two float vectors."""
    if len(vec1) != len(vec2) or not vec1:
        return 0.0
    dot = sum(a * b for a, b in zip(vec1, vec2, strict=True))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))
    if norm1 == 0.0 or norm2 == 0.0:
        return 0.0
    return dot / (norm1 * norm2)


def _pseudo_semantic_embedding(text: str, dims: int = 64) -> List[float]:
    """Hermetic pseudo-embedding generator for semantic caching without external calls."""
    cleaned = re.sub(r"[^a-zA-Z0-9\s]", "", text.lower())
    words = cleaned.split()
    vec = [0.0] * dims
    if not words:
        return vec
    for w in words:
        h = int(hashlib.md5(w.encode("utf-8")).hexdigest(), 16)  # nosec
        for i in range(dims):
            val = ((h >> (i % 32)) & 0xFF) / 255.0 - 0.5
            vec[i] += val
    norm = math.sqrt(sum(x * x for x in vec))
    if norm > 0:
        vec = [x / norm for x in vec]
    return vec


class FinOpsCache:
    """Two-tier exact and semantic caching gateway."""

    def __init__(
        self,
        semantic_threshold: float = 0.96,
        redis_client: Optional[Any] = None,
    ) -> None:
        """Initialize FinOps cache with similarity threshold and optional Redis."""
        self.semantic_threshold = semantic_threshold
        self.redis_client = redis_client
        # In-memory storage for L1 and L2
        self._l1_store: Dict[str, Dict[str, Any]] = {}
        self._l2_store: List[Tuple[List[float], Dict[str, Any], str]] = []

    def get(self, system_prompt: str, user_input: str) -> Tuple[Optional[Dict[str, Any]], str]:
        """Query cache via L1 exact hash, then L2 semantic cosine similarity.

        Returns:
            Tuple of (cached_payload, cache_tier) where cache_tier is 'L1', 'L2', or 'MISS'.
        """
        combined = f"{system_prompt}:{user_input}"
        exact_key = _compute_sha256(combined)

        # 1. L1 Exact Hash Match
        if exact_key in self._l1_store:
            logger.info("FinOps Cache HIT [L1 Exact]", key=exact_key[:12])
            return self._l1_store[exact_key], "L1"

        # 2. L2 Semantic Similarity
        query_vec = _pseudo_semantic_embedding(user_input)
        best_score = 0.0
        best_payload: Optional[Dict[str, Any]] = None

        for stored_vec, payload, _ in self._l2_store:
            sim = _cosine_similarity(query_vec, stored_vec)
            if sim > best_score:
                best_score = sim
                best_payload = payload

        if best_score >= self.semantic_threshold and best_payload is not None:
            logger.info(
                "FinOps Cache HIT [L2 Semantic]",
                similarity=round(best_score, 4),
                threshold=self.semantic_threshold,
            )
            return best_payload, "L2"

        return None, "MISS"

    def put(
        self,
        system_prompt: str,
        user_input: str,
        payload: Dict[str, Any],
    ) -> None:
        """Store result in both L1 and L2 cache stores."""
        combined = f"{system_prompt}:{user_input}"
        exact_key = _compute_sha256(combined)

        # Write to L1
        self._l1_store[exact_key] = payload

        # Write to L2
        vec = _pseudo_semantic_embedding(user_input)
        self._l2_store.append((vec, payload, user_input))
        logger.info("FinOps Cache entry stored in L1 & L2", key=exact_key[:12])
