// One-off/periodic content ingestion — NOT run at app runtime. Pulls real
// English sentences with real Thai translations from the free, keyless
// Tatoeba public API (https://api.tatoeba.org), classifies each by
// difficulty (word-frequency) and register (marker rules), and writes the
// result to src/lib/practice/generatedQuestions.json, which questionBank.ts
// merges into the real content bank at build time.
//
// Run: node scripts/ingestTatoeba.mjs [targetCount]
// Re-run any time to pull a larger/fresher batch; existing generated
// question ids are stable (derived from the Tatoeba sentence id) so
// practiceResults/reviewSchedule/patternMastery referencing them stay valid.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "..", "src", "lib", "practice", "generatedQuestions.json");
const WORDFREQ_PATH = path.join(__dirname, "..", "src", "lib", "content", "wordFrequency.ts");

const TARGET_COUNT = Number(process.argv[2] ?? 150);
const API_BASE = "https://api.tatoeba.org/unstable/sentences";
const PAGE_LIMIT = 100;

const MIN_WORDS = 4;
const MAX_WORDS = 16;

// Same thresholds as src/lib/content/difficultyClassifier.ts — duplicated
// here because this script runs standalone under plain Node (no ts-node),
// not through the app's module graph.
const EASY_MAX_AVG_RANK = 1200;
const MEDIUM_MAX_AVG_RANK = 4000;

const SOCIAL_MARKERS = [
  "gonna", "wanna", "gotta", "kinda", "sorta", "lol", "omg", "tbh", "lmk", "btw",
  "ikr", "lowkey", "highkey", "fr", "ngl", "idk", "u", "ur", "pls", "thx", "yo",
  "bruh", "dude", "bro", "lit", "vibe", "vibes", "sus", "bestie",
];
const FORMAL_MARKERS = [
  "shall", "furthermore", "therefore", "nevertheless", "sincerely", "regarding",
  "pursuant", "kindly", "hereby", "whom", "esteemed", "would you be so kind",
  "i am writing to", "please be advised", "on behalf of", "in accordance with",
];

const STOPWORDS = new Set(
  "a an the and or but if is are was were be been being to of in on for with as at by from this that these those it its i you he she they we not do does did have has had will would can could should may might must so than then also very just about into over under out up down".split(" ")
);

// A small, real safety filter — Tatoeba is user-contributed and unmoderated
// for tone, so obviously unsuitable sentences (violence, slurs, adult
// content) are excluded outright rather than shipped to learners.
const BLOCKLIST = [
  "kill", "murder", "suicide", "rape", "sex", "sexual", "nude", "naked", "drug",
  "cocaine", "heroin", "nigger", "fuck", "shit", "bitch", "whore", "porn",
];

function loadWordFrequencyRanks() {
  const src = fs.readFileSync(WORDFREQ_PATH, "utf8");
  const match = src.match(/const WORDS: string\[\] = (\[[\s\S]*?\]);/);
  if (!match) throw new Error("could not parse wordFrequency.ts — run generation script first");
  const words = JSON.parse(match[1]);
  const rankByWord = new Map();
  words.forEach((w, i) => rankByWord.set(w, i + 1));
  const unknownRank = words.length + 2000;
  return (word) => rankByWord.get(word.toLowerCase()) ?? unknownRank;
}

function contentWords(sentence) {
  return sentence.toLowerCase().replace(/[^a-z' ]/g, " ").split(/\s+/).filter(Boolean);
}

function classifyDifficulty(sentence, rankOf) {
  const words = contentWords(sentence);
  if (words.length === 0) return "medium";
  const avg = words.reduce((sum, w) => sum + rankOf(w), 0) / words.length;
  if (avg <= EASY_MAX_AVG_RANK) return "easy";
  if (avg <= MEDIUM_MAX_AVG_RANK) return "medium";
  return "hard";
}

function classifyRegister(sentence) {
  const lower = sentence.toLowerCase();
  const hasAny = (markers) => markers.some((m) => new RegExp(`\\b${m}\\b`).test(lower));
  if (hasAny(SOCIAL_MARKERS)) return "social";
  if (hasAny(FORMAL_MARKERS)) return "formal";
  return "casual";
}

function isBlocked(sentence) {
  const lower = sentence.toLowerCase();
  return BLOCKLIST.some((w) => new RegExp(`\\b${w}\\b`).test(lower));
}

function focusKeyword(sentence) {
  const words = contentWords(sentence).filter((w) => w.length > 3 && !STOPWORDS.has(w));
  if (words.length === 0) return "vocabulary";
  return words.reduce((longest, w) => (w.length > longest.length ? w : longest), words[0]);
}

async function fetchPage(after) {
  const params = new URLSearchParams({
    lang: "eng",
    "trans:lang": "tha",
    sort: "relevance",
    limit: String(PAGE_LIMIT),
  });
  if (after) params.set("after", after);
  const res = await fetch(`${API_BASE}?${params.toString()}`);
  if (!res.ok) throw new Error(`Tatoeba API error ${res.status}`);
  return res.json();
}

async function main() {
  const rankOf = loadWordFrequencyRanks();
  const seenEnglish = new Set();
  const results = [];
  let after;

  while (results.length < TARGET_COUNT) {
    const page = await fetchPage(after);
    if (!page.data || page.data.length === 0) break;

    for (const item of page.data) {
      if (item.is_unapproved) continue;
      const en = item.text.trim();
      const wordCount = contentWords(en).length;
      if (wordCount < MIN_WORDS || wordCount > MAX_WORDS) continue;
      if (isBlocked(en)) continue;
      const key = en.toLowerCase();
      if (seenEnglish.has(key)) continue;

      const translations = (item.translations ?? [])
        .filter((t) => t.lang === "tha" && !t.is_unapproved && t.text?.trim())
        .map((t) => t.text.trim());
      if (translations.length === 0) continue;

      seenEnglish.add(key);
      results.push({
        questionId: `tatoeba-${item.id}`,
        skill: "understanding",
        difficulty: classifyDifficulty(en, rankOf),
        register: classifyRegister(en),
        en,
        pattern: focusKeyword(en),
        referenceAnswer: translations[0],
        acceptableAnswers: translations,
        hintWord: focusKeyword(en),
        hintMeaning: "",
        sourceLicense: item.license ?? "unknown",
        sourceAttribution: item.owner ?? "anonymous",
      });
      if (results.length >= TARGET_COUNT) break;
    }

    if (!page.paging?.has_next) break;
    const nextUrl = new URL(page.paging.next);
    after = nextUrl.searchParams.get("after");
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2) + "\n", "utf8");
  console.log(`wrote ${results.length} questions to ${path.relative(process.cwd(), OUT_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
