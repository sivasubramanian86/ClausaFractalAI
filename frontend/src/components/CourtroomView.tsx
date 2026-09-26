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
  Video,
  Volume2,
  Cloud,
  Database,
  ExternalLink,
  Check,
} from "lucide-react";
import {
  CourtroomAnalysisResult,
  SampleCase,
  StatutorySection,
} from "../types";

export const DEFAULT_SAMPLE_CASES: SampleCase[] = [
  {
    case_id: "residential_lease_deposit",
    title: "Residential Lease Dispute: Elena Rostova (Tenant) v. Apex Property Holdings",
    jurisdiction: "State Civil / Tenant Rights",
    incident_type: "Residential Tenancy & Security Deposit",
    parties: {
      Prosecution_or_Plaintiff: "Elena Rostova (Residential Tenant)",
      Defense_or_Respondent: "Apex Property Holdings LLC (Landlord)",
    },
    facts_summary:
      "Tenant vacated apartment in clean condition after 12-month lease. Landlord improperly withheld $3,200 security deposit citing normal wear-and-tear, failing to provide itemized deductions within the statutory 21-day window under Cal. Civ. Code § 1950.5.",
    statutory_focus: "Cal. Civ. Code § 1950.5 (Security Deposits), Cal. Civ. Code § 1942 (Habitability)",
    media: {
      pdf_url:
        "https://storage.googleapis.com/clausafractalai-demo-assets/contracts/nexus_forensic_crime_scene_investigation_report.pdf",
      image_url:
        "https://storage.googleapis.com/clausafractalai-demo-assets/forensics/land_dispute_cadastral_survey_imagen3.jpg",
      audio_url:
        "https://storage.googleapis.com/clausafractalai-demo-assets/audio/lyria_911_forensic_dispatch_recording.mp3",
      video_url:
        "https://storage.googleapis.com/clausafractalai-demo-assets/video/veo_aerial_drone_topographic_boundary_dispute.mp4",
      gcs_bucket: "clausafractalai-demo-assets",
    },
    is_gcs_hosted: true,
  },
  {
    case_id: "employment_noncompete",
    title: "Employment Agreement Dispute: David Chen (Employee) v. Enterprise Tech",
    jurisdiction: "Labor & Employment",
    incident_type: "Employment Contract & Non-Compete",
    parties: {
      Prosecution_or_Plaintiff: "David Chen (Former Software Engineer)",
      Defense_or_Respondent: "Enterprise Tech Solutions Inc. (Employer)",
    },
    facts_summary:
      "Employer seeks to enforce an overbroad nationwide 24-month non-compete covenant and cancel vested stock options after involuntary reduction in force. Dispute centers on statutory non-compete unenforceability under Cal. Bus. & Prof. Code § 16600 & FTC rules.",
    statutory_focus: "Cal. Bus. & Prof. Code § 16600, FTC 16 C.F.R. Part 910 (Non-Compete Rule)",
    media: {
      pdf_url:
        "https://storage.googleapis.com/clausafractalai-demo-assets/contracts/ransom_demand_and_incident_report.pdf",
      image_url:
        "https://storage.googleapis.com/clausafractalai-demo-assets/forensics/crime_scene_forensic_evidence_imagen3.jpg",
      audio_url:
        "https://storage.googleapis.com/clausafractalai-demo-assets/audio/lyria_wiretapped_ransom_call_threat_actor.mp3",
      video_url:
        "https://storage.googleapis.com/clausafractalai-demo-assets/video/veo_crime_scene_forensic_cctv_deposition.mp4",
      gcs_bucket: "clausafractalai-demo-assets",
    },
    is_gcs_hosted: true,
  },
  {
    case_id: "freelance_msa_ip_dispute",
    title: "Freelance Services Dispute: Alex Morgan (Freelancer) v. Apex Digital Agency",
    jurisdiction: "Commercial & Freelancer Rights",
    incident_type: "Independent Contractor & IP Transfer",
    parties: {
      Prosecution_or_Plaintiff: "Alex Morgan (Independent Designer)",
      Defense_or_Respondent: "Apex Digital Agency Corp (Client)",
    },
    facts_summary:
      "Client claimed total ownership of design deliverables while withholding $8,500 milestone payment. Contract clause attempts unilateral IP transfer prior to payment and imposes unlimited unilateral indemnification on the independent contractor.",
    statutory_focus: "Freelance Isn't Free Act (FIFA), UCC § 2-302 (Unconscionability)",
    media: {
      pdf_url:
        "https://storage.googleapis.com/clausafractalai-demo-assets/contracts/cadastral_land_deed_and_khasra_injunction_petition.pdf",
      image_url:
        "https://storage.googleapis.com/clausafractalai-demo-assets/forensics/cyber_forensic_evidence_imagen3.jpg",
      audio_url:
        "https://storage.googleapis.com/clausafractalai-demo-assets/audio/lyria_panchayat_land_surveyor_deposition.mp3",
      video_url:
        "https://storage.googleapis.com/clausafractalai-demo-assets/video/veo_soc_digital_forensics_breach_replay.mp4",
      gcs_bucket: "clausafractalai-demo-assets",
    },
    is_gcs_hosted: true,
  },
  {
    case_id: "small_business_saas_vendor",
    title: "Small Business Terms Dispute: Sunrise Bakery LLC v. POS Cloud SaaS",
    jurisdiction: "Commercial / Small Business",
    incident_type: "SaaS Vendor Terms & Hidden Renewal",
    parties: {
      Prosecution_or_Plaintiff: "Sunrise Artisan Bakery LLC (SMB Retailer)",
      Defense_or_Respondent: "CloudPOS Enterprise Systems Inc. (Vendor)",
    },
    facts_summary:
      "Cloud POS vendor suffered a 48-hour weekend outage causing $42,000 lost revenue. Vendor claims limitation of liability to $100 while enforcing a hidden 3-year auto-renewal clause triggered without advance written notice.",
    statutory_focus: "UCC § 2-719 (Modification of Remedy), FTC Auto-Renewal Negative Option Rule",
    media: {
      pdf_url:
        "https://storage.googleapis.com/clausafractalai-demo-assets/contracts/hypothecation_deed_and_sanction_letter.pdf",
      image_url:
        "https://storage.googleapis.com/clausafractalai-demo-assets/forensics/financial_fraud_audit_forensics_imagen3.jpg",
      audio_url:
        "https://storage.googleapis.com/clausafractalai-demo-assets/audio/lyria_cbi_financial_wiretap_promoter_confession.mp3",
      video_url:
        "https://storage.googleapis.com/clausafractalai-demo-assets/video/veo_shell_company_forensic_audit_inspection.mp4",
      gcs_bucket: "clausafractalai-demo-assets",
    },
    is_gcs_hosted: true,
  },
];

