import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LEVELS, type Exercise, type Grade, type Level } from '../types';
import { LISTENING, READING, SPEAKING, WRITING } from '../data/practice';
import { textById } from '../data/texts';
import { meaning } from '../i18n';
import { vocabById, nounWithArticle } from '../data/vocab';
import { grammarById } from '../data/grammar';
import { pronById } from '../data/pronunciation';
import { TEST_KINDS, recommend } from '../lib/tests';
import { dueQueue, intervalLabel } from '../lib/srs';
import { capability } from '../lib/platform';
import { getState, logPron, logTest, markDone, review, update, useApp } from '../lib/store';
import { AudioNote, Label, Play, PlayBoth, Quiz, QuizSummary, type QuizResult, Recorder, Rich, Row, Sec, fa, useLinePlayer, useNav } from './core';
import { TextBody } from './learn';

/* ---- Claude access: present only where the runtime grants it ---- */
export const useSample = () => { const [s, set] = useState<any>(undefined); useEffect(() => { capability('sample').then(fn => set(() => fn)); }, []); return s; };
const AI_ERR: Record<string, string> = {
  not_granted: 'اجازهٔ استفاده از Claude داده نشد.', sampling_disabled: 'Claude برای این حساب در دسترس نیست.', rate_limited: 'محدودیت استفاده پر شده است. کمی بعد دوباره تلاش کنید.',
  session_expired: 'دوباره وارد حساب Claude شوید.', refused: 'Claude به این درخواست پاسخ نداد. متن را تغییر دهید.',
};
export const aiError = (e: any) => AI_ERR[e?.code] ?? 'ارتباط با Claude ناموفق بود. دوباره تلاش کنید.';
const NoAI = () => <p className="notice">این بخش در نسخهٔ نصب‌شده در دسترس نیست، چون کلید API نباید در برنامهٔ سمت کاربر قرار گیرد. برای استفاده از آن، نسخهٔ Artifact را در claude.ai باز کنید.</p>;

/* ---- listening ---- */
const levelList = <T extends { level: Level }>(items: T[]) => LEVELS.map(l => [l, items.filter(i => i.level === l)] as const).filter(([, v]) => v.length);
export function ListeningList() {
  const { go } = useNav(); const s = useApp();
  return <><AudioNote />{levelList(LISTENING).map(([l, v]) => <Sec key={l} title={l}><div className="list">{v.map(x => <Row key={x.id} title={x.title} left={s.done[x.id] ? <span className="badge ok">انجام شد</span> : undefined} onClick={() => go({ s: 'listen', p: x.id })} />)}</div></Sec>)}</>;
}
export function ListenView({ id }: { id: string }) {
  const x = LISTENING.find(l => l.id === id)!;
  const [stage, setStage] = useState(0); const [r, setR] = useState<QuizResult | null>(null);
  const p = useLinePlayer(x.lines.map(l => l.it));
  const items: Exercise[] = useMemo(() => [...x.qs, { k: 'fill', q: `${x.gap.before} ___ ${x.gap.after}`, a: [x.gap.a], why: `واژهٔ جاافتاده: {${x.gap.a}}`, tag: 'شنیداری' }, { k: 'dict', it: x.dict, fa: x.dictFa, why: `ترجمه: ${x.dictFa}`, tag: 'شنیداری' }], [id]);
  return <>
    <AudioNote />
    <div className="card"><h3>۱. بدون متن گوش دهید</h3><div className="btns"><button className="btn sm" onClick={() => p.play(false)}>پخش</button><button className="btn ghost sm" onClick={() => p.play(true)}>پخش آهسته</button>{p.active >= 0 && <button className="btn danger sm" onClick={p.halt}>توقف</button>}</div>
      {p.active >= 0 && <p className="muted small">جملهٔ {fa(p.active + 1)} از {fa(x.lines.length)}</p>}{stage === 0 && <button className="btn ghost" onClick={() => setStage(1)}>رفتن به پرسش‌ها</button>}</div>
    {stage >= 1 && <Sec title="۲. پرسش‌ها، جای خالی و املا">{r ? <QuizSummary r={r} /> : <Quiz items={items} onDone={v => { setR(v); setStage(2); markDone(id); logTest(id, x.title, 'listening', v.score, v.total, v.weak); }} />}</Sec>}
    {stage >= 2 && <Sec title="۳. متن، ترجمه و تکرار جمله‌ها"><div className="card">{x.lines.map((l, i) => <div key={i} className="line"><p className="it-line">{l.it}</p><p className="muted">{l.fa}</p><Play t={l.it} label="این جمله" /></div>)}</div>
      <p className="muted">واژه‌های کلیدی: <bdi dir="ltr" className="it">{x.keywords.join(' · ')}</bdi></p></Sec>}
  </>;
}

