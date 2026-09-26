import React from "react";
import { Scale, ShieldCheck, Globe, Sun, Moon, User, Zap } from "lucide-react";
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
    counsel:    t.roleCounsel,
    arbitrator: t.roleArbitrator,
    auditor:    t.roleAuditor,
    founder:    t.roleFounder,
  };

  return (
    <header
      role="banner"
      className="glass-panel sticky top-0 z-50"
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        padding: "0 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          height: "64px",
        }}
      >
        {/* ── Brand ─────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flexShrink: 0 }}>
          {/* Logo mark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #10b981, #06b6d4)",
              boxShadow: "0 4px 16px rgba(16,185,129,0.40), inset 0 1px 0 rgba(255,255,255,0.2)",
              flexShrink: 0,
            }}
          >
            <Scale style={{ width: "20px", height: "20px", color: "#020617" }} aria-hidden="true" />
          </div>

          {/* Title + tagline */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h1
                className="font-display"
                style={{
                  fontSize: "clamp(1rem, 2.2vw, 1.25rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "var(--text-primary)",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {t.appTitle}
              </h1>
              <span
                className="badge badge-emerald"
                style={{ fontSize: "10px", display: "none" }}
              >
                {t.exclusiveBadge}
              </span>
              <span
                className="badge badge-emerald"
                style={{ fontSize: "10px" }}
              >
                {t.exclusiveBadge}
              </span>
            </div>
            <p
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                margin: 0,
                marginTop: "1px",
                letterSpacing: "0.01em",
                maxWidth: "300px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* ── Controls ──────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>

          {/* Role Selector */}
          <div
            style={{
              position: "relative",
              display: "none",
              alignItems: "center",
            }}
            className="md-role-selector"
          >
            <div
              style={{
                pointerEvents: "none",
                position: "absolute",
                left: "0.625rem",
                color: "var(--accent-emerald)",
              }}
            >
              <User style={{ width: "13px", height: "13px" }} aria-hidden="true" />
            </div>
            <select
              aria-label="Active Legal Role"
              value={user.role}
              onChange={(e) => switchRole(e.target.value as LegalRole)}
              style={{
                appearance: "none",
                borderRadius: "8px",
                border: "1px solid var(--border-default)",
                background: "var(--bg-input)",
                color: "var(--accent-emerald)",
                fontSize: "0.75rem",
                fontWeight: 600,
                fontFamily: "'Outfit', sans-serif",
                padding: "0.375rem 1.25rem 0.375rem 1.75rem",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="counsel">{roleLabels.counsel}</option>
              <option value="arbitrator">{roleLabels.arbitrator}</option>
              <option value="auditor">{roleLabels.auditor}</option>
              <option value="founder">{roleLabels.founder}</option>
            </select>
          </div>

          {/* Zero-Key Badge */}
          <div
            style={{
              display: "none",
              alignItems: "center",
              gap: "0.375rem",
              borderRadius: "8px",
              border: "1px solid var(--border-default)",
              background: "var(--bg-card)",
              padding: "0.375rem 0.75rem",
              fontSize: "0.7rem",
              color: "var(--text-secondary)",
            }}
            className="xl-zerokey"
          >
            <ShieldCheck style={{ width: "14px", height: "14px", color: "var(--accent-emerald)" }} aria-hidden="true" />
            <span>{t.zeroKeyBadge}</span>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              border: "1px solid var(--border-default)",
              background: "var(--bg-card)",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glow ring on hover handled by CSS */}
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "10px",
                background: theme === "dark"
                  ? "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
                transition: "opacity 0.3s ease",
              }}
            />
            {theme === "dark" ? (
              <Sun style={{ width: "15px", height: "15px", color: "#fbbf24", position: "relative" }} aria-hidden="true" />
            ) : (
              <Moon style={{ width: "15px", height: "15px", color: "var(--accent-violet)", position: "relative" }} aria-hidden="true" />
            )}
          </button>

          {/* Language Selector */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <label htmlFor="language-select" className="sr-only">
              Select Language
            </label>
            <div
              style={{
                pointerEvents: "none",
                position: "absolute",
                left: "0.625rem",
                color: "var(--text-muted)",
              }}
            >
              <Globe style={{ width: "13px", height: "13px" }} aria-hidden="true" />
            </div>
            <select
              id="language-select"
              aria-label="Select Interface Language"
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              style={{
                appearance: "none",
                borderRadius: "8px",
                border: "1px solid var(--border-default)",
                background: "var(--bg-input)",
                color: "var(--text-primary)",
                fontSize: "0.75rem",
                fontWeight: 500,
                padding: "0.375rem 1.5rem 0.375rem 1.75rem",
                cursor: "pointer",
                outline: "none",
                maxWidth: "165px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* AI status pulse */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.375rem 0.75rem",
              borderRadius: "8px",
              border: "1px solid var(--border-accent)",
              background: "rgba(16,185,129,0.08)",
              fontSize: "0.7rem",
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
              color: "var(--accent-emerald)",
              flexShrink: 0,
            }}
            className="hidden lg:flex"
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "var(--accent-emerald)",
                boxShadow: "0 0 8px var(--accent-emerald)",
                animation: "pulse-glow 2s infinite",
                flexShrink: 0,
              }}
            />
            <Zap style={{ width: "11px", height: "11px" }} aria-hidden="true" />
            <span>AI Live</span>
          </div>
        </div>
      </div>

      {/* Responsive: show role selector on md+ */}
      <style>{`
        @media (min-width: 768px) {
          .md-role-selector { display: flex !important; }
        }
        @media (min-width: 1280px) {
          .xl-zerokey { display: flex !important; }
        }
        header button:hover {
          border-color: var(--accent-emerald) !important;
        }
        select:focus {
          border-color: var(--accent-emerald) !important;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.15) !important;
          outline: none !important;
        }
      `}</style>
    </header>
  );
};
