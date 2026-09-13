"use client";

import { useEffect, useState } from "react";
import { getTheme, type ThemeTokens } from "@/lib/theme";

// Login/Register render outside AppStateProvider (no user session yet, so
// no stored theme preference to read) — this reads the OS-level preference
// directly so these pages still respect dark mode instead of being
// permanently forced to light.
export function useSystemTheme(): { dark: boolean; theme: ThemeTokens } {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const listener = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  return { dark, theme: getTheme(dark) };
}
