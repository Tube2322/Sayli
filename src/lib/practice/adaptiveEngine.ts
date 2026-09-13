import type { DifficultyTier, Skill } from "@/lib/skill/types";
import type { QuestionMeta } from "@/lib/practice/questionBank";
import type { LearningState } from "@/lib/practice/types";

export type AdaptiveContext = {
  reviewPriority: Skill[];
  weakSkills: Skill[];
  forgottenItems: string[]; // questionIds due for spaced review
  recommendedDifficulty: DifficultyTier;
};

export function contextFromLearningState(learningState: LearningState | null): AdaptiveContext {
  return {
    reviewPriority: learningState?.reviewPriority ?? [],
    weakSkills: learningState?.weakSkills ?? [],
    forgottenItems: learningState?.forgottenItems ?? [],
    recommendedDifficulty: learningState?.recommendedDifficulty ?? "medium",
  };
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
  context: AdaptiveContext
): string | null {
  const entries = Object.entries(questionBank);
  if (entries.length === 0) return null;

  let best: { questionId: string; score: number } | null = null;
  for (const [questionId, meta] of entries) {
    let score = 0;
    if (context.forgottenItems.includes(questionId)) score += 100;
    if (context.reviewPriority.includes(meta.skill)) score += 50;
    if (meta.difficulty === context.recommendedDifficulty) score += 20;
    if (context.weakSkills.includes(meta.skill)) score += 10;

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
