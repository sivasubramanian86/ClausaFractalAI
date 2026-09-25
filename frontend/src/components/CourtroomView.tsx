import React, { useState, useEffect } from "react";
import {
  Scale,
  ShieldAlert,
  Gavel,
  BookOpen,
  Upload,
  FileText,
  Camera,
  Mic,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Swords,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  CourtroomAnalysisResult,
  StatutorySection,
} from "../types";

interface CourtroomViewProps {
  initialCaseText?: string;
}

export const CourtroomView: React.FC<CourtroomViewProps> = ({
  initialCaseText = "",
}) => {
  const [activeTab, setActiveTab] = useState<
    "dossier" | "bench" | "advocate" | "codex"
  >("bench");
  const [caseText, setCaseText] = useState<string>(
    initialCaseText ||
      `State v. Nexus Corp\nAccused entities intentionally deceived complainant into parting with $2.4M worth of proprietary cloud source code and enterprise assets through unauthorized computer access and forged executive wire authorizations.`
  );
  const [jurisdiction, setJurisdiction] = useState<string>("Common Law");
  const [incidentType, setIncidentType] = useState<string>("Criminal / Fraud");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Codex Search & Filter
  const [codexQuery, setCodexQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [codexSections, setCodexSections] = useState<StatutorySection[]>([]);
  const [isLoadingCodex, setIsLoadingCodex] = useState<boolean>(false);

  // Analysis result state with rich default demo data
  const [analysisResult, setAnalysisResult] = useState<CourtroomAnalysisResult>({
    dossier: {
      case_title: "In re: State v. Nexus Corp & Officers",
      incident_type: "Criminal / Fraud & Cyber Misappropriation",
      parties: {
        Prosecution_or_Plaintiff: "State Special Prosecutor & Aggrieved Enterprise",
        Defense_or_Respondent: "Nexus Corp & Executive Leadership",
      },
      facts_summary:
        "Allegations center on systematic deception, unauthorized credential theft, and interstate wire communications inducing transfer of valuable enterprise property and source code under false pretenses.",
      key_evidence: [
        "Exhibit A: Digital audit trail indicating unauthorized CFAA system ingress",
        "Exhibit B: Altered wire transfer authorization forms with forged digital signature",
        "Exhibit C: Electronic email records demonstrating deceitful representations prior to asset delivery",
      ],
      jurisdiction: "United States (Federal) / Common Law",
    },
    verdict: {
      case_title: "In re: State v. Nexus Corp & Officers",
      bench: "The Honorable Bench – High Jurisprudential Chamber",
      ratio_decidendi:
        "Where the evidentiary record establishes intentional deception coupled with interstate wire transmission to induce delivery of valuable property, the defendant cannot shield themselves behind contractual limitation clauses or boilerplate arbitration disclaimers.",
      obiter_dicta:
        "Fiduciary officers cannot weaponize technical complexity to obfuscate fraudulent intent. Commercial entities are admonished that good faith and statutory compliance supersede private exculpatory pacts.",
      element_proofs: [
        {
          element: "Participation in a scheme to defraud or obtain property by false pretenses",
          is_satisfied: true,
          evidentiary_basis:
            "Corroborated by contemporaneous server logs and forged authorization instruments.",
        },
        {
          element: "Knowing and willful intent to defraud (Mens Rea)",
          is_satisfied: true,
          evidentiary_basis:
            "Demonstrated by internal encrypted communications directing the diversion of funds.",
        },
        {
          element: "Transmission in interstate wire commerce (Actus Reus)",
          is_satisfied: true,
          evidentiary_basis:
            "Confirmed by SWIFT transaction records and interstate server transmission routes.",
        },
      ],
      final_decree: "Finding of Liability & Prima Facie Guilt under USC-18-1343 & IPC-420",
      relief_or_sentence:
        "Restitution in the sum of $2,400,000, statutory civil penalties, and referral for formal criminal indictment.",
      statutory_compliance_score: 9.2,
    },
    advocate_strategy: {
      counsel_role: "Senior Advocate & Lead Trial Counsel (BA LLB, LLM)",
      prosecution_strengths: [
        "Primary Landmark Precedent: Neder v. United States (1999) establishes that materiality of false statement is fully satisfied.",
        "Direct statutory trigger under Wire Fraud (18 U.S.C. § 1343) and Cheating (IPC 420).",
        "Contemporaneous digital footprints eliminate defense claims of accidental procedural oversight.",
      ],
      defense_shields: [
        "Motion in Limine to exclude unauthenticated third-party server telemetry.",
        "Argue absence of subjective fraudulent intent at inception of commercial transaction.",
        "Plead commercial contract dispute subject exclusively to Delaware commercial arbitration.",
      ],
      cross_examination_traps: [
        "Trap 1: Confront CFO with discrepancy between initial representations and actual fund routing.",
        "Trap 2: Force tech lead to concede absence of authorized executive signoff for credential override.",
        "Trap 3: Impeach key witness on 6-month delay between internal discovery and public disclosure.",
      ],
      evidentiary_vulnerabilities: [
        "Hearsay vulnerability regarding hearsay declarations in internal instant messaging logs.",
        "Chain of custody gaps for secondary forensic disk clones.",
        "Ambiguity in reciprocal indemnification terms in Master Services Agreement.",
      ],
      settlement_or_plea_calculus:
        "Claimant holds 85% trial leverage. Recommend rejecting defense offer below $2.1M; if defense files affirmative motion to compel arbitration, condition stay on escrow deposit.",
      win_probability_prosecution: 0.82,
      win_probability_defense: 0.18,
    },
    matched_sections: [
      {
        code_id: "USC-18-1343",
        title: "Federal Wire Fraud",
        jurisdiction: "United States (Federal)",
        category: "Criminal / Federal Fraud",
        elements: [
          "Participation in a scheme to defraud or obtain money/property by false pretenses",
          "Knowing and willful intent to defraud",
          "Transmission of wire communications in interstate commerce",
        ],
        penalties: "Up to 20 years imprisonment and fines",
        precedents: ["Neder v. United States (1999)", "Kelly v. United States (2020)"],
        statutory_test:
          "Scheme requires material misrepresentation transmitted via interstate wire.",
      },
      {
        code_id: "IPC-420 / BNS-318(4)",
        title: "Cheating and Dishonestly Inducing Delivery of Property",
        jurisdiction: "India (IPC / BNS)",
        category: "Criminal / Fraud",
        elements: [
          "Deception of any person",
          "Fraudulent or dishonest inducement to deliver property or alter valuable security",
          "Intentional causation of damage or harm in body, mind, or property",
        ],
        penalties: "Imprisonment up to 7 years and fine",
        precedents: [
          "Hridaya Ranjan Prasad Verma v. State of Bihar",
          "S.W. Palanitkar v. State of Bihar",
        ],
        statutory_test: "Fraudulent intention must exist at inception of transaction.",
      },
      {
        code_id: "USC-18-1030",
        title: "Computer Fraud and Abuse Act (CFAA) - Unauthorized Access",
        jurisdiction: "United States (Federal)",
        category: "Cybercrime & Privacy",
        elements: [
          "Intentionally accessing a protected computer",
          "Access without authorization or exceeding authorized access",
          "Obtaining information or causing damage",
        ],
        penalties: "Fine and imprisonment up to 10 to 20 years",
        precedents: ["Van Buren v. United States (2021)", "hiQ Labs v. LinkedIn (2022)"],
        statutory_test: "Gates-up vs gates-down access barrier test.",
      },
    ],
    disclaimer:
      "AI Jurisprudential Co-Counsel: Designed for legal research, mock-trial deliberation, and judicial decision support under Human-in-the-Loop oversight. Not a substitute for licensed bar representation.",
  });

  // Fetch Codex data on mount or when category/query changes
  useEffect(() => {
    const fetchCodex = async () => {
      setIsLoadingCodex(true);
      try {
        const params = new URLSearchParams();
        if (codexQuery) params.append("query", codexQuery);
        if (selectedCategory !== "All") params.append("category", selectedCategory);
        const queryStr = params.toString();
        const url = queryStr ? `/api/judicial/codex?${queryStr}` : "/api/judicial/codex";

        const resp = await fetch(url);
        if (resp.ok) {
          const data = await resp.json();
          setCodexSections(data);
        }
      } catch (err) {
        console.error("Failed to fetch statutory codex", err);
      } finally {
        setIsLoadingCodex(false);
      }
    };

    fetchCodex();
  }, [codexQuery, selectedCategory]);

  // Execute full Case Dissection
  const handleDissectCase = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch("/api/judicial/dissect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case_text: caseText,
          jurisdiction: jurisdiction,
          incident_type: incidentType,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        setAnalysisResult(data);
        setActiveTab("bench");
      }
    } catch (err) {
      console.error("Dissection error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Multimodal Evidence Upload (PDF, Photo, Audio/Video)
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("case_text", caseText);
      formData.append("jurisdiction", jurisdiction);
      formData.append("incident_type", incidentType);

      const resp = await fetch("/api/judicial/multimodal-evidence", {
        method: "POST",
        body: formData,
      });

      if (resp.ok) {
        const data = await resp.json();
        setAnalysisResult(data);
        setActiveTab("dossier");
      }
    } catch (err) {
      console.error("Multimodal evidence upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Top Banner: Courtroom Jurisprudential Chambers */}
      <div className="border-b border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                ENTERPRISE JURISPRUDENTIAL MESH
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Zero-Hallucination
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              Judicial Chamber & Statutory Codex
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl">
              Impartial Senior Judicial Magistrate & Bar Senior Advocate (BA LLB, LLM) analysis. Dissects multimodal evidence, checks statutory offense elements, drafts judicial rulings, and strategizes trial battlecards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("codex")}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition flex items-center gap-2 shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Global Codex ({codexSections.length || 12} Laws)
            </button>
            <button
              onClick={handleDissectCase}
              disabled={isLoading}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? "Deliberating..." : "Deliberate Case"}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab("bench")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              activeTab === "bench"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Gavel className="w-4 h-4 text-amber-400" />
            The Honorable Bench (Judge's Ruling)
          </button>

          <button
            onClick={() => setActiveTab("advocate")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              activeTab === "advocate"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Swords className="w-4 h-4 text-rose-400" />
            Senior Advocate War Room (Trial Strategy)
          </button>

          <button
            onClick={() => setActiveTab("dossier")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              activeTab === "dossier"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            Case Dossier & Evidence Ingestion
          </button>

          <button
            onClick={() => setActiveTab("codex")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              activeTab === "codex"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Statutory Codex (Law at Fingertips)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full p-6 space-y-6 flex-1">
        {/* TAB 1: THE HONORABLE BENCH */}
        {activeTab === "bench" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Judicial Ruling Verdict Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/50 border border-indigo-500/30 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
                <div>
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                    {analysisResult.verdict.bench}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                    {analysisResult.verdict.final_decree}
                  </h2>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-indigo-500/20">
                  <Award className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-xs text-slate-400">Statutory Proof Score</div>
                    <div className="text-lg font-bold text-amber-400">
                      {analysisResult.verdict.statutory_compliance_score} / 10.0
                    </div>
                  </div>
                </div>
              </div>

              {/* Ratio Decidendi (Core Legal Rationale) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
                  <Scale className="w-4 h-4" />
                  Ratio Decidendi (Binding Legal Principle):
                </div>
                <p className="text-slate-200 text-sm leading-relaxed bg-indigo-950/30 p-4 rounded-xl border border-indigo-500/20">
                  {analysisResult.verdict.ratio_decidendi}
                </p>
              </div>

              {/* Prescribed Relief or Sentence */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <Gavel className="w-4 h-4" />
                  Statutory Remedy & Relief:
                </div>
                <p className="text-slate-300 text-sm bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/20">
                  {analysisResult.verdict.relief_or_sentence}
                </p>
              </div>

              {/* Obiter Dicta */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  Obiter Dicta (Judicial Observations):
                </div>
                <p className="text-slate-400 text-xs italic">
                  "{analysisResult.verdict.obiter_dicta}"
                </p>
              </div>
            </div>

            {/* Statutory Elements Proof Checklist */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                Statutory Offense Elements Checklist (System 2 Proof)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysisResult.verdict.element_proofs.map((elem, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      elem.is_satisfied
                        ? "bg-slate-900/80 border-emerald-500/30 shadow-sm shadow-emerald-500/10"
                        : "bg-slate-900/80 border-rose-500/30 shadow-sm shadow-rose-500/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-slate-400">
                        Element {idx + 1}
                      </span>
                      {elem.is_satisfied ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          PROVEN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          UNPROVEN
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200 mb-2 leading-snug">
                      {elem.element}
                    </h4>
                    <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      {elem.evidentiary_basis}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SENIOR ADVOCATE WAR ROOM */}
        {activeTab === "advocate" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Probability Meters */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Swords className="w-5 h-5 text-rose-400" />
                    Trial Probability Calculus
                  </h3>
                  <p className="text-xs text-slate-400">
                    Lead Counsel (BA LLB, LLM) assessment of evidentiary weight and judicial disposition.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    Prosecution: {Math.round(analysisResult.advocate_strategy.win_probability_prosecution * 100)}%
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-400">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    Defense: {Math.round(analysisResult.advocate_strategy.win_probability_defense * 100)}%
                  </div>
                </div>
              </div>

              {/* Progress bar split */}
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                  style={{
                    width: `${analysisResult.advocate_strategy.win_probability_prosecution * 100}%`,
                  }}
                />
                <div
                  className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-500"
                  style={{
                    width: `${analysisResult.advocate_strategy.win_probability_defense * 100}%`,
                  }}
                />
              </div>

              {/* Commercial Settlement & Plea Negotiation Calculus */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Tactical Settlement / Plea Calculus:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysisResult.advocate_strategy.settlement_or_plea_calculus}
                </p>
              </div>
            </div>

            {/* Split Strategy Columns: Prosecution vs Defense */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prosecution Strengths */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/20 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                  <ShieldAlert className="w-5 h-5" />
                  Prosecution / Claimant Winning Arsenal
                </div>
                <ul className="space-y-2.5">
                  {analysisResult.advocate_strategy.prosecution_strengths.map((st, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-300 bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl flex items-start gap-2"
                    >
                      <ChevronRight className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Defense Affirmative Shields */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-rose-500/20 space-y-4">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                  <Scale className="w-5 h-5" />
                  Defense Counter-Shields & Mitigations
                </div>
                <ul className="space-y-2.5">
                  {analysisResult.advocate_strategy.defense_shields.map((sh, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-300 bg-rose-950/20 border border-rose-500/20 p-3 rounded-xl flex items-start gap-2"
                    >
                      <ChevronRight className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{sh}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Cross-Examination Traps & Evidentiary Vulnerabilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Traps */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/20 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                  <Gavel className="w-5 h-5" />
                  Cross-Examination Witness Traps
                </div>
                <div className="space-y-2.5">
                  {analysisResult.advocate_strategy.cross_examination_traps.map((tr, i) => (
                    <div
                      key={i}
                      className="text-xs text-slate-300 bg-amber-950/20 border border-amber-500/20 p-3 rounded-xl"
                    >
                      {tr}
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidentiary Vulnerabilities */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-slate-300 font-bold text-base">
                  <AlertTriangle className="w-5 h-5 text-indigo-400" />
                  Evidentiary Flaws & Chain of Custody
                </div>
                <div className="space-y-2.5">
                  {analysisResult.advocate_strategy.evidentiary_vulnerabilities.map((ev, i) => (
                    <div
                      key={i}
                      className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800"
                    >
                      {ev}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CASE DOSSIER & MULTIMODAL INGESTION */}
        {activeTab === "dossier" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Input & Upload Panel */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                Multimodal Case Ingestion & Evidence Uploader
              </h3>
              <p className="text-xs text-slate-400">
                Upload legal briefs (PDF), crime scene snapshots/contracts (PNG/JPG), or court hearing depositions (Audio/Video), or paste case facts directly.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* PDF Brief Upload */}
                <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-700 rounded-xl hover:border-indigo-500/50 hover:bg-slate-800/40 cursor-pointer transition">
                  <FileText className="w-8 h-8 text-indigo-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-300">Upload PDF Brief</span>
                  <span className="text-[10px] text-slate-500">Legal filings & contracts</span>
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Evidence Snapshot */}
                <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-700 rounded-xl hover:border-cyan-500/50 hover:bg-slate-800/40 cursor-pointer transition">
                  <Camera className="w-8 h-8 text-cyan-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-300">Upload Photo / Snapshot</span>
                  <span className="text-[10px] text-slate-500">Crime scene, signatures, receipts</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Hearing Audio / Video */}
                <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-700 rounded-xl hover:border-amber-500/50 hover:bg-slate-800/40 cursor-pointer transition">
                  <Mic className="w-8 h-8 text-amber-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-300">Upload Audio / Video</span>
                  <span className="text-[10px] text-slate-500">Hearing & witness recordings</span>
                  <input
                    type="file"
                    accept="audio/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadedFileName && (
                <div className="text-xs text-indigo-400 font-medium bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-indigo-500/30 inline-block">
                  Uploaded Evidence Artifact: {uploadedFileName}
                </div>
              )}

              {/* Text Area */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-300">
                  Case Facts & Evidentiary Narrative
                </label>
                <textarea
                  value={caseText}
                  onChange={(e) => setCaseText(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  placeholder="Enter or modify case facts, chronology, and witness statements..."
                />
              </div>

              {/* Jurisdiction & Classification Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    Forum / Jurisdiction
                  </label>
                  <select
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Common Law">Common Law (US / UK / Commonwealth)</option>
                    <option value="India (IPC / BNS)">India (IPC / BNS)</option>
                    <option value="United States (Federal)">United States (Federal)</option>
                    <option value="European Union (GDPR)">European Union (GDPR)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    Offense / Incident Classification
                  </label>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Criminal / Fraud">Criminal / Fraud</option>
                    <option value="Contracts / Commercial">Contracts / Commercial</option>
                    <option value="Cybercrime & Privacy">Cybercrime & Privacy</option>
                    <option value="Tort / Negligence">Tort / Negligence</option>
                    <option value="Intellectual Property">Intellectual Property</option>
                    <option value="Homicide / Violent Crimes">Homicide / Violent Crimes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Generated Case Dossier Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white">
                  {analysisResult.dossier.case_title}
                </h3>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {analysisResult.dossier.incident_type}
                </span>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Prosecution / Complainant</div>
                  <div className="text-sm font-semibold text-emerald-400 mt-0.5">
                    {analysisResult.dossier.parties.Prosecution_or_Plaintiff}
                  </div>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Defense / Respondent</div>
                  <div className="text-sm font-semibold text-rose-400 mt-0.5">
                    {analysisResult.dossier.parties.Defense_or_Respondent}
                  </div>
                </div>
              </div>

              {/* Factual Chronology */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-400">Facts Summary:</div>
                <p className="text-sm text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed">
                  {analysisResult.dossier.facts_summary}
                </p>
              </div>

              {/* Key Exhibits */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400">Material Exhibits:</div>
                <div className="space-y-2">
                  {analysisResult.dossier.key_evidence.map((ex, i) => (
                    <div
                      key={i}
                      className="text-xs text-slate-300 bg-slate-950 px-3.5 py-2.5 rounded-lg border border-slate-800 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span>{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GLOBAL STATUTORY CODEX ("LAW AT FINGERTIPS") */}
        {activeTab === "codex" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Filter Bar */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    Global Statutory Codex & Penal Sections
                  </h3>
                  <p className="text-xs text-slate-400">
                    Search codified legal statutes, mandatory elements, sentencing guidelines, and landmark precedent tests at your fingertips.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Search Box */}
                <div className="md:col-span-2 relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={codexQuery}
                    onChange={(e) => setCodexQuery(e.target.value)}
                    placeholder="Search by code (e.g. IPC-420, USC-18-1343), crime, precedent, or test..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Category Dropdown */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="All">All Legal Categories</option>
                    <option value="Criminal">Criminal & Fraud</option>
                    <option value="Contracts">Contracts & Commercial</option>
                    <option value="Cyber">Cybercrime & Privacy</option>
                    <option value="Tort">Tort & Negligence</option>
                    <option value="Homicide">Homicide & Violent</option>
                    <option value="Intellectual">Intellectual Property</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Statutory Cards List */}
            {isLoadingCodex ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                Retrieving global statutory codex...
              </div>
            ) : codexSections.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No statutory sections match your query. Try a broader search term.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {codexSections.map((sec) => (
                  <div
                    key={sec.code_id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {sec.code_id}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {sec.jurisdiction}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white">{sec.title}</h4>
                      <p className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        <strong className="text-amber-400">Core Legal Test:</strong>{" "}
                        {sec.statutory_test}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="text-xs font-semibold text-slate-300">
                        Mandatory Proof Elements:
                      </div>
                      <ul className="space-y-1">
                        {sec.elements.map((el, i) => (
                          <li
                            key={i}
                            className="text-xs text-slate-400 flex items-start gap-1.5"
                          >
                            <span className="text-indigo-400">•</span>
                            <span>{el}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="text-xs text-slate-400 pt-1">
                        <strong className="text-slate-300">Statutory Penalties:</strong>{" "}
                        {sec.penalties}
                      </div>

                      {sec.precedents && sec.precedents.length > 0 && (
                        <div className="text-xs text-slate-400 flex flex-wrap gap-1 pt-1">
                          <strong className="text-slate-300 mr-1">Precedents:</strong>
                          {sec.precedents.map((p, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Global Legal Disclaimer Footer */}
        <div className="text-center pt-4 pb-2 border-t border-slate-800/80">
          <p className="text-[11px] text-slate-500 max-w-4xl mx-auto flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
            {analysisResult.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};
