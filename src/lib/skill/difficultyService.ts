import type { DifficultyPreference } from "@/lib/profile/types";
import type { DifficultyTier } from "@/lib/skill/types";

// Practice Difficulty (question hardness) is deliberately separate from
// Skill Level (user ability) — see spec section 4. This distribution is
// what the Adaptive Engine (later phase) samples from; it never changes
// Skill Level directly.
export type DifficultyDistribution = Record<DifficultyTier, number>;

const BASE_DISTRIBUTION: Record<DifficultyPreference, DifficultyDistribution> = {
  beginner: { easy: 0.7, medium: 0.25, hard: 0.05 },
  normal: { easy: 0.5, medium: 0.35, hard: 0.15 },
  challenge: { easy: 0.2, medium: 0.4, hard: 0.4 },
};

export function getDifficultyDistribution(preference: DifficultyPreference): DifficultyDistribution {
  return BASE_DISTRIBUTION[preference];
}
