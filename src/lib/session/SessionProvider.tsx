"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import {
  getOrCreateProfile,
  updateDifficultyPreference,
  markAssessmentCompleted,
  updateOverallLevel,
} from "@/lib/profile/actions";
import type { DifficultyPreference, UserProfile } from "@/lib/profile/types";
import { getOrCreateSkillProfiles, setSelfSelectedSkillLevel, updateSkillProfileFromScore } from "@/lib/skill/actions";
import { aggregateOverallLevel, representativeScoreForLevel } from "@/lib/skill/levelService";
import type { Skill, SkillLevel, SkillProfile } from "@/lib/skill/types";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type SessionContextValue = {
  status: SessionStatus;
  user: User | null;
  profile: UserProfile | null;
  profileError: string | null;
  skillProfiles: Record<Skill, SkillProfile> | null;
  reloadProfile: () => void;
  setDifficultyPreference: (value: DifficultyPreference) => Promise<void>;
  completeAssessment: () => Promise<void>;
  saveSelfSelectedLevels: (levels: Record<Skill, SkillLevel>) => Promise<boolean>;
  saveAssessmentResults: (levels: Record<Skill, SkillLevel>) => Promise<boolean>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [skillProfiles, setSkillProfiles] = useState<Record<Skill, SkillProfile> | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setStatus(firebaseUser ? "authenticated" : "unauthenticated");
      if (!firebaseUser) {
        setProfile(null);
        setSkillProfiles(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setProfileError(null);
    getOrCreateProfile(user.uid, user.displayName || user.email || "Learner")
      .then((p) => {
        if (!cancelled) setProfile(p);
      })
      .catch((err) => {
        if (!cancelled) setProfileError(err instanceof Error ? err.message : "โหลดโปรไฟล์ไม่สำเร็จ");
      });
    getOrCreateSkillProfiles(user.uid)
      .then((sp) => {
        if (!cancelled) setSkillProfiles(sp);
      })
      .catch((err) => {
        if (!cancelled) setProfileError(err instanceof Error ? err.message : "โหลดโปรไฟล์ทักษะไม่สำเร็จ");
      });
    return () => {
      cancelled = true;
    };
  }, [user, reloadToken]);

  const reloadProfile = useCallback(() => setReloadToken((t) => t + 1), []);

  const setDifficultyPreference = useCallback(
    async (value: DifficultyPreference) => {
      if (!user || !profile) return;
      const previous = profile.difficultyPreference;
      setProfile({ ...profile, difficultyPreference: value });
      try {
        await updateDifficultyPreference(user.uid, value);
      } catch (err) {
        setProfile((p) => (p ? { ...p, difficultyPreference: previous } : p));
        setProfileError(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง");
      }
    },
    [user, profile]
  );

  const completeAssessment = useCallback(async () => {
    if (!user || !profile) return;
    setProfile({ ...profile, assessmentCompleted: true, lastAssessmentAt: Date.now() });
    try {
      await markAssessmentCompleted(user.uid);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "บันทึกผลไม่สำเร็จ ลองใหม่อีกครั้ง");
    }
  }, [user, profile]);

  const saveSelfSelectedLevels = useCallback(
    async (levels: Record<Skill, SkillLevel>) => {
      if (!user) return false;
      try {
        const skills = Object.keys(levels) as Skill[];
        await Promise.all(skills.map((sk) => setSelfSelectedSkillLevel(user.uid, sk, levels[sk])));
        await updateOverallLevel(user.uid, aggregateOverallLevel(Object.values(levels)));
        reloadProfile();
        return true;
      } catch (err) {
        setProfileError(err instanceof Error ? err.message : "บันทึกระดับที่เลือกไม่สำเร็จ ลองใหม่อีกครั้ง");
        return false;
      }
    },
    [user, reloadProfile]
  );

  const saveAssessmentResults = useCallback(
    async (levels: Record<Skill, SkillLevel>) => {
      if (!user) return false;
      try {
        const skills = Object.keys(levels) as Skill[];
        await Promise.all(
          skills.map((sk) =>
            updateSkillProfileFromScore(user.uid, sk, representativeScoreForLevel(levels[sk]), "low", "assessment")
          )
        );
        await updateOverallLevel(user.uid, aggregateOverallLevel(Object.values(levels)));
        reloadProfile();
        return true;
      } catch (err) {
        setProfileError(err instanceof Error ? err.message : "บันทึกผลประเมินไม่สำเร็จ ลองใหม่อีกครั้ง");
        return false;
      }
    },
    [user, reloadProfile]
  );

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        status,
        user,
        profile,
        profileError,
        skillProfiles,
        reloadProfile,
        setDifficultyPreference,
        completeAssessment,
        saveSelfSelectedLevels,
        saveAssessmentResults,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
