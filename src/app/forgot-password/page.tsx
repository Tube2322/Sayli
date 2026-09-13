"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { lightTheme as theme } from "@/lib/theme";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

function mapResetError(code: string): string {
  if (code.includes("user-not-found")) return "ไม่พบบัญชีที่ใช้อีเมลนี้";
  if (code.includes("invalid-email")) return "รูปแบบอีเมลไม่ถูกต้อง";
  if (code.includes("too-many-requests")) return "ขอลิงก์บ่อยเกินไป กรุณาลองใหม่ภายหลัง";
  if (code.includes("network")) return "เชื่อมต่อเครือข่ายไม่ได้ ลองใหม่อีกครั้ง";
  return "ส่งลิงก์ไม่สำเร็จ ลองใหม่อีกครั้ง";
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setError(mapResetError(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="ลืมรหัสผ่าน?"
      subtitle="กรอกอีเมลที่ใช้สมัคร เราจะส่งลิงก์ตั้งรหัสผ่านใหม่ให้"
      footer={
        <Link href="/login" style={{ color: theme.accentDeep, fontWeight: 600, textDecoration: "none" }}>
          กลับไปเข้าสู่ระบบ
        </Link>
      }
    >
      {sent ? (
        <div style={{ fontSize: 14, color: theme.success, background: theme.successSoft, borderRadius: 14, padding: "14px 16px", lineHeight: 1.6 }}>
          ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่ <strong>{email}</strong> แล้ว — เช็กอีเมล (รวมถึงถังขยะ/สแปม) แล้วทำตามลิงก์ในนั้นได้เลย
        </div>
      ) : (
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            className="el-input"
            type="email"
            required
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", height: 56, borderRadius: 18, border: `1.5px solid ${theme.border}`, background: theme.bg, color: theme.text, padding: "0 18px", fontSize: 16, boxSizing: "border-box", fontFamily: "inherit" }}
          />

          {error && (
            <div style={{ fontSize: 13, color: theme.error, background: theme.errorSoft, borderRadius: 12, padding: "10px 12px" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="el-tap"
            style={{
              width: "100%", height: 54, border: "none", borderRadius: 16,
              background: theme.btnBg, color: theme.btnText, fontSize: 16, fontWeight: 600,
              opacity: loading ? 0.7 : 1, marginTop: 4,
            }}
          >
            {loading ? "กำลังส่ง..." : "ส่งลิงก์ตั้งรหัสผ่านใหม่"}
          </button>
        </form>
      )}
    </AuthPageShell>
  );
}
