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
  sliderLabel: string;
  eli5: string;
  standard: string;
  counsel: string;
  paranoid: string;
  askPlaceholder: string;
  voiceButtonAria: string;
  sendButton: string;
  attorneyExportButton: string;

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

  // About View
  aboutTitle: string;
  aboutSubtitle: string;

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
