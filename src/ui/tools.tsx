import React, { useEffect, useMemo, useRef, useState } from 'react';
import { VOCAB, nounWithArticle } from '../data/vocab';
import { tr } from '../i18n';
import { BOX_DAYS, MASTERED, dueCards } from '../lib/leitner';
import { addLeitner, getState, leitnerAnswer, myId, saveMyWord, useApp } from '../lib/store';
import { canCallOut, getGoogleKey, google, googleLink, myMemory, treccaniLink, wiktionary, wiktionaryLink, type Sense, type Target } from '../lib/online';
import { Play, Row, Sec, fa, useNav } from './core';
import { aiError, face, useSample } from './practice';

/* ---- Leitner ---- */
export function Leitner() {
  const s = useApp();
  const [queue, setQueue] = useState(() => dueCards(s.leitner).filter(id => face(id)));
  const [i, setI] = useState(0), [flip, setFlip] = useState(false);
  const cards = Object.values(s.leitner);
  const boxes = BOX_DAYS.map((d, n) => ({ n: n + 1, d, count: cards.filter(c => c.box === n + 1).length }));
  const mastered = cards.filter(c => c.box === MASTERED).length;
  const id = queue[i], f = id ? face(id) : null;
  const refresh = () => { setQueue(dueCards(getState().leitner).filter(x => face(x))); setI(0); setFlip(false); };
  const addNew = () => { addLeitner(VOCAB.filter(v => !s.leitner['v:' + v.id]).slice(0, 10).map(v => 'v:' + v.id)); refresh(); };
  const addSrs = () => { addLeitner(Object.keys(s.srs)); refresh(); };
  const pick = (ok: boolean) => { leitnerAnswer(id, ok); setFlip(false); setI(i + 1); };
  return <>
    <div className="boxes" role="group">{boxes.map(b => <div key={b.n} className="box"><span className="muted small">جعبه {fa(b.n)}</span><b>{fa(b.count)}</b><span className="muted small">{tr(`${fa(b.d)} روز`)}</span></div>)}
      <div className="box"><span className="muted small">تسلط</span><b>{fa(mastered)}</b></div></div>
    {f ? <><p className="muted small">کارت {fa(i + 1)} از {fa(queue.length)} · {f.kind} · جعبه {fa(s.leitner[id].box)}</p>
      <button className="card flash" style={{ width: '100%', color: 'inherit' }} onClick={() => setFlip(true)} aria-label="نمایش پاسخ">{f.front}{flip ? f.back : <span className="muted small">برای دیدن پاسخ لمس کنید</span>}</button>
      {f.say && <Play t={f.say} />}
      {flip && <div className="btns"><button className="btn" style={{ flex: 1 }} onClick={() => pick(true)}>بلد بودم</button><button className="btn danger" style={{ flex: 1 }} onClick={() => pick(false)}>بلد نبودم</button></div>}</>
      : <p className="notice info" role="status">{cards.length ? 'امروز کارتی در جعبه‌ها آماده نیست.' : 'هنوز کارتی در جعبه‌ها نیست.'}</p>}
    <div className="btns"><button className="btn ghost" onClick={addNew}>افزودن ۱۰ واژهٔ تازه</button>{Object.keys(s.srs).some(k => !s.leitner[k]) && <button className="btn ghost" onClick={addSrs}>افزودن کارت‌های مرور هوشمند</button>}</div>
    <Sec title="روش لایتنر چگونه کار می‌کند"><p className="muted">هر کارت از جعبهٔ ۱ شروع می‌شود. پاسخ درست آن را یک جعبه جلو می‌برد و پاسخ نادرست آن را به جعبهٔ ۱ برمی‌گرداند. جعبه‌ها هر ۱، ۲، ۴، ۸ و ۱۶ روز مرور می‌شوند. پس از جعبهٔ ۵ کارت به مرحلهٔ تسلط می‌رسد.</p><p className="muted small">لایتنر و مرور هوشمند جدا از هم زمان‌بندی می‌شوند.</p></Sec>
  </>;
}

