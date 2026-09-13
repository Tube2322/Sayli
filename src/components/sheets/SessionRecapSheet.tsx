"use client";

import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/appState";
import { useTheme } from "@/lib/useTheme";
import { DIFFICULTY_META } from "@/lib/content/labels";

export function SessionRecapSheet() {
  const { theme } = useTheme();
  const { sheet, closeSheets, sessionRecap } = useAppState();
  const router = useRouter();
  const open = sheet === "recap";
  const recap = sessionRecap ?? { answered: 0, correctCount: 0, avgScore: 0, tierCounts: { easy: 0, medium: 0, hard: 0 } };

  const onDone = () => {
    closeSheets();
    router.push("/practice");
  };

  return (
    <>
      {open && (
        <div
          className="el-tap"
          onClick={onDone}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 80 }}
        />
      )}
      <div
        className="el-sheet"
        style={{
          // Fixed to the real viewport — see HintSheet.tsx for why (a
          // position:absolute+vh containing-block bug left "closed" sheets
          // visible instead of fully off-screen).
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 90,
          background: theme.surface, borderRadius: "28px 28px 0 0",
          padding: "28px 22px calc(env(safe-area-inset-bottom,0px) + 24px)",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.2)",
          transform: open ? "translateY(0)" : "translateY(100%)",
          textAlign: "center",
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 4, background: theme.track, margin: "0 auto 16px" }} />
        <div style={{ fontSize: 32, marginBottom: 4 }}>🎉</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 18 }}>
          จบรอบฝึกแล้ว!
        </div>

        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 18 }}>
          <Stat theme={theme} value={recap.answered} label="ข้อที่ตอบ" />
          <Stat theme={theme} value={recap.correctCount} label="ตอบถูก" />
          <Stat theme={theme} value={`${recap.avgScore}%`} label="คะแนนเฉลี่ย" />
          {recap.totalTimeMs && recap.totalTimeMs > 0 && (
            <Stat theme={theme} value={`${Math.max(1, Math.round(recap.totalTimeMs / 60000))} นาที`} label="เวลาที่ใช้" />
          )}
        </div>

        {recap.answered > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 22 }}>
            {(Object.keys(DIFFICULTY_META) as Array<keyof typeof DIFFICULTY_META>).map(
              (tier) =>
                recap.tierCounts[tier] > 0 && (
                  <div
                    key={tier}
                    style={{
                      fontSize: 12.5, fontWeight: 600, background: theme.accentSoft, color: theme.accentDeep,
                      padding: "6px 12px", borderRadius: 999, display: "flex", alignItems: "center", gap: 5,
                    }}
                  >
                    <span>{DIFFICULTY_META[tier].emoji}</span>
                    <span>{DIFFICULTY_META[tier].label} × {recap.tierCounts[tier]}</span>
                  </div>
                )
            )}
          </div>
        )}

        <button
          className="el-tap"
          onClick={onDone}
          style={{ width: "100%", height: 52, border: "none", borderRadius: 16, background: theme.btnBg, color: theme.btnText, fontSize: 16, fontWeight: 600 }}
        >
          เสร็จสิ้น
        </button>
      </div>
    </>
  );
}

function Stat({ theme, value, label }: { theme: ReturnType<typeof useTheme>["theme"]; value: number | string; label: string }) {
  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 24 }}>{value}</div>
      <div style={{ fontSize: 11, color: theme.muted }}>{label}</div>
    </div>
  );
}
