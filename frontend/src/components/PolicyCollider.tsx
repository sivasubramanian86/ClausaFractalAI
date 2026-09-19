import React, { useState } from "react";
import { GitCompare, AlertOctagon, TrendingUp, CheckCircle, ShieldAlert, ArrowRight } from "lucide-react";

export interface ImpactItemData {
  clause_topic: string;
  previous_term: string;
  new_term: string;
  impact_type: "RIGHTS_SURRENDERED" | "LIABILITY_INCREASE" | "BENEFIT_GAINED" | "NEUTRAL";
  plain_english_takeaway: string;
  risk_level: "HIGH" | "MEDIUM" | "LOW";
}

export interface PolicyCollisionReportData {
  doc_a_id: string;
  doc_b_id: string;
  total_shifts_detected: number;
  impact_matrix: ImpactItemData[];
  overall_verdict: string;
}

export interface PolicyColliderProps {
  report: PolicyCollisionReportData | null;
  onCompare: (docBText: string) => Promise<void>;
  isLoading: boolean;
}

export const PolicyCollider: React.FC<PolicyColliderProps> = ({
  report,
  onCompare,
  isLoading,
}) => {
  const [docBText, setDocBText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docBText.trim() || isLoading) return;
    await onCompare(docBText);
  };

  const getImpactBadge = (type: string) => {
    switch (type) {
      case "RIGHTS_SURRENDERED":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-rose-500/15 border border-rose-500/40 px-2 py-0.5 text-[11px] font-bold text-rose-300">
            <AlertOctagon className="h-3 w-3" />
            RIGHTS SURRENDERED
          </span>
        );
      case "LIABILITY_INCREASE":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 text-[11px] font-bold text-amber-300">
            <TrendingUp className="h-3 w-3" />
            LIABILITY ESCALATED
          </span>
        );
      case "BENEFIT_GAINED":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-legal-emerald/15 border border-legal-emerald/40 px-2 py-0.5 text-[11px] font-bold text-legal-emerald">
            <CheckCircle className="h-3 w-3" />
            BENEFIT GAINED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-[11px] font-bold text-slate-400">
            NEUTRAL SHIFT
          </span>
        );
    }
  };

  return (
    <section
      aria-label="Policy Collision and Version Diff Analyzer"
      className="flex flex-col h-full rounded-xl glass-panel border border-slate-800 overflow-hidden"
    >
      <header
        role="banner"
        className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3 bg-slate-900/60"
      >
        <div className="flex items-center gap-2">
          <GitCompare className="h-4 w-4 text-legal-cyan" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Policy Collider: Practical Impact Matrix
          </h2>
        </div>
      </header>

      {/* Strategic Verdict Alert Banner */}
      {report && (
        <div
          className={`p-3 border-b text-xs flex items-center gap-2.5 ${
            report.overall_verdict.includes("CAUTION")
              ? "bg-rose-500/15 border-rose-500/30 text-rose-200"
              : "bg-legal-cyan/10 border-legal-cyan/30 text-legal-cyan"
          }`}
        >
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <div className="font-medium">{report.overall_verdict}</div>
        </div>
      )}

      {/* Input or Comparison Form */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/60">
        <form onSubmit={handleSubmit} className="space-y-2">
          <label
            htmlFor="comparison-terms-input"
            className="text-xs font-medium text-slate-300 block"
          >
            Paste Updated Terms or Proposed Agreement Version (Doc B):
          </label>
          <textarea
            id="comparison-terms-input"
            rows={3}
            value={docBText}
            onChange={(e) => setDocBText(e.target.value)}
            placeholder="Paste proposed amended terms or counterparty draft to detect rights surrender..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:border-legal-emerald focus:outline-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!docBText.trim() || isLoading}
              className="rounded-lg bg-gradient-to-r from-legal-emerald to-legal-cyan px-4 py-1.5 text-xs font-semibold text-obsidian-950 hover:brightness-110 disabled:opacity-40 transition-all shadow-md"
            >
              {isLoading ? "Comparing..." : "Collide Versions"}
            </button>
          </div>
        </form>
      </div>

      {/* Impact Matrix Stream */}
      <div
        role="region"
        aria-label="Practical Impact Shifts"
        className="flex-1 p-4 overflow-y-auto space-y-3"
      >
        {!report || report.impact_matrix.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 text-slate-400">
            <GitCompare className="h-8 w-8 text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-white">No Policy Collisions</p>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Submit a comparison draft above to detect surrendered rights and escalated liabilities.
            </p>
          </div>
        ) : (
          report.impact_matrix.map((item, idx) => (
            <article
              key={`${item.clause_topic}-${idx}`}
              className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3.5 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {item.clause_topic}
                </h3>
                {getImpactBadge(item.impact_type)}
              </div>

              {/* Side-by-side comparison boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="rounded bg-slate-950 p-2 border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                    Previous Term (Doc A)
                  </span>
                  <p className="text-slate-300 font-mono text-[11px]">{item.previous_term}</p>
                </div>
                <div className="rounded bg-slate-950 p-2 border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                    Updated Term (Doc B)
                  </span>
                  <p className="text-white font-mono text-[11px]">{item.new_term}</p>
                </div>
              </div>

              {/* Plain English takeaway */}
              <div className="text-xs text-slate-300 pt-1 border-t border-slate-800/60 flex items-start gap-1.5">
                <ArrowRight className="h-3.5 w-3.5 text-legal-emerald shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Takeaway: </strong>
                  {item.plain_english_takeaway}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};
