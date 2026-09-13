import type { QuestionMeta } from "@/lib/practice/questionBank";

// Small deterministic string hash (FNV-1a-ish) — same questionId always
// produces the same mode/shuffle, so re-rendering never changes the
// question's format mid-answer, but different questions vary naturally.
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Alternates format across questions (~50/50) so practice isn't all typed
// input or all multiple-choice — deterministic per question, not random per
// render.
export function isMultipleChoiceQuestion(questionId: string): boolean {
  return hashString(questionId) % 2 === 0;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let state = seed || 1;
  const next = () => {
    // xorshift32 — fast, deterministic, good enough for shuffling a 2-4 item list.
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const DISTRACTOR_COUNT = 3;

/**
 * Builds real multiple-choice options for a question: the correct answer
 * plus distractors drawn from other real questions' reference answers in
 * the same bank (preferring same skill+difficulty so wrong options are
 * plausible, not absurdly easy to spot) — never invented/fabricated text.
 */
export function buildMultipleChoiceOptions(
  questionBank: Record<string, QuestionMeta>,
  questionId: string,
  meta: QuestionMeta
): string[] {
  const others = Object.entries(questionBank).filter(([id]) => id !== questionId);

  const sameSkillAndDifficulty = others
    .filter(([, m]) => m.skill === meta.skill && m.difficulty === meta.difficulty)
    .map(([, m]) => m.referenceAnswer);
  const sameSkill = others.filter(([, m]) => m.skill === meta.skill).map(([, m]) => m.referenceAnswer);
  const anyOther = others.map(([, m]) => m.referenceAnswer);

  const pool = Array.from(new Set([...sameSkillAndDifficulty, ...sameSkill, ...anyOther])).filter(
    (a) => a !== meta.referenceAnswer
  );

  const distractors = seededShuffle(pool, hashString(questionId)).slice(0, DISTRACTOR_COUNT);
  const options = [...distractors, meta.referenceAnswer];
  return seededShuffle(options, hashString(questionId + ":order"));
}
