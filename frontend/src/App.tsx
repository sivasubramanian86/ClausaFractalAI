import React, { useState } from "react";
import { Header } from "./components/Header";
import { DocumentViewer } from "./components/DocumentViewer";
import { ChatInterface, ChatMessage } from "./components/ChatInterface";
import { BlindspotMatrix, BlindspotReportData } from "./components/BlindspotMatrix";
import { PolicyCollider, PolicyCollisionReportData } from "./components/PolicyCollider";
import { AttorneyPrepView, AttorneyPrepSheetData } from "./components/AttorneyPrepView";
import { CounterClauseView, CounterClauseData } from "./components/CounterClauseView";
import { ComplexityLevel, LanguageCode, Citation } from "./types";
import { getTranslation, isRTL } from "./i18n";
import { Navigation, NavView } from "./components/Navigation";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { FAQSection } from "./components/FAQSection";
import { AboutSection } from "./components/AboutSection";
import { GovernanceView } from "./components/GovernanceView";
import { NeuroSymbolicTraceVisualizer } from "./components/NeuroSymbolicTraceVisualizer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CourtroomView } from "./components/CourtroomView";
import {
  MessageSquare,
  ShieldAlert,
  GitCompare,
  FileCheck2,
  FileEdit,
  Gavel,
} from "lucide-react";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

