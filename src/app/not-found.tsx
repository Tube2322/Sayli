import Link from "next/link";
import { lightTheme as theme } from "@/lib/theme";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh", background: theme.bg, color: theme.text,
        fontFamily: "'Barlow', system-ui, sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px",
      }}
    >
      <div style={{ maxWidth: 360, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🧭</div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 26, margin: "0 0 8px" }}>
          หาหน้านี้ไม่เจอ
        </h1>
        <p style={{ fontSize: 14.5, color: theme.muted, lineHeight: 1.6, margin: "0 0 24px" }}>
          ลิงก์นี้อาจถูกย้ายหรือไม่มีอยู่จริง ลองกลับไปหน้าหลักดูนะ
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block", height: 52, lineHeight: "52px", padding: "0 28px",
            borderRadius: 16, background: theme.btnBg, color: theme.btnText,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
          }}
        >
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}
