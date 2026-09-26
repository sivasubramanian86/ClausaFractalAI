import { TranslationDictionary } from "../types";

export const pt: TranslationDictionary = {
  // Brand & Header
  appTitle: "ClausaFractalAI",
  subtitle: "Plataforma Autônoma de Inteligência e Ação para Documentos Jurídicos",
  zeroHallucinationBadge: "Verificação Zero Alucinação Ativa",
  citationBadge: "Citação Verificada",
  zeroKeyBadge: "Vertex AI ADC Zero-Key",
  exclusiveBadge: "Exclusivo PromptWars",

  // Navigation
  navStudio: "Espaço Studio",
  navCourtroom: "Câmara Judicial e Código",
  navMesh: "Malha Neuro-Simbólica",
  navAnalytics: "Analítica e Telemetria",
  navFaq: "FAQ IA Jurídica",
  navAbout: "Arquitetura Agêntica",
  navGovernance: "Governança e VPC-SC",

  // Theme & Roles
  themeDark: "Modo Escuro",
  themeLight: "Modo Claro",
  roleCounsel: "Diretor Jurídico",
  roleArbitrator: "Árbitro Principal",
  roleAuditor: "Auditor de Riscos",
  roleFounder: "Fundador de Startup",

  // Studio Workspace
  uploadPrompt: "Arraste e solte o PDF jurídico ou foto do contrato aqui",
  uploadButton: "Enviar Contrato",
  activeDoc: "Documento Ativo",
  tabChat: "Chat Verificável",
  tabBlindspots: "Matriz de Pontos Cegos",
  tabPolicyCollider: "Colisor de Políticas",
  tabAttorneyPrep: "Ficha de Preparação para Advogado",
  tabCounterClauses: "Reescritor de Cláusulas",
  tabCourtroom: "Câmara e Código",
  sliderLabel: "Profundidade de Explicação",
  eli5: "Simplificado (ELI5)",
  standard: "Padrão",
  counsel: "Consultoria Jurídica",
  paranoid: "Risco Paranoico",
  askPlaceholder: "Faça uma pergunta sobre este contrato...",
  voiceButtonAria: "Ditar pergunta jurídica com microfone",
  sendButton: "Analisar",
  attorneyExportButton: "Exportar Ficha",

  // Document Viewer
  docViewerTitle: "Visualizador de Documentos",
  docViewerSubtitle: "Etapa de ingestão de PDF e contratos em nível corporativo",
  pageOf: "Página {current} de {total}",
  zoomIn: "Aumentar Zoom",
  zoomOut: "Diminuir Zoom",
  dropFile: "Solte o contrato PDF aqui, ou",
  browseFile: "Procurar Arquivo",
  uploadVoiceNote: "Enviar Áudio / Nota de Voz",
  citationHighlightTitle: "Destaque Interativo de Citações",
  citationHighlightDesc: "Ao clicar em qualquer citação jurídica no estúdio, o trecho de origem é destacado instantaneamente.",

  // Chat Interface
  reasoningDepth: "Profundidade de Raciocínio",
  verifiedCitations: "Citações Fundamentadas",
  suggestedPrompts: "Perguntas Jurídicas Sugeridas",
  promptLiability: "Qual é o limite agregado de responsabilidade?",
  promptIndemnity: "Existem cláusulas de indenização unilateral?",
  promptNonCompete: "Este contrato contém restrições de não concorrência?",

  // Blindspot Matrix
  blindspotTitle: "Matriz de Riscos e Pontos Cegos",
  auditButton: "Auditar Documento",
  auditingButton: "Auditando Documento...",
  baselineCompliance: "Pontuação de Conformidade Base:",
  criticalOmissions: "omissões críticas",
  colOmittedClause: "Tópico de Cláusula Omitida",
  colSeverity: "Gravidade",
  colRiskImpact: "Impacto do Risco",
  colSuggestedLanguage: "Texto Faltante Sugerido",
  noOmissionsDetected: "Nenhuma omissão crítica detectada em relação ao padrão base.",

  // Policy Collider
  colliderTitle: "Colisor e Comparador de Políticas",
  colliderSubtitle: "Compare a política base com as revisões da contraparte",
  compareButton: "Colidir Versões",
  comparingButton: "Comparando...",
  rightsSurrendered: "DIREITOS CEDIDOS",
  liabilityEscalated: "RESPONSABILIDADE ELEVADA",
  benefitGained: "BENEFÍCIO OBTIDO",
  neutralShift: "MUDANÇA NEUTRA",
  colTopic: "Tópico",
  colPreviousTerms: "Termos Anteriores",
  colProposedTerms: "Termos Propostos",
  colStrategicImpact: "Impacto Estratégico",

  // Attorney Prep
  prepSheetTitle: "Ficha de Preparação para Advogado",
  generatePrepButton: "Gerar Ficha",
  generatingPrepButton: "Gerando...",
  exportPrepButton: "Exportar Ficha",
  executiveSummaryTitle: "Resumo Executivo",
  criticalRedFlagsTitle: "Sinais de Alerta Críticos (Red Flags)",
  questionsForCounselTitle: "Perguntas para o Assessor Jurídico",
  negotiationLeverageTitle: "Pontos de Alavancagem na Negociação",
  hourlySavingsNotice: "Economia estimada de 2,5 horas de honorários de preparação jurídica.",

  // Counter Clause
  counterClauseTitle: "Reescritor de Contra-Cláusulas de Negociação",
  clauseDomainLabel: "Domínio da Cláusula:",
  originalClauseLabel: "Cláusula Opressiva Original:",
  rewriteButton: "Redigir Contra-Cláusula Equilibrada",
  rewritingButton: "Redigindo...",
  proposedCounterTitle: "Contra-Cláusula Equilibrada Proposta",
  strategicRationaleTitle: "Justificativa Estratégica",
  negotiationTacticTitle: "Tática de Negociação",

  // Courtroom & Judicial Codex
  courtroomTitle: "Câmara Judicial e Código Estatutário",
  tabBench: "O Tribunal (Veredito)",
  tabAdvocate: "Central de Estratégia de Advogados",
  tabDossier: "Dossiê do Caso e Provas",
  tabCodex: "Código Estatutário (Leis ao seu Alcance)",
  btnAnalyzeCase: "Dissecar Caso e Deliberar",
  btnAnalyzingCase: "Deliberando Veredito...",
  judicialVerdictTitle: "Veredito e Resoluções do Tribunal",
  ratioDecidendiTitle: "Ratio Decidendi (Princípio Jurídico Vinculante)",
  obiterDictaTitle: "Obiter Dicta (Observações Judiciais)",
  advocateStrategyTitle: "Estratégia de Advogado Contencioso Sênior (BA LLB, LLM)",
  winProbabilityTitle: "Cálculo de Probabilidade do Julgamento",
  prosecutionStrengthsTitle: "Pontos Fortes da Acusação / Autor",
  defenseShieldsTitle: "Escudos e Mitigações da Defesa",
  crossExamTrapsTitle: "Armadilhas de Interrogatório de Testemunhas",
  gcsDemoDataTitle: "Catálogo de Mídia Google Cloud Storage (GCS)",
  codexSearchPlaceholder: "Pesquisar leis e artigos em todas as jurisdições...",
  codexCategoryAll: "Todas as Jurisdições e Categorias",

  // Neuro-Symbolic Mesh
  meshTitle: "Malha de Agentes Neuro-Simbólica de Dupla Passagem",
  meshSubtitle: "Sistema 1 Percepção Neural (Gemini 3.8) + Sistema 2 Verificação Formal (Solucionador Z3)",
  clauseToVerifyLabel: "Cláusula Contratual a Verificar Formalmente:",
  btnVerifyZ3: "Executar Verificação Formal",
  btnVerifyingZ3: "Provando Invariantes...",
  satReadyBadge: "Solucionador Z3: SAT Pronto",
  watchdogBadge: "Watchdog: ≤5 Saltos",

  // Analytics & BigQuery View
  analyticsTitle: "Telemetria Jurídica Corporativa BigQuery",
  analyticsSubtitle: "Eficiência de custos de tokens em tempo real, latência e risco contratual",
  totalCachedTokens: "Tokens em Cache de Contexto",
  costSavedUsd: "Custo de Inferência Evitado",
  avgLatency: "Latência Média de Resposta",
  hallucinationRate: "Taxa de Alucinação Medida",
  clauseRiskDistribution: "Distribuição de Riscos Auditados",

  // FAQ View
  faqTitle: "Perguntas Frequentes",
  faqSubtitle: "Respostas detalhadas sobre orquestração multi-agente e garantia zero alucinação",
  searchFaqPlaceholder: "Pesquisar nas FAQs sobre ReAct, VPC-SC, BigQuery, 0% Alucinação...",

  // About View
  aboutTitle: "Arquitetura do Sistema Agêntico e 5 Artigos Fundamentais",
  aboutSubtitle: "Projetada nos paradigmas ReAct, Toolformer, Generative Agents, Reflexion e AutoGen",
  tabPapers: "5 Artigos de Pesquisa",
  tabGraph: "Grafo de Conhecimento de 40M-Docs",
  tabLeaders: "IA Agêntica para Líderes",

  // Governance & VPC-SC View
  governanceTitle: "Segurança Zero-Trust e Governança Google Cloud",
  governanceSubtitle: "Perímetros VPC Service Controls, RBAC Firebase Auth e trilhas de auditoria imutáveis",
  vpcStatus: "Status do VPC Service Controls",
  auditTrail: "Registro Imutável de Auditoria de Conformidade",
};
