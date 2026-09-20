import React from "react";
import { Scale, ShieldCheck, Globe, Sun, Moon, User } from "lucide-react";
import { LanguageCode } from "../types";
import { getTranslation, SUPPORTED_LANGUAGES } from "../i18n";
import { useTheme } from "../context/ThemeContext";
import { useAuth, LegalRole } from "../context/AuthContext";

interface HeaderProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentLanguage, onLanguageChange }) => {
  const t = getTranslation(currentLanguage);
  const { theme, toggleTheme } = useTheme();
  const { user, switchRole } = useAuth();

  const roleLabels: Record<LegalRole, string> = {
    counsel: t.roleCounsel,
    arbitrator: t.roleArbitrator,
    auditor: t.roleAuditor,
    founder: t.roleFounder,
  };

  return (
    <header
      role="banner"
      className="glass-panel sticky top-0 z-50 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-300 px-4 md:px-6 py-3 transition-colors"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand and Tagline */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-legal-emerald to-legal-cyan text-obsidian-950 shadow-lg shadow-legal-emerald/20 font-bold shrink-0">
            <Scale className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white dark:text-white light:text-slate-900">
                {t.appTitle}
              </h1>
              <span className="hidden sm:inline-block rounded-full border border-legal-emerald/40 bg-legal-emerald/10 px-2 py-0.5 text-[11px] font-medium text-legal-emerald">
                {t.exclusiveBadge}
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 truncate max-w-[280px] sm:max-w-none">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Controls: Role Selector, Zero-Key, Theme Toggle, Language Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Role Selector */}
          <div className="relative hidden md:flex items-center">
            <div className="pointer-events-none absolute left-2.5 text-legal-emerald">
              <User className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
            <select
              aria-label="Active Legal Role"
              value={user.role}
              onChange={(e) => switchRole(e.target.value as LegalRole)}
              className="appearance-none rounded-lg border border-slate-800 dark:border-slate-800 light:border-slate-300 bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 py-1.5 pl-7 pr-6 text-xs font-semibold text-legal-emerald transition-colors hover:border-legal-emerald focus:outline-none cursor-pointer"
            >
              <option value="counsel">{roleLabels.counsel}</option>
              <option value="arbitrator">{roleLabels.arbitrator}</option>
              <option value="auditor">{roleLabels.auditor}</option>
              <option value="founder">{roleLabels.founder}</option>
            </select>
          </div>

          {/* Zero-Key Security Badge */}
          <div className="hidden xl:flex items-center gap-1.5 rounded-lg border border-slate-800 dark:border-slate-800 light:border-slate-300 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 px-2.5 py-1.5 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
            <ShieldCheck className="h-4 w-4 text-legal-emerald" aria-hidden="true" />
            <span>{t.zeroKeyBadge}</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 dark:border-slate-700 light:border-slate-300 bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-800 hover:text-legal-emerald transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <label htmlFor="language-select" className="sr-only">
              Select Language
            </label>
            <div className="pointer-events-none absolute left-2.5 text-slate-400">
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
            <select
              id="language-select"
              aria-label="Select Interface Language"
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="appearance-none rounded-lg border border-slate-700 dark:border-slate-700 light:border-slate-300 bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 py-1.5 pl-8 pr-7 text-xs font-medium text-slate-200 dark:text-slate-200 light:text-slate-800 transition-colors hover:border-legal-cyan focus:border-legal-cyan focus:outline-none max-w-[170px] sm:max-w-[220px] truncate cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
