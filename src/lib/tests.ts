import type { Exercise, Level } from '../types';
import { LEVELS } from '../types';
import { VOCAB } from '../data/vocab';
import { GRAMMAR } from '../data/grammar';
import { TEXTS } from '../data/texts';
import { PRON } from '../data/pronunciation';
import { LISTENING, READING } from '../data/practice';
import { LESSONS } from '../data/course';
import { meaning } from '../i18n';
import { getState } from './store';

const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const take = <T,>(a: T[], n: number) => shuffle(a).slice(0, n);

function shuffleOpts(e: Exercise): Exercise {
  if (e.k !== 'mcq') return e;
  const o = shuffle(e.opts.map((t, i) => ({ t, i })));
  return { ...e, opts: o.map(x => x.t), a: o.findIndex(x => x.i === e.a) };
}
const upTo = (l: Level) => LEVELS.slice(0, LEVELS.indexOf(l) + 1);

export function vocabQuestions(level: Level, n: number): Exercise[] {
  const pool = VOCAB.filter(v => v.level === level);
  return take(pool, n).map(v => {
    const wrong = take(VOCAB.filter(x => x.fa !== v.fa), 2).map(meaning);
    return shuffleOpts({ k: 'mcq', q: `معنی {${v.it}} چیست؟`, opts: [meaning(v), ...wrong], a: 0, why: `{${v.it}} = ${meaning(v)}`, tag: 'واژگان' });
  });
}
const grammarPool = (l: Level) => GRAMMAR.filter(g => g.level === l).flatMap(g => g.ex);
export const grammarQuestions = (l: Level, n: number) => take(grammarPool(l), n).map(shuffleOpts);
export const listeningQuestions = (l: Level, n: number): Exercise[] => {
  const pool = LISTENING.filter(x => upTo(l).includes(x.level));
  return take(pool, n).map(x => ({ k: 'dict', it: x.dict, fa: x.dictFa, why: x.dictFa, tag: 'شنیداری' }));
};
export const readingQuestions = (l: Level, n: number) => take(READING.filter(r => r.level === l).flatMap(r => r.qs).concat(TEXTS.filter(t => t.level === l).flatMap(t => t.qs)), n).map(shuffleOpts);
export const sentenceQuestions = (l: Level, n: number): Exercise[] => take(GRAMMAR.filter(g => g.level === l).flatMap(g => g.examples).filter(e => e.it.split(' ').length <= 8), n)
  .map(e => ({ k: 'order', fa: e.fa, words: e.it.split(' '), why: `{${e.it}}`, tag: 'ساخت جمله' }));
export const translationQuestions = (l: Level, n: number): Exercise[] => take(VOCAB.filter(v => v.level === l), n)
  .map(v => ({ k: 'fill', q: { fa: `ایتالیایی «${v.fa}» را بنویسید.`, en: `Write the Italian for "${v.en}".`, it: `Scrivi in italiano: "${v.en}".` }[getState().settings.lang], a: [v.it], why: `{${v.it}}`, tag: 'ترجمه' }));
export const pronQuestions = (n: number) => take(PRON.flatMap(p => p.quiz), n).map(shuffleOpts);

export const TEST_KINDS: { id: string; title: string; note: string; build(l: Level): Exercise[] }[] = [
  { id: 'vocab', title: 'واژگان', note: '۸ پرسش', build: l => vocabQuestions(l, 8) },
  { id: 'grammar', title: 'دستور زبان', note: 'تا ۸ پرسش', build: l => grammarQuestions(l, 8) },
  { id: 'listening', title: 'شنیداری (املا)', note: 'به صدای مصنوعی نیاز دارد', build: l => listeningQuestions(l, 4) },
  { id: 'reading', title: 'درک مطلب', note: 'تا ۵ پرسش', build: l => readingQuestions(l, 5) },
  { id: 'sentence', title: 'ساخت جمله', note: 'تا ۶ پرسش', build: l => sentenceQuestions(l, 6) },
  { id: 'translation', title: 'ترجمه', note: '۶ پرسش', build: l => translationQuestions(l, 6) },
  { id: 'pron', title: 'قواعد تلفظ', note: 'دانش قواعد؛ نه ارزیابی صدای شما', build: () => pronQuestions(8) },
  { id: 'checkpoint', title: 'نقطهٔ بازبینی CEFR', note: 'آزمون تمرینی؛ گواهی رسمی CEFR نیست', build: l => shuffle([...vocabQuestions(l, 5), ...grammarQuestions(l, 6), ...sentenceQuestions(l, 3), ...readingQuestions(l, 2), ...listeningQuestions(l, 2)]) },
];

export function recommend(weak: string[]): { title: string; id: string } | null {
  for (const w of weak) {
    const g = GRAMMAR.find(x => x.ex.some(e => e.tag === w));
    if (g) return { title: g.title, id: g.id };
  }
  return null;
}
export const firstOpenLesson = (done: Record<string, unknown>) => LESSONS.find(l => !done[l.id]);
