import type { Skill } from "@/lib/skill/types";

// Small per-skill glyph, reused wherever a skill name is shown (Home,
// Practice, Settings, Progress, Session) so the same five skills always
// carry the same visual identity across the app — real data-driven icon
// selection, not decorative filler.
export function SkillIcon({ skill, size = 16, color }: { skill: Skill; size?: number; color: string }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (skill) {
    case "reading":
      return (
        <svg {...common}>
          <path d="M12 6.5C10.5 5 8 4.5 4 4.5v14c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-14c-4 0-6.5.5-8 2Z" />
          <path d="M12 6.5v14" />
        </svg>
      );
    case "listening":
      return (
        <svg {...common}>
          <path d="M3 14v-2a9 9 0 0118 0v2" />
          <rect x="1" y="14" width="6" height="7" rx="2" />
          <rect x="17" y="14" width="6" height="7" rx="2" />
        </svg>
      );
    case "writing":
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4Z" />
        </svg>
      );
    case "speaking":
      return (
        <svg {...common}>
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10v1a7 7 0 0014 0v-1M12 18v4M9 22h6" />
        </svg>
      );
    case "understanding":
      return (
        <svg {...common}>
          <path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.4.9 1 .9 1.7v.4h5.2v-.4c0-.7.3-1.3.9-1.7A6 6 0 0012 3z" />
        </svg>
      );
  }
}
