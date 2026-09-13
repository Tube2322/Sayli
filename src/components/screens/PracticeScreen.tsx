"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session/SessionProvider";
import { useTheme } from "@/lib/useTheme";
import { SKILL_LABELS } from "@/lib/sampleData";

export function PracticeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { learningState } = useSession();
  const go = () => router.push("/session");

  const weakSkills = learningState?.weakSkills ?? [];
  const recommendedLabel = weakSkills.map((sk) => SKILL_LABELS[sk]).join(" + ");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, paddingBottom: 100 }}>
      <div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 26, margin: "0 0 4px" }}>ฝึกฝน</h1>
        <div style={{ fontSize: 13.5, color: theme.muted }}>เลือกวิธีที่คุณอยากฝึก</div>
      </div>

      {weakSkills.length > 0 && (
        <div style={{ borderRadius: 20, padding: "14px 16px", background: `${theme.navy}11`, display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.navy} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2a2.5 2.5 0 00-2.3 3.5A3 3 0 006 8v1a3 3 0 00-1 5.8V16a3 3 0 003 3h.5a2.5 2.5 0 004.9 0H14v-3.2" /><path d="M14.5 2a2.5 2.5 0 012.3 3.5A3 3 0 0118 8v1a3 3 0 011 5.8V16a3 3 0 01-3 3" /></svg>
          <div style={{ fontSize: 12.5, color: theme.navy }}>
            แนะนำจากผลประเมิน: <strong>{recommendedLabel}</strong>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", color: theme.navy, textTransform: "uppercase" }}>ฝึกหลัก</div>
        <PracticeRow theme={theme} onClick={go} title="Understand" desc="อ่าน คิด แล้วอธิบาย" minutes="~3 นาที"
          icon={<path d="M12 6.5C10.5 5 8 4.5 4 4.5v14c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-14c-4 0-6.5.5-8 2Z" />} icon2={<path d="M12 6.5v14" />} />
        <PracticeRow theme={theme} onClick={go} title="Write" desc="แปลความหมายไทย เขียนเป็นอังกฤษ" minutes="~4 นาที"
          icon={<path d="M12 20h9" />} icon2={<path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4Z" />} />
        <PracticeRow theme={theme} onClick={go} title="Listen" desc="ฟัง แล้วทำความเข้าใจ" minutes="~3 นาที"
          icon={<path d="M3 14v-2a9 9 0 0118 0v2" />} icon2={<><rect x="1" y="14" width="6" height="7" rx="2" /><rect x="17" y="14" width="6" height="7" rx="2" /></>} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", color: theme.navy, textTransform: "uppercase" }}>สถานการณ์จริง</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div className="el-tap" onClick={go} style={{ borderRadius: 20, padding: "16px 14px", background: theme.accentSoft, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={theme.accentDeep} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 20l-5-2V4l5 2 6-2 5 2v14l-5-2-6 2Z" /><path d="M9 6v14M15 4v14" /></svg>
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>Situation</div>
            <div style={{ fontSize: 11.5, color: theme.muted, lineHeight: 1.35 }}>ฝึกจากสถานการณ์จริง</div>
          </div>
          <div className="el-tap" onClick={go} style={{ borderRadius: 20, padding: "16px 14px", background: theme.accentSoft, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={theme.accentDeep} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>Conversation</div>
            <div style={{ fontSize: 11.5, color: theme.muted, lineHeight: 1.35 }}>คุยโต้ตอบเป็นบทสนทนา</div>
          </div>
        </div>
      </div>

      <div className="el-tap" onClick={go} style={{ borderRadius: 20, padding: "16px 18px", background: theme.btnBg, display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill={theme.btnText} stroke="none"><path d="M13 2L3 14h7v8l10-12h-7z" /></svg>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: theme.btnText }}>ฝึกด่วน</div>
          <div style={{ fontSize: 11.5, color: theme.btnText, opacity: 0.85 }}>ให้ระบบเลือกสิ่งที่เหมาะกับคุณ</div>
        </div>
      </div>
    </div>
  );
}

function PracticeRow({
  theme, onClick, title, desc, minutes, icon, icon2,
}: {
  theme: ReturnType<typeof useTheme>["theme"];
  onClick: () => void;
  title: string;
  desc: string;
  minutes: string;
  icon: React.ReactNode;
  icon2: React.ReactNode;
}) {
  return (
    <div className="el-tap" onClick={onClick} style={{ borderRadius: 22, padding: "16px 18px", background: theme.surface, boxShadow: theme.shadowCard, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 14, background: theme.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.accentDeep} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{icon}{icon2}</svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: theme.muted, marginTop: 1 }}>{desc}</div>
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: theme.muted, flexShrink: 0 }}>{minutes}</div>
    </div>
  );
}