import { TranslationDictionary } from "../i18n/types";
import { getTranslation } from "../i18n";

interface CourtroomViewProps {
  initialCaseText?: string;
  t?: TranslationDictionary;
}

export const CourtroomView: React.FC<CourtroomViewProps> = ({
  initialCaseText = "",
  t: propT,
}) => {
  const t = propT || getTranslation("en");
  const [activeTab, setActiveTab] = useState<
    "dossier" | "bench" | "advocate" | "codex"
  >("bench");
  const [caseText, setCaseText] = useState<string>(
    initialCaseText ||
      `Residential Lease Agreement Dispute: Elena Rostova (Tenant) v. Apex Property Holdings LLC\nLandlord improperly withheld the full $3,200 security deposit following tenancy termination, claiming routine repainting and normal wear. Landlord failed to deliver an itemized deduction statement or return funds within the mandatory 21-day statutory period required by law.`
  );
  const [jurisdiction, setJurisdiction] = useState<string>("Common Law");
  const [incidentType, setIncidentType] = useState<string>("Residential Lease / Tenant Rights");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // GCS Sample Demo Cases
  const [sampleCases, setSampleCases] = useState<SampleCase[]>(DEFAULT_SAMPLE_CASES);
  const [selectedSampleCase, setSelectedSampleCase] = useState<SampleCase | null>(
    DEFAULT_SAMPLE_CASES[0]
  );
  const [selectedMediaPreview, setSelectedMediaPreview] = useState<
    "pdf" | "image" | "audio" | "video"
  >("image");
  const [failedMedia, setFailedMedia] = useState<Record<string, boolean>>({});

  // Codex Search & Filter
  const [codexQuery, setCodexQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [codexSections, setCodexSections] = useState<StatutorySection[]>([]);
  const [isLoadingCodex, setIsLoadingCodex] = useState<boolean>(false);

  // Analysis result state with rich default demo data
  const [analysisResult, setAnalysisResult] = useState<CourtroomAnalysisResult>({
    dossier: {
      case_title: "In re: Tenant v. Apex Property Holdings (Security Deposit & Habitability)",
      incident_type: "Residential Tenancy & Consumer Protection",
      parties: {
        Prosecution_or_Plaintiff: "Elena Rostova (Residential Tenant)",
        Defense_or_Respondent: "Apex Property Holdings LLC (Landlord)",
      },
      facts_summary:
        "Tenant vacated leased premises in clean condition. Landlord failed to provide itemized deductions or refund $3,200 security deposit within 21 statutory days, asserting unilateral forfeiture under Section 14 of the standard residential lease.",
      key_evidence: [
        "Exhibit A: Move-out inspection checklist confirming zero tenant damage",
        "Exhibit B: Certified mail delivery receipt of formal 30-day move-out notice",
        "Exhibit C: Bank statement verifying initial $3,200 security deposit transfer",
      ],
      jurisdiction: "Civil / Tenant Rights",
    },
    verdict: {
      case_title: "In re: Tenant v. Apex Property Holdings (Security Deposit & Habitability)",
      bench: "The Honorable Bench – Housing & Consumer Rights Chamber",
      ratio_decidendi:
        "Statutory provisions protecting residential tenants against bad-faith deposit retention are non-waivable. Contractual clauses granting landlords unilateral discretion to forfeit security deposits for normal wear-and-tear violate statutory public policy.",
      obiter_dicta:
        "Housing providers must adhere to statutory itemization timeframes. Unilateral forfeiture clauses in standard-form residential leases will be strictly construed against the drafter.",
      element_proofs: [
        {
          element: "Timely delivery of statutory itemized deduction statement within 21 days",
          is_satisfied: false,
          evidentiary_basis:
            "Postal records confirm landlord delivered no accounting within the statutory window.",
        },
        {
          element: "Pre-existing condition or ordinary wear-and-tear exclusion",
          is_satisfied: true,
          evidentiary_basis:
            "Move-in and move-out checklists establish apartment condition was maintained in good order.",
        },
        {
          element: "Bad faith retention penalty threshold",
          is_satisfied: true,
          evidentiary_basis:
            "Complete refusal to engage or return undisputed portions of deposit demonstrates bad faith.",
        },
      ],
      final_decree: "Decree in Favor of Tenant: Statutory Return of Deposit plus Statutory Bad-Faith Penalties",
      relief_or_sentence:
        "Full refund of $3,200 security deposit plus statutory damages of twice the deposit amount ($6,400) and reasonable attorney fees.",
      statutory_compliance_score: 9.6,
    },
    advocate_strategy: {
      counsel_role: "Senior Legal Advocate & Tenant Rights Counsel",
      prosecution_strengths: [
        "Strict statutory liability: Failure to itemize within 21 days forfeits right to retain any portion.",
        "Statutory bad-faith damages available up to twice the deposit amount.",
        "Clear documentary audit trail with signed move-in and move-out photo evidence.",
      ],
      defense_shields: [
        "Argue landlord made good-faith effort to inspect within reasonable commercial timeframe.",
        "Assert alleged damage exceeded ordinary wear and tear.",
      ],
      cross_examination_traps: [
        "Trap 1: Confront property manager with date stamp proving itemization was not mailed within 21 days.",
        "Trap 2: Force admission that no contractor repair receipts were attached to the deduction notice.",
        "Trap 3: Impeach maintenance supervisor on pre-existing condition notes from initial walkthrough.",
      ],
      evidentiary_vulnerabilities: [
        "Tenant must ensure move-out photo metadata accurately reflects checkout date.",
        "Ensure forwarding address was provided in writing to landlord.",
      ],
      settlement_or_plea_calculus:
        "Tenant holds 90% legal leverage. Demand immediate return of full $3,200 plus $1,500 statutory settlement to avoid formal small claims or municipal court litigation.",
      win_probability_prosecution: 0.92,
      win_probability_defense: 0.08,
    },
    matched_sections: [
      {
        code_id: "CAL-CIV-1950.5",
        title: "California Security Deposit Statute",
        jurisdiction: "California / State Civil",
        category: "Civil / Tenant Rights",
        elements: [
          "Mandatory 21-day itemized deduction or return deadline",
          "Prohibition against deductions for ordinary wear and tear",
          "Bad faith penalty up to twice the deposit amount",
        ],
        penalties: "Statutory damages up to twice the deposit amount plus actual damages",
        precedents: ["Granberry v. Islay Investments (1995) 9 Cal.4th 738"],
        statutory_test: "Retention without statutory itemization within 21 calendar days constitutes bad faith retention",
        summary:
          "Governs residential security deposits, requiring landlords to provide an itemized statement and return of unused funds within 21 calendar days of vacating.",
      },
    ],
    disclaimer:
      "ClausaFractalAI Legal Assistant: Designed to help tenants, consumers, and SMBs understand contract rights and prepare for discussions. Not a substitute for licensed legal representation.",
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

  // Fetch GCS Sample Cases catalog
  useEffect(() => {
    fetch("/api/judicial/sample-cases")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSampleCases(data);
        }
      })
      .catch(() => {
        // Fall back gracefully to DEFAULT_SAMPLE_CASES
      });
  }, []);

  const handleSelectSampleCase = (sample: SampleCase) => {
    setSelectedSampleCase(sample);
    setCaseText(sample.facts_summary);
    setJurisdiction(sample.jurisdiction);
    setIncidentType(sample.incident_type);
    setUploadedFileName(null);
  };

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
    <div className="courtroom-view flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
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
              {t.courtroomTitle}
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl">
              Impartial Senior Judicial Magistrate & Bar Senior Advocate (BA LLB, LLM) analysis. Dissects multimodal evidence, checks statutory offense elements, drafts judicial rulings, and strategizes trial battlecards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("dossier")}
              className="px-3.5 py-2 rounded-xl text-sm font-medium bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/30 transition flex items-center gap-1.5 shadow-sm"
            >
              <Cloud className="w-4 h-4 text-cyan-400" />
              <span>GCS Demo Data ({sampleCases.length})</span>
            </button>
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
              {isLoading ? t.btnAnalyzingCase : "Deliberate Case"}
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
            {t.tabBench}
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
            <span>{t.tabAdvocate}</span>
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
            <span>{t.tabDossier}</span>
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
            <span>{t.tabCodex}</span>
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
                  {t.ratioDecidendiTitle}:
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
                  {t.obiterDictaTitle}:
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
                    {t.winProbabilityTitle}
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
                  {t.prosecutionStrengthsTitle}
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
                  {t.defenseShieldsTitle}
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
                  {t.crossExamTrapsTitle}
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
            {/* GCS Sample Demo Cases Selector */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white">
                      {t.gcsDemoDataTitle}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Select a ready-to-test case dossier backed by GCS media assets (PDF contracts, forensic snapshots, wiretap audio, deposition video). Git repo size remains 0 MB.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-cyan-500/30 text-[11px] text-cyan-300 font-mono">
                  <Database className="w-3.5 h-3.5" />
                  <span>gs://clausafractalai-demo-assets/</span>
                </div>
              </div>

              {/* Sample Case Selector Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {sampleCases.map((sample) => {
                  const isSelected = selectedSampleCase?.case_id === sample.case_id;
                  return (
                    <button
                      key={sample.case_id}
                      type="button"
                      onClick={() => handleSelectSampleCase(sample)}
                      className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between h-full ${
                        isSelected
                          ? "bg-indigo-950/70 border-indigo-400 ring-2 ring-indigo-500/30 shadow-lg"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                            {sample.incident_type.split("/")[0].trim()}
                          </span>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                              <Check className="w-3 h-3" /> Active
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white line-clamp-2 mb-1">
                          {sample.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {sample.facts_summary}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                        <span>{sample.jurisdiction}</span>
                        <span className="text-indigo-400 font-mono">4 GCS Media</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Multimodal Media Stage (When Selected) */}
              {selectedSampleCase && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-300">
                        Multimodal Evidence Assets:
                      </span>
                      <span className="text-xs text-indigo-400 font-medium">
                        {selectedSampleCase.title}
                      </span>
                    </div>

                    {/* Media Type Switcher Pills */}
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setSelectedMediaPreview("image")}
                        className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                          selectedMediaPreview === "image"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Snapshot</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedMediaPreview("audio")}
                        className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                          selectedMediaPreview === "audio"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Audio</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedMediaPreview("video")}
                        className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                          selectedMediaPreview === "video"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Video</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedMediaPreview("pdf")}
                        className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                          selectedMediaPreview === "pdf"
                            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>PDF Brief</span>
                      </button>
                    </div>
                  </div>

                  {/* Active Media Player/Viewer */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                    {selectedMediaPreview === "image" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-semibold text-slate-200">
                            Forensic Snapshot / Evidentiary Exhibit
                          </span>
                          <span className="font-mono text-[11px] text-cyan-400">
                            {selectedSampleCase.media.image_url.split("/").pop()}
                          </span>
                        </div>
                        <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center max-h-72">
                          {failedMedia[selectedSampleCase.media.image_url] ? (
                            <p className="p-6 text-center text-sm text-amber-300">Image unavailable. Check that this object exists and allows public reads.</p>
                          ) : (
                            <img
                              src={selectedSampleCase.media.image_url}
                              alt="Forensic Evidence Snapshot"
                              onError={() => setFailedMedia((items) => ({ ...items, [selectedSampleCase.media.image_url]: true }))}
                              className="object-contain max-h-72 w-full hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                            />
                          )}
                          <div className="absolute top-2 left-2 bg-slate-950/80 px-2.5 py-1 rounded border border-cyan-500/40 text-[10px] text-cyan-300 font-mono">
                            EXHIBIT SNAPSHOT · GCS CLOUD OBJECT
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedMediaPreview === "audio" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-semibold text-slate-200">
                            Recorded Deposition / Wiretap Audio
                          </span>
                          <span className="font-mono text-[11px] text-amber-400">
                            {selectedSampleCase.media.audio_url.split("/").pop()}
                          </span>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <Volume2 className="w-4 h-4 text-amber-400" />
                            <span>HTML5 Audio Player (Streamed from Google Cloud Storage)</span>
                          </div>
                          <audio
                            controls
                            src={selectedSampleCase.media.audio_url}
                            onError={() => setFailedMedia((items) => ({ ...items, [selectedSampleCase.media.audio_url]: true }))}
                            className="w-full mt-2"
                          />
                          {failedMedia[selectedSampleCase.media.audio_url] && <p className="text-sm text-amber-300">Audio unavailable. Check that this object exists and allows public reads.</p>}
                        </div>
                      </div>
                    )}

                    {selectedMediaPreview === "video" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-semibold text-slate-200">
                            Courtroom Hearing / Deposition Video Excerpt
                          </span>
                          <span className="font-mono text-[11px] text-rose-400">
                            {selectedSampleCase.media.video_url.split("/").pop()}
                          </span>
                        </div>
                        <div className="rounded-lg overflow-hidden border border-slate-700 bg-black flex items-center justify-center">
                          <video
                            controls
                            src={selectedSampleCase.media.video_url}
                            onError={() => setFailedMedia((items) => ({ ...items, [selectedSampleCase.media.video_url]: true }))}
                            className="w-full max-h-64 object-contain"
                          />
                          {failedMedia[selectedSampleCase.media.video_url] && <p className="p-3 text-sm text-amber-300">Video unavailable. Check that this object exists and allows public reads.</p>}
                        </div>
                      </div>
                    )}

                    {selectedMediaPreview === "pdf" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-semibold text-slate-200">
                            Evidentiary Brief / Disputed Contract (PDF)
                          </span>
                          <span className="font-mono text-[11px] text-indigo-400">
                            {selectedSampleCase.media.pdf_url.split("/").pop()}
                          </span>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-white">
                              {selectedSampleCase.media.pdf_url.split("/").pop()}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Direct cloud object stream: {selectedSampleCase.media.pdf_url}
                            </div>
                          </div>
                          <a
                            href={selectedSampleCase.media.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open GCS Object</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Immediate Deliberation Call to Action */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                    <div className="text-xs text-slate-400">
                      Case populated: <span className="text-white font-medium">{selectedSampleCase.title}</span> ({selectedSampleCase.jurisdiction})
                    </div>
                    <button
                      type="button"
                      onClick={handleDissectCase}
                      disabled={isLoading}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md transition flex items-center gap-2 disabled:opacity-50 shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isLoading ? "Deliberating..." : "Deliberate This Case Now"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

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
                    placeholder={t.codexSearchPlaceholder}
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
                    <option value="All">{t.codexCategoryAll}</option>
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
