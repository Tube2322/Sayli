"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { signInWithGoogle, mapGoogleAuthError } from "@/lib/firebase/googleAuth";
import { getOrCreateProfile } from "@/lib/profile/actions";
import { lightTheme as theme } from "@/lib/theme";
import { AuthPageShell, AuthDivider, GoogleSignInButton } from "@/components/auth/AuthPageShell";

function mapAuthError(code: string): string {
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
    return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  }
  if (code.includes("too-many-requests")) return "ลองเข้าสู่ระบบบ่อยเกินไป กรุณาลองใหม่ภายหลัง";
  if (code.includes("network")) return "เชื่อมต่อเครือข่ายไม่ได้ ลองใหม่อีกครั้ง";
  return "เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้ง";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setError(mapAuthError(code));
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      await getOrCreateProfile(user.uid, user.displayName || user.email || "Learner");
      router.replace("/");
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setError(mapGoogleAuthError(code));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="เข้าสู่ระบบ"
      subtitle="English Life — เรียนภาษาอังกฤษต่อจากที่ค้างไว้"
      footer={
        <>
          ยังไม่มีบัญชี?{" "}
          <Link href="/register" style={{ color: theme.accentDeep, fontWeight: 600, textDecoration: "none" }}>
            สมัครสมาชิก
          </Link>
        </>
      }
    >
      <GoogleSignInButton onClick={onGoogleSignIn} disabled={googleLoading || loading} label={googleLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบด้วย Google"} />
      <AuthDivider />

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
        <input
          className="el-input"
          type="password"
          required
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", height: 56, borderRadius: 18, border: `1.5px solid ${theme.border}`, background: theme.bg, color: theme.text, padding: "0 18px", fontSize: 16, boxSizing: "border-box", fontFamily: "inherit" }}
        />

        <Link href="/forgot-password" style={{ fontSize: 12.5, color: theme.muted, textAlign: "right", textDecoration: "none", marginTop: -4 }}>
          ลืมรหัสผ่าน?
        </Link>

        {error && (
          <div style={{ fontSize: 13, color: theme.error, background: theme.errorSoft, borderRadius: 12, padding: "10px 12px" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="el-tap"
          style={{
            width: "100%", height: 54, border: "none", borderRadius: 16,
            background: theme.btnBg, color: theme.btnText, fontSize: 16, fontWeight: 600,
            opacity: loading ? 0.7 : 1, marginTop: 4,
          }}
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </AuthPageShell>
  );
}
