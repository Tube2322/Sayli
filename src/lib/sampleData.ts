// Ported verbatim from the original prototype (extracted/English Life.dc.html).
// These are the prototype's existing placeholder content for screens whose real
// data pipeline (skill profiles, practice history, mistakes, mastery, spaced
// repetition...) is out of scope for Phase 1 and lands in later phases. Nothing
// here is "new" hardcoding — it is the same fixed sample content the approved
// UI already shipped with; Phase 1 does not touch it.

export const SKILL_LABELS: Record<string, string> = {
  reading: "Reading",
  listening: "Listening",
  writing: "Writing",
  understanding: "Understanding",
  speaking: "Speaking",
};
export const SKILL_ORDER = ["reading", "listening", "writing", "understanding", "speaking"] as const;

export const LEVEL_META: Record<string, { emoji: string; name: string; desc: string }> = {
  L1: { emoji: "🌱", name: "First Words", desc: "ทักทาย คำศัพท์พื้นฐาน ประโยคสั้น ๆ" },
  L2: { emoji: "🌿", name: "Everyday Basics", desc: "สั่งอาหาร ถามทาง คุยกิจวัตรประจำวัน" },
  L3: { emoji: "🌳", name: "Natural Conversation", desc: "สนทนาทั่วไปได้คล่องขึ้น ใช้ contractions" },
  L4: { emoji: "🚀", name: "Advanced", desc: "เข้าใจ idioms, phrasal verbs, tone" },
  L5: { emoji: "👑", name: "Native-like Understanding", desc: "เข้าใจ slang, sarcasm, บทสนทนาธรรมชาติ" },
};
export const LEVEL_ORDER = ["L1", "L2", "L3", "L4", "L5"] as const;

export type AssessmentQuestion = {
  skill: string;
  type: "mc" | "blank" | "order" | "translate" | "situation";
  prompt: string;
  note?: string;
  options?: string[];
  correct?: number | string;
  words?: string[];
  accept?: string[];
};

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    skill: "reading",
    type: "mc",
    prompt: '"I\'m not really into it." ประโยคนี้หมายความว่าอย่างไร?',
    options: ["ฉันชอบมันมาก", "ฉันไม่ค่อยชอบ / สนใจมัน", "ฉันไม่เข้าใจมัน", "ฉันอยากได้มัน"],
    correct: 1,
  },
  {
    skill: "listening",
    type: "blank",
    note: "🔊 ต้นแบบนี้ยังไม่มีระบบเสียง — อ่านประโยคแทนการฟัง",
    prompt: 'I\'m ____ call you later. (เติมคำที่ได้ยินบ่อยในภาษาพูด แปลว่า "going to")',
    accept: ["gonna"],
  },
  {
    skill: "writing",
    type: "order",
    prompt: "เรียงคำต่อไปนี้ให้เป็นประโยคที่ถูกต้อง",
    words: ["you", "Could", "help", "me"],
    correct: "Could you help me",
  },
  {
    skill: "understanding",
    type: "translate",
    prompt: 'แปลเป็นภาษาอังกฤษ: "ฉันไม่ได้ตั้งใจจะทำให้คุณโกรธ"',
    accept: ["didn't mean to make you angry", "didnt mean to make you angry", "did not mean to make you angry"],
  },
  {
    skill: "speaking",
    type: "situation",
    note: "🎤 ต้นแบบนี้ยังไม่รองรับไมโครโฟน — พิมพ์คำตอบแทนการพูด",
    prompt: "คุณอยู่ในร้านอาหาร พนักงานเสิร์ฟอาหารผิดโต๊ะ คุณจะพูดว่าอะไร?",
    accept: ["this is not what i ordered", "wrong order", "excuse me this is", "i think there is a mistake"],
  },
];

export function normalizeText(s: string): string {
  return (s || "").toLowerCase().replace(/[.,!?'"]/g, "").replace(/\s+/g, " ").trim();
}

export const weekDays = [
  { label: "จ", h: 36 },
  { label: "อ", h: 52 },
  { label: "พ", h: 22 },
  { label: "พฤ", h: 60 },
  { label: "ศ", h: 44 },
  { label: "ส", h: 18 },
  { label: "อา", h: 12 },
];

