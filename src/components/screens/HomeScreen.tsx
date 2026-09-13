"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/appState";
import { useSession } from "@/lib/session/SessionProvider";
import { useTheme } from "@/lib/useTheme";
import { SKILL_LABELS } from "@/lib/sampleData";
import { QUESTION_BANK } from "@/lib/practice/questionBank";
import { contextFromLearningState, selectNextQuestion } from "@/lib/practice/adaptiveEngine";
import { computeStreakDays, computeTodayMinutes, computeTodayMissions, overallLevelNumber } from "@/lib/progress/progressService";

export function HomeScreen() {
  const { theme } = useTheme();
  const { dailyGoalMinutes } = useAppState();
  const { profile, learningState, recentPracticeResults, reviewSchedule } = useSession();
  const router = useRouter();

  const hour = new Date().getHours();
  const greeting = hour < 11 ? "สวัสดีตอนเช้า" : hour < 17 ? "สวัสดีตอนบ่าย" : "สวัสดีตอนเย็น";

  const streakDays = computeStreakDays(recentPracticeResults);
  const level = overallLevelNumber(profile?.overallLevel ?? null);
  const goalDone = computeTodayMinutes(recentPracticeResults);
  const missions = computeTodayMissions(recentPracticeResults, reviewSchedule);
  const missionItems = [
    { label: "ใหม่", done: missions.practicedNew },
    { label: "ทบทวน", done: missions.reviewed },
    { label: "จุดผิด", done: missions.fixedMistake },
    { label: "ท้าทาย", done: missions.challenged },
  ];
  const missionDone = missionItems.filter((m) => m.done).length;

  const nextQuestionId = useMemo(
    () => selectNextQuestion(QUESTION_BANK, contextFromLearningState(learningState, reviewSchedule)),
    [learningState, reviewSchedule]
  );
  const nextQuestion = nextQuestionId ? QUESTION_BANK[nextQuestionId] : null;

  const latestMistake = learningState?.recentMistakes[0];
  const latestMistakePattern = latestMistake ? QUESTION_BANK[latestMistake.questionId]?.pattern : undefined;
  const weakSkill = learningState?.weakSkills[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1, paddingBottom: 100 }}>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 26, margin: "0 46px 0 0" }}>
        {greeting}
      </h1>

      <div style={{ display: "flex", gap: 8 }}>
        <Pill theme={theme}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill={theme.accentDeep} stroke="none"><path d="M12 2c1 3 5 5 5 10a5 5 0 01-10 0c0-1.5.5-2.5 1.3-3.6.4.9 1.2 1.4 1.2 1.4-.3-2 .5-4 2.5-7.8z" /></svg>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{streakDays}</span>
        </Pill>
        <Pill theme={theme}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={theme.navy} stroke="none"><path d="M12 2l3 6.5 7 .9-5 5 1.2 7-6.2-3.4L5.8 21.4 7 14.4l-5-5 7-.9L12 2Z" /></svg>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Lv. {level}</span>
        </Pill>
        <Pill theme={theme}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.navy} strokeWidth="1.8"><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /></svg>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{goalDone}/{dailyGoalMinutes} นาที</span>
        </Pill>
      </div>

      <div
        className="el-tap"
        onClick={() => router.push("/session")}
        style={{ borderRadius: 26, padding: 20, background: theme.accentSoft, boxShadow: theme.shadowCard }}
      >
        <div style={{ fontSize: 12, letterSpacing: ".04em", color: theme.accentDeep, marginBottom: 6, fontWeight: 600 }}>กำลังเรียนต่อ</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 22, marginBottom: 4 }}>
          {nextQuestion ? SKILL_LABELS[nextQuestion.skill] : "ฝึกฝน"}
        </div>
        <div style={{ fontSize: 13, color: theme.muted, marginBottom: 16 }}>{nextQuestion?.pattern ?? "เริ่มฝึกข้อแรกของคุณ"}</div>
        <button
          className="el-tap"
          onClick={() => router.push("/session")}
          style={{ width: "100%", height: 52, border: "none", borderRadius: 16, background: theme.btnBg, color: theme.btnText, fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          ทำต่อ
        </button>
      </div>

      <div style={{ borderRadius: 24, padding: "18px 20px", background: theme.surface, boxShadow: theme.shadowCard }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>ภารกิจวันนี้</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.accentDeep, background: theme.accentSoft, padding: "3px 10px", borderRadius: 999 }}>{missionDone}/{missionItems.length}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {missionItems.map((m) => (
            <div key={m.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: "22%" }}>
              {m.done ? (
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.btnText} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
              ) : (
                <div style={{ width: 30, height: 30, borderRadius: "50%", border: `1.5px solid ${theme.border}` }} />
              )}
              <span style={{ fontSize: 10, color: theme.muted, textAlign: "center" }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {latestMistake && (
        <div style={{ borderRadius: 24, padding: "16px 18px", background: theme.surface, boxShadow: theme.shadowCard, display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 12, background: theme.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.accentDeep} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.4.9 1 .9 1.7v.4h5.2v-.4c0-.7.3-1.3.9-1.7A6 6 0 0012 3z" /></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: theme.accentDeep, marginBottom: 2 }}>น่าทบทวน</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{latestMistakePattern ?? "-"}</div>
            <div style={{ fontSize: 12.5, color: theme.muted }}>คุณพลาดจุดนี้เมื่อเร็ว ๆ นี้</div>
          </div>
          <button
            className="el-tap"
            onClick={() => router.push("/review")}
            style={{ height: 34, padding: "0 14px", borderRadius: 10, border: `1.3px solid ${theme.accent}`, background: "transparent", color: theme.accentDeep, fontSize: 12.5, fontWeight: 600, flexShrink: 0, alignSelf: "center" }}
          >
            ทบทวน
          </button>
        </div>
      )}

      {weakSkill && (
        <div style={{ borderRadius: 24, padding: "16px 18px", background: theme.surface, boxShadow: theme.shadowCard, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 12, background: `${theme.navy}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>📖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: theme.navy, marginBottom: 2 }}>แนะนำสำหรับคุณ</div>
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>{SKILL_LABELS[weakSkill]} — จากผลประเมิน</div>
          </div>
          <button
            className="el-tap"
            onClick={() => router.push("/practice")}
            style={{ height: 34, padding: "0 14px", borderRadius: 10, border: `1.3px solid ${theme.navy}`, background: "transparent", color: theme.navy, fontSize: 12.5, fontWeight: 600, flexShrink: 0 }}
          >
            ฝึก
          </button>
        </div>
      )}

      <div
        className="el-tap"
        onClick={() => router.push("/session")}
        style={{ borderRadius: 20, padding: "14px 18px", border: `1.3px solid ${theme.accent}`, display: "flex", alignItems: "center", gap: 10 }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill={theme.accentDeep} stroke="none"><path d="M13 2L3 14h7v8l10-12h-7z" /></svg>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.accentDeep }}>ฝึกด่วน</div>
          <div style={{ fontSize: 11.5, color: theme.muted }}>ให้ระบบเลือกให้</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.accentDeep} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
      </div>
    </div>
  );
}

function Pill({ children, theme }: { children: React.ReactNode; theme: ReturnType<typeof useTheme>["theme"] }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, padding: "9px 10px", borderRadius: 14, background: theme.surface, boxShadow: theme.shadowSm }}>
      {children}
    </div>
  );
}
