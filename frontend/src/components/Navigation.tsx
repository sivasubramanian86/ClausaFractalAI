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
    { id: "studio",     label: t.navStudio,     icon: <Scale style={{ width: "14px", height: "14px" }} /> },
    { id: "courtroom",  label: t.navCourtroom,  icon: <Gavel style={{ width: "14px", height: "14px", color: "var(--accent-amber)" }} /> },
    { id: "mesh",       label: t.navMesh,       icon: <Cpu style={{ width: "14px", height: "14px" }} /> },
    { id: "analytics",  label: t.navAnalytics,  icon: <BarChart3 style={{ width: "14px", height: "14px" }} /> },
    { id: "faq",        label: t.navFaq,        icon: <HelpCircle style={{ width: "14px", height: "14px" }} /> },
    { id: "about",      label: t.navAbout,      icon: <Info style={{ width: "14px", height: "14px" }} /> },
    { id: "governance", label: t.navGovernance, icon: <ShieldCheck style={{ width: "14px", height: "14px" }} /> },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Main Application Sections"
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        width: "100%",
        padding: "0.875rem 1.5rem 0",
        overflowX: "auto",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "2px",
          borderRadius: "14px",
          padding: "4px",
          background: "var(--bg-card)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onViewChange(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.4rem 0.875rem",
                fontSize: "0.78rem",
                fontWeight: isActive ? 700 : 500,
                fontFamily: "'Outfit', sans-serif",
                borderRadius: "10px",
                border: isActive ? "1px solid var(--border-accent)" : "1px solid transparent",
                background: isActive
                  ? "linear-gradient(135deg, rgba(16,185,129,0.16), rgba(6,182,212,0.12))"
                  : "transparent",
                color: isActive ? "var(--accent-emerald)" : "var(--text-muted)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
                boxShadow: isActive ? "0 0 12px rgba(16,185,129,0.15)" : "none",
                letterSpacing: isActive ? "0.01em" : "0",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }
              }}
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
