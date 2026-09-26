import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Sliders,
} from "lucide-react";
import { Citation, ComplexityLevel } from "../types";

export interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  citations?: Citation[];
  intent?: string;
  qualityScore?: number;
  reflections?: string[];
  isStreaming?: boolean;
}

import { TranslationDictionary } from "../i18n/types";
import { getTranslation } from "../i18n";

export interface ChatInterfaceProps {
  documentId: string;
  documentFilename: string;
  complexity: ComplexityLevel;
  onComplexityChange: (level: ComplexityLevel) => void;
  onCitationClick: (citation: Citation) => void;
  messages: ChatMessage[];
  onSendMessage: (query: string) => Promise<void>;
  isGenerating: boolean;
  t?: TranslationDictionary;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  documentId,
  documentFilename,
  complexity,
  onComplexityChange,
  onCitationClick,
  messages,
  onSendMessage,
  isGenerating,
  t: propT,
}) => {
  const t = propT || getTranslation("en");
  const [inputText, setInputText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    const q = inputText;
    setInputText("");
    await onSendMessage(q);
  };

  return (
    <section
      aria-label="Legal AI Consultation and Grounded Q&A"
      className="flex flex-col h-full rounded-xl glass-panel border border-slate-800 overflow-hidden"
    >
      {/* Header with Complexity Slider */}
      <header
        role="banner"
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 px-4 py-3 bg-slate-900/60"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-legal-emerald" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Legal Copilot Q&A
          </h2>
        </div>

        {/* Complexity Tier Slider */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Sliders className="h-3.5 w-3.5 text-slate-400 hidden md:block" />
          <div className="grid grid-cols-4 gap-1 rounded-lg bg-slate-950 p-1 border border-slate-800 text-[11px] w-full sm:w-64">
            {(["eli5", "standard", "counsel", "paranoid"] as ComplexityLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onComplexityChange(level)}
                className={`rounded px-1.5 py-0.5 font-medium transition-all ${
                  complexity === level
                    ? "bg-legal-emerald text-obsidian-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                aria-pressed={complexity === level}
              >
                {level === "eli5" ? "ELI5" : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div
        role="region"
        aria-label="Conversation Thread"
        aria-live="polite"
        aria-atomic="false"
        className="flex-1 p-4 overflow-y-auto space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 text-slate-400">
            <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-legal-emerald mb-3">
              <Bot className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-white">Ask anything about this agreement</p>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Grounded with multi-agent reasoning, strict citations, and zero hallucination fallback.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <article
              key={msg.id}
              className={`flex gap-3 text-sm ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "agent" && (
                <div className="h-8 w-8 rounded-lg bg-legal-emerald/20 border border-legal-emerald/40 flex items-center justify-center text-legal-emerald shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`rounded-xl p-3.5 max-w-[85%] ${
                  msg.sender === "user"
                    ? "bg-legal-emerald/10 border border-legal-emerald/30 text-white"
                    : "bg-slate-900/80 border border-slate-800 text-slate-200"
                }`}
              >
                {/* Agent Header Metadata */}
                {msg.sender === "agent" && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800/80 text-[11px]">
                    <span className="font-semibold text-legal-emerald flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      ClausaFractalAI
                    </span>
                    {msg.qualityScore !== undefined && (
                      <span className="text-slate-400">
                        Critic Score:{" "}
                        <strong className="text-legal-cyan">{msg.qualityScore.toFixed(1)}/10</strong>
                      </span>
                    )}
                  </div>
                )}

                {/* Message Body */}
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                  {msg.isStreaming && (
                    <span className="inline-block w-1.5 h-3.5 ml-1 bg-legal-emerald animate-pulse" />
                  )}
                </div>

                {/* Strict Negative Verification Notice */}
                {msg.text.includes("I cannot determine this based on the provided document") && (
                  <div className="mt-3 flex items-center gap-1.5 rounded bg-amber-500/10 border border-amber-500/30 p-2 text-xs text-amber-200">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                    <span>
                      Deterministic Verification: Strict uncertainty rule triggered. Information not
                      supported by contract chunks.
                    </span>
                  </div>
                )}

                {/* Grounded Citation Chips */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Verified Citations (Click to inspect):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((c, idx) => (
                        <button
                          key={`${c.clause}-${idx}`}
                          type="button"
                          onClick={() => onCitationClick(c)}
                          className="inline-flex items-center gap-1 rounded-md bg-slate-800/90 border border-slate-700/80 px-2 py-1 text-[11px] text-legal-cyan hover:bg-slate-700 hover:border-legal-cyan transition-colors"
                          title={`Navigate to Page ${c.page}`}
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>
                            {c.clause} (Page {c.page})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </article>
          ))
        )}
      </div>

      {/* Footer Query Input Form */}
      <footer role="contentinfo" className="p-3 border-t border-slate-800/80 bg-slate-900/60">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <label htmlFor="legal-query-input" className="sr-only">
            Ask a legal question
          </label>
          <input
            id="legal-query-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.askPlaceholder || "Ask about liability, termination, indemnification, or IP..."}
            disabled={isGenerating}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-legal-emerald focus:outline-none focus:ring-1 focus:ring-legal-emerald disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className="rounded-lg bg-gradient-to-r from-legal-emerald to-legal-cyan px-4 py-2.5 text-xs font-semibold text-obsidian-950 transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-legal-emerald/20 flex items-center gap-1.5"
            aria-label="Send Question"
          >
            <Send className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.sendButton || "Send Question"}</span>
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
          <span>Grounded on: {documentFilename} ({documentId})</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Sparkles className="h-2.5 w-2.5 text-legal-cyan" />
            Active Mode: <strong className="uppercase text-legal-cyan">{complexity}</strong>
          </span>
        </div>
      </footer>
    </section>
  );
};
