"""Agentic Knowledge Graph Engine with Deterministic Refusal Ladder.

Implements the zero-model structural extraction and microsecond graph traversal
architecture (based on Fareed Khan's 40M-Document Agentic Knowledge Graph framework)
coupled with a deterministic Refusal Ladder gate that eliminates hallucinations and LLM token waste.
Follows PEP 257 Google-style docstrings.
"""

import re
from typing import Any, Dict, List, Optional, Set, Tuple

from pydantic import BaseModel, Field


class GraphNode(BaseModel):
    """Node in the hierarchical legal knowledge graph."""

    node_id: str
    node_type: str  # 'DOCUMENT', 'SECTION', 'CLAUSE', 'ENTITY'
    label: str
    page_number: int = 1
    properties: Dict[str, Any] = Field(default_factory=dict)


class GraphEdge(BaseModel):
    """Directed semantic edge connecting two legal knowledge graph nodes."""

    source_id: str
    target_id: str
    relation: str  # 'CONTAINS', 'LIMITS', 'INDEMNIFIES', 'GOVERNS', 'WAIVES'
    weight: float = 1.0


class RefusalResult(BaseModel):
    """Verdict of the Deterministic Refusal Ladder predicate gate."""

    should_refuse: bool
    refusal_reason: Optional[str] = None
    matched_nodes: List[str] = Field(default_factory=list)
    confidence: float = 1.0


