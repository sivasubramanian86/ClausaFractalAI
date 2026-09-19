import React from "react";
import { FileCheck2, Download, HelpCircle, Key, AlertTriangle } from "lucide-react";

export interface AttorneyQuestionItem {
  category: string;
  question: string;
  context_rationale: string;
}

export interface AttorneyPrepSheetData {
  document_id: string;
  executive_summary: string;
  critical_red_flags: string[];
  attorney_questions: AttorneyQuestionItem[];
  negotiation_leverage_points: string[];
}

export interface AttorneyPrepViewProps {
  sheet: AttorneyPrepSheetData | null;
  isLoading: boolean;
  onGenerate: () => Promise<void>;
}

export const AttorneyPrepView: React.FC<AttorneyPrepViewProps> = ({
  sheet,
  isLoading,
  onGenerate,
}) => {
  const handleExport = () => {
    if (!sheet) return;
    const text = [
      `# CLAUSAFRACTAL AI - ATTORNEY CONSULTATION PREP SHEET`,
      `Document ID: ${sheet.document_id}`,
      `Generated: ${new Date().toISOString()}`,
      ``,
      `## EXECUTIVE SUMMARY`,
      sheet.executive_summary,
      ``,
      `## CRITICAL RED FLAGS`,
      ...sheet.critical_red_flags.map((rf, i) => `${i + 1}. ${rf}`),
      ``,
      `## QUESTIONS FOR LEGAL COUNSEL`,
      ...sheet.attorney_questions.map(
        (q, i) =>
          `Q${i + 1} [${q.category}]: ${q.question}\n   Context: ${q.context_rationale}\n`
      ),
      ``,
      `## NEGOTIATION LEVERAGE POINTS`,
      ...sheet.negotiation_leverage_points.map((lp) => `- ${lp}`),
    ].join("\n");

    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Attorney_Prep_${sheet.document_id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      aria-label="Attorney Consultation Preparation Sheet"
      className="flex flex-col h-full rounded-xl glass-panel border border-slate-800 overflow-hidden"
    >
      <header
        role="banner"
        className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3 bg-slate-900/60"
      >
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-4 w-4 text-legal-emerald" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Attorney Consultation Prep Sheet
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {sheet && (
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1 rounded bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Prep Sheet</span>
            </button>
          )}

          <button
            type="button"
            onClick={onGenerate}
            disabled={isLoading}
            className="rounded-lg bg-gradient-to-r from-legal-emerald to-legal-cyan px-3 py-1 text-xs font-semibold text-obsidian-950 hover:brightness-110 disabled:opacity-40 shadow-sm"
          >
            {isLoading ? "Generating..." : "Generate Prep Sheet"}
          </button>
        </div>
      </header>

      <div
        role="region"
        aria-label="Attorney Preparation Checklist Content"
        className="flex-1 p-4 overflow-y-auto space-y-4 text-xs"
      >
        {!sheet ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 text-slate-400">
            <FileCheck2 className="h-10 w-10 text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-white">No Prep Sheet Generated</p>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Click Generate to synthesize prioritized questions and tactical negotiation leverage.
            </p>
          </div>
        ) : (
          <>
            {/* Executive Summary */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Executive Briefing
              </h3>
              <p className="text-slate-200 leading-relaxed">{sheet.executive_summary}</p>
            </div>

            {/* Red Flags */}
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Critical Red Flags Detected
              </h3>
              <ul className="space-y-1 text-slate-300">
                {sheet.critical_red_flags.map((rf, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-400">•</span>
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions for Legal Counsel */}
            <div className="space-y-2.5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-legal-cyan" />
                Questions for Legal Counsel (Ranked by Risk)
              </h3>
              {sheet.attorney_questions.map((q, idx) => (
                <article
                  key={idx}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-legal-cyan uppercase">
                      {q.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Q{idx + 1}</span>
                  </div>
                  <p className="font-semibold text-white">{q.question}</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    <strong className="text-slate-300">Why ask this: </strong>
                    {q.context_rationale}
                  </p>
                </article>
              ))}
            </div>

            {/* Negotiation Leverage */}
            <div className="rounded-xl border border-legal-emerald/30 bg-legal-emerald/10 p-3.5 space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-legal-emerald flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5" />
                Tactical Negotiation Leverage Points
              </h3>
              <ul className="space-y-1.5 text-slate-300">
                {sheet.negotiation_leverage_points.map((lp, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-legal-emerald font-bold">✓</span>
                    <span>{lp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
