"use client";

import { useRouter } from "next/navigation";
import { useAppState, LEVEL_META } from "@/lib/appState";
import { useSession } from "@/lib/session/SessionProvider";
import { useTheme } from "@/lib/useTheme";

export function AssessmentConfirmScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { chooseAllLevel, finishAssessment } = useAppState();
  const { completeAssessment, profile } = useSession();
  const chosenLevelLabel = LEVEL_META[profile?.overallLevel ?? chooseAllLevel]?.name ?? "";

  const onFinish = async () => {
    finishAssessment();
    await completeAssessment();
    router.push("/");
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", padding: "20px 10px" }}>
      <div style={{ fontSize: 36 }}>👍</div>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 21, margin: 0 }}>เยี่ยม! เราจะเริ่มที่ประมาณ {chosenLevelLabel}</h1>
      <div style={{ fontSize: 13.5, color: theme.muted, maxWidth: 280, lineHeight: 1.5 }}>คุณเปลี่ยนระดับเริ่มต้นได้ทุกเมื่อในหน้าตั้งค่า</div>
      <button className="el-tap" onClick={onFinish} style={{ width: "100%", height: 52, border: "none", borderRadius: 16, background: theme.btnBg, color: theme.btnText, fontSize: 15.5, fontWeight: 600, marginTop: 8 }}>
        เริ่มเรียน
      </button>
    </div>
  );
}
