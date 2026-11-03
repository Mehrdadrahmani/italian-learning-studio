import { DAY } from './srs';

export interface LeitnerCard { box: number; due: number; last: number }
export const BOX_DAYS = [1, 2, 4, 8, 16];
export const MASTERED = 6;

const startOfDay = (t: number) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
export const newCard = (now = Date.now()): LeitnerCard => ({ box: 1, due: startOfDay(now), last: 0 });

/** Correct moves one box forward, wrong returns to box 1. Due dates fall on day boundaries. */
export function answer(c: LeitnerCard, ok: boolean, now = Date.now()): LeitnerCard {
  const box = ok ? Math.min(c.box + 1, MASTERED) : 1;
  const days = box === MASTERED ? 0 : BOX_DAYS[box - 1];
  return { box, last: now, due: box === MASTERED ? Number.MAX_SAFE_INTEGER : startOfDay(now) + days * DAY };
}
/** Lowest box first, so the weakest cards are always seen. */
export const dueCards = (cards: Record<string, LeitnerCard>, now = Date.now()) =>
  Object.entries(cards).filter(([, c]) => c.box < MASTERED && c.due <= now).sort(([, a], [, b]) => a.box - b.box || a.due - b.due).map(([id]) => id);
