import { TranslationDictionary } from "../types";

export const sv: TranslationDictionary = {
  // Brand & Header
  appTitle: "ClausaFractalAI",
  subtitle: "Autonom plattform för juridisk dokumentintelligens och åtgärder",
  zeroHallucinationBadge: "Nollhallucinations-verifiering Aktiv",
  citationBadge: "Citat Verifierat",
  zeroKeyBadge: "Vertex AI ADC Noll-Nyckel",
  exclusiveBadge: "PromptWars Exklusiv",

  // Navigation
  navStudio: "Studioarbetsyta",
  navCourtroom: "Domstolskammare & Lagbok",
  navMesh: "Neuro-symboliskt Nätverk",
  navAnalytics: "Analys & Telemetri",
  navFaq: "Juridisk AI FAQ",
  navAbout: "Agentarkitektur",
  navGovernance: "Styrning & VPC-SC",

  // Theme & Roles
  themeDark: "Mörkt Läge",
  themeLight: "Ljust Läge",
  roleCounsel: "Chefsjurist",
  roleArbitrator: "Huvudskiljedomare",
  roleAuditor: "Riskauditör",
  roleFounder: "Startup-grundare",

  // Studio Workspace
  uploadPrompt: "Dra och släpp juridisk PDF eller avtalsfoto här",
  uploadButton: "Ladda Upp Avtal",
  activeDoc: "Aktivt Dokument",
  tabChat: "Verifierbar Chatt",
  tabBlindspots: "Blindfläcks- & Riskmatris",
  tabPolicyCollider: "Policy-kolliderare",
  tabAttorneyPrep: "Förberedelseblad för Jurist",
  tabCounterClauses: "Klausul-omskrivare",
  tabCourtroom: "Domstol & Lagbok",
  sliderLabel: "Förklaringsdjup",
  eli5: "Förenklad (ELI5)",
  standard: "Standard",
  counsel: "Juridiskt",
  paranoid: "Paranoid Riskkontroll",
  askPlaceholder: "Ställ en fråga om detta avtal...",
  voiceButtonAria: "Diktera juridisk fråga med mikrofon",
  sendButton: "Analysera",
  attorneyExportButton: "Exportera Förberedelseblad",

  // Document Viewer
  docViewerTitle: "Dokumentvisare",
  docViewerSubtitle: "Hanteringssteg för PDF och avtal i företagsklass",
  pageOf: "Sida {current} av {total}",
  zoomIn: "Zooma In",
  zoomOut: "Zooma Ut",
  dropFile: "Släpp PDF-avtal här, eller",
  browseFile: "Bläddra Filer",
  uploadVoiceNote: "Ladda Upp Ljud- / Röstmemo",
  citationHighlightTitle: "Interaktiv Citatmarkering",
  citationHighlightDesc: "Genom att klicka på ett juridiskt citat i studion markeras källtexten omedelbart.",

  // Chat Interface
  reasoningDepth: "Resonemangsdjup",
  verifiedCitations: "Verifierade Källhänvisningar",
  suggestedPrompts: "Föreslagna juridiska frågor",
  promptLiability: "Vad är det sammanlagda ansvarsbeloppet?",
  promptIndemnity: "Finns det ensidiga skadeslöshetsklausuler?",
  promptNonCompete: "Innehåller detta avtal konkurrensbegränsningar?",

  // Blindspot Matrix
  blindspotTitle: "Blindfläcks- & Riskmatris",
  auditButton: "Granska Dokument",
  auditingButton: "Granskar dokument...",
  baselineCompliance: "Efterlevnadspoäng:",
  criticalOmissions: "kritiska utelämnanden",
  colOmittedClause: "Uteblivet Klausulämne",
  colSeverity: "Allvarlighetsgrad",
  colRiskImpact: "Riskpåverkan",
  colSuggestedLanguage: "Föreslagen Klausultext",
  noOmissionsDetected: "Inga kritiska utelämnanden upptäcktes mot standardmallen.",

  // Policy Collider
  colliderTitle: "Policy-kolliderare & Avtalsjämförare",
  colliderSubtitle: "Jämför standardpolicy med motpartens revideringar",
  compareButton: "Kollidera Versioner",
  comparingButton: "Jämför...",
  rightsSurrendered: "AVSTÅDDA RÄTTIGHETER",
  liabilityEscalated: "ÖKAT ANSVAR",
  benefitGained: "UPPNÅDD FÖRDEL",
  neutralShift: "NEUTRAL ÄNDRING",
  colTopic: "Ämne",
  colPreviousTerms: "Tidigare Villkor",
  colProposedTerms: "Föreslagna Villkor",
  colStrategicImpact: "Strategisk Påverkan",

  // Attorney Prep
  prepSheetTitle: "Förberedelseblad för Juristkonsultation",
  generatePrepButton: "Generera Förberedelseblad",
  generatingPrepButton: "Genererar...",
  exportPrepButton: "Exportera Förberedelseblad",
  executiveSummaryTitle: "Sammanfattning för Ledningen",
  criticalRedFlagsTitle: "Kritiska Varningsflaggor (Red Flags)",
  questionsForCounselTitle: "Frågor till Juridiskt Ombud",
  negotiationLeverageTitle: "Förhandlingsstyrkor",
  hourlySavingsNotice: "Uppskattningsvis 2,5 timmars debiterbar förberedelsetid sparad.",

  // Counter Clause
  counterClauseTitle: "Omskrivare för Motklausuler i Förhandlingar",
  clauseDomainLabel: "Klausulområde:",
  originalClauseLabel: "Ursprunglig betungande klausul:",
  rewriteButton: "Utforma Balanserad Motklausul",
  rewritingButton: "Utformar motklausul...",
  proposedCounterTitle: "Föreslagen Balanserad Motklausul",
  strategicRationaleTitle: "Strategisk Motivering",
  negotiationTacticTitle: "Förhandlingstaktik",

  // Courtroom & Judicial Codex
  courtroomTitle: "Domstolskammare & Författningssamling",
  tabBench: "Domarbänken (Domslut)",
  tabAdvocate: "Ledande Advokats Ledningscentral",
  tabDossier: "Målakt & Bevisning",
  tabCodex: "Författningssamling (Lagen i Fickan)",
  btnAnalyzeCase: "Analysera Mål & Överlägg",
  btnAnalyzingCase: "Överlägger domslut...",
  judicialVerdictTitle: "Hovrättens Domslut & Dekret",
  ratioDecidendiTitle: "Ratio Decidendi (Bindande Rättsprincip)",
  obiterDictaTitle: "Obiter Dicta (Domstolens Yrkanden)",
  advocateStrategyTitle: "Erfaren Rättegångsadvokats Strategi (BA LLB, LLM)",
  winProbabilityTitle: "Processuell Sannolikhetskalkyl",
  prosecutionStrengthsTitle: "Åklagarens / Kärandens Styrkor",
  defenseShieldsTitle: "Försvarets Skydd & Förmildrande Omständigheter",
  crossExamTrapsTitle: "Korsförhörsfällor för Vittnen",
  gcsDemoDataTitle: "Google Cloud Storage (GCS) Beviskatalog",
  codexSearchPlaceholder: "Sök lagar och paragrafer i alla jurisdiktioner...",
  codexCategoryAll: "Alla Jurisdiktioner & Kategorier",

  // Neuro-Symbolic Mesh
  meshTitle: "Tvåstegs Neuro-Symboliskt Agentnätverk",
  meshSubtitle: "System 1 Neural Perception (Gemini 3.8) + System 2 Formell Matematisk Verifiering (Z3-lösare)",
  clauseToVerifyLabel: "Avtalsklausul att Verifiera Formellt:",
  btnVerifyZ3: "Kör Formell Verifiering",
  btnVerifyingZ3: "Bevisar Invarianter...",
  satReadyBadge: "Z3 Teoremlösare: SAT Redo",
  watchdogBadge: "Vakthund: ≤5 Hopp",

  // Analytics & BigQuery View
  analyticsTitle: "BigQuery Företagsjuridisk Telemetri",
  analyticsSubtitle: "Realtids-tokenskostnadseffektivitet, svarstider och klausulrisker",
  totalCachedTokens: "Kontext-cachade Tokens",
  costSavedUsd: "Undviken Inferenskostnad",
  avgLatency: "Genomsnittlig Svarstid",
  hallucinationRate: "Uppmätt Hallucinationsfrekvens",
  clauseRiskDistribution: "Fördelning av Granskade Risker",

  // FAQ View
  faqTitle: "Vanliga Frågor",
  faqSubtitle: "Fördjupade svar om multi-agentorkestrering och noll-hallucinationsgaranti",
  searchFaqPlaceholder: "Sök i FAQ om ReAct, VPC-SC, BigQuery, 0% Hallucination...",

  // About View
  aboutTitle: "Agentisk Systemarkitektur & 5 Grundläggande Forskningsartiklar",
  aboutSubtitle: "Byggd på paradigmen ReAct, Toolformer, Generative Agents, Reflexion och AutoGen",
  tabPapers: "5 Forskningsartiklar",
  tabGraph: "40M-Dokuments Kunskapsgraf",
  tabLeaders: "Agentisk AI för Ledare",

  // Governance & VPC-SC View
  governanceTitle: "Nollförtroendesäkerhet & Google Cloud-styrning",
  governanceSubtitle: "VPC Service Controls-skyddszoner, Firebase Auth RBAC och oföränderliga revisionsloggar",
  vpcStatus: "VPC Service Controls Status",
  auditTrail: "Oföränderlig Revisionslogg",
};
