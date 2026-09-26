import React, { useState } from "react";
import {
  FileText,
  Upload,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Lock,
  Mic,
  Loader2,
} from "lucide-react";

import { TranslationDictionary } from "../i18n/types";
import { getTranslation } from "../i18n";

export interface DocumentViewerProps {
  documentId?: string;
  filename: string;
  pages: Array<{ pageNumber: number; text: string }>;
  activeHighlight: { page: number; snippet: string } | null;
  onFileUpload?: (file: File) => Promise<void>;
  onUpload?: (file: File) => Promise<void>;
  onAudioUpload?: (file: File) => Promise<void>;
  isUploading?: boolean;
  t?: TranslationDictionary;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentId = "doc_default",
  filename,
  pages,
  activeHighlight,
  onFileUpload,
  onUpload,
  onAudioUpload,
  isUploading = false,
  t: propT,
}) => {
  const t = propT || getTranslation("en");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const totalPages = Math.max(1, pages.length);

  // Sync to highlighted page when activeHighlight updates
  React.useEffect(() => {
    if (activeHighlight && activeHighlight.page >= 1 && activeHighlight.page <= totalPages) {
      setCurrentPage(activeHighlight.page);
    }
  }, [activeHighlight, totalPages]);

  const activePageData = pages.find((p) => p.pageNumber === currentPage) || {
    pageNumber: currentPage,
    text: "No text content available for this page.",
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadHandler = onFileUpload || onUpload;
      if (uploadHandler) {
        await uploadHandler(e.target.files[0]);
      }
    }
  };

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onAudioUpload) {
      await onAudioUpload(e.target.files[0]);
    }
  };

  // Helper to render text with glowing highlighted snippet
  const renderHighlightedText = (fullText: string, snippet?: string) => {
    if (!snippet || !snippet.trim()) {
      return <span>{fullText}</span>;
    }

    const cleanSnippet = snippet.trim();
    const lowerFull = fullText.toLowerCase();
    const lowerSnippet = cleanSnippet.toLowerCase();
    const matchIndex = lowerFull.indexOf(lowerSnippet);

    if (matchIndex === -1) {
      return <span>{fullText}</span>;
    }

    const before = fullText.slice(0, matchIndex);
    const matched = fullText.slice(matchIndex, matchIndex + cleanSnippet.length);
    const after = fullText.slice(matchIndex + cleanSnippet.length);

    return (
      <span>
        {before}
        <mark
          className="rounded px-1.5 py-0.5 font-semibold bg-amber-400/30 text-amber-200 border border-amber-400/60 shadow-lg shadow-amber-400/20 animate-pulse"
          title={`Cited in Page ${currentPage}`}
        >
          {matched}
        </mark>
        {after}
      </span>
    );
  };

  return (
    <section
      aria-label="Document Viewer and Multimodal Ingestion"
      className="flex flex-col h-full rounded-xl glass-panel border border-slate-800 overflow-hidden"
    >
      {/* Viewer Header Controls */}
      <header
        role="banner"
        className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3 bg-slate-900/60"
      >
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-legal-cyan" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {t.docViewerTitle}
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-legal-emerald/10 px-2 py-0.5 text-[10px] font-medium text-legal-emerald">
            <Lock className="h-2.5 w-2.5" /> PII Scrubbed
          </span>
        </div>

        {/* Multimodal Upload Buttons */}
        <div className="flex items-center gap-2">
          {/* Audio upload button */}
          <label
            htmlFor="audio-upload-input"
            className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title={t.uploadVoiceNote}
          >
            <Mic className="h-3.5 w-3.5 text-legal-cyan" />
            <span className="hidden sm:inline">{t.uploadVoiceNote}</span>
            <input
              id="audio-upload-input"
              type="file"
              accept="audio/*"
              className="sr-only"
              onChange={handleAudioChange}
              disabled={isUploading}
              aria-label="Upload audio voice dictation"
            />
          </label>

          {/* Document upload button */}
          <label
            htmlFor="document-file-upload"
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-legal-cyan/40 bg-legal-cyan/10 px-2.5 py-1 text-xs font-medium text-legal-cyan hover:bg-legal-cyan/20 transition-colors"
          >
            {isUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            <span>{isUploading ? "Ingesting..." : t.uploadButton}</span>
            <input
              id="document-file-upload"
              type="file"
              accept="application/pdf,text/plain,image/*"
              className="sr-only"
              onChange={handleFileChange}
              disabled={isUploading}
              aria-label="Upload Contract PDF or Text File"
            />
          </label>
        </div>
      </header>

      {/* Toolbar: Navigation & Zoom */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/70 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span>
            Page <strong className="text-white">{currentPage}</strong> of{" "}
            <strong className="text-white">{totalPages}</strong>
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Document Filename & Zoom */}
        <div className="flex items-center gap-3">
          <span className="truncate max-w-[160px] text-slate-400" title={filename}>
            {filename}
          </span>
          <div className="flex items-center gap-1 border-l border-slate-800 pl-3">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
              className="p-1 rounded hover:bg-slate-800"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="text-[11px] font-mono w-8 text-center">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="p-1 rounded hover:bg-slate-800"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Document Canvas View */}
      <div
        role="region"
        aria-label="Document Page Content"
        className="flex-1 p-6 overflow-y-auto bg-obsidian-950/90 font-serif leading-relaxed text-slate-200 selection:bg-amber-400 selection:text-black"
        style={{ fontSize: `${zoomLevel}%` }}
      >
        <div className="max-w-2xl mx-auto rounded-lg bg-slate-900/40 p-6 border border-slate-800/80 shadow-2xl">
          {activeHighlight && activeHighlight.page === currentPage && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-xs text-amber-200">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>
                Bidirectional Citation Active: Highlighting cited clause coordinates.
              </span>
            </div>
          )}

          <div className="whitespace-pre-wrap">
            {renderHighlightedText(
              activePageData.text,
              activeHighlight?.page === currentPage ? activeHighlight.snippet : undefined
            )}
          </div>
        </div>
      </div>

      {/* Footer Status */}
      <footer
        role="contentinfo"
        className="flex items-center justify-between px-4 py-2 border-t border-slate-800/80 bg-slate-900/40 text-[11px] text-slate-500"
      >
        <span>Document ID: {documentId}</span>
        <span className="flex items-center gap-1.5 text-legal-emerald">
          <span className="h-1.5 w-1.5 rounded-full bg-legal-emerald animate-pulse" />
          Semantic Index Synced
        </span>
      </footer>
    </section>
  );
};
