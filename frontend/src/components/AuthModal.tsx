import React, { useState } from "react";
import { X, Mail, Lock, User as UserIcon, LogIn, Chrome, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type Mode = "signin" | "signup";

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, authError, isLoading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const error = authError ?? localError;

  const validate = (): boolean => {
    if (!email.includes("@")) { setLocalError("Enter a valid email."); return false; }
    if (password.length < 6)  { setLocalError("Password must be ≥ 6 characters."); return false; }
    if (mode === "signup" && !name.trim()) { setLocalError("Display name is required."); return false; }
    setLocalError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (mode === "signin") {
      await signInWithEmail(email, password);
    } else {
      await signUpWithEmail(email, password, name);
    }
    if (!authError && !localError) onClose();
  };

  const handleGoogle = async () => {
    await signInWithGoogle();
    if (!authError) onClose();
  };

  return (
    /* Backdrop */
    <div
      role="dialog"
      aria-modal="true"
      aria-label={mode === "signin" ? "Sign In" : "Create Account"}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(2,6,23,0.80)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      {/* Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-accent)",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 24px 64px rgba(0,0,0,0.60), 0 0 0 1px rgba(16,185,129,0.10)",
          position: "relative",
          animation: "fade-up 0.3s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            border: "1px solid var(--border-default)",
            background: "transparent",
            color: "var(--text-muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X style={{ width: "14px", height: "14px" }} />
        </button>

        {/* Logo + Title */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #10b981, #06b6d4)",
            boxShadow: "0 4px 20px rgba(16,185,129,0.40)",
            marginBottom: "0.875rem",
          }}>
            <span style={{ fontSize: "1.5rem" }}>⚖</span>
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: "1.35rem",
            color: "var(--text-primary)",
            margin: 0,
            letterSpacing: "-0.025em",
          }}>
            {mode === "signin" ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
            {mode === "signin" ? "Sign in to ClausaFractal AI" : "Join ClausaFractal AI"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(244,63,94,0.10)",
            border: "1px solid rgba(244,63,94,0.30)",
            borderRadius: "10px",
            padding: "0.65rem 0.875rem",
            marginBottom: "1rem",
            fontSize: "0.82rem",
            color: "var(--accent-rose)",
          }}>
            {error}
          </div>
        )}

        {/* Google sign-in */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={isLoading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.625rem",
            padding: "0.75rem",
            borderRadius: "12px",
            border: "1px solid var(--border-default)",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "1.125rem",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent-emerald)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
        >
          <Chrome style={{ width: "18px", height: "18px", color: "#4285F4" }} />
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.125rem" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "'Outfit', sans-serif" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {mode === "signup" && (
            <div style={{ position: "relative" }}>
              <UserIcon style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 0.875rem 0.75rem 2.375rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  fontFamily: "'Inter', sans-serif",
                  outline: "none",
                }}
              />
            </div>
          )}

          <div style={{ position: "relative" }}>
            <Mail style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "var(--text-muted)" }} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem 0.875rem 0.75rem 2.375rem",
                borderRadius: "10px",
                border: "1px solid var(--border-default)",
                background: "var(--bg-input)",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
                fontFamily: "'Inter', sans-serif",
                outline: "none",
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <Lock style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "var(--text-muted)" }} />
            <input
              type={showPw ? "text" : "password"}
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem 2.5rem 0.75rem 2.375rem",
                borderRadius: "10px",
                border: "1px solid var(--border-default)",
                background: "var(--bg-input)",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
                fontFamily: "'Inter', sans-serif",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {showPw ? <EyeOff style={{ width: "14px", height: "14px" }} /> : <Eye style={{ width: "14px", height: "14px" }} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.8rem",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan))",
              color: "#020617",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: "0 4px 16px rgba(16,185,129,0.35)",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            <LogIn style={{ width: "16px", height: "16px" }} />
            {isLoading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Mode toggle */}
        <p style={{ textAlign: "center", marginTop: "1.125rem", fontSize: "0.83rem", color: "var(--text-muted)" }}>
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-emerald)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.83rem",
              padding: 0,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};
