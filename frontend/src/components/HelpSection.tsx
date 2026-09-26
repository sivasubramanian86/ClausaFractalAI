import React from "react";
import { ArrowRight, BookOpen, FileText, Gavel, MessageCircleQuestion } from "lucide-react";
import { NavView } from "./Navigation";

export const HelpSection: React.FC<{ onNavigate: (view: NavView) => void }> = ({ onNavigate }) => (
  <section className="mx-auto w-full max-w-5xl space-y-6">
    <header>
      <p className="text-sm font-semibold text-emerald-500">CLAUSAFRACTALAI SUPPORT</p>
      <h1 className="mt-2 text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Help Center</h1>
      <p className="mt-2" style={{ color: "var(--text-muted)" }}>Get started with grounded contract analysis and find answers about the platform.</p>
    </header>
    <div className="grid gap-4 md:grid-cols-2">
      {[
        { title: "Review a contract", text: "Open Studio, upload a document, then inspect extracted clauses, risks, and grounded answers.", icon: FileText, view: "studio" as const },
        { title: "Explore a case", text: "Use Judicial Chamber to review a case dossier, statutory references, and analysis.", icon: Gavel, view: "courtroom" as const },
        { title: "Read common answers", text: "Browse product and legal AI questions in the FAQ.", icon: MessageCircleQuestion, view: "faq" as const },
        { title: "Understand the system", text: "See how the application components and grounding flow fit together.", icon: BookOpen, view: "about" as const },
      ].map(({ title, text, icon: Icon, view }) => (
        <button key={title} onClick={() => onNavigate(view)} className="glass-panel rounded-2xl border p-5 text-left transition hover:border-emerald-500/50" style={{ borderColor: "var(--border-default)" }}>
          <Icon className="h-5 w-5 text-emerald-500" />
          <h2 className="mt-3 font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{text}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-500">Open section <ArrowRight className="h-4 w-4" /></span>
        </button>
      ))}
    </div>
  </section>
);
