import { TranslationDictionary } from "../types";

export const fr: TranslationDictionary = {
  // Brand & Header
  appTitle: "ClausaFractalAI",
  subtitle: "Plateforme Autonome d'Intelligence et d'Action sur les Documents Juridiques",
  zeroHallucinationBadge: "Ancrage Zéro Hallucination Actif",
  citationBadge: "Citation Vérifiée",
  zeroKeyBadge: "Vertex AI ADC Zéro-Clé",
  exclusiveBadge: "Exclusivité PromptWars",

  // Navigation
  navStudio: "Espace Studio",
  navCourtroom: "Chambre Judiciaire & Codex",
  navMesh: "Maillage Neuro-Symbolique",
  navAnalytics: "Analytique & Télémétrie",
  navFaq: "FAQ IA Juridique",
  navAbout: "Architecture Agentique",
  navGovernance: "Gouvernance & VPC-SC",

  // Theme & Roles
  themeDark: "Mode Sombre",
  themeLight: "Mode Clair",
  roleCounsel: "Directeur Juridique",
  roleArbitrator: "Arbitre Principal",
  roleAuditor: "Auditeur des Risques",
  roleFounder: "Fondateur de Startup",

  // Studio Workspace
  uploadPrompt: "Glissez-déposez le PDF juridique ou la photo de contrat ici",
  uploadButton: "Télécharger le Contrat",
  activeDoc: "Document Actif",
  tabChat: "Chat Vérifiable",
  tabBlindspots: "Matrice d'Angles Morts",
  tabPolicyCollider: "Collisionneur de Politiques",
  tabAttorneyPrep: "Fiche de Préparation d'Avocat",
  tabCounterClauses: "Réécriveur de Clauses",
  tabCourtroom: "Chambre & Codex",
  sliderLabel: "Profondeur d'Explication",
  eli5: "Vulgarisé (Simple)",
  standard: "Standard",
  counsel: "Avocat Conseil",
  paranoid: "Risque Paranoïaque",
  askPlaceholder: "Posez une question sur ce contrat...",
  voiceButtonAria: "Dicter une question juridique au microphone",
  sendButton: "Analyser",
  attorneyExportButton: "Exporter la Fiche",

  // Document Viewer
  docViewerTitle: "Visionneuse de Documents",
  docViewerSubtitle: "Étape d'ingestion de PDF et de contrats de niveau entreprise",
  pageOf: "Page {current} sur {total}",
  zoomIn: "Zoomer",
  zoomOut: "Dézoomer",
  dropFile: "Déposez le contrat PDF ici, ou",
  browseFile: "Parcourir les fichiers",
  uploadVoiceNote: "Télécharger un mémo audio / vocal",
  citationHighlightTitle: "Mise en valeur interactive des citations",
  citationHighlightDesc: "Cliquer sur une citation juridique dans le studio surligne instantanément l'extrait source.",

  // Chat Interface
  reasoningDepth: "Profondeur de Raisonnement",
  verifiedCitations: "Citations Ancrées",
  suggestedPrompts: "Questions Juridiques Suggérées",
  promptLiability: "Quel est le plafond global de limitation de responsabilité ?",
  promptIndemnity: "Existe-t-il des clauses d'indemnisation unilatérales ?",
  promptNonCompete: "Cet accord contient-il des restrictions de non-concurrence ?",

  // Blindspot Matrix
  blindspotTitle: "Matrice des Risques et Angles Morts",
  auditButton: "Auditer le Document",
  auditingButton: "Audit en cours...",
  baselineCompliance: "Score de Conformité de Base :",
  criticalOmissions: "omissions critiques",
  colOmittedClause: "Sujet de Clause Omise",
  colSeverity: "Gravité",
  colRiskImpact: "Impact du Risque",
  colSuggestedLanguage: "Formulation Manquante Suggérée",
  noOmissionsDetected: "Aucune omission critique détectée par rapport au modèle standard.",

  // Policy Collider
  colliderTitle: "Collisionneur & Comparateur de Politiques",
  colliderSubtitle: "Comparez la politique de référence avec les révisions de la contrepartie",
  compareButton: "Entrer en Collision",
  comparingButton: "Comparaison...",
  rightsSurrendered: "DROITS CÉDÉS",
  liabilityEscalated: "RESPONSABILITÉ ACCRUE",
  benefitGained: "BÉNÉFICE OBTENU",
  neutralShift: "CHANGEMENT NEUTRE",
  colTopic: "Sujet",
  colPreviousTerms: "Conditions Précédentes",
  colProposedTerms: "Conditions Proposées",
  colStrategicImpact: "Impact Stratégique",

  // Attorney Prep
  prepSheetTitle: "Fiche de Consultation Juridique",
  generatePrepButton: "Générer la Fiche",
  generatingPrepButton: "Génération...",
  exportPrepButton: "Exporter la Fiche",
  executiveSummaryTitle: "Synthèse Exécutive",
  criticalRedFlagsTitle: "Signaux d'Alarme Critiques (Red Flags)",
  questionsForCounselTitle: "Questions pour l'Avocat",
  negotiationLeverageTitle: "Leviers de Négociation",
  hourlySavingsNotice: "Économie estimée à 2,5 heures d'honoraires de préparation juridique.",

  // Counter Clause
  counterClauseTitle: "Réécriveur de Contre-Clauses de Négociation",
  clauseDomainLabel: "Domaine de la Clause :",
  originalClauseLabel: "Clause Oppressive d'Origine :",
  rewriteButton: "Rédiger une Contre-Clause Équilibrée",
  rewritingButton: "Rédaction en cours...",
  proposedCounterTitle: "Proposition de Contre-Clause Équilibrée",
  strategicRationaleTitle: "Justification Stratégique",
  negotiationTacticTitle: "Tactique de Négociation",

  // Courtroom & Judicial Codex
  courtroomTitle: "Chambre Judiciaire & Codex Statutaire",
  tabBench: "Le Tribunal (Verdict)",
  tabAdvocate: "QG de l'Avocat Principal",
  tabDossier: "Dossier de l'Affaire & Preuves",
  tabCodex: "Codex Statutaire (Le Droit à Portée de Main)",
  btnAnalyzeCase: "Disséquer l'Affaire & Délibérer",
  btnAnalyzingCase: "Délibération du verdict...",
  judicialVerdictTitle: "Verdict & Jugements de Haute Cour",
  ratioDecidendiTitle: "Ratio Decidendi (Principe Juridique Contraignant)",
  obiterDictaTitle: "Obiter Dicta (Observations Judiciaires)",
  advocateStrategyTitle: "Stratégie d'Avocat de Procès (BA LLB, LLM)",
  winProbabilityTitle: "Calcul de Probabilité du Procès",
  prosecutionStrengthsTitle: "Forces de l'Accusation / du Demandeur",
  defenseShieldsTitle: "Boucliers & Atténuations de la Défense",
  crossExamTrapsTitle: "Pièges de Contre-Interrogatoire des Témoins",
  gcsDemoDataTitle: "Catalogue Média Démo Google Cloud Storage (GCS)",
  codexSearchPlaceholder: "Rechercher des lois et articles dans toutes les juridictions...",
  codexCategoryAll: "Toutes Juridictions & Catégories",

  // Neuro-Symbolic Mesh
  meshTitle: "Maillage d'Agents Neuro-Symbolique à Double Passe",
  meshSubtitle: "Système 1 Perception Neurale (Gemini 3.8) + Système 2 Vérification Formelle (Solveur Z3)",
  clauseToVerifyLabel: "Clause Contractuelle à Vérifier Formellement :",
  btnVerifyZ3: "Exécuter la Vérification Formelle",
  btnVerifyingZ3: "Démonstration des Invariants...",
  satReadyBadge: "Solveur Z3 : SAT Prêt",
  watchdogBadge: "Watchdog : ≤5 Sauts",

  // Analytics & BigQuery View
  analyticsTitle: "Télémétrie Juridique d'Entreprise BigQuery",
  analyticsSubtitle: "Efficacité des coûts de jetons en temps réel, latence et risques de clauses",
  totalCachedTokens: "Jetons Mis en Cache de Contexte",
  costSavedUsd: "Coût d'Inférence Évité",
  avgLatency: "Latence Moyenne de Traitement",
  hallucinationRate: "Taux d'Hallucination Mesuré",
  clauseRiskDistribution: "Distribution des Risques Audités",

  // FAQ View
  faqTitle: "Foire Aux Questions",
  faqSubtitle: "Réponses approfondies sur l'orchestration multi-agents et la garantie zéro hallucination",
  searchFaqPlaceholder: "Rechercher dans la FAQ sur ReAct, VPC-SC, BigQuery, 0% Hallucination...",

  // About View
  aboutTitle: "Architecture Système Agentique & 5 Articles Fondateurs",
  aboutSubtitle: "Conçue selon les paradigmes ReAct, Toolformer, Generative Agents, Reflexion et AutoGen",
  tabPapers: "5 Articles de Recherche",
  tabGraph: "Graphe de Connaissances 40M-Docs",
  tabLeaders: "IA Agentique pour les Dirigeants",

  // Governance & VPC-SC View
  governanceTitle: "Sécurité Zéro-Trust & Gouvernance Google Cloud",
  governanceSubtitle: "Périmètres VPC Service Controls, RBAC Firebase Auth et pistes d'audit immuables",
  vpcStatus: "Statut VPC Service Controls",
  auditTrail: "Journal d'Audit de Conformité Immuable",
};