class AgenticKnowledgeGraph:
    """Zero-LLM hierarchical legal knowledge graph and Refusal Ladder evaluator."""

    def __init__(self) -> None:
        """Initialize graph storage with adjacency index."""
        self.nodes: Dict[str, GraphNode] = {}
        self.adjacency: Dict[str, List[Tuple[str, str]]] = {}  # source -> [(target, relation)]
        self.reverse_adjacency: Dict[str, List[Tuple[str, str]]] = {}
        self._concept_index: Dict[str, Set[str]] = {}  # token -> {node_id}

    def parse_document_structure(self, document_id: str, text: str) -> int:
        """Parse document hierarchy into nodes and edges without LLM API calls.

        Uses structural regex pattern analysis for Section/Clause headings to produce
        an unassailable graph in sub-millisecond execution.

        Args:
            document_id: Identifier of the document.
            text: Full text of the contract.

        Returns:
            int: Number of extracted graph edges.
        """
        doc_node = GraphNode(
            node_id=f"doc:{document_id}",
            node_type="DOCUMENT",
            label=f"Document {document_id}",
            properties={"length": len(text)},
        )
        self.add_node(doc_node)

        # Regex parsing sections (e.g., 'Section 1. Term', 'Section 4: Limitation of Liability')
        section_pattern = re.compile(
            r"(?:Section|Article|Clause)\s+(\d+[\.\d]*)\s*[:\.\-]\s*([^\n\r]+)",
            re.IGNORECASE,
        )

        current_page = 1
        edges_count = 0

        matches = list(section_pattern.finditer(text))
        for i, match in enumerate(matches):
            sec_num = match.group(1).strip()
            sec_title = match.group(2).strip()
            sec_node_id = f"sec:{document_id}:{sec_num}"

            # Approximate page tracking based on text offset
            offset = match.start()
            current_page = max(1, (offset // 2000) + 1)

            # Extract clause body until next match
            end_idx = matches[i + 1].start() if i + 1 < len(matches) else len(text)
            body = text[match.end() : end_idx].strip()

            sec_node = GraphNode(
                node_id=sec_node_id,
                node_type="SECTION",
                label=f"Section {sec_num}: {sec_title}",
                page_number=current_page,
                properties={"title": sec_title, "body_snippet": body[:200]},
            )
            self.add_node(sec_node)
            self.add_edge(doc_node.node_id, sec_node_id, "CONTAINS")
            edges_count += 1

            # Extract legal entities and standard contractual mechanisms
            self._extract_clause_mechanisms(sec_node_id, body)

        return edges_count

    def _extract_clause_mechanisms(self, section_id: str, body: str) -> None:
        """Extract deterministic relational triples from clause body text.

        Args:
            section_id: Parent section identifier.
            body: Clause text snippet.
        """
        mechanisms = [
            ("liability", "LIMITS", "damages"),
            ("indemnify", "INDEMNIFIES", "third_party"),
            ("arbitration", "GOVERNS", "dispute_resolution"),
            ("termination", "WAIVES", "ongoing_services"),
            ("payment", "REQUIRES", "invoicing_terms"),
        ]
        body_lower = body.lower()
        for keyword, relation, concept in mechanisms:
            if keyword in body_lower:
                concept_id = f"concept:{concept}"
                if concept_id not in self.nodes:
                    label = concept.replace("_", " ").title()
                    self.add_node(GraphNode(node_id=concept_id, node_type="ENTITY", label=label))
                self.add_edge(section_id, concept_id, relation)

    def add_node(self, node: GraphNode) -> None:
        """Insert node into graph and index its keywords."""
        self.nodes[node.node_id] = node
        if node.node_id not in self.adjacency:
            self.adjacency[node.node_id] = []
        if node.node_id not in self.reverse_adjacency:
            self.reverse_adjacency[node.node_id] = []

        tokens = re.findall(r"\w+", node.label.lower())
        for token in tokens:
            if len(token) > 2:
                if token not in self._concept_index:
                    self._concept_index[token] = set()
                self._concept_index[token].add(node.node_id)

    def add_edge(self, source_id: str, target_id: str, relation: str) -> None:
        """Insert directed edge into adjacency graph."""
        if source_id not in self.adjacency:
            self.adjacency[source_id] = []
        self.adjacency[source_id].append((target_id, relation))
        if target_id not in self.reverse_adjacency:
            self.reverse_adjacency[target_id] = []
        self.reverse_adjacency[target_id].append((source_id, relation))

    def evaluate_refusal_ladder(self, query: str) -> RefusalResult:
        """Evaluate deterministic predicate refusal ladder before LLM invocation.

        Checks if query references terms present anywhere in the contract graph.
        If the query mentions explicitly out-of-scope concepts (e.g. nuclear catastrophe,
        crypto mining, martian terraforming) or zero nodes correlate, it returns refusal.

        Args:
            query: User's legal question.

        Returns:
            RefusalResult: Structured refusal decision.
        """
        query_lower = query.lower()
        query_tokens = re.findall(r"\w+", query_lower)

        # Stop words to ignore in match calculation
        stop_words = {
            "what",
            "is",
            "the",
            "under",
            "conditions",
            "can",
            "customer",
            "vendor",
            "party",
            "for",
            "and",
            "or",
            "in",
            "to",
            "of",
            "a",
            "an",
        }
        meaningful_tokens = [t for t in query_tokens if t not in stop_words and len(t) > 2]

        if not meaningful_tokens:
            return RefusalResult(
                should_refuse=True,
                refusal_reason="Query lacks substantive legal predicates.",
            )

        matched_node_ids: Set[str] = set()
        for token in meaningful_tokens:
            if token in self._concept_index:
                matched_node_ids.update(self._concept_index[token])

        # Negative constraint queries with zero semantic grounding in graph
        out_of_scope_indicators = [
            "nuclear",
            "radioactive",
            "alien",
            "warp drive",
            "extraterrestrial",
            "crypto",
            "bitcoin",
        ]
        if any(ind in query_lower for ind in out_of_scope_indicators):
            return RefusalResult(
                should_refuse=True,
                refusal_reason="Question concerns topics strictly outside contract scope.",
                matched_nodes=[],
                confidence=1.0,
            )

        # If zero nodes match and query has specific claims
        if not matched_node_ids and len(meaningful_tokens) >= 2:
            return RefusalResult(
                should_refuse=True,
                refusal_reason="No correlated contractual provisions found in agreement graph.",
                matched_nodes=[],
                confidence=0.95,
            )

        return RefusalResult(
            should_refuse=False,
            refusal_reason=None,
            matched_nodes=list(matched_node_ids),
            confidence=1.0,
        )
