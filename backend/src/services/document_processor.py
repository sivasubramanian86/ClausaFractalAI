"""Document Processor service for ClausaFractalAI.

Parses native digital PDFs using pypdf, detects low-density scanned/photo pages (< 50 chars),
executes Gemini Vision multimodal OCR fallback without local Tesseract dependencies,
applies deterministic PII scrubbing and boilerplate pruning, and populates the RAGEngine.
"""

import hashlib
import io
from typing import Dict, List, Optional

import pypdf
from pydantic import BaseModel, Field

from config import get_settings
from services.boilerplate_pruner import BoilerplatePruner
from services.pii_scrubber import PIIScrubber
from services.rag_engine import DocumentChunk, LegalTriple, RAGEngine


class PageText(BaseModel):
    """Extracted text and metadata for an individual document page.

    Attributes:
        page_number: 1-indexed page number.
        raw_text: Original raw text extracted from PDF or Vision OCR.
        clean_text: Scrubbed and pruned text ready for LLM consumption.
        is_scanned: Whether this page triggered low-density multimodal OCR fallback.
        character_count: Number of characters in clean_text.
    """

    page_number: int
    raw_text: str
    clean_text: str
    is_scanned: bool = False
    character_count: int = 0


class ProcessedDocument(BaseModel):
    """Complete structured representation of an ingested document.

    Attributes:
        document_id: SHA-256 derived deterministic identifier for document.
        filename: Original filename of uploaded document.
        page_count: Total pages processed.
        total_characters: Cumulative length of sanitized document text.
        pages: List of PageText objects.
        chunks: Granular indexed text chunks with exact citation offsets.
        triples: Extracted legal entity-relation knowledge graph triples.
        redaction_summary: Breakdown of sensitive PII elements scrubbed.
        total_redactions: Total count of redacted sensitive items.
        is_scanned_detected: Whether any page required vision multimodal fallback.
    """

    document_id: str
    filename: str
    page_count: int
    total_characters: int
    pages: List[PageText] = Field(default_factory=list)
    chunks: List[DocumentChunk] = Field(default_factory=list)
    triples: List[LegalTriple] = Field(default_factory=list)
    redaction_summary: Dict[str, int] = Field(default_factory=dict)
    total_redactions: int = 0
    is_scanned_detected: bool = False


