import { TranslationDictionary } from "../types";

export const ja: TranslationDictionary = {
  // Brand & Header
  appTitle: "ClausaFractalAI",
  subtitle: "自律型法務文書インテリジェンス＆アクションプラットフォーム",
  zeroHallucinationBadge: "ゼロハルシネーション検証稼働中",
  citationBadge: "出典引用検証済み",
  zeroKeyBadge: "Vertex AI ADC ゼロキー",
  exclusiveBadge: "PromptWars 限定",

  // Navigation
  navStudio: "スタジオワークスペース",
  navCourtroom: "法廷チャンバー＆法典",
  navMesh: "ニューロシンボリックメッシュ",
  navAnalytics: "分析＆テレメトリ",
  navFaq: "法務AI FAQ",
  navAbout: "エージェントアーキテクチャ",
  navGovernance: "ガバナンス＆VPC-SC",

  // Theme & Roles
  themeDark: "ダークモード",
  themeLight: "ライトモード",
  roleCounsel: "法務総括（GC）",
  roleArbitrator: "主任仲裁人",
  roleAuditor: "リスク監査役",
  roleFounder: "創業者",

  // Studio Workspace
  uploadPrompt: "契約書PDFまたはスキャン画像をここにドラッグ＆ドロップ",
  uploadButton: "契約書をアップロード",
  activeDoc: "アクティブな文書",
  tabChat: "検証可能チャット",
  tabBlindspots: "ブラインドスポットリスク",
  tabPolicyCollider: "ポリシー衝突エンジン",
  tabAttorneyPrep: "弁護士相談準備シート",
  tabCounterClauses: "条項リライター",
  tabCourtroom: "法廷＆法典",
  sliderLabel: "解説の深さ",
  eli5: "平易な解説",
  standard: "標準",
  counsel: "法務専門",
  paranoid: "厳格リスク精査",
  askPlaceholder: "この契約書について質問する...",
  voiceButtonAria: "マイクで法務の質問を入力",
  sendButton: "分析する",
  attorneyExportButton: "準備シートを出力",

  // Document Viewer
  docViewerTitle: "ドキュメントビューア",
  docViewerSubtitle: "エンタープライズ対応のPDFおよび契約取込ステージ",
  pageOf: "{total} ページ中 {current} ページ",
  zoomIn: "拡大",
  zoomOut: "縮小",
  dropFile: "PDF契約書をここにドロップ、または",
  browseFile: "ファイルを選択",
  uploadVoiceNote: "音声 / 音声メモをアップロード",
  citationHighlightTitle: "インタラクティブな引用ハイライト",
  citationHighlightDesc: "Q&A内の引用箇所をクリックすると、該当する原文条項が即座にハイライトされます。",

  // Chat Interface
  reasoningDepth: "推論の深さ",
  verifiedCitations: "根拠条項付き",
  suggestedPrompts: "推奨される法的質問",
  promptLiability: "責任制限の累積上限額はどうなっていますか？",
  promptIndemnity: "一方的な補償条項は含まれていますか？",
  promptNonCompete: "競業避止義務の制限は含まれていますか？",

  // Blindspot Matrix
  blindspotTitle: "ブラインドスポットリスクマトリクス",
  auditButton: "契約書を監査",
  auditingButton: "文書を監査中...",
  baselineCompliance: "基準適合スコア:",
  criticalOmissions: "件の重大な欠落",
  colOmittedClause: "欠落条項トピック",
  colSeverity: "重要度",
  colRiskImpact: "リスク影響",
  colSuggestedLanguage: "推奨される追加文案",
  noOmissionsDetected: "標準基準に対する重大な条項の欠落は検出されませんでした。",

  // Policy Collider
  colliderTitle: "ポリシー衝突・差分アナライザー",
  colliderSubtitle: "基準ポリシーと相手方の修正案を比較照合",
  compareButton: "バージョンを比較",
  comparingButton: "比較中...",
  rightsSurrendered: "放棄された権利",
  liabilityEscalated: "拡大した責任",
  benefitGained: "獲得した利益",
  neutralShift: "中立的な変更",
  colTopic: "トピック",
  colPreviousTerms: "従前の条件",
  colProposedTerms: "提案された条件",
  colStrategicImpact: "戦略的影響",

  // Attorney Prep
  prepSheetTitle: "弁護士相談準備シート",
  generatePrepButton: "準備シートを作成",
  generatingPrepButton: "作成中...",
  exportPrepButton: "準備シートを出力",
  executiveSummaryTitle: "エグゼクティブサマリー",
  criticalRedFlagsTitle: "重大な警告（レッドフラグ）",
  questionsForCounselTitle: "顧問弁護士への確認事項",
  negotiationLeverageTitle: "交渉の有利な論点",
  hourlySavingsNotice: "弁護士準備費用として推定2.5時間分のコストを削減。",

  // Counter Clause
  counterClauseTitle: "対抗条項交渉リライター",
  clauseDomainLabel: "条項カテゴリ:",
  originalClauseLabel: "不利な元の条項:",
  rewriteButton: "バランスの取れた対抗条項を作成",
  rewritingButton: "条項を作成中...",
  proposedCounterTitle: "提案する対抗条項",
  strategicRationaleTitle: "戦略的論拠",
  negotiationTacticTitle: "交渉戦術",

  // Courtroom & Judicial Codex
  courtroomTitle: "法廷チャンバー＆法定法典",
  tabBench: "裁判部（判決）",
  tabAdvocate: "主任弁護士作戦室",
  tabDossier: "事件記録＆証拠調書",
  tabCodex: "法定法典（掌上の法規）",
  btnAnalyzeCase: "事件を解剖・審理する",
  btnAnalyzingCase: "判決を審理中...",
  judicialVerdictTitle: "高等裁判所判決および命令",
  ratioDecidendiTitle: "Ratio Decidendi（拘束力ある判例法理）",
  obiterDictaTitle: "Obiter Dicta（傍論）",
  advocateStrategyTitle: "主任訴訟弁護士戦略（BA LLB, LLM）",
  winProbabilityTitle: "勝訴確率カルキュレーター",
  prosecutionStrengthsTitle: "検察／原告側の勝訴根拠",
  defenseShieldsTitle: "弁護人／被告側の抗弁・防御論点",
  crossExamTrapsTitle: "反対尋問における証人の罠",
  gcsDemoDataTitle: "Google Cloud Storage（GCS）サンプル証拠資料",
  codexSearchPlaceholder: "全法域の法律・条文を検索...",
  codexCategoryAll: "すべての法域＆カテゴリ",

  // Neuro-Symbolic Mesh
  meshTitle: "デュアルパス・ニューロシンボリックメッシュ",
  meshSubtitle: "第1系統 神経網認識（Gemini 3.8）＋ 第2系統 数学的形式検証（Z3ソルバー）",
  clauseToVerifyLabel: "形式検証を実施する契約条項:",
  btnVerifyZ3: "形式検証を実行",
  btnVerifyingZ3: "不変条件を証明中...",
  satReadyBadge: "Z3定理証明器: SAT対応",
  watchdogBadge: "ウォッチドッグ: ≤5ホップ",

  // Analytics & BigQuery View
  analyticsTitle: "BigQuery エンタープライズ法務テレメトリ",
  analyticsSubtitle: "リアルタイムトークン費用効率、応答レイテンシ、契約リスク",
  totalCachedTokens: "コンテキストキャッシュトークン",
  costSavedUsd: "推論コスト削減額",
  avgLatency: "平均応答レイテンシ",
  hallucinationRate: "実測ハルシネーション率",
  clauseRiskDistribution: "監査済みリスク頻度分布",

  // FAQ View
  faqTitle: "よくあるご質問",
  faqSubtitle: "マルチエージェント協調とゼロハルシネーション保証の詳細解説",
  searchFaqPlaceholder: "ReAct、VPC-SC、BigQuery、ゼロハルシネーションについて検索...",

  // About View
  aboutTitle: "エージェントアーキテクチャと5つの基盤論文",
  aboutSubtitle: "ReAct、Toolformer、Generative Agents、Reflexion、AutoGenのパラダイム上に構築",
  tabPapers: "5つの研究論文",
  tabGraph: "4000万文書ナレッジグラフ",
  tabLeaders: "リーダーのためのエージェントAI",

  // Governance & VPC-SC View
  governanceTitle: "ゼロトラストセキュリティ＆Google Cloudガバナンス",
  governanceSubtitle: "VPC Service Controls境界、Firebase Auth RBAC、改ざん防止監査ログ",
  vpcStatus: "VPC Service Controls 稼働ステータス",
  auditTrail: "改ざん不能なコンプライアンス監査ログ",
};
