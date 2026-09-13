"use client";

import type { ReactNode } from "react";
import { lightTheme as theme } from "@/lib/theme";

// Auth pages always render the white/minimal Gen-Z look regardless of the
// visitor's OS dark-mode preference — a deliberate brand choice for the
// first thing a new user sees, independent of the in-app dark theme.

export function AuthPageShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: "'Barlow', system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        overflow: "hidden",
      }}
    >
      {/* Playful decorative blobs — Gen-Z accent pops, decorative only (not theme tokens) */}
      <div
        aria-hidden
        style={{
          position: "absolute", top: "-14%", right: "-16%", width: 300, height: 300,
          borderRadius: "42% 58% 63% 37% / 45% 41% 59% 55%",
          background: "linear-gradient(135deg, #7C5CFC, #C7B8FF)",
          filter: "blur(4px)", opacity: 0.35,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute", bottom: "-18%", left: "-12%", width: 260, height: 260,
          borderRadius: "58% 42% 37% 63% / 55% 45% 55% 45%",
          background: "linear-gradient(135deg, #4ADE9A, #A78BFA)",
          filter: "blur(6px)", opacity: 0.22,
        }}
      />

      <div
        style={{
          position: "relative", width: "100%", maxWidth: 380, background: theme.surface,
          borderRadius: 32, boxShadow: theme.shadowCard, padding: "40px 28px 30px",
          border: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            width: 56, height: 56, borderRadius: 20, margin: "0 auto 20px",
            background: "linear-gradient(135deg, #7C5CFC, #A78BFA)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 22, color: "#fff",
            boxShadow: "0 8px 20px rgba(124,92,252,0.35)",
          }}
        >
          EL
        </div>

        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 28,
            margin: "0 0 6px", textAlign: "center", letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h1>
        <div style={{ fontSize: 13.5, color: theme.muted, textAlign: "center", marginBottom: 28 }}>
          {subtitle}
        </div>

        {children}

        <div style={{ fontSize: 13, color: theme.muted, textAlign: "center", marginTop: 22 }}>
          {footer}
        </div>
      </div>
    </div>
  );
}

export function AuthDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0" }}>
      <div style={{ flex: 1, height: 1, background: theme.border }} />
      <span style={{ fontSize: 11.5, fontWeight: 600, color: theme.mutedFaint, letterSpacing: ".04em" }}>หรือ</span>
      <div style={{ flex: 1, height: 1, background: theme.border }} />
    </div>
  );
}

export function GoogleSignInButton({ onClick, disabled, label }: { onClick: () => void; disabled?: boolean; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="el-tap"
      style={{
        width: "100%", height: 54, borderRadius: 18, border: `1.5px solid ${theme.border}`,
        background: theme.surface, color: theme.text, fontSize: 15, fontWeight: 600,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <GoogleGlyph />
      {label}
    </button>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 009 18z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.97H.98A9 9 0 000 9c0 1.45.35 2.83.98 4.03l2.97-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
    </svg>
  );
}
