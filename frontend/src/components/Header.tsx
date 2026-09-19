import React from "react";
import { Scale, ShieldCheck, Globe } from "lucide-react";
import { LanguageCode } from "../types";
import { getTranslation } from "../i18n";

interface HeaderProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentLanguage, onLanguageChange }) => {
  const t = getTranslation(currentLanguage);

  return (
    <header role="banner" className="glass-panel sticky top-0 z-50 border-b border-slate-800/80 px-6 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand and Tagline */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-legal-emerald to-legal-cyan text-obsidian-950 shadow-lg shadow-legal-emerald/20">
            <Scale className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">{t.appTitle}</h1>
              <span className="rounded-full border border-legal-emerald/40 bg-legal-emerald/10 px-2 py-0.5 text-xs font-medium text-legal-emerald">
                PromptWars Exclusive
              </span>
            </div>
            <p className="text-xs text-slate-400">{t.subtitle}</p>
          </div>
        </div>

        {/* Badges and Language Selector */}
        <div className="flex items-center gap-4">
          {/* Zero-Key Security Badge */}
          <div className="hidden items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 md:flex">
            <ShieldCheck className="h-4 w-4 text-legal-emerald" aria-hidden="true" />
            <span>Vertex AI ADC Zero-Key</span>
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <label htmlFor="language-select" className="sr-only">
              Select Language
            </label>
            <div className="pointer-events-none absolute left-2.5 text-slate-400">
              <Globe className="h-4 w-4" aria-hidden="true" />
            </div>
            <select
              id="language-select"
              aria-label="Select Interface Language"
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="appearance-none rounded-lg border border-slate-700 bg-slate-900/80 py-1.5 pl-8 pr-7 text-xs font-medium text-slate-200 transition-colors hover:border-legal-cyan focus:border-legal-cyan focus:outline-none focus:ring-1 focus:ring-legal-cyan"
            >
              <option value="en">English (EN)</option>
              <option value="es">Español (ES)</option>
              <option value="fr">Français (FR)</option>
              <option value="de">Deutsch (DE)</option>
              <option value="ja">日本語 (JA)</option>
              <option value="hi">हिन्दी (HI)</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
