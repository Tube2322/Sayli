import type { DifficultyTier, Skill } from "@/lib/skill/types";
import type { QuestionMeta } from "@/lib/practice/questionBank";
import type { LearningState } from "@/lib/practice/types";
import type { ReviewScheduleItem } from "@/lib/practice/reviewScheduleService";
import type { Register } from "@/lib/content/registerClassifier";

export type AdaptiveContext = {
  reviewPriority: Skill[];
  weakSkills: Skill[];
  forgottenItems: string[]; // questionIds due for spaced review
  recommendedDifficulty: DifficultyTier;
  reviewByQuestion: Record<string, ReviewScheduleItem>;
};

export function contextFromLearningState(
  learningState: LearningState | null,
  reviewSchedule: ReviewScheduleItem[] = []
): AdaptiveContext {
  return {
    reviewPriority: learningState?.reviewPriority ?? [],
    weakSkills: learningState?.weakSkills ?? [],
    forgottenItems: learningState?.forgottenItems ?? [],
    recommendedDifficulty: learningState?.recommendedDifficulty ?? "medium",
    reviewByQuestion: Object.fromEntries(reviewSchedule.map((r) => [r.questionId, r])),
  };
}

// A question not due for review yet but seen very recently (within this
// window) is nudged down so the learner doesn't hit the same content twice
// in a row; a question never attempted at all is nudged up so untried
// content surfaces before the pool is exhausted. Both are small relative to
// the skill/difficulty/due-for-review tiers above, so they only break ties
// within a tier — they never override real spaced-repetition priority.
const RECENCY_PENALTY_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;
const RECENCY_PENALTY_MAX = 8;
const NOVELTY_BONUS = 5;

// Small nudge toward a different register (social/casual/formal) than the
// question the learner most recently answered, so practice rotates across
// styles instead of settling into one — real signal from real history, not
// a fabricated "variety" stat.
const REGISTER_VARIETY_BONUS = 4;

function mostRecentRegister(
  questionBank: Record<string, QuestionMeta>,
  reviewByQuestion: Record<string, ReviewScheduleItem>
): Register | null {
  let latest: { questionId: string; at: number } | null = null;
  for (const [questionId, item] of Object.entries(reviewByQuestion)) {
    if (!latest || item.lastReviewedAt > latest.at) {
      latest = { questionId, at: item.lastReviewedAt };
    }
  }
  return latest ? (questionBank[latest.questionId]?.register ?? null) : null;
}

/**
 * Single source of truth for "what should the learner practice next" (spec
 * §Phase 7) — ranks every real question in the bank by how well it matches
 * the learner's current state, so "ฝึกด่วน" (Quick Practice) and the normal
 * session entry point never pick ad hoc or random content.
 *
 * Scoring is additive and ordered by priority: a question due for spaced
 * review outranks anything else, then a question in a weak/mistake skill,
 * then a question at the recommended difficulty, then a question in an
 * overall-weak skill. Ties break on questionId for determinism.
 */
export function selectNextQuestion(
  questionBank: Record<string, QuestionMeta>,
  context: AdaptiveContext,
  now: number = Date.now()
): string | null {
  const entries = Object.entries(questionBank);
  if (entries.length === 0) return null;

  const lastRegister = mostRecentRegister(questionBank, context.reviewByQuestion);

  let best: { questionId: string; score: number } | null = null;
  for (const [questionId, meta] of entries) {
    let score = 0;
    if (context.forgottenItems.includes(questionId)) score += 100;
    if (context.reviewPriority.includes(meta.skill)) score += 50;
    if (meta.difficulty === context.recommendedDifficulty) score += 20;
    if (context.weakSkills.includes(meta.skill)) score += 10;
    if (lastRegister && meta.register !== lastRegister) score += REGISTER_VARIETY_BONUS;

    const review = context.reviewByQuestion[questionId];
    if (!review) {
      score += NOVELTY_BONUS;
    } else {
      const elapsed = now - review.lastReviewedAt;
      if (elapsed < RECENCY_PENALTY_WINDOW_MS) {
        score -= Math.round(RECENCY_PENALTY_MAX * (1 - elapsed / RECENCY_PENALTY_WINDOW_MS));
      }
    }

    if (
      !best ||
      score > best.score ||
      (score === best.score && questionId < best.questionId)
    ) {
      best = { questionId, score };
    }
  }
  return best!.questionId;
}
