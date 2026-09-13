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
  // ── Listening questions (skill: "listening") ────────────────────────────
  // Direction stays "en-th" — SessionScreen hides the EN text for this skill
  // and speaks it aloud instead (Web Speech API), so the mechanic is real
  // listening comprehension, not just reading with extra steps.
  // Easy
  "listening-what-time-is-it": {
    skill: "listening", difficulty: "easy", register: "casual",
    en: "What time is it now?", pattern: "What time is it?",
    referenceAnswer: "ตอนนี้กี่โมงแล้ว",
    acceptableAnswers: ["ตอนนี้กี่โมงแล้ว", "กี่โมงแล้ว", "ตอนนี้กี่โมง"],
    hintWord: "time", hintMeaning: "เวลา",
    grammarNote: "What time is it? ใช้ถามเวลาปัจจุบัน — now เสริมความชัดเจนเฉยๆ",
    usageContext: "ใช้ถามเวลาในชีวิตประจำวัน",
  },
  "listening-im-on-my-way": {
    skill: "listening", difficulty: "easy", register: "casual",
    en: "I'm on my way.", pattern: "I'm on my way",
    referenceAnswer: "ฉันกำลังไปแล้ว",
    acceptableAnswers: ["ฉันกำลังไปแล้ว", "กำลังไปแล้ว", "ฉันมาแล้วนะ"],
    hintWord: "way", hintMeaning: "ทาง — on my way แปลว่ากำลังเดินทางไป",
    grammarNote: "on my way (to...) เป็นสำนวนบอกว่ากำลังเดินทางอยู่",
    usageContext: "ใช้บอกคนอื่นว่ากำลังเดินทางไปหา ไม่ต้องรอนาน",
  },
  "listening-can-i-get-water": {
    skill: "listening", difficulty: "easy", register: "casual",
    en: "Can I get some water, please?", pattern: "Can I get + noun?",
    referenceAnswer: "ขอน้ำหน่อยได้ไหม",
    acceptableAnswers: ["ขอน้ำหน่อยได้ไหม", "ขอน้ำหน่อย", "ขอน้ำได้ไหม"],
    hintWord: "water", hintMeaning: "น้ำ",
    grammarNote: "Can I get...? สำนวนขอของแบบง่ายๆ ในร้านอาหาร/คาเฟ่",
    usageContext: "ใช้สั่งหรือขอของในร้านอาหาร",
  },
  "listening-see-you-tomorrow": {
    skill: "listening", difficulty: "easy", register: "casual",
    en: "See you tomorrow.", pattern: "See you + time",
    referenceAnswer: "เจอกันพรุ่งนี้นะ",
    acceptableAnswers: ["เจอกันพรุ่งนี้นะ", "เจอกันพรุ่งนี้", "แล้วเจอกันพรุ่งนี้"],
    hintWord: "tomorrow", hintMeaning: "พรุ่งนี้",
    grammarNote: "See you + [เวลา] เป็นสำนวนบอกลาแบบกันเอง",
    usageContext: "ใช้บอกลาเมื่อนัดเจอกันวันถัดไป",
  },
  "listening-this-is-delicious": {
    skill: "listening", difficulty: "easy", register: "casual",
    en: "This is delicious.", pattern: "This is + adjective",
    referenceAnswer: "อันนี้อร่อยมาก",
    acceptableAnswers: ["อันนี้อร่อยมาก", "อร่อยมาก", "อันนี้อร่อย"],
    hintWord: "delicious", hintMeaning: "อร่อย",
    grammarNote: "This is + adjective ใช้ชมสิ่งของ/อาหารตรงหน้า",
    usageContext: "ใช้ชมรสชาติอาหารตอนกำลังกิน",
  },
  // Medium
  "listening-call-you-back": {
    skill: "listening", difficulty: "medium", register: "casual",
    en: "I'll call you back in a minute.", pattern: "I'll + verb + in a minute",
    referenceAnswer: "เดี๋ยวฉันโทรกลับไปนะ",
    acceptableAnswers: ["เดี๋ยวฉันโทรกลับไปนะ", "เดี๋ยวโทรกลับ", "ฉันจะโทรกลับในอีกสักครู่"],
    hintWord: "in a minute", hintMeaning: "อีกสักครู่ — ในเวลาไม่นาน",
    grammarNote: "in a minute ไม่ได้แปลว่า 60 วินาทีตรงๆ แต่หมายถึง 'อีกเดี๋ยว'",
    usageContext: "ใช้บอกว่าจะติดต่อกลับในไม่ช้า",
  },
  "listening-plans-weekend": {
    skill: "listening", difficulty: "medium", register: "casual",
    en: "Do you have any plans this weekend?", pattern: "Do you have any + noun?",
    referenceAnswer: "สุดสัปดาห์นี้มีแผนอะไรไหม",
    acceptableAnswers: ["สุดสัปดาห์นี้มีแผนอะไรไหม", "สุดสัปดาห์นี้มีแผนไหม", "เสาร์อาทิตย์นี้มีแผนอะไรไหม"],
    hintWord: "plans", hintMeaning: "แผนการ",
    grammarNote: "Do you have any plans...? ใช้ถามความว่างหรือแผนล่วงหน้า",
    usageContext: "ใช้ชวนนัดหรือถามความว่างของอีกฝ่าย",
  },
  "listening-afraid-cant-make-it": {
    skill: "listening", difficulty: "medium", register: "formal",
    en: "I'm afraid I can't make it tonight.", pattern: "I'm afraid + clause",
    referenceAnswer: "เกรงว่าคืนนี้ฉันไปไม่ได้",
    acceptableAnswers: ["เกรงว่าคืนนี้ฉันไปไม่ได้", "คืนนี้ฉันไปไม่ได้", "เกรงว่าฉันไปไม่ได้คืนนี้"],
    hintWord: "make it", hintMeaning: "ไปได้ทัน/ไปได้สำเร็จ",
    grammarNote: "I'm afraid + clause เป็นสำนวนสุภาพเวลาแจ้งข่าวที่ไม่ค่อยดี",
    usageContext: "ใช้ปฏิเสธคำเชิญอย่างสุภาพ",
  },
  "listening-let-me-know": {
    skill: "listening", difficulty: "medium", register: "casual",
    en: "Let me know if you need anything.", pattern: "Let me know if + clause",
    referenceAnswer: "บอกฉันนะถ้าต้องการอะไร",
    acceptableAnswers: ["บอกฉันนะถ้าต้องการอะไร", "บอกฉันด้วยถ้าต้องการอะไร", "ถ้าต้องการอะไรบอกฉันนะ"],
    hintWord: "let me know", hintMeaning: "บอกฉันด้วยนะ",
    grammarNote: "Let me know if... ใช้เสนอความช่วยเหลือแบบเปิดกว้าง",
    usageContext: "ใช้บอกให้อีกฝ่ายติดต่อมาได้เสมอถ้าต้องการความช่วยเหลือ",
  },
  // Hard
  "listening-would-have-told-you": {
    skill: "listening", difficulty: "hard", register: "formal",
    en: "I would have told you if I had known.", pattern: "would have + p.p. if + had + p.p.",
    referenceAnswer: "ฉันคงบอกคุณไปแล้วถ้าฉันรู้",
    acceptableAnswers: ["ฉันคงบอกคุณไปแล้วถ้าฉันรู้", "ถ้าฉันรู้ ฉันคงบอกคุณไปแล้ว"],
    hintWord: "would have told", hintMeaning: "คงจะบอกไปแล้ว (สมมติในอดีต)",
    grammarNote: "Third conditional กลับด้าน — ผลลัพธ์มาก่อนเงื่อนไข ความหมายเหมือนกัน",
    usageContext: "ใช้อธิบายว่าทำไมไม่ได้บอกอะไรบางอย่างในอดีต",
  },
  "listening-not-that-i-dont-want-to": {
    skill: "listening", difficulty: "hard", register: "casual",
    en: "It's not that I don't want to help, I just don't have time.", pattern: "It's not that..., I just...",
    referenceAnswer: "ไม่ใช่ว่าฉันไม่อยากช่วย แค่ไม่มีเวลา",
    acceptableAnswers: ["ไม่ใช่ว่าฉันไม่อยากช่วย แค่ไม่มีเวลา", "ไม่ใช่ว่าไม่อยากช่วย แค่ไม่มีเวลา"],
    hintWord: "it's not that", hintMeaning: "ไม่ใช่ว่า...",
    grammarNote: "It's not that X, I just Y — สำนวนอธิบาย/แก้ตัวโดยไม่ให้ฟังดูแย่",
    usageContext: "ใช้อธิบายเหตุผลจริงเมื่อกลัวถูกเข้าใจผิด",
  },
  "listening-had-it-not-been-for": {
    skill: "listening", difficulty: "hard", register: "formal",
    en: "Had it not been for your help, I would have failed.", pattern: "Had it not been for..., ... would have p.p.",
    referenceAnswer: "ถ้าไม่ได้คุณช่วย ฉันคงล้มเหลวไปแล้ว",
    acceptableAnswers: ["ถ้าไม่ได้คุณช่วย ฉันคงล้มเหลวไปแล้ว", "ถ้าไม่มีคุณช่วย ฉันคงล้มเหลว"],
    hintWord: "had it not been for", hintMeaning: "ถ้าไม่ได้... (สำนวนทางการ)",
    grammarNote: "Had it not been for + noun = If it had not been for... สำนวนทางการของ third conditional",
    usageContext: "ใช้ขอบคุณอย่างเป็นทางการ เน้นว่าอีกฝ่ายมีผลสำคัญมาก",
  },
  // ── Speaking questions (skill: "speaking", direction: "th-en") ──────────
  // Situational: Thai describes a scenario, user writes the English response
  // they would actually say — honest scope given no mic/voice input exists.
  // Easy
  "speaking-greet-friend-morning": {
    skill: "speaking", direction: "th-en", difficulty: "easy", register: "casual",
    en: "Good morning! How are you?",
    pattern: "Good morning! How are you?",
    referenceAnswer: "คุณเจอเพื่อนตอนเช้า จะทักทายว่าอะไร",
    acceptableAnswers: ["Good morning! How are you?", "Good morning, how are you?", "Morning! How are you?"],
    hintWord: "morning", hintMeaning: "เช้า — ใช้ทักทายช่วงเช้า",
    grammarNote: "Good morning! + How are you? เป็นการทักทายมาตรฐานตอนเช้า",
    usageContext: "ใช้ทักทายเพื่อนหรือคนรู้จักตอนเช้า",
  },
  "speaking-order-hot-coffee": {
    skill: "speaking", direction: "th-en", difficulty: "easy", register: "casual",
    en: "Can I have a hot coffee, please?",
    pattern: "Can I have + noun, please?",
    referenceAnswer: "คุณอยากสั่งกาแฟร้อนหนึ่งแก้ว จะพูดว่าอะไร",
    acceptableAnswers: ["Can I have a hot coffee, please?", "Can I get a hot coffee, please?", "I'd like a hot coffee, please."],
    hintWord: "coffee", hintMeaning: "กาแฟ",
    grammarNote: "Can I have...? / Can I get...? ใช้สั่งของในร้านได้เหมือนกัน",
    usageContext: "ใช้สั่งเครื่องดื่มในร้านกาแฟ",
  },
  "speaking-bless-you": {
    skill: "speaking", direction: "th-en", difficulty: "easy", register: "casual",
    en: "Bless you!",
    pattern: "Bless you!",
    referenceAnswer: "มีคนจามใส่คุณ คุณจะพูดอะไรให้กำลังใจเขา",
    acceptableAnswers: ["Bless you!", "Bless you.", "Bless you!!"],
    hintWord: "bless", hintMeaning: "อวยพร — คำพูดติดปากเวลามีคนจาม",
    grammarNote: "Bless you! เป็นสำนวนติดปาก ไม่ต้องคิดตามตัวอักษร",
    usageContext: "ใช้พูดทันทีเมื่อมีคนจามใกล้ๆ",
  },
  "speaking-see-you-later": {
    skill: "speaking", direction: "th-en", difficulty: "easy", register: "casual",
    en: "See you later!",
    pattern: "See you later!",
    referenceAnswer: "คุณจะบอกลาเพื่อนก่อนแยกทาง จะพูดว่าอะไร",
    acceptableAnswers: ["See you later!", "See you later.", "Catch you later!"],
    hintWord: "later", hintMeaning: "ทีหลัง, ต่อไป",
    grammarNote: "See you later! ใช้บอกลาแบบไม่เป็นทางการ ไม่ระบุเวลาที่แน่นอน",
    usageContext: "ใช้บอกลาเพื่อนหรือคนสนิท",
  },
  // Medium
  "speaking-apologize-late": {
    skill: "speaking", direction: "th-en", difficulty: "medium", register: "formal",
    en: "I'm sorry I'm late.",
    pattern: "I'm sorry + clause",
    referenceAnswer: "คุณมาสาย จะขอโทษเจ้านายว่าอะไร",
    acceptableAnswers: ["I'm sorry I'm late.", "I'm sorry for being late.", "Sorry I'm late."],
    hintWord: "late", hintMeaning: "สาย, ล่าช้า",
    grammarNote: "I'm sorry + clause / I'm sorry for + -ing ใช้ขอโทษได้ทั้งคู่",
    usageContext: "ใช้ขอโทษเมื่อไปถึงช้ากว่ากำหนด",
  },
  "speaking-ask-directions-station": {
    skill: "speaking", direction: "th-en", difficulty: "medium", register: "formal",
    en: "Excuse me, how do I get to the train station?",
    pattern: "Excuse me, how do I get to...?",
    referenceAnswer: "คุณอยากถามทางไปสถานีรถไฟ จะพูดว่าอะไร",
    acceptableAnswers: ["Excuse me, how do I get to the train station?", "Excuse me, how can I get to the train station?", "Could you tell me how to get to the train station?"],
    hintWord: "get to", hintMeaning: "ไปถึง (สถานที่)",
    grammarNote: "How do I get to...? เป็นสำนวนมาตรฐานถามเส้นทาง",
    usageContext: "ใช้ถามทางกับคนแปลกหน้า",
  },
  "speaking-decline-politely": {
    skill: "speaking", direction: "th-en", difficulty: "medium", register: "formal",
    en: "I'd love to, but I already have plans.",
    pattern: "I'd love to, but + clause",
    referenceAnswer: "เพื่อนชวนไปกินข้าว แต่คุณติดธุระ จะปฏิเสธอย่างสุภาพว่าอะไร",
    acceptableAnswers: ["I'd love to, but I already have plans.", "I'd love to, but I have other plans.", "I wish I could, but I already have plans."],
    hintWord: "have plans", hintMeaning: "มีนัด/มีแผนอยู่แล้ว",
    grammarNote: "I'd love to, but... เป็นวิธีปฏิเสธที่ยังคงมารยาทดี",
    usageContext: "ใช้ปฏิเสธคำชวนอย่างสุภาพโดยไม่ทำให้อีกฝ่ายรู้สึกแย่",
  },
  "speaking-ask-colleague-check": {
    skill: "speaking", direction: "th-en", difficulty: "medium", register: "formal",
    en: "Could you please check this for me?",
    pattern: "Could you please + verb?",
    referenceAnswer: "คุณอยากขอให้เพื่อนร่วมงานช่วยตรวจงานให้ จะพูดว่าอะไร",
    acceptableAnswers: ["Could you please check this for me?", "Could you check this for me, please?", "Would you mind checking this for me?"],
    hintWord: "check", hintMeaning: "ตรวจสอบ",
    grammarNote: "Could you please...? สุภาพกว่า Can you...? เหมาะกับที่ทำงาน",
    usageContext: "ใช้ขอความช่วยเหลือเพื่อนร่วมงานอย่างสุภาพ",
  },
  // Hard
  "speaking-apologize-customer": {
    skill: "speaking", direction: "th-en", difficulty: "hard", register: "formal",
    en: "I'm really sorry for the inconvenience. Let me fix that for you right away.",
    pattern: "I'm sorry for..., let me + verb",
    referenceAnswer: "ลูกค้าบ่นว่าสินค้ามีปัญหา คุณจะขอโทษและเสนอทางแก้อย่างมืออาชีพว่าอะไร",
    acceptableAnswers: [
      "I'm really sorry for the inconvenience. Let me fix that for you right away.",
      "I apologize for the inconvenience. I'll fix this right away.",
      "I'm so sorry for the trouble. Let me take care of that immediately.",
    ],
    hintWord: "inconvenience", hintMeaning: "ความไม่สะดวก, ความยุ่งยาก",
    grammarNote: "sorry for the inconvenience เป็นวลีมาตรฐานในงานบริการลูกค้า",
    usageContext: "ใช้ตอนรับมือกับข้อร้องเรียนของลูกค้าอย่างมืออาชีพ",
  },
  "speaking-disagree-politely-meeting": {
    skill: "speaking", direction: "th-en", difficulty: "hard", register: "formal",
    en: "I see your point, but I have a slightly different opinion.",
    pattern: "I see your point, but...",
    referenceAnswer: "คุณไม่เห็นด้วยกับความเห็นในที่ประชุม แต่อยากพูดอย่างสุภาพ จะพูดว่าอะไร",
    acceptableAnswers: [
      "I see your point, but I have a slightly different opinion.",
      "I understand, but I see it a bit differently.",
      "That's a fair point, but I'd like to offer a different view.",
    ],
    hintWord: "point", hintMeaning: "ประเด็น, ความเห็น",
    grammarNote: "I see your point, but... เป็นสำนวนแย้งความเห็นแบบไม่ทำให้อีกฝ่ายเสียหน้า",
    usageContext: "ใช้แสดงความเห็นต่างในที่ประชุมอย่างสุภาพ",
  },
  "speaking-negotiate-price": {
    skill: "speaking", direction: "th-en", difficulty: "hard", register: "formal",
    en: "Is there any chance you could lower the price a bit?",
    pattern: "Is there any chance...?",
    referenceAnswer: "คุณอยากต่อรองราคาสินค้าอย่างสุภาพ จะพูดว่าอะไร",
    acceptableAnswers: [
      "Is there any chance you could lower the price a bit?",
      "Would it be possible to get a better price?",
      "Could you possibly lower the price a little?",
    ],
    hintWord: "lower the price", hintMeaning: "ลดราคา",
    grammarNote: "Is there any chance...? เป็นสำนวนขอแบบสุภาพมาก เหมาะกับการต่อรอง",
    usageContext: "ใช้ต่อรองราคาอย่างสุภาพในการซื้อขาย",
  },
  "speaking-decline-lending-money": {
    skill: "speaking", direction: "th-en", difficulty: "hard", register: "casual",
    en: "I wish I could help, but I'm a bit tight on money myself right now.",
    pattern: "I wish I could..., but...",
    referenceAnswer: "เพื่อนขอยืมเงินคุณ แต่คุณลำบากใจจะปฏิเสธ จะพูดว่าอะไรให้นุ่มนวล",
    acceptableAnswers: [
      "I wish I could help, but I'm a bit tight on money myself right now.",
      "I really wish I could, but I'm short on cash myself right now.",
      "I'd love to help, but I'm a bit tight on money right now.",
    ],
    hintWord: "tight on money", hintMeaning: "เงินฝืดเคือง, เงินตึงมือ",
    grammarNote: "I wish I could..., but... ใช้ปฏิเสธเรื่องละเอียดอ่อนแบบนุ่มนวล",
    usageContext: "ใช้ปฏิเสธการขอยืมเงินโดยไม่ทำให้ความสัมพันธ์แย่ลง",
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
