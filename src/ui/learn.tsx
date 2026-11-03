import React, { useEffect, useMemo, useState } from 'react';
import { LEVELS, type Level, type Lesson, type StudyText, type Vocab } from '../types';
import { COURSE, lessonById } from '../data/course';
import { VOCAB, TOPICS, nounWithArticle, vocabById } from '../data/vocab';
import { GRAMMAR, grammarById } from '../data/grammar';
import { TEXTS, textById } from '../data/texts';
import { PRON, PRON_GROUPS, pronById } from '../data/pronunciation';
import { meaning, tr } from '../i18n';
import { addCards, completeLesson, logPron, logTest, markDone, markWord, remember, useApp } from '../lib/store';
import { AudioNote, Label, Play, PlayBoth, Quiz, QuizSummary, type QuizResult, Recorder, Rich, Row, Sec, Sheet, Table, fa, useLinePlayer, useNav } from './core';

/* ---- course ---- */
export function Course() {
  const { go } = useNav(); const s = useApp();
  return <>{COURSE.map(l => {
    const lessons = l.modules.flatMap(m => m.lessons), n = lessons.filter(x => s.lessons[x.id]).length;
    return <Row key={l.id} title={<><span className="cefr">{l.id}</span> {l.title}</>} sub={`${fa(n)} از ${fa(lessons.length)} درس آماده کامل شده`} onClick={() => go({ s: 'level', p: l.id })} />;
  })}<p className="muted"><Label k="ai" /> همهٔ محتوای درسی با هوش مصنوعی نوشته شده و هنوز توسط مدرس انسانی بازبینی نشده است.</p></>;
}

export function LevelView({ id }: { id: Level }) {
  const l = COURSE.find(x => x.id === id)!; const { go } = useNav(); const s = useApp();
  return <>
    <p>{l.summary}</p>
    <Sec title="هدف‌ها"><ul style={{ margin: 0, paddingInlineStart: 20 }}>{l.objectives.map(o => <li key={o}>{o}</li>)}</ul></Sec>
    {l.modules.map(m => <Sec key={m.title} title={m.title}><div className="list">
      {m.lessons.map(x => <Row key={x.id} title={x.title} sub={<bdi dir="ltr" className="it">{x.it}</bdi>} left={s.lessons[x.id] ? <span className="badge ok">کامل</span> : undefined} onClick={() => go({ s: 'lesson', p: x.id })} />)}
      {m.planned?.map(p => <Row key={p.title} off title={<Rich t={p.title} plain />} sub="برنامه‌ریزی شده؛ محتوا هنوز نوشته نشده" />)}
    </div></Sec>)}
    <Sec title="نقشهٔ سطح"><div className="card">
      <p><b>موضوعات واژگان:</b> {l.themes.join('، ')}</p>
      <p><b>دستور:</b> {l.grammar.map(g => grammarById.get(g)!.title).join('، ')}</p>
      {l.pron.length > 0 && <p><b>تلفظ:</b> {l.pron.map(p => pronById.get(p)!.title).join('، ')}</p>}
      <p><b>شنیدن:</b> {l.listening}</p><p><b>گفتار:</b> {l.speaking}</p><p><b>خواندن:</b> {l.reading}</p><p><b>نوشتن:</b> {l.writing}</p>
      <button className="btn ghost" onClick={() => go({ s: 'tests', p: id })}>آزمون‌های این سطح</button>
    </div></Sec>
  </>;
}

const lessonVocab = (l: Lesson): Vocab[] => l.vocabIds ? l.vocabIds.map(i => vocabById.get(i)!).filter(Boolean)
  : VOCAB.filter(v => l.topics?.includes(v.topic) && v.level === l.level).slice(0, l.vocabLimit ?? 12);

