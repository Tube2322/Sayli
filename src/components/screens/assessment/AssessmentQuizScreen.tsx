"use client";

import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/appState";
import { useTheme } from "@/lib/useTheme";
import { ASSESSMENT_QUESTIONS } from "@/lib/sampleData";

export function AssessmentQuizScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const {
    quizIndex, quizAnswer, quizPhase, orderPicked, lastCorrect,
    setQuizAnswer, toggleOrderWord, submitQuizAnswer, nextQuizQuestion,
    computeSkillLevels, markAssessmentApplied,
  } = useAppState();

  const q = ASSESSMENT_QUESTIONS[quizIndex];
  const isLast = quizIndex === ASSESSMENT_QUESTIONS.length - 1;
  const quizProgressPct = Math.round((quizIndex / ASSESSMENT_QUESTIONS.length) * 100);

  const canSubmit =
    q.type === "mc"
      ? quizAnswer !== null
      : q.type === "order"
      ? orderPicked.length === (q.words?.length ?? 0)
      : !!(typeof quizAnswer === "string" && quizAnswer.trim());

  const onNext = () => {
    if (isLast) {
      const levels = computeSkillLevels();
      markAssessmentApplied(levels);
      router.push("/assessment/results");
    } else {
      nextQuizQuestion();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1, paddingBottom: 40 }}>
      <div>
        <div style={{ fontSize: 12, color: theme.muted, marginBottom: 6 }}>ข้อที่ {quizIndex + 1} จาก {ASSESSMENT_QUESTIONS.length}</div>
        <div style={{ height: 6, background: theme.track, borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${quizProgressPct}%`, background: theme.accent, borderRadius: 999, transition: "width .2s" }} />
        </div>
      </div>

      {q.note && (
        <div style={{ fontSize: 12, color: theme.muted, background: theme.track, borderRadius: 12, padding: "10px 12px" }}>{q.note}</div>
      )}

      <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.4 }}>{q.prompt}</div>

      {q.type === "mc" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(q.options ?? []).map((opt, idx) => {
            const selected = quizAnswer === idx;
            return (
              <div
                key={opt}
                className="el-tap"
                onClick={() => setQuizAnswer(idx)}
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
      )}

      {q.type === "order" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ minHeight: 46, borderRadius: 14, border: `1.5px solid ${theme.border}`, background: theme.surface, padding: "12px 14px", fontSize: 15, fontWeight: 500 }}>
            {orderPicked.join(" ")}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(q.words ?? []).map((w, idx) => (
              <div
                key={w + idx}
                className="el-tap"
                onClick={() => toggleOrderWord(w)}
                style={{ padding: "9px 14px", borderRadius: 10, border: `1.3px solid ${theme.accent}`, background: theme.accentSoft, color: theme.accentDeep, fontSize: 14, fontWeight: 600 }}
              >
                {w}
              </div>
            ))}
          </div>
        </div>
      )}

      {(q.type === "blank" || q.type === "translate" || q.type === "situation") && (
        <input
          className="el-input"
          type="text"
          placeholder="พิมพ์คำตอบ..."
          value={typeof quizAnswer === "string" ? quizAnswer : ""}
          onChange={(e) => setQuizAnswer(e.target.value)}
          style={{ width: "100%", height: 56, borderRadius: 18, border: `1.5px solid ${theme.border}`, background: theme.surface, color: theme.text, padding: "0 18px", fontSize: 16, boxSizing: "border-box", fontFamily: "inherit" }}
        />
      )}

      <div style={{ flex: 1 }} />

      {quizPhase === "answering" && (
        <button
          className="el-tap"
          disabled={!canSubmit}
          onClick={submitQuizAnswer}
          style={{ width: "100%", height: 54, border: "none", borderRadius: 16, background: theme.btnBg, color: theme.btnText, fontSize: 16, fontWeight: 600, opacity: canSubmit ? 1 : 0.5 }}
        >
          ตรวจคำตอบ
        </button>
      )}
      {quizPhase === "feedback" && (
        <>
          {lastCorrect ? (
            <div style={{ borderRadius: 16, padding: "14px 16px", background: theme.successSoft, color: theme.success, fontSize: 14.5, fontWeight: 600 }}>✓ ถูกต้อง</div>
          ) : (
            <div style={{ borderRadius: 16, padding: "14px 16px", background: theme.errorSoft, color: theme.error, fontSize: 14.5, fontWeight: 600 }}>✕ ลองใหม่ครั้งหน้า</div>
          )}
          <button
            className="el-tap"
            onClick={onNext}
            style={{ width: "100%", height: 54, border: "none", borderRadius: 16, background: theme.btnBg, color: theme.btnText, fontSize: 16, fontWeight: 600 }}
          >
            ต่อไป →
          </button>
        </>
      )}
    </div>
  );
}
