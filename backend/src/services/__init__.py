"""Services package for ClausaFractalAI.

Exposes multimodal ingestion, privacy scrubbing, audio transcription,
and hybrid vector/graph RAG indexing components.
"""

from services.audio_processor import AudioProcessor, AudioTranscriptionResult
from services.boilerplate_pruner import BoilerplatePruner
from services.document_processor import DocumentProcessor, PageText, ProcessedDocument
from services.pii_scrubber import PIIScrubber, ScrubResult
from services.rag_engine import DocumentChunk, LegalTriple, QueryResult, RAGEngine
from services.statutory_codex import StatutoryCodexService, StatutorySection

__all__ = [
    "AudioProcessor",
    "AudioTranscriptionResult",
    "BoilerplatePruner",
    "DocumentChunk",
    "DocumentProcessor",
    "LegalTriple",
    "PIIScrubber",
    "PageText",
    "ProcessedDocument",
    "QueryResult",
    "RAGEngine",
    "ScrubResult",
    "StatutoryCodexService",
    "StatutorySection",
]
