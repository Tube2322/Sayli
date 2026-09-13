"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/appState";
import { useSession } from "@/lib/session/SessionProvider";
import { useTheme } from "@/lib/useTheme";
import { evaluateAnswer } from "@/lib/practice/evaluationService";
import { QUESTION_BANK } from "@/lib/practice/questionBank";
import { contextFromLearningState, selectNextQuestion } from "@/lib/practice/adaptiveEngine";

export function SessionScreen() {
  const { theme } = useTheme();
  const { answer, setAnswer, openHint, checkAnswer } = useAppState();
  const { submitPracticeResult, profileError, learningState } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const startedAtRef = useRef<number>(Date.now());

  // Adaptive Engine picks the question once per session mount from the
  // learner's current Learning State (spec §Phase 7) — the same selection
  // "ฝึกด่วน" (Quick Practice) relies on, since both just land here.
  const questionId = useMemo(
    () => selectNextQuestion(QUESTION_BANK, contextFromLearningState(learningState)),
    [learningState]
  );
  const question = questionId ? QUESTION_BANK[questionId] : null;

  const onCheckAnswer = async () => {
    if (!question || !questionId) return;
    const { correct, score } = evaluateAnswer(answer, question.acceptableAnswers);
    setChecking(true);
    await submitPracticeResult({
      sessionId: sessionIdRef.current,
      questionId,
      skill: question.skill,
      difficulty: question.difficulty,
      answer,
      referenceAnswer: question.referenceAnswer,
      pattern: question.pattern,
      evaluation: correct ? "correct" : "incorrect",
      score,
      correct,
      responseTimeMs: Date.now() - startedAtRef.current,
    });
    setChecking(false);
    checkAnswer(correct, score);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, flex: 1, paddingBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          className="el-tap"
          onClick={() => router.push("/practice")}
          style={{ width: 36, height: 36, borderRadius: "50%", background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: theme.muted }}>บทที่ 12</div>
          <div style={{ height: 6, background: theme.track, borderRadius: 999, overflow: "hidden", marginTop: 4 }}>
            <div style={{ height: "100%", width: "65%", background: theme.accent, borderRadius: 999 }} />
          </div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: theme.accentDeep }}>72 XP</div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, textAlign: "center" }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 28, lineHeight: 1.25 }}>
          &quot;{question?.en ?? ""}&quot;
        </div>
        <div style={{ fontSize: 14, color: theme.muted }}>คุณจะแปลประโยคนี้เป็นภาษาไทยว่าอย่างไร?</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          className="el-input"
          type="text"
          placeholder="พิมพ์คำตอบ..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          style={{ width: "100%", height: 56, borderRadius: 18, border: `1.5px solid ${theme.border}`, background: theme.surface, color: theme.text, padding: "0 18px", fontSize: 16, boxSizing: "border-box", fontFamily: "inherit" }}
        />
        {profileError && (
          <div style={{ fontSize: 13, color: theme.error, background: theme.errorSoft, borderRadius: 12, padding: "10px 12px" }}>
            {profileError}
          </div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="el-tap"
            onClick={openHint}
            style={{ height: 52, padding: "0 18px", borderRadius: 16, border: `1.5px solid ${theme.border}`, background: theme.surface, color: theme.accentDeep, fontSize: 15, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.accentDeep} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.4.9 1 .9 1.7v.4h5.2v-.4c0-.7.3-1.3.9-1.7A6 6 0 0012 3z" /></svg>
            คำใบ้
          </button>
          <button
            className="el-tap"
            disabled={checking || !answer.trim() || !question}
            onClick={onCheckAnswer}
            style={{ flex: 1, height: 52, border: "none", borderRadius: 16, background: theme.btnBg, color: theme.btnText, fontSize: 16, fontWeight: 600, opacity: checking || !answer.trim() || !question ? 0.6 : 1 }}
          >
            {checking ? "กำลังตรวจ..." : "ตรวจคำตอบ"}
          </button>
        </div>
      </div>
    </div>
  );
}
