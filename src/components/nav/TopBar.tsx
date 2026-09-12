"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "@/lib/appState";
import { useTheme } from "@/lib/useTheme";

export function TopBar() {
  const { theme, dark } = useTheme();
  const { toggleDark } = useAppState();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <div
        className="el-tap"
        onClick={toggleDark}
        style={{
          position: "absolute", top: 16, right: 16, zIndex: 70, width: 38, height: 38,
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          background: theme.surface, boxShadow: theme.shadowSm,
        }}
      >
        {dark ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v1.5M12 19.5V21M4.2 4.2l1.1 1.1M18.7 18.7l1.1 1.1M3 12h1.5M19.5 12H21M4.2 19.8l1.1-1.1M18.7 5.3l1.1-1.1" />
            <circle cx="12" cy="12" r="4.5" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill={theme.accent} stroke="none">
            <path d="M20 14.5A8.5 8.5 0 019.5 4 8.5 8.5 0 1020 14.5z" />
          </svg>
        )}
      </div>

      {isHome && (
        <Link
          href="/settings"
          aria-label="Settings"
          className="el-tap"
          style={{
            position: "absolute", top: 16, right: 62, zIndex: 70, width: 38, height: 38,
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            background: theme.surface, boxShadow: theme.shadowSm,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </Link>
      )}
    </>
  );
}
