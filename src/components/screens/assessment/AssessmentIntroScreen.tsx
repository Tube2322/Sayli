"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session/SessionProvider";
import { useTheme } from "@/lib/useTheme";

export function AssessmentIntroScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { completeAssessment } = useSession();

  const onSkip = async () => {
    // "Skip" marks onboarding as handled so Home stops redirecting here.
    // Real per-skill assessment/level data (Phase 2/3) is simply left unset.
    await completeAssessment();
    router.push("/");
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", padding: "20px 6px" }}>
      <div style={{ fontSize: 40 }}>🧭</div>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 23, margin: 0 }}>มาหาระดับภาษาอังกฤษของคุณกัน</h1>
      <div style={{ fontSize: 14, color: theme.muted, lineHeight: 1.5, maxWidth: 300 }}>
        เราจะทดสอบภาษาอังกฤษของคุณสั้น ๆ แล้วสร้างแนวทางการเรียนที่เหมาะกับคุณ
      </div>
      <button
        className="el-tap"
        onClick={() => router.push("/assessment/quiz")}
        style={{ width: "100%", height: 54, border: "none", borderRadius: 16, background: theme.btnBg, color: theme.btnText, fontSize: 16, fontWeight: 600, marginTop: 8 }}
      >
        ทำแบบประเมินสั้น ๆ
      </button>
      <button
        className="el-tap"
        onClick={() => router.push("/assessment/choose")}
        style={{ width: "100%", height: 52, border: `1.5px solid ${theme.navy}`, borderRadius: 16, background: "transparent", color: theme.navy, fontSize: 15, fontWeight: 600 }}
      >
        เลือกระดับของฉัน
      </button>
      <button className="el-tap" onClick={onSkip} style={{ border: "none", background: "transparent", color: theme.muted, fontSize: 13, fontWeight: 600, textDecoration: "underline", padding: "6px 0" }}>
        ข้ามไปก่อน
      </button>
      <div style={{ fontSize: 12, color: theme.muted, lineHeight: 1.5, maxWidth: 280 }}>
        ไม่แน่ใจ? ทำแบบประเมิน — รู้ระดับตัวเองแล้ว? เลือกได้เลย
      </div>
    </div>
  );
}
