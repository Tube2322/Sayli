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
        <StudyingMascot />

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

// Bold-outline flat-illustration mascot (Icons8-sticker style, drawn as our
// own art) sitting cross-legged, studying on a phone — replaces the old
// text/icon logo mark. Gentle bob + glowing screen + floating sparkle, all
// pure CSS keyframes scoped inside the SVG so no JS/animation library.
function StudyingMascot() {
  return (
    <div
      style={{
        width: 96, height: 96, borderRadius: 28, margin: "0 auto 16px",
        background: "#F1EDFF",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 20px rgba(124,92,252,0.18)", overflow: "hidden",
      }}
    >
      <svg width="76" height="76" viewBox="0 0 100 100">
        <style>{`
          .el-mascot-body { animation: elMascotBob 2.6s ease-in-out infinite; transform-origin: 50px 78px; }
          .el-mascot-sparkle { animation: elMascotSparkle 1.8s ease-in-out infinite; transform-origin: 78px 26px; }
          .el-mascot-screen { animation: elMascotGlow 2.2s ease-in-out infinite; }
          @keyframes elMascotBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }
          @keyframes elMascotSparkle { 0%,100% { opacity: .25; transform: scale(0.8) translateY(0); } 50% { opacity: 1; transform: scale(1.15) translateY(-3px); } }
          @keyframes elMascotGlow { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
        `}</style>

        <g className="el-mascot-body" strokeLinejoin="round" strokeLinecap="round">
          {/* seat shadow */}
          <ellipse cx="50" cy="83" rx="23" ry="4.5" fill="#16151A" opacity=".12" />

          {/* crossed legs — outline pass then flat-color pass, Icons8-style bold outline */}
          <path d="M30 78c4-6 14-8 20-6" stroke="#16151A" strokeWidth="10" fill="none" />
          <path d="M70 78c-4-6-14-8-20-6" stroke="#16151A" strokeWidth="10" fill="none" />
          <path d="M30 78c4-6 14-8 20-6" stroke="#5B3DF0" strokeWidth="6.5" fill="none" />
          <path d="M70 78c-4-6-14-8-20-6" stroke="#7C5CFC" strokeWidth="6.5" fill="none" />

          {/* arms — outline pass then flat-color pass */}
          <path d="M36 58c-4 3-6 8-5 12" stroke="#16151A" strokeWidth="9" fill="none" />
          <path d="M64 58c4 3 6 8 5 12" stroke="#16151A" strokeWidth="9" fill="none" />
          <path d="M36 58c-4 3-6 8-5 12" stroke="#7C5CFC" strokeWidth="5.5" fill="none" />
          <path d="M64 58c4 3 6 8 5 12" stroke="#7C5CFC" strokeWidth="5.5" fill="none" />

          {/* torso */}
          <rect x="34" y="46" width="32" height="30" rx="14" fill="#7C5CFC" stroke="#16151A" strokeWidth="3" paintOrder="stroke" />

          {/* phone */}
          <rect x="39" y="55" width="22" height="30" rx="5" fill="#fff" stroke="#16151A" strokeWidth="3" paintOrder="stroke" />
          <rect className="el-mascot-screen" x="42" y="59" width="16" height="10" rx="2" fill="#A78BFA" stroke="#16151A" strokeWidth="2" paintOrder="stroke" />
          <rect x="42" y="72" width="16" height="2.6" rx="1.3" fill="#16151A" opacity=".7" />
          <rect x="42" y="77" width="10" height="2.6" rx="1.3" fill="#16151A" opacity=".7" />

          {/* head */}
          <circle cx="50" cy="34" r="16" fill="#FFDDBB" stroke="#16151A" strokeWidth="3" paintOrder="stroke" />
          {/* hair */}
          <path d="M34 32c-1-11 8-19 16-19s17 8 16 19c-3-3-6-5-9-5.5-1.5 2-4 3.5-7 3.5s-5.5-1.5-7-3.5c-3 .5-6 2.5-9 5.5z" fill="#3A2C22" stroke="#16151A" strokeWidth="2.4" paintOrder="stroke" />
          {/* face */}
          <circle cx="45" cy="35" r="1.8" fill="#16151A" />
          <circle cx="55" cy="35" r="1.8" fill="#16151A" />
          <path d="M46 40c1.5 1.6 6.5 1.6 8 0" stroke="#16151A" strokeWidth="2" fill="none" />
          <circle cx="41" cy="38" r="2.2" fill="#FF9EB0" opacity=".6" />
          <circle cx="59" cy="38" r="2.2" fill="#FF9EB0" opacity=".6" />
        </g>

        {/* floating sparkle */}
        <path className="el-mascot-sparkle" d="M78 20l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z" fill="#4ADE9A" stroke="#16151A" strokeWidth="1.5" strokeLinejoin="round" paintOrder="stroke" />
      </svg>
    </div>
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
