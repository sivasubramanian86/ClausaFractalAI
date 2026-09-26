import { TranslationDictionary } from "../types";

export const tr: TranslationDictionary = {
  // Brand & Header
  appTitle: "ClausaFractalAI",
  subtitle: "Otonom Hukuki Belge Zekası ve Eylem Platformu",
  zeroHallucinationBadge: "Sıfır Halüsinasyon Doğrulaması Aktif",
  citationBadge: "Alıntı Doğrulandı",
  zeroKeyBadge: "Vertex AI ADC Anahtarsız",
  exclusiveBadge: "PromptWars Özel",

  // Navigation
  navStudio: "Stüdyo Çalışma Alanı",
  navCourtroom: "Yargı Odası ve Kanun",
  navMesh: "Nöro-Sembolik Ağ",
  navAnalytics: "Analitik ve Telemetri",
  navFaq: "Hukuk AI SSS",
  navAbout: "Ajan Mimarisi",
  navGovernance: "Yönetişim ve VPC-SC",

  // Theme & Roles
  themeDark: "Karanlık Mod",
  themeLight: "Aydınlık Mod",
  roleCounsel: "Genel Hukuk Müşaviri",
  roleArbitrator: "Baş Hakem",
  roleAuditor: "Risk Denetçisi",
  roleFounder: "Girişim Kurucusu",

  // Studio Workspace
  uploadPrompt: "Hukuki PDF veya sözleşme görselini buraya sürükleyip bırakın",
  uploadButton: "Sözleşme Yükle",
  activeDoc: "Aktif Belge",
  tabChat: "Doğrulanabilir Sohbet",
  tabBlindspots: "Kör Nokta Matrisi",
  tabPolicyCollider: "Politika Çarpıştırıcı",
  tabAttorneyPrep: "Avukat Hazırlık Formu",
  tabCounterClauses: "Madde Yeniden Yazıcı",
  tabCourtroom: "Yargı ve Kanun",
  sliderLabel: "Açıklama Derinliği",
  eli5: "Basit Anlatım (ELI5)",
  standard: "Standart",
  counsel: "Uzman Hukukçu",
  paranoid: "Sıkı Risk İncelemesi",
  askPlaceholder: "Bu sözleşme hakkında bir soru sorun...",
  voiceButtonAria: "Mikrofonla hukuki soru dikte edin",
  sendButton: "Analiz Et",
  attorneyExportButton: "Hazırlık Formunu Dışa Aktar",

  // Document Viewer
  docViewerTitle: "Belge Görüntüleyici",
  docViewerSubtitle: "Kurumsal düzeyde PDF ve sözleşme işleme aşaması",
  pageOf: "Sayfa {current} / {total}",
  zoomIn: "Yakınlaştır",
  zoomOut: "Uzaklaştır",
  dropFile: "PDF sözleşmesini buraya bırakın veya",
  browseFile: "Dosyaya Göz At",
  uploadVoiceNote: "Ses / Ses Kaydı Yükle",
  citationHighlightTitle: "Etkileşimli Alıntı Vurgulama",
  citationHighlightDesc: "Stüdyoda herhangi bir hukuki alıntıya tıklandığında kaynak metin anında vurgulanır.",

  // Chat Interface
  reasoningDepth: "Muhakeme Derinliği",
  verifiedCitations: "Dayanaklı Alıntılar",
  suggestedPrompts: "Önerilen Hukuki Sorular",
  promptLiability: "Toplam sorumluluk üst sınırı nedir?",
  promptIndemnity: "Tek taraflı tazminat maddeleri var mı?",
  promptNonCompete: "Bu anlaşma rekabet etmeme kısıtlamaları içeriyor mu?",

  // Blindspot Matrix
  blindspotTitle: "Kör Nokta ve Risk Matrisi",
  auditButton: "Belgeyi Denetle",
  auditingButton: "Belge denetleniyor...",
  baselineCompliance: "Temel Uyumluluk Puanı:",
  criticalOmissions: "kritik eksiklik",
  colOmittedClause: "Eksik Madde Başlığı",
  colSeverity: "Önem Derecesi",
  colRiskImpact: "Risk Etkisi",
  colSuggestedLanguage: "Önerilen Eksik Metin",
  noOmissionsDetected: "Standart tabana göre hiçbir kritik eksiklik tespit edilmedi.",

  // Policy Collider
  colliderTitle: "Politika Çarpışma ve Fark Karşılaştırıcı",
  colliderSubtitle: "Temel politikayı karşı tarafın revizyonlarıyla karşılaştırın",
  compareButton: "Sürümleri Karşılaştır",
  comparingButton: "Karşılaştırılıyor...",
  rightsSurrendered: "FERAGAT EDİLEN HAKLAR",
  liabilityEscalated: "ARTAN SORUMLULUK",
  benefitGained: "ELDE EDİLEN KAZANIM",
  neutralShift: "NÖTR DEĞİŞİKLİK",
  colTopic: "Konu",
  colPreviousTerms: "Önceki Şartlar",
  colProposedTerms: "Önerilen Şartlar",
  colStrategicImpact: "Stratejik Etki",

  // Attorney Prep
  prepSheetTitle: "Avukat Danışmanlık Hazırlık Formu",
  generatePrepButton: "Hazırlık Formu Oluştur",
  generatingPrepButton: "Oluşturuluyor...",
  exportPrepButton: "Formu Dışa Aktar",
  executiveSummaryTitle: "Yönetici Özeti",
  criticalRedFlagsTitle: "Kritik Uyarı İşaretleri (Kırmızı Bayraklar)",
  questionsForCounselTitle: "Hukuk Müşavirine Sorulacak Sorular",
  negotiationLeverageTitle: "Müzakere Kozları",
  hourlySavingsNotice: "Yaklaşık 2.5 saatlik avukatlık hazırlık süresi ve maliyeti tasarrufu sağlandı.",

  // Counter Clause
  counterClauseTitle: "Müzakere Karşı-Madde Yeniden Yazıcı",
  clauseDomainLabel: "Madde Alanı:",
  originalClauseLabel: "Orijinal Ağır Madde:",
  rewriteButton: "Dengeli Karşı-Madde Taslağı Hazırla",
  rewritingButton: "Taslak hazırlanıyor...",
  proposedCounterTitle: "Önerilen Dengeli Karşı-Madde",
  strategicRationaleTitle: "Stratejik Gerekçe",
  negotiationTacticTitle: "Müzakere Taktiği",

  // Courtroom & Judicial Codex
  courtroomTitle: "Yargı Odası ve Yasal Kanunlar",
  tabBench: "Mahkeme Heyeti (Karar)",
  tabAdvocate: "Kıdemli Avukat Harekât Merkezi",
  tabDossier: "Dava Dosyası ve Deliller",
  tabCodex: "Yasal Kanunlar (Mevzuat Elinizin Altında)",
  btnAnalyzeCase: "Davayı İncele ve Hüküm Ver",
  btnAnalyzingCase: "Hüküm müzakere ediliyor...",
  judicialVerdictTitle: "Yüksek Mahkeme Kararı ve Hükümleri",
  ratioDecidendiTitle: "Ratio Decidendi (Bağlayıcı Hukuki İlke)",
  obiterDictaTitle: "Obiter Dicta (Yargısal Gözlemler)",
  advocateStrategyTitle: "Kıdemli Dava Avukatı Stratejisi (BA LLB, LLM)",
  winProbabilityTitle: "Dava Kazanma İhtimali Hesabı",
  prosecutionStrengthsTitle: "İddia Makamı / Davacı Güçlü Yönleri",
  defenseShieldsTitle: "Savunma Makamı Kalkanları ve İndirim Nedenleri",
  crossExamTrapsTitle: "Tanık Çapraz Sorgu Tuzakları",
  gcsDemoDataTitle: "Google Cloud Storage (GCS) Delil Kataloğu",
  codexSearchPlaceholder: "Tüm yargı alanlarındaki yasaları ve maddeleri arayın...",
  codexCategoryAll: "Tüm Yargı Alanları ve Kategoriler",

  // Neuro-Symbolic Mesh
  meshTitle: "Çift Geçişli Nöro-Sembolik Ajan Ağı",
  meshSubtitle: "Sistem 1 Nöral Algı (Gemini 3.8) + Sistem 2 Biçimsel Matematiksel Doğrulama (Z3 Çözücü)",
  clauseToVerifyLabel: "Biçimsel Olarak Doğrulanacak Sözleşme Maddesi:",
  btnVerifyZ3: "Biçimsel Doğrulamayı Çalıştır",
  btnVerifyingZ3: "Değişmezler Kanıtlanıyor...",
  satReadyBadge: "Z3 Teorem Çözücü: SAT Hazır",
  watchdogBadge: "Bekçi: ≤5 Atlama",

  // Analytics & BigQuery View
  analyticsTitle: "BigQuery Kurumsal Hukuk Telemetrisi",
  analyticsSubtitle: "Gerçek zamanlı token maliyet verimliliği, yanıt süreleri ve madde riski",
  totalCachedTokens: "Bağlamda Önbelleğe Alınan Tokenlar",
  costSavedUsd: "Tasarruf Edilen Çıkarım Maliyeti",
  avgLatency: "Ortalama Yanıt Süresi",
  hallucinationRate: "Ölçülen Halüsinasyon Oranı",
  clauseRiskDistribution: "Denetlenen Risklerin Dağılımı",

  // FAQ View
  faqTitle: "Sıkça Sorulan Sorular",
  faqSubtitle: "Çoklu ajan orkestrasyonu ve sıfır halüsinasyon garantisi hakkında detaylar",
  searchFaqPlaceholder: "ReAct, VPC-SC, BigQuery, %0 Halüsinasyon hakkında arayın...",

  // About View
  aboutTitle: "Ajan Sistemi Mimarisi ve 5 Temel Araştırma Makalesi",
  aboutSubtitle: "ReAct, Toolformer, Generative Agents, Reflexion ve AutoGen paradigmaları üzerine inşa edildi",
  tabPapers: "5 Araştırma Makalesi",
  tabGraph: "40 Milyon Belgeli Bilgi Grafı",
  tabLeaders: "Liderler için Ajanik AI",

  // Governance & VPC-SC View
  governanceTitle: "Sıfır Güven Güvenliği ve Google Cloud Yönetişimi",
  governanceSubtitle: "VPC Service Controls sınırları, Firebase Auth RBAC ve değişmez denetim kayıtları",
  vpcStatus: "VPC Service Controls Durumu",
  auditTrail: "Değiştirilemez Uyumluluk Denetim Kaydı",
};
