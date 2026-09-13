"use client";

import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/appState";
import { useTheme } from "@/lib/useTheme";

export function RetakeConfirmDialog() {
  const { theme } = useTheme();
  const { retakeConfirm, closeRetakeConfirm, confirmRetake, goAssessmentIntro } = useAppState();
  const router = useRouter();
  if (!retakeConfirm) return null;

  const onConfirm = () => {
    confirmRetake();
    goAssessmentIntro();
    router.push("/assessment/intro");
  };

  return (
    <>
      <div
        className="el-tap"
        onClick={closeRetakeConfirm}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 80 }}
      />
      <div
        style={{
          position: "absolute", left: 20, right: 20, top: "50%", transform: "translateY(-50%)", zIndex: 90,
          background: theme.surface, borderRadius: 22, padding: 22, boxShadow: "0 10px 40px rgba(0,0,0,0.25)", textAlign: "center",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>ทำแบบประเมินใหม่?</div>
        <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.5, marginBottom: 18 }}>
          ผลประเมินใหม่จะช่วยปรับแนวทางการเรียนให้เหมาะกับคุณยิ่งขึ้น ส่วนประวัติการเรียนเดิมของคุณจะยังอยู่ครบ ไม่มีอะไรหายไป
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="el-tap"
            onClick={closeRetakeConfirm}
            style={{ flex: 1, height: 46, border: `1.3px solid ${theme.border}`, borderRadius: 14, background: "transparent", color: theme.text, fontSize: 14, fontWeight: 600 }}
          >
            ยกเลิก
          </button>
          <button
            className="el-tap"
            onClick={onConfirm}
            style={{ flex: 1, height: 46, border: "none", borderRadius: 14, background: theme.btnBg, color: theme.btnText, fontSize: 14, fontWeight: 600 }}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </>
  );
}