export function LessonView({ id }: { id: string }) {
  const l = lessonById.get(id)!; const { go, back } = useNav(); const s = useApp();
  const [res, setRes] = useState<QuizResult | null>(null);
  useEffect(() => remember(id), [id]);
  const vocab = lessonVocab(l), done = s.lessons[id], g = l.grammar?.map(x => grammarById.get(x)!) ?? [], pron = l.pron ? pronById.get(l.pron) : undefined, text = l.text ? textById.get(l.text) : undefined;
  const finish = (r: QuizResult) => {
    setRes(r);
    completeLesson(id, r.score, r.total, [...vocab.map(v => 'v:' + v.id), ...g.map(x => 'g:' + x.id), ...(pron ? ['p:' + pron.id] : [])]);
  };
  return <>
    <div className="card"><p className="it-line">{l.it}</p><p><b>هدف:</b> {l.goal}</p><p><Rich t={l.intro} /></p><Label k="ai" />{tr('توضیح درس‌ها فعلاً به فارسی است.') !== 'توضیح درس‌ها فعلاً به فارسی است.' && <p className="notice info">توضیح درس‌ها فعلاً به فارسی است.</p>}{done && <p className="muted small">قبلاً کامل شده: {fa(done.score)} از {fa(done.total)}</p>}</div>
    {pron && <Sec title={'تلفظ: ' + pron.title}><Row title="باز کردن درس تلفظ" sub={pron.ipa} onClick={() => go({ s: 'pron', p: pron.id })} /></Sec>}
    {vocab.length > 0 && <Sec title="واژگان این درس" side={<span className="muted small">پس از پایان به مرور اضافه می‌شود</span>}><div className="list">
      {vocab.map(v => <Row key={v.id} title={<bdi dir="ltr" className="it">{nounWithArticle(v)}</bdi>} sub={meaning(v)} onClick={() => go({ s: 'word', p: v.id })} />)}
    </div></Sec>}
    {g.map(x => <Sec key={x.id} title={'دستور: ' + x.title}><GrammarBody id={x.id} /></Sec>)}
    {text && <Sec title="متن درس"><Row title={text.title} sub={<bdi dir="ltr" className="it">{text.it}</bdi>} onClick={() => go({ s: 'text', p: text.id })} /></Sec>}
    <Sec title="تمرین پایانی">
      {res ? <><QuizSummary r={res} /><p className="notice good" role="status">درس کامل شد و واژه‌هایش به صف مرور اضافه شد.</p><button className="btn wide" onClick={back}>بازگشت</button></>
        : <Quiz items={l.ex} onDone={finish} finishLabel="تکمیل درس" />}
    </Sec>
  </>;
}

/* ---- grammar ---- */
export function GrammarList() {
  const { go } = useNav(); const s = useApp();
  return <>{LEVELS.map(l => <Sec key={l} title={l}><div className="list">{GRAMMAR.filter(g => g.level === l).map(g =>
    <Row key={g.id} title={g.title} sub={<bdi dir="ltr" className="it">{g.it}</bdi>} left={s.done['g-' + g.id] ? <span className="badge ok">انجام شد</span> : undefined} onClick={() => go({ s: 'grammar', p: g.id })} />)}</div></Sec>)}</>;
}
function GrammarBody({ id }: { id: string }) {
  const g = grammarById.get(id)!;
  return <div className="card">
    <p><Rich t={g.what} /></p><p><b>کاربرد:</b> <Rich t={g.when} /></p>
    {g.table && <Table head={g.table.head} rows={g.table.rows} />}
    <h3>قواعد</h3><ul style={{ margin: 0, paddingInlineStart: 20 }}>{g.rules.map(r => <li key={r}><Rich t={r} /></li>)}</ul>
    <h3>نمونه‌ها</h3>{g.examples.map(e => <div key={e.it}><p className="it-line">{e.it}</p><p className="muted">{e.kind && <>({e.kind}) </>}{e.fa}</p><Play t={e.it} /></div>)}
    <h3>اشتباه‌های رایج</h3>{g.mistakes.map(k => <div key={k.bad} className="notice info"><s className="it" dir="ltr">{k.bad}</s> ← <bdi dir="ltr" className="it">{k.good}</bdi><br /><Rich t={k.why} /></div>)}
    {g.compare && <p><b>مقایسه:</b> <Rich t={g.compare} /></p>}
  </div>;
}
export function GrammarView({ id }: { id: string }) {
  const g = grammarById.get(id)!; const [r, setR] = useState<QuizResult | null>(null);
  return <><p className="it-line">{g.it}</p><Label k="ai" /><GrammarBody id={id} /><Sec title="تمرین">
    {r ? <QuizSummary r={r} /> : <Quiz items={g.ex} onDone={x => { setR(x); markDone('g-' + id); addCards(['g:' + id]); logTest('g-' + id, g.title, 'grammar', x.score, x.total, x.weak); }} />}
  </Sec></>;
}

