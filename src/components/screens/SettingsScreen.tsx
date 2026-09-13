"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppState, LEVEL_META, SKILL_LABELS, SKILL_ORDER } from "@/lib/appState";
import { useSession } from "@/lib/session/SessionProvider";
import { useTheme } from "@/lib/useTheme";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { SkillIcon } from "@/components/ui/SkillIcon";
import type { DifficultyPreference } from "@/lib/profile/types";

const GOAL_OPTIONS = [5, 10, 15, 20];
const DIFFICULTY_OPTIONS: { value: DifficultyPreference; label: string }[] = [
  { value: "beginner", label: "ง่าย" },
  { value: "normal", label: "ปกติ" },
  { value: "challenge", label: "ท้าทาย" },
];

export function SettingsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const {
    themeMode, setThemeMode, dailyGoalMinutes, setDailyGoalMinutes,
    showPronunciation, togglePronunciation, soundOn, toggleSound,
    openRetakeConfirm,
  } = useAppState();
  const { profile, profileError, skillProfiles, setDifficultyPreference, logout } = useSession();
  const [savingDifficulty, setSavingDifficulty] = useState(false);

  const onDifficultyChange = async (value: DifficultyPreference) => {
    setSavingDifficulty(true);
    await setDifficultyPreference(value);
    setSavingDifficulty(false);
  };

  const skillRows = SKILL_ORDER.map((sk) => {
    const sp = skillProfiles?.[sk];
    const lv = sp?.level ?? "L2";
    const meta = LEVEL_META[lv];
    const confidence = sp?.confidence === "high" ? "High" : sp?.confidence === "medium" ? "Medium" : "Low";
    return { skill: sk, name: SKILL_LABELS[sk], level: lv, emoji: meta.emoji, confidence };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, paddingBottom: 60 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          className="el-tap"
          onClick={() => router.push("/")}
          style={{ width: 36, height: 36, borderRadius: "50%", background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 24, margin: 0 }}>ตั้งค่า</h1>
      </div>

      <div style={{ borderRadius: 22, padding: 18, background: theme.surface, boxShadow: theme.shadowCard }}>
        <SectionLabel theme={theme}>บัญชี</SectionLabel>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{profile?.displayName || "-"}</div>
        <div style={{ fontSize: 12, color: theme.muted, marginBottom: 14 }}>
          ระดับที่เลือกไว้: {profile?.overallLevel ?? "ยังไม่ระบุ"}
        </div>
        {profileError && (
          <div style={{ fontSize: 12.5, color: theme.error, marginBottom: 10 }}>{profileError}</div>
        )}
        <button
          className="el-tap"
          onClick={async () => {
            await logout();
            router.replace("/login");
          }}
          style={{ width: "100%", height: 46, border: `1.3px solid ${theme.border}`, borderRadius: 14, background: "transparent", color: theme.text, fontSize: 13.5, fontWeight: 600 }}
        >
          ออกจากระบบ
        </button>
      </div>

      <div style={{ borderRadius: 22, padding: 18, background: theme.surface, boxShadow: theme.shadowCard }}>
        <SectionLabel theme={theme}>การแสดงผล</SectionLabel>
        <SegmentedControl
          value={themeMode}
          onChange={setThemeMode}
          options={[
            { value: "light", label: "สว่าง" },
            { value: "dark", label: "มืด" },
            { value: "system", label: "ระบบ" },
          ]}
        />
      </div>

      <div style={{ borderRadius: 22, padding: 18, background: theme.surface, boxShadow: theme.shadowCard, display: "flex", flexDirection: "column", gap: 16 }}>
        <SectionLabel theme={theme}>การเรียนรู้</SectionLabel>

        <div>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>เป้าหมายต่อวัน</div>
          <div style={{ display: "flex", gap: 6 }}>
            {GOAL_OPTIONS.map((v) => (
              <div
                key={v}
                className="el-tap"
                onClick={() => setDailyGoalMinutes(v)}
                style={{
                  flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 10, fontSize: 12.5, fontWeight: 600,
                  border: `1.3px solid ${dailyGoalMinutes === v ? theme.accent : theme.border}`,
                  background: dailyGoalMinutes === v ? theme.accentSoft : "transparent",
                  color: dailyGoalMinutes === v ? theme.accentDeep : theme.text,
                }}
              >
                {v} นาที
              </div>
            ))}
          </div>
        </div>

        <ToggleRow theme={theme} title="แสดงคำอ่านออกเสียง" desc="Pronunciation ใต้ประโยค" on={showPronunciation} onChange={togglePronunciation} />
        <ToggleRow theme={theme} title="เสียง" desc="เสียงตอบสนองในบทเรียน" on={soundOn} onChange={toggleSound} />

        <div>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>ระดับความยาก</div>
          <div style={{ display: "flex", gap: 6 }}>
            {DIFFICULTY_OPTIONS.map((d) => {
              const active = profile?.difficultyPreference === d.value;
              return (
                <div
                  key={d.value}
                  className="el-tap"
                  onClick={() => onDifficultyChange(d.value)}
                  style={{
                    flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 10, fontSize: 12.5, fontWeight: 600,
                    border: `1.3px solid ${active ? theme.accent : theme.border}`,
                    background: active ? theme.accentSoft : "transparent",
                    color: active ? theme.accentDeep : theme.text,
                    opacity: savingDifficulty ? 0.6 : 1,
                  }}
                >
                  {d.label}
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: theme.muted, marginTop: 8, lineHeight: 1.4 }}>
            ระบบจะยังปรับความยากอัตโนมัติตามผลการฝึกจริงของคุณด้วย
          </div>
        </div>
      </div>

      <div style={{ borderRadius: 22, padding: 18, background: theme.surface, boxShadow: theme.shadowCard }}>
        <SectionLabel theme={theme}>การประเมิน</SectionLabel>
        <div style={{ fontSize: 11.5, color: theme.muted, marginBottom: 12 }}>โปรไฟล์ทักษะปัจจุบัน</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {skillRows.map((r) => (
            <div key={r.skill} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13.5, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                <SkillIcon skill={r.skill} size={15} color={theme.accentDeep} />
                {r.name}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, color: theme.muted }}>{r.confidence}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: theme.accentDeep, background: theme.accentSoft, padding: "3px 9px", borderRadius: 999 }}>
                  {r.emoji} {r.level}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="el-tap" onClick={openRetakeConfirm} style={{ flex: 1, height: 46, border: "none", borderRadius: 14, background: theme.btnSecondaryBg, color: theme.btnSecondaryText, fontSize: 13.5, fontWeight: 600 }}>ทำแบบประเมินใหม่</button>
          <button className="el-tap" onClick={() => router.push("/assessment/choose")} style={{ flex: 1, height: 46, border: `1.3px solid ${theme.navy}`, borderRadius: 14, background: "transparent", color: theme.navy, fontSize: 13.5, fontWeight: 600 }}>เลือกระดับเอง</button>
        </div>
      </div>

      <div style={{ borderRadius: 22, padding: 18, background: theme.surface, boxShadow: theme.shadowCard }}>
        <SectionLabel theme={theme}>เกี่ยวกับ</SectionLabel>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>English Life</div>
        <div style={{ fontSize: 12, color: theme.muted, marginBottom: 10 }}>เวอร์ชัน 1.0.0</div>
        <div style={{ fontSize: 12, color: theme.muted, marginBottom: 10 }}>Privacy · Terms · Help</div>
        <div style={{ fontSize: 11, color: theme.muted, lineHeight: 1.5 }}>
          ประโยคฝึกบางส่วนใช้ข้อมูลจาก{" "}
          <a href="https://tatoeba.org" target="_blank" rel="noreferrer" style={{ color: theme.accentDeep }}>
            Tatoeba.org
          </a>{" "}
          (CC BY 2.0 FR / CC0)
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ theme, children }: { theme: ReturnType<typeof useTheme>["theme"]; children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 700, color: theme.navy, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 12 }}>
      {children}
    </div>
  );
}

function ToggleRow({ theme, title, desc, on, onChange }: { theme: ReturnType<typeof useTheme>["theme"]; title: string; desc: string; on: boolean; onChange: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: theme.muted }}>{desc}</div>
      </div>
      <ToggleSwitch on={on} onChange={onChange} />
    </div>
  );
}
