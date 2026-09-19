import { LanguageCode } from "../types";

export interface TranslationDictionary {
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
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appTitle: "ClausaFractalAI",
    subtitle: "Autonomous Legal Document Intelligence & Action Platform",
    uploadPrompt: "Drag and drop legal PDF or scanned contract photo here",
    uploadButton: "Upload Contract",
    activeDoc: "Active Document",
    tabChat: "Verifiable Chat",
    tabBlindspots: "Blindspot Matrix",
    tabPolicyCollider: "Policy Collider",
    tabAttorneyPrep: "Attorney Prep Sheet",
    tabCounterClauses: "Clause Rewriter",
    sliderLabel: "Explanation Depth",
    eli5: "ELI5 (Simple)",
    standard: "Standard",
    counsel: "Counsel",
    paranoid: "Paranoid Risk",
    askPlaceholder: "Ask a question about this contract...",
    voiceButtonAria: "Dictate legal question with microphone",
    sendButton: "Analyze",
    zeroHallucinationBadge: "Zero Hallucination Grounding Active",
    citationBadge: "Citation Verified",
    attorneyExportButton: "Export Prep Sheet",
  },
  es: {
    appTitle: "ClausaFractalAI",
    subtitle: "Plataforma Autónoma de Inteligencia Documental Legal",
    uploadPrompt: "Arrastre y suelte el PDF legal o foto del contrato aquí",
    uploadButton: "Subir Contrato",
    activeDoc: "Documento Activo",
    tabChat: "Chat Verificable",
    tabBlindspots: "Matriz de Puntos Ciegos",
    tabPolicyCollider: "Colisionador de Políticas",
    tabAttorneyPrep: "Hoja de Consulta Legal",
    tabCounterClauses: "Reescritor de Cláusulas",
    sliderLabel: "Nivel de Explicación",
    eli5: "ELI5 (Simple)",
    standard: "Estándar",
    counsel: "Abogado",
    paranoid: "Riesgo Paranoico",
    askPlaceholder: "Haga una pregunta sobre este contrato...",
    voiceButtonAria: "Dictar pregunta legal con micrófono",
    sendButton: "Analizar",
    zeroHallucinationBadge: "Cero Alucinaciones Activo",
    citationBadge: "Cita Verificada",
    attorneyExportButton: "Exportar Hoja de Consulta",
  },
  fr: {
    appTitle: "ClausaFractalAI",
    subtitle: "Plateforme Autonome d'Intelligence Juridique Documentaire",
    uploadPrompt: "Glissez-déposez le PDF juridique ou la photo du contrat ici",
    uploadButton: "Téléverser le Contrat",
    activeDoc: "Document Actif",
    tabChat: "Chat Vérifiable",
    tabBlindspots: "Matrice des Angles Morts",
    tabPolicyCollider: "Collisionneur de Politiques",
    tabAttorneyPrep: "Fiche de Préparation Avocat",
    tabCounterClauses: "Réécrivain de Clauses",
    sliderLabel: "Niveau d'Explication",
    eli5: "ELI5 (Simple)",
    standard: "Standard",
    counsel: "Conseil",
    paranoid: "Risque Paranoïaque",
    askPlaceholder: "Posez une question sur ce contrat...",
    voiceButtonAria: "Dicter une question juridique au microphone",
    sendButton: "Analyser",
    zeroHallucinationBadge: "Zéro Hallucination Actif",
    citationBadge: "Citation Vérifiée",
    attorneyExportButton: "Exporter la Fiche",
  },
  de: {
    appTitle: "ClausaFractalAI",
    subtitle: "Autonome Plattform für juristische Dokumentenanalyse",
    uploadPrompt: "Rechtliche PDF- oder Vertragsscans hierher ziehen",
    uploadButton: "Vertrag Hochladen",
    activeDoc: "Aktives Dokument",
    tabChat: "Verifizierbarer Chat",
    tabBlindspots: "Schwachstellen-Matrix",
    tabPolicyCollider: "Richtlinien-Kollidierer",
    tabAttorneyPrep: "Anwalts-Vorbereitungsbogen",
    tabCounterClauses: "Klausel-Umschreiber",
    sliderLabel: "Erklärungstiefe",
    eli5: "ELI5 (Einfach)",
    standard: "Standard",
    counsel: "Anwaltlich",
    paranoid: "Paranoider Risiko-Check",
    askPlaceholder: "Stellen Sie eine Frage zu diesem Vertrag...",
    voiceButtonAria: "Juristische Frage per Mikrofon diktieren",
    sendButton: "Analysieren",
    zeroHallucinationBadge: "Null Halluzination Aktiv",
    citationBadge: "Zitat Verifiziert",
    attorneyExportButton: "Vorbereitungsbogen Exportieren",
  },
  ja: {
    appTitle: "ClausaFractalAI",
    subtitle: "自律型法的文書インテリジェンス＆アクションプラットフォーム",
    uploadPrompt: "法的文書PDFまたは契約書の写真スキャンをここにドラッグ",
    uploadButton: "契約書をアップロード",
    activeDoc: "アクティブな文書",
    tabChat: "検証可能チャット",
    tabBlindspots: "死角リスクマトリックス",
    tabPolicyCollider: "規約コリジョン分析",
    tabAttorneyPrep: "弁護士相談準備シート",
    tabCounterClauses: "条項交渉リライター",
    sliderLabel: "説明の深度",
    eli5: "ELI5（平易）",
    standard: "標準",
    counsel: "法務プロフェッショナル",
    paranoid: "リスク監査",
    askPlaceholder: "この契約書について質問してください...",
    voiceButtonAria: "マイクで法的質問を音声入力",
    sendButton: "分析実行",
    zeroHallucinationBadge: "ゼロ・ハルシネーション検証作動中",
    citationBadge: "引用根拠検証済",
    attorneyExportButton: "準備シート出力",
  },
  hi: {
    appTitle: "ClausaFractalAI",
    subtitle: "स्वायत्त कानूनी दस्तावेज़ बुद्धिमत्ता और कार्य मंच",
    uploadPrompt: "कानूनी पीडीएफ या अनुबंध की फोटो यहां खींचें और छोड़ें",
    uploadButton: "अनुबंध अपलोड करें",
    activeDoc: "सक्रिय दस्तावेज़",
    tabChat: "सत्यापनीय चैट",
    tabBlindspots: "ब्लाइंडस्पॉट जोखिम मैट्रिक्स",
    tabPolicyCollider: "नीति तुलना इंजन",
    tabAttorneyPrep: "वकील परामर्श तैयारी पत्र",
    tabCounterClauses: "अनुबंध धारा संशोधक",
    sliderLabel: "स्पष्टीकरण की गहराई",
    eli5: "सरल भाषा",
    standard: "मानक",
    counsel: "कानूनी विशेषज्ञ",
    paranoid: "कठोर जोखिम जांच",
    askPlaceholder: "इस अनुबंध के बारे में प्रश्न पूछें...",
    voiceButtonAria: "माइक से कानूनी प्रश्न बोलें",
    sendButton: "विश्लेषण करें",
    zeroHallucinationBadge: "शून्य भ्रम सत्यापन सक्रिय",
    citationBadge: "प्रमाणित उद्धरण",
    attorneyExportButton: "परामर्श पत्र डाउनलोड करें",
  },
};

export const getTranslation = (lang: LanguageCode): TranslationDictionary => {
  return translations[lang] || translations.en;
};
