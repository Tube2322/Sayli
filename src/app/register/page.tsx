"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { signInWithGoogle, mapGoogleAuthError } from "@/lib/firebase/googleAuth";
import { getOrCreateProfile } from "@/lib/profile/actions";
import { lightTheme as theme } from "@/lib/theme";
import { AuthPageShell, AuthDivider, GoogleSignInButton } from "@/components/auth/AuthPageShell";

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
  const [googleLoading, setGoogleLoading] = useState(false);
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
      title="สมัครสมาชิก"
      subtitle="เริ่มต้นเส้นทางเรียนภาษาอังกฤษของคุณ"
      footer={
        <>
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" style={{ color: theme.accentDeep, fontWeight: 600, textDecoration: "none" }}>
            เข้าสู่ระบบ
          </Link>
        </>
      }
    >
      <GoogleSignInButton onClick={onGoogleSignIn} disabled={googleLoading || loading} label={googleLoading ? "กำลังสมัคร..." : "สมัครด้วย Google"} />
      <AuthDivider />

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          className="el-input"
          type="text"
          required
          placeholder="ชื่อที่แสดง"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          style={{ width: "100%", height: 56, borderRadius: 18, border: `1.5px solid ${theme.border}`, background: theme.bg, color: theme.text, padding: "0 18px", fontSize: 16, boxSizing: "border-box", fontFamily: "inherit" }}
        />
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
          minLength={6}
          placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", height: 56, borderRadius: 18, border: `1.5px solid ${theme.border}`, background: theme.bg, color: theme.text, padding: "0 18px", fontSize: 16, boxSizing: "border-box", fontFamily: "inherit" }}
        />

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
          {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>
      </form>
      <div style={{ fontSize: 11.5, color: theme.mutedFaint, textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
        การสมัครถือว่ายอมรับ{" "}
        <Link href="/terms" style={{ color: theme.muted, textDecoration: "underline" }}>ข้อตกลงการใช้งาน</Link>{" "}
        และ{" "}
        <Link href="/privacy" style={{ color: theme.muted, textDecoration: "underline" }}>นโยบายความเป็นส่วนตัว</Link>
      </div>
    </AuthPageShell>
  );
}