/* ---- pronunciation ---- */
export function PronList() {
  const { go } = useNav(); const s = useApp();
  const n = PRON.filter(p => s.pron[p.id]).length;
  return <><p className="muted">{fa(n)} از {fa(PRON.length)} قاعده تمرین شده. نویسهٔ فارسی فقط تقریبی است.</p>
    <AudioNote />
    {PRON_GROUPS.map(g => <Sec key={g} title={g}><div className="list">{PRON.filter(p => p.group === g).map(p =>
      <Row key={p.id} title={p.title} sub={p.ipa} left={s.pron[p.id] ? <span className="badge ok">{fa(s.pron[p.id].reps)} تمرین</span> : undefined} onClick={() => go({ s: 'pron', p: p.id })} />)}</div></Sec>)}
    <p className="muted small">صدای ضبط‌شدهٔ گویشور بومی در این نسخه نیست، چون فایلی با مجوز تأییدشده اضافه نشده است.</p></>;
}
export function PronView({ id }: { id: string }) {
  const p = pronById.get(id)!; const s = useApp();
  const [pick, setPick] = useState(p.examples[0].it);
  const [r, setR] = useState<QuizResult | null>(null);
  const self = s.pron[id]?.self;
  return <>
    <div className="card"><h3>دهان و زبان</h3><p><Rich t={p.mouth} /></p>{p.ipa && <p className="ipa">{p.ipa}</p>}{p.diff && <p className="notice info"><Rich t={p.diff} /></p>}</div>
    <Sec title="نمونه‌ها"><AudioNote /><div className="list">{p.examples.map(e => <div key={e.it} className="row" style={{ cursor: 'default', flexWrap: 'wrap' }}>
      <span className="grow"><bdi dir="ltr" className="it" style={{ fontSize: '1.15rem' }}>{e.it}</bdi><span className="ipa small" dir="ltr">/{e.ipa}/</span><span className="muted small">{e.fa}{s.settings.showTranslit && <> · تقریبی: {e.tr}</>}</span></span>
      <span className="btns"><PlayBoth t={e.it} /><button className="btn ghost sm" aria-pressed={pick === e.it} onClick={() => setPick(e.it)}>{pick === e.it ? 'انتخاب‌شده' : 'تمرین'}</button></span>
    </div>)}</div></Sec>
    {p.pairs && <Sec title="جفت‌های مقایسه‌ای"><div className="list">{p.pairs.map(([a, b]) => <div key={a} className="row" style={{ cursor: 'default', justifyContent: 'space-between' }}>
      <Rich t={a} plain /><Rich t={b} plain /><span className="btns"><Play t={a.replace(/ *\(.*$/, '')} label="۱" /><Play t={b.replace(/ *\(.*$/, '')} label="۲" /></span></div>)}</div></Sec>}
    <Sec title="اشتباه رایج فارسی‌زبانان"><p className="notice"><Rich t={p.errors} /></p></Sec>
    <Sec title={'تکرار: ' + pick}><Recorder reference={pick} onRecorded={() => logPron(id)} />
      <div className="card"><h3>خودارزیابی</h3><p className="muted small">این نظر خود شماست و نمرهٔ دستگاه نیست.</p>
        <div className="btns">{([['good', 'شبیه مرجع بود'], ['ok', 'نزدیک بود'], ['practice', 'تمرین لازم دارد']] as const).map(([k, t]) =>
          <button key={k} className="chip" aria-pressed={self === k} onClick={() => logPron(id, { self: k })}>{t}</button>)}</div></div>
    </Sec>
    <Sec title="آزمونک">{r ? <QuizSummary r={r} /> : <Quiz items={p.quiz} onDone={x => { setR(x); logPron(id, { quiz: x.score / x.total }); addCards(['p:' + id]); }} />}</Sec>
  </>;
}

/* ---- vocabulary ---- */
const isDue = (s: ReturnType<typeof useApp>, id: string) => (s.srs['v:' + id]?.due ?? Infinity) <= Date.now();
export function VocabLab() {
  const { go } = useNav(); const s = useApp();
  const [q, setQ] = useState(''); const [topic, setTopic] = useState(''); const [lvl, setLvl] = useState<Level | ''>('');
  const list = VOCAB.filter(v => (!topic || v.topic === topic) && (!lvl || v.level === lvl) && (!q || (v.it + v.fa + v.en).toLowerCase().includes(q.toLowerCase())));
  return <>
    <div className="stats" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
      <div className="stat"><b>{fa(VOCAB.length)}</b><span>کل واژه‌ها</span></div>
      <div className="stat"><b>{fa(Object.keys(s.known).length)}</b><span>یادگرفته</span></div>
      <div className="stat"><b>{fa(VOCAB.filter(v => isDue(s, v.id)).length)}</b><span>برای مرور</span></div>
    </div>
    <button className="btn wide" disabled={!list.length} onClick={() => go({ s: 'flash', p: { topic, lvl, q } })}>فلش‌کارت با {fa(Math.min(list.length, 20))} واژه از این فهرست</button>
    <input id="vocab-search" className="field" type="search" placeholder="جست‌وجو به ایتالیایی، فارسی یا انگلیسی" aria-label="جست‌وجو" value={q} onChange={e => setQ(e.target.value)} />
    <div className="chips"><button className="chip" aria-pressed={!lvl} onClick={() => setLvl('')}>همهٔ سطح‌ها</button>{LEVELS.map(l => <button key={l} className="chip" aria-pressed={lvl === l} onClick={() => setLvl(l)}>{l}</button>)}</div>
    <div className="chips"><button className="chip" aria-pressed={!topic} onClick={() => setTopic('')}>همهٔ موضوعات</button>{Object.entries(TOPICS).map(([k, t]) => <button key={k} className="chip" aria-pressed={topic === k} onClick={() => setTopic(k)}>{t}</button>)}</div>
    {list.length ? <div className="list">{list.map(v => <Row key={v.id} title={<bdi dir="ltr" className="it">{nounWithArticle(v)}</bdi>} sub={meaning(v)} left={<span className="badge">{v.level}</span>} onClick={() => go({ s: 'word', p: v.id })} />)}</div>
      : <p className="notice info">واژه‌ای پیدا نشد. جست‌وجو یا فیلترها را تغییر دهید.</p>}
  </>;
}
export function WordView({ id }: { id: string }) {
  const v = vocabById.get(id)!; const s = useApp(); const { go } = useNav();
  const rel = v.rel.map(r => VOCAB.find(x => x.it === r)).filter(Boolean) as Vocab[];
  return <>
    <div className="card"><p className="it-line" style={{ fontSize: '1.6rem' }}>{nounWithArticle(v)}</p>{v.ipa && <p className="ipa" dir="ltr">/{v.ipa}/</p>}
      <p>{meaning(v)}{s.settings.lang === 'fa' && s.settings.showEnglish && <span className="muted"> · {v.en}</span>}</p>
      <p className="muted small">{v.pos}{v.g && <> · {v.g === 'm' ? 'مذکر' : 'مؤنث'}</>}{v.pl && <> · جمع: <bdi dir="ltr" className="it">{v.pl}</bdi></>} · {TOPICS[v.topic]}</p>
      <PlayBoth t={v.it} /><span><span className="badge">{v.level}</span> <Label k="ai" /></span></div>
    <Sec title="نمونه"><div className="card"><p className="it-line">{v.exIt}</p><p className="muted">{v.exFa}</p><PlayBoth t={v.exIt} /></div></Sec>
    {v.verb && <Sec title="صرف حال"><Table head={['io', 'tu', 'lui', 'noi', 'voi', 'loro']} rows={[[v.verb.io, v.verb.tu, v.verb.lui, v.verb.noi, v.verb.voi, v.verb.loro]]} />{v.verb.pp && <p className="muted">صفت مفعولی: <bdi dir="ltr" className="it">{v.verb.pp}</bdi></p>}</Sec>}
    {v.col.length > 0 && <Sec title="همنشین‌ها"><div className="chips" dir="ltr">{v.col.map(c => <span key={c} className="chip word">{c}</span>)}</div></Sec>}
    {rel.length > 0 && <Sec title="واژه‌های مرتبط"><div className="list">{rel.map(r => <Row key={r.id} title={<bdi dir="ltr" className="it">{r.it}</bdi>} sub={meaning(r)} onClick={() => go({ s: 'word', p: r.id })} />)}</div></Sec>}
    <button className="btn ghost" onClick={() => go({ s: 'dict', p: v.it })}>جست‌وجو در فرهنگ لغت</button>
    <div className="btns"><button className="btn" onClick={() => markWord(id, true)}>بلدم</button><button className="btn ghost" onClick={() => markWord(id, false)}>نیاز به تمرین</button></div>
    {s.srs['v:' + id] && <p className="muted small" role="status">این واژه در برنامهٔ مرور است.</p>}
  </>;
}
export function Flashcards({ filter }: { filter: { topic: string; lvl: string; q: string } }) {
  const { back } = useNav(); const s = useApp();
  const deck = useMemo(() => VOCAB.filter(v => (!filter.topic || v.topic === filter.topic) && (!filter.lvl || v.level === filter.lvl) && (!filter.q || (v.it + v.fa + v.en).toLowerCase().includes(filter.q.toLowerCase())))
    .sort((a, b) => Number(!!s.known[a.id]) - Number(!!s.known[b.id])).slice(0, 20), []);
  const [i, setI] = useState(0), [flip, setFlip] = useState(false), [dir, setDir] = useState<'it' | 'fa'>('it');
  const v = deck[i];
  if (!v) return <><p className="notice good">دور فلش‌کارت تمام شد. {fa(deck.length)} واژه را دیدید.</p><button className="btn wide" onClick={back}>بازگشت</button></>;
  const act = (k: boolean) => { markWord(v.id, k); setFlip(false); setI(i + 1); };
  return <>
    <div className="chips"><button className="chip" aria-pressed={dir === 'it'} onClick={() => { setDir('it'); setFlip(false); }}>ایتالیایی ← فارسی</button><button className="chip" aria-pressed={dir === 'fa'} onClick={() => { setDir('fa'); setFlip(false); }}>فارسی ← ایتالیایی</button></div>
    <p className="muted small">کارت {fa(i + 1)} از {fa(deck.length)}</p>
    <button className="card flash" style={{ width: '100%', color: 'inherit' }} onClick={() => setFlip(!flip)} aria-label="برگرداندن کارت">
      {dir === 'it' || flip ? <span className="big">{nounWithArticle(v)}</span> : <span className="big fa">{meaning(v)}</span>}
      {flip && <><span className={dir === 'it' ? 'big fa' : 'ipa'}>{dir === 'it' ? meaning(v) : v.ipa}</span><span className="it">{v.exIt}</span><span className="muted">{v.exFa}</span></>}
      {!flip && <span className="muted small">برای دیدن پاسخ لمس کنید</span>}
    </button>
    <PlayBoth t={v.it} />
    {flip && <div className="btns"><button className="btn" style={{ flex: 1 }} onClick={() => act(true)}>بلدم</button><button className="btn ghost" style={{ flex: 1 }} onClick={() => act(false)}>نیاز به تمرین</button></div>}
  </>;
}

/* ---- sentence & paragraph studio ---- */
export function Studio() {
  const { go } = useNav(); const s = useApp();
  return <>{LEVELS.map(l => { const list = TEXTS.filter(t => t.level === l); return <Sec key={l} title={l}><div className="list">
    {list.map(t => <Row key={t.id} title={t.title} sub={<><bdi dir="ltr" className="it">{t.it}</bdi> · {t.kind}</>} left={s.done['t-' + t.id] ? <span className="badge ok">انجام شد</span> : undefined} onClick={() => go({ s: 'text', p: t.id })} />)}</div></Sec>; })}</>;
}
const clean = (w: string) => w.toLowerCase().replace(/^[«"(]+|[.,!?;:»")]+$/g, '').replace(/’/g, "'");
export function lookup(t: StudyText, w: string) {
  const k = clean(w);
  const v = VOCAB.find(x => x.it.toLowerCase() === k || x.pl?.toLowerCase() === k || (x.verb && Object.values(x.verb).includes(k)));
  return { gloss: t.gloss[k], v };
}
export function TextBody({ t }: { t: StudyText }) {
  const { go } = useNav();
  const [tr, setTr] = useState(true), [wbw, setWbw] = useState(false), [word, setWord] = useState('');
  const lines = t.lines.map(l => l.it), p = useLinePlayer(lines);
  const hit = word ? lookup(t, word) : null;
  return <>
    <div className="chips"><button className="chip" aria-pressed={tr} onClick={() => setTr(!tr)}>ترجمهٔ فارسی</button><button className="chip" aria-pressed={wbw} onClick={() => setWbw(!wbw)}>کلمه‌به‌کلمه</button></div>
    <div className="btns"><button className="btn sm" onClick={() => p.play(false)}>پخش همه</button><button className="btn ghost sm" onClick={() => p.play(true)}>پخش آهسته</button>{p.active >= 0 && <button className="btn danger sm" onClick={p.halt}>توقف</button>}</div>
    <AudioNote />
    <div className="card">{t.lines.map((l, i) => <div key={i} className={'line' + (p.active === i ? ' on' : '')}>
      {l.sp && <span className="sp">{l.sp}</span>}
      <p className="it-line" lang="it">{l.it.split(' ').map((w, j) => wbw
        ? <span key={j} className="wbw"><button className="w" onClick={() => setWord(w)}>{w}</button><small>{lookup(t, w).gloss ?? lookup(t, w).v?.fa ?? '—'}</small></span>
        : <React.Fragment key={j}><button className="w" onClick={() => setWord(w)}>{w}</button>{' '}</React.Fragment>)}</p>
      {tr && <p className="muted">{l.fa}</p>}
      <span className="btns"><Play t={l.it} label="این جمله" /><Play t={l.it} slow label="آهسته" /></span>
    </div>)}</div>
    {word && <Sheet onClose={() => setWord('')}>
      <p className="it-line" style={{ fontSize: '1.5rem' }}>{clean(word)}</p>
      {hit?.gloss && <p><b>معنی و نقش:</b> {hit.gloss}</p>}
      {hit?.v && <><p>{meaning(hit.v)} · <span className="muted">{hit.v.pos}</span></p>{hit.v.ipa && <p className="ipa" dir="ltr">/{hit.v.ipa}/</p>}<p className="it-line">{hit.v.exIt}</p><p className="muted">{hit.v.exFa}</p></>}
      {!hit?.gloss && !hit?.v && <p className="notice info">توضیحی برای این شکل واژه ثبت نشده است.</p>}
      <Play t={clean(word)} /><button className="btn ghost" onClick={() => { const w = clean(word); setWord(''); go({ s: 'dict', p: w }); }}>جست‌وجو در فرهنگ لغت</button>
    </Sheet>}
  </>;
}
export function TextView({ id }: { id: string }) {
  const t = textById.get(id)!; const { go } = useNav();
  const [r, setR] = useState<QuizResult | null>(null), [i, setI] = useState(0), [show, setShow] = useState(false);
  const words = useMemo(() => { const seen = new Set<string>(); return t.lines.flatMap(l => l.it.split(' ')).map(w => lookup(t, w).v).filter((v): v is Vocab => !!v && !seen.has(v.id) && !!seen.add(v.id)); }, [id]);
  const line = t.lines[i];
  return <>
    <p className="muted"><span className="badge">{t.level}</span> {t.kind} · <Label k="ai" /></p>
    <TextBody t={t} />
    {words.length > 0 && <Sec title="واژه‌های استخراج‌شده" side={<button className="btn ghost sm" onClick={() => addCards(words.map(v => 'v:' + v.id))}>افزودن همه به مرور</button>}>
      <div className="list">{words.map(v => <Row key={v.id} title={<bdi dir="ltr" className="it">{v.it}</bdi>} sub={meaning(v)} onClick={() => go({ s: 'word', p: v.id })} />)}</div></Sec>}
    <Sec title="ساختار دستوری"><div className="list">{t.grammar.map(g => <Row key={g} title={grammarById.get(g)!.title} onClick={() => go({ s: 'grammar', p: g })} />)}</div></Sec>
    <Sec title="تمرین ترجمه"><div className="card"><p>{line.fa}</p>
      <textarea id={`tr-${id}`} className="field" dir="ltr" aria-label="ترجمهٔ شما به ایتالیایی" placeholder="به ایتالیایی بنویسید" />
      {show && <p className="it-line">{line.it}</p>}
      <div className="btns"><button className="btn ghost" onClick={() => setShow(true)}>نمایش جملهٔ اصلی</button><button className="btn ghost" onClick={() => { setI((i + 1) % t.lines.length); setShow(false); }}>جملهٔ بعدی</button></div></div></Sec>
    <Sec title="گفتار سایه‌ای"><p className="it-line">{line.it}</p><Recorder reference={line.it} /><button className="btn ghost" onClick={() => addCards([`t:${id}:${i}`])}>افزودن این جمله به مرور</button></Sec>
    <Sec title="درک مطلب">{r ? <QuizSummary r={r} /> : <Quiz items={t.qs} onDone={x => { setR(x); markDone('t-' + id); logTest('t-' + id, t.title, 'reading', x.score, x.total, x.weak); }} />}</Sec>
  </>;
}
