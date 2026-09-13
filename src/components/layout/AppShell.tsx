"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/useTheme";
import { TopBar } from "@/components/nav/TopBar";
import { BottomNav } from "@/components/nav/BottomNav";
import { HintSheet } from "@/components/sheets/HintSheet";
import { FeedbackSheet } from "@/components/sheets/FeedbackSheet";
import { RetakeConfirmDialog } from "@/components/sheets/RetakeConfirmDialog";
import { SessionRecapSheet } from "@/components/sheets/SessionRecapSheet";

export function AppShell({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const hideNav =
    pathname.startsWith("/session") || pathname.startsWith("/settings") || pathname.startsWith("/assessment");

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        maxWidth: 430,
        margin: "0 auto",
        background: theme.bg,
        color: theme.text,
        fontFamily: "'Barlow', system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      <TopBar />

      <div
        className="el-scroll"
        style={{
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "66px 20px 8px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>

      <HintSheet />
      <FeedbackSheet />
      <RetakeConfirmDialog />
      <SessionRecapSheet />

      {!hideNav && <BottomNav />}
    </div>
  );
}
