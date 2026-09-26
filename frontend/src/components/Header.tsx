import React, { useState } from "react";
import { Scale, ShieldCheck, Globe, Sun, Moon, LogOut, LogIn, Zap, User as UserIcon } from "lucide-react";
import { LanguageCode } from "../types";
import { getTranslation, SUPPORTED_LANGUAGES } from "../i18n";
import { useTheme } from "../context/ThemeContext";
import { useAuth, LegalRole } from "../context/AuthContext";
import { AuthModal } from "./AuthModal";

interface HeaderProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentLanguage, onLanguageChange }) => {
  const t = getTranslation(currentLanguage);
  const { theme, toggleTheme } = useTheme();
  const { user, firebaseUser, isAuthenticated, signOut, switchRole } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const roleLabels: Record<LegalRole, string> = {
    counsel:    t.roleCounsel,
    arbitrator: t.roleArbitrator,
    auditor:    t.roleAuditor,
    founder:    t.roleFounder,
  };

  return (
    <>
      <header
        role="banner"
        className="glass-panel"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid var(--border-subtle)",
          padding: "0 1.5rem",
          flexShrink: 0,
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          height: "64px",
        }}>
          {/* ── Brand ──────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flexShrink: 0 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #10b981, #06b6d4)",
              boxShadow: "0 4px 16px rgba(16,185,129,0.40), inset 0 1px 0 rgba(255,255,255,0.2)",
              flexShrink: 0,
            }}>
              <Scale style={{ width: "20px", height: "20px", color: "#020617" }} aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-display" style={{
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                margin: 0,
                lineHeight: 1.2,
              }}>
                {t.appTitle}
              </h1>
              <p style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                margin: 0,
                letterSpacing: "0.01em",
                maxWidth: "300px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* ── Controls ───────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>

            {/* Role Selector — visible md+ */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
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
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  fontFamily: "'Outfit', sans-serif",
                  padding: "0.375rem 1rem 0.375rem 0.625rem",
                  cursor: "pointer",
                  outline: "none",
                  display: "none",
                }}
                className="role-select-md"
              >
                {(Object.keys(roleLabels) as LegalRole[]).map((r) => (
                  <option key={r} value={r}>{roleLabels[r]}</option>
                ))}
              </select>
            </div>

            {/* Zero-Key Badge */}
            <div style={{
              display: "none",
              alignItems: "center",
              gap: "0.375rem",
              borderRadius: "8px",
              border: "1px solid var(--border-default)",
              background: "var(--bg-card)",
              padding: "0.35rem 0.7rem",
              fontSize: "0.7rem",
              color: "var(--text-secondary)",
            }} className="zerokey-xl">
              <ShieldCheck style={{ width: "13px", height: "13px", color: "var(--accent-emerald)" }} aria-hidden="true" />
              <span>{t.zeroKeyBadge}</span>
            </div>

            {/* AI Live Pulse */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.35rem 0.7rem",
              borderRadius: "8px",
              border: "1px solid var(--border-accent)",
              background: "rgba(16,185,129,0.08)",
              fontSize: "0.72rem",
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
              color: "var(--accent-emerald)",
              flexShrink: 0,
            }}>
              <span style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "var(--accent-emerald)",
                boxShadow: "0 0 8px var(--accent-emerald)",
                animation: "pulse-glow 2s infinite",
                flexShrink: 0,
              }} />
              <Zap style={{ width: "11px", height: "11px" }} aria-hidden="true" />
              AI Live
            </div>

            {/* Language Selector */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <label htmlFor="language-select" className="sr-only">Select Language</label>
              <div style={{ pointerEvents: "none", position: "absolute", left: "0.5rem", color: "var(--text-muted)" }}>
                <Globe style={{ width: "12px", height: "12px" }} aria-hidden="true" />
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
                  fontSize: "0.78rem",
                  padding: "0.375rem 1rem 0.375rem 1.5rem",
                  cursor: "pointer",
                  outline: "none",
                  maxWidth: "150px",
                  overflow: "hidden",
                }}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
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
                flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute",
                inset: 0,
                borderRadius: "10px",
                background: theme === "dark"
                  ? "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
              }} />
              {theme === "dark"
                ? <Sun  style={{ width: "15px", height: "15px", color: "#fbbf24", position: "relative" }} aria-hidden="true" />
                : <Moon style={{ width: "15px", height: "15px", color: "var(--accent-violet)", position: "relative" }} aria-hidden="true" />
              }
            </button>

            {/* ── Auth: User Avatar OR Sign In ───────────── */}
            {isAuthenticated ? (
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setShowUserMenu((v) => !v)}
                  aria-label="User menu"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.35rem 0.75rem 0.35rem 0.35rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-accent)",
                    background: "rgba(16,185,129,0.08)",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  {firebaseUser?.photoURL ? (
                    <img
                      src={firebaseUser.photoURL}
                      alt={user.displayName}
                      style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{
                      width: "26px", height: "26px", borderRadius: "50%",
                      background: "linear-gradient(135deg,#10b981,#06b6d4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <UserIcon style={{ width: "13px", height: "13px", color: "#020617" }} />
                    </div>
                  )}
                  <span style={{
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    fontFamily: "'Outfit', sans-serif",
                    maxWidth: "110px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {user.displayName.split(" ")[0]}
                  </span>
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <div style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "12px",
                    padding: "0.5rem",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.40)",
                    minWidth: "200px",
                    zIndex: 100,
                  }}>
                    <div style={{ padding: "0.5rem 0.75rem 0.75rem", borderBottom: "1px solid var(--border-subtle)" }}>
                      <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{user.displayName}</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: 0 }}>{user.email}</p>
                    </div>
                    <div style={{ padding: "0.5rem 0.25rem 0.25rem" }}>
                      {(["counsel","arbitrator","auditor","founder"] as LegalRole[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => { switchRole(r); setShowUserMenu(false); }}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "0.4rem 0.5rem",
                            borderRadius: "8px",
                            border: "none",
                            background: user.role === r ? "rgba(16,185,129,0.10)" : "transparent",
                            color: user.role === r ? "var(--accent-emerald)" : "var(--text-secondary)",
                            fontSize: "0.8rem",
                            fontWeight: user.role === r ? 600 : 400,
                            fontFamily: "'Outfit', sans-serif",
                            cursor: "pointer",
                          }}
                        >
                          {roleLabels[r]}
                        </button>
                      ))}
                    </div>
                    <div style={{ borderTop: "1px solid var(--border-subtle)", padding: "0.25rem" }}>
                      <button
                        type="button"
                        onClick={() => { signOut(); setShowUserMenu(false); }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 0.5rem",
                          borderRadius: "8px",
                          border: "none",
                          background: "transparent",
                          color: "var(--accent-rose)",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          fontFamily: "'Outfit', sans-serif",
                          cursor: "pointer",
                        }}
                      >
                        <LogOut style={{ width: "13px", height: "13px" }} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.45rem 1rem",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan))",
                  color: "#020617",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  fontFamily: "'Outfit', sans-serif",
                  cursor: "pointer",
                  flexShrink: 0,
                  boxShadow: "0 3px 12px rgba(16,185,129,0.35)",
                }}
              >
                <LogIn style={{ width: "14px", height: "14px" }} />
                Sign In
              </button>
            )}
          </div>
        </div>

        <style>{`
          @media (min-width: 768px)  { .role-select-md  { display: block  !important; } }
          @media (min-width: 1280px) { .zerokey-xl      { display: flex   !important; } }
          header button:hover { border-color: var(--accent-emerald) !important; }
          select:focus {
            border-color: var(--accent-emerald) !important;
            box-shadow: 0 0 0 3px rgba(16,185,129,0.15) !important;
            outline: none !important;
          }
        `}</style>
      </header>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
};
