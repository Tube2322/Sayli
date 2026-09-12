"use client";

import { useAppState } from "@/lib/appState";
import { useTheme } from "@/lib/useTheme";

export function HintSheet() {
  const { theme } = useTheme();
  const { sheet, closeSheets } = useAppState();
  const open = sheet === "hint";

  return (
    <>
      {open && (
        <div
          className="el-tap"
          onClick={closeSheets}
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 80 }}
        />
      )}
      <div
        className="el-sheet"
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 90,
          background: theme.surface, borderRadius: "28px 28px 0 0",
          padding: "24px 22px calc(env(safe-area-inset-bottom,0px) + 24px)",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.2)",
          transform: open ? "translateY(0)" : "translateY(100%)",
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 4, background: theme.track, margin: "0 auto 18px" }} />
        <div style={{ fontSize: 13, fontWeight: 600, color: theme.accentDeep, marginBottom: 8 }}>คำใบ้</div>
        <div style={{ fontSize: 15, marginBottom: 4 }}>
          ลองดูคำว่า <strong>&quot;mean&quot;</strong>
        </div>
        <div style={{ fontSize: 14, color: theme.muted, marginBottom: 20 }}>หมายถึง &quot;หมายความว่า&quot;</div>
        <button
          className="el-tap"
          onClick={closeSheets}
          style={{ width: "100%", height: 52, border: "none", borderRadius: 16, background: theme.btnBg, color: theme.btnText, fontSize: 16, fontWeight: 600 }}
        >
          เข้าใจแล้ว
        </button>
      </div>
    </>
  );
}
