import type { DifficultyTier } from "@/lib/skill/types";
import type { Register } from "@/lib/content/registerClassifier";

// Display metadata only — never used for scoring/classification, so it
// can't drift from the real difficulty/register a question already carries.
export const DIFFICULTY_META: Record<DifficultyTier, { emoji: string; label: string }> = {
  easy: { emoji: "🌱", label: "ง่าย" },
  medium: { emoji: "⚔️", label: "ปานกลาง" },
  hard: { emoji: "🔥", label: "ยาก" },
};

export const REGISTER_META: Record<Register, { emoji: string; label: string }> = {
  social: { emoji: "💬", label: "โซเชียล" },
  casual: { emoji: "🗣️", label: "ทั่วไป" },
  formal: { emoji: "🎩", label: "ทางการ" },
};
