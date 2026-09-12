export type PatternMastery = {
  patternId: string;
  pattern: string; // display label, e.g. "didn't mean to + verb"
  attempts: number;
  correct: number;
  masteryPct: number; // 0-100, correct / attempts
  updatedAt: number;
};
