import React, { useState } from "react";
import { FileEdit, Sparkles, MessageSquareQuote, CheckCircle2 } from "lucide-react";

export interface CounterClauseData {
  original_clause: string;
  counter_clause: string;
  strategic_rationale: string;
  negotiation_tip: string;
}

import { TranslationDictionary } from "../i18n/types";
import { getTranslation } from "../i18n";

export interface CounterClauseViewProps {
  onRewrite: (clauseText: string, clauseType: string) => Promise<void>;
  proposal: CounterClauseData | null;
  isLoading: boolean;
  t?: TranslationDictionary;
}

export const CounterClauseView: React.FC<CounterClauseViewProps> = ({
  onRewrite,
  proposal,
  isLoading,
  t: propT,
}) => {
  const t = propT || getTranslation("en");
  const [clauseText, setClauseText] = useState(
    "Customer agrees to indemnify, defend, and hold harmless Vendor against any and all claims, without limitation."
  );
  const [clauseType, setClauseType] = useState("liability");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clauseText.trim() || isLoading) return;
    await onRewrite(clauseText, clauseType);
  };

  return (
    <section
      aria-label="Favorable Counter-Clause Rewriter and Redliner"
      className="flex flex-col h-full rounded-xl glass-panel border border-slate-800 overflow-hidden"
    >
      <header
        role="banner"
        className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3 bg-slate-900/60"
      >
        <div className="flex items-center gap-2">
          <FileEdit className="h-4 w-4 text-legal-cyan" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {t.counterClauseTitle}
          </h2>
        </div>
      </header>

      {/* Input Form */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/60">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="clause-type-select" className="text-xs font-medium text-slate-300">
              {t.clauseDomainLabel}
            </label>
            <select
              id="clause-type-select"
              value={clauseType}
              onChange={(e) => setClauseType(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white focus:border-legal-emerald focus:outline-none"
            >
              <option value="liability">Limitation of Liability</option>
              <option value="indemnity">Indemnification</option>
              <option value="termination">Termination for Convenience</option>
              <option value="ip">Intellectual Property Rights</option>
            </select>
          </div>

          <div>
            <label htmlFor="original-clause-input" className="sr-only">
              Original Clause Text
            </label>
            <textarea
              id="original-clause-input"
              rows={3}
              value={clauseText}
              onChange={(e) => setClauseText(e.target.value)}
              placeholder="Paste one-sided clause to redline..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:border-legal-emerald focus:outline-none font-mono"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!clauseText.trim() || isLoading}
              className="rounded-lg bg-gradient-to-r from-legal-emerald to-legal-cyan px-4 py-1.5 text-xs font-semibold text-obsidian-950 hover:brightness-110 disabled:opacity-40 transition-all shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="h-3 w-3" />
              <span>{isLoading ? t.rewritingButton : t.rewriteButton}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Redline Display Area */}
      <div
        role="region"
        aria-label="Negotiation Redline Output"
        className="flex-1 p-4 overflow-y-auto space-y-4 text-xs"
      >
        {!proposal ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 text-slate-400">
            <FileEdit className="h-8 w-8 text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-white">No Counter-Clause Generated</p>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Submit a hostile or one-sided clause to produce balanced, protective contract language.
            </p>
          </div>
        ) : (
          <>
            {/* Redline Box */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Redline Comparison
              </span>

              {/* Hostile original */}
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3">
                <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">
                  Original Hostile Language (Strike)
                </span>
                <p className="font-mono text-slate-300 text-[11px] line-through decoration-rose-400 leading-relaxed">
                  {proposal.original_clause}
                </p>
              </div>

              {/* Favorable counter */}
              <div className="rounded-lg bg-legal-emerald/10 border border-legal-emerald/40 p-3 shadow-lg shadow-legal-emerald/5">
                <span className="text-[10px] uppercase font-bold text-legal-emerald flex items-center gap-1 mb-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Proposed Balanced Counter-Language (Insert)
                </span>
                <p className="font-mono text-white text-[11px] leading-relaxed">
                  {proposal.counter_clause}
                </p>
              </div>
            </div>

            {/* Strategic Rationale */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-legal-cyan block">
                Strategic Legal Rationale
              </span>
              <p className="text-slate-200 leading-relaxed">{proposal.strategic_rationale}</p>
            </div>

            {/* Negotiation Tip Box */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <MessageSquareQuote className="h-3.5 w-3.5" />
                What to say to Counterparty Counsel:
              </span>
              <p className="text-amber-100 italic leading-relaxed">{proposal.negotiation_tip}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
