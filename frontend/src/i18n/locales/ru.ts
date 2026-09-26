import { TranslationDictionary } from "../types";

export const ru: TranslationDictionary = {
  // Brand & Header
  appTitle: "ClausaFractalAI",
  subtitle: "Автономная платформа анализа юридических документов и принятия решений",
  zeroHallucinationBadge: "Проверка нулевых галлюцинаций активна",
  citationBadge: "Цитата подтверждена",
  zeroKeyBadge: "Vertex AI ADC без ключей",
  exclusiveBadge: "Эксклюзивно для PromptWars",

  // Navigation
  navStudio: "Рабочая студия",
  navCourtroom: "Судебная палата и кодекс",
  navMesh: "Нейро-символическая сеть",
  navAnalytics: "Аналитика и телеметрия",
  navFaq: "FAQ по правовому ИИ",
  navAbout: "Агентная архитектура",
  navGovernance: "Управление и VPC-SC",

  // Theme & Roles
  themeDark: "Темная тема",
  themeLight: "Светлая тема",
  roleCounsel: "Главный юрисконсульт",
  roleArbitrator: "Главный арбитр",
  roleAuditor: "Аудитор рисков",
  roleFounder: "Основатель стартапа",

  // Studio Workspace
  uploadPrompt: "Перетащите юридический PDF или скан договора сюда",
  uploadButton: "Загрузить договор",
  activeDoc: "Активный документ",
  tabChat: "Верифицируемый чат",
  tabBlindspots: "Матрица слепых зон",
  tabPolicyCollider: "Коллайдер условий",
  tabAttorneyPrep: "Бриф для юриста",
  tabCounterClauses: "Рерайтер пунктов",
  tabCourtroom: "Суд и кодекс",
  sliderLabel: "Глубина пояснений",
  eli5: "Простыми словами (ELI5)",
  standard: "Стандарт",
  counsel: "Для юристов",
  paranoid: "Параноидальный аудит",
  askPlaceholder: "Задайте вопрос по этому договору...",
  voiceButtonAria: "Продиктовать юридический вопрос в микрофон",
  sendButton: "Анализировать",
  attorneyExportButton: "Экспорт брифа",

  // Document Viewer
  docViewerTitle: "Просмотр документов",
  docViewerSubtitle: "Корпоративный этап обработки PDF и договоров",
  pageOf: "Страница {current} из {total}",
  zoomIn: "Увеличить",
  zoomOut: "Уменьшить",
  dropFile: "Перетащите PDF договора сюда, или",
  browseFile: "Выбрать файл",
  uploadVoiceNote: "Загрузить аудио / голосовую заметку",
  citationHighlightTitle: "Интерактивная подсветка цитат",
  citationHighlightDesc: "При нажатии на юридическую ссылку в студии исходный фрагмент подсвечивается мгновенно.",

  // Chat Interface
  reasoningDepth: "Глубина рассуждений",
  verifiedCitations: "Подтвержденные цитаты",
  suggestedPrompts: "Рекомендуемые юридические вопросы",
  promptLiability: "Каков совокупный лимит ответственности?",
  promptIndemnity: "Присутствуют ли односторонние пункты о возмещении ущерба?",
  promptNonCompete: "Содержит ли соглашение ограничения конкуренции?",

  // Blindspot Matrix
  blindspotTitle: "Матрица рисков и слепых зон",
  auditButton: "Аудит документа",
  auditingButton: "Аудит документа...",
  baselineCompliance: "Базовый показатель соответствия:",
  criticalOmissions: "критических упущений",
  colOmittedClause: "Тема упущенного пункта",
  colSeverity: "Серьезность",
  colRiskImpact: "Влияние риска",
  colSuggestedLanguage: "Рекомендуемая формулировка",
  noOmissionsDetected: "Критических упущений по сравнению со стандартом не обнаружено.",

  // Policy Collider
  colliderTitle: "Коллайдер и компаратор условий договора",
  colliderSubtitle: "Сравните стандартные условия с правками контрагента",
  compareButton: "Сопоставить версии",
  comparingButton: "Сравнение...",
  rightsSurrendered: "УТРАЧЕННЫЕ ПРАВА",
  liabilityEscalated: "ПОВЫШЕННАЯ ОТВЕТСТВЕННОСТЬ",
  benefitGained: "ПОЛУЧЕННАЯ ВЫГОДА",
  neutralShift: "НЕЙТРАЛЬНОЕ ИЗМЕНЕНИЕ",
  colTopic: "Тема",
  colPreviousTerms: "Предыдущие условия",
  colProposedTerms: "Предложенные условия",
  colStrategicImpact: "Стратегический эффект",

  // Attorney Prep
  prepSheetTitle: "Бриф для консультации с юристом",
  generatePrepButton: "Создать бриф",
  generatingPrepButton: "Создание...",
  exportPrepButton: "Экспорт брифа",
  executiveSummaryTitle: "Краткое резюме для руководства",
  criticalRedFlagsTitle: "Критические риски (Red Flags)",
  questionsForCounselTitle: "Вопросы к юридическому консультанту",
  negotiationLeverageTitle: "Точки переговоров и рычаги давления",
  hourlySavingsNotice: "Экономия примерно 2.5 часов платной работы юриста.",

  // Counter Clause
  counterClauseTitle: "Рерайтер встречных формулировок договора",
  clauseDomainLabel: "Категория пункта:",
  originalClauseLabel: "Исходный кабальный пункт:",
  rewriteButton: "Составить сбалансированный пункт",
  rewritingButton: "Составление пункта...",
  proposedCounterTitle: "Предлагаемый сбалансированный пункт",
  strategicRationaleTitle: "Стратегическое обоснование",
  negotiationTacticTitle: "Тактика переговоров",

  // Courtroom & Judicial Codex
  courtroomTitle: "Судебная палата и статутный кодекс",
  tabBench: "Судейская коллегия (Вердикт)",
  tabAdvocate: "Штаб ведущего адвоката",
  tabDossier: "Материалы дела и доказательства",
  tabCodex: "Статутный кодекс (Законы под рукой)",
  btnAnalyzeCase: "Разобрать дело и вынести решение",
  btnAnalyzingCase: "Вынесение решения...",
  judicialVerdictTitle: "Постановление и решения Высокого суда",
  ratioDecidendiTitle: "Ratio Decidendi (Обязывающий правовой принцип)",
  obiterDictaTitle: "Obiter Dicta (Судебные замечания)",
  advocateStrategyTitle: "Стратегия старшего судебного адвоката (BA LLB, LLM)",
  winProbabilityTitle: "Расчет вероятности исхода суда",
  prosecutionStrengthsTitle: "Сильные стороны обвинения / истца",
  defenseShieldsTitle: "Правовая защита и смягчающие факторы ответчика",
  crossExamTrapsTitle: "Ловушки перекрестного допроса свидетелей",
  gcsDemoDataTitle: "Каталог доказательств Google Cloud Storage (GCS)",
  codexSearchPlaceholder: "Поиск законов и статей по всем юрисдикциям...",
  codexCategoryAll: "Все юрисдикции и категории",

  // Neuro-Symbolic Mesh
  meshTitle: "Двухпроходная нейро-символическая сеть агентов",
  meshSubtitle: "Система 1 Нейронное восприятие (Gemini 3.8) + Система 2 Математическая верификация (Сольвер Z3)",
  clauseToVerifyLabel: "Пункт договора для формальной верификации:",
  btnVerifyZ3: "Запустить формальную верификацию",
  btnVerifyingZ3: "Доказательство инвариантов...",
  satReadyBadge: "Сольвер теорем Z3: SAT готов",
  watchdogBadge: "Сторожевой таймер: ≤5 шагов",

  // Analytics & BigQuery View
  analyticsTitle: "Корпоративная юридическая телеметрия BigQuery",
  analyticsSubtitle: "Эффективность расхода токенов в реальном времени, задержки и риски",
  totalCachedTokens: "Токенов в кэше контекста",
  costSavedUsd: "Сэкономленные затраты на инференс",
  avgLatency: "Среднее время ответа",
  hallucinationRate: "Измеренный уровень галлюцинаций",
  clauseRiskDistribution: "Распределение проверенных рисков",

  // FAQ View
  faqTitle: "Часто задаваемые вопросы",
  faqSubtitle: "Подробные ответы о мультиагентной оркестрации и гарантии нулевых галлюцинаций",
  searchFaqPlaceholder: "Поиск по FAQ: ReAct, VPC-SC, BigQuery, 0% галлюцинаций...",

  // About View
  aboutTitle: "Агентная архитектура и 5 фундаментальных научных работ",
  aboutSubtitle: "Создана на базе ReAct, Toolformer, Generative Agents, Reflexion и AutoGen",
  tabPapers: "5 научных работ",
  tabGraph: "Граф знаний на 40M документов",
  tabLeaders: "Агентный ИИ для руководителей",

  // Governance & VPC-SC View
  governanceTitle: "Безопасность Zero-Trust и управление Google Cloud",
  governanceSubtitle: "Периметры VPC Service Controls, RBAC Firebase Auth и неизменяемые журналы аудита",
  vpcStatus: "Статус VPC Service Controls",
  auditTrail: "Неизменяемый журнал аудита соответствия",
};
