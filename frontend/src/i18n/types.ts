export interface TranslationDictionary {
  // Brand & Header
  appTitle: string;
  subtitle: string;
  zeroHallucinationBadge: string;
  citationBadge: string;
  zeroKeyBadge: string;
  exclusiveBadge: string;

  // Navigation
  navStudio: string;
  navCourtroom: string;
  navMesh: string;
  navAnalytics: string;
  navFaq: string;
  navAbout: string;
  navGovernance: string;

  // Theme & Roles
  themeDark: string;
  themeLight: string;
  roleCounsel: string;
  roleArbitrator: string;
  roleAuditor: string;
  roleFounder: string;

  // Studio Workspace
  uploadPrompt: string;
  uploadButton: string;
  activeDoc: string;
  tabChat: string;
  tabBlindspots: string;
  tabPolicyCollider: string;
  tabAttorneyPrep: string;
  tabCounterClauses: string;
  tabCourtroom: string;
  sliderLabel: string;
  eli5: string;
  standard: string;
  counsel: string;
  paranoid: string;
  askPlaceholder: string;
  voiceButtonAria: string;
  sendButton: string;
  attorneyExportButton: string;

  // Document Viewer
  docViewerTitle: string;
  docViewerSubtitle: string;
  pageOf: string;
  zoomIn: string;
  zoomOut: string;
  dropFile: string;
  browseFile: string;
  uploadVoiceNote: string;
  citationHighlightTitle: string;
  citationHighlightDesc: string;

  // Chat Interface
  reasoningDepth: string;
  verifiedCitations: string;
  suggestedPrompts: string;
  promptLiability: string;
  promptIndemnity: string;
  promptNonCompete: string;

  // Blindspot Matrix
  blindspotTitle: string;
  auditButton: string;
  auditingButton: string;
  baselineCompliance: string;
  criticalOmissions: string;
  colOmittedClause: string;
  colSeverity: string;
  colRiskImpact: string;
  colSuggestedLanguage: string;
  noOmissionsDetected: string;

  // Policy Collider
  colliderTitle: string;
  colliderSubtitle: string;
  compareButton: string;
  comparingButton: string;
  rightsSurrendered: string;
  liabilityEscalated: string;
  benefitGained: string;
  neutralShift: string;
  colTopic: string;
  colPreviousTerms: string;
  colProposedTerms: string;
  colStrategicImpact: string;

  // Attorney Prep
  prepSheetTitle: string;
  generatePrepButton: string;
  generatingPrepButton: string;
  exportPrepButton: string;
  executiveSummaryTitle: string;
  criticalRedFlagsTitle: string;
  questionsForCounselTitle: string;
  negotiationLeverageTitle: string;
  hourlySavingsNotice: string;

  // Counter Clause
  counterClauseTitle: string;
  clauseDomainLabel: string;
  originalClauseLabel: string;
  rewriteButton: string;
  rewritingButton: string;
  proposedCounterTitle: string;
  strategicRationaleTitle: string;
  negotiationTacticTitle: string;

  // Courtroom & Judicial Codex
  courtroomTitle: string;
  tabBench: string;
  tabAdvocate: string;
  tabDossier: string;
  tabCodex: string;
  btnAnalyzeCase: string;
  btnAnalyzingCase: string;
  judicialVerdictTitle: string;
  ratioDecidendiTitle: string;
  obiterDictaTitle: string;
  advocateStrategyTitle: string;
  winProbabilityTitle: string;
  prosecutionStrengthsTitle: string;
  defenseShieldsTitle: string;
  crossExamTrapsTitle: string;
  gcsDemoDataTitle: string;
  codexSearchPlaceholder: string;
  codexCategoryAll: string;

  // Neuro-Symbolic Mesh
  meshTitle: string;
  meshSubtitle: string;
  clauseToVerifyLabel: string;
  btnVerifyZ3: string;
  btnVerifyingZ3: string;
  satReadyBadge: string;
  watchdogBadge: string;

  // Analytics & BigQuery View
  analyticsTitle: string;
  analyticsSubtitle: string;
  totalCachedTokens: string;
  costSavedUsd: string;
  avgLatency: string;
  hallucinationRate: string;
  clauseRiskDistribution: string;

  // FAQ View
  faqTitle: string;
  faqSubtitle: string;
  searchFaqPlaceholder: string;

  // About View
  aboutTitle: string;
  aboutSubtitle: string;
  tabPapers: string;
  tabGraph: string;
  tabLeaders: string;

  // Governance & VPC-SC View
  governanceTitle: string;
  governanceSubtitle: string;
  vpcStatus: string;
  auditTrail: string;
}

export type LocaleDictionary = Partial<TranslationDictionary> & {
  appTitle: string;
  subtitle: string;
  uploadPrompt: string;
  uploadButton: string;
  activeDoc: string;
  tabChat: string;
  tabBlindspots: string;
  tabPolicyCollider: string;
  tabAttorneyPrep: string;
  tabCounterClauses: string;
  sliderLabel: string;
  eli5: string;
  standard: string;
  counsel: string;
  paranoid: string;
  askPlaceholder: string;
  voiceButtonAria: string;
  sendButton: string;
  zeroHallucinationBadge: string;
  citationBadge: string;
  attorneyExportButton: string;
};

export interface LanguageOption {
  code: string;
  name: string;
  dir?: "ltr" | "rtl";
}
