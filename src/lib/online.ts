import { inArtifact } from './platform';

export type Target = 'fa' | 'en';
const KEY = 'ils.googleKey';
/* Kept apart from app state so it never enters backups or account sync. */
export const getGoogleKey = () => { try { return localStorage.getItem(KEY) ?? ''; } catch { return ''; } };
export const setGoogleKey = (k: string) => { try { if (k) localStorage.setItem(KEY, k); else localStorage.removeItem(KEY); } catch { /* unavailable */ } };

/** Artifact pages cannot reach outside hosts; the web and iOS builds can. */
export const canCallOut = () => !inArtifact();

export const googleLink = (t: string, to: Target) => `https://translate.google.com/?sl=it&tl=${to}&text=${encodeURIComponent(t)}&op=translate`;
export const wiktionaryLink = (w: string) => `https://en.wiktionary.org/wiki/${encodeURIComponent(w.trim().toLowerCase())}#Italian`;
export const treccaniLink = (w: string) => `https://www.treccani.it/vocabolario/ricerca/${encodeURIComponent(w.trim().toLowerCase())}/`;

const text = (html: string) => new DOMParser().parseFromString(html, 'text/html').body.textContent?.trim() ?? '';
export interface Sense { pos: string; defs: string[] }

export async function wiktionary(word: string): Promise<Sense[]> {
  const r = await fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word.trim().toLowerCase())}`);
  if (r.status === 404) return [];
  if (!r.ok) throw new Error('network');
  const d = await r.json();
  return (d.it ?? []).map((s: any) => ({ pos: String(s.partOfSpeech ?? ''), defs: (s.definitions ?? []).map((x: any) => text(String(x.definition ?? ''))).filter(Boolean).slice(0, 6) })).filter((s: Sense) => s.defs.length);
}
export async function myMemory(q: string, to: Target): Promise<string> {
  const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q.slice(0, 500))}&langpair=it|${to}`);
  if (r.status === 429) throw new Error('quota');
  if (!r.ok) throw new Error('network');
  const d = await r.json();
  if (d.quotaFinished || Number(d.responseStatus) === 429) throw new Error('quota');
  if (Number(d.responseStatus) !== 200) throw new Error('network');
  return text(String(d.responseData?.translatedText ?? ''));
}
export async function google(q: string, to: Target, key: string): Promise<string> {
  /* A refused request reaches the page as a bare network error, so being online points to Google's refusal. */
  const r = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(key)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q, source: 'it', target: to, format: 'text' }) })
    .catch(() => { throw new Error(navigator.onLine ? 'key' : 'network'); });
  if (r.status === 400 || r.status === 403) throw new Error('key');
  if (!r.ok) throw new Error('network');
  return String((await r.json()).data?.translations?.[0]?.translatedText ?? '');
}
