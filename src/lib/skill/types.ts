export type Skill = "reading" | "listening" | "writing" | "speaking" | "understanding";
export const SKILLS: Skill[] = ["reading", "listening", "writing", "speaking", "understanding"];

export type SkillLevel = "L1" | "L2" | "L3" | "L4" | "L5";
export const SKILL_LEVELS: SkillLevel[] = ["L1", "L2", "L3", "L4", "L5"];

export type Confidence = "low" | "medium" | "high";
export type DifficultyTier = "easy" | "medium" | "hard";
export type SkillSource = "assessment" | "self_selected" | "adaptive_update" | "default";

export type SkillProfile = {
  skill: Skill;
  level: SkillLevel;
  score: number; // 0-100 internal metric
  confidence: Confidence;
  source: SkillSource;
  startingDifficulty: DifficultyTier;
  updatedAt: number; // epoch ms
};