export const AppContent: React.FC = () => {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const t = getTranslation(language);
  const [activeView, setActiveView] = useState<NavView>("studio");
  const [activeTab, setActiveTab] = useState<
    | "chat"
    | "blindspots"
    | "policyCollider"
    | "attorneyPrep"
    | "counterClauses"
    | "courtroom"
  >("chat");
  const [complexity, setComplexity] = useState<ComplexityLevel>("standard");

  // Document state
  const [documentId, setDocumentId] = useState<string>("doc_default_01");
  const [filename, setFilename] = useState<string>("Master_Services_Agreement_2026.pdf");
  const [pages, setPages] = useState<Array<{ pageNumber: number; text: string }>>([
    {
      pageNumber: 1,
      text: "MASTER SERVICES AGREEMENT\n\nThis Agreement is entered into by and between Enterprise Vendor Inc. (\"Vendor\") and Customer LLC (\"Customer\").\n\nSection 1. Term and Services.\nVendor shall deliver enterprise cloud intelligence services as specified in Exhibit A.",
    },
    {
      pageNumber: 2,
      text: "Section 4. Limitation of Liability.\nNEITHER PARTY SHALL BE LIABLE TO THE OTHER FOR ANY INDIRECT, CONSEQUENTIAL, OR SPECULATIVE DAMAGES.\nVENDOR'S TOTAL CUMULATIVE AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL BE STRICTLY LIMITED TO THE SUM OF $50,000 OR FEES PAID IN THE THREE (3) MONTHS PRECEDING THE CLAIM.\n\nSection 5. Indemnification.\nCustomer agrees to defend, indemnify, and hold harmless Vendor against all third-party actions.",
    },
    {
      pageNumber: 3,
      text: "Section 9. Dispute Resolution & Arbitration.\nAny dispute arising out of or related to this Agreement shall be resolved exclusively through final and binding non-appealable arbitration in Wilmington, Delaware, waiving all rights to jury trial.\n\nSection 10. Termination.\nEither party may terminate for cause upon thirty (30) days prior written notice.",
    },
  ]);
  const [activeHighlight, setActiveHighlight] = useState<{
    page: number;
    snippet: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "agent",
      text: "I have ingested and indexed your agreement with PII scrubbing and semantic FAISS embeddings. Ask any question with strict citation grounding, or switch tabs to audit blindspots or redline clauses.",
      intent: "LEGAL_QA",
      qualityScore: 10.0,
      citations: [
        {
          clause: "Limitation of Liability",
          page: 2,
          snippet: "strictly limited to the sum of $50,000",
        },
      ],
    },
  ]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Tabs state
  const [blindspotReport, setBlindspotReport] = useState<BlindspotReportData | null>(null);
  const [collisionReport, setCollisionReport] = useState<PolicyCollisionReportData | null>(null);
  const [prepSheet, setPrepSheet] = useState<AttorneyPrepSheetData | null>(null);
  const [counterProposal, setCounterProposal] = useState<CounterClauseData | null>(null);
  const [isTabLoading, setIsTabLoading] = useState<boolean>(false);

  // Handle Document Upload
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const resp = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (resp.ok) {
        const data = await resp.json();
        setDocumentId(data.document_id);
        setFilename(data.filename);
        if (data.pages && data.pages.length > 0) {
          setPages(
            data.pages.map((p: { page_number: number; clean_text: string }) => ({
              pageNumber: p.page_number,
              text: p.clean_text,
            }))
          );
        }
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-upload-${Date.now()}`,
            sender: "agent",
            text: `Successfully ingested "${data.filename}". Processed ${data.page_count} page(s), ${data.chunks?.length || 0} chunks indexed, and ${data.total_redactions || 0} PII elements scrubbed.`,
            intent: "INGESTION",
            qualityScore: 10.0,
          },
        ]);
      } else {
        // Fallback for demo when backend endpoint is in mock mode
        setFilename(file.name);
        setDocumentId(`doc_${Date.now()}`);
      }
    } catch {
      setFilename(file.name);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Audio Upload / Dictation
  const handleAudioUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const resp = await fetch("/api/audio/transcribe", {
        method: "POST",
        body: formData,
      });

      if (resp.ok) {
        const data = await resp.json();
        await handleSendMessage(data.transcript);
      }
    } catch {
      // Ignored
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Citation Click -> Bidirectional Highlighting
  const handleCitationClick = (citation: Citation) => {
    setActiveHighlight({
      page: citation.page,
      snippet: citation.snippet,
    });
  };

  // Handle SSE Chat Stream
  const handleSendMessage = async (query: string) => {
    const userMsgId = `user-${Date.now()}`;
    const agentMsgId = `agent-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: "user", text: query },
      { id: agentMsgId, sender: "agent", text: "", isStreaming: true },
    ]);

    setIsGenerating(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          document_id: documentId,
          complexity: complexity.toUpperCase(),
          stream: true,
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Chat request failed");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";
      let parsedCitations: Citation[] = [];
      let qualityScore = 10.0;

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith("event: token")) {
              const dataLine = lines[i + 1];
              if (dataLine && dataLine.startsWith("data: ")) {
                try {
                  const data = JSON.parse(dataLine.slice(6));
                  accumulatedText += data.token || "";
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === agentMsgId ? { ...m, text: accumulatedText } : m
                    )
                  );
                } catch {
                  // Skip invalid JSON
                }
              }
            } else if (line.startsWith("event: citation")) {
              const dataLine = lines[i + 1];
              if (dataLine && dataLine.startsWith("data: ")) {
                try {
                  parsedCitations = JSON.parse(dataLine.slice(6));
                } catch {
                  // Skip
                }
              }
            } else if (line.startsWith("event: done")) {
              const dataLine = lines[i + 1];
              if (dataLine && dataLine.startsWith("data: ")) {
                try {
                  const doneData = JSON.parse(dataLine.slice(6));
                  qualityScore = doneData.quality_score ?? 10.0;
                } catch {
                  // Skip
                }
              }
            }
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === agentMsgId
            ? {
                ...m,
                text: accumulatedText || "Analysis complete.",
                citations: parsedCitations,
                qualityScore,
                isStreaming: false,
              }
            : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === agentMsgId
            ? {
                ...m,
                text: "I cannot determine this based on the provided document.",
                isStreaming: false,
                qualityScore: 10.0,
              }
            : m
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Tab Action Handlers
  const handleAuditBlindspots = async (templateName: string) => {
    setIsTabLoading(true);
    try {
      const resp = await fetch("/api/blindspots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_id: documentId,
          template_name: templateName,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setBlindspotReport(data);
      }
    } catch {
      // Offline fallback
      setBlindspotReport({
        document_id: documentId,
        template_name: templateName,
        compliance_score: 62.5,
        critical_count: 1,
        omitted_findings: [
          {
            clause_key: "liability_carveout",
            title: "Missing Gross Negligence Carve-out",
            severity: "CRITICAL",
            risk_description:
              "The contract caps all liability without excluding gross negligence or willful misconduct.",
            suggested_clause:
              "The limitations of liability shall not apply to damages resulting from gross negligence or willful misconduct.",
          },
        ],
      });
    } finally {
      setIsTabLoading(false);
    }
  };

  const handlePolicyCompare = async (docBText: string) => {
    setIsTabLoading(true);
    try {
      const resp = await fetch("/api/diff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc_a_id: documentId,
          doc_b_id: "doc_v2_proposed",
          doc_b_text: docBText,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setCollisionReport(data);
      }
    } catch {
      // Offline fallback
      setCollisionReport({
        doc_a_id: documentId,
        doc_b_id: "doc_v2_proposed",
        total_shifts_detected: 1,
        overall_verdict: "CAUTION: Detected surrendered rights in updated version.",
        impact_matrix: [
          {
            clause_topic: "Arbitration",
            previous_term: "Court jurisdiction",
            new_term: "Mandatory binding arbitration",
            impact_type: "RIGHTS_SURRENDERED",
            plain_english_takeaway: "Surrendered right to jury trial and judicial appeal.",
            risk_level: "HIGH",
          },
        ],
      });
    } finally {
      setIsTabLoading(false);
    }
  };

  const handleGeneratePrep = async () => {
    setIsTabLoading(true);
    try {
      const resp = await fetch("/api/copilot/attorney-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_id: documentId,
          key_risks: ["Uncapped liability", "One-sided indemnity"],
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setPrepSheet(data);
      }
    } catch {
      setPrepSheet({
        document_id: documentId,
        executive_summary: `Attorney Consultation Brief for ${filename}. Key vulnerabilities identified in liability caps and indemnity obligations.`,
        critical_red_flags: [
          "Unilateral indemnification favoring counterparty",
          "Trailing 3-month fees liability ceiling ($50,000)",
        ],
        attorney_questions: [
          {
            category: "Liability Allocation",
            question: "Is the $50,000 liability cap reasonable given our expected volume?",
            context_rationale: "Low caps create catastrophic direct losses if vendor defaults.",
          },
        ],
        negotiation_leverage_points: [
          "Propose mutual 12-month fees liability cap as standard practice.",
          "Insert 30-day written cure period before default.",
        ],
      });
    } finally {
      setIsTabLoading(false);
    }
  };

  const handleRewriteClause = async (clauseText: string, clauseType: string) => {
    setIsTabLoading(true);
    try {
      const resp = await fetch("/api/copilot/rewrite-clause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clause_text: clauseText,
          clause_type: clauseType,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setCounterProposal(data);
      }
    } catch {
      setCounterProposal({
        original_clause: clauseText,
        counter_clause:
          "Neither party shall be liable for indirect damages. Each party's liability is capped at trailing 12-month fees.",
        strategic_rationale: "Establishes a bilateral reciprocal cap.",
        negotiation_tip:
          "Tell counterparty: 'Our standard procurement policy requires reciprocal limitation of liability.'",
      });
    } finally {
      setIsTabLoading(false);
    }
  };

  return (
    <div
      dir={isRTL(language) ? "rtl" : "ltr"}
      className="min-h-screen bg-obsidian-950 dark:bg-obsidian-950 light:bg-slate-50 text-slate-100 dark:text-slate-100 light:text-slate-900 flex flex-col font-sans selection:bg-legal-emerald selection:text-obsidian-950 transition-colors duration-200"
    >
      <Header currentLanguage={language} onLanguageChange={setLanguage} />
      <Navigation activeView={activeView} onViewChange={setActiveView} t={t} />

      <main role="main" className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 md:p-6 gap-6">
        {activeView === "studio" && (
          <ErrorBoundary fallbackTitle="Studio Workspace Disrupted">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[680px]">
              {/* Left Column: Document Viewer & Ingestion Stage (6 cols) */}
              <div className="lg:col-span-6 flex flex-col h-full">
                <DocumentViewer
                  documentId={documentId}
                  filename={filename}
                  pages={pages}
                  activeHighlight={activeHighlight}
                  onFileUpload={handleFileUpload}
                  onAudioUpload={handleAudioUpload}
                  isUploading={isUploading}
                  t={t}
                />
              </div>

              {/* Right Column: Multi-Agent Intelligence Studio (6 cols) */}
              <div className="lg:col-span-6 flex flex-col h-full rounded-xl glass-panel border border-slate-800 dark:border-slate-800 light:border-slate-300 overflow-hidden">
                {/* Top Navigation Tabs */}
                <nav
                  role="navigation"
                  aria-label="Studio Modes"
                  className="flex border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-300 bg-slate-900/70 dark:bg-slate-900/70 light:bg-slate-100 overflow-x-auto"
                >
                  <button
                    type="button"
                    onClick={() => setActiveTab("chat")}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "chat"
                        ? "border-legal-emerald text-legal-emerald bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-200"
                        : "border-transparent text-slate-400 hover:text-slate-200 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900"
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{t.tabChat}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("blindspots")}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "blindspots"
                        ? "border-legal-emerald text-legal-emerald bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-200"
                        : "border-transparent text-slate-400 hover:text-slate-200 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900"
                    }`}
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>{t.tabBlindspots}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("policyCollider")}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "policyCollider"
                        ? "border-legal-emerald text-legal-emerald bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-200"
                        : "border-transparent text-slate-400 hover:text-slate-200 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900"
                    }`}
                  >
                    <GitCompare className="h-3.5 w-3.5" />
                    <span>{t.tabPolicyCollider}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("attorneyPrep")}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "attorneyPrep"
                        ? "border-legal-emerald text-legal-emerald bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-200"
                        : "border-transparent text-slate-400 hover:text-slate-200 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900"
                    }`}
                  >
                    <FileCheck2 className="h-3.5 w-3.5" />
                    <span>{t.tabAttorneyPrep}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("counterClauses")}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "counterClauses"
                        ? "border-legal-emerald text-legal-emerald bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-200"
                        : "border-transparent text-slate-400 hover:text-slate-200 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900"
                    }`}
                  >
                    <FileEdit className="h-3.5 w-3.5" />
                    <span>{t.tabCounterClauses}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("courtroom")}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "courtroom"
                        ? "border-amber-400 text-amber-400 bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-200"
                        : "border-transparent text-slate-400 hover:text-slate-200 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900"
                    }`}
                  >
                    <Gavel className="h-3.5 w-3.5 text-amber-400" />
                    <span>{t.tabCourtroom}</span>
                  </button>
                </nav>

                {/* Tab Workspace Body */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {activeTab === "chat" && (
                    <ChatInterface
                      documentId={documentId}
                      documentFilename={filename}
                      complexity={complexity}
                      onComplexityChange={setComplexity}
                      onCitationClick={handleCitationClick}
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      isGenerating={isGenerating}
                      t={t}
                    />
                  )}

                  {activeTab === "blindspots" && (
                    <BlindspotMatrix
                      documentId={documentId}
                      report={blindspotReport}
                      isLoading={isTabLoading}
                      onAudit={handleAuditBlindspots}
                      t={t}
                    />
                  )}

                  {activeTab === "policyCollider" && (
                    <PolicyCollider
                      report={collisionReport}
                      isLoading={isTabLoading}
                      onCompare={handlePolicyCompare}
                      t={t}
                    />
                  )}

                  {activeTab === "attorneyPrep" && (
                    <AttorneyPrepView
                      sheet={prepSheet}
                      isLoading={isTabLoading}
                      onGenerate={handleGeneratePrep}
                      t={t}
                    />
                  )}

                  {activeTab === "counterClauses" && (
                    <CounterClauseView
                      proposal={counterProposal}
                      isLoading={isTabLoading}
                      onRewrite={handleRewriteClause}
                      t={t}
                    />
                  )}

                  {activeTab === "courtroom" && (
                    <CourtroomView
                      initialCaseText={pages.map((p) => p.text).join("\n\n")}
                      t={t}
                    />
                  )}
                </div>
              </div>
            </div>
          </ErrorBoundary>
        )}

        {activeView === "courtroom" && (
          <ErrorBoundary fallbackTitle="Judicial Chamber Disrupted">
            <CourtroomView
              initialCaseText={pages.map((p) => p.text).join("\n\n")}
              t={t}
            />
          </ErrorBoundary>
        )}

        {activeView === "mesh" && (
          <ErrorBoundary fallbackTitle="Neuro-Symbolic Mesh Disrupted">
            <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">
              <NeuroSymbolicTraceVisualizer t={t} />
            </div>
          </ErrorBoundary>
        )}

        {activeView === "analytics" && (
          <ErrorBoundary fallbackTitle="Analytics Dashboard Disrupted">
            <AnalyticsDashboard t={t} />
          </ErrorBoundary>
        )}
        {activeView === "faq" && (
          <ErrorBoundary fallbackTitle="Legal FAQ Disrupted">
            <FAQSection t={t} lang={language} />
          </ErrorBoundary>
        )}
        {activeView === "about" && (
          <ErrorBoundary fallbackTitle="Architecture Section Disrupted">
            <AboutSection t={t} lang={language} />
          </ErrorBoundary>
        )}
        {activeView === "governance" && (
          <ErrorBoundary fallbackTitle="Governance Console Disrupted">
            <GovernanceView t={t} />
          </ErrorBoundary>
        )}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