class DocumentProcessor:
    """Unified multimodal document ingestion, sanitization, and RAG indexing engine."""

    SCAN_DENSITY_THRESHOLD: int = 50

    def __init__(
        self,
        rag_engine: Optional[RAGEngine] = None,
        gemini_client: Optional[object] = None,
    ) -> None:
        """Initialize DocumentProcessor with dependencies.

        Args:
            rag_engine: Optional shared or isolated RAGEngine instance.
            gemini_client: Optional google-genai Client instance for Vision fallback.
        """
        self.settings = get_settings()
        self.rag_engine = rag_engine or RAGEngine()
        self.gemini_client = gemini_client
        self.scrubber = PIIScrubber()
        self.pruner = BoilerplatePruner()

    def _ocr_with_gemini_vision(
        self,
        image_or_pdf_bytes: bytes,
        mime_type: str = "application/pdf",
        mock_ocr_text: Optional[str] = None,
    ) -> str:
        """Invoke Gemini Multimodal Vision to extract text from scanned or photo pages.

        Args:
            image_or_pdf_bytes: Raw binary bytes of scanned page or image.
            mime_type: MIME type of the payload ('application/pdf', 'image/png', etc.).
            mock_ocr_text: Optional text override for deterministic unit testing.

        Returns:
            Extracted text string from Gemini Vision.
        """
        if mock_ocr_text is not None:
            return mock_ocr_text.strip()

        if self.gemini_client is not None:
            try:
                from google.genai import types

                prompt = (
                    "Extract all readable legal clause text verbatim from this scanned page. "
                    "Maintain exact paragraph structure. Do not summarize or format."
                )

                part = types.Part.from_bytes(data=image_or_pdf_bytes, mime_type=mime_type)
                model_name = self.settings.analyst_model

                try:
                    response = self.gemini_client.models.generate_content(
                        model=model_name,
                        contents=[part, prompt],
                    )
                except Exception:
                    # Fallback to verified 2.5 model
                    model_name = self.settings.analyst_model_fallback
                    response = self.gemini_client.models.generate_content(
                        model=model_name,
                        contents=[part, prompt],
                    )

                return getattr(response, "text", "").strip()
            except Exception:
                return "[Vision OCR extraction failed]"

        return "[Vision OCR offline - client not configured]"

    def process_pdf(
        self,
        pdf_bytes: bytes,
        filename: str = "contract.pdf",
        mock_ocr_override: Optional[str] = None,
    ) -> ProcessedDocument:
        """Process binary PDF payload, extracting text, handling scans, and indexing for RAG.

        Args:
            pdf_bytes: Binary contents of the PDF file.
            filename: Original name of the uploaded contract.
            mock_ocr_override: Mock OCR string to use if a page is detected as a scan.

        Returns:
            ProcessedDocument containing all parsed pages, chunks, and triples.
        """
        if not pdf_bytes:
            empty_id = hashlib.sha256(b"empty").hexdigest()[:12]
            return ProcessedDocument(
                document_id=empty_id,
                filename=filename,
                page_count=0,
                total_characters=0,
            )

        doc_id = hashlib.sha256(pdf_bytes).hexdigest()[:12]
        reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        page_count = len(reader.pages)

        raw_pages: List[str] = []
        is_scanned_flags: List[bool] = []

        for _page_idx, page in enumerate(reader.pages):
            extracted = page.extract_text() or ""
            if len(extracted.strip()) < self.SCAN_DENSITY_THRESHOLD:
                # Low text density triggers multimodal vision fallback
                ocr_text = self._ocr_with_gemini_vision(
                    image_or_pdf_bytes=pdf_bytes,
                    mime_type="application/pdf",
                    mock_ocr_text=mock_ocr_override,
                )
                raw_pages.append(ocr_text)
                is_scanned_flags.append(True)
            else:
                raw_pages.append(extracted)
                is_scanned_flags.append(False)

        # Prune recurring headers/footers across pages
        pruned_pages = self.pruner.prune_pages(raw_pages)

        processed_pages: List[PageText] = []
        all_chunks: List[DocumentChunk] = []
        all_triples: List[LegalTriple] = []
        cumulative_redactions: Dict[str, int] = {}
        total_redactions = 0
        total_chars = 0

        for idx, (p_text, was_scanned) in enumerate(
            zip(pruned_pages, is_scanned_flags, strict=True)
        ):
            page_num = idx + 1
            # Deterministic PII Scrubbing
            scrub_res = self.scrubber.scrub(p_text)
            clean = scrub_res.cleaned_text
            total_chars += len(clean)

            # Aggregate redaction audits
            for k, v in scrub_res.redaction_counts.items():
                cumulative_redactions[k] = cumulative_redactions.get(k, 0) + v
            total_redactions += scrub_res.total_redactions

            page_obj = PageText(
                page_number=page_num,
                raw_text=raw_pages[idx],
                clean_text=clean,
                is_scanned=was_scanned,
                character_count=len(clean),
            )
            processed_pages.append(page_obj)

            # Chunk page and extract knowledge graph triples
            chunks = self.rag_engine.chunk_text(
                text=clean,
                document_id=doc_id,
                page_number=page_num,
            )
            all_chunks.extend(chunks)

            triples = self.rag_engine.extract_triples(
                text=clean,
                page=page_num,
                clause_ref=f"Page {page_num}",
            )
            all_triples.extend(triples)

        # Add all chunks to the FAISS vector index
        self.rag_engine.add_chunks(all_chunks)

        return ProcessedDocument(
            document_id=doc_id,
            filename=filename,
            page_count=page_count,
            total_characters=total_chars,
            pages=processed_pages,
            chunks=all_chunks,
            triples=all_triples,
            redaction_summary=cumulative_redactions,
            total_redactions=total_redactions,
            is_scanned_detected=any(is_scanned_flags),
        )

    def process_text(
        self,
        raw_text: str,
        filename: str = "document.txt",
    ) -> ProcessedDocument:
        """Process plain raw contract text without PDF structure.

        Args:
            raw_text: Raw string containing contract clauses.
            filename: Associated identifier or filename.

        Returns:
            ProcessedDocument containing parsed page, chunks, and triples.
        """
        doc_id = hashlib.sha256(raw_text.encode("utf-8")).hexdigest()[:12]
        pruned = self.pruner.prune_text(raw_text)
        scrub_res = self.scrubber.scrub(pruned)
        clean = scrub_res.cleaned_text

        chunks = self.rag_engine.chunk_text(
            text=clean,
            document_id=doc_id,
            page_number=1,
        )
        self.rag_engine.add_chunks(chunks)

        triples = self.rag_engine.extract_triples(
            text=clean,
            page=1,
            clause_ref="Section 1",
        )

        page_obj = PageText(
            page_number=1,
            raw_text=raw_text,
            clean_text=clean,
            is_scanned=False,
            character_count=len(clean),
        )

        return ProcessedDocument(
            document_id=doc_id,
            filename=filename,
            page_count=1,
            total_characters=len(clean),
            pages=[page_obj],
            chunks=chunks,
            triples=triples,
            redaction_summary=scrub_res.redaction_counts,
            total_redactions=scrub_res.total_redactions,
            is_scanned_detected=False,
        )