/* ---- speaking ---- */
export function SpeakingList() {
  const { go } = useNav(); const s = useApp();
  return <>{levelList(SPEAKING).map(([l, v]) => <Sec key={l} title={l}><div className="list">{v.map(x => <Row key={x.id} title={x.title} sub={x.situation} left={s.speaking[x.id] ? <span className="badge ok">تمرین شد</span> : undefined} onClick={() => go({ s: 'speak', p: x.id })} />)}</div></Sec>)}</>;
}
export function SpeakView({ id }: { id: string }) {
  const x = SPEAKING.find(l => l.id === id)!; const sample = useSample();
  const [show, setShow] = useState(false), [text, setText] = useState(''), [fb, setFb] = useState(''), [busy, setBusy] = useState(false);
  const ask = async () => {
    setBusy(true); setFb('');
    try { await sample(`تو معلم ایتالیایی یک فارسی‌زبان در سطح ${x.level} هستی. موقعیت: ${x.situation}. پاسخ نوشته‌شدهٔ زبان‌آموز را به فارسی بررسی کن: چه چیزی اشتباه است، چرا، نسخهٔ درست و یک جایگزین طبیعی. قاعده از خودت نساز و اگر مطمئن نیستی بگو. فقط متن نوشته‌شده را می‌بینی و دربارهٔ تلفظ نظر نده.\n\nپاسخ زبان‌آموز:\n${text.slice(0, 2000)}`, { onText: ({ text: t }: any) => setFb(t) }); }
    catch (e) { setFb(aiError(e)); } setBusy(false);
  };
  return <>
    <div className="card"><p><b>موقعیت:</b> {x.situation}</p><p><b>نقش شما:</b> {x.role}</p></div>
    <Sec title="عبارت‌های مفید"><div className="list">{x.phrases.map(p => <div key={p.it} className="row" style={{ cursor: 'default' }}><span className="grow"><bdi dir="ltr" className="it">{p.it}</bdi><span className="muted small">{p.fa}</span></span><Play t={p.it} /></div>)}</div></Sec>
    <Sec title="گفت‌وگوی نمونه"><AudioNote /><div className="card">{x.model.map((l, i) => <div key={i} className="line"><span className="sp">{l.sp}</span><p className="it-line">{l.it}</p><p className="muted">{l.fa}</p><Play t={l.it} /></div>)}</div></Sec>
    <Sec title="نوبت شما"><p><b>{x.prompt}</b></p><Recorder onRecorded={() => update(s => { s.speaking[id] = Date.now(); })} />
      <textarea id={`sp-${id}`} className="field" dir="ltr" lang="it" aria-label="پاسخ نوشتاری" placeholder="پاسخ را اینجا هم می‌توانید بنویسید" value={text} onChange={e => setText(e.target.value)} />
      <div className="btns"><button className="btn ghost" onClick={() => { setShow(true); update(s => { s.speaking[id] = Date.now(); }); }}>نمایش پاسخ پیشنهادی</button>
        {sample && <button className="btn quiet" disabled={!text.trim() || busy} onClick={ask}>{busy ? 'در حال بررسی...' : 'بازخورد متن با Claude'}</button>}</div>
      {sample === null && <p className="muted small">بازخورد خودکار در این نسخه در دسترس نیست. گفتار شما ارزیابی نمی‌شود.</p>}
      {fb && <div className="card" style={{ whiteSpace: 'pre-wrap' }}>{fb}<Label k="ai" /></div>}
      {show && x.answers.map(a => <div key={a.it} className="card"><p className="it-line">{a.it}</p><p className="muted">{a.fa}</p><PlayBoth t={a.it} /></div>)}</Sec>
  </>;
}

