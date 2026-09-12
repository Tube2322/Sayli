"use client";

import { useRouter } from "next/navigation";
import { useAppState, LEVEL_META, SKILL_LABELS, SKILL_ORDER } from "@/lib/appState";
import { useSession } from "@/lib/session/SessionProvider";
import { useTheme } from "@/lib/useTheme";

const LEVEL_RANK: Record<string, number> = { L1: 1, L2: 2, L3: 3, L4: 4, L5: 5 };
const CONFIDENCE_LABEL: Record<string, string> = { low: "Low", medium: "Medium", high: "High" };

export function AssessmentResultsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { finishAssessment } = useAppState();
  const { completeAssessment, skillProfiles } = useSession();

  const skillRows = SKILL_ORDER.map((sk) => {
    const sp = skillProfiles?.[sk];
    const lv = sp?.level ?? "L2";
    const meta = LEVEL_META[lv];
    const confidence = CONFIDENCE_LABEL[sp?.confidence ?? "low"];
    return { skill: sk, name: SKILL_LABELS[sk], level: lv, emoji: meta.emoji, confidence };
  });
  const sortedByRank = [...skillRows].sort((a, b) => LEVEL_RANK[a.level] - LEVEL_RANK[b.level]);
  const strongest = sortedByRank[sortedByRank.length - 1];
  const focusSkills = sortedByRank.slice(0, 2).map((r) => r.name).join(" + ");

  const onFinish = async () => {
    finishAssessment();
    await completeAssessment();
    router.push("/");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, paddingBottom: 40 }}>
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <div style={{ fontSize: 34 }}>🎉</div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 21, margin: "6px 0 0" }}>โปรไฟล์ภาษาอังกฤษของคุณพร้อมแล้ว</h1>
      </div>
      <div style={{ borderRadius: 22, padding: 18, background: theme.surface, boxShadow: theme.shadowCard, display: "flex", flexDirection: "column", gap: 12 }}>
        {skillRows.map((r) => (
          <div key={r.skill} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14.5, fontWeight: 500 }}>{r.name}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10.5, color: theme.muted }}>{r.confidence}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: theme.accentDeep, background: theme.accentSoft, padding: "4px 10px", borderRadius: 999 }}>{r.emoji} {r.level}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderRadius: 22, padding: "16px 18px", background: theme.accentSoft }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: theme.accentDeep, marginBottom: 2 }}>ทักษะที่แข็งที่สุดของคุณ</div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{strongest?.name}</div>
      </div>
      <div style={{ borderRadius: 22, padding: "16px 18px", background: theme.surface, boxShadow: theme.shadowCard }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: theme.navy, marginBottom: 2 }}>โฟกัสถัดไป</div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{focusSkills}</div>
      </div>
      <button className="el-tap" onClick={onFinish} style={{ width: "100%", height: 54, border: "none", borderRadius: 16, background: theme.btnBg, color: theme.btnText, fontSize: 16, fontWeight: 600, marginTop: 4 }}>
        เริ่มเส้นทางการเรียนของฉัน
      </button>
    </div>
  );
}