/* ---- saving a looked-up word to the learner's own list ---- */
function SaveWord({ it, to, guess }: { it: string; to: Target; guess: string }) {
  const s = useApp(); const saved = s.mine[myId(it)];
  const [m, setM] = useState({ fa: saved?.fa ?? '', en: saved?.en ?? '' }), [busy, setBusy] = useState(false), [done, setDone] = useState(false);
  const [touched, setTouched] = useState(false);
  useEffect(() => { if (guess && !touched && !saved) setM(x => ({ ...x, [to]: guess })); }, [guess]);
  const other: Target = to === 'fa' ? 'en' : 'fa';
  const save = async () => {
    setBusy(true);
    let w = { it, ...m };
    if (!w[other] && canCallOut()) { try { w = { ...w, [other]: await myMemory(it, other) }; } catch { /* the learner can fill it in later */ } }
    saveMyWord(w); setM({ fa: w.fa, en: w.en }); setBusy(false); setDone(true);
  };
  const edit = (k: Target, v: string) => { setTouched(true); setDone(false); setM(x => ({ ...x, [k]: v })); };
  return <div className="card">
    <h3>{saved ? 'در واژه‌های من' : 'افزودن به واژه‌های من'}</h3>
    <label className="muted small" htmlFor="my-fa">معنی به فارسی</label>
    <input id="my-fa" className="field" dir="rtl" lang="fa" value={m.fa} onChange={e => edit('fa', e.target.value)} />
    <label className="muted small" htmlFor="my-en">معنی به انگلیسی</label>
    <input id="my-en" className="field" dir="ltr" lang="en" value={m.en} onChange={e => edit('en', e.target.value)} />
    <button className="btn" disabled={busy || !(m.fa.trim() || m.en.trim())} onClick={save}>{saved ? 'ذخیرهٔ تغییرها' : 'ذخیره و افزودن به لایتنر'}</button>
    {done && <p className="notice info" role="status">ذخیره شد. این واژه در لایتنر و مرور هوشمند آمده است.</p>}
    <p className="muted small">معنی‌ها از ترجمهٔ ماشینی پر می‌شوند و ممکن است نادرست باشند. پیش از ذخیره آن‌ها را بررسی کنید.</p>
  </div>;
}

/* ---- dictionary and translation ---- */
const ERR: Record<string, string> = { quota: 'سهمیهٔ رایگان امروز MyMemory تمام شده است.', key: 'Google درخواست را نپذیرفت. کلید و تنظیمات آن را بررسی کنید.' };
const why = (e: unknown) => ERR[(e as Error)?.message] ?? 'اتصال ناموفق بود. اینترنت را بررسی کنید.';
type Out<T> = { state: 'idle' | 'busy' | 'done' | 'error'; value?: T; error?: string };
const idle = { state: 'idle' as const };

