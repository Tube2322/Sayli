import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { calculateSkillLevel, representativeScoreForLevel, startingDifficultyForLevel } from "@/lib/skill/levelService";
import { SKILLS, type Skill, type SkillProfile, type Confidence, type SkillSource } from "@/lib/skill/types";

const DEFAULT_SCORE = representativeScoreForLevel("L2");

function skillProfilesCol(uid: string) {
  return collection(db, "users", uid, "skillProfiles");
}

function fromDoc(skill: Skill, data: Record<string, unknown>): SkillProfile {
  const updatedAt = data.updatedAt as Timestamp | undefined;
  return {
    skill,
    level: (data.level as SkillProfile["level"]) ?? "L2",
    score: typeof data.score === "number" ? data.score : DEFAULT_SCORE,
    confidence: (data.confidence as Confidence) ?? "low",
    source: (data.source as SkillSource) ?? "default",
    startingDifficulty: (data.startingDifficulty as SkillProfile["startingDifficulty"]) ?? "easy",
    updatedAt: updatedAt ? updatedAt.toMillis() : Date.now(),
  };
}

/**
 * Ensures all five skills have a profile doc for this user, seeding
 * unassessed defaults (L2, low confidence) for any that are missing.
 * Never overwrites an existing doc — safe to call on every login.
 */
export async function getOrCreateSkillProfiles(uid: string): Promise<Record<Skill, SkillProfile>> {
  const snap = await getDocs(skillProfilesCol(uid));
  const existing = new Map<string, SkillProfile>();
  snap.forEach((d) => existing.set(d.id, fromDoc(d.id as Skill, d.data())));

  const missing = SKILLS.filter((sk) => !existing.has(sk));
  if (missing.length > 0) {
    const batch = writeBatch(db);
    missing.forEach((sk) => {
      const level = "L2" as const;
      batch.set(doc(skillProfilesCol(uid), sk), {
        skill: sk,
        level,
        score: DEFAULT_SCORE,
        confidence: "low",
        source: "default",
        startingDifficulty: startingDifficultyForLevel(level),
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
    missing.forEach((sk) =>
      existing.set(sk, {
        skill: sk,
        level: "L2",
        score: DEFAULT_SCORE,
        confidence: "low",
        source: "default",
        startingDifficulty: startingDifficultyForLevel("L2"),
        updatedAt: Date.now(),
      })
    );
  }

  const result = {} as Record<Skill, SkillProfile>;
  SKILLS.forEach((sk) => {
    result[sk] = existing.get(sk)!;
  });
  return result;
}

export async function getSkillProfiles(uid: string): Promise<Record<Skill, SkillProfile>> {
  const snap = await getDocs(skillProfilesCol(uid));
  const result = {} as Record<Skill, SkillProfile>;
  snap.forEach((d) => {
    result[d.id as Skill] = fromDoc(d.id as Skill, d.data());
  });
  return result;
}

/**
 * Updates one skill's profile from a new score, deriving level and starting
 * difficulty through the shared level service (single source of truth) —
 * never computed ad hoc by the caller.
 */
export async function updateSkillProfileFromScore(
  uid: string,
  skill: Skill,
  score: number,
  confidence: Confidence,
  source: SkillSource
): Promise<void> {
  const level = calculateSkillLevel(score);
  await setDoc(
    doc(skillProfilesCol(uid), skill),
    {
      skill,
      level,
      score,
      confidence,
      source,
      startingDifficulty: startingDifficultyForLevel(level),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/** Self-selected level: no measured score, so confidence is always "low" (spec §6). */
export async function setSelfSelectedSkillLevel(uid: string, skill: Skill, level: SkillProfile["level"]): Promise<void> {
  await updateDoc(doc(skillProfilesCol(uid), skill), {
    skill,
    level,
    score: representativeScoreForLevel(level),
    confidence: "low",
    source: "self_selected",
    startingDifficulty: startingDifficultyForLevel(level),
    updatedAt: serverTimestamp(),
  });
}
