"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { getOrCreateProfile } from "@/lib/profile/actions";
import { getTheme } from "@/lib/theme";

const theme = getTheme(false);

function mapAuthError(code: string): string {
  if (code.includes("email-already-in-use")) return "อีเมลนี้มีบัญชีอยู่แล้ว";
  if (code.includes("weak-password")) return "รหัสผ่านสั้นเกินไป (อย่างน้อย 6 ตัวอักษร)";
  if (code.includes("invalid-email")) return "รูปแบบอีเมลไม่ถูกต้อง";
  if (code.includes("network")) return "เชื่อมต่อเครือข่ายไม่ได้ ลองใหม่อีกครั้ง";
  return "สมัครสมาชิกไม่สำเร็จ ลองใหม่อีกครั้ง";
}

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      await getOrCreateProfile(cred.user.uid, displayName);
      router.replace("/");
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setError(mapAuthError(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: "'Barlow', system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 360 }}>
        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            fontSize: 26,
            margin: "0 0 6px",
            textAlign: "center",
          }}
        >
          สมัครสมาชิก
        </h1>
        <div style={{ fontSize: 13.5, color: theme.muted, textAlign: "center", marginBottom: 24 }}>
          เริ่มต้นเส้นทางเรียนภาษาอังกฤษของคุณ
        </div>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            className="el-input"
            type="text"
            required
            placeholder="ชื่อที่แสดง"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={inputStyle}
          />
          <input
            className="el-input"
            type="email"
            required
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            className="el-input"
            type="password"
            required
            minLength={6}
            placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
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
            {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </button>
        </form>

        <div style={{ fontSize: 13, color: theme.muted, textAlign: "center", marginTop: 18 }}>
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" style={{ color: theme.accentDeep, fontWeight: 600, textDecoration: "none" }}>
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 56,
  borderRadius: 18,
  border: `1.5px solid ${theme.border}`,
  background: theme.surface,
  color: theme.text,
  padding: "0 18px",
  fontSize: 16,
  boxSizing: "border-box",
  fontFamily: "inherit",
};
