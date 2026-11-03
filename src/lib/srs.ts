import type { Grade, SrsCard } from '../types';

export const DAY = 86_400_000;
const MIN_EASE = 1.3;

/**
 * Simplified SM-2.
 * again: reps reset, ease -0.20, due again in 10 minutes
 * hard:  interval × 1.2 (min 1 day), ease -0.15
 * good:  1 day, 6 days, then interval × ease
 * easy:  same as good × 1.3 (min 4 days), ease +0.15
 */
export function schedule(card: SrsCard | undefined, grade: Grade, now = Date.now()): SrsCard {
  const c: SrsCard = card ?? { due: now, interval: 0, ease: 2.5, reps: 0, lapses: 0, last: 0 };
  let { interval, ease, reps, lapses } = c;
  let due: number;
  if (grade === 'again') {
    reps = 0; lapses += 1; interval = 0; ease = Math.max(MIN_EASE, ease - 0.2);
    due = now + 10 * 60_000;
  } else {
    if (grade === 'hard') {
      interval = Math.max(1, Math.round(interval * 1.2)); ease = Math.max(MIN_EASE, ease - 0.15);
    } else {
      const base = reps === 0 ? 1 : reps === 1 ? 6 : Math.round(interval * ease);
      if (grade === 'easy') { interval = Math.max(4, Math.round(base * 1.3)); ease += 0.15; } else interval = base;
    }
    reps += 1;
    due = now + interval * DAY;
  }
  return { due, interval, ease: Math.round(ease * 100) / 100, reps, lapses, last: now, grade };
}

/** Most overdue first; among equals, the harder card (lower ease) first. */
export function dueQueue(srs: Record<string, SrsCard>, now = Date.now()): string[] {
  return Object.entries(srs).filter(([, c]) => c.due <= now)
    .sort(([, a], [, b]) => {
      const days = Math.floor((a.due - b.due) / DAY);
      return days !== 0 ? days : a.ease - b.ease;
    }).map(([id]) => id);
}

export function intervalLabel(card: SrsCard | undefined, grade: Grade): string {
  const n = schedule(card, grade, 0);
  return grade === 'again' ? '۱۰ دقیقه' : `${n.interval.toLocaleString('fa-IR')} روز`;
}
