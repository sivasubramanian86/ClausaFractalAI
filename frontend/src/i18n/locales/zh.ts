import { TranslationDictionary } from "../types";

export const zh: TranslationDictionary = {
  // Brand & Header
  appTitle: "ClausaFractalAI",
  subtitle: "自主法律文档智能与行动决策平台",
  zeroHallucinationBadge: "零幻觉真实验证运行中",
  citationBadge: "判例引用已验证",
  zeroKeyBadge: "Vertex AI ADC 零密钥",
  exclusiveBadge: "PromptWars 独家",

  // Navigation
  navStudio: "工作台工作室",
  navCourtroom: "司法审判室与法典",
  navMesh: "神经符号网格",
  navAnalytics: "分析与遥测",
  navFaq: "法律AI常见问题",
  navAbout: "智能体架构",
  navGovernance: "合规治理与VPC-SC",

  // Theme & Roles
  themeDark: "暗黑模式",
  themeLight: "明亮模式",
  roleCounsel: "总法律顾问",
  roleArbitrator: "首席仲裁员",
  roleAuditor: "风险审计师",
  roleFounder: "初创企业创始人",

  // Studio Workspace
  uploadPrompt: "将法律PDF或扫描合同照片拖放到此处",
  uploadButton: "上传合同",
  activeDoc: "当前合同文档",
  tabChat: "可验证对话",
  tabBlindspots: "盲点风险矩阵",
  tabPolicyCollider: "政策碰撞对比",
  tabAttorneyPrep: "律师咨询准备单",
  tabCounterClauses: "条款重写工具",
  tabCourtroom: "审判与法典",
  sliderLabel: "解释深度",
  eli5: "通俗易懂",
  standard: "标准专业",
  counsel: "资深法务",
  paranoid: "极限严苛排查",
  askPlaceholder: "输入关于此合同的法律问题...",
  voiceButtonAria: "通过麦克风输入法律问题",
  sendButton: "开始分析",
  attorneyExportButton: "导出准备清单",

  // Document Viewer
  docViewerTitle: "文档查看器",
  docViewerSubtitle: "企业级PDF与合同摄入处理阶段",
  pageOf: "第 {current} 页，共 {total} 页",
  zoomIn: "放大",
  zoomOut: "缩小",
  dropFile: "将PDF合同拖放到此处，或",
  browseFile: "浏览本地文件",
  uploadVoiceNote: "上传音频 / 语音速记",
  citationHighlightTitle: "交互式判例条款高亮",
  citationHighlightDesc: "点击问答工作室中的任意法律引用，即可立即定位并高亮对应合同原文。",

  // Chat Interface
  reasoningDepth: "推理深度",
  verifiedCitations: "具备真实依据",
  suggestedPrompts: "推荐法律问询",
  promptLiability: "合同中的责任限制总上限是多少？",
  promptIndemnity: "是否存在单方面的无限赔偿条款？",
  promptNonCompete: "协议中是否包含竞业限制或排他条款？",

  // Blindspot Matrix
  blindspotTitle: "盲点风险矩阵",
  auditButton: "审计文档",
  auditingButton: "文档审计中...",
  baselineCompliance: "基准合规评分:",
  criticalOmissions: "项重大缺失",
  colOmittedClause: "遗漏条款主题",
  colSeverity: "严重程度",
  colRiskImpact: "潜在法律风险",
  colSuggestedLanguage: "建议补充条款",
  noOmissionsDetected: "未检测到偏离标准基准的重大遗漏条款。",

  // Policy Collider
  colliderTitle: "政策碰撞与条款差异比对器",
  colliderSubtitle: "将标准法务政策与对方修改稿进行精确比对",
  compareButton: "开始版本碰撞",
  comparingButton: "碰撞比对中...",
  rightsSurrendered: "放弃的法定权利",
  liabilityEscalated: "上升的赔偿责任",
  benefitGained: "争取到的有利条件",
  neutralShift: "中性表述变更",
  colTopic: "条款议题",
  colPreviousTerms: "原版本条款",
  colProposedTerms: "拟修改条款",
  colStrategicImpact: "战略影响评估",

  // Attorney Prep
  prepSheetTitle: "律师咨询面谈准备单",
  generatePrepButton: "生成面谈准备单",
  generatingPrepButton: "正在生成中...",
  exportPrepButton: "导出准备单",
  executiveSummaryTitle: "核心要点概述",
  criticalRedFlagsTitle: "重大风险警示 (Red Flags)",
  questionsForCounselTitle: "向法律顾问提问清单",
  negotiationLeverageTitle: "商务谈判抓手与筹码",
  hourlySavingsNotice: "预计节省2.5小时资深律师付费咨询准备时间。",

  // Counter Clause
  counterClauseTitle: "谈判对等抗辩条款重写器",
  clauseDomainLabel: "条款所属范畴:",
  originalClauseLabel: "原不平等霸王条款:",
  rewriteButton: "拟定对等抗辩条款",
  rewritingButton: "条款拟定中...",
  proposedCounterTitle: "建议的对等平衡条款",
  strategicRationaleTitle: "法理与商业战略依据",
  negotiationTacticTitle: "商务谈判应对策略",

  // Courtroom & Judicial Codex
  courtroomTitle: "司法审判室与法定法典",
  tabBench: "审判法官席（裁判判决）",
  tabAdvocate: "出庭大律师作战室",
  tabDossier: "案件卷宗与多模态证据",
  tabCodex: "法定法典（指尖法条库）",
  btnAnalyzeCase: "剖析案情并作出裁决",
  btnAnalyzingCase: "正在审理判决...",
  judicialVerdictTitle: "高等法院裁判文书与裁定",
  ratioDecidendiTitle: "Ratio Decidendi（判决核心裁判要旨）",
  obiterDictaTitle: "Obiter Dicta（法官附带审理意见）",
  advocateStrategyTitle: "出庭辩护大律师战略（BA LLB, LLM）",
  winProbabilityTitle: "诉讼胜诉概率推演",
  prosecutionStrengthsTitle: "控方 / 原告胜诉优势论据",
  defenseShieldsTitle: "辩方 / 被告抗辩防线与减责事由",
  crossExamTrapsTitle: "法庭交叉质询证人陷阱",
  gcsDemoDataTitle: "Google Cloud Storage (GCS) 证据资料库",
  codexSearchPlaceholder: "跨司法管辖区检索法律与法条...",
  codexCategoryAll: "所有法域与罪名类别",

  // Neuro-Symbolic Mesh
  meshTitle: "双通道神经-符号智能体网格",
  meshSubtitle: "系统1 神经感知（Gemini 3.8）+ 系统2 形式化数学验证（Z3 求解器）",
  clauseToVerifyLabel: "待进行形式化验证的合同条款:",
  btnVerifyZ3: "运行形式化验证",
  btnVerifyingZ3: "正在证明数学不变量...",
  satReadyBadge: "Z3定理证明器: 可满足性已确认",
  watchdogBadge: "看门狗监控: ≤5 跳",

  // Analytics & BigQuery View
  analyticsTitle: "BigQuery 企业法务遥测数据中心",
  analyticsSubtitle: "实时 Token 成本效益、响应延迟指标与合同条款风险分布",
  totalCachedTokens: "上下文缓存 Token 数",
  costSavedUsd: "累计节省推理开销",
  avgLatency: "平均推理响应时延",
  hallucinationRate: "实测幻觉发生率",
  clauseRiskDistribution: "已审计风险类型频次分布",

  // FAQ View
  faqTitle: "常见法律与架构问题解答",
  faqSubtitle: "深度解析多智能体编排协作、法律依据锚定与零幻觉保障体系",
  searchFaqPlaceholder: "搜索关于 ReAct 循环、VPC-SC、BigQuery、0%幻觉的内容...",

  // About View
  aboutTitle: "智能体系统架构与 5 篇奠基性研究论文",
  aboutSubtitle: "基于 ReAct、Toolformer、Generative Agents、Reflexion 和 AutoGen 范式构建",
  tabPapers: "5篇核心论文",
  tabGraph: "4000万文档知识图谱",
  tabLeaders: "领袖级智能体AI",

  // Governance & VPC-SC View
  governanceTitle: "零信任安全体系与 Google Cloud 合规治理",
  governanceSubtitle: "VPC Service Controls 隔离边界、Firebase Auth RBAC 与不可篡改审计追踪",
  vpcStatus: "VPC Service Controls 运行状态",
  auditTrail: "不可篡改的法务合规审计日志",
};