export function Dictionary({ word }: { word?: string }) {
  const { go } = useNav(); const sample = useSample();
  const s = useApp();
  const [q, setQ] = useState(word ?? ''), [ran, setRan] = useState(''), [to, setTo] = useState<Target>(s.settings.lang === 'fa' ? 'fa' : 'en');
  const [wk, setWk] = useState<Out<Sense[]>>(idle), [mm, setMm] = useState<Out<string>>(idle), [gg, setGg] = useState<Out<string>>(idle), [cl, setCl] = useState<Out<string>>(idle);
  const run = useRef(0);
  const local = useMemo(() => { const k = ran.trim().toLowerCase(); return k ? VOCAB.filter(v => v.it.toLowerCase() === k || v.pl?.toLowerCase() === k || (v.verb && Object.values(v.verb).includes(k))).slice(0, 5) : []; }, [ran]);
  const search = async (text = q, target = to) => {
    const t = text.trim(); if (!t) return;
    const id = ++run.current; setRan(t); setWk(idle); setMm(idle); setGg(idle); setCl(idle);
    if (!canCallOut()) return;
    const single = !/\s/.test(t), key = getGoogleKey();
    const put = <T,>(set: (o: Out<T>) => void, p: Promise<T>) => { set({ state: 'busy' }); p.then(value => { if (id === run.current) set({ state: 'done', value }); }, e => { if (id === run.current) set({ state: 'error', error: why(e) }); }); };
    if (single) put(setWk, wiktionary(t));
    put(setMm, myMemory(t, target));
    if (key) put(setGg, google(t, target, key));
  };
  useEffect(() => { if (word) void search(word); }, []);
  const askClaude = async () => {
    setCl({ state: 'busy' });
    try { const { text } = await sample(`Translate this Italian text into ${to === 'fa' ? 'Persian' : 'English'}. Reply with only the translation.\n\n${ran.slice(0, 2000)}`, { modelTier: 'quick' }); setCl({ state: 'done', value: text }); }
    catch (e) { setCl({ state: 'error', error: aiError(e) }); }
  };
  const Result = ({ o, title }: { o: Out<string>; title: string }) => o.state === 'idle' ? null : <div className="card"><h3>{title}</h3>{o.state === 'busy' && <p className="muted">...</p>}{o.value && <p dir="auto" className="result">{o.value}</p>}{o.error && <p className="notice bad">{o.error}</p>}{o.state === 'done' && <span className="badge">UNVERIFIED</span>}</div>;
  return <>
    <form className="sec" onSubmit={e => { e.preventDefault(); void search(); }}>
      <input id="dict-q" className="field" dir="ltr" lang="it" autoCapitalize="none" autoCorrect="off" enterKeyHint="search" aria-label="واژه یا جملهٔ ایتالیایی" placeholder="واژه یا جملهٔ ایتالیایی" value={q} onChange={e => setQ(e.target.value)} />
      <div className="chips"><span className="muted small">ترجمه به</span>{([['fa', 'فارسی'], ['en', 'انگلیسی']] as const).map(([k, t]) => <button key={k} type="button" className="chip" aria-pressed={to === k} onClick={() => { setTo(k); if (ran) void search(ran, k); }}>{t}</button>)}</div>
      <button className="btn" type="submit" disabled={!q.trim()}>جست‌وجو و ترجمه</button>
    </form>
    {ran && <>
      {local.length > 0 && <Sec title="در واژگان این برنامه"><div className="list">{local.map(v => <Row key={v.id} title={<bdi dir="ltr" className="it">{nounWithArticle(v)}</bdi>} sub={`${v.fa} · ${v.en}`} onClick={() => go({ s: 'word', p: v.id })} />)}</div></Sec>}
      {!local.length && <SaveWord key={ran + to} it={ran} to={to} guess={gg.value || mm.value || cl.value || ''} />}
      <Result o={gg} title="ترجمهٔ Google" /><Result o={mm} title="ترجمهٔ ماشینی MyMemory" /><Result o={cl} title="ترجمهٔ Claude" />
      {wk.state !== 'idle' && <Sec title="ویکی‌واژه">
        {wk.state === 'busy' && <p className="muted">...</p>}{wk.error && <p className="notice bad">{wk.error}</p>}
        {wk.state === 'done' && !wk.value?.length && <p className="notice info">در ویکی‌واژه مدخلی برای این واژه نیست.</p>}
        {wk.value?.map((x, i) => <div key={i} className="card" dir="ltr"><b className="it">{x.pos}</b><ol style={{ margin: 0, paddingInlineStart: 20 }}>{x.defs.map((d, j) => <li key={j} dir="ltr">{d}</li>)}</ol></div>)}
        {!!wk.value?.length && <p className="muted small">معنی از ویکی‌واژه به انگلیسی است. متن تحت مجوز CC BY-SA است.</p>}
      </Sec>}
      {!canCallOut() && <div className="notice">این نسخه به سرویس‌های بیرونی متصل نمی‌شود. از پیوندهای زیر استفاده کنید.</div>}
      {!canCallOut() && sample && <button className="btn quiet" disabled={cl.state === 'busy'} onClick={askClaude}>ترجمهٔ Claude</button>}
      <div className="btns"><a className="btn ghost" target="_blank" rel="noopener" href={googleLink(ran, to)}>باز کردن در Google Translate</a>
        {!/\s/.test(ran) && <><a className="btn ghost" target="_blank" rel="noopener" href={wiktionaryLink(ran)}>باز کردن در ویکی‌واژه</a><a className="btn ghost" target="_blank" rel="noopener" href={treccaniLink(ran)}>باز کردن در Treccani</a></>}</div>
    </>}
    <p className="muted small">ترجمهٔ ماشینی ممکن است نادرست باشد و تأیید نشده است. {canCallOut() && 'متن جست‌وجو برای این سرویس‌ها فرستاده می‌شود.'}</p>
  </>;
}
