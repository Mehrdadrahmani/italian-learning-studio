import { useSyncExternalStore } from 'react';
import type { AppState, DayStat, Grade, Settings } from '../types';
import { schedule } from './srs';
import { answer, newCard } from './leitner';
import { capability } from './platform';

const KEY = 'ils.state.v1';
export const defaults: Settings = {
  voiceURI: '', rate: 0.95, slowRate: 0.6, showEnglish: false, showTranslit: true,
  dailyGoal: 10, autoplay: false, theme: 'system', lang: 'fa',
};
const fresh = (): AppState => ({
  v: 1, updatedAt: 0, settings: { ...defaults }, lessons: {}, srs: {}, known: {}, days: {},
  tests: [], pron: {}, done: {}, writing: [], speaking: {}, recent: [], leitner: {}, mine: {},
});

export function normalize(raw: unknown): AppState | null {
  if (!raw || typeof raw !== 'object' || (raw as AppState).v !== 1) return null;
  const f = fresh(), r = raw as AppState;
  return { ...f, ...r, settings: { ...f.settings, ...r.settings } };
}

export type Persistence = 'memory' | 'device' | 'account' | 'account-error';
let persistence: Persistence = 'memory';
let state: AppState = fresh();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

try {
  const raw = localStorage.getItem(KEY);
  localStorage.setItem(KEY + '.probe', '1');
  localStorage.removeItem(KEY + '.probe');
  persistence = 'device';
  if (raw) state = normalize(JSON.parse(raw)) ?? state;
} catch { persistence = 'memory'; }

export const getState = () => state;
export const getPersistence = () => persistence;
export const useApp = () => useSyncExternalStore(cb => { listeners.add(cb); return () => listeners.delete(cb); }, getState);

/* ---- account sync (Artifact db capability) ---- */
let remote: { set(d: Record<string, unknown>): Promise<void> } | null = null;
let timer = 0, writing = false, dirty = false;

async function flush() {
  if (!remote) return;
  if (writing) { dirty = true; return; }
  writing = true;
  try { await remote.set(JSON.parse(JSON.stringify(state))); if (persistence !== 'account') { persistence = 'account'; emit(); } }
  catch { persistence = 'account-error'; emit(); }
  writing = false;
  if (dirty) { dirty = false; schedule_(); }
}
const schedule_ = () => { clearTimeout(timer); timer = window.setTimeout(flush, 2500); };

export async function connectAccountStorage(): Promise<void> {
  const [db, user] = await Promise.all([capability('db'), capability('user')]);
  if (!db || !user) return;
  try {
    const id = await user.id();
    if (!id) return;
    const doc = db.doc(`data/users/${id}/progress`);
    const snap = await doc.get();
    const r = snap.exists ? normalize(snap.data()) : null;
    if (r && r.updatedAt > state.updatedAt) { state = r; saveLocal(); }
    remote = doc;
    persistence = 'account';
    emit();
    if (state.updatedAt > (r?.updatedAt ?? 0)) schedule_();
  } catch { persistence = persistence === 'memory' ? 'memory' : 'device'; emit(); }
}

function saveLocal() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* reported through persistence */ } }

export function update(fn: (s: AppState) => void): void {
  const next: AppState = structuredClone(state);
  fn(next);
  next.updatedAt = Date.now();
  next.tests = next.tests.slice(-200);
  next.writing = next.writing.slice(-50);
  state = next;
  saveLocal();
  if (remote) schedule_();
  emit();
}

/* ---- domain actions ---- */
export const dayKey = (t = Date.now()) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const blank = (): DayStat => ({ reviews: 0, correct: 0, lessons: 0, seconds: 0, quizzes: 0, pron: 0 });
export const today = (s: AppState): DayStat => s.days[dayKey()] ?? blank();
const bump = (s: AppState, k: keyof DayStat, n = 1) => {
  const key = dayKey(); s.days[key] = s.days[key] ?? blank(); s.days[key][k] += n;
};

export function streak(s: AppState): number {
  const active = (k: string) => { const d = s.days[k]; return !!d && d.reviews + d.lessons + d.quizzes + d.pron > 0; };
  let t = Date.now(), n = 0;
  if (!active(dayKey(t))) t -= 86_400_000;
  while (active(dayKey(t))) { n += 1; t -= 86_400_000; }
  return n;
}

