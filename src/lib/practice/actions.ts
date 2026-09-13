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
import { getSkillProfiles, updateSkillProfileFromScore } from "@/lib/skill/actions";
import { calculateSkillLevel } from "@/lib/skill/levelService";
import { computeLearningState } from "@/lib/practice/learningStateService";
import type { LearningState, PracticeResult } from "@/lib/practice/types";
import { getPatternMastery, recordPatternAttempt } from "@/lib/pattern/actions";
import { computeReviewScheduleUpdate, type ReviewScheduleItem } from "@/lib/practice/reviewScheduleService";

function practiceResultsCol(uid: string) {
  return collection(db, "users", uid, "practiceResults");
}

function learningStateRef(uid: string) {
  return doc(db, "users", uid, "learningState", "current");
}

function reviewScheduleCol(uid: string) {
  return collection(db, "users", uid, "reviewSchedule");
}

function reviewScheduleFromDoc(id: string, data: Record<string, unknown>): ReviewScheduleItem {
  return {
    questionId: id,
    skill: data.skill as Skill,
    masteryScore: data.masteryScore as number,
    reviewCount: data.reviewCount as number,
    consecutiveCorrect: data.consecutiveCorrect as number,
    intervalDays: data.intervalDays as number,
    lastReviewedAt: (data.lastReviewedAt as number) ?? Date.now(),
    nextReviewAt: (data.nextReviewAt as number) ?? Date.now(),
  };
}

export async function getReviewSchedule(uid: string): Promise<ReviewScheduleItem[]> {
  const snap = await getDocs(reviewScheduleCol(uid));
  return snap.docs.map((d) => reviewScheduleFromDoc(d.id, d.data()));
}

/** Upserts one question's spaced-repetition schedule from a fresh attempt. */
async function recordReviewScheduleAttempt(
  uid: string,
  questionId: string,
  skill: Skill,
  correct: boolean,
  score: number
): Promise<void> {
  const ref = doc(reviewScheduleCol(uid), questionId);
  const snap = await getDoc(ref);
  const prev = snap.exists() ? reviewScheduleFromDoc(questionId, snap.data()) : null;
  const next = computeReviewScheduleUpdate(prev, { questionId, skill, correct, score }, Date.now());
  await setDoc(ref, next);
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
 * Updates the practiced skill's profile from this one attempt's score, via
 * the same EMA smoothing already used for reviewSchedule/patternMastery
 * (prev*0.5 + new*0.5) — so Level/mastery% actually move with real ongoing
 * practice instead of staying frozen at whatever assessment/self-select last
 * set them to. Fetches the current profile fresh rather than trusting the
 * caller's snapshot, since many attempts can land in one session.
 */
async function updateSkillProfileFromPractice(uid: string, skill: Skill, score: number): Promise<SkillProfile> {
  const current = (await getSkillProfiles(uid))[skill];
  const nextScore = Math.round((current?.score ?? score) * 0.5 + score * 0.5);
  await updateSkillProfileFromScore(uid, skill, nextScore, current?.confidence ?? "low", "adaptive_update");
  return {
    skill,
    level: calculateSkillLevel(nextScore),
    score: nextScore,
    confidence: current?.confidence ?? "low",
    source: "adaptive_update",
    startingDifficulty: current?.startingDifficulty ?? "easy",
    updatedAt: Date.now(),
  };
}

/**
 * Records one real practice attempt, updates the practiced skill's profile,
 * then recomputes and stores Learning State from the fresh result history —
 * the only place either is written, so Home/Review/Recommendation never
 * diverge (spec §13-14, §28).
 */
export async function recordPracticeResult(
  uid: string,
  input: Omit<PracticeResult, "id" | "createdAt">,
  skillProfiles: Record<Skill, SkillProfile>,
  difficultyPreference: DifficultyPreference
): Promise<void> {
  await addDoc(practiceResultsCol(uid), { ...input, createdAt: serverTimestamp() });
  await recordPatternAttempt(uid, input.pattern, input.correct);
  await recordReviewScheduleAttempt(uid, input.questionId, input.skill, input.correct, input.score);
  const updatedProfile = await updateSkillProfileFromPractice(uid, input.skill, input.score);
  const recentResults = await getRecentPracticeResults(uid, 20);
  const patternMastery = await getPatternMastery(uid);
  const reviewSchedule = await getReviewSchedule(uid);
  const nextSkillProfiles = { ...skillProfiles, [input.skill]: updatedProfile };
  const state = computeLearningState(nextSkillProfiles, recentResults, difficultyPreference, patternMastery, reviewSchedule);
  await setDoc(learningStateRef(uid), { ...state, updatedAt: serverTimestamp() });
}
