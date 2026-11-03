import React, { useEffect, useMemo, useRef, useState } from 'react';
import { lessonById, COURSE } from '../data/course';
import { VOCAB } from '../data/vocab';
import { PRON } from '../data/pronunciation';
import { GRAMMAR } from '../data/grammar';
import { LISTENING, READING, SPEAKING, WRITING } from '../data/practice';
import { dueQueue } from '../lib/srs';
import { firstOpenLesson } from '../lib/tests';
import { capability, hasRecorderApi, inArtifact, isIOS, isNative, isStandalone } from '../lib/platform';
import { dueCards } from '../lib/leitner';
import { getGoogleKey, setGoogleKey, canCallOut } from '../lib/online';
import { LANG_NAMES, isRtl, tr, type Lang } from '../i18n';
import { Dictionary, Leitner } from './tools';
import { italianVoices, speak } from '../lib/speech';
import { dayKey, getPersistence, getState, importState, resetAll, setSettings, streak, today, useApp } from '../lib/store';
import { Label, Nav, type Route, Row, Sec, fa, locale, useNav, useSpeechStatus } from './core';
import { Course, Flashcards, GrammarList, GrammarView, LessonView, LevelView, PronList, PronView, Studio, TextView, VocabLab, WordView } from './learn';
import { ListenView, ListeningList, ReadView, ReadWrite, Revision, SpeakView, SpeakingList, Tests, TestRun, Tutor, WriteView } from './practice';

const NAV: [string, string][] = [['home', 'داشبورد'], ['pronlist', 'آکادمی تلفظ'], ['vocab', 'آزمایشگاه واژگان'], ['grammarlist', 'آکادمی دستور'], ['studio', 'استودیوی جمله و متن'], ['listening', 'آزمایشگاه شنیداری'], ['speaking', 'تمرین گفتار'], ['readwrite', 'خواندن و نوشتن'], ['revision', 'مرور هوشمند'], ['leitner', 'لایتنر'], ['dict', 'فرهنگ و ترجمه'], ['tests', 'آزمون‌ها'], ['progress', 'پیشرفت و آمار'], ['tutor', 'مربی هوشمند ایتالیایی'], ['prefs', 'تنظیمات']];
const TITLES: Record<string, string> = { ...Object.fromEntries(NAV), course: 'مسیر A1 تا C1', more: 'همهٔ بخش‌ها', level: 'سطح', lesson: 'درس', grammar: 'دستور زبان', pron: 'تلفظ', word: 'واژه', flash: 'فلش‌کارت', text: 'متن', listen: 'شنیداری', speak: 'گفتار', read: 'خواندن', write: 'نوشتن', test: 'آزمون' };
const TABS: [string, string, string][] = [['home', 'خانه', 'M3 11 12 4l9 7v9h-6v-6H9v6H3z'], ['pronlist', 'تلفظ', 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM6 11a6 6 0 0 0 12 0M12 17v4'], ['vocab', 'واژگان', 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11'], ['revision', 'مرور', 'M4 12a8 8 0 0 1 14-5l2 2M20 4v5h-5M20 12a8 8 0 0 1-14 5l-2-2M4 20v-5h5'], ['more', 'بیشتر', 'M4 7h16M4 12h16M4 17h16']];

function pct(a: number, b: number) { return b ? Math.min(100, Math.round(a / b * 100)) : 0; }
function skills(s: ReturnType<typeof useApp>) {
  const did = (ids: string[]) => ids.filter(i => s.done[i]).length;
  return [['شنیدن', pct(did(LISTENING.map(x => x.id)), LISTENING.length)], ['گفتار', pct(SPEAKING.filter(x => s.speaking[x.id]).length, SPEAKING.length)], ['خواندن', pct(did(READING.map(x => x.id)), READING.length)],
    ['نوشتن', pct(new Set(s.writing.map(w => w.task)).size, WRITING.length)], ['واژگان', pct(Object.keys(s.known).length, VOCAB.length)], ['دستور', pct(did(GRAMMAR.map(g => 'g-' + g.id)), GRAMMAR.length)]] as [string, number][];
}
const Skills = ({ s }: { s: ReturnType<typeof useApp> }) => <div className="card">{skills(s).map(([k, v]) => <div className="skill" key={k}><span>{k}</span><div className="meter" role="img" aria-label={`${k} ${v} درصد`}><i style={{ width: v + '%' }} /></div><b>{fa(v)}٪</b></div>)}</div>;

