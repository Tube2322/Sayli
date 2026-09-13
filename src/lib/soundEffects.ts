"use client";

// Tiny synthesized sound effects (Web Audio API oscillators) — no audio
// files to load/license, just a few short tones. Every export checks
// `enabled` itself so call sites don't need their own if-guard.

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return null;
  if (!audioCtx) audioCtx = new AudioContextCtor();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function tone(ctx: AudioContext, freq: number, startTime: number, duration: number, type: OscillatorType = "sine", gainPeak = 0.12) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

export function playTap(enabled: boolean) {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  tone(ctx, 720, ctx.currentTime, 0.045, "sine", 0.06);
}

export function playCorrect(enabled: boolean) {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(ctx, 523.25, t, 0.12, "sine", 0.1); // C5
  tone(ctx, 783.99, t + 0.09, 0.18, "sine", 0.1); // G5
}

export function playIncorrect(enabled: boolean) {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(ctx, 220, t, 0.16, "sine", 0.09);
  tone(ctx, 196, t + 0.1, 0.2, "sine", 0.09);
}
