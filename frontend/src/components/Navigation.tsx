import React from "react";
import { Scale, BarChart3, HelpCircle, Info, ShieldCheck, Cpu, Gavel } from "lucide-react";
import { TranslationDictionary } from "../i18n/types";

export type NavView =
  | "studio"
  | "courtroom"
  | "mesh"
  | "analytics"
  | "faq"
  | "about"
  | "governance";

interface NavigationProps {
  activeView: NavView;
  onViewChange: (view: NavView) => void;
  t: TranslationDictionary;
}

export const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange, t }) => {
  const navItems: Array<{ id: NavView; label: string; icon: React.ReactNode }> = [
    { id: "studio", label: t.navStudio, icon: <Scale className="h-4 w-4" /> },
    {
      id: "courtroom",
      label: "Judicial Chamber & Codex",
      icon: <Gavel className="h-4 w-4 text-amber-400" />,
    },
    { id: "mesh", label: "Neuro-Symbolic Mesh", icon: <Cpu className="h-4 w-4" /> },
    { id: "analytics", label: t.navAnalytics, icon: <BarChart3 className="h-4 w-4" /> },
    { id: "faq", label: t.navFaq, icon: <HelpCircle className="h-4 w-4" /> },
    { id: "about", label: t.navAbout, icon: <Info className="h-4 w-4" /> },
    { id: "governance", label: t.navGovernance, icon: <ShieldCheck className="h-4 w-4" /> },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Main Application Sections"
      className="mx-auto flex w-full max-w-7xl items-center justify-start gap-2 px-4 md:px-6 pt-4 overflow-x-auto"
    >
      <div className="flex items-center gap-1 rounded-xl p-1 bg-slate-900/60 dark:bg-slate-900/80 light:bg-slate-200 border border-slate-800/80 dark:border-slate-800 light:border-slate-300 shadow-inner">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onViewChange(item.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? "bg-gradient-to-r from-legal-emerald/20 to-legal-cyan/20 text-legal-emerald dark:text-legal-emerald border border-legal-emerald/30 shadow-md shadow-legal-emerald/10"
                  : "text-slate-400 hover:text-slate-200 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900 border border-transparent"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
