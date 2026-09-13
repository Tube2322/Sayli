"use client";

// Ported from the original prototype's `Component` state machine
// (extracted/English Life.dc.html, class Component). Behavior is kept
// identical; only persistence differs (Phase 1 wires difficultyPreference to
// Firestore via SessionProvider — everything else here stays exactly the
// local-only, in-memory state the approved prototype already had).

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ASSESSMENT_QUESTIONS,
  LEVEL_META,
  LEVEL_ORDER,
  SKILL_LABELS,
  SKILL_ORDER,
  normalizeText,
} from "@/lib/sampleData";
import type { Skill } from "@/lib/skill/types";

export type ThemeMode = "light" | "dark" | "system";
export type ChooseMode = "all" | "each";
export type QuizPhase = "answering" | "feedback";
export type SheetKind = "hint" | "feedback" | "recap" | null;

export type SessionRecapData = { answered: number; correctCount: number; avgScore: number; tierCounts: Record<"easy" | "medium" | "hard", number> };

type SkillScoreEntry = { skill: string; correct: boolean; tier: "easy" | "medium" | "hard" };

type AppState = {
  themeMode: ThemeMode;
  answer: string;
  sheet: SheetKind;
  historyFilter: "7d" | "30d" | "all";
  dailyGoalMinutes: number;
  showPronunciation: boolean;
  soundOn: boolean;
  quizIndex: number;
  quizAnswer: number | string | null;
  quizPhase: QuizPhase;
  orderPicked: string[];
  skillScoresLog: SkillScoreEntry[];
  difficultyTier: "easy" | "medium" | "hard";
  lastCorrect: boolean | null;
  retakeConfirm: boolean;
  chooseMode: ChooseMode;
  chooseAllLevel: string;
  chooseEachLevels: Record<string, string>;
  assessmentDone: boolean;
  skillLevels: Record<string, string> | null;
  lastPracticeCorrect: boolean | null;
  lastPracticeScore: number | null;
  activeQuestion: ActiveQuestion | null;
  sessionRecap: SessionRecapData | null;
  preferredSkill: Skill | null;
};

export type ActiveQuestion = { en: string; pattern: string; hintWord: string; hintMeaning: string };

