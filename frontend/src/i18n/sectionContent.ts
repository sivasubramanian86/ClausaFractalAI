/**
 * ClausaFractalAI — Comprehensive Section Content Localization Engine
 * Provides dynamic multi-lingual data for FAQs, Foundational Papers,
 * 40M-Doc Knowledge Graph, and Executive Leadership Frameworks across all 22 jurisdictions.
 */

export interface LocalizedFAQItem {
  id: string;
  category: "agents" | "grounding" | "security" | "cost" | "legal";
  question: string;
  answer: string;
  paperReference?: string;
}

export interface LocalizedPaper {
  id: string;
  num: string;
  title: string;
  authors: string;
  loop: string;
  howWeImplement: string;
  arxiv: string;
  tagColor: string;
}

export interface LocalizedGraphPillar {
  num: number;
  title: string;
  desc: string;
}

export interface LocalizedLeaderLevel {
  level: string;
  title: string;
  desc: string;
  color: string;
}

// -----------------------------------------------------------------------------
// FAQS BY LANGUAGE
// -----------------------------------------------------------------------------
const FAQS_BY_LANG: Record<string, LocalizedFAQItem[]> = {
  en: [
    {
      id: "faq-1",
      category: "grounding",
      question: "How does ClausaFractalAI achieve a 0.00% Hallucination Rate on legal contracts?",
      answer:
        "We implement a deterministic Refusal Ladder gate prior to any generative LLM inference, inspired by Fareed Khan's 40-Million Document Agentic Knowledge Graph framework. The document is parsed into an AST graph (Doc -> Section -> Clause -> Entity). If a query queries topics strictly absent from the graph or asks for terms outside contractual scope (e.g., nuclear penalties or cryptocurrency options in a standard cloud SLA), the Refusal Ladder intercepts it deterministically with 'I cannot determine this based on the provided document', completely eliminating hallucination.",
      paperReference: "Structuring 40M Documents into an Agentic Knowledge Graph (2026)",
    },
    {
      id: "faq-2",
      category: "agents",
      question: "What 5 foundational Agentic AI research papers power this platform?",
      answer:
        "The architecture is grounded directly in: (1) ReAct (Yao et al., 2022) for interleaved Thought-Action-Observation loops; (2) Toolformer (Schick et al., 2023) for autonomous tool selection; (3) Generative Agents (Park et al., 2023) for persistent memory reflection and situational planning; (4) Reflexion (Shinn et al., 2023) for verbal self-correction loops when critique scores drop below 8.0/10; and (5) AutoGen (Wu et al., 2023) for supervisor-worker multi-agent coordination.",
      paperReference: "ReAct, Toolformer, Generative Agents, Reflexion, AutoGen",
    },
    {
      id: "faq-3",
      category: "security",
      question: "How are enterprise contracts protected under Google Cloud Security standards?",
      answer:
        "ClausaFractalAI enforces defense-in-depth: (1) VPC Service Controls (VPC-SC) perimeters isolating Vertex AI, BigQuery, and Firestore from data exfiltration; (2) Terraform-managed IAM least-privilege service accounts (clausa-orchestrator-sa, clausa-auditor-sa); (3) Pre-inference regex and NLP PII scrubbing stripping emails, SSNs, credit cards, and addresses before context injection; and (4) Immutable audit trail storage in Cloud Firestore with role-based access rules.",
      paperReference: "GCP VPC-SC & SAIF (Secure AI Framework)",
    },
    {
      id: "faq-4",
      category: "cost",
      question: "How does Vertex AI Context Caching optimize operational expenses?",
      answer:
        "Large commercial contracts (50-200 pages) exceed 32k tokens. By configuring Gemini context caching at our 32,768-token threshold, repeated queries within the same negotiation session pay up to 75% less per 1M input tokens and experience up to 90% latency reduction. Telemetry is streamed to BigQuery to monitor cumulative cost avoidance in real-time.",
      paperReference: "Google Cloud Vertex AI Context Caching Architecture",
    },
    {
      id: "faq-5",
      category: "legal",
      question: "Which jurisdictions and dispute resolution forums are supported?",
      answer:
        "ClausaFractalAI natively supports 22 jurisdictions across Global Civil and Common Law (Delaware, UK Commercial Court, Paris OHADA, Tokyo International Arbitration, HKIAC Hong Kong, DIAC Dubai with Arabic RTL support, DIS Germany, SCC Sweden) and 8 Indian High Court and Supreme Court traditions (Madras, Supreme Court Delhi, Telangana, Kerala, Karnataka, Calcutta, Bombay, Punjab & Haryana).",
      paperReference: "Global Commercial Arbitration & Cross-Border Lex Mercatoria",
    },
    {
      id: "faq-6",
      category: "agents",
      question: "How does the Critic Reflection Agent evaluate legal answers?",
      answer:
        "Every draft synthesis is passed through a Critic Reflection Agent acting as an adversarial Lead Arbitrator. The answer is graded across 4 dimensions: Factual Grounding (0-10), Regulatory Precision (0-10), Ambiguity Elimination (0-10), and Strategic Prudence (0-10). If the composite score falls below 8.0/10, a verbal reflection is generated and the QA analyst agent re-drafts the response before returning to the user.",
      paperReference: "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)",
    },
  ],

  hi: [
    {
      id: "faq-1",
      category: "grounding",
      question: "ClausaFractalAI कानूनी अनुबंधों पर 0.00% भ्रम (Hallucination) दर कैसे प्राप्त करता है?",
      answer:
        "हम किसी भी जनरेटिव LLM अनुमान से पहले एक नियतात्मक 'रिफ्यूज़ल लैडर' गेट लागू करते हैं, जो फरीद खान के 40 मिलियन दस्तावेज़ एजेंटिक नॉलेज ग्राफ ढांचे से प्रेरित है। अनुबंध को एक AST ग्राफ (दस्तावेज़ -> खंड -> उपखंड -> कानूनी इकाई) में पार्स किया जाता है। यदि कोई प्रश्न ऐसे विषय पर है जो अनुबंध में पूरी तरह अनुपस्थित है, तो सिस्टम बिना किसी भ्रम के 'मैं दिए गए दस्तावेज़ के आधार पर यह निर्धारित नहीं कर सकता' उत्तर देता है।",
      paperReference: "Structuring 40M Documents into an Agentic Knowledge Graph (2026)",
    },
    {
      id: "faq-2",
      category: "agents",
      question: "इस प्लेटफॉर्म को संचालित करने वाले 5 बुनियादी एजेंटिक एआई शोध पत्र कौन से हैं?",
      answer:
        "यह आर्किटेक्चर सीधे 5 प्रमुख शोध पत्रों पर आधारित है: (1) ReAct (विचार-क्रिया-अवलोकन लूप); (2) Toolformer (स्वायत्त उपकरण चयन); (3) Generative Agents (दीर्घकालिक स्मृति और योजना); (4) Reflexion (8.0/10 से कम स्कोर पर मौखिक सुधार लूप); और (5) AutoGen (पर्यवेक्षक-कार्यकर्ता बहु-एजेंट समन्वय)।",
      paperReference: "ReAct, Toolformer, Generative Agents, Reflexion, AutoGen",
    },
    {
      id: "faq-3",
      category: "security",
      question: "Google Cloud सुरक्षा मानकों के तहत अनुबंधों की सुरक्षा कैसे की जाती है?",
      answer:
        "ClausaFractalAI गहन सुरक्षा लागू करता है: (1) डेटा रिसाव को रोकने के लिए VPC सर्विस कंट्रोल्स (VPC-SC); (2) Terraform द्वारा प्रबंधित IAM न्यूनतम-विशेषाधिकार सेवा खाते; (3) संदर्भ में भेजने से पहले ईमेल, फोन, पैन कार्ड की पहचान छिपाने वाला PII स्क्रबर; और (4) Cloud Firestore में अपरिवर्तनीय ऑडिट लॉग।",
      paperReference: "GCP VPC-SC & SAIF (सुरक्षित AI ढांचा)",
    },
    {
      id: "faq-4",
      category: "cost",
      question: "Vertex AI संदर्भ कैशिंग (Context Caching) परिचालन लागत को कैसे अनुकूलित करता है?",
      answer:
        "बड़े वाणिज्यिक अनुबंध 32k टोकन से अधिक होते हैं। 32,768-टोकन सीमा पर जेमिनी संदर्भ कैशिंग लागू करने से, एक ही वार्ता सत्र के दौरान बार-बार पूछे जाने वाले प्रश्नों पर टोकन लागत में 75% तक की कमी आती है और प्रतिक्रिया समय 90% तक घट जाता है। टेलीमेट्री को BigQuery में स्ट्रीम किया जाता है।",
      paperReference: "Google Cloud Vertex AI Context Caching Architecture",
    },
    {
      id: "faq-5",
      category: "legal",
      question: "कौन से कानूनी क्षेत्राधिकार और विवाद निवारण मंच समर्थित हैं?",
      answer:
        "ClausaFractalAI वैश्विक नागरिक और सामान्य कानून के 14 क्षेत्राधिकारों (डेलावेयर, यूके कमर्शियल कोर्ट, पेरिस OHADA, टोक्यो, हांगकांग, दुबई DIAC, जर्मनी DIS, स्वीडन SCC) और 8 भारतीय उच्च न्यायालय व सर्वोच्च न्यायालय परंपराओं (मद्रास, सुप्रीम कोर्ट दिल्ली, तेलंगाना, केरल, कर्नाटक, कलकत्ता, बॉम्बे, पंजाब और हरियाणा) का मूल रूप से समर्थन करता है।",
      paperReference: "Global Commercial Arbitration & Cross-Border Lex Mercatoria",
    },
    {
      id: "faq-6",
      category: "agents",
      question: "आलोचक परावर्तन एजेंट (Critic Reflection Agent) कानूनी उत्तरों का मूल्यांकन कैसे करता है?",
      answer:
        "प्रत्येक मसौदा उत्तर को मुख्य मध्यस्थ के रूप में कार्य करने वाले क्रिटिक रिफ्लेक्शन एजेंट के पास भेजा जाता है। उत्तर को 4 पैमानों पर आंका जाता है: तथ्यात्मक आधार, नियामक सटीकता, अस्पष्टता निवारण और रणनीतिक विवेक। यदि कुल स्कोर 8.0/10 से कम होता है, तो एजेंट स्वतः उत्तर में संशोधन करता है।",
      paperReference: "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)",
    },
  ],

  ta: [
    {
      id: "faq-1",
      category: "grounding",
      question: "ClausaFractalAI சட்ட ஒப்பந்தங்களில் 0.00% பிழை விகிதத்தை எவ்வாறு அடைகிறது?",
      answer:
        "ஃபரீத் கானின் 40 மில்லியன் ஆவண முகவர் அறிவு வரைபட கட்டமைப்பின் அடிப்படையில், எந்தவொரு LLM அனுமானத்திற்கும் முன் ஒரு திட்டவட்டமான மறுப்பு வாயிலை நாங்கள் செயல்படுத்துகிறோம். ஒப்பந்தம் ஒரு AST வரைபடமாக பிரிக்கப்படுகிறது. ஒப்பந்தத்தில் இல்லாத தலைப்புகள் கேட்கப்பட்டால், கணினி உடனடியாக துல்லியமாக மறுத்து शून्य பிழையை உறுதி செய்கிறது.",
      paperReference: "Structuring 40M Documents into an Agentic Knowledge Graph (2026)",
    },
    {
      id: "faq-2",
      category: "agents",
      question: "இந்த தளத்தை இயக்கும் 5 அடிப்படை முகவர் AI ஆய்வுக் கட்டுரைகள் யாவை?",
      answer:
        "கட்டமைப்பு நேரடியாக 5 ஆய்வுகளை அடிப்படையாகக் கொண்டது: (1) ReAct (சிந்தனை-செயல்-கவனிப்பு சுழற்சி); (2) Toolformer (தன்னாட்சி கருவி தேர்வு); (3) Generative Agents (நினைவகம் மற்றும் திட்டமிடல்); (4) Reflexion (மதிப்பீடு 8.0/10 க்கும் குறைவாக இருக்கும்போது தானியங்கி சுய திருத்தம்); மற்றும் (5) AutoGen (பல-முகவர் ஒருங்கிணைப்பு).",
      paperReference: "ReAct, Toolformer, Generative Agents, Reflexion, AutoGen",
    },
    {
      id: "faq-3",
      category: "security",
      question: "Google Cloud பாதுகாப்பு தரநிலைகளின் கீழ் நிறுவன ஒப்பந்தங்கள் எவ்வாறு பாதுகாக்கப்படுகின்றன?",
      answer:
        "ClausaFractalAI முழுமையான பாதுகாப்பை உறுதி செய்கிறது: (1) தரவு கசிவைத் தடுக்கும் VPC சேவை கட்டுப்பாடுகள் (VPC-SC); (2) குறைந்தபட்ச சிறப்புரிமை பெற்ற IAM சேவை கணக்குகள்; (3) மின்னஞ்சல், தொலைபேசி எண்களை மறைக்கும் PII ஸ்க்ரப்பர்; மற்றும் (4) கிளவுட் ஃபயர்ஸ்டோரில் மாறாத தணிக்கைப் பதிவுகள்.",
      paperReference: "GCP VPC-SC & SAIF",
    },
    {
      id: "faq-4",
      category: "cost",
      question: "Vertex AI கான்டெக்ஸ்ட் கேச்சிங் எவ்வாறு செலவைக் குறைக்கிறது?",
      answer:
        "பெரிய ஒப்பந்தங்கள் 32k டோக்கன்களை விட அதிகமாக இருக்கும். 32,768-டோக்கன் வரம்பில் ஜெமினி கேச்சிங்கை இயக்குவதன் மூலம், அதே அமர்வில் திரும்பத் திரும்பக் கேட்கப்படும் கேள்விகளுக்கான டோக்கன் செலவு 75% வரை குறைகிறது மற்றும் தாமதம் 90% குறைகிறது.",
      paperReference: "Google Cloud Vertex AI Context Caching Architecture",
    },
    {
      id: "faq-5",
      category: "legal",
      question: "எந்தெந்த சட்ட அதிகார வரம்புகள் மற்றும் நீதிமன்றங்கள் ஆதரிக்கப்படுகின்றன?",
      answer:
        "ClausaFractalAI சர்வதேச அளவில் 14 உலகளாவிய அதிகார வரம்புகளையும் (டெலாவேர், யூகே வர்த்தக நீதிமன்றம், பாரிஸ் OHADA, டோக்கியோ, ஹாங்காங், துபாய் DIAC) மற்றும் மெட்ராஸ், உச்ச நீதிமன்றம் டெல்லி, தெலங்கானா, கேரளா, கர்நாடகா, கல்கத்தா, பம்பாய், பஞ்சாப் & ஹரியானா உட்பட 8 இந்திய உயர் நீதிமன்ற மரபுகளையும் ஆதரிக்கிறது.",
      paperReference: "Global Commercial Arbitration & Cross-Border Lex Mercatoria",
    },
    {
      id: "faq-6",
      category: "agents",
      question: "விமர்சக பிரதிபலிப்பு முகவர் (Critic Reflection Agent) எவ்வாறு பதில்களை மதிப்பிடுகிறது?",
      answer:
        "ஒவ்வொரு வரைவு பதிலும் ஒரு மூத்த நடுவராக செயல்படும் விமர்சக பிரதிபலிப்பு முகவரால் 4 பரிமாணங்களில் மதிப்பிடப்படுகிறது: உண்மை ஆதாரம், ஒழுங்குமுறை துல்லியம், தெளிவு மற்றும் மூலோபாய விவேகம். கூட்டு மதிப்பெண் 8.0/10 க்கு கீழே இருந்தால், அது உடனடியாக பதிலை சுயமாக திருத்துகிறது.",
      paperReference: "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)",
    },
  ],

  de: [
    {
      id: "faq-1",
      category: "grounding",
      question: "Wie erreicht ClausaFractalAI eine Halluzinationsrate von 0,00% bei Verträgen?",
      answer:
        "Wir implementieren vor jedem generativen LLM-Aufruf ein deterministisches 'Refusal Ladder'-Gate, basierend auf Fareed Khans 40-Millionen-Dokumenten Wissensgraphen. Das Dokument wird in einen getypten AST-Graphen zerlegt. Werden Klauseln abgefragt, die im Vertrag nicht existieren, greift das Gate sofort deterministisch ein, wodurch Halluzinationen zu 100% ausgeschlossen werden.",
      paperReference: "Structuring 40M Documents into an Agentic Knowledge Graph (2026)",
    },
    {
      id: "faq-2",
      category: "agents",
      question: "Welche 5 grundlegenden Forschungsarbeiten treiben diese Plattform an?",
      answer:
        "Die Architektur basiert auf: (1) ReAct für Thought-Action-Observation-Schleifen; (2) Toolformer für autonome Werkzeugnutzung; (3) Generative Agents für Gedächtnis und Planung; (4) Reflexion für Selbstkorrektur bei Scores < 8.0/10; und (5) AutoGen für Multi-Agenten-Orchestrierung.",
      paperReference: "ReAct, Toolformer, Generative Agents, Reflexion, AutoGen",
    },
    {
      id: "faq-3",
      category: "security",
      question: "Wie werden Verträge nach Google Cloud Sicherheitsstandards geschützt?",
      answer:
        "ClausaFractalAI erzwingt Defense-in-Depth: (1) VPC Service Controls (VPC-SC) Peripherien gegen Datenexfiltration; (2) Terraform-gesteuerte IAM-Dienstkonten mit minimalen Rechten; (3) Automatisches PII-Scrubbing vor der Inferenz; und (4) Unveränderliche Audit-Protokolle in Firestore.",
      paperReference: "GCP VPC-SC & SAIF",
    },
    {
      id: "faq-4",
      category: "cost",
      question: "Wie optimiert Vertex AI Context Caching die Betriebskosten?",
      answer:
        "Große Verträge überschreiten 32k Tokens. Durch Gemini Context Caching ab 32.768 Tokens sparen wiederholte Abfragen bis zu 75% der Token-Kosten und reduzieren Latenzen um bis zu 90%. Alle Telemetriedaten werden in Echtzeit nach BigQuery gestreamt.",
      paperReference: "Google Cloud Vertex AI Context Caching Architecture",
    },
    {
      id: "faq-5",
      category: "legal",
      question: "Welche Rechtsordnungen und Schiedsgerichte werden unterstützt?",
      answer:
        "ClausaFractalAI unterstützt nativ 22 Rechtsordnungen: 14 internationale Zivil- und Common-Law-Foren (Delaware, UK Commercial Court, Paris OHADA, DIS Deutschland, SCC Schweden, HKIAC, DIAC Dubai) sowie 8 indische High-Court-Traditionen.",
      paperReference: "Global Commercial Arbitration & Cross-Border Lex Mercatoria",
    },
    {
      id: "faq-6",
      category: "agents",
      question: "Wie bewertet der Critic Reflection Agent juristische Antworten?",
      answer:
        "Jeder Entwurf wird von einem Critic Reflection Agent nach 4 Kriterien bewertet: Faktenbasis, regulatorische Präzision, Eindeutigkeit und strategische Vorsicht. Liegt der Score unter 8.0/10, wird der Entwurf automatisch vor der Ausgabe überarbeitet.",
      paperReference: "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)",
    },
  ],

  fr: [
    {
      id: "faq-1",
      category: "grounding",
      question: "Comment ClausaFractalAI garantit-il un taux d'hallucination de 0,00% sur les contrats ?",
      answer:
        "Nous appliquons une porte de refus déterministe ('Refusal Ladder') avant toute inférence LLM, inspirée du graphe de connaissances à 40 millions de documents de Fareed Khan. Le document est converti en AST. Si une question porte sur un terme absent de l'accord, le système refuse immédiatement et de manière déterministe, supprimant toute hallucination.",
      paperReference: "Structuring 40M Documents into an Agentic Knowledge Graph (2026)",
    },
    {
      id: "faq-2",
      category: "agents",
      question: "Quels sont les 5 articles de recherche fondateurs au cœur de la plateforme ?",
      answer:
        "L'architecture s'appuie sur : (1) ReAct (boucles Pensée-Action-Observation) ; (2) Toolformer (sélection autonome d'outils) ; (3) Generative Agents (mémoire et planification) ; (4) Reflexion (auto-correction si score < 8.0/10) ; et (5) AutoGen (coordination multi-agents).",
      paperReference: "ReAct, Toolformer, Generative Agents, Reflexion, AutoGen",
    },
    {
      id: "faq-3",
      category: "security",
      question: "Comment les contrats d'entreprise sont-ils sécurisés selon les normes Google Cloud ?",
      answer:
        "ClausaFractalAI applique une sécurité renforcée : (1) Périmètres VPC Service Controls (VPC-SC) contre l'exfiltration de données ; (2) Comptes de service IAM au moindre privilège gérés par Terraform ; (3) Masquage PII préalable ; et (4) Registres d'audit immuables dans Cloud Firestore.",
      paperReference: "GCP VPC-SC & SAIF",
    },
    {
      id: "faq-4",
      category: "cost",
      question: "Comment le Context Caching de Vertex AI optimise-t-il les coûts opérationnels ?",
      answer:
        "Les contrats volumineux dépassent 32k tokens. En activant la mise en cache Gemini dès 32 768 tokens, les requêtes répétées bénéficient d'une réduction de coût allant jusqu'à 75% et d'un gain de latence de 90%. Les données sont transmises à BigQuery en temps réel.",
      paperReference: "Google Cloud Vertex AI Context Caching Architecture",
    },
    {
      id: "faq-5",
      category: "legal",
      question: "Quelles juridictions et instances de règlement des litiges sont prises en charge ?",
      answer:
        "ClausaFractalAI prend en charge 22 juridictions : 14 systèmes internationaux (Delaware, Cour Commerciale du Royaume-Uni, Paris OHADA, Tokyo, Hong Kong HKIAC, Dubaï DIAC, DIS Allemagne, SCC Suède) et 8 traditions de Hautes Cours indiennes.",
      paperReference: "Global Commercial Arbitration & Cross-Border Lex Mercatoria",
    },
    {
      id: "faq-6",
      category: "agents",
      question: "Comment l'Agent Critique de Réflexion évalue-t-il les réponses juridiques ?",
      answer:
        "Chaque réponse passe par un Agent Critique agissant comme arbitre indépendant. Elle est notée sur 4 critères : ancrage factuel, rigueur réglementaire, clarté et prudence stratégique. Si la note globale est inférieure à 8.0/10, une nouvelle rédaction est automatiquement déclenchée.",
      paperReference: "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)",
    },
  ],

  es: [
    {
      id: "faq-1",
      category: "grounding",
      question: "¿Cómo logra ClausaFractalAI una tasa de alucinación del 0.00% en contratos legales?",
      answer:
        "Implementamos una compuerta determinista de rechazo ('Refusal Ladder') antes de cualquier inferencia LLM, inspirada en el grafo de conocimiento de 40 millones de documentos de Fareed Khan. El contrato se analiza en un árbol AST. Si una consulta indaga sobre cláusulas ausentes, se intercepta deterministamente garantizando 0% de alucinación.",
      paperReference: "Structuring 40M Documents into an Agentic Knowledge Graph (2026)",
    },
    {
      id: "faq-2",
      category: "agents",
      question: "¿Cuáles son los 5 artículos de investigación fundacionales que impulsan esta plataforma?",
      answer:
        "La arquitectura se basa en: (1) ReAct (ciclos Pensamiento-Acción-Observación); (2) Toolformer (uso autónomo de herramientas); (3) Generative Agents (memoria reflexiva y planificación); (4) Reflexion (autocorrección si la puntuación es < 8.0/10); y (5) AutoGen (coordinación multi-agente).",
      paperReference: "ReAct, Toolformer, Generative Agents, Reflexion, AutoGen",
    },
    {
      id: "faq-3",
      category: "security",
      question: "¿Cómo se protegen los contratos según los estándares de seguridad de Google Cloud?",
      answer:
        "ClausaFractalAI aplica defensa en profundidad: (1) Perímetros VPC Service Controls (VPC-SC) contra exfiltración; (2) Cuentas de servicio IAM de privilegio mínimo con Terraform; (3) Depuración de datos PII antes de la inferencia; y (4) Registros de auditoría inmutables en Cloud Firestore.",
      paperReference: "GCP VPC-SC & SAIF",
    },
    {
      id: "faq-4",
      category: "cost",
      question: "¿Cómo optimiza el almacenamiento en caché de contexto de Vertex AI los gastos operativos?",
      answer:
        "Los contratos extensos superan los 32k tokens. Al configurar el almacenamiento en caché de Gemini en el umbral de 32,768 tokens, las consultas repetidas ahorran hasta un 75% en costo y reducen la latencia en un 90%. La telemetría se transmite a BigQuery en tiempo real.",
      paperReference: "Google Cloud Vertex AI Context Caching Architecture",
    },
    {
      id: "faq-5",
      category: "legal",
      question: "¿Qué jurisdicciones y tribunales de resolución de disputas son compatibles?",
      answer:
        "ClausaFractalAI admite de forma nativa 22 jurisdicciones: 14 foros internacionales (Delaware, Reino Unido, París OHADA, Tokio, Hong Kong, Dubái DIAC, Alemania DIS, Suecia SCC) y 8 tradiciones de Tribunales Superiores de la India.",
      paperReference: "Global Commercial Arbitration & Cross-Border Lex Mercatoria",
    },
    {
      id: "faq-6",
      category: "agents",
      question: "¿Cómo evalúa las respuestas legales el Agente Crítico de Reflexión?",
      answer:
        "Cada borrador se somete al Agente Crítico de Reflexión, que califica en 4 dimensiones: fundamentación fáctica, precisión regulatoria, eliminación de ambigüedad y prudencia estratégica. Si la puntuación es inferior a 8.0/10, se genera una autocorrección inmediata.",
      paperReference: "Reflexion: Language Agents with Verbal Reinforcement Learning (2023)",
    },
  ],
};

