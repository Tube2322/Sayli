// Metadata for real practice questions, keyed by questionId — single source
// of truth so SessionScreen (which asks the question) and ReviewScreen
// (which shows past mistakes on it) never duplicate this content.
export type QuestionMeta = {
  en: string;
  pattern: string;
};

export const QUESTION_BANK: Record<string, QuestionMeta> = {
  "session-demo-didnt-mean-to-hurt-you": {
    en: "I didn't mean to hurt you.",
    pattern: "didn't mean to + verb",
  },
};