function Home() {
  const s = useApp(); const { go } = useNav();
  const next = firstOpenLesson(s.lessons), due = dueQueue(s.srs).length, t = today(s);
  const level = next?.level ?? 'C1', plan = COURSE.find(l => l.id === level)!;
  const lv = plan.modules.flatMap(m => m.lessons), doneL = lv.filter(l => s.lessons[l.id]).length;
  const started = Object.keys(s.lessons).length + Object.keys(s.srs).length > 0;
  const goal = Math.min(t.reviews, s.settings.dailyGoal);
  const pron = PRON.filter(p => s.pron[p.id]).length;
  return <>
    <div className="hero"><p className="name">Italian Learning Studio</p><p className="sub">Il tuo percorso verso la padronanza dell'italiano</p></div>
    <div className="card">
      <p className="muted small">سطح فعلی <span className="cefr">{level}</span> · {fa(doneL)} از {fa(lv.length)} درس آماده</p>
      <div className="meter"><i style={{ width: pct(doneL, lv.length) + '%' }} /></div>
      {next ? <><h2>{started ? 'درس پیشنهادی بعدی' : 'از اینجا شروع کنید'}: {next.title}</h2><p className="muted">{next.goal}</p>
        <button className="btn wide" onClick={() => go({ s: 'lesson', p: next.id })}>{started ? 'ادامهٔ یادگیری' : 'شروع نخستین درس'}</button></>
        : <p className="notice good">همهٔ درس‌های آماده را تمام کرده‌اید.</p>}
    </div>
    <div className="stats">
      <div className="stat"><b>{fa(streak(s))}</b><span>روز پیاپی</span></div>
      <div className="stat"><b>{fa(Object.keys(s.known).length)}</b><span>واژهٔ یادگرفته</span></div>
      <div className="stat"><b>{fa(due)}</b><span>کارت برای مرور</span></div>
    </div>
    <Sec title="برنامهٔ امروز"><div className="list">
      <Row title={`مرور: ${fa(goal)} از ${fa(s.settings.dailyGoal)} کارت هدف`} sub={due ? `${fa(due)} کارت آماده است` : 'الان کارتی برای مرور نیست'} onClick={() => go({ s: 'revision' })} />
      <Row title="لایتنر" sub={`${fa(dueCards(s.leitner).length)} کارت در جعبه‌ها آماده است`} onClick={() => go({ s: 'leitner' })} />
      <Row title="تلفظ" sub={`${fa(pron)} از ${fa(PRON.length)} قاعده تمرین شده`} onClick={() => go({ s: 'pronlist' })} />
      <Row title="فرهنگ و ترجمه" sub="فرهنگ لغت و Google Translate" onClick={() => go({ s: 'dict' })} />
      <Row title="مسیر کامل A1 تا C1" sub="نقشهٔ دوره و درس‌ها" onClick={() => go({ s: 'course' })} />
    </div></Sec>
    <Sec title="مهارت‌ها"><Skills s={s} /></Sec>
    {s.recent.length > 0 && <Sec title="درس‌های اخیر"><div className="list">{s.recent.filter(i => lessonById.has(i)).slice(0, 3).map(i => <Row key={i} title={lessonById.get(i)!.title} sub={s.lessons[i] ? 'کامل شده' : 'شروع شده'} onClick={() => go({ s: 'lesson', p: i })} />)}</div></Sec>}
    {!started && <p className="muted small">همهٔ عددها از صفر شروع می‌شوند و فقط کار واقعی شما را نشان می‌دهند. داده نمایشی وجود ندارد.</p>}
  </>;
}

