import { TranslationDictionary } from "../types";

export const de: TranslationDictionary = {
  // Brand & Header
  appTitle: "ClausaFractalAI",
  subtitle: "Autonome Plattform für juristische Dokumentenanalyse & Maßnahmen",
  zeroHallucinationBadge: "Null-Halluzinations-Prüfung Aktiv",
  citationBadge: "Zitat Verifiziert",
  zeroKeyBadge: "Vertex AI ADC Zero-Key",
  exclusiveBadge: "PromptWars Exklusiv",

  // Navigation
  navStudio: "Studio-Arbeitsbereich",
  navCourtroom: "Gerichtskammer & Kodex",
  navMesh: "Neuro-Symbolisches Netz",
  navAnalytics: "Analytik & Telemetrie",
  navFaq: "Rechts-KI FAQ",
  navAbout: "Agenten-Architektur",
  navGovernance: "Governance & VPC-SC",

  // Theme & Roles
  themeDark: "Dunkelmodus",
  themeLight: "Hellmodus",
  roleCounsel: "General Counsel",
  roleArbitrator: "Vorsitzender Schiedsrichter",
  roleAuditor: "Risikoprüfer",
  roleFounder: "Startup-Gründer",

  // Studio Workspace
  uploadPrompt: "Rechtliche PDF- oder Vertragsscans hierher ziehen",
  uploadButton: "Vertrag Hochladen",
  activeDoc: "Aktives Dokument",
  tabChat: "Verifizierbarer Chat",
  tabBlindspots: "Schwachstellen-Matrix",
  tabPolicyCollider: "Richtlinien-Kollidierer",
  tabAttorneyPrep: "Anwalts-Vorbereitungsbogen",
  tabCounterClauses: "Klausel-Umschreiber",
  tabCourtroom: "Gericht & Kodex",
  sliderLabel: "Erklärungstiefe",
  eli5: "ELI5 (Einfach)",
  standard: "Standard",
  counsel: "Anwaltlich",
  paranoid: "Paranoider Risiko-Check",
  askPlaceholder: "Stellen Sie eine Frage zu diesem Vertrag...",
  voiceButtonAria: "Juristische Frage per Mikrofon diktieren",
  sendButton: "Analysieren",
  attorneyExportButton: "Vorbereitungsbogen Exportieren",

  // Document Viewer
  docViewerTitle: "Dokumenten-Betrachter",
  docViewerSubtitle: "PDF- und Vertrags-Erfassungsstufe auf Enterprise-Niveau",
  pageOf: "Seite {current} von {total}",
  zoomIn: "Vergrößern",
  zoomOut: "Verkleinern",
  dropFile: "PDF-Vertrag hier ablegen, oder",
  browseFile: "Datei auswählen",
  uploadVoiceNote: "Audio- / Sprachnotiz hochladen",
  citationHighlightTitle: "Interaktive Zitat-Hervorhebung",
  citationHighlightDesc: "Durch Klicken auf ein Zitat im Studio wird die Quellpassage sofort hervorgehoben.",

  // Chat Interface
  reasoningDepth: "Argumentationstiefe",
  verifiedCitations: "Fundierte Zitate",
  suggestedPrompts: "Vorgeschlagene juristische Fragen",
  promptLiability: "Wie hoch ist die Haftungsobergrenze?",
  promptIndemnity: "Gibt es einseitige Freistellungsklauseln?",
  promptNonCompete: "Enthält diese Vereinbarung Wettbewerbsverbote?",

  // Blindspot Matrix
  blindspotTitle: "Schwachstellen- & Risikomatrix",
  auditButton: "Dokument Prüfen",
  auditingButton: "Dokument wird geprüft...",
  baselineCompliance: "Basis-Compliance-Wert:",
  criticalOmissions: "Kritische Auslassungen",
  colOmittedClause: "Fehlendes Klauselthema",
  colSeverity: "Schweregrad",
  colRiskImpact: "Risikoauswirkung",
  colSuggestedLanguage: "Vorgeschlagene Formulierung",
  noOmissionsDetected: "Keine kritischen Auslassungen im Vergleich zum Standard erkannt.",

  // Policy Collider
  colliderTitle: "Richtlinien-Kollisions- & Diff-Prüfer",
  colliderSubtitle: "Vergleichen Sie Basisrichtlinien mit Gegenangeboten oder Revisionen",
  compareButton: "Versionen Kollidieren",
  comparingButton: "Vergleiche...",
  rightsSurrendered: "AUFGEGEBENE RECHTE",
  liabilityEscalated: "ERHÖHTE HAFTUNG",
  benefitGained: "ERZIELTER VORTEIL",
  neutralShift: "NEUTRALE ÄNDERUNG",
  colTopic: "Thema",
  colPreviousTerms: "Vorherige Bedingungen",
  colProposedTerms: "Vorgeschlagene Bedingungen",
  colStrategicImpact: "Strategische Auswirkung",

  // Attorney Prep
  prepSheetTitle: "Anwalts-Vorbereitungsbogen",
  generatePrepButton: "Bogen Generieren",
  generatingPrepButton: "Generiere...",
  exportPrepButton: "Vorbereitungsbogen Exportieren",
  executiveSummaryTitle: "Management-Zusammenfassung",
  criticalRedFlagsTitle: "Kritische Warnsignale (Red Flags)",
  questionsForCounselTitle: "Fragen an den Rechtsbeistand",
  negotiationLeverageTitle: "Verhandlungshebel",
  hourlySavingsNotice: "Geschätzte 2,5 Stunden anwaltliche Vorbereitungszeit eingespart.",

  // Counter Clause
  counterClauseTitle: "Gegenklausel-Verhandlungs-Umschreiber",
  clauseDomainLabel: "Klauselbereich:",
  originalClauseLabel: "Ursprüngliche drückende Klausel:",
  rewriteButton: "Ausgewogene Gegenklausel Entwerfen",
  rewritingButton: "Entwerfe Gegenklausel...",
  proposedCounterTitle: "Vorgeschlagene ausgewogene Gegenklausel",
  strategicRationaleTitle: "Strategische Begründung",
  negotiationTacticTitle: "Verhandlungstaktik",

  // Courtroom & Judicial Codex
  courtroomTitle: "Gerichtskammer & Gesetzlicher Kodex",
  tabBench: "Richterbank (Urteil)",
  tabAdvocate: "Senior Advocate Lagezentrum",
  tabDossier: "Fallakte & Beweisaufnahme",
  tabCodex: "Gesetzlicher Kodex (Gesetze griffbereit)",
  btnAnalyzeCase: "Fall Zergliedern & Beraten",
  btnAnalyzingCase: "Urteil wird beraten...",
  judicialVerdictTitle: "Gerichtsurteil & Beschlüsse",
  ratioDecidendiTitle: "Ratio Decidendi (Bindender Rechtsgrundsatz)",
  obiterDictaTitle: "Obiter Dicta (Rechtliche Bemerkungen)",
  advocateStrategyTitle: "Senior Trial Advocate Strategie (BA LLB, LLM)",
  winProbabilityTitle: "Prozesswahrscheinlichkeits-Kalkül",
  prosecutionStrengthsTitle: "Stärken der Anklage / des Klägers",
  defenseShieldsTitle: "Schutzschilde & Entlastungen der Verteidigung",
  crossExamTrapsTitle: "Kreuzverhör-Fallen für Zeugen",
  gcsDemoDataTitle: "Google Cloud Storage (GCS) Medienkatalog",
  codexSearchPlaceholder: "Gesetze und Paragrafen in allen Rechtsräumen durchsuchen...",
  codexCategoryAll: "Alle Rechtsräume & Kategorien",

  // Neuro-Symbolic Mesh
  meshTitle: "Dual-Pass Neuro-Symbolisches Agenten-Netz",
  meshSubtitle: "System 1 Neurale Wahrnehmung (Gemini 3.8) + System 2 Formale Verifikation (Z3-Solver)",
  clauseToVerifyLabel: "Formal zu verifizierende Vertragsklausel:",
  btnVerifyZ3: "Formale Verifikation Starten",
  btnVerifyingZ3: "Beweise Invarianten...",
  satReadyBadge: "Z3-Theorem-Beweiser: SAT Bereit",
  watchdogBadge: "Watchdog: ≤5 Hops",

  // Analytics & BigQuery View
  analyticsTitle: "BigQuery Enterprise Rechts-Telemetrie",
  analyticsSubtitle: "Echtzeit-Token-Kosteneffizienz, Latenzmetriken und Klauselrisiken",
  totalCachedTokens: "Zwischengespeicherte Token",
  costSavedUsd: "Vermiedene Inferenzkosten",
  avgLatency: "Durchschnittliche Antwortzeit",
  hallucinationRate: "Gemessene Halluzinationsrate",
  clauseRiskDistribution: "Verteilung der geprüften Risiken",

  // FAQ View
  faqTitle: "Häufig Gestellte Fragen",
  faqSubtitle: "Detaillierte Antworten zu Multi-Agenten-Orchestrierung und 0%-Halluzination",
  searchFaqPlaceholder: "FAQ zu ReAct, VPC-SC, BigQuery, Null-Halluzination durchsuchen...",

  // About View
  aboutTitle: "Agentische Systemarchitektur & 5 Grundlegende Arbeiten",
  aboutSubtitle: "Entwickelt nach ReAct, Toolformer, Generative Agents, Reflexion und AutoGen",
  tabPapers: "5 Forschungsarbeiten",
  tabGraph: "40M-Dokumenten-Wissensgraph",
  tabLeaders: "Agentische KI für Führungskräfte",

  // Governance & VPC-SC View
  governanceTitle: "Zero-Trust-Sicherheit & Google Cloud Governance",
  governanceSubtitle: "VPC Service Controls Sicherheitszonen, Firebase Auth RBAC und Audit-Protokolle",
  vpcStatus: "VPC Service Controls Status",
  auditTrail: "Unveränderliches Compliance-Audit-Protokoll",
};
