import type { DifficultyPreference } from "@/lib/profile/types";
import { SKILL_LEVELS, type DifficultyTier, type Skill, type SkillProfile } from "@/lib/skill/types";
import { getDifficultyDistribution } from "@/lib/skill/difficultyService";
import type { LearningState, PracticeResult } from "@/lib/practice/types";

// Single source of truth for "what does the learner need next" — Home,
// Review, and Recommendation all read the stored result of this function;
// none of them may recompute it independently (spec §13).
export function computeLearningState(
  skillProfiles: Record<Skill, SkillProfile>,
  recentResults: PracticeResult[],
  difficultyPreference: DifficultyPreference
): Omit<LearningState, "updatedAt"> {
  const skills = Object.values(skillProfiles);
  const ranked = [...skills].sort((a, b) => SKILL_LEVELS.indexOf(a.level) - SKILL_LEVELS.indexOf(b.level));

  const weakSkills = ranked.slice(0, 2).map((s) => s.skill);
  const strongSkills = ranked.slice(-2).map((s) => s.skill);

  const mistakes = recentResults.filter((r) => !r.correct).slice(0, 10);
  const recentMistakes = mistakes.map((r) => ({
    questionId: r.questionId,
    skill: r.skill,
    answer: r.answer,
    referenceAnswer: r.referenceAnswer,
    createdAt: r.createdAt,
  }));

  const reviewPriority = Array.from(new Set([...weakSkills, ...mistakes.map((m) => m.skill)]));

  const recent = recentResults.slice(0, 5);
  const correctRatio = recent.length > 0 ? recent.filter((r) => r.correct).length / recent.length : 0.5;
  const distribution = getDifficultyDistribution(difficultyPreference);
  const dominantTier = (Object.entries(distribution).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "medium") as DifficultyTier;
  const tiers: DifficultyTier[] = ["easy", "medium", "hard"];
  const dominantIdx = tiers.indexOf(dominantTier);
  const recommendedDifficulty =
    correctRatio >= 0.7 ? tiers[Math.min(dominantIdx + 1, 2)] : correctRatio < 0.4 ? tiers[Math.max(dominantIdx - 1, 0)] : dominantTier;

  return {
    weakSkills,
    strongSkills,
    weakPatterns: [], // populated once Pattern Mastery (Phase 5) exists
    recentMistakes,
    reviewPriority,
    recommendedDifficulty,
    recentlyLearned: [], // populated once lesson-completion tracking exists
    almostMastered: [], // populated once mastery scoring (Phase 5/6) exists
    forgottenItems: [], // populated once spaced repetition (Phase 6) exists
  };
}
