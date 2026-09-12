"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/useTheme";
import { patterns, reviewItems } from "@/lib/sampleData";

export function ReviewScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const go = () => router.push("/session");

  const needsReviewCount = reviewItems.filter((i) => i.category === "needs").length;
  const mistakeCount = reviewItems.filter((i) => i.category === "mistake").length;
  const forgottenCount = reviewItems.filter((i) => i.category === "forgotten").length;
  const almostCount = reviewItems.filter((i) => i.category === "almost").length;
  const latestMistake = reviewItems.find((i) => i.category === "mistake") || reviewItems[0];
  const hasReviewItems = reviewItems.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, paddingBottom: 100 }}>
      <div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 26, margin: "0 0 4px" }}>ทบทวน</h1>
        <div style={{ fontSize: 13.5, color: theme.muted }}>ทบทวนสิ่งที่คุณควรจำตอนนี้</div>
      </div>

      {hasReviewItems ? (
        <>
          <div className="el-tap" onClick={go} style={{ borderRadius: 26, padding: 20, background: theme.accentSoft, boxShadow: theme.shadowCard }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={theme.accentDeep} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2a2.5 2.5 0 00-2.3 3.5A3 3 0 006 8v1a3 3 0 00-1 5.8V16a3 3 0 003 3h.5a2.5 2.5 0 004.9 0H14v-3.2" /><path d="M14.5 2a2.5 2.5 0 012.3 3.5A3 3 0 0118 8v1a3 3 0 011 5.8V16a3 3 0 01-3 3" /></svg>
              <div style={{ fontSize: 12, fontWeight: 600, color: theme.accentDeep, letterSpacing: ".02em" }}>Smart Review</div>
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 4 }}>เราเลือกสิ่งที่คุณควรทบทวนให้แล้ว</div>
            <div style={{ fontSize: 13, color: theme.muted, marginBottom: 16 }}>{reviewItems.length} รายการ · ~5 นาที</div>
            <button className="el-tap" onClick={go} style={{ width: "100%", height: 52, border: "none", borderRadius: 16, background: theme.btnBg, color: theme.btnText, fontSize: 16, fontWeight: 600 }}>เริ่มทบทวน</button>
          </div>

          <div style={{ borderRadius: 22, padding: "16px 18px", background: theme.surface, boxShadow: theme.shadowCard, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Stat theme={theme} icon={<svg width="15" height="15" viewBox="0 0 24 24" fill={theme.accentDeep} stroke="none"><path d="M12 2c1 3 5 5 5 10a5 5 0 01-10 0c0-1.5.5-2.5 1.3-3.6.4.9 1.2 1.4 1.2 1.4-.3-2 .5-4 2.5-7.8z" /></svg>} value={needsReviewCount} label="ควรทบทวนตอนนี้" />
            <Stat theme={theme} icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={theme.error} strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>} value={mistakeCount} label="เคยตอบผิด" />
            <Stat theme={theme} icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={theme.muted} strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>} value={forgottenCount} label="ไม่ได้เจอนาน" />
            <Stat theme={theme} icon={<svg width="15" height="15" viewBox="0 0 24 24" fill={theme.accentDeep} stroke="none"><path d="M12 2l3 6.5 7 .9-5 5 1.2 7-6.2-3.4L5.8 21.4 7 14.4l-5-5 7-.9L12 2Z" /></svg>} value={almostCount} label="ใกล้จำได้แม่น" />
          </div>

          <div style={{ borderRadius: 22, padding: 18, background: theme.surface, boxShadow: theme.shadowCard }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: theme.error, marginBottom: 2 }}>Mistake Book</div>
            <div style={{ fontSize: 12, color: theme.muted, marginBottom: 12 }}>กลับมาแก้สิ่งที่เคยผิด</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{latestMistake.en}</div>
            <div style={{ fontSize: 12, color: theme.muted, marginBottom: 2 }}>คำตอบของคุณ</div>
            <div style={{ fontSize: 13.5, marginBottom: 8 }}>{latestMistake.yourAnswer ?? "-"}</div>
            <div style={{ fontSize: 12, color: theme.muted, marginBottom: 2 }}>Key Pattern</div>
            <div style={{ fontSize: 13.5, marginBottom: 14 }}>{latestMistake.pattern ?? "-"}</div>
            <button className="el-tap" onClick={go} style={{ width: "100%", height: 46, border: "none", borderRadius: 14, background: theme.btnSecondaryBg, color: theme.btnSecondaryText, fontSize: 14.5, fontWeight: 600 }}>ทบทวนข้อผิดพลาด</button>
          </div>

          <div style={{ borderRadius: 22, padding: 18, background: theme.surface, boxShadow: theme.shadowCard }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 12 }}>Pattern Review</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {patterns.map((p) => (
                <div key={p.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{p.name}</span>
                    <span style={{ fontSize: 12.5, color: theme.muted }}>{p.pct}%</span>
                  </div>
                  <div style={{ height: 6, background: theme.track, borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p.pct}%`, background: theme.accent, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", padding: "40px 10px" }}>
          <div style={{ fontSize: 40 }}>🎉</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 20 }}>ทบทวนครบแล้ว!</div>
          <div style={{ fontSize: 13.5, color: theme.muted }}>ตอนนี้ไม่มีอะไรที่ต้องรีบทบทวน</div>
          <button className="el-tap" onClick={() => router.push("/practice")} style={{ height: 48, padding: "0 22px", border: "none", borderRadius: 14, background: theme.btnBg, color: theme.btnText, fontSize: 14.5, fontWeight: 600 }}>ฝึกเนื้อหาใหม่</button>
        </div>
      )}
    </div>
  );
}

function Stat({ theme, icon, value, label }: { theme: ReturnType<typeof useTheme>["theme"]; icon: React.ReactNode; value: number; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {icon}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
        <div style={{ fontSize: 10.5, color: theme.muted }}>{label}</div>
      </div>
    </div>
  );
}
