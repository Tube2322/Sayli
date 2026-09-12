import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { DifficultyPreference, UserProfile } from "@/lib/profile/types";

function toMillis(value: Timestamp | null | undefined): number | null {
  return value ? value.toMillis() : null;
}

function fromDoc(uid: string, data: Record<string, unknown>): UserProfile {
  return {
    uid,
    displayName: (data.displayName as string) ?? "",
    createdAt: toMillis(data.createdAt as Timestamp) ?? Date.now(),
    updatedAt: toMillis(data.updatedAt as Timestamp) ?? Date.now(),
    assessmentCompleted: Boolean(data.assessmentCompleted),
    lastAssessmentAt: toMillis(data.lastAssessmentAt as Timestamp),
    overallLevel: (data.overallLevel as string) ?? null,
    difficultyPreference: (data.difficultyPreference as DifficultyPreference) ?? "normal",
  };
}

/**
 * Reads the caller's profile doc, creating it with defaults on first login
 * (e.g. right after sign-up). Never overwrites an existing doc.
 */
export async function getOrCreateProfile(
  uid: string,
  displayName: string
): Promise<UserProfile> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return fromDoc(uid, snap.data());
  }
  const defaults = {
    displayName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    assessmentCompleted: false,
    lastAssessmentAt: null,
    overallLevel: null,
    difficultyPreference: "normal" as DifficultyPreference,
  };
  await setDoc(ref, defaults);
  return {
    uid,
    displayName,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    assessmentCompleted: false,
    lastAssessmentAt: null,
    overallLevel: null,
    difficultyPreference: "normal",
  };
}

export async function updateDifficultyPreference(
  uid: string,
  value: DifficultyPreference
): Promise<void> {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { difficultyPreference: value, updatedAt: serverTimestamp() });
}

export async function updateDisplayName(uid: string, value: string): Promise<void> {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { displayName: value, updatedAt: serverTimestamp() });
}

export async function updateOverallLevel(uid: string, overallLevel: string): Promise<void> {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { overallLevel, updatedAt: serverTimestamp() });
}

export async function markAssessmentCompleted(uid: string): Promise<void> {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    assessmentCompleted: true,
    lastAssessmentAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
