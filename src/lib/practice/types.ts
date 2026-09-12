import type { DifficultyTier, Skill } from "@/lib/skill/types";

export type PracticeResult = {
  id: string;
  sessionId: string;
  questionId: string;
  skill: Skill;
  difficulty: DifficultyTier;
  answer: string;
  referenceAnswer: string;
  evaluation: "correct" | "incorrect";
  score: number; // 0-100
  correct: boolean;
  responseTimeMs: number;
  createdAt: number;
};

export type LearningState = {
  weakSkills: Skill[];
  strongSkills: Skill[];
  weakPatterns: string[];
  recentMistakes: { questionId: string; skill: Skill; answer: string; referenceAnswer: string; createdAt: number }[];
  reviewPriority: Skill[];
  recommendedDifficulty: DifficultyTier;
  recentlyLearned: string[];
  almostMastered: string[];
  forgottenItems: string[];
  updatedAt: number;
};
