import { TranslationDictionary } from "../types";

export const ar: TranslationDictionary = {
  // Brand & Header
  appTitle: "ClausaFractalAI",
  subtitle: "منصة ذكاء العقود القانونية المستقلة واتخاذ الإجراءات",
  zeroHallucinationBadge: "التحقق من عدم الهلوسة نشط",
  citationBadge: "اقتباس تم التحقق منه",
  zeroKeyBadge: "Vertex AI ADC بدون مفتاح",
  exclusiveBadge: "حصري لـ PromptWars",

  // Navigation
  navStudio: "مساحة الاستوديو",
  navCourtroom: "غرفة القضاء والمدونة",
  navMesh: "الشبكة العصبية الرمزية",
  navAnalytics: "التحليلات والقياس عن بُعد",
  navFaq: "الأسئلة الشائعة للذكاء الاصطناعي القانوني",
  navAbout: "هندسة الوكلاء",
  navGovernance: "الحوكمة وVPC-SC",

  // Theme & Roles
  themeDark: "الوضع الداكن",
  themeLight: "الوضع الفاتح",
  roleCounsel: "المستشار العام",
  roleArbitrator: "رئيس هيئة التحكيم",
  roleAuditor: "مدقق المخاطر",
  roleFounder: "مؤسس الشركة الناشئة",

  // Studio Workspace
  uploadPrompt: "اسحب وأفلت ملف PDF القانوني أو صورة العقد هنا",
  uploadButton: "تحميل العقد",
  activeDoc: "المستند النشط",
  tabChat: "محادثة قابلة للتحقق",
  tabBlindspots: "مصفوفة النقاط العمياء",
  tabPolicyCollider: "مقارن السياسات",
  tabAttorneyPrep: "ورقة إعداد المحامي",
  tabCounterClauses: "مُعيد صياغة البنود",
  tabCourtroom: "القضاء والمدونة",
  sliderLabel: "عمق التفسير",
  eli5: "شرح مبسط",
  standard: "قياسي",
  counsel: "مستشار قانوني",
  paranoid: "فحص مخاطر صارم",
  askPlaceholder: "اطرح سؤالاً حول هذا العقد...",
  voiceButtonAria: "إملاء سؤال قانوني عبر الميكروفون",
  sendButton: "تحليل",
  attorneyExportButton: "تصدير ورقة الإعداد",

  // Document Viewer
  docViewerTitle: "عارض المستندات",
  docViewerSubtitle: "مرحلة معالجة واستيعاب العقود وملفات PDF للمؤسسات",
  pageOf: "صفحة {current} من {total}",
  zoomIn: "تكبير",
  zoomOut: "تصغير",
  dropFile: "أفلت عقد PDF هنا، أو",
  browseFile: "تصفح الملفات",
  uploadVoiceNote: "تحميل ملاحظة صوتية",
  citationHighlightTitle: "إبراز الاقتباسات التفاعلي",
  citationHighlightDesc: "النقر على أي اقتباس قانوني في الاستوديو يحدد النص الأصلي فوراً.",

  // Chat Interface
  reasoningDepth: "عمق الاستدلال",
  verifiedCitations: "اقتباسات موثقة",
  suggestedPrompts: "استفسارات قانونية مقترحة",
  promptLiability: "ما هو الحد الأقصى للمسؤولية الإجمالية؟",
  promptIndemnity: "هل هناك بنود تعويض أحادية الجانب؟",
  promptNonCompete: "هل تحتوي هذه الاتفاقية على قيود عدم منافسة؟",

  // Blindspot Matrix
  blindspotTitle: "مصفوفة مخاطر النقاط العمياء",
  auditButton: "تدقيق المستند",
  auditingButton: "جارٍ تدقيق المستند...",
  baselineCompliance: "درجة الامتثال الأساسية:",
  criticalOmissions: "إغفالات حرجة",
  colOmittedClause: "موضوع البند المحذوف",
  colSeverity: "الخطورة",
  colRiskImpact: "أثر المخاطرة",
  colSuggestedLanguage: "الصياغة المقترحة البديلة",
  noOmissionsDetected: "لم يتم اكتشاف أي إغفالات حرجة مقارنة بالمعيار الأساسي.",

  // Policy Collider
  colliderTitle: "مقارن السياسات والتعارض",
  colliderSubtitle: "مقارنة السياسة الأساسية مع تعديلات الطرف الآخر",
  compareButton: "مقارنة النسخ",
  comparingButton: "جارٍ المقارنة...",
  rightsSurrendered: "حقوق تم التنازل عنها",
  liabilityEscalated: "مسؤولية متزايدة",
  benefitGained: "مكاسب محققة",
  neutralShift: "تغيير محايد",
  colTopic: "الموضوع",
  colPreviousTerms: "الشروط السابقة",
  colProposedTerms: "الشروط المقترحة",
  colStrategicImpact: "الأثر الاستراتيجي",

  // Attorney Prep
  prepSheetTitle: "ورقة إعداد استشارة المحامي",
  generatePrepButton: "إنشاء ورقة الإعداد",
  generatingPrepButton: "جارٍ الإنشاء...",
  exportPrepButton: "تصدير الورقة",
  executiveSummaryTitle: "الملخص التنفيذي",
  criticalRedFlagsTitle: "مؤشرات الخطر الحرجة (علامات حمراء)",
  questionsForCounselTitle: "أسئلة للمستشار القانوني",
  negotiationLeverageTitle: "نقاط القوة في التفاوض",
  hourlySavingsNotice: "توفير ما يقدر بنحو 2.5 ساعة من تكلفة وقت إعداد المحامي.",

  // Counter Clause
  counterClauseTitle: "مُعيد صياغة البنود التفاوضية المضادة",
  clauseDomainLabel: "مجال البند:",
  originalClauseLabel: "البند الأصلي المجحف:",
  rewriteButton: "صياغة بند مضاد متوازن",
  rewritingButton: "جارٍ الصياغة...",
  proposedCounterTitle: "البند المضاد المتوازن المقترح",
  strategicRationaleTitle: "المبرر الاستراتيجي",
  negotiationTacticTitle: "تكتيك التفاوض",

  // Courtroom & Judicial Codex
  courtroomTitle: "غرفة القضاء والمدونة القانونية",
  tabBench: "هيئة المحكمة (الحكم)",
  tabAdvocate: "غرفة استراتيجية المحامي الأول",
  tabDossier: "ملف القضية والأدلة",
  tabCodex: "المدونة القانونية (القوانين في متناول يدك)",
  btnAnalyzeCase: "تشريح القضية والمداولة",
  btnAnalyzingCase: "جارٍ مداولة الحكم...",
  judicialVerdictTitle: "حكم وقرارات المحكمة العليا",
  ratioDecidendiTitle: "Ratio Decidendi (المبدأ القانوني الملزم)",
  obiterDictaTitle: "Obiter Dicta (ملاحظات المحكمة)",
  advocateStrategyTitle: "استراتيجية محامي المرافعات الأول (BA LLB, LLM)",
  winProbabilityTitle: "حساب احتمالية كسب الدعوى",
  prosecutionStrengthsTitle: "نقاط قوة الادعاء / المدعي",
  defenseShieldsTitle: "دفاعات وحجج المدعى عليه",
  crossExamTrapsTitle: "فخاخ استجواب الشهود المعاكس",
  gcsDemoDataTitle: "كتالوج وسائط Google Cloud Storage (GCS)",
  codexSearchPlaceholder: "البحث في القوانين والمواد عبر جميع الولايات القضائية...",
  codexCategoryAll: "جميع الاختصاصات القضائية والفئات",

  // Neuro-Symbolic Mesh
  meshTitle: "شبكة الوكلاء العصبية الرمزية ثنائية المسار",
  meshSubtitle: "النظام 1 الإدراك العصبي (Gemini 3.8) + النظام 2 التحقق الرياضي الرسمي (حلّال Z3)",
  clauseToVerifyLabel: "بند العقد المراد التحقق منه رسمياً:",
  btnVerifyZ3: "تشغيل التحقق الرسمي",
  btnVerifyingZ3: "جارٍ إثبات الثوابت الرياضية...",
  satReadyBadge: "حلّال مبرهنات Z3: جاهز للاختبار",
  watchdogBadge: "المراقب: ≤5 قفزات",

  // Analytics & BigQuery View
  analyticsTitle: "قياسات BigQuery القانونية للمؤسسات",
  analyticsSubtitle: "كفاءة تكلفة الرموز المباشرة وزمن الاستجابة ومخاطر البنود",
  totalCachedTokens: "الرموز المخزنة مؤقتاً في السياق",
  costSavedUsd: "التكلفة المتفاداها في الاستنتاج",
  avgLatency: "متوسط زمن الاستجابة",
  hallucinationRate: "معدل الهلوسة المقاس",
  clauseRiskDistribution: "توزيع تكرار المخاطر المدققة",

  // FAQ View
  faqTitle: "الأسئلة الشائعة",
  faqSubtitle: "إجابات معمقة حول تنسيق الوكلاء المتعددين وضمان انعدام الهلوسة",
  searchFaqPlaceholder: "البحث في الأسئلة الشائعة حول ReAct، VPC-SC، BigQuery، 0% هلوسة...",

  // About View
  aboutTitle: "هندسة نظام الوكلاء و5 أوراق بحثية تأسيسية",
  aboutSubtitle: "مصممة وفق نماذج ReAct، Toolformer، Generative Agents، Reflexion، وAutoGen",
  tabPapers: "5 أوراق بحثية",
  tabGraph: "رسم بياني للمعرفة بـ 40 مليون مستند",
  tabLeaders: "الذكاء الاصطناعي الوكيل للقادة",

  // Governance & VPC-SC View
  governanceTitle: "أمان انعدام الثقة وحوكمة Google Cloud",
  governanceSubtitle: "حدود VPC Service Controls، وأذونات Firebase Auth RBAC وسجلات تدقيق غير قابلة للتغيير",
  vpcStatus: "حالة VPC Service Controls",
  auditTrail: "سجل تدقيق الامتثال غير القابل للتعديل",
};
