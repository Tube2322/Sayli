"use client";

import { useTheme } from "@/lib/useTheme";

export function ToggleSwitch({ on, onChange }: { on: boolean; onChange: () => void }) {
  const { theme } = useTheme();
  return (
    <div
      className="el-tap"
      onClick={onChange}
      style={{
        width: 46,
        height: 27,
        borderRadius: 999,
        background: on ? theme.accent : theme.track,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 21,
          height: 21,
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: 3,
          left: on ? 22 : 3,
          boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
          transition: "left .15s",
        }}
      />
    </div>
  );
}