/* ---- reading & writing ---- */
export function ReadWrite() {
  const { go } = useNav(); const s = useApp();
  return <><Sec title="خواندن"><div className="list">{READING.map(r => <Row key={r.id} title={r.title} sub={r.note} left={<span className="badge">{r.level}</span>} onClick={() => go({ s: 'read', p: r.id })} />)}</div></Sec>
    <Sec title="نوشتن"><div className="list">{WRITING.map(w => <Row key={w.id} title={w.title} sub={`${fa(s.writing.filter(x => x.task === w.id).length)} متن نوشته شده`} left={<span className="badge">{w.level}</span>} onClick={() => go({ s: 'write', p: w.id })} />)}</div></Sec></>;
}
export function ReadView({ id }: { id: string }) {
  const r = READING.find(x => x.id === id)!; const [res, setRes] = useState<QuizResult | null>(null);
  return <><p className="muted">{r.note}</p><TextBody t={textById.get(r.textId)!} /><Sec title="پرسش‌ها">{res ? <QuizSummary r={res} /> : <Quiz items={[...r.qs, ...textById.get(r.textId)!.qs]} onDone={v => { setRes(v); markDone(id); logTest(id, r.title, 'reading', v.score, v.total, v.weak); }} />}</Sec></>;
}
export function WriteView({ id }: { id: string }) {
  const w = WRITING.find(x => x.id === id)!; const s = useApp(); const sample = useSample();
  const [text, setText] = useState(''), [fb, setFb] = useState(''), [busy, setBusy] = useState(false), [show, setShow] = useState(false), [saved, setSaved] = useState(false);
  const save = (feedback?: string) => { update(st => { st.writing.push({ id: String(Date.now()), task: id, text, ts: Date.now(), feedback }); }); setSaved(true); };
  const correct = async () => {
    setBusy(true); setFb('');
    try {
      const { text: out } = await sample(`تو معلم ایتالیایی یک فارسی‌زبان در سطح ${w.level} هستی. تکلیف: ${w.prompt}\nمتن زبان‌آموز را به فارسی تصحیح کن. برای هر اشتباه مهم بگو: چه چیزی نادرست است، چرا، شکل درست، و جایگزین طبیعی‌تر. در پایان مبحث دستوری یا واژگانی برای مرور را نام ببر. قاعده نساز و در صورت تردید بگو.\n\nمتن:\n${text.slice(0, 4000)}`, { onText: ({ text: t }: any) => setFb(t) });
      save(out);
    } catch (e) { setFb(aiError(e)); } setBusy(false);
  };
  return <>
    <div className="card"><p><b>{w.prompt}</b></p><div className="chips" dir="ltr">{w.hints.map(h => <span key={h} className="chip word">{h}</span>)}</div></div>
    <textarea id={`wr-${id}`} className="field" dir="ltr" lang="it" aria-label="متن شما" placeholder="Scrivi qui..." value={text} onChange={e => { setText(e.target.value); setSaved(false); }} />
    <div className="btns"><button className="btn ghost" disabled={!text.trim() || saved} onClick={() => save()}>{saved ? 'ذخیره شد' : 'ذخیرهٔ متن'}</button>
      {sample && <button className="btn" disabled={!text.trim() || busy} onClick={correct}>{busy ? 'در حال تصحیح...' : 'تصحیح با Claude'}</button>}
      <button className="btn ghost" onClick={() => setShow(!show)}>نمونهٔ پاسخ</button></div>
    {sample === null && <NoAI />}
    {fb && <div className="card" style={{ whiteSpace: 'pre-wrap' }}>{fb}<Label k="ai" /></div>}
    {show && <div className="card"><p className="it-line">{w.sample}</p><p className="muted">{w.sampleFa}</p></div>}
    {s.writing.filter(x => x.task === id).length > 0 && <Sec title="نوشته‌های قبلی">{s.writing.filter(x => x.task === id).reverse().map(x => <div key={x.id} className="card"><p className="it-line">{x.text}</p>{x.feedback && <p className="muted" style={{ whiteSpace: 'pre-wrap' }}>{x.feedback}</p>}</div>)}</Sec>}
  </>;
}

