"use client";

import type { ReactNode } from "react";
import { useSystemTheme } from "@/lib/useSystemTheme";

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
  const { theme } = useSystemTheme();

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
      <div
        aria-hidden
        style={{
          position: "absolute", top: "-12%", right: "-18%", width: 320, height: 320,
          borderRadius: "50%", background: theme.accentSoft, filter: "blur(60px)", opacity: 0.9,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute", bottom: "-16%", left: "-14%", width: 280, height: 280,
          borderRadius: "50%", background: theme.track, filter: "blur(70px)", opacity: 0.8,
        }}
      />

      <div
        style={{
          position: "relative", width: "100%", maxWidth: 380, background: theme.surface,
          borderRadius: 28, boxShadow: theme.shadowCard, padding: "38px 30px 30px",
        }}
      >
        <div
          style={{
            width: 52, height: 52, borderRadius: 16, margin: "0 auto 18px",
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDeep})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 20, color: "#fff",
            boxShadow: theme.shadowSm,
          }}
        >
          EL
        </div>

        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 26,
            margin: "0 0 6px", textAlign: "center",
          }}
        >
          {title}
        </h1>
        <div style={{ fontSize: 13.5, color: theme.muted, textAlign: "center", marginBottom: 26 }}>
          {subtitle}
        </div>

        {children}

        <div style={{ fontSize: 13, color: theme.muted, textAlign: "center", marginTop: 20 }}>
          {footer}
        </div>
      </div>
    </div>
  );
}

export function AuthDivider() {
  const { theme } = useSystemTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
      <div style={{ flex: 1, height: 1, background: theme.border }} />
      <span style={{ fontSize: 12, color: theme.muted }}>หรือ</span>
      <div style={{ flex: 1, height: 1, background: theme.border }} />
    </div>
  );
}

export function GoogleSignInButton({ onClick, disabled, label }: { onClick: () => void; disabled?: boolean; label: string }) {
  const { theme } = useSystemTheme();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="el-tap"
      style={{
        width: "100%", height: 52, borderRadius: 16, border: `1.5px solid ${theme.border}`,
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
