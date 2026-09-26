import React from "react";
import { LanguageCode } from "../types";
import { SUPPORTED_LANGUAGES } from "../i18n";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export const SettingsSection: React.FC<{ language: LanguageCode; onLanguageChange: (language: LanguageCode) => void }> = ({ language, onLanguageChange }) => {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const controlStyle: React.CSSProperties = { border: "1px solid var(--border-default)", borderRadius: 8, padding: "0.6rem 0.75rem", background: "var(--bg-elevated)", color: "var(--text-primary)" };
  return <section className="mx-auto w-full max-w-3xl space-y-6">
    <header><p className="text-sm font-semibold text-violet-500">PREFERENCES</p><h1 className="mt-2 text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Settings</h1><p className="mt-2" style={{ color: "var(--text-muted)" }}>Manage appearance, language, and your active sign-in.</p></header>
    <div className="glass-panel divide-y rounded-2xl border" style={{ borderColor: "var(--border-default)" }}>
      <div className="flex flex-wrap items-center justify-between gap-4 p-5"><div><h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Appearance</h2><p className="text-sm" style={{ color: "var(--text-muted)" }}>Choose light or dark display.</p></div><select aria-label="Appearance" value={theme} onChange={(event) => setTheme(event.target.value as "light" | "dark")} style={controlStyle}><option value="light">Light</option><option value="dark">Dark</option></select></div>
      <div className="flex flex-wrap items-center justify-between gap-4 p-5"><div><h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Language</h2><p className="text-sm" style={{ color: "var(--text-muted)" }}>Set interface language.</p></div><select aria-label="Language" value={language} onChange={(event) => onLanguageChange(event.target.value as LanguageCode)} style={controlStyle}>{SUPPORTED_LANGUAGES.map(({ code, name }) => <option key={code} value={code}>{name}</option>)}</select></div>
      <div className="flex flex-wrap items-center justify-between gap-4 p-5"><div><h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Account</h2><p className="text-sm" style={{ color: "var(--text-muted)" }}>{isAuthenticated ? user.displayName + " · " + user.email : "Demo session as " + user.displayName + " · sign in from the header to connect an account."}</p></div>{isAuthenticated && <button onClick={() => void signOut()} style={controlStyle}>Sign out</button>}</div>
    </div>
  </section>;
};
