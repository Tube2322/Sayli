import { SKILL_LEVELS, type DifficultyTier, type SkillLevel } from "@/lib/skill/types";
import type { DifficultyPreference } from "@/lib/profile/types";

// Single source of truth for score -> level. Every part of the system must
// call calculateSkillLevel() rather than re-implementing this mapping.
// Thresholds are configurable here, not hardcoded per-caller.
const LEVEL_THRESHOLDS: { max: number; level: SkillLevel }[] = [
  { max: 24, level: "L1" },
  { max: 44, level: "L2" },
  { max: 64, level: "L3" },
  { max: 84, level: "L4" },
  { max: 100, level: "L5" },
];

export function calculateSkillLevel(score: number): SkillLevel {
  const clamped = Math.max(0, Math.min(100, score));
  const match = LEVEL_THRESHOLDS.find((t) => clamped <= t.max);
  return match ? match.level : "L5";
}

// A representative score for a level when only the level (not a measured
// score) is known — e.g. a self-selected level with no assessment evidence.
export function representativeScoreForLevel(level: SkillLevel): number {
  const band = LEVEL_THRESHOLDS.find((t) => t.level === level);
  if (!band) return 50;
  const prevMax = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.indexOf(band) - 1]?.max ?? -1;
  return Math.round((prevMax + 1 + band.max) / 2);
}

// Practice should start a little below the assessed/selected level, per spec
// section 12 ("Starting Difficulty"), then adapt from real performance.
export function startingDifficultyForLevel(level: SkillLevel): DifficultyTier {
  if (level === "L1" || level === "L2") return "easy";
  if (level === "L3" || level === "L4") return "medium";
  return "hard";
}

// The practice difficulty distribution (spec §4's beginner/normal/challenge
// preference) should start where the assessment actually placed the
// learner, not default to "normal" regardless of a genuinely low result —
// otherwise a true beginner gets 15% hard content from question one. Users
// can still override this in Settings afterward; a re-taken assessment
// recalibrates it again, same as everything else the assessment sets.
export function difficultyPreferenceForLevel(level: SkillLevel): DifficultyPreference {
  if (level === "L1" || level === "L2") return "beginner";
  if (level === "L3") return "normal";
  return "challenge";
}

// A single "overall level" for display (e.g. onboarding confirmation, profile
// summary) derived from the five independent skill levels — never stored as
// the primary record, since per-skill levels are what the system actually
// tracks (spec §3: users must not be forced onto one level for every skill).
export function aggregateOverallLevel(levels: SkillLevel[]): SkillLevel {
  if (levels.length === 0) return "L2";
  const avgRank = levels.reduce((sum, lv) => sum + SKILL_LEVELS.indexOf(lv), 0) / levels.length;
  const idx = Math.round(avgRank);
  return SKILL_LEVELS[Math.max(0, Math.min(SKILL_LEVELS.length - 1, idx))];
}
