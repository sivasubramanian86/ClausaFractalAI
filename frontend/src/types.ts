/**
 * Core type definitions for ClausaFractalAI frontend studio.
 */

export type ComplexityLevel = "eli5" | "standard" | "counsel" | "paranoid";

export type LanguageCode =
  | "en"
  | "fr"
  | "ja"
  | "ko"
  | "es"
  | "de"
  | "it"
  | "zh"
  | "zh-HK"
  | "ar"
  | "pt"
  | "ru"
  | "sv"
  | "tr"
  | "ta"
  | "hi"
  | "te"
  | "ml"
  | "kn"
  | "bn"
  | "mr"
  | "pa";

export interface Citation {
  clause: string;
  page: number;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  content: string;
  timestamp: string;
  complexity?: ComplexityLevel;
  citations?: Citation[];
  isStreaming?: boolean;
}

export interface DocumentMetadata {
  documentId: string;
  filename: string;
  totalPages: number;
  extractedClausesCount: number;
  uploadedAt: string;
  fileSizeFormatted: string;
}

export interface BlindspotItem {
  id: string;
  clauseTitle: string;
  severity: "critical" | "warning" | "recommended";
  description: string;
  practicalRisk: string;
  suggestedAction: string;
}

export interface PracticalImpactItem {
  id: string;
  topic: string;
  previousTerm: string;
  newTerm: string;
  impactType: "rights_surrendered" | "liability_increase" | "benefit_gained" | "neutral";
  plainEnglishSummary: string;
}

export interface AttorneyQuestionItem {
  id: string;
  topic: string;
  questionForCounsel: string;
  riskSeverity: "high" | "medium" | "low";
  referencedClause: string;
}

export interface CounterClauseItem {
  id: string;
  clauseName: string;
  originalClause: string;
  suggestedCounterClause: string;
  strategicRationale: string;
}

export interface StatutorySection {
  code_id: string;
  title: string;
  jurisdiction: string;
  category: string;
  elements: string[];
  penalties: string;
  precedents: string[];
  statutory_test: string;
}

export interface StatutoryElementProof {
  element: string;
  is_satisfied: boolean;
  evidentiary_basis: string;
}

export interface CaseDossier {
  case_title: string;
  incident_type: string;
  parties: Record<string, string>;
  facts_summary: string;
  key_evidence: string[];
  jurisdiction: string;
}

export interface JudicialVerdict {
  case_title: string;
  bench: string;
  ratio_decidendi: string;
  obiter_dicta: string;
  element_proofs: StatutoryElementProof[];
  final_decree: string;
  relief_or_sentence: string;
  statutory_compliance_score: number;
}

export interface AdvocateStrategy {
  counsel_role: string;
  prosecution_strengths: string[];
  defense_shields: string[];
  cross_examination_traps: string[];
  evidentiary_vulnerabilities: string[];
  settlement_or_plea_calculus: string;
  win_probability_prosecution: number;
  win_probability_defense: number;
}

export interface CourtroomAnalysisResult {
  dossier: CaseDossier;
  verdict: JudicialVerdict;
  advocate_strategy: AdvocateStrategy;
  matched_sections: StatutorySection[];
  disclaimer: string;
}

