// Data integrity: every cross-reference resolves and every exercise is answerable.
import { build } from 'esbuild';
const out = (await build({ stdin: { contents: `export * from './src/data/course';export * from './src/data/vocab';export * from './src/data/grammar';export * from './src/data/texts';export * from './src/data/pronunciation';export * from './src/data/practice';`, resolveDir: '.', loader: 'ts' }, bundle: true, write: false, format: 'esm' })).outputFiles[0].text;
const d = await import('data:text/javascript;base64,' + Buffer.from(out).toString('base64'));
const errs = [], ex = (e, w) => {
  if (e.k === 'mcq' && !(e.a >= 0 && e.a < e.opts.length)) errs.push(`bad answer ${w}`);
  if (e.k === 'mcq' && new Set(e.opts).size !== e.opts.length) errs.push(`dup opts ${w}`);
  if (e.k === 'fill' && !e.a.length) errs.push(`no answer ${w}`);
};
const dup = (a, n) => { const s = new Set(); a.forEach(x => { if (s.has(x)) errs.push(`dup ${n} ${x}`); s.add(x); }); };
dup(d.VOCAB.map(v => v.id), 'vocab'); dup(d.LESSONS.map(l => l.id), 'lesson'); dup(d.GRAMMAR.map(g => g.id), 'grammar'); dup(d.PRON.map(p => p.id), 'pron'); dup(d.TEXTS.map(t => t.id), 'text');
for (const v of d.VOCAB) { if (!v.fa || !v.exIt || !v.exFa || !v.ipa) errs.push(`incomplete ${v.id}`); if (!['A1','A2','B1','B2','C1'].includes(v.level)) errs.push(`level ${v.id}: ${v.level}`); }
for (const l of d.LESSONS) {
  l.grammar?.forEach(g => d.grammarById.has(g) || errs.push(`${l.id} grammar ${g}`));
  if (l.pron && !d.pronById.has(l.pron)) errs.push(`${l.id} pron`);
  if (l.text && !d.textById.has(l.text)) errs.push(`${l.id} text`);
  l.vocabIds?.forEach(v => d.vocabById.has(v) || errs.push(`${l.id} vocab ${v}`));
  if (!l.ex.length) errs.push(`${l.id} no exercises`);
  l.ex.forEach(e => ex(e, l.id));
}
d.COURSE.forEach(l => { l.grammar.forEach(g => d.grammarById.has(g) || errs.push(`${l.id} ${g}`)); l.pron.forEach(p => d.pronById.has(p) || errs.push(`${l.id} ${p}`)); });
for (const g of d.GRAMMAR) { if (!g.ex.length || !g.examples.length || !g.mistakes.length) errs.push(`thin ${g.id}`); g.ex.forEach(e => ex(e, g.id)); }
for (const p of d.PRON) { if (p.examples.length < 3) errs.push(`few examples ${p.id}`); if (!p.quiz.length) errs.push(`no quiz ${p.id}`); p.quiz.forEach(e => ex(e, p.id)); }
for (const t of d.TEXTS) { t.grammar.forEach(g => d.grammarById.has(g) || errs.push(`${t.id} ${g}`)); t.qs.forEach(e => ex(e, t.id)); t.lines.forEach(l => { if (!l.it || !l.fa) errs.push(`line ${t.id}`); });
  const miss = t.lines.flatMap(l => l.it.split(' ')).map(w => w.toLowerCase().replace(/^[«"(]+|[.,!?;:»")]+$/g, '')).filter(w => !t.gloss[w] && !d.VOCAB.some(v => v.it.toLowerCase() === w));
  if (miss.length) console.log(`  unglossed in ${t.id}: ${[...new Set(miss)].join(' ')}`); }
for (const x of d.READING) d.textById.has(x.textId) || errs.push(x.id);
for (const x of d.LISTENING) { const full = x.lines.map(l => l.it).join(' '); if (!full.includes(x.gap.a)) errs.push(`gap ${x.id}`); }
const raw = (await build({ entryPoints: ['src/i18n/strings.txt.ts'], bundle: true, write: false, format: 'esm' })).outputFiles[0].text;
const { RAW } = await import('data:text/javascript;base64,' + Buffer.from(raw).toString('base64'));
const keys = new Set(RAW.trim().split('\n').map(l => { const p = l.split('|'); if (p.length !== 3) errs.push('bad i18n line: ' + l.slice(0, 40)); return p[0]; }));
[...d.LESSONS, ...d.GRAMMAR, ...d.PRON, ...d.TEXTS, ...d.LISTENING, ...d.SPEAKING, ...d.READING, ...d.WRITING].map(x => x.title)
  .concat(d.COURSE.flatMap(l => [l.title, ...l.modules.flatMap(m => [m.title, ...(m.planned ?? []).map(p => p.title)])]), Object.values(d.TOPICS), d.PRON_GROUPS)
  .filter(t => /[\u0600-\u06FF]/.test(t) && !keys.has(t)).forEach(t => errs.push('untranslated title: ' + t));
console.log({ vocab: d.VOCAB.length, lessons: d.LESSONS.length, A1: d.LESSONS.filter(l => l.level === 'A1').length, grammar: d.GRAMMAR.length, pron: d.PRON.length, texts: d.TEXTS.length, listening: d.LISTENING.length, speaking: d.SPEAKING.length, reading: d.READING.length, writing: d.WRITING.length });
console.log(errs.length ? errs.join('\n') : 'content OK'); process.exit(errs.length ? 1 : 0);