function More() {
  const { go } = useNav();
  return <div className="list"><Row title="مسیر A1 تا C1" onClick={() => go({ s: 'course' })} />{NAV.map(([k, t]) => <Row key={k} title={t} onClick={() => go({ s: k })} />)}</div>;
}

function Progress() {
  const s = useApp(); const [pick, setPick] = useState<number | null>(13);
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => { const ts = Date.now() - (13 - i) * 86_400_000, k = dayKey(ts), d = s.days[k]; return { ts, n: d ? d.reviews + d.lessons + d.quizzes + d.pron : 0, d }; }), [s.days]);
  const max = Math.max(1, ...days.map(d => d.n));
  const all = Object.values(s.days), rev = all.reduce((a, d) => a + d.reviews, 0), ok = all.reduce((a, d) => a + d.correct, 0), secs = all.reduce((a, d) => a + d.seconds, 0);
  const sel = pick === null ? null : days[pick];
  return <>
    <div className="stats">
      <div className="stat"><b>{fa(Object.keys(s.lessons).length)}</b><span>درس کامل</span></div>
      <div className="stat"><b>{fa(Math.round(secs / 60))}</b><span>دقیقه مطالعه</span></div>
      <div className="stat"><b>{rev ? fa(pct(ok, rev)) + '٪' : '—'}</b><span>دقت مرور</span></div>
      <div className="stat"><b>{fa(streak(s))}</b><span>روز پیاپی</span></div>
      <div className="stat"><b>{fa(PRON.filter(p => s.pron[p.id]).length)}</b><span>قاعدهٔ تلفظ</span></div>
      <div className="stat"><b>{fa(s.tests.length)}</b><span>آزمون</span></div>
    </div>
    <Sec title="فعالیت ۱۴ روز اخیر"><div className="card">
      <div className="chart" role="group" aria-label="نمودار فعالیت روزانه">{days.map((d, i) => <button key={d.ts} className="bar" aria-pressed={pick === i} aria-label={`${new Date(d.ts).toLocaleDateString(locale())}: ${d.n} فعالیت`} onClick={() => setPick(i)}><i style={{ height: d.n / max * 100 + '%' }} /></button>)}</div>
      {sel && <p className="muted small" role="status">{new Date(sel.ts).toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' })}: {fa(sel.d?.reviews ?? 0)} مرور، {fa(sel.d?.lessons ?? 0)} درس، {fa(sel.d?.quizzes ?? 0)} آزمون، {fa(sel.d?.pron ?? 0)} تمرین تلفظ</p>}
      {!all.length && <p className="muted small">هنوز فعالیتی ثبت نشده است.</p>}
    </div></Sec>
    <Sec title="مهارت‌ها"><Skills s={s} /><p className="muted small">درصدها سهم بخش‌های آماده‌ای را نشان می‌دهند که انجام داده‌اید و سطح زبان شما را اندازه نمی‌گیرند. زمان مطالعه فقط هنگام استفادهٔ فعال شمرده می‌شود.</p></Sec>
    {s.tests.length > 0 && <Sec title="نقاط ضعف اخیر"><p>{[...new Set(s.tests.slice(-10).flatMap(t => t.weak))].join('، ') || 'موردی ثبت نشده'}</p></Sec>}
  </>;
}

function Prefs() {
  const s = useApp(); const st = s.settings; const status = useSpeechStatus();
  const [msg, setMsg] = useState(''), [confirm, setConfirm] = useState(false), [gkey, setGkey] = useState(getGoogleKey);
  const voices = italianVoices(), per = getPersistence();
  const SAVE: Record<string, string> = { memory: 'ذخیره‌سازی در دسترس نیست. پیشرفت با بستن صفحه از بین می‌رود؛ پشتیبان بگیرید.', device: 'پیشرفت فقط روی همین مرورگر ذخیره می‌شود.', account: 'پیشرفت در حساب Claude شما و روی این مرورگر ذخیره می‌شود.', 'account-error': 'ذخیره در حساب ناموفق بود. پیشرفت روی این مرورگر نگه داشته شده است.' };
  const backup = async () => {
    const json = JSON.stringify(getState()), filename = 'italian-studio-backup.json';
    const dl = await capability('downloads');
    try {
      if (dl) { await dl.save({ filename, data: json }); setMsg('پشتیبان آماده شد.'); return; }
      const file = new File([json], filename, { type: 'application/json' });
      if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file] }); setMsg('پشتیبان فرستاده شد.'); return; }
      if (isNative()) { await navigator.clipboard.writeText(json); setMsg('پشتیبان آماده شد.'); return; }
      const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = filename; a.click(); setMsg('فایل پشتیبان دانلود شد.');
    } catch (e: any) { if (e?.name !== 'AbortError' && e?.code !== 'declined') setMsg('پشتیبان‌گیری ناموفق بود.'); }
  };
  const num = (k: 'rate' | 'slowRate', label: string, min: number, max: number) => <label className="sec"><span>{label}: {fa(st[k])}</span><input id={k} type="range" min={min} max={max} step={0.05} value={st[k]} onChange={e => setSettings({ [k]: Number(e.target.value) })} /></label>;
  const Toggle = ({ k, t }: { k: 'showEnglish' | 'showTranslit'; t: string }) => <button className="chip" aria-pressed={st[k]} onClick={() => setSettings({ [k]: !st[k] })}>{t}</button>;
  return <>
    <Sec title="زبان و نمایش"><div className="card">
      <div className="sec"><span>زبان رابط</span><div className="chips">{(Object.keys(LANG_NAMES) as Lang[]).map(k => <button key={k} className="chip" aria-pressed={st.lang === k} onClick={() => setSettings({ lang: k })}>{LANG_NAMES[k]}</button>)}</div>{st.lang !== 'fa' && <p className="muted small">توضیح درس‌ها فعلاً به فارسی است.</p>}</div>
      <div className="chips"><Toggle k="showEnglish" t="معنی انگلیسی" /><Toggle k="showTranslit" t="نویسهٔ تقریبی فارسی" /></div>
      <div className="chips">{([['system', 'مطابق سیستم'], ['light', 'روشن'], ['dark', 'تیره']] as const).map(([k, t]) => <button key={k} className="chip" aria-pressed={st.theme === k} onClick={() => setSettings({ theme: k })}>{t}</button>)}</div>
    </div></Sec>
    <Sec title="صدا"><div className="card">
      {voices.length > 0 ? <label className="sec"><span>صدای ایتالیایی ({fa(voices.length)} مورد روی این دستگاه)</span><select id="voice" className="field" dir="ltr" value={st.voiceURI} onChange={e => setSettings({ voiceURI: e.target.value })}><option value="">پیش‌فرض</option>{voices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}</select></label>
        : <p className="notice">{status === 'unsupported' ? 'این مرورگر خواندن متن را پشتیبانی نمی‌کند.' : 'صدای ایتالیایی روی این دستگاه فهرست نشده است.'}</p>}
      {num('rate', 'سرعت عادی', 0.7, 1.2)}{num('slowRate', 'سرعت آهسته', 0.4, 0.8)}
      <button className="btn ghost" onClick={() => void speak('Buongiorno! Come stai?')}>آزمایش صدا</button><Label k="syn" />
    </div></Sec>
    {canCallOut() && <Sec title="کلید Google Cloud Translation"><div className="card"><p className="muted small">این کلید اختیاری است و فقط روی همین دستگاه می‌ماند. در پشتیبان و همگام‌سازی نمی‌آید. گوگل برای این سرویس حساب پرداخت می‌خواهد.</p>
      <input id="google-key" className="field" dir="ltr" type="password" autoComplete="off" aria-label="کلید Google Cloud Translation" value={gkey} onChange={e => setGkey(e.target.value)} />
      <div className="btns"><button className="btn ghost" disabled={!gkey.trim()} onClick={() => { setGoogleKey(gkey.trim()); setMsg('کلید ذخیره شد.'); }}>ذخیرهٔ کلید</button><button className="btn ghost" onClick={() => { setGoogleKey(''); setGkey(''); setMsg('کلید حذف شد.'); }}>حذف کلید</button></div></div></Sec>}
    <Sec title="هدف روزانه"><div className="chips">{[5, 10, 20, 40].map(n => <button key={n} className="chip" aria-pressed={st.dailyGoal === n} onClick={() => setSettings({ dailyGoal: n })}>{fa(n)} کارت</button>)}</div></Sec>
    <Sec title="ذخیره‌سازی و پشتیبان"><div className="card"><p role="status">{SAVE[per]}</p>
      <div className="btns"><button className="btn ghost" onClick={() => void backup()}>گرفتن پشتیبان</button><label className="btn ghost" htmlFor="import-file">بازیابی از فایل</label></div>
      <input id="import-file" hidden type="file" accept="application/json,.json" onChange={async e => { const f = e.target.files?.[0]; if (f) setMsg(importState(await f.text()) ? 'پشتیبان بازیابی شد.' : 'این فایل پشتیبان معتبری نیست.'); e.target.value = ''; }} />
      {msg && <p className="notice info" role="status">{msg}</p>}
      {confirm ? <div className="btns"><button className="btn danger" onClick={() => { resetAll(); setConfirm(false); setMsg('همهٔ پیشرفت پاک شد.'); }}>بله، همه چیز پاک شود</button><button className="btn ghost" onClick={() => setConfirm(false)}>انصراف</button></div>
        : <button className="btn danger" onClick={() => setConfirm(true)}>پاک کردن پیشرفت</button>}
    </div></Sec>
    <Sec title="وضعیت این دستگاه"><div className="card muted small">
      <p>صدای مصنوعی: {status === 'ready' ? 'در دسترس' : status === 'unsupported' ? 'پشتیبانی نمی‌شود' : 'صدای ایتالیایی فهرست نشده'}</p>
      <p>رابط ضبط: {hasRecorderApi() ? 'وجود دارد؛ اجازه هنگام ضبط پرسیده می‌شود' : 'پشتیبانی نمی‌شود'}</p>
      <p>اجرا: {inArtifact() ? 'Artifact در claude.ai' : isNative() ? 'برنامهٔ iOS' : isStandalone() ? 'برنامهٔ نصب‌شده' : 'مرورگر'}</p>
      <p>ارزیابی تلفظ در سطح آوا: در دسترس نیست و نمره‌ای ساخته نمی‌شود.</p>
      <p>صدای گویشور بومی: در این نسخه گنجانده نشده است.</p>
    </div></Sec>
    {!inArtifact() && !isNative() && !isStandalone() && isIOS() && <p className="notice info">برای نصب: در Safari دکمهٔ Share و سپس Add to Home Screen را بزنید.</p>}
    <p className="muted small">منابع پیشنهادی برای بررسی بیشتر: Treccani، Wiktionary، Wikimedia Commons، Lingua Libre و Tatoeba. محتوای این برنامه از آن‌ها کپی نشده است. برچسب‌ها: همهٔ محتوا AI-GENERATED و همهٔ صداها SYNTHETIC AUDIO است.</p>
  </>;
}