/* ---- smart revision ---- */
type Face = { front: React.ReactNode; back: React.ReactNode; say?: string; kind: string };
export function face(id: string): Face | null {
  const [k, a, b] = id.split(':');
  if (k === 'v') { const v = vocabById.get(a); return v ? { kind: 'واژه', say: v.it, front: <span className="big">{nounWithArticle(v)}</span>, back: <><span className="big fa">{meaning(v)}</span><span className="it">{v.exIt}</span><span className="muted">{v.exFa}</span></> } : null; }
  if (k === 'g') { const g = grammarById.get(a); return g ? { kind: 'الگوی دستوری', front: <span><Rich t={g.pattern.front} plain /></span>, back: <span className="big">{g.pattern.back}</span>, say: g.pattern.back } : null; }
  if (k === 'p') { const p = pronById.get(a); return p ? { kind: 'هدف تلفظ', say: p.examples[0].it, front: <span className="big">{p.examples.slice(0, 3).map(e => e.it).join(' · ')}</span>, back: <><b>{p.title}</b><span className="ipa">{p.ipa}</span></> } : null; }
  if (k === 't') { const l = textById.get(a)?.lines[Number(b)]; return l ? { kind: 'جمله', say: l.it, front: <span>{l.fa}</span>, back: <span className="it-line">{l.it}</span> } : null; }
  return null;
}
export function Revision() {
  const s = useApp(); const { go } = useNav();
  const [queue] = useState(() => dueQueue(getState().srs).filter(id => face(id)));
  const [i, setI] = useState(0), [flip, setFlip] = useState(false);
  const id = queue[i], f = id ? face(id) : null;
  const total = Object.keys(s.srs).length;
  const grades: [Grade, string][] = [['again', 'دوباره'], ['hard', 'سخت'], ['good', 'خوب'], ['easy', 'آسان']];
  return <>
    {!total && <div className="notice info">هنوز کارتی ندارید. یک درس را کامل کنید یا در فلش‌کارت‌ها واژه‌ای را علامت بزنید.<br /><button className="btn sm" style={{ marginTop: 8 }} onClick={() => go({ s: 'course' })}>رفتن به درس‌ها</button></div>}
    {f ? <><p className="muted small">کارت {fa(i + 1)} از {fa(queue.length)} · {f.kind}</p>
      <button className="card flash" style={{ width: '100%', color: 'inherit' }} onClick={() => setFlip(true)} aria-label="نمایش پاسخ">{f.front}{flip ? f.back : <span className="muted small">برای دیدن پاسخ لمس کنید</span>}</button>
      {f.say && <Play t={f.say} />}
      {flip && <div className="grades">{grades.map(([g, t]) => <button key={g} className={'btn ' + (g === 'again' ? 'danger' : g === 'good' ? '' : 'ghost')} onClick={() => { review(id, g); setFlip(false); setI(i + 1); }}>{t}<small>{intervalLabel(s.srs[id], g)}</small></button>)}</div>}</>
      : total > 0 && <p className="notice good" role="status">{i > 0 ? `${fa(i)} کارت مرور شد. برای امروز کافی است.` : 'الان کارتی برای مرور ندارید.'}</p>}
    <Sec title="برنامهٔ مرور چگونه کار می‌کند"><p className="muted">از نسخهٔ ساده‌شدهٔ SM-2 استفاده می‌شود. «دوباره» کارت را ۱۰ دقیقهٔ دیگر برمی‌گرداند. «خوب» فاصله را ۱ روز، ۶ روز و سپس فاصلهٔ قبلی ضرب‌در ضریب آسانی می‌کند. کارت‌های عقب‌افتاده و سخت‌تر زودتر می‌آیند.</p>
      <p className="muted small">{fa(total)} کارت در برنامه. واژه‌ها، الگوهای دستوری، جمله‌ها و اهداف تلفظ مرور می‌شوند.</p></Sec>
  </>;
}

/* ---- tests ---- */
export function Tests({ level }: { level?: Level }) {
  const { go } = useNav(); const [l, setL] = useState<Level>(level ?? 'A1'); const s = useApp();
  return <>
    <div className="chips">{LEVELS.map(x => <button key={x} className="chip" aria-pressed={l === x} onClick={() => setL(x)}>{x}</button>)}</div>
    <div className="list">{TEST_KINDS.map(k => <Row key={k.id} title={k.title} sub={k.note} onClick={() => go({ s: 'test', p: { kind: k.id, level: l } })} />)}</div>
    <p className="notice info">این آزمون‌ها برای تمرین هستند و مدرک رسمی CEFR نیستند.</p>
    {s.tests.length > 0 && <Sec title="نتایج اخیر"><div className="list">{s.tests.slice(-5).reverse().map(t => <Row key={t.ts} off title={t.title} sub={`${fa(t.score)} از ${fa(t.total)}`} />)}</div></Sec>}
  </>;
}
export function TestRun({ kind, level }: { kind: string; level: Level }) {
  const k = TEST_KINDS.find(x => x.id === kind)!; const { go, back } = useNav();
  const [items] = useState(() => k.build(level)); const [r, setR] = useState<QuizResult | null>(null);
  const rec = r ? recommend(r.weak) : null;
  if (!items.length) return <><p className="notice info">برای سطح {level} هنوز پرسش کافی در این نوع آزمون وجود ندارد.</p><button className="btn wide" onClick={back}>بازگشت</button></>;
  return <><p className="muted">{k.title} · {level} · {k.note}</p>{r ? <><QuizSummary r={r} />
    {r.score === r.total ? <p className="notice good">همهٔ پاسخ‌ها درست بود.</p> : <div className="btns">{rec && <button className="btn" onClick={() => go({ s: 'grammar', p: rec.id })}>مرور: {rec.title}</button>}<button className="btn ghost" onClick={() => go({ s: 'revision' })}>رفتن به مرور</button></div>}
    <button className="btn ghost wide" onClick={back}>بازگشت به آزمون‌ها</button></>
    : <Quiz items={items} onDone={v => { setR(v); logTest(`${kind}-${level}`, `${k.title} ${level}`, kind, v.score, v.total, v.weak); }} />}</>;
}