type AppStateContextValue = AppState & {
  toggleDark: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setAnswer: (v: string) => void;
  setDailyGoalMinutes: (v: number) => void;
  togglePronunciation: () => void;
  toggleSound: () => void;
  openHint: (question?: ActiveQuestion) => void;
  checkAnswer: (correct: boolean, score: number, question?: ActiveQuestion) => void;
  openRecap: (data: SessionRecapData) => void;
  setPreferredSkill: (skill: Skill | null) => void;
  consumePreferredSkill: () => Skill | null;
  closeSheets: () => void;
  continueAfterFeedback: () => void;
  setHistoryFilter: (f: "7d" | "30d" | "all") => void;
  setQuizAnswer: (v: number | string | null) => void;
  toggleOrderWord: (w: string) => void;
  submitQuizAnswer: () => void;
  nextQuizQuestion: () => void;
  goAssessmentIntro: () => void;
  finishAssessment: () => void;
  openRetakeConfirm: () => void;
  closeRetakeConfirm: () => void;
  confirmRetake: () => void;
  setChooseMode: (m: ChooseMode) => void;
  setChooseAllLevel: (lv: string) => void;
  setChooseEachLevel: (sk: string, lv: string) => void;
  computeSkillLevels: () => Record<string, string>;
  markAssessmentApplied: (levels: Record<string, string>) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

const initialState: AppState = {
  themeMode: "light",
  answer: "",
  sheet: null,
  historyFilter: "7d",
  dailyGoalMinutes: 8,
  showPronunciation: true,
  soundOn: true,
  quizIndex: 0,
  quizAnswer: null,
  quizPhase: "answering",
  orderPicked: [],
  skillScoresLog: [],
  difficultyTier: "medium",
  lastCorrect: null,
  retakeConfirm: false,
  chooseMode: "all",
  chooseAllLevel: "L3",
  chooseEachLevels: Object.fromEntries(SKILL_ORDER.map((sk) => [sk, "L3"])),
  assessmentDone: false,
  skillLevels: null,
  lastPracticeCorrect: null,
  lastPracticeScore: null,
  activeQuestion: null,
  sessionRecap: null,
  preferredSkill: null,
};

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const patch = (partial: Partial<AppState>) => setState((s) => ({ ...s, ...partial }));

  const computeSkillLevels = (): Record<string, string> => {
    const levels: Record<string, string> = {};
    SKILL_ORDER.forEach((sk) => {
      const entry = state.skillScoresLog.find((e) => e.skill === sk);
      if (!entry) {
        levels[sk] = "L2";
        return;
      }
      if (entry.correct) levels[sk] = entry.tier === "hard" ? "L5" : entry.tier === "medium" ? "L4" : "L3";
      else levels[sk] = entry.tier === "hard" ? "L3" : entry.tier === "medium" ? "L2" : "L1";
    });
    return levels;
  };

  const value: AppStateContextValue = useMemo(
    () => ({
      ...state,
      toggleDark: () =>
        patch({ themeMode: state.themeMode === "dark" ? "light" : "dark" }),
      setThemeMode: (mode) => patch({ themeMode: mode }),
      setAnswer: (v) => patch({ answer: v }),
      setDailyGoalMinutes: (v) => patch({ dailyGoalMinutes: v }),
      togglePronunciation: () => patch({ showPronunciation: !state.showPronunciation }),
      toggleSound: () => patch({ soundOn: !state.soundOn }),
      openHint: (question) => patch({ sheet: "hint", activeQuestion: question ?? state.activeQuestion }),
      checkAnswer: (correct, score, question) =>
        patch({ sheet: "feedback", lastPracticeCorrect: correct, lastPracticeScore: score, activeQuestion: question ?? state.activeQuestion }),
      openRecap: (data) => patch({ sheet: "recap", sessionRecap: data }),
      setPreferredSkill: (skill) => patch({ preferredSkill: skill }),
      // One-shot read: a skill preference set by tapping a Practice hub row
      // should steer only the very next question, not linger and bias every
      // future session (including "ฝึกด่วน" quick practice).
      consumePreferredSkill: () => {
        const skill = state.preferredSkill;
        if (skill) patch({ preferredSkill: null });
        return skill;
      },
      closeSheets: () => patch({ sheet: null }),
      continueAfterFeedback: () => patch({ sheet: null, answer: "" }),
      setHistoryFilter: (f) => patch({ historyFilter: f }),
      setQuizAnswer: (v) => patch({ quizAnswer: v }),
      toggleOrderWord: (w) =>
        patch({
          orderPicked: state.orderPicked.includes(w)
            ? state.orderPicked.filter((x) => x !== w)
            : [...state.orderPicked, w],
        }),
      submitQuizAnswer: () => {
        const q = ASSESSMENT_QUESTIONS[state.quizIndex];
        let correct = false;
        if (q.type === "mc") correct = state.quizAnswer === q.correct;
        else if (q.type === "order")
          correct = normalizeText(state.orderPicked.join(" ")) === normalizeText(q.correct as string);
        else
          correct = (q.accept || []).some((a) =>
            normalizeText(String(state.quizAnswer ?? "")).includes(normalizeText(a))
          );

        const tier = state.difficultyTier;
        const nextTier = correct ? (tier === "easy" ? "medium" : "hard") : tier === "hard" ? "medium" : "easy";
        patch({
          quizPhase: "feedback",
          lastCorrect: correct,
          difficultyTier: nextTier,
          skillScoresLog: [...state.skillScoresLog, { skill: q.skill, correct, tier }],
        });
      },
      nextQuizQuestion: () => {
        if (state.quizIndex < ASSESSMENT_QUESTIONS.length - 1) {
          patch({ quizIndex: state.quizIndex + 1, quizAnswer: null, orderPicked: [], quizPhase: "answering" });
        }
      },
      goAssessmentIntro: () =>
        patch({
          quizIndex: 0,
          quizAnswer: null,
          orderPicked: [],
          quizPhase: "answering",
          skillScoresLog: [],
          difficultyTier: "medium",
          retakeConfirm: false,
        }),
      finishAssessment: () => patch({ assessmentDone: true }),
      openRetakeConfirm: () => patch({ retakeConfirm: true }),
      closeRetakeConfirm: () => patch({ retakeConfirm: false }),
      confirmRetake: () => patch({ retakeConfirm: false }),
      setChooseMode: (m) => patch({ chooseMode: m }),
      setChooseAllLevel: (lv) => patch({ chooseAllLevel: lv }),
      setChooseEachLevel: (sk, lv) =>
        patch({ chooseEachLevels: { ...state.chooseEachLevels, [sk]: lv } }),
      computeSkillLevels,
      markAssessmentApplied: (levels) => patch({ skillLevels: levels, assessmentDone: true }),
    }),
    [state]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

export { LEVEL_META, LEVEL_ORDER, SKILL_LABELS, SKILL_ORDER };
