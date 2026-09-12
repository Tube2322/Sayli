"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/useTheme";

const ITEMS = [
  {
    href: "/",
    label: "หน้าหลัก",
    icon: (c: string) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5L12 3l9 7.5" />
        <path d="M5 9.5V20a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V9.5" />
      </svg>
    ),
  },
  {
    href: "/practice",
    label: "ฝึกฝน",
    icon: (c: string) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
  },
  {
    href: "/review",
    label: "ทวน",
    icon: (c: string) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v4h4" />
      </svg>
    ),
  },
  {
    href: "/progress",
    label: "ความก้าวหน้า",
    icon: (c: string) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V10M12 20V4M20 20v-7" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const { theme, dark } = useTheme();
  const pathname = usePathname();
  const inactive = dark ? theme.muted : theme.navySoft;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 40,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "10px 6px calc(env(safe-area-inset-bottom,0px) + 14px)",
        background: theme.navBg,
        backdropFilter: "blur(14px)",
        borderTop: `1.5px solid ${theme.navy}22`,
      }}
    >
      {ITEMS.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const color = active ? theme.accentDeep : inactive;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="el-tap"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minWidth: 52, color, textDecoration: "none" }}
          >
            {item.icon(color)}
            <span style={{ fontSize: 11, fontWeight: 500 }}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
