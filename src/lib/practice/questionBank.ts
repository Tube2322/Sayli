import type { DifficultyTier, Skill } from "@/lib/skill/types";
import type { Register } from "@/lib/content/registerClassifier";
import generatedQuestions from "@/lib/practice/generatedQuestions.json";

// Metadata for real practice questions, keyed by questionId — single source
// of truth so SessionScreen (which asks the question), the Adaptive Engine
// (which picks a question), and ReviewScreen (which shows past mistakes on
// it) never duplicate this content.
export type QuestionMeta = {
  skill: Skill;
  difficulty: DifficultyTier;
  register: Register;
  en: string;
  pattern: string;
  referenceAnswer: string;
  acceptableAnswers: string[];
  hintWord: string;
  hintMeaning: string;
  // Present on questions ingested from Tatoeba.org (scripts/ingestTatoeba.mjs)
  // — required for CC-BY attribution; absent on hand-authored questions.
  sourceLicense?: string;
  sourceAttribution?: string;
};

const HAND_AUTHORED: Record<string, QuestionMeta> = {
  "session-demo-didnt-mean-to-hurt-you": {
    skill: "understanding",
    difficulty: "medium",
    register: "casual",
    en: "I didn't mean to hurt you.",
    pattern: "didn't mean to + verb",
    referenceAnswer: "ฉันไม่ได้ตั้งใจทำให้คุณเจ็บ",
    acceptableAnswers: [
      "ฉันไม่ได้ตั้งใจทำให้คุณเจ็บ",
      "ฉันไม่ได้ตั้งใจจะทำร้ายคุณ",
      "ฉันไม่ได้ตั้งใจทำร้ายคุณ",
      "ฉันไม่ได้หมายความจะทำร้ายคุณ",
    ],
    hintWord: "mean",
    hintMeaning: "หมายถึง \"หมายความว่า\"",
  },
};

// Bulk content pulled from the free Tatoeba EN-TH sentence pairs and
// classified by scripts/ingestTatoeba.mjs (word-frequency difficulty,
// marker-based register) — re-run that script to grow this pool; nothing
// here is hand-typed or fabricated.
const GENERATED: Record<string, QuestionMeta> = Object.fromEntries(
  (generatedQuestions as Array<QuestionMeta & { questionId: string }>).map(
    ({ questionId, ...meta }) => [questionId, meta]
  )
);

export const QUESTION_BANK: Record<string, QuestionMeta> = { ...GENERATED, ...HAND_AUTHORED };
