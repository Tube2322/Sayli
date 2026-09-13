import type { DifficultyTier, Skill } from "@/lib/skill/types";
import type { Register } from "@/lib/content/registerClassifier";
import generatedQuestions from "@/lib/practice/generatedQuestions.json";

// Metadata for real practice questions, keyed by questionId — single source
// of truth so SessionScreen (which asks the question), the Adaptive Engine
// (which picks a question), and ReviewScreen (which shows past mistakes on
// it) never duplicate this content.
export type QuestionMeta = {
  skill: Skill;
  difficulty: DifficultyTier;
  register: Register;
  en: string;
  pattern: string;
  referenceAnswer: string;
  acceptableAnswers: string[];
  hintWord: string;
  hintMeaning: string;
  // "en-th" (default): show EN sentence, user answers in Thai.
  // "th-en" (writing skill): show Thai sentence, user writes in English.
  direction?: "en-th" | "th-en";
  // Optional grammar/usage enrichment shown in hint + feedback sheets.
  grammarNote?: string;
  usageContext?: string;
  // Present on questions ingested from Tatoeba.org (scripts/ingestTatoeba.mjs)
  // — required for CC-BY attribution; absent on hand-authored questions.
  sourceLicense?: string;
  sourceAttribution?: string;
};

const HAND_AUTHORED: Record<string, QuestionMeta> = {
  "session-demo-didnt-mean-to-hurt-you": {
    skill: "understanding",
    difficulty: "medium",
    register: "casual",
    en: "I didn't mean to hurt you.",
    pattern: "didn't mean to + verb",
    referenceAnswer: "ฉันไม่ได้ตั้งใจทำให้คุณเจ็บ",
    acceptableAnswers: [
      "ฉันไม่ได้ตั้งใจทำให้คุณเจ็บ",
      "ฉันไม่ได้ตั้งใจจะทำร้ายคุณ",
      "ฉันไม่ได้ตั้งใจทำร้ายคุณ",
      "ฉันไม่ได้หมายความจะทำร้ายคุณ",
    ],
    hintWord: "mean",
    hintMeaning: "หมายถึง \"หมายความว่า\" หรือ \"ตั้งใจ\"",
    grammarNote: "didn't + mean to + กริยา (infinitive) = ไม่ได้ตั้งใจจะ… ใช้บอกว่าสิ่งที่เกิดขึ้นไม่ใช่ความตั้งใจ",
    usageContext: "ใช้เมื่อขอโทษหรืออธิบายว่าไม่ได้ตั้งใจทำให้เกิดเรื่องนั้น",
  },
  // ── Writing questions (direction: "th-en") ──────────────────────────────
  // Easy
  "writing-im-really-hungry": {
    skill: "writing",
    direction: "th-en",
    difficulty: "easy",
    register: "casual",
    en: "I'm really hungry.",
    pattern: "I'm + adjective",
    referenceAnswer: "ฉันหิวมากเลย",
    acceptableAnswers: ["I'm really hungry.", "I'm very hungry.", "I am really hungry.", "I am very hungry.", "I'm hungry."],
    hintWord: "hungry",
    hintMeaning: "หิว — รู้สึกอยากกินอาหาร",
    grammarNote: "I'm = I am (short form) ใช้บอกสภาวะปัจจุบัน เช่น I'm tired / I'm happy / I'm hungry",
    usageContext: "ใช้บอกความรู้สึกหิวในชีวิตประจำวัน เวลาจะชวนกินข้าวหรือบอกให้อีกฝ่ายรู้",
  },
  "writing-where-are-you": {
    skill: "writing",
    direction: "th-en",
    difficulty: "easy",
    register: "casual",
    en: "Where are you?",
    pattern: "Where + be + subject?",
    referenceAnswer: "คุณอยู่ที่ไหน",
    acceptableAnswers: ["Where are you?", "Where are you now?"],
    hintWord: "where",
    hintMeaning: "ที่ไหน — คำถามเกี่ยวกับสถานที่",
    grammarNote: "Where are you? = Question word (Where) + verb (are) + subject (you) — คำถามภาษาอังกฤษ verb มาก่อน subject",
    usageContext: "ใช้ถามตำแหน่งของคนอื่น เช่น ในแชทหรือโทรศัพท์",
  },
  "writing-thank-you-so-much": {
    skill: "writing",
    direction: "th-en",
    difficulty: "easy",
    register: "casual",
    en: "Thank you so much.",
    pattern: "Thank you + intensifier",
    referenceAnswer: "ขอบคุณมากๆ เลยนะ",
    acceptableAnswers: ["Thank you so much.", "Thank you very much.", "Thanks so much.", "Thanks a lot."],
    hintWord: "so much",
    hintMeaning: "มากมาย — เน้นความรู้สึกขอบคุณ",
    grammarNote: "Thank you + so much / very much ต่างกันแค่ระดับน้ำเสียง ทั้งคู่ถูกต้อง",
    usageContext: "ใช้ขอบคุณในทุกสถานการณ์ formal หรือ casual ก็ได้",
  },
  "writing-nice-to-meet-you": {
    skill: "writing",
    direction: "th-en",
    difficulty: "easy",
    register: "formal",
    en: "Nice to meet you.",
    pattern: "Nice to + verb + (you)",
    referenceAnswer: "ยินดีที่ได้รู้จัก",
    acceptableAnswers: ["Nice to meet you.", "Nice to meet you!", "It's nice to meet you.", "Pleased to meet you."],
    hintWord: "meet",
    hintMeaning: "พบ, รู้จัก — พบเจอกันครั้งแรก",
    grammarNote: "Nice to meet you = (It is) nice to meet you — ละ 'It is' ได้ในภาษาพูดทั่วไป",
    usageContext: "ใช้เมื่อพบคนใหม่ครั้งแรก ทั้งในชีวิตจริงและออนไลน์",
  },
  "writing-i-like-thai-food": {
    skill: "writing",
    direction: "th-en",
    difficulty: "easy",
    register: "casual",
    en: "I love Thai food.",
    pattern: "I love/like + noun",
    referenceAnswer: "ฉันชอบอาหารไทยมาก",
    acceptableAnswers: ["I love Thai food.", "I really love Thai food.", "I like Thai food.", "I like Thai food a lot.", "I really like Thai food."],
    hintWord: "love",
    hintMeaning: "รัก, ชอบมาก — แสดงความชื่นชอบอย่างเข้มข้น",
    grammarNote: "love > like > enjoy ใช้ได้ทั้งหมด แต่ love แสดงความชื่นชอบมากกว่า like",
    usageContext: "ใช้แสดงความชื่นชอบอาหาร สิ่งของ หรือกิจกรรมต่างๆ",
  },
  // Medium
  "writing-i-just-got-back": {
    skill: "writing",
    direction: "th-en",
    difficulty: "medium",
    register: "casual",
    en: "I just got back from work.",
    pattern: "I just + past verb + from + place",
    referenceAnswer: "ฉันเพิ่งกลับมาจากที่ทำงาน",
    acceptableAnswers: ["I just got back from work.", "I just came back from work.", "I just got home from work.", "I just returned from work."],
    hintWord: "just",
    hintMeaning: "เพิ่ง — เหตุการณ์เกิดขึ้นไม่นานมานี้",
    grammarNote: "just + past tense verb = เพิ่งเกิดขึ้น เช่น just got / just finished / just arrived",
    usageContext: "ใช้บอกว่าทำอะไรเสร็จมาไม่นาน มักใช้ในบทสนทนา IM หรือโทรศัพท์",
  },
  "writing-im-trying-to-learn": {
    skill: "writing",
    direction: "th-en",
    difficulty: "medium",
    register: "casual",
    en: "I'm trying to learn English.",
    pattern: "I'm trying to + verb",
    referenceAnswer: "ฉันกำลังพยายามเรียนภาษาอังกฤษ",
    acceptableAnswers: ["I'm trying to learn English.", "I am trying to learn English.", "I'm trying to study English.", "I'm working on my English."],
    hintWord: "trying",
    hintMeaning: "กำลังพยายาม — ทำสิ่งยากด้วยความพยายาม",
    grammarNote: "be + trying to + infinitive = กำลังพยายามจะ… ใช้ present continuous บอกว่ายังทำอยู่",
    usageContext: "ใช้เมื่อต้องการบอกว่ากำลังพยายามเรียนรู้หรือทำสิ่งใดสิ่งหนึ่ง",
  },
  "writing-could-you-help-me": {
    skill: "writing",
    direction: "th-en",
    difficulty: "medium",
    register: "formal",
    en: "Could you help me, please?",
    pattern: "Could you + verb + (please)?",
    referenceAnswer: "คุณช่วยฉันได้ไหม",
    acceptableAnswers: ["Could you help me?", "Could you help me, please?", "Can you help me?", "Can you help me, please?", "Would you help me?"],
    hintWord: "could",
    hintMeaning: "could — ขอร้องสุภาพกว่า can",
    grammarNote: "Could you…? สุภาพกว่า Can you…? ใช้เมื่อขอความช่วยเหลือจากคนที่ไม่คุ้นเคยหรือในสถานการณ์ formal",
    usageContext: "ใช้ขอความช่วยเหลือ ทั้งกับคนรู้จักและไม่รู้จัก",
  },
  "writing-i-havent-eaten-yet": {
    skill: "writing",
    direction: "th-en",
    difficulty: "medium",
    register: "casual",
    en: "I haven't eaten yet.",
    pattern: "I haven't + past participle + yet",
    referenceAnswer: "ฉันยังไม่ได้กินข้าวเลย",
    acceptableAnswers: ["I haven't eaten yet.", "I haven't eaten anything yet.", "I haven't had food yet.", "I still haven't eaten."],
    hintWord: "yet",
    hintMeaning: "ยัง — บอกว่าสิ่งที่คาดหวังยังไม่เกิดขึ้น",
    grammarNote: "haven't + past participle + yet = ยังไม่ได้… (present perfect negative) — yet วางท้ายประโยค",
    usageContext: "ใช้บอกว่ายังไม่ได้ทำสิ่งที่ควรจะทำหรือที่คาดหวังแล้ว",
  },
  // Hard
  "writing-should-decide-before-too-late": {
    skill: "writing",
    direction: "th-en",
    difficulty: "hard",
    register: "formal",
    en: "You should make a decision before it's too late.",
    pattern: "should + verb before + clause",
    referenceAnswer: "คุณควรตัดสินใจก่อนที่จะสายเกินไป",
    acceptableAnswers: [
      "You should make a decision before it's too late.",
      "You should decide before it's too late.",
      "You should make up your mind before it's too late.",
      "You need to make a decision before it's too late.",
    ],
    hintWord: "decision",
    hintMeaning: "การตัดสินใจ — คำนามจาก decide",
    grammarNote: "make a decision = ตัดสินใจ (คำนาม) ต่างจาก decide (กริยา) — ทั้งคู่ใช้ได้: make a decision / decide",
    usageContext: "ใช้แนะนำหรือเตือนให้รีบตัดสินใจก่อนโอกาสหมด",
  },
  "writing-if-i-had-known": {
    skill: "writing",
    direction: "th-en",
    difficulty: "hard",
    register: "casual",
    en: "If I had known, I would have done things differently.",
    pattern: "If I had + p.p., I would have + p.p.",
    referenceAnswer: "ถ้าฉันรู้มาก่อน ฉันคงทำต่างออกไป",
    acceptableAnswers: [
      "If I had known, I would have done things differently.",
      "If I had known earlier, I would have done things differently.",
      "If I had known, I would have acted differently.",
      "Had I known, I would have done things differently.",
    ],
    hintWord: "had known",
    hintMeaning: "รู้มาแล้ว (past perfect) — สิ่งที่รู้ก่อนเหตุการณ์",
    grammarNote: "If + had + p.p., would have + p.p. = Third conditional — พูดถึงสิ่งที่ไม่เกิดขึ้นในอดีต และผลลัพธ์ที่ควรจะเป็น",
    usageContext: "ใช้แสดงความเสียใจหรือสมมติสิ่งที่เกิดขึ้นในอดีตแล้วไม่สามารถเปลี่ยนได้",
  },
};

// Bulk content pulled from the free Tatoeba EN-TH sentence pairs and
// classified by scripts/ingestTatoeba.mjs (word-frequency difficulty,
// marker-based register) — re-run that script to grow this pool; nothing
// here is hand-typed or fabricated.
const GENERATED: Record<string, QuestionMeta> = Object.fromEntries(
  (generatedQuestions as Array<QuestionMeta & { questionId: string }>).map(
    ({ questionId, ...meta }) => [questionId, meta]
  )
);

export const QUESTION_BANK: Record<string, QuestionMeta> = { ...GENERATED, ...HAND_AUTHORED };
