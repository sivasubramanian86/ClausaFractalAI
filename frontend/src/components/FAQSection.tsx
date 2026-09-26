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

import { getLocalizedFaqs, getLocalizedFaqCategories } from "../i18n/sectionContent";
import { LanguageCode } from "../types";

interface FAQSectionProps {
  t: TranslationDictionary;
  lang?: LanguageCode | string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ t, lang = "en" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>("faq-1");

  const faqs = getLocalizedFaqs(lang);
  const rawCategories = getLocalizedFaqCategories(lang);

  const iconMap: Record<string, React.ReactNode> = {
    all: <Layers className="h-3.5 w-3.5" />,
    grounding: <ShieldCheck className="h-3.5 w-3.5" />,
    agents: <BookOpen className="h-3.5 w-3.5" />,
    security: <ShieldCheck className="h-3.5 w-3.5" />,
    cost: <Zap className="h-3.5 w-3.5" />,
    legal: <Scale className="h-3.5 w-3.5" />,
  };

  const categories = rawCategories.map((c) => ({
    ...c,
    icon: iconMap[c.id],
  }));

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
            placeholder={t.searchFaqPlaceholder || "Search FAQs on ReAct loops, VPC-SC, BigQuery, 0% Hallucination..."}
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
