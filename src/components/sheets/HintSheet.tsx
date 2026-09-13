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

export function HintSheet() {
  const { theme } = useTheme();
  const { sheet, closeSheets, activeQuestion } = useAppState();
  const open = sheet === "hint";
  const q = activeQuestion;
  const writingMode = q?.direction === "th-en";
  // Only translate the keyword when it's genuinely new/hard (rare in the
  // 10k-word frequency list) — a basic word like "here" or "happy" doesn't
  // need its Thai meaning spelled out every time.
  const showTranslation = q?.hintWord ? isUncommonWord(q.hintWord) : false;

  return (
    <>
      {open && (
        <div
          className="el-tap"
          onClick={closeSheets}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 80 }}
        />
      )}
      <div
        className="el-sheet"
        style={{
          // Fixed to the real viewport, not the app column's height:100vh box —
          // sidesteps a position:absolute+vh containing-block bug (confirmed via
          // devtools: a plain bottom:0 test div anchored ~310px short of the
          // true bottom under certain devicePixelRatio conditions), which made
          // "closed" sheets land inside the visible area instead of fully below it.
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 90,
          background: theme.surface, borderRadius: "28px 28px 0 0",
          padding: "24px 22px calc(env(safe-area-inset-bottom,0px) + 24px)",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.2)",
          transform: open ? "translateY(0)" : "translateY(100%)",
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 4, background: theme.track, margin: "0 auto 20px" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: theme.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={theme.accentDeep} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 00-3.5 10.9c.6.4.9 1 .9 1.7v.4h5.2v-.4c0-.7.3-1.3.9-1.7A6 6 0 0012 3z" />
              <path d="M9 18h6M10 21h4" />
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>คำใบ้</div>
        </div>

        {/* Sentence with highlighted keyword */}
        <div style={{ background: theme.track, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.muted, marginBottom: 6, letterSpacing: ".04em", textTransform: "uppercase" }}>
            {writingMode ? "ประโยคภาษาไทย" : "ประโยคต้นฉบับ"}
          </div>
          <div style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.5, color: theme.text }}>
            {writingMode
              ? <span>&ldquo;{q?.referenceAnswer ?? ""}&rdquo;</span>
              : <>&ldquo;<HighlightedSentence sentence={q?.en ?? ""} word={q?.hintWord ?? ""} theme={theme} />&rdquo;</>
            }
          </div>
        </div>

        {/* Key word — Thai meaning only surfaces for genuinely new/hard words */}
        <div style={{ background: theme.accentSoft, borderRadius: 14, padding: "12px 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.accentDeep, marginBottom: 4, letterSpacing: ".04em", textTransform: "uppercase" }}>
            คำสำคัญ
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: theme.accentDeep }}>
              &ldquo;{q?.hintWord ?? "-"}&rdquo;
            </span>
            {showTranslation && q?.hintMeaning ? (
              <span style={{ fontSize: 14, color: theme.text }}>{q.hintMeaning}</span>
            ) : (
              <span style={{ fontSize: 12.5, color: theme.muted, fontStyle: "italic" }}>คำนี้พื้นฐานแล้ว ลองนึกความหมายเองดูก่อนนะ</span>
            )}
          </div>
        </div>

        {/* Pattern */}
        {q?.pattern && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${theme.border}` }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: theme.navy, letterSpacing: ".04em" }}>PATTERN</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: theme.text, fontFamily: "'Barlow Condensed', sans-serif" }}>{q.pattern}</span>
          </div>
        )}

        {/* Grammar note */}
        {q?.grammarNote && (
          <div style={{ background: theme.infoSoft, borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: theme.info, marginBottom: 3, letterSpacing: ".04em", textTransform: "uppercase" }}>ไวยากรณ์</div>
            <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.55 }}>{q.grammarNote}</div>
          </div>
        )}

        {/* Usage context */}
        {q?.usageContext && (
          <div style={{ fontSize: 12.5, color: theme.muted, lineHeight: 1.5, marginBottom: 16 }}>
            💬 {q.usageContext}
          </div>
        )}

        <button
          className="el-tap"
          onClick={closeSheets}
          style={{ width: "100%", height: 52, border: "none", borderRadius: 16, background: theme.btnBg, color: theme.btnText, fontSize: 16, fontWeight: 600 }}
        >
          เข้าใจแล้ว ลองต่อ
        </button>
      </div>
    </>
  );
}
