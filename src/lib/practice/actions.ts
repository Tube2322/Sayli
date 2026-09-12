import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { DifficultyPreference } from "@/lib/profile/types";
import type { Skill, SkillProfile } from "@/lib/skill/types";
import { computeLearningState } from "@/lib/practice/learningStateService";
import type { LearningState, PracticeResult } from "@/lib/practice/types";
import { getPatternMastery, recordPatternAttempt } from "@/lib/pattern/actions";

function practiceResultsCol(uid: string) {
  return collection(db, "users", uid, "practiceResults");
}

function learningStateRef(uid: string) {
  return doc(db, "users", uid, "learningState", "current");
}

function resultFromDoc(id: string, data: Record<string, unknown>): PracticeResult {
  const createdAt = data.createdAt as Timestamp | undefined;
  return {
    id,
    sessionId: data.sessionId as string,
    questionId: data.questionId as string,
    skill: data.skill as Skill,
    difficulty: data.difficulty as PracticeResult["difficulty"],
    answer: data.answer as string,
    referenceAnswer: data.referenceAnswer as string,
    pattern: (data.pattern as string) ?? "",
    evaluation: data.evaluation as PracticeResult["evaluation"],
    score: data.score as number,
    correct: Boolean(data.correct),
    responseTimeMs: (data.responseTimeMs as number) ?? 0,
    createdAt: createdAt ? createdAt.toMillis() : Date.now(),
  };
}

export async function getRecentPracticeResults(uid: string, take = 20): Promise<PracticeResult[]> {
  const q = query(practiceResultsCol(uid), orderBy("createdAt", "desc"), limit(take));
  const snap = await getDocs(q);
  return snap.docs.map((d) => resultFromDoc(d.id, d.data()));
}

export async function getLearningState(uid: string): Promise<LearningState | null> {
  const snap = await getDoc(learningStateRef(uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  const updatedAt = data.updatedAt as Timestamp | undefined;
  return { ...(data as Omit<LearningState, "updatedAt">), updatedAt: updatedAt ? updatedAt.toMillis() : Date.now() };
}

/**
 * Records one real practice attempt, then recomputes and stores Learning
 * State from the fresh result history — the only place either is written,
 * so Home/Review/Recommendation never diverge (spec §13-14, §28).
 */
export async function recordPracticeResult(
  uid: string,
  input: Omit<PracticeResult, "id" | "createdAt">,
  skillProfiles: Record<Skill, SkillProfile>,
  difficultyPreference: DifficultyPreference
): Promise<void> {
  await addDoc(practiceResultsCol(uid), { ...input, createdAt: serverTimestamp() });
  await recordPatternAttempt(uid, input.pattern, input.correct);
  const recentResults = await getRecentPracticeResults(uid, 20);
  const patternMastery = await getPatternMastery(uid);
  const state = computeLearningState(skillProfiles, recentResults, difficultyPreference, patternMastery);
  await setDoc(learningStateRef(uid), { ...state, updatedAt: serverTimestamp() });
}