function Screen({ r }: { r: Route }) {
  switch (r.s) {
    case 'home': return <Home />; case 'more': return <More />; case 'course': return <Course />;
    case 'level': return <LevelView id={r.p} />; case 'lesson': return <LessonView key={r.p} id={r.p} />;
    case 'pronlist': return <PronList />; case 'pron': return <PronView key={r.p} id={r.p} />;
    case 'vocab': return <VocabLab />; case 'word': return <WordView key={r.p} id={r.p} />; case 'flash': return <Flashcards filter={r.p} />;
    case 'grammarlist': return <GrammarList />; case 'grammar': return <GrammarView key={r.p} id={r.p} />;
    case 'studio': return <Studio />; case 'text': return <TextView key={r.p} id={r.p} />;
    case 'listening': return <ListeningList />; case 'listen': return <ListenView key={r.p} id={r.p} />;
    case 'speaking': return <SpeakingList />; case 'speak': return <SpeakView key={r.p} id={r.p} />;
    case 'readwrite': return <ReadWrite />; case 'read': return <ReadView key={r.p} id={r.p} />; case 'write': return <WriteView key={r.p} id={r.p} />;
    case 'revision': return <Revision />; case 'leitner': return <Leitner />; case 'dict': return <Dictionary key={String(r.p)} word={r.p} />; case 'tests': return <Tests level={r.p} />; case 'test': return <TestRun kind={r.p.kind} level={r.p.level} />;
    case 'progress': return <Progress />; case 'tutor': return <Tutor />; case 'prefs': return <Prefs />;
    default: return <Home />;
  }
}

