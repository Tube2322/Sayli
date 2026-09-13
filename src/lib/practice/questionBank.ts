import type { DifficultyTier, Skill } from "@/lib/skill/types";

// Metadata for real practice questions, keyed by questionId — single source
// of truth so SessionScreen (which asks the question), the Adaptive Engine
// (which picks a question), and ReviewScreen (which shows past mistakes on
// it) never duplicate this content.
export type QuestionMeta = {
  skill: Skill;
  difficulty: DifficultyTier;
  en: string;
  pattern: string;
  referenceAnswer: string;
  acceptableAnswers: string[];
};

export const QUESTION_BANK: Record<string, QuestionMeta> = {
  "session-demo-didnt-mean-to-hurt-you": {
    skill: "understanding",
    difficulty: "medium",
    en: "I didn't mean to hurt you.",
    pattern: "didn't mean to + verb",
    referenceAnswer: "ฉันไม่ได้ตั้งใจทำให้คุณเจ็บ",
    acceptableAnswers: [
      "ฉันไม่ได้ตั้งใจทำให้คุณเจ็บ",
      "ฉันไม่ได้ตั้งใจจะทำร้ายคุณ",
      "ฉันไม่ได้ตั้งใจทำร้ายคุณ",
      "ฉันไม่ได้หมายความจะทำร้ายคุณ",
    ],
  },
};
