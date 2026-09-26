import { TranslationDictionary } from "../types";

export const zh_hk: TranslationDictionary = {
  // Brand & Header
  appTitle: "ClausaFractalAI",
  subtitle: "自主法律文件智慧與行動決策平台",
  zeroHallucinationBadge: "零幻覺真實驗證運行中",
  citationBadge: "判例引用已驗證",
  zeroKeyBadge: "Vertex AI ADC 零金鑰",
  exclusiveBadge: "PromptWars 獨家",

  // Navigation
  navStudio: "工作台工作室",
  navCourtroom: "司法審判室與法典",
  navMesh: "神經符號網格",
  navAnalytics: "分析與遙測",
  navFaq: "法律AI常見問題",
  navAbout: "智能體架構",
  navGovernance: "合規治理與VPC-SC",

  // Theme & Roles
  themeDark: "暗黑模式",
  themeLight: "明亮模式",
  roleCounsel: "總法律顧問",
  roleArbitrator: "首席仲裁員",
  roleAuditor: "風險審計師",
  roleFounder: "初創企業創始人",

  // Studio Workspace
  uploadPrompt: "將法律PDF或掃描合約照片拖放到此處",
  uploadButton: "上傳合約",
  activeDoc: "當前合約文件",
  tabChat: "可驗證對話",
  tabBlindspots: "盲點風險矩陣",
  tabPolicyCollider: "政策碰撞對比",
  tabAttorneyPrep: "律師諮詢準備單",
  tabCounterClauses: "條款重寫工具",
  tabCourtroom: "審判與法典",
  sliderLabel: "解釋深度",
  eli5: "通俗易懂",
  standard: "標準專業",
  counsel: "資深法務",
  paranoid: "極限嚴格排查",
  askPlaceholder: "輸入關於此合約的法律問題...",
  voiceButtonAria: "透過麥克風輸入法律問題",
  sendButton: "開始分析",
  attorneyExportButton: "導出準備清單",

  // Document Viewer
  docViewerTitle: "文件檢視器",
  docViewerSubtitle: "企業級PDF與合約攝入處理階段",
  pageOf: "第 {current} 頁，共 {total} 頁",
  zoomIn: "放大",
  zoomOut: "縮小",
  dropFile: "將PDF合約拖放到此處，或",
  browseFile: "瀏覽本地檔案",
  uploadVoiceNote: "上傳音訊 / 語音速記",
  citationHighlightTitle: "互動式判例條款高亮",
  citationHighlightDesc: "點擊問答工作室中的任意法律引用，即可立即定位並高亮對應合約原文。",

  // Chat Interface
  reasoningDepth: "推理深度",
  verifiedCitations: "具備真實依據",
  suggestedPrompts: "推薦法律問詢",
  promptLiability: "合約中的責任限制總上限是多少？",
  promptIndemnity: "是否存在單方面的無限賠償條款？",
  promptNonCompete: "協議中是否包含競業限制或排他條款？",

  // Blindspot Matrix
  blindspotTitle: "盲點風險矩陣",
  auditButton: "審計文件",
  auditingButton: "文件審計中...",
  baselineCompliance: "基準合規評分:",
  criticalOmissions: "項重大缺失",
  colOmittedClause: "遺漏條款主題",
  colSeverity: "嚴重程度",
  colRiskImpact: "潛在法律風險",
  colSuggestedLanguage: "建議補充條款",
  noOmissionsDetected: "未檢測到偏離標準基準的重大遺漏條款。",

  // Policy Collider
  colliderTitle: "政策碰撞與條款差異比對器",
  colliderSubtitle: "將標準法務政策與對方修改稿進行精確比對",
  compareButton: "開始版本碰撞",
  comparingButton: "碰撞比對中...",
  rightsSurrendered: "放棄的法定權利",
  liabilityEscalated: "上升的賠償責任",
  benefitGained: "爭取到的有利條件",
  neutralShift: "中性表述變更",
  colTopic: "條款議題",
  colPreviousTerms: "原版本條款",
  colProposedTerms: "擬修改條款",
  colStrategicImpact: "戰略影響評估",

  // Attorney Prep
  prepSheetTitle: "律師諮詢面談準備單",
  generatePrepButton: "生成面談準備單",
  generatingPrepButton: "正在生成中...",
  exportPrepButton: "導出準備單",
  executiveSummaryTitle: "核心要點概述",
  criticalRedFlagsTitle: "重大風險警示 (Red Flags)",
  questionsForCounselTitle: "向法律顧問提問清單",
  negotiationLeverageTitle: "商務談判抓手與籌碼",
  hourlySavingsNotice: "預計節省2.5小時資深律師付費諮詢準備時間。",

  // Counter Clause
  counterClauseTitle: "談判對等抗辯條款重寫器",
  clauseDomainLabel: "條款所屬範疇:",
  originalClauseLabel: "原不平等條款:",
  rewriteButton: "擬定對等抗辯條款",
  rewritingButton: "條款擬定中...",
  proposedCounterTitle: "建議的對等平衡條款",
  strategicRationaleTitle: "法理與商業戰略依據",
  negotiationTacticTitle: "商務談判應對策略",

  // Courtroom & Judicial Codex
  courtroomTitle: "司法審判室與法定法典",
  tabBench: "審判法官席（裁判判決）",
  tabAdvocate: "出庭大律師作戰室",
  tabDossier: "案件卷宗與多模態證據",
  tabCodex: "法定法典（指尖法條庫）",
  btnAnalyzeCase: "剖析案情並作出裁決",
  btnAnalyzingCase: "正在審理判決...",
  judicialVerdictTitle: "高等法院裁判文書與裁定",
  ratioDecidendiTitle: "Ratio Decidendi（判決核心裁判要旨）",
  obiterDictaTitle: "Obiter Dicta（法官附帶審理意見）",
  advocateStrategyTitle: "出庭辯護大律師戰略（BA LLB, LLM）",
  winProbabilityTitle: "訴訟勝訴概率推演",
  prosecutionStrengthsTitle: "控方 / 原告勝訴優勢論據",
  defenseShieldsTitle: "辯方 / 被告抗辯防線與減責事由",
  crossExamTrapsTitle: "法庭交叉質詢證人陷阱",
  gcsDemoDataTitle: "Google Cloud Storage (GCS) 證據資料庫",
  codexSearchPlaceholder: "跨司法管轄區檢索法律與法條...",
  codexCategoryAll: "所有法域與罪名類別",

  // Neuro-Symbolic Mesh
  meshTitle: "雙通道神經-符號智能體網格",
  meshSubtitle: "系統1 神經感知（Gemini 3.8）+ 系統2 形式化數學驗證（Z3 求解器）",
  clauseToVerifyLabel: "待進行形式化驗證的合約條款:",
  btnVerifyZ3: "運行形式化驗證",
  btnVerifyingZ3: "正在證明數學不變量...",
  satReadyBadge: "Z3定理證明器: 可滿足性已確認",
  watchdogBadge: "看門狗監控: ≤5 跳",

  // Analytics & BigQuery View
  analyticsTitle: "BigQuery 企業法務遙測數據中心",
  analyticsSubtitle: "實時 Token 成本效益、響應延遲指標與合約條款風險分佈",
  totalCachedTokens: "上下文快取 Token 數",
  costSavedUsd: "累計節省推理開銷",
  avgLatency: "平均推理響應時延",
  hallucinationRate: "實測幻覺發生率",
  clauseRiskDistribution: "已審計風險類型頻次分佈",

  // FAQ View
  faqTitle: "常見法律與架構問題解答",
  faqSubtitle: "深度解析多智能體編排協作、法律依據錨定與零幻覺保障體系",
  searchFaqPlaceholder: "搜尋關於 ReAct 循環、VPC-SC、BigQuery、0%幻覺的內容...",

  // About View
  aboutTitle: "智能體系統架構與 5 篇奠基性研究論文",
  aboutSubtitle: "基於 ReAct、Toolformer、Generative Agents、Reflexion 和 AutoGen 範式構建",
  tabPapers: "5篇核心論文",
  tabGraph: "4000萬文件知識圖譜",
  tabLeaders: "領袖級智能體AI",

  // Governance & VPC-SC View
  governanceTitle: "零信任安全體系與 Google Cloud 合規治理",
  governanceSubtitle: "VPC Service Controls 隔離邊界、Firebase Auth RBAC 與不可篡改審計追蹤",
  vpcStatus: "VPC Service Controls 運行狀態",
  auditTrail: "不可篡改的法務合規審計日誌",
};
