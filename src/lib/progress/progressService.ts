import type { PracticeResult } from "@/lib/practice/types";
import type { ReviewScheduleItem } from "@/lib/practice/reviewScheduleService";
import type { PatternMastery } from "@/lib/pattern/types";
import { SKILL_LEVELS, type DifficultyTier, type Skill, type SkillProfile } from "@/lib/skill/types";

const DAY_MS = 24 * 60 * 60 * 1000;

function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

/** "L1".."L5" -> 1..5. Single source of truth so Home/Progress never disagree. */
export function overallLevelNumber(overallLevel: string | null): number {
  const idx = overallLevel ? SKILL_LEVELS.indexOf(overallLevel as (typeof SKILL_LEVELS)[number]) : -1;
  return idx >= 0 ? idx + 1 : 1;
}

/** Consecutive calendar days (ending today or yesterday) with >=1 real practice attempt. */
export function computeStreakDays(results: PracticeResult[], now: number = Date.now()): number {
  const days = new Set(results.map((r) => dayKey(r.createdAt)));
  let streak = 0;
  let cursor = now;
  if (!days.has(dayKey(now))) cursor -= DAY_MS; // today has no activity yet — check if yesterday keeps the streak alive
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor -= DAY_MS;
  }
  return streak;
}

/** Minutes actually practiced today, from real response times. */
export function computeTodayMinutes(results: PracticeResult[], now: number = Date.now()): number {
  const today = dayKey(now);
  const ms = results.filter((r) => dayKey(r.createdAt) === today).reduce((sum, r) => sum + r.responseTimeMs, 0);
  return Math.round(ms / 60000);
}

export type TodayMissions = {
  practicedNew: boolean;
  reviewed: boolean;
  fixedMistake: boolean;
  challenged: boolean;
};

/** Real, derived-today signals — no fabricated "mission" state. */
export function computeTodayMissions(
  results: PracticeResult[],
  reviewSchedule: ReviewScheduleItem[],
  now: number = Date.now()
): TodayMissions {
  const today = dayKey(now);
  const todayResults = results.filter((r) => dayKey(r.createdAt) === today);
  const sortedAsc = [...results].sort((a, b) => a.createdAt - b.createdAt);

  const practicedNew = todayResults.length > 0;
  const reviewed = reviewSchedule.some((r) => dayKey(r.lastReviewedAt) === today && r.reviewCount > 1);
  const fixedMistake = todayResults.some((r) => {
    if (!r.correct) return false;
    return sortedAsc.some((prior) => prior.questionId === r.questionId && prior.createdAt < r.createdAt && !prior.correct);
  });
  const challenged = todayResults.some((r) => r.difficulty === "hard");

  return { practicedNew, reviewed, fixedMistake, challenged };
}

