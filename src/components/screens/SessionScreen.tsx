"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/appState";
import { useSession } from "@/lib/session/SessionProvider";
import { useTheme } from "@/lib/useTheme";
import { evaluateAnswer } from "@/lib/practice/evaluationService";
import { QUESTION_BANK } from "@/lib/practice/questionBank";
import { SKILL_LABELS } from "@/lib/sampleData";
import { DIFFICULTY_META, REGISTER_META } from "@/lib/content/labels";
import { SkillIcon } from "@/components/ui/SkillIcon";
import { contextFromLearningState, selectNextQuestion } from "@/lib/practice/adaptiveEngine";
import { buildMultipleChoiceOptions, isMultipleChoiceQuestion } from "@/lib/practice/multipleChoice";
import { computeSessionRecap, computeSessionStreak } from "@/lib/progress/progressService";

export function SessionScreen() {
  const { theme } = useTheme();
  const { answer, setAnswer, openHint, checkAnswer, openRecap, preferredSkill, setPreferredSkill } = useAppState();
  const { submitPracticeResult, profileError, learningState, reviewSchedule, recentPracticeResults } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const startedAtRef = useRef<number>(Date.now());
  // Capture skill preference at mount time without calling setState during render.
  // The effect below clears global state after mount so future sessions start fresh.
  const preferredSkillRef = useRef(preferredSkill);
  useEffect(() => {
    if (preferredSkillRef.current) setPreferredSkill(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Adaptive Engine picks the question once per session mount from the
  // learner's current Learning State (spec §Phase 7) — the same selection
  // "ฝึกด่วน" (Quick Practice) relies on, since both just land here.
  const questionId = useMemo(
    () => selectNextQuestion(QUESTION_BANK, contextFromLearningState(learningState, reviewSchedule, preferredSkillRef.current)),
    [learningState, reviewSchedule]
  );
  const question = questionId ? QUESTION_BANK[questionId] : null;
  const direction = question?.direction ?? "en-th";
  const writingMode = direction === "th-en";

  // Writing questions always use typed mode (typing English, not picking from
  // Thai options). All others alternate MC/typed by deterministic hash.
  const mcMode = writingMode ? false : (questionId ? isMultipleChoiceQuestion(questionId) : false);
  const mcOptions = useMemo(
    () => (mcMode && question && questionId ? buildMultipleChoiceOptions(QUESTION_BANK, questionId, question) : []),
    [mcMode, question, questionId]
  );

  useEffect(() => {
    // A new question starts its own response-time clock — otherwise time
    // spent on an earlier question in this session would bleed into the
    // next one's responseTimeMs (which real stats like "minutes today" and
    // this session's recap both depend on).
    startedAtRef.current = Date.now();
    setSelectedOption(null);
  }, [questionId]);

  const sessionStreak = useMemo(
    () => computeSessionStreak(recentPracticeResults, sessionIdRef.current),
    [recentPracticeResults]
  );

  // How many questions answered so far in this session — shown as "ข้อที่ N"
  const sessionAnswered = useMemo(
    () => recentPracticeResults.filter((r) => r.sessionId === sessionIdRef.current).length,
    [recentPracticeResults]
  );

  const canCheck = mcMode ? !!selectedOption : !!answer.trim();

  const onCheckAnswer = async () => {
    if (!question || !questionId || !canCheck) return;
    let correct: boolean;
    let score: number;
    if (mcMode) {
      correct = selectedOption === question.referenceAnswer;
      score = correct ? 100 : 0;
    } else {
      // Writing (th-en): evaluate user's English against question.en + acceptableAnswers.
      // Standard (en-th): evaluate user's Thai against acceptableAnswers.
      const targets = writingMode
        ? [question.en, ...question.acceptableAnswers]
        : question.acceptableAnswers;
      const evalResult = evaluateAnswer(answer, targets);
      correct = evalResult.correct;
      score = evalResult.score;
    }
    const answerValue = mcMode ? selectedOption ?? "" : answer;

    setChecking(true);
    await submitPracticeResult({
      sessionId: sessionIdRef.current,
      questionId,
      skill: question.skill,
      difficulty: question.difficulty,
      answer: answerValue,
      referenceAnswer: question.referenceAnswer,
      pattern: question.pattern,
      evaluation: correct ? "correct" : "incorrect",
      score,
      correct,
      responseTimeMs: Date.now() - startedAtRef.current,
    });
    setChecking(false);
    checkAnswer(correct, score, {
      en: question.en,
      pattern: question.pattern,
      hintWord: question.hintWord,
      hintMeaning: question.hintMeaning,
      referenceAnswer: question.referenceAnswer,
      userAnswer: answerValue,
      direction,
      grammarNote: question.grammarNote,
      usageContext: question.usageContext,
    });
  };

  const onOpenHint = () => {
    if (!question) return;
    openHint({ en: question.en, pattern: question.pattern, hintWord: question.hintWord, hintMeaning: question.hintMeaning, referenceAnswer: question.referenceAnswer, direction, grammarNote: question.grammarNote, usageContext: question.usageContext });
  };

  const onEndSession = () => {
    openRecap(computeSessionRecap(recentPracticeResults, sessionIdRef.current));
  };

  const difficultyMeta = question ? DIFFICULTY_META[question.difficulty] : null;
  const registerMeta = question ? REGISTER_META[question.register] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, flex: 1, paddingBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          className="el-tap"
          onClick={() => router.push("/practice")}
          style={{ width: 36, height: 36, borderRadius: "50%", background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: theme.muted, display: "flex", alignItems: "center", gap: 5 }}>
            {question && <SkillIcon skill={question.skill} size={13} color={theme.muted} />}
            {question ? SKILL_LABELS[question.skill] : ""}
          </span>
          {difficultyMeta && (
            <span style={{ fontSize: 11, fontWeight: 600, background: theme.track, borderRadius: 999, padding: "3px 8px" }}>
              {difficultyMeta.emoji} {difficultyMeta.label}
            </span>
          )}
          {registerMeta && (
            <span style={{ fontSize: 11, fontWeight: 600, background: theme.track, borderRadius: 999, padding: "3px 8px" }}>
              {registerMeta.emoji} {registerMeta.label}
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: theme.mutedFaint, flexShrink: 0 }}>
          ข้อที่ {sessionAnswered + 1}
        </div>
        {sessionStreak >= 2 && (
          <div style={{ fontSize: 12.5, fontWeight: 700, color: theme.accentDeep, display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
            🔥 {sessionStreak}
          </div>
        )}
        <div
          className="el-tap"
          onClick={onEndSession}
          style={{ fontSize: 11.5, fontWeight: 600, color: theme.muted, flexShrink: 0, padding: "6px 4px" }}
        >
          จบรอบ
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, textAlign: "center" }}>
        {writingMode && (
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", color: theme.accentDeep, textTransform: "uppercase", opacity: 0.8 }}>
            เขียนเป็นภาษาอังกฤษ
          </div>
        )}
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 28, lineHeight: 1.25 }}>
          {writingMode
            ? <span>&ldquo;{question?.referenceAnswer ?? ""}&rdquo;</span>
            : <span>&ldquo;{question?.en ?? ""}&rdquo;</span>}
        </div>
        <div style={{ fontSize: 14, color: theme.muted }}>
          {writingMode ? "พิมพ์ประโยคนี้เป็นภาษาอังกฤษ" : mcMode ? "เลือกคำแปลที่ถูกต้อง" : "ลองแปลประโยคนี้เป็นภาษาไทยดูสิ"}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mcMode ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mcOptions.map((opt, idx) => {
              const selected = selectedOption === opt;
              return (
                <div
                  key={`${opt}-${idx}`}
                  className="el-tap"
                  onClick={() => setSelectedOption(opt)}
                  style={{
                    padding: "14px 16px", borderRadius: 14, fontSize: 15, fontWeight: 500,
                    border: `1.5px solid ${selected ? theme.accent : theme.border}`,
                    background: selected ? theme.accentSoft : theme.surface,
                    color: selected ? theme.accentDeep : theme.text,
                  }}
                >
                  {opt}
                </div>
              );
            })}
          </div>
        ) : (
          <input
            className="el-input"
            type="text"
            placeholder="พิมพ์คำตอบ..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ width: "100%", height: 56, borderRadius: 18, border: `1.5px solid ${theme.border}`, background: theme.surface, color: theme.text, padding: "0 18px", fontSize: 16, boxSizing: "border-box", fontFamily: "inherit" }}
          />
        )}
        {profileError && (
          <div style={{ fontSize: 13, color: theme.error, background: theme.errorSoft, borderRadius: 12, padding: "10px 12px" }}>
            {profileError}
          </div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="el-tap"
            onClick={onOpenHint}
            style={{ height: 52, padding: "0 18px", borderRadius: 16, border: `1.5px solid ${theme.border}`, background: theme.surface, color: theme.accentDeep, fontSize: 15, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.accentDeep} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.4.9 1 .9 1.7v.4h5.2v-.4c0-.7.3-1.3.9-1.7A6 6 0 0012 3z" /></svg>
            คำใบ้
          </button>
          <button
            className="el-tap"
            disabled={checking || !canCheck || !question}
            onClick={onCheckAnswer}
            style={{ flex: 1, height: 52, border: "none", borderRadius: 16, background: theme.btnBg, color: theme.btnText, fontSize: 16, fontWeight: 600, opacity: checking || !canCheck || !question ? 0.6 : 1 }}
          >
            {checking ? "กำลังตรวจ..." : "ตรวจคำตอบ"}
          </button>
        </div>
      </div>
    </div>
  );
}
