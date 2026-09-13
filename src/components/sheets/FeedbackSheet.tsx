"use client";

import { useAppState } from "@/lib/appState";
import { useTheme } from "@/lib/useTheme";
import { isUncommonWord } from "@/lib/content/difficultyClassifier";

function HighlightedSentence({ sentence, word, theme }: { sentence: string; word: string; theme: ReturnType<typeof useTheme>["theme"] }) {
  if (!word || !sentence) return <span>{sentence}</span>;
  const lower = sentence.toLowerCase();
  const wordLower = word.toLowerCase();
  const idx = lower.indexOf(wordLower);
  if (idx === -1) return <span>{sentence}</span>;
  return (
    <>
      {sentence.slice(0, idx)}
      <span style={{ color: theme.accentDeep, fontWeight: 700, borderBottom: `2px solid ${theme.accent}`, paddingBottom: 1 }}>
        {sentence.slice(idx, idx + word.length)}
      </span>
      {sentence.slice(idx + word.length)}
    </>
  );
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" strokeWidth="5" style={{ color: "rgba(0,0,0,0.08)" }} />
      <circle
        cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${circ} ${circ}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
      />
      <text x="36" y="41" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="Barlow Condensed,sans-serif" fill={color}>
        {score}%
      </text>
    </svg>
  );
}

export function FeedbackSheet() {
  const { theme } = useTheme();
  const { sheet, continueAfterFeedback, lastPracticeCorrect, lastPracticeScore, activeQuestion, answer } = useAppState();
  const open = sheet === "feedback";
  const correct = lastPracticeCorrect ?? false;
  const score = lastPracticeScore ?? 0;
  const q = activeQuestion;
  const writingMode = q?.direction === "th-en";

  const resultColor = correct ? theme.success : score >= 40 ? theme.warning : theme.error;
  const resultSoft = correct ? theme.successSoft : score >= 40 ? theme.warningSoft : theme.errorSoft;
  const resultEmoji = correct ? "✓" : score >= 40 ? "≈" : "✕";
  const resultMessage =
    correct ? "ถูกต้อง! เยี่ยมมาก" :
    score >= 70 ? "เกือบแล้ว! ความหมายใกล้เคียงมาก" :
    score >= 40 ? "ใกล้เคียง แต่ยังต้องฝึกอีกนิด" :
    "ลองอีกครั้งนะ ดูเฉลยแล้วจำไว้";

  // What the user actually typed (from state — still present before continueAfterFeedback clears it)
  const userTyped = q?.userAnswer ?? answer;
  // What the correct answer is
  const correctAnswer = writingMode ? (q?.en ?? "") : (q?.referenceAnswer ?? "");
  // The "context" sentence to show in a different color
  const contextSentence = writingMode ? (q?.referenceAnswer ?? "") : (q?.en ?? "");

  return (
    <div
      className="el-sheet"
      style={{
        position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 90,
        background: theme.surface, borderRadius: "28px 28px 0 0",
        padding: "24px 22px calc(env(safe-area-inset-bottom,0px) + 20px)",
        boxShadow: "0 -10px 40px rgba(0,0,0,0.2)",
        transform: open ? "translateY(0)" : "translateY(100%)",
      }}
    >
      <div style={{ width: 36, height: 4, borderRadius: 4, background: theme.track, margin: "0 auto 18px" }} />

      {/* Score + message row */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <ScoreRing score={score} color={resultColor} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: resultSoft, borderRadius: 999, padding: "4px 10px", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: resultColor }}>{resultEmoji}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: resultColor }}>{resultMessage}</span>
          </div>
          {q?.pattern && (
            <div style={{ fontSize: 11.5, color: theme.muted, fontStyle: "italic" }}>pattern: {q.pattern}</div>
          )}
        </div>
      </div>

      {/* Answer comparison — only shown when not perfect */}
      {!correct && userTyped && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: theme.errorSoft, borderRadius: 12, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: theme.error, letterSpacing: ".04em", marginBottom: 4, textTransform: "uppercase" }}>คำตอบคุณ</div>
              <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.4 }}>{userTyped || "—"}</div>
            </div>
            <div style={{ background: theme.successSoft, borderRadius: 12, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: theme.success, letterSpacing: ".04em", marginBottom: 4, textTransform: "uppercase" }}>เฉลย</div>
              <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.4 }}>{correctAnswer}</div>
            </div>
          </div>
        </div>
      )}

      {/* If correct, just show the answer in a nice box */}
      {correct && (
        <div style={{ background: theme.successSoft, borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: theme.success, letterSpacing: ".04em", marginBottom: 4, textTransform: "uppercase" }}>คำตอบที่ถูกต้อง</div>
          <div style={{ fontSize: 14, color: theme.text, lineHeight: 1.45 }}>{correctAnswer}</div>
        </div>
      )}

      {/* Context sentence with keyword highlighted */}
      <div style={{ background: theme.track, borderRadius: 12, padding: "10px 14px", marginBottom: q?.grammarNote ? 10 : 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: theme.muted, letterSpacing: ".04em", marginBottom: 4, textTransform: "uppercase" }}>
          {writingMode ? "ประโยคต้นฉบับ (อังกฤษ)" : "ประโยคต้นฉบับ (อังกฤษ)"}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5 }}>
          {writingMode
            ? <span>{contextSentence}</span>
            : <HighlightedSentence sentence={contextSentence} word={q?.hintWord ?? ""} theme={theme} />
          }
        </div>
        {q?.hintWord && !writingMode && isUncommonWord(q.hintWord) && (
          <div style={{ marginTop: 6, fontSize: 12.5, color: theme.muted }}>
            <strong style={{ color: theme.accentDeep }}>{q.hintWord}</strong> = {q.hintMeaning}
          </div>
        )}
      </div>

      {/* Grammar note */}
      {q?.grammarNote && (
        <div style={{ background: theme.infoSoft, borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: theme.info, letterSpacing: ".04em", marginBottom: 3, textTransform: "uppercase" }}>ไวยากรณ์</div>
          <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.55 }}>{q.grammarNote}</div>
        </div>
      )}

      <button
        className="el-tap"
        onClick={continueAfterFeedback}
        style={{ width: "100%", height: 52, border: "none", borderRadius: 16, background: theme.btnBg, color: theme.btnText, fontSize: 16, fontWeight: 600 }}
      >
        ต่อไป →
      </button>
    </div>
  );
}
