"use client";

import { useEffect, useState } from "react";
import { useAppState } from "@/lib/appState";
import { getTheme, type ThemeTokens } from "@/lib/theme";

export function useTheme(): { dark: boolean; theme: ThemeTokens } {
  const { themeMode } = useAppState();
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const listener = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  const dark = themeMode === "dark" || (themeMode === "system" && systemDark);
  return { dark, theme: getTheme(dark) };
}