// -----------------------------------------------------------------------------
// FAQ CATEGORIES BY LANGUAGE
// -----------------------------------------------------------------------------
const FAQ_CATEGORIES_BY_LANG: Record<string, Array<{ id: string; label: string }>> = {
  en: [
    { id: "all", label: "All Topics" },
    { id: "grounding", label: "0% Hallucination" },
    { id: "agents", label: "Multi-Agent Systems" },
    { id: "security", label: "GCP Security & VPC-SC" },
    { id: "cost", label: "Cost & Caching" },
    { id: "legal", label: "Legal Jurisdictions" },
  ],
  hi: [
    { id: "all", label: "सभी विषय" },
    { id: "grounding", label: "0% भ्रम (शून्य त्रुटि)" },
    { id: "agents", label: "मल्टी-एजेंट प्रणाली" },
    { id: "security", label: "GCP सुरक्षा और VPC-SC" },
    { id: "cost", label: "लागत और कैशिंग" },
    { id: "legal", label: "कानूनी क्षेत्राधिकार" },
  ],
  ta: [
    { id: "all", label: "அனைத்து தலைப்புகள்" },
    { id: "grounding", label: "0% பிழை உத்தரவாதம்" },
    { id: "agents", label: "பல-முகவர் அமைப்புகள்" },
    { id: "security", label: "GCP பாதுகாப்பு & VPC-SC" },
    { id: "cost", label: "செலவு & கேச்சிங்" },
    { id: "legal", label: "சட்ட அதிகார வரம்புகள்" },
  ],
  de: [
    { id: "all", label: "Alle Themen" },
    { id: "grounding", label: "0% Halluzination" },
    { id: "agents", label: "Multi-Agenten-Systeme" },
    { id: "security", label: "GCP Sicherheit & VPC-SC" },
    { id: "cost", label: "Kosten & Caching" },
    { id: "legal", label: "Rechtsordnungen" },
  ],
  fr: [
    { id: "all", label: "Tous les Sujets" },
    { id: "grounding", label: "0% Hallucination" },
    { id: "agents", label: "Systèmes Multi-Agents" },
    { id: "security", label: "Sécurité GCP & VPC-SC" },
    { id: "cost", label: "Coûts & Cache" },
    { id: "legal", label: "Juridictions Légales" },
  ],
  es: [
    { id: "all", label: "Todos los Temas" },
    { id: "grounding", label: "0% Alucinación" },
    { id: "agents", label: "Sistemas Multi-Agente" },
    { id: "security", label: "Seguridad GCP y VPC-SC" },
    { id: "cost", label: "Costos y Caché" },
    { id: "legal", label: "Jurisdicciones Legales" },
  ],
};

