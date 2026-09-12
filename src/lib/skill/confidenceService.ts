import type { Confidence } from "@/lib/skill/types";

// Confidence reflects how much evidence backs a skill's level, not the level
// itself. One correct answer must not read as "High confidence" (spec §11).
export function calculateConfidence(evidenceCount: number, consistentRatio: number): Confidence {
  if (evidenceCount < 2) return "low";
  if (evidenceCount >= 4 && consistentRatio >= 0.7) return "high";
  return "medium";
}
