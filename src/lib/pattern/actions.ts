import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { PatternMastery } from "@/lib/pattern/types";

export function slugifyPattern(pattern: string): string {
  return pattern
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function patternMasteryCol(uid: string) {
  return collection(db, "users", uid, "patternMastery");
}

function fromDoc(id: string, data: Record<string, unknown>): PatternMastery {
  const updatedAt = data.updatedAt as Timestamp | undefined;
  return {
    patternId: id,
    pattern: data.pattern as string,
    attempts: (data.attempts as number) ?? 0,
    correct: (data.correct as number) ?? 0,
    masteryPct: (data.masteryPct as number) ?? 0,
    updatedAt: updatedAt ? updatedAt.toMillis() : Date.now(),
  };
}

export async function getPatternMastery(uid: string): Promise<PatternMastery[]> {
  const snap = await getDocs(patternMasteryCol(uid));
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

/**
 * Records one real attempt against a grammar pattern, deriving masteryPct
 * from cumulative attempts/correct — the only place pattern mastery is
 * written, so Review/Progress never recompute it independently (spec §13).
 */
export async function recordPatternAttempt(uid: string, pattern: string, correct: boolean): Promise<void> {
  const patternId = slugifyPattern(pattern);
  const ref = doc(patternMasteryCol(uid), patternId);
  const snap = await getDoc(ref);
  const prevAttempts = snap.exists() ? ((snap.data().attempts as number) ?? 0) : 0;
  const prevCorrect = snap.exists() ? ((snap.data().correct as number) ?? 0) : 0;
  const attempts = prevAttempts + 1;
  const correctCount = prevCorrect + (correct ? 1 : 0);
  await setDoc(ref, {
    pattern,
    attempts,
    correct: correctCount,
    masteryPct: Math.round((correctCount / attempts) * 100),
    updatedAt: serverTimestamp(),
  });
}
