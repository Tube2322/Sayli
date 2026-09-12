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

export const missionItems = [
  { label: "ใหม่", done: true },
  { label: "ทบทวน", done: true },
  { label: "จุดผิด", done: false },
  { label: "ท้าทาย", done: false },
];

export const reviewItems = [
  { en: "I didn't mean to hurt you.", th: "ฉันไม่ได้ตั้งใจทำให้คุณเจ็บ", due: "วันนี้", category: "mistake", yourAnswer: "ฉันไม่ได้หมายถึงทำร้ายคุณ", pattern: "didn't mean to + verb" },
  { en: "Could you slow down a bit?", th: "ช่วยพูดช้าลงหน่อยได้ไหม", due: "วันนี้", category: "needs" },
  { en: "It's not a big deal.", th: "มันไม่ใช่เรื่องใหญ่", due: "วันนี้", category: "needs" },
  { en: "I'll take care of it.", th: "ฉันจะจัดการเอง", due: "พรุ่งนี้", category: "forgotten" },
  { en: "That makes sense.", th: "เข้าใจแล้ว / มันสมเหตุสมผล", due: "พรุ่งนี้", category: "almost" },
  { en: "Would you mind helping me?", th: "ช่วยฉันหน่อยได้ไหม", due: "พรุ่งนี้", category: "almost" },
  { en: "I used to live there.", th: "ฉันเคยอาศัยอยู่ที่นั่น", due: "พรุ่งนี้", category: "forgotten" },
];

export const patterns = [
  { name: "didn't + verb", pct: 78 },
  { name: "Could you...?", pct: 62 },
  { name: "be going to...", pct: 45 },
];

export const skills = [
  { name: "Reading", pct: 72 },
  { name: "Listening", pct: 54 },
  { name: "Writing", pct: 61 },
  { name: "Conversation", pct: 40 },
  { name: "Understanding", pct: 68 },
];

export const masteryTopics = [
  { name: "Daily Life", pct: 80 },
  { name: "Questions", pct: 67 },
  { name: "Past Tense", pct: 48 },
  { name: "Natural Conversation", pct: 31 },
];

export const journeyNames = [
  "Survival English",
  "Everyday English",
  "Natural Conversation",
  "Social English",
  "Work English",
  "Advanced English",
  "Native-Level",
];

export const achievements = [
  { label: "🏆 100 ประโยคแรก" },
  { label: "🔥 ต่อเนื่อง 7 วัน" },
  { label: "⭐ เชี่ยวชาญ 10 Pattern" },
];

export const historyByFilter: Record<string, { day: string; minutes: number; correct: number }[]> = {
  "7d": [
    { day: "วันนี้", minutes: 8, correct: 12 },
    { day: "เมื่อวาน", minutes: 6, correct: 9 },
  ],
  "30d": [
    { day: "วันนี้", minutes: 8, correct: 12 },
    { day: "เมื่อวาน", minutes: 6, correct: 9 },
    { day: "3 วันก่อน", minutes: 10, correct: 15 },
    { day: "5 วันก่อน", minutes: 4, correct: 6 },
  ],
  all: [
    { day: "วันนี้", minutes: 8, correct: 12 },
    { day: "เมื่อวาน", minutes: 6, correct: 9 },
    { day: "3 วันก่อน", minutes: 10, correct: 15 },
    { day: "5 วันก่อน", minutes: 4, correct: 6 },
    { day: "2 สัปดาห์ก่อน", minutes: 7, correct: 11 },
    { day: "1 เดือนก่อน", minutes: 5, correct: 7 },
  ],
};
