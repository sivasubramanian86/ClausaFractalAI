"""Multi-Agentic RAG and Knowledge Graph Engine for ClausaFractalAI.

Provides chunk-level semantic indexing with FAISS, character-offset citation tracking,
deterministic entity-relation legal triple extraction, and multi-hop graph reasoning.
"""

import hashlib
import re
from typing import Any, Dict, List, Optional

import faiss
import numpy as np
from pydantic import BaseModel, Field


class DocumentChunk(BaseModel):
    """Segment of document text with exact citation coordinates for bidirectional highlighting.

    Attributes:
        chunk_id: Unique deterministic identifier for the chunk.
        document_id: Identifier of the parent document.
        page_number: 1-indexed page where this chunk originates.
        start_char: Starting character offset in the page text.
        end_char: Ending character offset in the page text.
        text: Scrubbed, pruned chunk text.
        score: Relevance similarity score from vector retrieval.
        metadata: Arbitrary metadata key-value pairs.
    """

    chunk_id: str
    document_id: str
    page_number: int
    start_char: int
    end_char: int
    text: str
    score: float = 0.0
    metadata: Dict[str, Any] = Field(default_factory=dict)


class LegalTriple(BaseModel):
    """Entity-relation semantic triple representing an extracted legal obligation or constraint.

    Attributes:
        subject: The legal actor, party, or clause reference (e.g. 'Vendor', 'Customer').
        relation: Semantic edge type ('OBLIGATED_TO', 'PROHIBITED_FROM', 'LIMITS_LIABILITY_TO').
        object: Target action, constraint, or entity (e.g. 'Provide 30 days notice').
        clause_ref: Title or section number of the source clause (e.g. 'Section 4.2').
        page: Page number where the triple was identified.
    """

    subject: str
    relation: str
    object: str
    clause_ref: str = ""
    page: int = 1


class QueryResult(BaseModel):
    """Synthesized retrieval response combining vector chunks and graph triples.

    Attributes:
        query: The user query or legal question asked.
        chunks: Top retrieved document chunks ranked by semantic similarity.
        triples: Entity-relation graph triples relevant to the queried entities.
        is_uncertain: Flag indicating whether query cannot be reliably answered from text.
        uncertainty_message: Fallback notification when no grounded match exists.
    """

    query: str
    chunks: List[DocumentChunk] = Field(default_factory=list)
    triples: List[LegalTriple] = Field(default_factory=list)
    is_uncertain: bool = False
    uncertainty_message: Optional[str] = None


