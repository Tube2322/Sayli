// One-off maintenance script: fills the empty hintMeaning field left by
// scripts/ingestTatoeba.mjs (Tatoeba ingestion never had a Thai gloss for
// its picked keyword) with a hand-translated dictionary. Re-run whenever
// re-ingesting adds new questions with unmatched hintWords — the script
// reports any it can't translate so they don't silently stay blank.
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "../src/lib/practice/generatedQuestions.json");

const DICTIONARY = {
  abroad: "ต่างประเทศ",
  administrator: "ผู้ดูแลระบบ",
  ages: "เป็นเวลานาน",
  alessia: "ชื่อคน",
  alternatives: "ทางเลือกอื่น",
  always: "เสมอ",
  analysis: "การวิเคราะห์",
  ankara: "อังการา (เมืองหลวงตุรกี)",
  answer: "คำตอบ",
  anything: "อะไรก็ตาม",
  apologizing: "การขอโทษ",
  arrived: "มาถึงแล้ว",
  away: "ออกไป",
  beautiful: "สวยงาม",
  begin: "เริ่มต้น",
  believe: "เชื่อ",
  benefits: "ผลประโยชน์",
  black: "สีดำ",
  boiled: "ต้มแล้ว",
  boiling: "กำลังเดือด",
  book: "หนังสือ",
  bothering: "รบกวน",
  broken: "พังแล้ว",
  bustling: "คึกคัก",
  buying: "กำลังซื้อ",
  cannot: "ไม่สามารถ",
  cars: "รถยนต์",
  charging: "กำลังชาร์จ",
  choice: "ทางเลือก",
  chubby: "อวบอ้วน, ป้อม",
  colleagues: "เพื่อนร่วมงาน",
  contribution: "การมีส่วนร่วม",
  cooking: "การทำอาหาร",
  cooperative: "ให้ความร่วมมือ",
  curry: "แกงกะหรี่",
  dangerous: "อันตราย",
  definitely: "อย่างแน่นอน",
  dissent: "ความเห็นต่าง",
  dollars: "ดอลลาร์",
  early: "แต่เช้า, เร็ว",
  earthquake: "แผ่นดินไหว",
  eating: "กำลังกิน",
  electric: "ไฟฟ้า",
  elephants: "ช้าง",
  ended: "จบแล้ว",
  enough: "พอแล้ว",
  every: "ทุกๆ",
  everybody: "ทุกคน",
  everyone: "ทุกคน",
  experiences: "ประสบการณ์",
  family: "ครอบครัว",
  father: "พ่อ",
  fits: "เหมาะสม",
  flowers: "ดอกไม้",
  folder: "โฟลเดอร์",
  football: "ฟุตบอล",
  french: "ภาษาฝรั่งเศส",
  gardening: "การทำสวน",
  grandkids: "หลานๆ",
  happen: "เกิดขึ้น",
  happening: "กำลังเกิดขึ้น",
  happy: "มีความสุข",
  heal: "รักษาให้หาย",
  help: "ช่วยเหลือ",
  here: "ที่นี่",
  house: "บ้าน",
  intelligent: "ฉลาด",
  ironed: "รีดแล้ว",
  kidnapped: "ถูกลักพาตัว",
  know: "รู้",
  learning: "กำลังเรียนรู้",
  likes: "ชอบ",
  lions: "สิงโต",
  machine: "เครื่องจักร",
  maisie: "ชื่อคน",
  matter: "เรื่องสำคัญ",
  meet: "พบ",
  milk: "นม",
  nobody: "ไม่มีใคร",
  options: "ตัวเลือก",
  ordered: "สั่งแล้ว",
  painting: "การวาดภาพ",
  parents: "พ่อแม่",
  pencil: "ดินสอ",
  pencils: "ดินสอ (หลายแท่ง)",
  perennial: "ยืนต้น, ต่อเนื่องยาวนาน",
  pictures: "รูปภาพ",
  play: "เล่น",
  police: "ตำรวจ",
  pretended: "แสร้งทำ",
  quickly: "อย่างรวดเร็ว",
  radio: "วิทยุ",
  raining: "ฝนกำลังตก",
  rainy: "มีฝนตก",
  raven: "อีกาสายพันธุ์ใหญ่",
  really: "จริงๆ",
  rejected: "ถูกปฏิเสธ",
  relationships: "ความสัมพันธ์",
  remember: "จำได้",
  results: "ผลลัพธ์",
  said: "พูดไปแล้ว",
  sample: "ตัวอย่าง",
  shirt: "เสื้อเชิ้ต",
  snores: "กรน",
  society: "สังคม",
  somchai: "ชื่อคน",
  somebody: "ใครสักคน",
  someone: "ใครบางคน",
  something: "บางสิ่ง",
  still: "ยังคง",
  store: "ร้านค้า",
  suspended: "ถูกพักงาน/ถูกระงับ",
  take: "เอาไป",
  talking: "กำลังพูดคุย",
  taxi: "แท็กซี่",
  taxis: "แท็กซี่ (หลายคัน)",
  thank: "ขอบคุณ",
  things: "สิ่งของ",
  took: "เอาไปแล้ว",
  translated: "แปลแล้ว",
  vaccinated: "ฉีดวัคซีนแล้ว",
  vocabulary: "คำศัพท์",
  waited: "รอแล้ว",
  whale: "ปลาวาฬ",
  what: "อะไร",
  whole: "ทั้งหมด",
  working: "กำลังทำงาน",
  works: "ทำงาน (ได้ผล)",
  yesterday: "เมื่อวาน",
  your: "ของคุณ",
};

const data = JSON.parse(readFileSync(filePath, "utf-8"));
let filled = 0;
const missing = new Set();

for (const q of data) {
  if (q.hintMeaning) continue;
  const key = q.hintWord.toLowerCase();
  if (DICTIONARY[key]) {
    q.hintMeaning = DICTIONARY[key];
    filled += 1;
  } else {
    missing.add(q.hintWord);
  }
}

writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
console.log(`Filled ${filled} hintMeaning entries.`);
if (missing.size > 0) {
  console.log("Missing translations for:", [...missing].sort());
}
