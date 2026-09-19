import React, { useState } from "react";
import { Header } from "./components/Header";
import { ComplexityLevel, LanguageCode, DocumentMetadata } from "./types";
import { getTranslation } from "./i18n";
import {
  FileText,
  Upload,
  MessageSquare,
  ShieldAlert,
  GitCompare,
  FileCheck2,
  FileEdit,
  Sparkles,
  Lock,
} from "lucide-react";

export const App: React.FC = () => {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [activeTab, setActiveTab] = useState<
    "chat" | "blindspots" | "policyCollider" | "attorneyPrep" | "counterClauses"
  >("chat");
  const [complexity, setComplexity] = useState<ComplexityLevel>("standard");
  const [activeDoc, setActiveDoc] = useState<DocumentMetadata | null>({
    documentId: "doc_demo_saas_001",
    filename: "CloudFlow_Enterprise_SaaS_Agreement_v2.pdf",
    totalPages: 14,
    extractedClausesCount: 48,
    uploadedAt: "Just now",
    fileSizeFormatted: "1.4 MB",
  });

  const t = getTranslation(language);

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans selection:bg-legal-emerald selection:text-obsidian-950">
      <Header currentLanguage={language} onLanguageChange={setLanguage} />

      <main role="main" className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 md:p-6 gap-6">
        {/* Top Control Bar: Active Document & Complexity Slider */}
        <section
          aria-label="Document Metadata and Analysis Controls"
          className="glass-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl p-4 border border-slate-800"
        >
          {/* Active Document Info */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-700 text-legal-cyan">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t.activeDoc}
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-legal-emerald/10 px-2 py-0.5 text-[10px] font-medium text-legal-emerald">
                  <Lock className="h-2.5 w-2.5" /> PII Scrubbed
                </span>
              </div>
              <p className="text-sm font-semibold text-white truncate max-w-xs md:max-w-md">
                {activeDoc ? activeDoc.filename : "No document loaded"}
              </p>
            </div>
          </div>

          {/* "Explain Like I'm..." Slider */}
          <div className="flex flex-col gap-1.5 w-full md:w-auto md:min-w-[320px]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">{t.sliderLabel}:</span>
              <span className="font-semibold text-legal-cyan capitalize">{complexity}</span>
            </div>
            <div className="grid grid-cols-4 gap-1 rounded-lg bg-slate-900/90 p-1 border border-slate-800 text-xs">
              {(["eli5", "standard", "counsel", "paranoid"] as ComplexityLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setComplexity(level)}
                  className={`rounded py-1 font-medium transition-all ${
                    complexity === level
                      ? "bg-legal-emerald text-obsidian-950 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                  aria-pressed={complexity === level}
                >
                  {level === "eli5" ? "ELI5" : level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Studio Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Left Column: Document Viewer / Multimodal Ingestion */}
          <section
            aria-label="Document Viewer and Multimodal Ingestion"
            className="lg:col-span-6 flex flex-col rounded-xl glass-panel border border-slate-800 overflow-hidden min-h-[500px]"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3 bg-slate-900/40">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-legal-cyan" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Document Preview & Bidirectional Highlighting
                </span>
              </div>
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-legal-cyan/40 bg-legal-cyan/10 px-2.5 py-1 text-xs font-medium text-legal-cyan hover:bg-legal-cyan/20 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload PDF / Photo</span>
                <input
                  id="file-upload"
                  type="file"
                  accept="application/pdf,image/*"
                  className="sr-only"
                  aria-label="Upload PDF or Scanned Contract Photo"
                />
              </label>
            </div>

            {/* Document Placeholder / Viewer Stage */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-obsidian-900/40">
              <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-legal-emerald mb-4 shadow-xl shadow-legal-emerald/10">
                <FileText className="h-8 w-8" />
              </div>
              <h2 className="text-base font-semibold text-white mb-1">
                {activeDoc?.filename}
              </h2>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                14 Pages extracted · 48 Clauses indexed · Gemini Context Caching Active
              </p>
              <div className="inline-flex items-center gap-2 rounded-full border border-legal-emerald/40 bg-legal-emerald/10 px-3 py-1 text-xs text-legal-emerald">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Bidirectional PDF Highlighting Ready</span>
              </div>
            </div>
          </section>

          {/* Right Column: Autonomous Intelligence Studio Tabs */}
          <section
            aria-label="Autonomous Legal Copilot and Analysis"
            className="lg:col-span-6 flex flex-col rounded-xl glass-panel border border-slate-800 overflow-hidden min-h-[500px]"
          >
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-800/80 bg-slate-900/60 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "chat"
                    ? "border-legal-emerald text-legal-emerald bg-slate-900/40"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>{t.tabChat}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("blindspots")}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "blindspots"
                    ? "border-legal-emerald text-legal-emerald bg-slate-900/40"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <ShieldAlert className="h-4 w-4" />
                <span>{t.tabBlindspots}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("policyCollider")}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "policyCollider"
                    ? "border-legal-emerald text-legal-emerald bg-slate-900/40"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <GitCompare className="h-4 w-4" />
                <span>{t.tabPolicyCollider}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("attorneyPrep")}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "attorneyPrep"
                    ? "border-legal-emerald text-legal-emerald bg-slate-900/40"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileCheck2 className="h-4 w-4" />
                <span>{t.tabAttorneyPrep}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("counterClauses")}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "counterClauses"
                    ? "border-legal-emerald text-legal-emerald bg-slate-900/40"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileEdit className="h-4 w-4" />
                <span>{t.tabCounterClauses}</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 flex flex-col p-4 overflow-y-auto">
              {activeTab === "chat" && (
                <div className="flex-1 flex flex-col justify-between gap-4">
                  {/* Message Stream */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-legal-emerald">
                          ClausaFractalAI Analyst
                        </span>
                        <span className="text-[10px] text-slate-500">Grounded & Verified</span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        I have ingested{" "}
                        <span className="text-white font-medium">{activeDoc?.filename}</span>. I can
                        answer specific questions with strict clause citations, audit omitted
                        blindspots, or generate an attorney consultation prep sheet.
                      </p>
                    </div>

                    {/* Zero Hallucination Notification Badge */}
                    <div className="flex items-center justify-center gap-2 py-2 text-xs text-slate-400 bg-slate-900/30 rounded-lg border border-slate-800/60">
                      <Sparkles className="h-3.5 w-3.5 text-legal-cyan" />
                      <span>{t.zeroHallucinationBadge}</span>
                    </div>
                  </div>

                  {/* Input Form */}
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex items-center gap-2 pt-2 border-t border-slate-800"
                  >
                    <label htmlFor="user-query-input" className="sr-only">
                      {t.askPlaceholder}
                    </label>
                    <input
                      id="user-query-input"
                      type="text"
                      placeholder={t.askPlaceholder}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-legal-emerald focus:outline-none focus:ring-1 focus:ring-legal-emerald"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-gradient-to-r from-legal-emerald to-legal-cyan px-4 py-2.5 text-xs font-semibold text-obsidian-950 transition-all hover:brightness-110 shadow-lg shadow-legal-emerald/20"
                    >
                      {t.sendButton}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "blindspots" && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-white">
                    Contract Blindspot Audit vs. Standard SaaS SLA
                  </h3>
                  <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-rose-400">CRITICAL BLINDSPOT</span>
                      <span className="text-[10px] font-semibold text-rose-300">Omitted</span>
                    </div>
                    <h4 className="text-xs font-semibold text-white">
                      Missing Mutual Indemnification Cap
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      The agreement specifies customer indemnification obligations but lacks a reciprocal indemnity provision from the vendor for intellectual property infringement.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "policyCollider" && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-white">
                    Policy Collision & Practical Impact Matrix
                  </h3>
                  <div className="rounded-lg border border-legal-cyan/40 bg-legal-cyan/10 p-3">
                    <span className="text-xs font-bold text-legal-cyan">
                      RIGHTS SURRENDERED DETECTED
                    </span>
                    <p className="text-xs text-slate-200 mt-1">
                      Section 9.4 replaces binding court jurisdiction with mandatory non-appealable arbitration in an out-of-state forum.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "attorneyPrep" && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">
                      Attorney Consultation Prep Sheet
                    </h3>
                    <button
                      type="button"
                      className="rounded bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700"
                    >
                      {t.attorneyExportButton}
                    </button>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                    <p className="text-xs font-semibold text-legal-emerald">
                      Question 1 for Legal Counsel:
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      "Section 14.1 limits total vendor liability to fees paid in the preceding 12 months. Given our mission-critical dependency, should we negotiate a carve-out for data breaches?"
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "counterClauses" && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-white">
                    Favorable Counter-Clause Negotiation Redlines
                  </h3>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                    <p className="text-xs font-semibold text-slate-400 line-through">
                      Original: "Vendor may terminate for convenience with 5 days written notice."
                    </p>
                    <p className="text-xs font-semibold text-legal-emerald mt-2">
                      Proposed Redline: "Either party may terminate for convenience with not less than thirty (30) days prior written notice."
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
