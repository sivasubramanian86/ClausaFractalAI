import { TranslationDictionary } from "../types";

export const es: TranslationDictionary = {
  // Brand & Header
  appTitle: "ClausaFractalAI",
  subtitle: "Plataforma Autónoma de Inteligencia y Acción para Documentos Legales",
  zeroHallucinationBadge: "Verificación Cero Alucinación Activa",
  citationBadge: "Cita Verificada",
  zeroKeyBadge: "Vertex AI ADC Zero-Key",
  exclusiveBadge: "Exclusivo de PromptWars",

  // Navigation
  navStudio: "Espacio de Estudio",
  navCourtroom: "Cámara Judicial y Códice",
  navMesh: "Malla Neuro-Simbólica",
  navAnalytics: "Analítica y Telemetría",
  navFaq: "Preguntas Frecuentes Legal AI",
  navAbout: "Arquitectura Agéntica",
  navGovernance: "Gobernanza y VPC-SC",

  // Theme & Roles
  themeDark: "Modo Oscuro",
  themeLight: "Modo Claro",
  roleCounsel: "Asesor Jurídico Principal",
  roleArbitrator: "Árbitro Principal",
  roleAuditor: "Auditor de Riesgos",
  roleFounder: "Fundador de Startup",

  // Studio Workspace
  uploadPrompt: "Arrastre y suelte el PDF legal o la foto del contrato aquí",
  uploadButton: "Subir Contrato",
  activeDoc: "Documento Activo",
  tabChat: "Chat Verificable",
  tabBlindspots: "Matriz de Puntos Ciegos",
  tabPolicyCollider: "Colisionador de Políticas",
  tabAttorneyPrep: "Ficha de Preparación para Abogado",
  tabCounterClauses: "Reescritor de Cláusulas",
  tabCourtroom: "Cámara y Códice",
  sliderLabel: "Profundidad de Explicación",
  eli5: "Sencillo (ELI5)",
  standard: "Estándar",
  counsel: "Asesoría Legal",
  paranoid: "Riesgo Paranoide",
  askPlaceholder: "Haga una pregunta sobre este contrato...",
  voiceButtonAria: "Dictar pregunta legal con micrófono",
  sendButton: "Analizar",
  attorneyExportButton: "Exportar Ficha",

  // Document Viewer
  docViewerTitle: "Visor de Documentos",
  docViewerSubtitle: "Etapa de ingesta de PDF y contratos de nivel empresarial",
  pageOf: "Página {current} de {total}",
  zoomIn: "Acercar",
  zoomOut: "Alejar",
  dropFile: "Suelte el contrato PDF aquí, o",
  browseFile: "Examinar Archivo",
  uploadVoiceNote: "Subir Nota de Voz / Audio",
  citationHighlightTitle: "Resaltado Interactivo de Citas",
  citationHighlightDesc: "Al hacer clic en cualquier cita legal en el estudio, se resalta instantáneamente el fragmento fuente.",

  // Chat Interface
  reasoningDepth: "Profundidad de Razonamiento",
  verifiedCitations: "Citas Fundamentadas",
  suggestedPrompts: "Consultas Legales Sugeridas",
  promptLiability: "¿Cuál es el límite agregado de responsabilidad?",
  promptIndemnity: "¿Existen cláusulas de indemnización unilateral?",
  promptNonCompete: "¿Contiene este acuerdo restricciones de no competencia?",

  // Blindspot Matrix
  blindspotTitle: "Matriz de Puntos Ciegos y Riesgos",
  auditButton: "Auditar Documento",
  auditingButton: "Auditando Documento...",
  baselineCompliance: "Puntaje de Cumplimiento Base:",
  criticalOmissions: "omisiones críticas",
  colOmittedClause: "Tema de Cláusula Omitida",
  colSeverity: "Severidad",
  colRiskImpact: "Impacto del Riesgo",
  colSuggestedLanguage: "Lenguaje Sugerido Faltante",
  noOmissionsDetected: "No se detectaron omisiones críticas contra el estándar base.",

  // Policy Collider
  colliderTitle: "Colisionador y Comparador de Políticas",
  colliderSubtitle: "Compare la política base contra las revisiones de la contraparte",
  compareButton: "Colisionar Versiones",
  comparingButton: "Comparando...",
  rightsSurrendered: "DERECHOS CEDIDOS",
  liabilityEscalated: "RESPONSABILIDAD ELEVADA",
  benefitGained: "BENEFICIO OBTENIDO",
  neutralShift: "CAMBIO NEUTRAL",
  colTopic: "Tema",
  colPreviousTerms: "Términos Anteriores",
  colProposedTerms: "Términos Propuestos",
  colStrategicImpact: "Impacto Estratégico",

  // Attorney Prep
  prepSheetTitle: "Ficha de Consulta con Abogado",
  generatePrepButton: "Generar Ficha",
  generatingPrepButton: "Generando...",
  exportPrepButton: "Exportar Ficha",
  executiveSummaryTitle: "Resumen Ejecutivo",
  criticalRedFlagsTitle: "Señales de Alerta Críticas (Red Flags)",
  questionsForCounselTitle: "Preguntas para el Asesor Legal",
  negotiationLeverageTitle: "Puntos de Apalancamiento en Negociación",
  hourlySavingsNotice: "Ahorro estimado de 2.5 horas de honorarios de preparación legal.",

  // Counter Clause
  counterClauseTitle: "Reescritor de Contra-Cláusulas de Negociación",
  clauseDomainLabel: "Dominio de la Cláusula:",
  originalClauseLabel: "Cláusula Opresiva Original:",
  rewriteButton: "Redactar Contra-Cláusula Equilibrada",
  rewritingButton: "Redactando...",
  proposedCounterTitle: "Contra-Cláusula Equilibrada Propuesta",
  strategicRationaleTitle: "Justificación Estratégica",
  negotiationTacticTitle: "Táctica de Negociación",

  // Courtroom & Judicial Codex
  courtroomTitle: "Cámara Judicial y Códice Estatutario",
  tabBench: "El Tribunal (Veredicto)",
  tabAdvocate: "Sala de Estrategia de Abogados",
  tabDossier: "Expediente del Caso y Pruebas",
  tabCodex: "Códice Estatutario (Leyes al Alcance)",
  btnAnalyzeCase: "Analizar Caso y Deliberar",
  btnAnalyzingCase: "Deliberando Veredicto...",
  judicialVerdictTitle: "Veredicto y Resoluciones del Tribunal",
  ratioDecidendiTitle: "Ratio Decidendi (Principio Jurídico Vinculante)",
  obiterDictaTitle: "Obiter Dicta (Observaciones Judiciales)",
  advocateStrategyTitle: "Estrategia de Abogado Litigante Senior (BA LLB, LLM)",
  winProbabilityTitle: "Cálculo de Probabilidad del Juicio",
  prosecutionStrengthsTitle: "Fortalezas de la Acusación / Demandante",
  defenseShieldsTitle: "Escudos y Mitigaciones de la Defensa",
  crossExamTrapsTitle: "Trampas de Contrainterrogatorio de Testigos",
  gcsDemoDataTitle: "Catálogo Multimedia Google Cloud Storage (GCS)",
  codexSearchPlaceholder: "Buscar leyes y artículos en todas las jurisdicciones...",
  codexCategoryAll: "Todas las Jurisdicciones y Categorías",

  // Neuro-Symbolic Mesh
  meshTitle: "Malla de Agentes Neuro-Simbólica de Doble Paso",
  meshSubtitle: "Sistema 1 Percepción Neural (Gemini 3.8) + Sistema 2 Verificación Matemática Formal (Solucionador Z3)",
  clauseToVerifyLabel: "Cláusula Contractual a Verificar Formalmente:",
  btnVerifyZ3: "Ejecutar Verificación Formal",
  btnVerifyingZ3: "Demostrando Invariantes...",
  satReadyBadge: "Solucionador Z3: SAT Listo",
  watchdogBadge: "Watchdog: ≤5 Saltos",

  // Analytics & BigQuery View
  analyticsTitle: "Telemetría Legal Empresarial BigQuery",
  analyticsSubtitle: "Eficiencia de costos de tokens en tiempo real, latencia y riesgo contractual",
  totalCachedTokens: "Tokens en Caché de Contexto",
  costSavedUsd: "Costo de Inferencia Evitado",
  avgLatency: "Latencia Promedio de Respuesta",
  hallucinationRate: "Tasa Medida de Alucinación",
  clauseRiskDistribution: "Distribución de Riesgos Auditados",

  // FAQ View
  faqTitle: "Preguntas Frecuentes",
  faqSubtitle: "Respuestas detalladas sobre orquestación multi-agente y garantía cero alucinación",
  searchFaqPlaceholder: "Buscar en FAQ sobre ReAct, VPC-SC, BigQuery, 0% Alucinación...",

  // About View
  aboutTitle: "Arquitectura del Sistema Agéntico y 5 Artículos Fundacionales",
  aboutSubtitle: "Diseñada sobre los paradigmas ReAct, Toolformer, Generative Agents, Reflexion y AutoGen",
  tabPapers: "5 Artículos de Investigación",
  tabGraph: "Grafo de Conocimiento de 40M-Docs",
  tabLeaders: "IA Agéntica para Líderes",

  // Governance & VPC-SC View
  governanceTitle: "Seguridad Zero-Trust y Gobernanza Google Cloud",
  governanceSubtitle: "Perímetros VPC Service Controls, RBAC Firebase Auth y registros de auditoría inmutables",
  vpcStatus: "Estado de VPC Service Controls",
  auditTrail: "Registro Inmutable de Auditoría de Cumplimiento",
};