class Guard extends React.Component<{ children: React.ReactNode; reset(): void }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? <div className="main"><p className="notice bad">این صفحه باز نشد. پیشرفت شما حفظ شده است.</p><button className="btn" onClick={() => { this.setState({ err: false }); this.props.reset(); }}>بازگشت به خانه</button></div> : this.props.children; }
}

export function applyDisplay(st: { theme: string; lang: string }) {
  const root = document.documentElement;
  if (st.theme === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', st.theme);
  root.lang = st.lang; root.dir = st.lang === 'fa' ? 'rtl' : 'ltr';
}

export function App() {
  const [stack, setStack] = useState<Route[]>([{ s: 'home' }]);
  const s = useApp(); const r = stack[stack.length - 1];
  const saved = useRef<Record<number, number>>({});
  useEffect(() => { applyDisplay(s.settings); }, [s.settings.theme, s.settings.lang]);
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const dark = s.settings.theme === 'dark' || (s.settings.theme === 'system' && prefersDark);
  useEffect(() => { window.scrollTo(0, saved.current[stack.length] ?? 0); }, [stack]);
  const nav = useMemo(() => ({
    depth: stack.length,
    go(n: Route) { saved.current[stack.length] = window.scrollY; delete saved.current[stack.length + 1]; setStack([...stack, n]); },
    back() { if (stack.length > 1) setStack(stack.slice(0, -1)); },
  }), [stack]);
  const due = dueQueue(s.srs).length;
  const tabTo = (k: string) => { delete saved.current[1]; setStack(k === 'home' ? [{ s: 'home' }] : [{ s: 'home' }, { s: k }]); };
  const title = r.s === 'level' ? `${tr('سطح')} ${r.p}` : TITLES[r.s];
  return <Nav.Provider value={nav}>
    <header className="top"><div className="tricolore" aria-hidden="true"><i /><i /><i /></div><div className="top-in">
      {stack.length > 1 && <button className="icon-btn" aria-label="بازگشت" onClick={nav.back}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={isRtl() ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'} /></svg></button>}
      <h1>{title}</h1>
      <button className="icon-btn end" aria-label="حالت تیره یا روشن" onClick={() => setSettings({ theme: dark ? 'light' : 'dark' })}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{dark ? <path d="M12 4V2M12 22v-2M4 12H2M22 12h-2M6 6 4.6 4.6M19.4 19.4 18 18M6 18l-1.4 1.4M19.4 4.6 18 6M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" /> : <path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z" />}</svg></button></div></header>
    <main className="main" key={stack.length + r.s}><Guard reset={() => setStack([{ s: 'home' }])}><Screen r={r} /></Guard></main>
    <nav className="tabs" aria-label="ناوبری اصلی"><div className="tabs-in">{TABS.map(([k, t, d]) => <button key={k} className="tab" aria-current={stack[1]?.s === k || (k === 'home' && stack.length === 1) ? 'page' : undefined} onClick={() => tabTo(k)}>
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>{t}{k === 'revision' && due > 0 && <span className="dot">{fa(due)}</span>}</button>)}</div></nav>
  </Nav.Provider>;
}
