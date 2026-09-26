import { TranslationDictionary } from "../types";

export const ko: TranslationDictionary = {
  // Brand & Header
  appTitle: "ClausaFractalAI",
  subtitle: "자율형 법률 문서 인텔리전스 및 실행 플랫폼",
  zeroHallucinationBadge: "무결점 검증 활성화",
  citationBadge: "인용 검증 완료",
  zeroKeyBadge: "Vertex AI ADC 제로 키",
  exclusiveBadge: "PromptWars 단독",

  // Navigation
  navStudio: "스튜디오 워크스페이스",
  navCourtroom: "사법 챔버 및 법전",
  navMesh: "뉴로-심볼릭 메시",
  navAnalytics: "분석 및 텔레메트리",
  navFaq: "법률 AI FAQ",
  navAbout: "에이전트 아키텍처",
  navGovernance: "거버넌스 및 VPC-SC",

  // Theme & Roles
  themeDark: "다크 모드",
  themeLight: "라이트 모드",
  roleCounsel: "법무 총괄",
  roleArbitrator: "수석 중재인",
  roleAuditor: "리스크 감사관",
  roleFounder: "스타트업 창업자",

  // Studio Workspace
  uploadPrompt: "법률 PDF 또는 계약서 사진을 여기에 끌어다 놓으세요",
  uploadButton: "계약서 업로드",
  activeDoc: "활성 문서",
  tabChat: "검증 가능 대화",
  tabBlindspots: "사각지대 리스크",
  tabPolicyCollider: "정책 충돌 분석기",
  tabAttorneyPrep: "변호사 자문 준비서",
  tabCounterClauses: "조항 재작성기",
  tabCourtroom: "법정 및 법전",
  sliderLabel: "설명 상세도",
  eli5: "쉬운 설명",
  standard: "표준",
  counsel: "전문 법무",
  paranoid: "엄격한 리스크 검토",
  askPlaceholder: "이 계약서에 대해 질문하세요...",
  voiceButtonAria: "마이크로 법률 질문 음성 입력",
  sendButton: "분석",
  attorneyExportButton: "준비서 내보내기",

  // Document Viewer
  docViewerTitle: "문서 뷰어",
  docViewerSubtitle: "엔터프라이즈급 PDF 및 계약서 수집 단계",
  pageOf: "전체 {total}페이지 중 {current}페이지",
  zoomIn: "확대",
  zoomOut: "축소",
  dropFile: "PDF 계약서를 여기에 드롭하거나",
  browseFile: "파일 찾아보기",
  uploadVoiceNote: "오디오 / 음성 메모 업로드",
  citationHighlightTitle: "대화형 인용구 하이라이팅",
  citationHighlightDesc: "Q&A에서 법률 인용구를 클릭하면 원본 조항이 즉시 강조 표시됩니다.",

  // Chat Interface
  reasoningDepth: "추론 심도",
  verifiedCitations: "근거 조항 확인됨",
  suggestedPrompts: "추천 법률 질의",
  promptLiability: "총 책임 한도액은 얼마인가요?",
  promptIndemnity: "일방적인 손해배상 조항이 포함되어 있나요?",
  promptNonCompete: "이 계약에 경업금지 제한이 포함되어 있나요?",

  // Blindspot Matrix
  blindspotTitle: "사각지대 리스크 매트릭스",
  auditButton: "문서 감사 실행",
  auditingButton: "문서 감사 중...",
  baselineCompliance: "기준 준수 점수:",
  criticalOmissions: "건의 중요 누락",
  colOmittedClause: "누락된 조항 주제",
  colSeverity: "심각도",
  colRiskImpact: "리스크 영향",
  colSuggestedLanguage: "권장 보완 문구",
  noOmissionsDetected: "표준 기준 대비 중대한 조항 누락이 발견되지 않았습니다.",

  // Policy Collider
  colliderTitle: "정책 충돌 및 변경사항 대조기",
  colliderSubtitle: "상대방의 수정안과 기준 정책을 정밀 대조합니다",
  compareButton: "버전 비교 대조",
  comparingButton: "비교 중...",
  rightsSurrendered: "포기된 권리",
  liabilityEscalated: "확대된 책임",
  benefitGained: "획득한 이익",
  neutralShift: "중립적 변경",
  colTopic: "주제",
  colPreviousTerms: "기존 조건",
  colProposedTerms: "제안된 조건",
  colStrategicImpact: "전략적 영향",

  // Attorney Prep
  prepSheetTitle: "변호사 자문 준비 보고서",
  generatePrepButton: "준비 보고서 생성",
  generatingPrepButton: "생성 중...",
  exportPrepButton: "보고서 내보내기",
  executiveSummaryTitle: "경영진 요약 보고",
  criticalRedFlagsTitle: "중대한 경고 신호 (Red Flags)",
  questionsForCounselTitle: "법률 고문 질의 사항",
  negotiationLeverageTitle: "협상 우위 활용 포인트",
  hourlySavingsNotice: "변호사 자문 준비 시간 약 2.5시간 상당의 비용 절감.",

  // Counter Clause
  counterClauseTitle: "협상용 반대 조항 작성기",
  clauseDomainLabel: "조항 분류:",
  originalClauseLabel: "기존의 불리한 조항:",
  rewriteButton: "균형 잡힌 대안 조항 작성",
  rewritingButton: "대안 조항 작성 중...",
  proposedCounterTitle: "제안하는 균형 대안 조항",
  strategicRationaleTitle: "전략적 근거",
  negotiationTacticTitle: "협상 전술",

  // Courtroom & Judicial Codex
  courtroomTitle: "사법 재판부 및 법정 법전",
  tabBench: "재판부 (판결문)",
  tabAdvocate: "수석 변호사 전략실",
  tabDossier: "사건 기록 및 증거물",
  tabCodex: "법정 법전 (한눈에 보는 법령)",
  btnAnalyzeCase: "사건 정밀 분석 및 판결",
  btnAnalyzingCase: "판결 숙고 중...",
  judicialVerdictTitle: "고등법원 판결 및 명령",
  ratioDecidendiTitle: "Ratio Decidendi (구속력 있는 판결 이유)",
  obiterDictaTitle: "Obiter Dicta (재판관 방론)",
  advocateStrategyTitle: "수석 송무 변호사 전략 (BA LLB, LLM)",
  winProbabilityTitle: "재판 승소 확률 계산기",
  prosecutionStrengthsTitle: "검찰 / 원고측 승소 논거",
  defenseShieldsTitle: "변호인 / 피고측 방어 논리",
  crossExamTrapsTitle: "증인 반대신문 함정",
  gcsDemoDataTitle: "Google Cloud Storage (GCS) 증거물 카탈로그",
  codexSearchPlaceholder: "전 관할 법률 및 조항 검색...",
  codexCategoryAll: "전체 사법 관할 및 범주",

  // Neuro-Symbolic Mesh
  meshTitle: "듀얼 패스 뉴로-심볼릭 에이전트 메시",
  meshSubtitle: "시스템 1 신경망 인지 (Gemini 3.8) + 시스템 2 수학적 정형 검증 (Z3 솔버)",
  clauseToVerifyLabel: "정형 검증할 계약 조항:",
  btnVerifyZ3: "정형 검증 실행",
  btnVerifyingZ3: "불변 조건 증명 중...",
  satReadyBadge: "Z3 정리 증명기: SAT 준비 완료",
  watchdogBadge: "워치독: ≤5 홉",

  // Analytics & BigQuery View
  analyticsTitle: "BigQuery 엔터프라이즈 법률 텔레메트리",
  analyticsSubtitle: "실시간 토큰 비용 효율, 응답 지연 시간 및 계약 리스크",
  totalCachedTokens: "컨텍스트 캐시된 토큰",
  costSavedUsd: "절감된 추론 비용",
  avgLatency: "평균 응답 지연 시간",
  hallucinationRate: "실측 환각률",
  clauseRiskDistribution: "감사된 리스크 빈도 분석",

  // FAQ View
  faqTitle: "자주 묻는 질문",
  faqSubtitle: "멀티 에이전트 오케스트레이션 및 무결점 보증에 대한 상세 안내",
  searchFaqPlaceholder: "ReAct, VPC-SC, BigQuery, 무결점에 대해 검색...",

  // About View
  aboutTitle: "에이전트 시스템 아키텍처 및 5대 핵심 연구 논문",
  aboutSubtitle: "ReAct, Toolformer, Generative Agents, Reflexion, AutoGen 기반 설계",
  tabPapers: "5대 연구 논문",
  tabGraph: "4,000만 문서 지식 그래프",
  tabLeaders: "리더를 위한 에이전틱 AI",

  // Governance & VPC-SC View
  governanceTitle: "제로 트러스트 보안 및 Google Cloud 거버넌스",
  governanceSubtitle: "VPC Service Controls 경계, Firebase Auth RBAC, 불변 감사 로그",
  vpcStatus: "VPC Service Controls 상태",
  auditTrail: "불변 컴플라이언스 감사 로그",
};
