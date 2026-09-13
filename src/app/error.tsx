"use client";

import { useEffect } from "react";
import { lightTheme as theme } from "@/lib/theme";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh", background: theme.bg, color: theme.text,
        fontFamily: "'Barlow', system-ui, sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px",
      }}
    >
      <div style={{ maxWidth: 360, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>😿</div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 26, margin: "0 0 8px" }}>
          เกิดข้อผิดพลาดบางอย่าง
        </h1>
        <p style={{ fontSize: 14.5, color: theme.muted, lineHeight: 1.6, margin: "0 0 24px" }}>
          ขออภัยในความไม่สะดวก ลองกดปุ่มด้านล่างเพื่อลองใหม่อีกครั้ง ถ้ายังไม่หายลองปิดแล้วเปิดแอปใหม่
        </p>
        <button
          onClick={reset}
          className="el-tap"
          style={{
            height: 52, padding: "0 28px", border: "none",
            borderRadius: 16, background: theme.btnBg, color: theme.btnText,
            fontSize: 16, fontWeight: 600, cursor: "pointer",
          }}
        >
          ลองอีกครั้ง
        </button>
      </div>
    </div>
  );
}
