import React, { useState } from "react";
import {
  Scale,
  BarChart3,
  HelpCircle,
  Info,
  ShieldCheck,
  Cpu,
  Gavel,
  LifeBuoy,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TranslationDictionary } from "../i18n/types";

export type NavView =
  | "studio"
  | "courtroom"
  | "mesh"
  | "analytics"
  | "faq"
  | "about"
  | "governance"
  | "help"
  | "settings";

interface NavigationProps {
  activeView: NavView;
  onViewChange: (view: NavView) => void;
  t: TranslationDictionary;
}

const NAV_ITEMS: Array<{ id: NavView; icon: React.FC<{ style?: React.CSSProperties }>; color: string }> = [
  { id: "studio",     icon: Scale,       color: "var(--accent-emerald)" },
  { id: "courtroom",  icon: Gavel,       color: "var(--accent-amber)"   },
  { id: "mesh",       icon: Cpu,         color: "var(--accent-cyan)"    },
  { id: "analytics",  icon: BarChart3,   color: "var(--accent-violet)"  },
  { id: "faq",        icon: HelpCircle,  color: "var(--accent-emerald)" },
  { id: "about",      icon: Info,        color: "var(--accent-cyan)"    },
  { id: "governance", icon: ShieldCheck, color: "var(--accent-rose)"    },
  { id: "help",       icon: LifeBuoy,    color: "var(--accent-cyan)"    },
  { id: "settings",   icon: Settings,    color: "var(--accent-violet)" },
];

const getNavLabel = (id: NavView, t: TranslationDictionary): string => {
  switch (id) {
    case "studio":     return String(t.navStudio);
    case "courtroom":  return String(t.navCourtroom);
    case "mesh":       return String(t.navMesh);
    case "analytics":  return String(t.navAnalytics);
    case "faq":        return String(t.navFaq);
    case "about":      return String(t.navAbout);
    case "governance": return String(t.navGovernance);
    case "help":       return "Help Center";
    case "settings":   return "System Settings";
  }
};

export const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange, t }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      role="navigation"
      aria-label="Main Application Sections"
      style={{
        width: collapsed ? "64px" : "256px",
        minWidth: collapsed ? "64px" : "256px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        padding: collapsed ? "1rem 0.5rem" : "1rem 0.75rem",
        background: "var(--bg-card)",
        backdropFilter: "blur(18px) saturate(180%)",
        WebkitBackdropFilter: "blur(18px) saturate(180%)",
        borderRight: "1px solid var(--border-subtle)",
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1), min-width 0.25s cubic-bezier(0.4,0,0.2,1), padding 0.25s ease",
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
      }}
    >
      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          borderRadius: "8px",
          border: "1px solid var(--border-default)",
          background: "var(--bg-elevated)",
          color: "var(--text-muted)",
          cursor: "pointer",
          marginBottom: "0.75rem",
          alignSelf: collapsed ? "center" : "flex-end",
          flexShrink: 0,
        }}
      >
        {collapsed
          ? <ChevronRight style={{ width: "13px", height: "13px" }} />
          : <ChevronLeft  style={{ width: "13px", height: "13px" }} />
        }
      </button>

      {/* Nav items */}
      {NAV_ITEMS.map(({ id, icon: Icon, color }) => {
        const isActive = activeView === id;
        const label = getNavLabel(id, t);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onViewChange(id)}
            title={collapsed ? label : undefined}
            aria-label={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: collapsed ? "0" : "0.75rem",
              padding: collapsed ? "0.65rem" : "0.65rem 0.875rem",
              borderRadius: "12px",
              border: isActive ? `1px solid ${color}22` : "1px solid transparent",
              background: isActive
                ? `linear-gradient(135deg, ${color}18, ${color}08)`
                : "transparent",
              color: isActive ? color : "var(--text-muted)",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.875rem",
              fontWeight: isActive ? 700 : 500,
              width: "100%",
              minWidth: 0,
              whiteSpace: "normal",
              overflowWrap: "anywhere",
              boxShadow: isActive ? `0 0 14px ${color}25` : "none",
              justifyContent: collapsed ? "center" : "flex-start",
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}
          >
            <Icon
              style={{
                width: "18px",
                height: "18px",
                flexShrink: 0,
                color: isActive ? color : "var(--text-muted)",
              }}
            />
            {!collapsed && (
              <span style={{ flex: 1, minWidth: 0, lineHeight: 1.2, opacity: collapsed ? 0 : 1, transition: "opacity 0.15s ease" }}>{id === "help" ? "Help" : id === "settings" ? "Settings" : label}</span>
            )}
            {/* Active indicator dot */}
            {isActive && !collapsed && (
              <span style={{
                marginLeft: "auto",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 8px ${color}`,
                flexShrink: 0,
              }} />
            )}
          </button>
        );
      })}

      {/* Bottom spacer */}
      <div style={{ flex: 1 }} />

      {/* Version badge */}
      {!collapsed && (
        <div style={{
          fontSize: "0.68rem",
          color: "var(--text-muted)",
          textAlign: "center",
          padding: "0.5rem 0",
          borderTop: "1px solid var(--border-subtle)",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.05em",
        }}>
          v2.0 · Gen AI APAC
        </div>
      )}
    </aside>
  );
};
