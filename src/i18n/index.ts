import { RAW } from './strings.txt';
import { getState } from '../lib/store';
import type { Vocab } from '../types';

export type Lang = 'fa' | 'en' | 'it';
const TOKEN = /\{[^}]*\}|[0-9۰-۹٠-٩]+/g;
const PERSIAN = /[؀-ۿ]/;
const DICT = new Map<string, [string, string]>();
for (const line of RAW.trim().split('\n')) {
  const [f, en, it] = line.split('|');
  if (f && en && it) DICT.set(f, [en, it]);
}
export const keyOf = (s: string) => s.replace(TOKEN, '#');
export const hasKey = (s: string) => DICT.has(s) || DICT.has(keyOf(s));

function lookup(s: string, i: 0 | 1): string | undefined {
  const exact = DICT.get(s);
  if (exact) return exact[i];
  const vals = s.match(TOKEN);
  const hit = DICT.get(keyOf(s));
  if (!hit || !vals) return undefined;
  let n = 0;
  return hit[i].replace(/#/g, () => (vals[n++] ?? '#').replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))));
}

/** Translates Persian UI text. Text with no entry, such as lesson explanations, stays as written. */
export function tr(s: string): string {
  const lang = getState().settings.lang;
  if (lang === 'fa' || !PERSIAN.test(s)) return s;
  const i = lang === 'en' ? 0 : 1;
  const core = s.trim();
  const out = lookup(core, i) ?? splitLookup(core, i);
  return out === undefined ? s : s.replace(core, () => out);
}
function splitLookup(s: string, i: 0 | 1): string | undefined {
  for (const sep of [': ', '، ']) {
    if (!s.includes(sep)) continue;
    const parts = s.split(sep);
    const mapped = parts.map((p, n) => (PERSIAN.test(p) ? lookup(n < parts.length - 1 && sep === ': ' ? p + ':' : p, i) ?? (sep === ': ' ? lookup(p, i) : undefined) : p));
    if (mapped.every(Boolean)) return mapped.join(sep === ': ' ? ' ' : ', ').replace(/::/g, ':');
  }
  return undefined;
}
export const isRtl = () => getState().settings.lang === 'fa';
export const meaning = (v: Pick<Vocab, 'fa' | 'en'>) => (getState().settings.lang === 'fa' ? v.fa : v.en);
export const LANG_NAMES: Record<Lang, string> = { fa: 'فارسی\u200e', /* the mark keeps this name out of the dictionary so it always shows in Persian */ en: 'English', it: 'Italiano' };
