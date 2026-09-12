"use client";

import { useAppState } from "@/lib/appState";
import { useTheme } from "@/lib/useTheme";
import { achievements, historyByFilter, journeyNames, masteryTopics, skills } from "@/lib/sampleData";

// Sample values ported verbatim from the prototype — Progress's real data
// pipeline (skill/practice history aggregation) is out of scope for Phase 1.
const level = 4;
const streakDays = 5;
const lessonsDone = 24;
const masteryPct = 67;

export function ProgressScreen() {
  const { theme } = useTheme();
  const { historyFilter, setHistoryFilter } = useAppState();
  const historyEntries = historyByFilter[historyFilter];

  const journeyStages = journeyNames.map((name, i) => ({
    name,
    done: i < 2,
    current: i === 2,
    notLast: i < journeyNames.length - 1,
    weight: i === 2 ? 600 : 400,
    color: i < 2 ? theme.text : i === 2 ? theme.accentDeep : theme.muted,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, paddingBottom: 100 }}>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 26, margin: 0 }}>ความก้าวหน้า</h1>

      <div style={{ borderRadius: 26, padding: 20, background: theme.surface, boxShadow: theme.shadowCard }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 21 }}>Level {level}</div>
          <div style={{ fontSize: 12.5, color: theme.muted }}>Everyday English</div>
        </div>
        <div style={{ height: 10, background: theme.track, borderRadius: 999, overflow: "hidden", marginBottom: 14 }}>
          <div style={{ height: "100%", width: "78%", background: theme.accent, borderRadius: 999 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={theme.accentDeep} stroke="none"><path d="M12 2c1 3 5 5 5 10a5 5 0 01-10 0c0-1.5.5-2.5 1.3-3.6.4.9 1.2 1.4 1.2 1.4-.3-2 .5-4 2.5-7.8z" /></svg>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>{streakDays} วัน</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.accentDeep} strokeWidth="1.7"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>{lessonsDone} บท</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={theme.accentDeep} stroke="none"><path d="M12 2l3 6.5 7 .9-5 5 1.2 7-6.2-3.4L5.8 21.4 7 14.4l-5-5 7-.9L12 2Z" /></svg>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>{masteryPct}%</span>
          </div>
        </div>
      </div>

      <ProgressCard theme={theme} title="ทักษะ" rows={skills} />
      <ProgressCard theme={theme} title="ความเชี่ยวชาญตามหัวข้อ" rows={masteryTopics} />

      <div style={{ borderRadius: 22, padding: 18, background: theme.surface, boxShadow: theme.shadowCard }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 14 }}>เส้นทางการเรียนรู้</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {journeyStages.map((j) => (
            <div key={j.name} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {j.done ? (
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={theme.btnText} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                ) : j.current ? (
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2.5px solid ${theme.accent}`, flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `1.5px solid ${theme.border}`, flexShrink: 0 }} />
                )}
                {j.notLast && <div style={{ width: 1.5, flex: 1, minHeight: 16, background: theme.border }} />}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: j.weight, color: j.color, paddingBottom: 16 }}>{j.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderRadius: 22, padding: "16px 18px", background: theme.accentSoft, display: "flex", alignItems: "center", gap: 12 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.accentDeep} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" /></svg>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.accentDeep }}>Listening ดีขึ้น +12%</div>
          <div style={{ fontSize: 11.5, color: theme.muted }}>เทียบกับสัปดาห์ก่อน</div>
        </div>
      </div>

      <div style={{ borderRadius: 22, padding: 18, background: theme.surface, boxShadow: theme.shadowCard }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 12 }}>Achievements</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {achievements.map((a) => (
            <div key={a.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: theme.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill={theme.accentDeep} stroke="none"><path d="M12 2l3 6.5 7 .9-5 5 1.2 7-6.2-3.4L5.8 21.4 7 14.4l-5-5 7-.9L12 2Z" /></svg>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{a.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderRadius: 22, padding: 18, background: theme.surface, boxShadow: theme.shadowCard }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600 }}>ประวัติการเรียน</div>
          <div style={{ display: "flex", gap: 4, background: theme.track, borderRadius: 10, padding: 3 }}>
            {(["7d", "30d", "all"] as const).map((f) => (
              <div
                key={f}
                className="el-tap"
                onClick={() => setHistoryFilter(f)}
                style={{ padding: "5px 9px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: historyFilter === f ? theme.surface : "transparent", color: historyFilter === f ? theme.accentDeep : theme.muted }}
              >
                {f === "7d" ? "7 วัน" : f === "30d" ? "30 วัน" : "ทั้งหมด"}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {historyEntries.map((h) => (
            <div key={h.day} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13.5, fontWeight: 500 }}>{h.day}</span>
              <span style={{ fontSize: 12.5, color: theme.muted }}>{h.minutes} นาที · ตอบถูก {h.correct} ข้อ</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressCard({ theme, title, rows }: { theme: ReturnType<typeof useTheme>["theme"]; title: string; rows: { name: string; pct: number }[] }) {
  return (
    <div style={{ borderRadius: 22, padding: 18, background: theme.surface, boxShadow: theme.shadowCard }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.map((r) => (
          <div key={r.name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 13.5, fontWeight: 500 }}>{r.name}</span>
              <span style={{ fontSize: 12.5, color: theme.muted }}>{r.pct}%</span>
            </div>
            <div style={{ height: 6, background: theme.track, borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${r.pct}%`, background: theme.accent, borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