export const remember = (id: string) => update(s => { s.recent = [id, ...s.recent.filter(x => x !== id)].slice(0, 6); });
export function addCards(ids: string[]) {
  update(s => { const now = Date.now(); ids.forEach(id => { if (!s.srs[id]) s.srs[id] = { due: now, interval: 0, ease: 2.5, reps: 0, lapses: 0, last: 0 }; if (!s.leitner[id]) s.leitner[id] = newCard(now); }); });
}
export function review(id: string, g: Grade) {
  update(s => { s.srs[id] = schedule(s.srs[id], g); bump(s, 'reviews'); if (g !== 'again') bump(s, 'correct'); if (id.startsWith('v:') && s.srs[id].interval >= 6) s.known[id.slice(2)] = Date.now(); });
}
export const addLeitner = (ids: string[]) => update(s => { ids.forEach(id => { if (!s.leitner[id]) s.leitner[id] = newCard(); }); });
export const leitnerAnswer = (id: string, ok: boolean) => update(s => { s.leitner[id] = answer(s.leitner[id], ok); bump(s, 'reviews'); if (ok) bump(s, 'correct'); });
/* Saved words get id "m:<italian>" and join both review schedules. */
export const myId = (it: string) => it.trim().toLowerCase().replace(/\s+/g, ' ');
export function saveMyWord(w: { it: string; fa: string; en: string }) {
  const id = myId(w.it); if (!id) return;
  update(s => {
    s.mine[id] = { it: w.it.trim(), fa: w.fa.trim(), en: w.en.trim(), ts: s.mine[id]?.ts ?? Date.now() };
    const k = 'm:' + id, now = Date.now();
    if (!s.srs[k]) s.srs[k] = { due: now, interval: 0, ease: 2.5, reps: 0, lapses: 0, last: 0 };
    if (!s.leitner[k]) s.leitner[k] = newCard(now);
  });
}
export const deleteMyWord = (id: string) => update(s => { delete s.mine[id]; delete s.srs['m:' + id]; delete s.leitner['m:' + id]; });
export function markWord(id: string, knows: boolean) {
  update(s => {
    const key = 'v:' + id;
    s.srs[key] = schedule(s.srs[key], knows ? 'good' : 'again');
    bump(s, 'reviews'); if (knows) { bump(s, 'correct'); s.known[id] = Date.now(); } else delete s.known[id];
  });
}
export function completeLesson(id: string, score: number, total: number, cards: string[]) {
  update(s => {
    if (!s.lessons[id]) bump(s, 'lessons');
    s.lessons[id] = { ts: Date.now(), score, total };
    const now = Date.now();
    cards.forEach(c => { if (!s.srs[c]) s.srs[c] = { due: now, interval: 0, ease: 2.5, reps: 0, lapses: 0, last: 0 }; if (!s.leitner[c]) s.leitner[c] = newCard(now); });
  });
}
export function logPron(id: string, patch: { quiz?: number; self?: 'good' | 'ok' | 'practice' } = {}) {
  update(s => { const p = s.pron[id] ?? { reps: 0, ts: 0 }; s.pron[id] = { ...p, ...patch, reps: p.reps + 1, ts: Date.now() }; bump(s, 'pron'); });
}
export function logTest(id: string, title: string, kind: string, score: number, total: number, weak: string[]) {
  update(s => { s.tests.push({ id, title, kind, score, total, ts: Date.now(), weak }); bump(s, 'quizzes'); });
}
export const markDone = (id: string) => update(s => { s.done[id] = Date.now(); bump(s, 'quizzes'); });
export const setSettings = (p: Partial<Settings>) => update(s => { s.settings = { ...s.settings, ...p }; });
export const resetAll = () => { const k = state.settings; state = fresh(); state.settings = k; update(() => {}); };
export function importState(json: string): boolean {
  try { const n = normalize(JSON.parse(json)); if (!n) return false; state = n; update(() => {}); return true; } catch { return false; }
}

/* Study time: counts only while the page is visible and touched in the last minute. */
export function startStudyClock() {
  let last = Date.now(), pending = 0;
  const mark = () => { last = Date.now(); };
  ['pointerdown', 'keydown', 'scroll'].forEach(e => window.addEventListener(e, mark, { passive: true, capture: true }));
  const tick = () => {
    if (document.visibilityState === 'visible' && Date.now() - last < 60_000) pending += 15;
    if (pending >= 60) { const n = pending; pending = 0; update(s => bump(s, 'seconds', n)); }
  };
  window.setInterval(tick, 15_000);
}
