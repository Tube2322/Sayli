"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session/SessionProvider";
import { getTheme } from "@/lib/theme";

const theme = getTheme(false);

export function AuthGate({ children }: { children: ReactNode }) {
  const { status, profile, profileError, reloadProfile } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div style={centerStyle}>
        <div style={{ fontSize: 14, color: theme.muted }}>กำลังโหลด...</div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div style={centerStyle}>
        <div style={{ fontSize: 14, color: theme.error, textAlign: "center", maxWidth: 280 }}>{profileError}</div>
        <button
          className="el-tap"
          onClick={reloadProfile}
          style={{ marginTop: 16, height: 44, padding: "0 20px", border: "none", borderRadius: 12, background: theme.btnBg, color: theme.btnText, fontWeight: 600 }}
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={centerStyle}>
        <div style={{ fontSize: 14, color: theme.muted }}>กำลังโหลดโปรไฟล์...</div>
      </div>
    );
  }

  return <>{children}</>;
}

const centerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: theme.bg,
};
