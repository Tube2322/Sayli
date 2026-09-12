export type DifficultyPreference = "beginner" | "normal" | "challenge";

export type UserProfile = {
  uid: string;
  displayName: string;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
  assessmentCompleted: boolean;
  lastAssessmentAt: number | null;
  overallLevel: string | null;
  difficultyPreference: DifficultyPreference;
};
