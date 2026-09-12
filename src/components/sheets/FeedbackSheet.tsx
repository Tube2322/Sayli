"use client";

import { useAppState } from "@/lib/appState";
import { useTheme } from "@/lib/useTheme";

export function FeedbackSheet() {
  const { theme } = useTheme();
  const { sheet, continueAfterFeedback, lastPracticeCorrect, lastPracticeScore } = useAppState();
  const open = sheet === "feedback";
  const correct = lastPracticeCorrect ?? false;
  const score = lastPracticeScore ?? 0;
  const resultColor = correct ? theme.success : theme.error;
  const resultSoft = correct ? theme.successSoft : theme.errorSoft;

  return (
    <div
      className="el-sheet"
      style={{
        position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 90,
        background: theme.surface, borderRadius: "28px 28px 0 0",
        padding: "28px 22px calc(env(safe-area-inset-bottom,0px) + 24px)",
        boxShadow: "0 -10px 40px rgba(0,0,0,0.2)",
        transform: open ? "translateY(0)" : "translateY(100%)",
        textAlign: "center",
      }}
    >
      <div style={{ width: 36, height: 4, borderRadius: 4, background: theme.track, margin: "0 auto 16px" }} />
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 30, color: resultColor }}>{score}%</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 19, margin: "4px 0 14px" }}>
        {correct ? "ถูกต้อง!" : "ยังไม่ตรงเป้า ลองใหม่ครั้งหน้า"}
      </div>
      <div style={{ textAlign: "left", background: resultSoft, borderRadius: 16, padding: "14px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: resultColor, marginBottom: 2 }}>คำสำคัญ</div>
        <div style={{ fontSize: 14, marginBottom: 10 }}>&quot;mean&quot; = หมายถึง</div>
        <div style={{ fontSize: 12, color: resultColor, marginBottom: 2 }}>ประโยคต้นฉบับ</div>
        <div style={{ fontSize: 14 }}>I didn&apos;t mean to hurt you.</div>
      </div>
      <button
        className="el-tap"
        onClick={continueAfterFeedback}
        style={{ width: "100%", height: 52, border: "none", borderRadius: 16, background: theme.btnBg, color: theme.btnText, fontSize: 16, fontWeight: 600 }}
      >
        ต่อไป →
      </button>
    </div>
  );
}
