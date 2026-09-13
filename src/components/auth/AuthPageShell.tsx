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
        <SleepingCatMascot />

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
// own art): a cat curled up asleep. Gentle breathing bob + floating "Zzz",
// all pure CSS keyframes scoped inside the SVG so no JS/animation library.
function SleepingCatMascot() {
  return (
    <div
      style={{
        width: 96, height: 96, borderRadius: 28, margin: "0 auto 16px",
        background: "#F1EDFF",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 20px rgba(124,92,252,0.18)", overflow: "hidden",
      }}
    >
      <svg width="80" height="80" viewBox="0 0 100 100">
        <style>{`
          .el-mascot-body { animation: elMascotBreathe 3.2s ease-in-out infinite; transform-origin: 50px 64px; }
          .el-mascot-zzz { animation: elMascotZzz 2.6s ease-in-out infinite; transform-origin: 74px 34px; }
          @keyframes elMascotBreathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.035); } }
          @keyframes elMascotZzz { 0%,20% { opacity: 0; transform: translateY(4px) scale(.8); } 50% { opacity: 1; transform: translateY(-3px) scale(1); } 100% { opacity: 0; transform: translateY(-12px) scale(1.05); } }
        `}</style>

        <g className="el-mascot-body" strokeLinejoin="round" strokeLinecap="round">
          {/* ground shadow */}
          <ellipse cx="50" cy="76" rx="28" ry="5" fill="#16151A" opacity=".12" />

          {/* tail curled around the body */}
          <path d="M72 62c9-2 13-11 8-18-3-4-8-5-11-2" fill="none" stroke="#16151A" strokeWidth="9" />
          <path d="M72 62c9-2 13-11 8-18-3-4-8-5-11-2" fill="none" stroke="#F5D9B8" strokeWidth="5.5" />

          {/* body — curled loaf shape, lying down */}
          <path
            d="M20 66c-2-16 12-28 30-28s32 12 30 28c-1 6-8 10-30 10s-29-4-30-10z"
            fill="#F5D9B8" stroke="#16151A" strokeWidth="3" paintOrder="stroke"
          />

          {/* ears */}
          <path d="M28 42l-3-11 10 6z" fill="#F5D9B8" stroke="#16151A" strokeWidth="3" paintOrder="stroke" />
          <path d="M46 38l1-11 8 8z" fill="#F5D9B8" stroke="#16151A" strokeWidth="3" paintOrder="stroke" />
          <path d="M28 40l-1.6-6 5.4 3.4z" fill="#FF9EB0" opacity=".7" />
          <path d="M46.5 37l.6-6 4.6 4.6z" fill="#FF9EB0" opacity=".7" />

          {/* closed sleepy eyes */}
          <path d="M31 50c1.5 1.6 4 1.6 5.5 0" stroke="#16151A" strokeWidth="2" fill="none" />
          <path d="M42 50c1.5 1.6 4 1.6 5.5 0" stroke="#16151A" strokeWidth="2" fill="none" />
          {/* nose + mouth */}
          <path d="M38 54l1.6 1.4 1.6-1.4z" fill="#FF9EB0" />
          <path d="M39.6 55.4v1.6M39.6 57c-1.4 0-2.4.8-2.8 1.8M39.6 57c1.4 0 2.4.8 2.8 1.8" stroke="#16151A" strokeWidth="1.4" fill="none" />
          {/* whiskers */}
          <path d="M18 52h-8M18 56h-7.4M60 52h8M60 56h7.4" stroke="#16151A" strokeWidth="1.4" opacity=".55" />

          {/* front paw tucked in */}
          <ellipse cx="30" cy="70" rx="7" ry="4.5" fill="#FFF0DC" stroke="#16151A" strokeWidth="2.4" paintOrder="stroke" />
        </g>

        {/* floating Zzz */}
        <text className="el-mascot-zzz" x="72" y="30" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" fontSize="14" fill="#A78BFA" stroke="#16151A" strokeWidth="0.6">Z</text>
        <text x="80" y="20" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" fontSize="9" fill="#A78BFA" opacity=".55">z</text>
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
