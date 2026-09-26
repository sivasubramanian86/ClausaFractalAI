import { TranslationDictionary } from "../types";

export const en: TranslationDictionary = {
  // Brand & Header
  appTitle: "ClausaFractalAI",
  subtitle: "Autonomous Legal Document Intelligence & Action Platform",
  zeroHallucinationBadge: "Zero Hallucination Grounding Active",
  citationBadge: "Citation Verified",
  zeroKeyBadge: "Vertex AI ADC Zero-Key",
  exclusiveBadge: "PromptWars Exclusive",

  // Navigation
  navStudio: "Studio Workspace",
  navCourtroom: "Judicial Chamber & Codex",
  navMesh: "Neuro-Symbolic Mesh",
  navAnalytics: "Analytics & Telemetry",
  navFaq: "Legal AI FAQ",
  navAbout: "Agentic Architecture",
  navGovernance: "Governance & VPC-SC",

  // Theme & Roles
  themeDark: "Dark Mode",
  themeLight: "Light Mode",
  roleCounsel: "General Counsel",
  roleArbitrator: "Lead Arbitrator",
  roleAuditor: "Risk Auditor",
  roleFounder: "Startup Founder",

  // Studio Workspace
  uploadPrompt: "Drag and drop legal PDF or scanned contract photo here",
  uploadButton: "Upload Contract",
  activeDoc: "Active Document",
  tabChat: "Verifiable Chat",
  tabBlindspots: "Blindspot Matrix",
  tabPolicyCollider: "Policy Collider",
  tabAttorneyPrep: "Attorney Prep Sheet",
  tabCounterClauses: "Clause Rewriter",
  tabCourtroom: "Judicial & Codex",
  sliderLabel: "Explanation Depth",
  eli5: "ELI5 (Simple)",
  standard: "Standard",
  counsel: "Counsel",
  paranoid: "Paranoid Risk",
  askPlaceholder: "Ask about liability, termination, indemnification, or IP...",
  voiceButtonAria: "Dictate legal question with microphone",
  sendButton: "Analyze",
  attorneyExportButton: "Export Prep Sheet",

  // Document Viewer
  docViewerTitle: "Document Viewer",
  docViewerSubtitle: "Enterprise-grade PDF & Contract Ingestion Stage",
  pageOf: "Page {current} of {total}",
  zoomIn: "Zoom In",
  zoomOut: "Zoom Out",
  dropFile: "Drop PDF contract here, or",
  browseFile: "Browse File",
  uploadVoiceNote: "Upload Audio / Voice Note",
  citationHighlightTitle: "Interactive Citation Highlighting",
  citationHighlightDesc: "Clicking on any legal citation in the Q&A studio highlights the source snippet instantly.",

  // Chat Interface
  reasoningDepth: "Reasoning Depth",
  verifiedCitations: "Citation Grounded",
  suggestedPrompts: "Suggested Legal Inquiries",
  promptLiability: "What is the aggregate limitation of liability cap?",
  promptIndemnity: "Are there unilateral indemnification clauses?",
  promptNonCompete: "Does this agreement contain non-compete restrictions?",

  // Blindspot Matrix
  blindspotTitle: "Blindspot Risk Matrix",
  auditButton: "Audit Document",
  auditingButton: "Auditing Document...",
  baselineCompliance: "Baseline Compliance Score:",
  criticalOmissions: "critical omissions",
  colOmittedClause: "Omitted Clause Topic",
  colSeverity: "Severity",
  colRiskImpact: "Risk Impact",
  colSuggestedLanguage: "Suggested Missing Language",
  noOmissionsDetected: "No critical omissions detected against standard baseline.",

  // Policy Collider
  colliderTitle: "Policy Collider: Practical Impact Matrix",
  colliderSubtitle: "Compare baseline policy against counterparty redline or revision",
  compareButton: "Collide Versions",
  comparingButton: "Comparing...",
  rightsSurrendered: "RIGHTS SURRENDERED",
  liabilityEscalated: "LIABILITY ESCALATED",
  benefitGained: "BENEFIT GAINED",
  neutralShift: "NEUTRAL SHIFT",
  colTopic: "Topic",
  colPreviousTerms: "Previous Terms",
  colProposedTerms: "Proposed Terms",
  colStrategicImpact: "Strategic Impact",

  // Attorney Prep
  prepSheetTitle: "Attorney Consultation Prep Sheet",
  generatePrepButton: "Generate Prep Sheet",
  generatingPrepButton: "Generating...",
  exportPrepButton: "Export Prep Sheet",
  executiveSummaryTitle: "Executive Summary",
  criticalRedFlagsTitle: "Critical Red Flags",
  questionsForCounselTitle: "Questions for Legal Counsel",
  negotiationLeverageTitle: "Negotiation Leverage Points",
  hourlySavingsNotice: "Estimated 2.5 hours of billable legal counsel preparation time saved.",

  // Counter Clause
  counterClauseTitle: "Counter-Clause Negotiation Rewriter",
  clauseDomainLabel: "Clause Domain:",
  originalClauseLabel: "Original Oppressive Clause:",
  rewriteButton: "Draft Favorable Counter-Clause",
  rewritingButton: "Drafting Counter-Clause...",
  proposedCounterTitle: "Proposed Balanced Counter-Clause",
  strategicRationaleTitle: "Strategic Rationale",
  negotiationTacticTitle: "Negotiation Tactic",

  // Courtroom & Judicial Codex
  courtroomTitle: "Judicial Chamber & Statutory Codex",
  tabBench: "The Honorable Bench (Verdict)",
  tabAdvocate: "Senior Advocate War Room",
  tabDossier: "Case Dossier & Evidence Ingestion",
  tabCodex: "Statutory Codex (Law at Fingertips)",
  btnAnalyzeCase: "Dissect Case & Deliberate",
  btnAnalyzingCase: "Deliberating Verdict...",
  judicialVerdictTitle: "High Court Judicial Verdict & Decrees",
  ratioDecidendiTitle: "Ratio Decidendi (Binding Legal Principle)",
  obiterDictaTitle: "Obiter Dicta (Judicial Observations)",
  advocateStrategyTitle: "Senior Trial Advocate Strategy (BA LLB, LLM)",
  winProbabilityTitle: "Trial Probability Calculus",
  prosecutionStrengthsTitle: "Prosecution / Claimant Winning Arsenal",
  defenseShieldsTitle: "Defense Counter-Shields & Mitigations",
  crossExamTrapsTitle: "Cross-Examination Witness Traps",
  gcsDemoDataTitle: "Google Cloud Storage (GCS) Sample Media Catalog",
  codexSearchPlaceholder: "Search by code, statute, or legal precedents...",
  codexCategoryAll: "All Jurisdictions & Categories",

  // Neuro-Symbolic Mesh
  meshTitle: "Dual-Pass Neuro-Symbolic Agent Mesh",
  meshSubtitle: "System 1 Neural Perception (Gemini 3.8) + System 2 Formal Mathematical Verification (Z3 Solver)",
  clauseToVerifyLabel: "Contract Clause to Formally Verify:",
  btnVerifyZ3: "Run Formal Verification",
  btnVerifyingZ3: "Proving Invariants...",
  satReadyBadge: "Z3 Theorem Prover: SAT Ready",
  watchdogBadge: "Watchdog: ≤5 Hops",

  // Analytics & BigQuery View
  analyticsTitle: "BigQuery Enterprise Legal Telemetry",
  analyticsSubtitle: "Real-time token cost efficiency, latency metrics, and cross-contract clause risk",
  totalCachedTokens: "Context Cached Tokens",
  costSavedUsd: "Inference Cost Avoided",
  avgLatency: "Average Turnaround Latency",
  hallucinationRate: "Measured Hallucination Rate",
  clauseRiskDistribution: "Audited Risk Frequency Breakdown",

  // FAQ View
  faqTitle: "Frequently Asked Questions",
  faqSubtitle: "Deep-dive answers into multi-agent orchestration, legal grounding, and zero-hallucination guarantees",
  searchFaqPlaceholder: "Search FAQs on ReAct loops, VPC-SC, BigQuery, 0% Hallucination...",

  // About View
  aboutTitle: "Agentic System Architecture & 5 Foundational Papers",
  aboutSubtitle: "Engineered on ReAct, Toolformer, Generative Agents, Reflexion, and AutoGen paradigms",
  tabPapers: "5 Research Papers",
  tabGraph: "40M-Doc Knowledge Graph",
  tabLeaders: "Agentic AI for Leaders",

  // Governance & VPC-SC View
  governanceTitle: "Zero-Trust Security & Google Cloud Governance",
  governanceSubtitle: "VPC Service Controls perimeters, Firebase Auth RBAC, and immutable Firestore audit trails",
  vpcStatus: "VPC Service Controls Status",
  auditTrail: "Immutable Compliance Audit Log",
};
