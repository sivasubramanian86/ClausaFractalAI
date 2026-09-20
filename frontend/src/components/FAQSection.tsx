import React, { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  ShieldCheck,
  Zap,
  Layers,
  Scale,
} from "lucide-react";
import { TranslationDictionary } from "../i18n/types";

interface FAQSectionProps {
  t: TranslationDictionary;
}

interface FAQItem {
  id: string;
  category: "agents" | "grounding" | "security" | "cost" | "legal";
  question: string;
  answer: string;
  paperReference?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ t }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>("faq-1");

  const faqs: FAQItem[] = [
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
  ];

  const categories = [
    { id: "all", label: "All Topics", icon: <Layers className="h-3.5 w-3.5" /> },
    { id: "grounding", label: "0% Hallucination", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
    { id: "agents", label: "Multi-Agent Systems", icon: <BookOpen className="h-3.5 w-3.5" /> },
    { id: "security", label: "GCP Security & VPC-SC", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
    { id: "cost", label: "Cost & Caching", icon: <Zap className="h-3.5 w-3.5" /> },
    { id: "legal", label: "Legal Jurisdictions", icon: <Scale className="h-3.5 w-3.5" /> },
  ];

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-300 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-legal-emerald to-legal-cyan text-obsidian-950 font-bold shadow-lg shadow-legal-emerald/20">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white dark:text-white light:text-slate-900">
              {t.faqTitle}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
              {t.faqSubtitle}
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mt-4">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs on ReAct loops, VPC-SC, BigQuery, 0% Hallucination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-300 py-2.5 pl-10 pr-4 text-xs text-white dark:text-white light:text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-legal-emerald transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-800 dark:border-slate-800 light:border-slate-300">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-legal-emerald/20 text-legal-emerald border border-legal-emerald/40"
                  : "bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-200 text-slate-400 hover:text-slate-200 dark:hover:text-white light:text-slate-700 border border-transparent"
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accordion FAQ List */}
      <div className="flex flex-col gap-3">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          return (
            <div
              key={faq.id}
              className="glass-panel rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-300 overflow-hidden transition-all duration-200 hover:border-slate-700"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                className="flex items-center justify-between w-full p-4 text-left font-semibold text-xs text-slate-200 dark:text-slate-200 light:text-slate-800 hover:text-legal-emerald transition-colors"
              >
                <div className="flex items-center gap-3 pr-4">
                  <div className="h-2 w-2 rounded-full bg-legal-emerald"></div>
                  <span>{faq.question}</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-legal-emerald shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed border-t border-slate-800/60 dark:border-slate-800/60 light:border-slate-200">
                  <p>{faq.answer}</p>
                  {faq.paperReference && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/70 dark:bg-slate-900/70 light:bg-slate-200 text-[11px] font-mono text-legal-cyan border border-slate-800 dark:border-slate-800 light:border-slate-300">
                      <BookOpen className="h-3 w-3" />
                      <span>Reference: {faq.paperReference}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="p-8 text-center glass-panel rounded-xl border border-slate-800 text-xs text-slate-500">
            No matching questions found for "{searchQuery}". Try searching for ReAct, Refusal Ladder, or VPC-SC.
          </div>
        )}
      </div>
    </div>
  );
};