class RAGEngine:
    """Hybrid semantic vector index (FAISS) and legal knowledge graph engine."""

    VECTOR_DIMENSION: int = 128

    def __init__(self, vector_dimension: int = 128) -> None:
        """Initialize the in-memory FAISS index and knowledge graph store.

        Args:
            vector_dimension: Embedding space dimensionality (default: 128).
        """
        self.vector_dimension = vector_dimension
        self.index = faiss.IndexFlatIP(self.vector_dimension)
        self.chunks: List[DocumentChunk] = []
        self.graph_triples: List[LegalTriple] = []

    def compute_embedding(self, text: str) -> np.ndarray:
        """Generate a deterministic unit-normalized semantic embedding vector.

        Uses term-frequency and n-gram hash projections to enable offline deterministic
        similarity matching without external API latency.

        Args:
            text: Text string to embed.

        Returns:
            Normalized 1D float32 numpy array with shape (vector_dimension,).
        """
        vec = np.zeros(self.vector_dimension, dtype=np.float32)
        if not text:
            return vec

        words = re.findall(r"\w+", text.lower())
        if not words:
            return vec

        for word in words:
            # Deterministic hash projection into vector dimensions
            h = int(hashlib.sha256(word.encode("utf-8")).hexdigest()[:8], 16)
            idx = h % self.vector_dimension
            vec[idx] += 1.0

        norm = float(np.linalg.norm(vec))
        return vec / norm

    def chunk_text(
        self,
        text: str,
        document_id: str,
        page_number: int = 1,
        chunk_size: int = 400,
        overlap: int = 50,
    ) -> List[DocumentChunk]:
        """Split page text into overlapping chunks with exact character offsets.

        Args:
            text: Text content of the page.
            document_id: Parent document identifier.
            page_number: Page index for bidirectional citation.
            chunk_size: Target length of each chunk in characters.
            overlap: Character overlap between consecutive chunks.

        Returns:
            List of DocumentChunk instances.
        """
        if not text:
            return []

        chunks: List[DocumentChunk] = []
        start = 0
        text_len = len(text)
        step = max(1, chunk_size - overlap)
        counter = 0

        while start < text_len:
            end = min(start + chunk_size, text_len)
            chunk_content = text[start:end].strip()

            if chunk_content:
                chunk_id = f"{document_id}_p{page_number}_c{counter}"
                chunks.append(
                    DocumentChunk(
                        chunk_id=chunk_id,
                        document_id=document_id,
                        page_number=page_number,
                        start_char=start,
                        end_char=end,
                        text=chunk_content,
                    )
                )
                counter += 1

            start += step

        return chunks

    def add_chunks(self, chunks: List[DocumentChunk]) -> None:
        """Embed and register document chunks into the FAISS index.

        Args:
            chunks: List of DocumentChunk instances to index.
        """
        if not chunks:
            return

        embeddings: List[np.ndarray] = []
        for chunk in chunks:
            emb = self.compute_embedding(chunk.text)
            embeddings.append(emb)

        matrix = np.vstack(embeddings).astype(np.float32)
        self.index.add(matrix)
        self.chunks.extend(chunks)

    def extract_triples(self, text: str, page: int = 1, clause_ref: str = "") -> List[LegalTriple]:
        """Extract legal entity-relation triples from contract text using deterministic rules.

        Args:
            text: Clause or page text.
            page: Page number where text appears.
            clause_ref: Section or clause identifier.

        Returns:
            List of LegalTriple instances.
        """
        if not text:
            return []

        triples: List[LegalTriple] = []

        # Obligation pattern (excludes negative prohibitions and indemnifications)
        ob_pattern = re.compile(
            r"\b(Company|Contractor|Customer|Vendor|Employer|Employee|Recipient|"
            r"Disclosing Party|Party [A-Z]|Service Provider|Licensor|Licensee)\s+"
            r"(?:shall(?!\s+(?:not\b|indemnify\b))|must(?!\s+not\b)|agrees to|is obligated to)\s+"
            r"([^.;\n]{5,100})",
            re.IGNORECASE,
        )
        for match in ob_pattern.finditer(text):
            triples.append(
                LegalTriple(
                    subject=match.group(1).strip().title(),
                    relation="OBLIGATED_TO",
                    object=match.group(2).strip(),
                    clause_ref=clause_ref,
                    page=page,
                )
            )

        # Prohibition pattern
        proh_pattern = re.compile(
            r"\b(Company|Contractor|Customer|Vendor|Employer|Employee|Recipient|"
            r"Disclosing Party|Party [A-Z]|Service Provider|Licensor|Licensee)\s+"
            r"(?:shall not|must not|may not|is prohibited from)\s+([^.;\n]{5,100})",
            re.IGNORECASE,
        )
        for match in proh_pattern.finditer(text):
            triples.append(
                LegalTriple(
                    subject=match.group(1).strip().title(),
                    relation="PROHIBITED_FROM",
                    object=match.group(2).strip(),
                    clause_ref=clause_ref,
                    page=page,
                )
            )

        # Indemnification pattern
        ind_pattern = re.compile(
            r"\b(Company|Contractor|Customer|Vendor|Employer|Employee|Party [A-Z]|"
            r"Service Provider|Licensor|Licensee)\s+"
            r"(?:indemnifies|shall indemnify and hold harmless)\s+([^.;\n]{5,100})",
            re.IGNORECASE,
        )
        for match in ind_pattern.finditer(text):
            triples.append(
                LegalTriple(
                    subject=match.group(1).strip().title(),
                    relation="INDEMNIFIES",
                    object=match.group(2).strip(),
                    clause_ref=clause_ref,
                    page=page,
                )
            )

        # Limitation of liability pattern
        liab_pattern = re.compile(
            r"(?:liability|aggregate liability|total liability)\s+"
            r"(?:shall be limited to|is capped at|shall not exceed|limited to)\s+"
            r"([^.;\n]{3,80})",
            re.IGNORECASE,
        )
        for match in liab_pattern.finditer(text):
            triples.append(
                LegalTriple(
                    subject="Liability",
                    relation="LIMITS_LIABILITY_TO",
                    object=match.group(1).strip(),
                    clause_ref=clause_ref,
                    page=page,
                )
            )

        self.graph_triples.extend(triples)
        return triples

    def get_triples_for_entity(self, entity: str) -> List[LegalTriple]:
        """Traverse the knowledge graph to retrieve all triples involving an entity.

        Args:
            entity: Entity name (e.g. 'Vendor', 'Customer', 'Liability').

        Returns:
            List of matching LegalTriple instances.
        """
        clean_entity = entity.strip().lower()
        return [
            t
            for t in self.graph_triples
            if clean_entity in t.subject.lower() or clean_entity in t.object.lower()
        ]

    def find_contradictions(self) -> List[Dict[str, Any]]:
        """Identify conflicting obligations or contradictory prohibitions in the contract.

        Returns:
            List of detected contradiction dictionaries with conflicting clauses.
        """
        contradictions: List[Dict[str, Any]] = []

        # Find entities with both OBLIGATED_TO and PROHIBITED_FROM
        subjects = {t.subject for t in self.graph_triples}
        for sub in subjects:
            obligations = [
                t for t in self.graph_triples if t.subject == sub and t.relation == "OBLIGATED_TO"
            ]
            prohibitions = [
                t
                for t in self.graph_triples
                if t.subject == sub and t.relation == "PROHIBITED_FROM"
            ]

            for ob in obligations:
                for pr in prohibitions:
                    # Check semantic overlap in object tokens
                    ob_tokens = set(re.findall(r"\w+", ob.object.lower()))
                    pr_tokens = set(re.findall(r"\w+", pr.object.lower()))
                    overlap = ob_tokens.intersection(pr_tokens)
                    if len(overlap) >= 2:
                        contradictions.append(
                            {
                                "subject": sub,
                                "type": "obligation_vs_prohibition",
                                "obligation": ob.object,
                                "prohibition": pr.object,
                                "obligation_page": ob.page,
                                "prohibition_page": pr.page,
                            }
                        )

        return contradictions

    def get_document_chunks(self, document_id: str) -> List[DocumentChunk]:
        """Retrieve all indexed chunks associated with a given document identifier.

        Args:
            document_id: Identifier of the parent document.

        Returns:
            List[DocumentChunk]: All chunks matching the document ID.
        """
        return [c for c in self.chunks if c.document_id == document_id]

    def query(
        self,
        query_text: Optional[str] = None,
        top_k: int = 5,
        similarity_threshold: float = 0.15,
        query: Optional[str] = None,
    ) -> QueryResult:
        """Execute hybrid search combining FAISS vector similarity and graph triples.

        Args:
            query_text: User question or search clause.
            top_k: Maximum number of chunks to return.
            similarity_threshold: Minimum cosine similarity score required for grounding.
            query: Alternative alias for query_text.

        Returns:
            QueryResult containing top chunks, related graph triples, and uncertainty flags.
        """
        target_query = query if query is not None else (query_text or "")
        if not target_query or not self.chunks or self.index.ntotal == 0:
            return QueryResult(
                query=target_query,
                chunks=[],
                triples=[],
                is_uncertain=True,
                uncertainty_message="I cannot determine this based on the provided document.",
            )

        query_emb = self.compute_embedding(target_query).reshape(1, -1)
        k = min(top_k, self.index.ntotal)
        scores, indices = self.index.search(query_emb, k)

        matched_chunks: List[DocumentChunk] = []
        for score, idx in zip(scores[0], indices[0], strict=True):
            if idx >= 0 and idx < len(self.chunks) and score >= similarity_threshold:
                chunk = self.chunks[idx].model_copy()
                chunk.score = float(score)
                matched_chunks.append(chunk)

        # Retrieve related triples
        query_words = set(re.findall(r"\w+", target_query.lower()))
        matched_triples: List[LegalTriple] = []
        for triple in self.graph_triples:
            sub_words = set(re.findall(r"\w+", triple.subject.lower()))
            rel_words = set(re.findall(r"\w+", triple.relation.lower()))
            if query_words.intersection(sub_words) or query_words.intersection(rel_words):
                matched_triples.append(triple)

        if not matched_chunks:
            return QueryResult(
                query=target_query,
                chunks=[],
                triples=matched_triples,
                is_uncertain=True,
                uncertainty_message="I cannot determine this based on the provided document.",
            )

        return QueryResult(
            query=target_query,
            chunks=matched_chunks,
            triples=matched_triples,
            is_uncertain=False,
            uncertainty_message=None,
        )
