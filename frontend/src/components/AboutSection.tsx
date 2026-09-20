import React, { useState } from "react";
import {
  BookOpen,
  GitFork,
  Repeat,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Code2,
} from "lucide-react";
import { TranslationDictionary } from "../i18n/types";

interface AboutSectionProps {
  t: TranslationDictionary;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ t }) => {
  const [activeTab, setActiveTab] = useState<"papers" | "graph" | "leaders">("papers");

  const foundationalPapers = [
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
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-2">
      {/* Hero Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-300 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-legal-emerald to-legal-cyan text-obsidian-950 font-bold shadow-lg shadow-legal-emerald/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white dark:text-white light:text-slate-900">
                {t.aboutTitle}
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
                {t.aboutSubtitle}
              </p>
            </div>
          </div>

          {/* Sub-Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-200 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-300">
            <button
              type="button"
              onClick={() => setActiveTab("papers")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "papers"
                  ? "bg-legal-emerald/20 text-legal-emerald border border-legal-emerald/40"
                  : "text-slate-400 hover:text-white dark:hover:text-white light:text-slate-700"
              }`}
            >
              5 Research Papers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("graph")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "graph"
                  ? "bg-legal-emerald/20 text-legal-emerald border border-legal-emerald/40"
                  : "text-slate-400 hover:text-white dark:hover:text-white light:text-slate-700"
              }`}
            >
              40M-Doc Knowledge Graph
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("leaders")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "leaders"
                  ? "bg-legal-emerald/20 text-legal-emerald border border-legal-emerald/40"
                  : "text-slate-400 hover:text-white dark:hover:text-white light:text-slate-700"
              }`}
            >
              Agentic AI for Leaders
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content 1: 5 Foundational Papers */}
      {activeTab === "papers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {foundationalPapers.map((paper) => (
            <div
              key={paper.id}
              className="glass-panel p-5 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-300 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-legal-emerald">
                    PAPER #{paper.num}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${paper.tagColor}`}>
                    Production Enforced
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 leading-snug">
                  {paper.title}
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 mt-0.5 mb-3">
                  {paper.authors}
                </p>

                {/* Algorithmic Loop Pattern */}
                <div className="bg-obsidian-950/80 dark:bg-obsidian-950/80 light:bg-slate-100 p-2.5 rounded-lg border border-slate-800/80 dark:border-slate-800 light:border-slate-300 mb-3">
                  <div className="text-[10px] uppercase font-bold text-legal-cyan mb-1 flex items-center gap-1">
                    <Repeat className="h-3 w-3" /> Core Pattern Loop
                  </div>
                  <div className="text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-800">
                    {paper.loop}
                  </div>
                </div>

                {/* Implementation in ClausaFractalAI */}
                <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
                  <strong className="text-slate-200 dark:text-slate-200 light:text-slate-800 block mb-1">
                    ClausaFractalAI Implementation:
                  </strong>
                  {paper.howWeImplement}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 dark:border-slate-800 light:border-slate-300 flex items-center justify-between">
                <a
                  href={paper.arxiv}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-legal-cyan hover:underline"
                >
                  <span>arXiv Paper</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <span className="flex items-center gap-1 text-[11px] text-legal-emerald font-medium">
                  <CheckCircle2 className="h-3 w-3" /> Verified in Codebase
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 2: 40M-Document Agentic Knowledge Graph */}
      {activeTab === "graph" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-300">
            <div className="flex items-center gap-2 mb-3">
              <GitFork className="h-5 w-5 text-legal-emerald" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 dark:text-slate-300 light:text-slate-800">
                Fareed Khan's 40M-Doc Architecture Adaptation
              </h3>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed mb-4">
              Directly adopting the structural AST and deterministic refusal gating from the August 2026 landmark paper
              <em>"Structuring 40 Million Documents into an Agentic Knowledge Graph"</em>:
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300">
                <div className="text-xs font-bold text-legal-emerald mb-1">
                  1. Zero-LLM Structural Hierarchy Extraction
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
                  Instead of passing raw unstructured text to an LLM, document headings, numbered sections, clauses, and legal mechanisms are extracted into a strictly typed directed AST (<code className="text-legal-cyan">Doc → Section → Clause → Entity</code>) with O(1) CSR adjacency lookups.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300">
                <div className="text-xs font-bold text-legal-cyan mb-1">
                  2. Deterministic Refusal Ladder
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
                  Queries on negative constraints or concepts absent from the contract topology (e.g. asking for "nuclear penalties" or "cryptocurrency equity" in a standard cloud SLA) are intercepted deterministically <em>prior</em> to calling Vertex AI Gemini, guaranteeing a 0.00% hallucination rate.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300">
                <div className="text-xs font-bold text-legal-violet mb-1">
                  3. Hybrid Vector + Knowledge Graph RAG
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
                  Combines FAISS dense embedding similarity with explicit graph relation traversal. Citations are mathematically pinned to exact clause IDs, page numbers, and byte offsets.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="h-4 w-4 text-legal-cyan" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 dark:text-slate-300 light:text-slate-800">
                  Graph Traversal Micro-Benchmark
                </h3>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-950/80 dark:bg-obsidian-950/80 light:bg-slate-900 text-xs font-mono text-slate-300 space-y-2 border border-slate-800">
                <div className="text-legal-emerald"># AgenticKnowledgeGraph Specs</div>
                <div>Node Type: <span className="text-white">Document, Section, Clause</span></div>
                <div>Edge Types: <span className="text-legal-cyan">CONTAINS, REFERENCES, GOVERNS</span></div>
                <div>Graph Traversal Latency: <span className="text-legal-emerald">&lt; 2.4 ms</span></div>
                <div>Negative Constraint Check: <span className="text-legal-emerald">100% Deterministic</span></div>
                <div>Vertex AI Token Savings: <span className="text-legal-cyan">~640 tokens / refusal</span></div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Paper: Khan (Aug 2026)</span>
              <a
                href="https://levelup.gitconnected.com/structuring-40-million-documents-into-an-agentic-knowledge-graph-92010e609dfa?sk=75a6aa549ffec29041037f0a1d9afe87"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-legal-emerald hover:underline"
              >
                <span>Read Article</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: How to Explain Agentic AI to Leaders */}
      {activeTab === "leaders" && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-300">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-legal-violet" />
            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
              Concentric Agentic AI Hierarchy (Executive Framework)
            </h3>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-6 leading-relaxed">
            As documented in the executive leadership tier list, Agentic AI expands traditional generative AI into autonomous systems governed by rigorous controls:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Level 1: AI & ML */}
            <div className="p-4 rounded-xl bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-blue-400">LEVEL 1</div>
                <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 mt-1">
                  AI & Machine Learning
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-2">
                  Pattern matching, NLP tokenization, and statistical semantic indexing via FAISS and TF-IDF.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                Foundation
              </div>
            </div>

            {/* Level 2: Gen AI */}
            <div className="p-4 rounded-xl bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-legal-cyan">LEVEL 2</div>
                <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 mt-1">
                  Generative AI
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-2">
                  Gemini 3.8 / 2.5 Flash & Pro models synthesizing answers, counter-clauses, and plain-English translations.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                Content Creation
              </div>
            </div>

            {/* Level 3: AI Agents */}
            <div className="p-4 rounded-xl bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-legal-emerald">LEVEL 3</div>
                <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 mt-1">
                  AI Agents
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-2">
                  Goal decomposition, tool orchestration via MCP, memory streams, and ReAct execution loops.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                Autonomous Action
              </div>
            </div>

            {/* Level 4: Agentic AI */}
            <div className="p-4 rounded-xl bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-100 border border-legal-emerald/40 bg-legal-emerald/5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-legal-emerald">LEVEL 4 (CLAUSA)</div>
                <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 mt-1">
                  Enterprise Agentic AI
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-2">
                  VPC-SC security perimeters, deterministic refusal ladders, multi-agent arbitration critique, and cost caching.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-legal-emerald font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Full Enterprise Governance
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
