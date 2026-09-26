/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Tailwind 3.4: activate dark: utilities when data-theme="dark" on <html>
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#020617",
          900: "#0b0f19",
          850: "#111827",
          800: "#1e293b",
        },
        legal: {
          emerald: "#10b981",
          cyan: "#06b6d4",
          violet: "#8b5cf6",
          amber: "#f59e0b",
          rose:   "#f43f5e",
        },
      },
      fontFamily: {
        sans:    ["Inter", "Outfit", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.65rem",  { lineHeight: "1rem" }],
        xs:    ["0.78rem",  { lineHeight: "1.2rem" }],
        sm:    ["0.875rem", { lineHeight: "1.375rem" }],
        base:  ["1rem",     { lineHeight: "1.65rem" }],
        lg:    ["1.125rem", { lineHeight: "1.75rem" }],
        xl:    ["1.25rem",  { lineHeight: "1.875rem" }],
        "2xl": ["1.5rem",   { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.375rem" }],
        "4xl": ["2.25rem",  { lineHeight: "2.75rem" }],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      boxShadow: {
        "glow-emerald": "0 0 20px rgba(16,185,129,0.35)",
        "glow-cyan":    "0 0 20px rgba(6,182,212,0.35)",
        "glow-violet":  "0 0 20px rgba(139,92,246,0.35)",
        "glass":        "0 8px 32px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glass-light":  "0 4px 24px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.80)",
      },
    },
  },
  plugins: [
    ({ addVariant }) => addVariant("light", ".light &"),
  ],
};
