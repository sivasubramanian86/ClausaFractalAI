import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, RefreshCw } from "lucide-react";

import { TranslationDictionary } from "../i18n/types";
import { getTranslation } from "../i18n";

export interface BlindspotFindingItem {
  clause_key: string;
  title: string;
  severity: "CRITICAL" | "WARNING" | "RECOMMENDED";
  risk_description: string;
  suggested_clause: string;
}

export interface BlindspotReportData {
  document_id: string;
  template_name: string;
  compliance_score: number;
  omitted_findings: BlindspotFindingItem[];
  critical_count: number;
}

export interface BlindspotMatrixProps {
  documentId: string;
  report: BlindspotReportData | null;
  isLoading: boolean;
  onAudit: (templateName: string) => Promise<void>;
  t?: TranslationDictionary;
}

export const BlindspotMatrix: React.FC<BlindspotMatrixProps> = ({
  documentId,
  report,
  isLoading,
  onAudit,
  t: propT,
}) => {
  const t = propT || getTranslation("en");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("mutual_nda");

  const handleAuditClick = async () => {
    await onAudit(selectedTemplate);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-rose-500/15 border border-rose-500/40 px-2 py-0.5 text-[11px] font-bold text-rose-300">
            <ShieldAlert className="h-3 w-3" />
            CRITICAL
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 text-[11px] font-bold text-amber-300">
            <AlertTriangle className="h-3 w-3" />
            WARNING
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-sky-500/15 border border-sky-500/40 px-2 py-0.5 text-[11px] font-bold text-sky-300">
            <Info className="h-3 w-3" />
            RECOMMENDED
          </span>
        );
    }
  };

  return (
    <section
      aria-label="Contract Blindspot Risk Auditor"
      className="flex flex-col h-full rounded-xl glass-panel border border-slate-800 overflow-hidden"
    >
      {/* Header & Controls */}
      <header
        role="banner"
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 px-4 py-3 bg-slate-900/60"
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-rose-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {t.blindspotTitle}
          </h2>
        </div>

        {/* Template Selector & Action Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="template-select" className="sr-only">
            Select Baseline Standard Template
          </label>
          <select
            id="template-select"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-white focus:border-legal-emerald focus:outline-none"
          >
            <option value="mutual_nda">Baseline: Mutual NDA</option>
            <option value="saas_sla">Baseline: Enterprise SaaS SLA</option>
            <option value="employment_agreement">Baseline: Employment Agreement</option>
          </select>

          <button
            type="button"
            onClick={handleAuditClick}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-legal-emerald/40 bg-legal-emerald/10 px-3 py-1 text-xs font-semibold text-legal-emerald hover:bg-legal-emerald/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? t.auditingButton : t.auditButton}</span>
          </button>
        </div>
      </header>

      {/* Compliance Score Gauge Banner */}
      {report && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
          <div>
            <span className="text-xs text-slate-400">{t.baselineCompliance}</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span
                className={`text-xl font-bold font-mono ${
                  report.compliance_score >= 80
                    ? "text-legal-emerald"
                    : report.compliance_score >= 50
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                {report.compliance_score.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400">
                ({report.critical_count} {t.criticalOmissions})
              </span>
            </div>
          </div>

          <div className="w-36 bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                report.compliance_score >= 80
                  ? "bg-legal-emerald"
                  : report.compliance_score >= 50
                  ? "bg-amber-400"
                  : "bg-rose-500"
              }`}
              style={{ width: `${report.compliance_score}%` }}
            />
          </div>
        </div>
      )}

      {/* Findings Card Deck */}
      <div
        role="region"
        aria-label="Omitted Protective Clauses"
        className="flex-1 p-4 overflow-y-auto space-y-3"
      >
        {!report || report.omitted_findings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 text-slate-400">
            <CheckCircle2 className="h-10 w-10 text-legal-emerald mb-2" />
            <p className="text-sm font-semibold text-white">Full Baseline Compliance</p>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              No critical omissions detected against the selected standard template.
            </p>
          </div>
        ) : (
          report.omitted_findings.map((finding) => (
            <article
              key={finding.clause_key}
              className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4 transition-all hover:border-slate-700"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-sm font-semibold text-white">{finding.title}</h3>
                {getSeverityBadge(finding.severity)}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                <strong className="text-rose-300">Practical Risk: </strong>
                {finding.risk_description}
              </p>

              <div className="rounded-lg bg-slate-950/80 border border-slate-800/80 p-2.5 text-xs">
                <span className="text-[10px] font-semibold text-legal-emerald uppercase tracking-wider block mb-1">
                  Suggested Protective Clause:
                </span>
                <p className="font-mono text-slate-300 text-[11px] leading-relaxed">
                  "{finding.suggested_clause}"
                </p>
              </div>
            </article>
          ))
        )}
      </div>

      <footer
        role="contentinfo"
        className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/40 text-[11px] text-slate-500"
      >
        Auditing document: {documentId} against standard legal doctrines
      </footer>
    </section>
  );
};
