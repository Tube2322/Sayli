"use client";

import { useTheme } from "@/lib/useTheme";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { theme } = useTheme();
  return (
    <div style={{ display: "flex", gap: 6, background: theme.track, borderRadius: 12, padding: 4 }}>
      {options.map((opt) => (
        <div
          key={opt.value}
          className="el-tap"
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1,
            textAlign: "center",
            padding: "9px 0",
            borderRadius: 9,
            fontSize: 13,
            fontWeight: 600,
            background: value === opt.value ? theme.surface : "transparent",
            color: value === opt.value ? theme.accentDeep : theme.muted,
          }}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );
}
