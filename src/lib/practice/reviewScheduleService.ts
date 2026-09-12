import type { Skill } from "@/lib/skill/types";

export type ReviewScheduleItem = {
  questionId: string;
  skill: Skill;
  masteryScore: number; // 0-100, EMA of recent scores on this question
  reviewCount: number;
  consecutiveCorrect: number;
  intervalDays: number;
  lastReviewedAt: number;
  nextReviewAt: number;
};

// Standard simplified SM-2 style interval ladder, indexed by consecutive
// correct streak. Resets to the first interval on any incorrect answer.
const INTERVAL_LADDER_DAYS = [1, 3, 7, 14, 30, 60];
const DAY_MS = 24 * 60 * 60 * 1000;

const ALMOST_MASTERED_MIN = 60;
const ALMOST_MASTERED_MAX = 85;

// Single source of truth for spaced repetition scheduling (spec §Phase 6) —
// Home/Review/Recommendation never recompute this independently.
export function computeReviewScheduleUpdate(
  prev: ReviewScheduleItem | null,
  input: { questionId: string; skill: Skill; correct: boolean; score: number },
  now: number
): ReviewScheduleItem {
  const prevMastery = prev?.masteryScore ?? input.score;
  const masteryScore = Math.round(prevMastery * 0.5 + input.score * 0.5);
  const consecutiveCorrect = input.correct ? (prev?.consecutiveCorrect ?? 0) + 1 : 0;
  const intervalDays = input.correct
    ? INTERVAL_LADDER_DAYS[Math.min(consecutiveCorrect - 1, INTERVAL_LADDER_DAYS.length - 1)]
    : INTERVAL_LADDER_DAYS[0];

  return {
    questionId: input.questionId,
    skill: input.skill,
    masteryScore,
    reviewCount: (prev?.reviewCount ?? 0) + 1,
    consecutiveCorrect,
    intervalDays,
    lastReviewedAt: now,
    nextReviewAt: now + intervalDays * DAY_MS,
  };
}

export function isAlmostMastered(item: ReviewScheduleItem, now: number): boolean {
  return item.masteryScore >= ALMOST_MASTERED_MIN && item.masteryScore < ALMOST_MASTERED_MAX && item.nextReviewAt > now;
}

export function isForgotten(item: ReviewScheduleItem, now: number): boolean {
  return item.nextReviewAt <= now;
}

export function isRecentlyLearned(item: ReviewScheduleItem, now: number): boolean {
  return item.reviewCount === 1 && item.nextReviewAt > now;
}