/** Average skill score (0-100) across all skill profiles. */
export function masteryPctOverall(skillProfiles: Record<Skill, SkillProfile> | null): number {
  if (!skillProfiles) return 0;
  const scores = Object.values(skillProfiles).map((p) => p.score);
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export type HistoryEntry = { day: string; minutes: number; correct: number };

const WINDOW_DAYS: Record<"7d" | "30d" | "all", number | null> = { "7d": 7, "30d": 30, all: null };

/** Groups real practice results into per-day totals for the requested window. */
export function computeHistoryByFilter(results: PracticeResult[], filter: "7d" | "30d" | "all", now: number = Date.now()): HistoryEntry[] {
  const windowDays = WINDOW_DAYS[filter];
  const cutoff = windowDays ? now - windowDays * DAY_MS : 0;
  const byDay = new Map<string, { minutes: number; correct: number; latest: number }>();

  results
    .filter((r) => r.createdAt >= cutoff)
    .forEach((r) => {
      const key = dayKey(r.createdAt);
      const entry = byDay.get(key) ?? { minutes: 0, correct: 0, latest: r.createdAt };
      entry.minutes += r.responseTimeMs / 60000;
      entry.correct += r.correct ? 1 : 0;
      entry.latest = Math.max(entry.latest, r.createdAt);
      byDay.set(key, entry);
    });

  const todayKey = dayKey(now);
  const yesterdayKey = dayKey(now - DAY_MS);

  return Array.from(byDay.entries())
    .sort((a, b) => b[1].latest - a[1].latest)
    .map(([key, entry]) => ({
      day: key === todayKey ? "วันนี้" : key === yesterdayKey ? "เมื่อวาน" : key,
      minutes: Math.round(entry.minutes),
      correct: entry.correct,
    }));
}

export type Achievement = { label: string };

/** Only ever returns achievements actually earned from real counts — never a fabricated claim. */
export function computeAchievements(results: PracticeResult[], streakDays: number, patternMastery: PatternMastery[]): Achievement[] {
  const achievements: Achievement[] = [];
  if (results.length >= 100) achievements.push({ label: "🏆 100 ประโยคแรก" });
  if (streakDays >= 7) achievements.push({ label: "🔥 ต่อเนื่อง 7 วัน" });
  if (patternMastery.filter((p) => p.masteryPct >= 80).length >= 10) achievements.push({ label: "⭐ เชี่ยวชาญ 10 Pattern" });
  return achievements;
}

export type ImprovingSkill = { skill: Skill; deltaPct: number };

/**
 * Compares each skill's earlier-half vs later-half average score across its
 * own real practice history — real trend signal, not a fabricated weekly
 * comparison, since no historical snapshot mechanism exists.
 */
export function computeMostImprovedSkill(results: PracticeResult[]): ImprovingSkill | null {
  const bySkill = new Map<Skill, PracticeResult[]>();
  results.forEach((r) => {
    const list = bySkill.get(r.skill) ?? [];
    list.push(r);
    bySkill.set(r.skill, list);
  });

  let best: ImprovingSkill | null = null;
  bySkill.forEach((list, skill) => {
    if (list.length < 4) return;
    const sorted = [...list].sort((a, b) => a.createdAt - b.createdAt);
    const mid = Math.floor(sorted.length / 2);
    const earlier = sorted.slice(0, mid);
    const later = sorted.slice(mid);
    const avg = (xs: PracticeResult[]) => xs.reduce((s, r) => s + r.score, 0) / xs.length;
    const deltaPct = Math.round(avg(later) - avg(earlier));
    if (deltaPct > 0 && (!best || deltaPct > best.deltaPct)) {
      best = { skill, deltaPct };
    }
  });
  return best;
}

/** Trailing run of consecutive correct answers within one practice session — real "combo" signal, not a fabricated counter. */
export function computeSessionStreak(results: PracticeResult[], sessionId: string): number {
  const inSession = results.filter((r) => r.sessionId === sessionId).sort((a, b) => a.createdAt - b.createdAt);
  let streak = 0;
  for (let i = inSession.length - 1; i >= 0; i--) {
    if (!inSession[i].correct) break;
    streak += 1;
  }
  return streak;
}

export type SessionRecap = {
  answered: number;
  correctCount: number;
  avgScore: number;
  tierCounts: Record<DifficultyTier, number>;
};

/** Summary of everything actually answered in one session — for the end-of-session recap card. */
export function computeSessionRecap(results: PracticeResult[], sessionId: string): SessionRecap {
  const inSession = results.filter((r) => r.sessionId === sessionId);
  const tierCounts: Record<DifficultyTier, number> = { easy: 0, medium: 0, hard: 0 };
  inSession.forEach((r) => {
    tierCounts[r.difficulty] += 1;
  });
  const avgScore = inSession.length > 0 ? Math.round(inSession.reduce((s, r) => s + r.score, 0) / inSession.length) : 0;
  return {
    answered: inSession.length,
    correctCount: inSession.filter((r) => r.correct).length,
    avgScore,
    tierCounts,
  };
}
