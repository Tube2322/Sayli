import type { DifficultyTier } from "@/lib/skill/types";
import { wordFrequencyRank } from "@/lib/content/wordFrequency";

// Real, deterministic difficulty signal derived from word-frequency rank —
// no fabricated/hand-assigned difficulty per sentence. A sentence built from
// common words scores low (easy); frequent use of rare/unlisted words pushes
// it toward hard. Thresholds chosen against the 10k-word rank scale itself,
// not tuned per corpus, so this stays valid for any English input.
const EASY_MAX_AVG_RANK = 1200;
const MEDIUM_MAX_AVG_RANK = 4000;

function contentWords(sentence: string): string[] {
  return sentence
    .toLowerCase()
    .replace(/[^a-z' ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function classifySentenceDifficulty(sentence: string): DifficultyTier {
  const words = contentWords(sentence);
  if (words.length === 0) return "medium";

  const avgRank = words.reduce((sum, w) => sum + wordFrequencyRank(w), 0) / words.length;
  if (avgRank <= EASY_MAX_AVG_RANK) return "easy";
  if (avgRank <= MEDIUM_MAX_AVG_RANK) return "medium";
  return "hard";
}