/* ---- tutor ---- */
const QUICK = ['فرق passato prossimo و imperfetto را ساده توضیح بده.', 'با من نقش‌بازی کن: در کافه سفارش می‌دهم.', 'یک تمرین کوتاه از نقاط ضعف من بساز و پاسخ را فوراً نگو.', 'این جمله را تصحیح کن: Io sono 20 anni.'];
export function Tutor() {
  const s = useApp(); const sample = useSample();
  const [turns, setTurns] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [text, setText] = useState(''), [live, setLive] = useState(''), [busy, setBusy] = useState(false), [err, setErr] = useState(''), [lvl, setLvl] = useState<Level>('A1');
  const ctl = useRef<AbortController | null>(null);
  const weak = [...new Set(s.tests.slice(-10).flatMap(t => t.weak))].join('، ') || 'هنوز مشخص نشده';
  const rules = `تو مربی ایتالیایی یک فارسی‌زبان هستی. سطح: ${lvl}. به فارسی توضیح بده و برای A1 و A2 ساده حرف بزن. نقاط ضعف ثبت‌شده: ${weak}. خطاها را با احترام اصلاح کن و جایگزین طبیعی بده. در آزمونک پاسخ را فوراً نگو. قاعده، منبع، فایل صوتی یا نتیجهٔ ارزیابی از خودت نساز و اگر مطمئن نیستی بگو. صدای زبان‌آموز را نمی‌شنوی و نمی‌توانی تلفظ را نمره دهی. Reply in ${{ fa: 'Persian', en: 'English', it: 'Italian' }[s.settings.lang]}.`;
  const send = async (msg: string) => {
    if (!msg.trim() || busy) return;
    const next = [...turns, { role: 'user' as const, content: msg }];
    setTurns(next); setText(''); setBusy(true); setErr(''); setLive('در حال فکر کردن...');
    ctl.current = new AbortController();
    try {
      const { text: out } = await sample([{ role: 'user', content: rules }, ...next.slice(-12)], { cache: false, signal: ctl.current.signal, onText: ({ text: t }: any) => setLive(t) });
      setTurns([...next, { role: 'assistant', content: out }]);
    } catch (e: any) { if (e?.text) setTurns([...next, { role: 'assistant', content: e.text }]); if (e?.code !== 'cancelled') setErr(aiError(e)); }
    setLive(''); setBusy(false);
  };
  if (sample === undefined) return <p className="loading">در حال بررسی دسترسی به Claude...</p>;
  if (sample === null) return <NoAI />;
  return <>
    <div className="chips">{LEVELS.map(x => <button key={x} className="chip" aria-pressed={lvl === x} onClick={() => setLvl(x)}>{x}</button>)}</div>
    {!turns.length && <div className="opts">{QUICK.map(q => <button key={q} className="opt" onClick={() => void send(q)}><Rich t={q} plain /></button>)}</div>}
    <div className="sec">{turns.map((t, i) => <div key={i} className={'bubble ' + (t.role === 'user' ? 'me' : 'ai')} dir="auto">{t.content}</div>)}{live && <div className="bubble ai" dir="auto">{live}</div>}</div>
    {err && <p className="notice bad">{err}</p>}
    <textarea id="tutor-input" className="field" dir="auto" aria-label="پیام شما" placeholder="سؤال خود را بنویسید" value={text} onChange={e => setText(e.target.value)} />
    <div className="btns">{busy ? <button className="btn danger" onClick={() => ctl.current?.abort()}>توقف</button> : <button className="btn" disabled={!text.trim()} onClick={() => void send(text)}>ارسال</button>}</div>
    <p className="muted small"><Label k="ai" /> پاسخ‌های مربی ممکن است خطا داشته باشند. هر پیام از سهمیهٔ Claude شما استفاده می‌کند.</p>
  </>;
}
export { logPron };