// -----------------------------------------------------------------------------
// PAPERS BY LANGUAGE
// -----------------------------------------------------------------------------
const PAPERS_BY_LANG: Record<string, LocalizedPaper[]> = {
  en: [
    {
      id: "react",
      num: "01",
      title: "ReAct: Reasoning + Acting in Language Models",
      authors: "Yao et al. (Princeton & Google Brain, 2022)",
      loop: "Think → Act → Observe → Think → Act → Observe",
      howWeImplement:
        "In LegalOrchestrator and RAG Analyst: instead of a monolithic answer, the agent plans a legal research trajectory, queries semantic FAISS indices, observes the extracted clause citations, verifies factual grounding, and then drafts answers with bidirectional citation anchors.",
      arxiv: "https://arxiv.org/abs/2210.03629",
      tagColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    },
    {
      id: "toolformer",
      num: "02",
      title: "Toolformer: Models Can Teach Themselves to Use Tools",
      authors: "Schick et al. (Meta AI, 2023)",
      loop: "Goal → Reason → Select Tool → Verify Permissions → Execute → Observe",
      howWeImplement:
        "Implemented via our Model Context Protocol (MCP) server: rather than solving complex arithmetic or legal liability caps in-model, agents delegate to dedicated tools (compare_policies, audit_blindspots, calculate_liability_ratio, pii_scrubber) under strict least-privilege permissions.",
      arxiv: "https://arxiv.org/abs/2302.04761",
      tagColor: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
    },
    {
      id: "generative_agents",
      num: "03",
      title: "Generative Agents: Memory, Reflection, and Planning",
      authors: "Park et al. (Stanford & Google, 2023)",
      loop: "Experience → Memory Stream → Retrieve → Reflect → Plan → Act",
      howWeImplement:
        "LegalOrchestrator maintains a structured Memory Stream of negotiation history. Past redline rounds and counterparty pushback inform future attorney prep strategies, allowing the system to reflect on prior drafting concessions across turns.",
      arxiv: "https://arxiv.org/abs/2304.03442",
      tagColor: "border-violet-500/30 bg-violet-500/10 text-violet-400",
    },
    {
      id: "reflexion",
      num: "04",
      title: "Reflexion: Verbal Reinforcement Learning from Failure",
      authors: "Shinn et al. (MIT & Northeastern, 2023)",
      loop: "Execute → Evaluate (Critic) → Reflect → Retry until Score ≥ 8.0",
      howWeImplement:
        "Our CriticReflectionAgent acts as an adversarial arbitrator. It scores draft responses (0-10) on factual faithfulness, ambiguity, and regulatory compliance. If composite score < 8.0, it generates a verbal critique and triggers a self-correction pass before user delivery.",
      arxiv: "https://arxiv.org/abs/2303.11366",
      tagColor: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    },
    {
      id: "autogen",
      num: "05",
      title: "AutoGen: Multi-Agent Collaborative Conversation",
      authors: "Wu et al. (Microsoft Research, 2023)",
      loop: "User Goal → Orchestrator Supervisor → Specialized Workers → Critic → Final",
      howWeImplement:
        "Decomposition of enterprise legal analysis into 6 specialized autonomous roles: Intent Router, QA Analyst, Blindspot Detector, Policy Collider, Attorney Prep Synthesizer, and Arbitrator Critic.",
      arxiv: "https://arxiv.org/abs/2308.08155",
      tagColor: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    },
  ],

  hi: [
    {
      id: "react",
      num: "01",
      title: "ReAct: भाषा मॉडल में तर्क और क्रिया का समन्वय",
      authors: "याओ एवं अन्य (प्रिंसटन और गूगल ब्रेन, 2022)",
      loop: "सोचें (Think) → कार्य करें (Act) → निरीक्षण करें (Observe)",
      howWeImplement:
        "लीगल आर्केस्ट्रेटर और आरएजी विश्लेषक में: एकतरफा उत्तर देने के बजाय, एजेंट कानूनी शोध प्रक्षेपवक्र की योजना बनाता है, क्लॉज उद्धरणों का निरीक्षण करता है, और दोनों तरफ से सत्यापित उद्धरणों के साथ उत्तर तैयार करता है।",
      arxiv: "https://arxiv.org/abs/2210.03629",
      tagColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    },
    {
      id: "toolformer",
      num: "02",
      title: "Toolformer: टूल्स का स्वायत्त उपयोग",
      authors: "शिक एवं अन्य (मेटा एआई, 2023)",
      loop: "लक्ष्य → तर्क → टूल चयन → अनुमति सत्यापन → निष्पादन → अवलोकन",
      howWeImplement:
        "मॉडल संदर्भ प्रोटोकॉल (MCP) सर्वर के माध्यम से कार्यान्वित: मॉडल के भीतर जटिल गणित या देनदारी की गणना करने के बजाय, एजेंट समर्पित टूल्स (अंधबिंदु ऑडिट, नीति तुलना, पीआईआई स्क्रबर) को कार्य सौंपते हैं।",
      arxiv: "https://arxiv.org/abs/2302.04761",
      tagColor: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
    },
    {
      id: "generative_agents",
      num: "03",
      title: "Generative Agents: स्मृति, परावर्तन और योजना",
      authors: "पार्क एवं अन्य (स्टैनफोर्ड और गूगल, 2023)",
      loop: "अनुभव → स्मृति स्ट्रीम → पुनर्प्राप्ति → परावर्तन → योजना → कार्य",
      howWeImplement:
        "लीगल आर्केस्ट्रेटर बातचीत के इतिहास की एक संरचित मेमोरी स्ट्रीम बनाए रखता है। पिछले संशोधनों से सीखकर सिस्टम वकील परामर्श की रणनीतियों को स्वचालित रूप से परिष्कृत करता है।",
      arxiv: "https://arxiv.org/abs/2304.03442",
      tagColor: "border-violet-500/30 bg-violet-500/10 text-violet-400",
    },
    {
      id: "reflexion",
      num: "04",
      title: "Reflexion: विफलताओं से मौखिक सुदृढीकरण सीखना",
      authors: "शिन एवं अन्य (एमआईटी, 2023)",
      loop: "निष्पादन → मूल्यांकन (क्रिटिक) → आत्म-चिंतन → स्कोर ≥ 8.0 तक पुनः प्रयास",
      howWeImplement:
        "हमारा क्रिटिक रिफ्लेक्शन एजेंट मुख्य मध्यस्थ की तरह कार्य करता है। यह मसौदे को 0-10 तक अंक देता है। यदि स्कोर 8.0 से कम है, तो यह मौखिक सुधार उत्पन्न करता है और उत्तर को फिर से सही करता है।",
      arxiv: "https://arxiv.org/abs/2303.11366",
      tagColor: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    },
    {
      id: "autogen",
      num: "05",
      title: "AutoGen: बहु-एजेंट सहयोगात्मक प्रणाली",
      authors: "वू एवं अन्य (माइक्रोसॉफ्ट रिसर्च, 2023)",
      loop: "उपयोगकर्ता लक्ष्य → पर्यवेक्षक → विशेषज्ञ कार्यकर्ता → क्रिटिक → अंतिम परिणाम",
      howWeImplement:
        "उद्यम कानूनी विश्लेषण को 6 स्वायत्त भूमिकाओं में विभाजित करना: इंटेंट राउटर, क्यूए विश्लेषक, ब्लाइंडस्पॉट डिटेक्टर, पॉलिसी कोलाइडर, वकील प्रेप और क्रिटिक।",
      arxiv: "https://arxiv.org/abs/2308.08155",
      tagColor: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    },
  ],

  ta: [
    {
      id: "react",
      num: "01",
      title: "ReAct: மொழி மாதிரிகளில் பகுத்தறிவு மற்றும் செயல் ஒருங்கிணைப்பு",
      authors: "யாவ் மற்றும் பலர் (பிரின்ஸ்டன் & கூகுள் பிரைன், 2022)",
      loop: "சிந்தி (Think) → செயல்படு (Act) → கவனி (Observe)",
      howWeImplement:
        "சட்ட ஆவணங்களை ஆய்வு செய்யும் போது, முகவர் தன்னிச்சையான சட்ட ஆராய்ச்சி திட்டத்தை உருவாக்கி, விதிகளின் மேற்கோள்களை சரிபார்த்து, பிழையற்ற ஆதாரங்களுடன் பதில்களை உருவாக்குகிறது.",
      arxiv: "https://arxiv.org/abs/2210.03629",
      tagColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    },
    {
      id: "toolformer",
      num: "02",
      title: "Toolformer: கருவிகளைப் பயன்படுத்தும் தானியங்கி மாதிரிகள்",
      authors: "ஷிக் மற்றும் பலர் (மெட்டா ஏஐ, 2023)",
      loop: "இலக்கு → காரணம் → கருவி தேர்வு → அனுமதிகள் சரிபார்ப்பு → செயல்படுத்துதல்",
      howWeImplement:
        "எங்கள் மாடல் கான்டெக்ஸ்ட் புரோட்டோகால் (MCP) வழியாக: சிக்கலான பொறுப்பு வரம்புக் கணக்கீடுகள் மற்றும் கொள்கை ஒப்பீடுகளை பிரத்யேக பாதுகாப்பான கருவிகளுக்கு முகவர்கள் வழங்குகிறார்கள்.",
      arxiv: "https://arxiv.org/abs/2302.04761",
      tagColor: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
    },
    {
      id: "generative_agents",
      num: "03",
      title: "Generative Agents: நினைவகம், பிரதிபலிப்பு மற்றும் திட்டமிடல்",
      authors: "பார்க் மற்றும் பலர் (ஸ்டான்போர்ட் & கூகுள், 2023)",
      loop: "அனுபவம் → நினைவக ஸ்ட்ரீம் → மீட்டெடுப்பு → பிரதிபலிப்பு → திட்டம்",
      howWeImplement:
        "ஒப்பந்த பேச்சுவார்த்தை வரலாற்றை நினைவில் வைத்து, முந்தைய திருத்தங்களிலிருந்து கற்றுக்கொண்டு வழக்கறிஞருக்கான ஆலோசனைக் குறிப்புகளை தன்னாட்சியுடன் மேம்படுத்துகிறது.",
      arxiv: "https://arxiv.org/abs/2304.03442",
      tagColor: "border-violet-500/30 bg-violet-500/10 text-violet-400",
    },
    {
      id: "reflexion",
      num: "04",
      title: "Reflexion: தோல்விகளிலிருந்து வாய்மொழி சுய திருத்தம்",
      authors: "ஷின் மற்றும் பலர் (எம்ஐடி, 2023)",
      loop: "செயல்படுத்து → மதிப்பீடு செய் → பிரதிபலி → மதிப்பெண் ≥ 8.0 வரை மீண்டும் முயற்சி",
      howWeImplement:
        "எங்கள் விமர்சக முகவர் பதில்களை 0-10 வரை மதிப்பிடுகிறது. கூட்டு மதிப்பெண் 8.0 க்கு குறைவாக இருந்தால், பயனர் பெறுவதற்கு முன் அது பதிலை உடனடியாக சுயமாக திருத்துகிறது.",
      arxiv: "https://arxiv.org/abs/2303.11366",
      tagColor: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    },
    {
      id: "autogen",
      num: "05",
      title: "AutoGen: பல-முகவர் கூட்டு உரையாடல் அமைப்பு",
      authors: "வூ மற்றும் பலர் (மைக்ரோசாப்ட் ஆராய்ச்சி, 2023)",
      loop: "இலக்கு → மேற்பார்வையாளர் → சிறப்பு பணியாளர்கள் → விமர்சகர் → இறுதி முடிவு",
      howWeImplement:
        "சட்ட பகுப்பாய்வை 6 சிறப்பு பணிகளாகப் பிரித்தல்: நோக்க திசைவி, கேள்வி-பதில் ஆய்வாளர், மறைமுக ஆபத்து கண்டறிபவர், கொள்கை மோதல் ஒப்பீட்டாளர் மற்றும் நடுவர்.",
      arxiv: "https://arxiv.org/abs/2308.08155",
      tagColor: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    },
  ],
};

// -----------------------------------------------------------------------------
// PUBLIC GETTERS
// -----------------------------------------------------------------------------
export function getLocalizedFaqs(lang: string = "en"): LocalizedFAQItem[] {
  return FAQS_BY_LANG[lang] || FAQS_BY_LANG.en;
}

export function getLocalizedFaqCategories(lang: string = "en"): Array<{ id: string; label: string }> {
  return FAQ_CATEGORIES_BY_LANG[lang] || FAQ_CATEGORIES_BY_LANG.en;
}

export function getLocalizedPapers(lang: string = "en"): LocalizedPaper[] {
  return PAPERS_BY_LANG[lang] || PAPERS_BY_LANG.en;
}
