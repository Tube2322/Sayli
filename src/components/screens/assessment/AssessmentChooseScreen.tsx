"use client";

import { useRouter } from "next/navigation";
import { useAppState, LEVEL_META, LEVEL_ORDER, SKILL_LABELS, SKILL_ORDER } from "@/lib/appState";
import { useTheme } from "@/lib/useTheme";

export function AssessmentChooseScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const {
    chooseMode, chooseAllLevel, chooseEachLevels,
    setChooseMode, setChooseAllLevel, setChooseEachLevel, markAssessmentApplied,
  } = useAppState();

  const onConfirm = () => {
    const levels: Record<string, string> = {};
    SKILL_ORDER.forEach((sk) => {
      levels[sk] = chooseMode === "all" ? chooseAllLevel : chooseEachLevels[sk];
    });
    markAssessmentApplied(levels);
    router.push("/assessment/confirm");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, paddingBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="el-tap" onClick={() => router.push("/assessment/intro")} style={{ width: 36, height: 36, borderRadius: "50%", background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 22, margin: 0 }}>เลือกระดับของฉัน</h1>
      </div>

      <div style={{ display: "flex", gap: 6, background: theme.track, borderRadius: 12, padding: 4 }}>
        <div className="el-tap" onClick={() => setChooseMode("all")} style={{ flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 9, fontSize: 13, fontWeight: 600, background: chooseMode === "all" ? theme.surface : "transparent", color: chooseMode === "all" ? theme.accentDeep : theme.muted }}>ใช้ระดับเดียวกันทุกด้าน</div>
        <div className="el-tap" onClick={() => setChooseMode("each")} style={{ flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 9, fontSize: 13, fontWeight: 600, background: chooseMode === "each" ? theme.surface : "transparent", color: chooseMode === "each" ? theme.accentDeep : theme.muted }}>เลือกแต่ละด้านเอง</div>
      </div>

      {chooseMode === "all" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {LEVEL_ORDER.map((lv) => {
            const selected = chooseAllLevel === lv;
            const meta = LEVEL_META[lv];
            return (
              <div
                key={lv}
                className="el-tap"
                onClick={() => setChooseAllLevel(lv)}
                style={{ borderRadius: 16, padding: "14px 16px", border: `1.5px solid ${selected ? theme.accent : theme.border}`, background: selected ? theme.accentSoft : theme.surface, display: "flex", alignItems: "center", gap: 12 }}
              >
                <div style={{ fontSize: 22 }}>{meta.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600 }}>{lv} · {meta.name}</div>
                  <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>{meta.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {chooseMode === "each" && (
        <div style={{ borderRadius: 22, padding: 18, background: theme.surface, boxShadow: theme.shadowCard, display: "flex", flexDirection: "column", gap: 16 }}>
          {SKILL_ORDER.map((sk) => (
            <div key={sk}>
              <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 8 }}>{SKILL_LABELS[sk]}</div>
              <div style={{ display: "flex", gap: 6 }}>
                {LEVEL_ORDER.map((lv) => {
                  const selected = chooseEachLevels[sk] === lv;
                  return (
                    <div
                      key={lv}
                      className="el-tap"
                      onClick={() => setChooseEachLevel(sk, lv)}
                      style={{ flex: 1, textAlign: "center", padding: "8px 0", borderRadius: 9, fontSize: 12, fontWeight: 700, background: selected ? theme.accent : theme.track, color: selected ? theme.btnText : theme.text }}
                    >
                      {lv}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ flex: 1 }} />
      <button className="el-tap" onClick={onConfirm} style={{ width: "100%", height: 54, border: "none", borderRadius: 16, background: theme.btnBg, color: theme.btnText, fontSize: 16, fontWeight: 600 }}>
        ยืนยันระดับนี้
      </button>
    </div>
  );
}
