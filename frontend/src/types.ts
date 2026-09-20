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
