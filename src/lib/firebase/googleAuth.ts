import { GoogleAuthProvider, signInWithPopup, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<User> {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

export function mapGoogleAuthError(code: string): string {
  if (code.includes("popup-closed-by-user") || code.includes("cancelled-popup-request")) return "ปิดหน้าต่างก่อนเข้าสู่ระบบเสร็จ ลองใหม่อีกครั้ง";
  if (code.includes("account-exists-with-different-credential")) return "อีเมลนี้เคยสมัครด้วยวิธีอื่นไว้แล้ว ลองเข้าสู่ระบบด้วยอีเมล/รหัสผ่านแทน";
  if (code.includes("network")) return "เชื่อมต่อเครือข่ายไม่ได้ ลองใหม่อีกครั้ง";
  return "เข้าสู่ระบบด้วย Google ไม่สำเร็จ ลองใหม่อีกครั้ง";
}
