// Single source of truth for answer evaluation (spec §13, §Phase 5).
// Replaces plain substring matching with a token-overlap similarity score so
// answers that are close-but-not-identical to an acceptable translation are
// scored proportionally instead of being flatly right or wrong.

import { normalizeText } from "@/lib/sampleData";

export type EvaluationResult = {
  correct: boolean;
  score: number; // 0-100
  similarity: number; // 0-1, best match across acceptable answers
};

const CORRECT_THRESHOLD = 0.7;

// Character bigrams, not whitespace-split words: Thai script has no spaces
// between words, so word-splitting would collapse an entire Thai sentence
// into one token and make similarity purely binary. Bigrams work for both
// Thai and English answers.
function tokenize(s: string): string[] {
  const normalized = normalizeText(s).replace(/\s+/g, "");
  if (normalized.length < 2) return normalized ? [normalized] : [];
  const grams: string[] = [];
  for (let i = 0; i < normalized.length - 1; i++) {
    grams.push(normalized.slice(i, i + 2));
  }
  return grams;
}

function jaccardSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 1;
  const setA = new Set(a);
  const setB = new Set(b);
  let intersection = 0;
  setA.forEach((t) => {
    if (setB.has(t)) intersection += 1;
  });
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

export function evaluateAnswer(answer: string, acceptableAnswers: string[]): EvaluationResult {
  const answerTokens = tokenize(answer);
  const bestSimilarity = acceptableAnswers.reduce((best, acceptable) => {
    const sim = jaccardSimilarity(answerTokens, tokenize(acceptable));
    return Math.max(best, sim);
  }, 0);

  const exactMatch = acceptableAnswers.some((a) => normalizeText(answer) === normalizeText(a));
  const similarity = exactMatch ? 1 : bestSimilarity;
  const correct = similarity >= CORRECT_THRESHOLD;
  const score = Math.round(similarity * 100);

  return { correct, score, similarity };
}
