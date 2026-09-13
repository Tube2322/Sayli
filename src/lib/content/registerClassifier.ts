export type Register = "social" | "casual" | "formal";

// Rule-based register classifier — real deterministic heuristics over the
// sentence text (marker word lists), not a fabricated/random tag and not a
// paid API call. Checked in order: social slang markers first (most
// specific), then formal markers, else casual as the everyday-speech default.
const SOCIAL_MARKERS = [
  "gonna", "wanna", "gotta", "kinda", "sorta", "lol", "omg", "tbh", "lmk", "btw",
  "ikr", "lowkey", "highkey", "fr", "ngl", "idk", "u", "ur", "pls", "thx", "yo",
  "bruh", "dude", "bro", "lit", "vibe", "vibes", "sus", "bestie", "no cap",
];
const FORMAL_MARKERS = [
  "shall", "furthermore", "therefore", "nevertheless", "sincerely", "regarding",
  "pursuant", "kindly", "hereby", "whom", "esteemed", "would you be so kind",
  "i am writing to", "please be advised", "on behalf of", "in accordance with",
];

function hasAnyMarker(lowerText: string, markers: string[]): boolean {
  return markers.some((m) => new RegExp(`\\b${m}\\b`).test(lowerText));
}

export function classifySentenceRegister(sentence: string): Register {
  const lower = sentence.toLowerCase();
  if (hasAnyMarker(lower, SOCIAL_MARKERS)) return "social";
  if (hasAnyMarker(lower, FORMAL_MARKERS)) return "formal";
  return "casual";
}
