import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Exercise } from '../types';
import { speak, speakLines, speechStatus, stop, whenVoicesReady } from '../lib/speech';
import { hasRecorderApi, inArtifact, recorderMime } from '../lib/platform';
import { getState } from '../lib/store';
import { isRtl, tr } from '../i18n';

export type Route = { s: string; p?: any };
export const Nav = createContext<{ go(r: Route): void; back(): void; depth: number }>({ go() {}, back() {}, depth: 0 });
export const useNav = () => useContext(Nav);
export const locale = () => ({ fa: 'fa-IR', en: 'en-GB', it: 'it-IT' })[getState().settings.lang];
export const fa = (n: number) => n.toLocaleString(locale());

const PERSIAN = /[؀-ۿ]/;
const SPEAKABLE = /^[a-zàèéìòùA-ZÈ' ,.?!…]{2,}$/;
const LATIN_RUN = /([A-Za-zÀ-ÿ_'][A-Za-zÀ-ÿ_'’\s,.?!…()/+→-]*)/;

export function It({ t, plain }: { t: string; plain?: boolean }) {
  if (!plain && SPEAKABLE.test(t)) {
    return <button type="button" className="tap" lang="it" aria-label={`${tr('پخش')} ${t}`} onClick={() => void speak(t)}>{t}</button>;
  }
  return <bdi dir="ltr" lang="it" className={/[ɛɔʃʎɲ/ˈ]/.test(t) ? 'ipa' : 'it'}>{t}</bdi>;
}

/** Persian text with {italian} spans. Unmarked Latin runs are still isolated LTR. */
export function Rich({ t: source, plain }: { t: string; plain?: boolean }) {
  const t = tr(source);
  if (!isRtl() && !PERSIAN.test(t) && !t.includes('{')) return <>{t}</>;
  return <>{t.split(/(\{[^}]+\})/).filter(Boolean).map((part, i) => {
    if (part[0] === '{') return <It key={i} t={part.slice(1, -1)} plain={plain} />;
    return part.split(LATIN_RUN).filter(Boolean).map((p, j) =>
      PERSIAN.test(p) || !/[A-Za-zÀ-ÿ_]/.test(p) ? <React.Fragment key={j}>{p}</React.Fragment> : <bdi key={j} dir="ltr" lang="it" className="it">{p.trim()}</bdi>);
  })}</>;
}

export const Label = ({ k }: { k: 'ai' | 'syn' | 'demo' }) => k === 'syn'
  ? <span className="badge syn">SYNTHETIC AUDIO</span>
  : k === 'ai' ? <span className="badge">AI-GENERATED</span> : <span className="badge">DEMO</span>;

export function useSpeechStatus() {
  const [s, set] = useState(speechStatus());
  useEffect(() => whenVoicesReady(() => set(speechStatus())), []);
  return s;
}

export function Play({ t, label = 'پخش', slow }: { t: string; label?: string; slow?: boolean }) {
  const st = useSpeechStatus();
  if (st === 'unsupported') return null;
  return <button type="button" className="btn ghost sm" onClick={() => void speak(t, slow)}>{label}</button>;
}
export const PlayBoth = ({ t }: { t: string }) => <span className="btns"><Play t={t} /><Play t={t} slow label="آهسته" /></span>;

export function AudioNote() {
  const st = useSpeechStatus();
  if (st === 'ready') return <p className="muted small"><Label k="syn" /> {'صدای مصنوعی مرورگر؛ صدای گویشور بومی نیست.'}</p>;
  if (st === 'unsupported') return <p className="notice">این مرورگر خواندن متن را پشتیبانی نمی‌کند. متن و IPA را دنبال کنید.</p>;
  return <p className="notice">صدای ایتالیایی روی این دستگاه پیدا نشد. در آیفون از Settings ← Accessibility ← Spoken Content ← Voices یک صدای Italian نصب کنید. پخش ممکن است کار نکند.</p>;
}

/** Plays a list of lines; reports the active line for highlighting. */
export function useLinePlayer(lines: string[]) {
  const [active, setActive] = useState(-1);
  const cancel = useRef<null | (() => void)>(null);
  const play = (slow: boolean) => { cancel.current?.(); cancel.current = speakLines(lines, slow, setActive); };
  const halt = () => { cancel.current?.(); cancel.current = null; stop(); setActive(-1); };
  useEffect(() => () => { cancel.current?.(); }, []);
  return { active, play, halt };
}

export function Sheet({ onClose, children }: { onClose(): void; children: React.ReactNode }) {
  return <><div className="sheet-back" onClick={onClose} />
    <div className="sheet" role="dialog" aria-modal="true">{children}<button className="btn ghost wide" onClick={onClose}>بستن</button></div></>;
}

export const Sec = ({ title, side, children }: { title: string; side?: React.ReactNode; children: React.ReactNode }) =>
  <section className="sec"><div className="sec-h"><h2>{title}</h2>{side}</div>{children}</section>;

export const Row = ({ title, sub, left, onClick, off }: { title: React.ReactNode; sub?: React.ReactNode; left?: React.ReactNode; onClick?(): void; off?: boolean }) =>
  <button type="button" className={'row' + (off ? ' off' : '')} disabled={off} onClick={onClick}>
    <span className="grow"><span className="title">{title}</span>{sub && <span className="muted small">{sub}</span>}</span>{left}{!off && <span className="chev" aria-hidden="true">{isRtl() ? '‹' : '›'}</span>}
  </button>;

export const Table = ({ head, rows }: { head: string[]; rows: string[][] }) =>
  <div className="tbl"><table dir="ltr"><thead><tr>{head.map((cell, i) => <th key={i}><Rich t={cell} plain /></th>)}</tr></thead>
    <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><Rich t={c} plain /></td>)}</tr>)}</tbody></table></div>;

/* ---- quiz engine ---- */
const norm = (s: string) => s.toLowerCase().replace(/[.,!?;:«»"]/g, '').replace(/[’]/g, "'").replace(/\s+/g, ' ').trim();
const bare = (s: string) => norm(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
export { shuffle };

function shownAnswer(e: Exercise): string {
  return e.k === 'mcq' ? e.opts[e.a] : e.k === 'fill' ? e.a[0] : e.k === 'order' ? e.words.join(' ') : e.it;
}

export interface QuizResult { score: number; total: number; wrong: Exercise[]; weak: string[] }

export function Quiz({ items, onDone, finishLabel = 'پایان' }: { items: Exercise[]; onDone(r: QuizResult): void; finishLabel?: string }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<Exercise[]>([]);
  const [state, setState] = useState<null | { ok: boolean; accent?: boolean; pick?: number }>(null);
  const [text, setText] = useState('');
  const [built, setBuilt] = useState<number[]>([]);
  const e = items[i];
  const pool = useMemo(() => (e?.k === 'order' ? shuffle(e.words.map((w, n) => ({ w, n }))) : []), [e]);
  if (!e) return <p className="notice info">برای این بخش تمرینی نیست.</p>;

  const judge = (ok: boolean, extra: { accent?: boolean; pick?: number } = {}) => {
    setState({ ok, ...extra });
    if (ok) setScore(s => s + 1); else setWrong(w => [...w, e]);
  };
  const checkText = () => {
    const answers = e.k === 'fill' ? e.a : e.k === 'dict' ? [e.it] : [];
    if (answers.some(a => norm(a) === norm(text))) judge(true);
    else if (answers.some(a => bare(a) === bare(text))) judge(true, { accent: true });
    else judge(false);
  };
  const next = () => {
    if (i + 1 >= items.length) {
      const weak = [...new Set(wrong.map(w => w.tag).filter(Boolean) as string[])];
      onDone({ score, total: items.length, wrong, weak });
      return;
    }
    setI(i + 1); setState(null); setText(''); setBuilt([]);
  };
  const q = e.k === 'order' ? 'جمله را بسازید: ' + e.fa : e.k === 'dict' ? 'بشنوید و بنویسید.' : e.q;

  return <div className="card">
    <p className="muted small">پرسش {fa(i + 1)} از {fa(items.length)}</p>
    <p><Rich t={q} /></p>
    {e.k === 'fill' && e.fa && <p className="muted"><Rich t={e.fa} /></p>}
    {e.k === 'mcq' && e.say && <Play t={e.say} />}
    {e.k === 'dict' && <PlayBoth t={e.it} />}
    {e.k === 'mcq' && <div className="opts">{e.opts.map((o, n) => {
      const cls = state ? (n === e.a ? ' right' : n === state.pick ? ' wrong' : '') : '';
      return <button key={n} className={'opt' + cls} disabled={!!state} onClick={() => judge(n === e.a, { pick: n })}><Rich t={o} plain /></button>;
    })}</div>}
    {(e.k === 'fill' || e.k === 'dict') && <>
      <input id={`q-${i}`} className="field" dir="ltr" lang="it" autoCapitalize="none" autoCorrect="off" spellCheck={false} aria-label="پاسخ" value={text} disabled={!!state}
        onChange={ev => setText(ev.target.value)} onKeyDown={ev => { if (ev.key === 'Enter' && text.trim() && !state) checkText(); }} />
      {!state && <button className="btn" disabled={!text.trim()} onClick={checkText}>بررسی</button>}
    </>}
    {e.k === 'order' && <>
      <div className="slot">{built.map(n => <button key={n} className="chip word" disabled={!!state} onClick={() => setBuilt(built.filter(x => x !== n))}>{e.words[n]}</button>)}</div>
      <div className="chips" dir="ltr">{pool.filter(p => !built.includes(p.n)).map(p => <button key={p.n} className="chip word" disabled={!!state} onClick={() => setBuilt([...built, p.n])}>{p.w}</button>)}</div>
      {!state && <button className="btn" disabled={built.length !== e.words.length} onClick={() => judge(norm(built.map(n => e.words[n]).join(' ')) === norm(e.words.join(' ')))}>بررسی</button>}
    </>}
    {state && <div className={'notice ' + (state.ok ? 'good' : 'bad')} role="status">
      <b>{state.ok ? 'درست است.' : 'نادرست است.'}</b>{' '}
      {!state.ok && <>پاسخ: <bdi dir="ltr" className="it">{shownAnswer(e)}</bdi>. </>}
      <Rich t={e.why} />{state.accent && <> به علامت‌های تکیه دقت کنید: <bdi dir="ltr" className="it">{shownAnswer(e)}</bdi>.</>}
    </div>}
    {state && <button className="btn" onClick={next}>{i + 1 >= items.length ? finishLabel : 'پرسش بعدی'}</button>}
  </div>;
}

export function QuizSummary({ r }: { r: QuizResult }) {
  return <div className="card">
    <h3>نتیجه: {fa(r.score)} از {fa(r.total)}</h3>
    {r.weak.length > 0 && <p className="muted">مباحث نیازمند مرور: <Rich t={r.weak.map(tr).join(isRtl() ? '، ' : ', ')} plain /></p>}
    {r.wrong.map((w, i) => <div key={i} className="notice bad"><Rich t={w.k === 'order' ? w.fa : w.k === 'dict' ? w.fa : w.q} plain /><br />پاسخ: <bdi dir="ltr" className="it">{shownAnswer(w)}</bdi><br /><Rich t={w.why} plain /></div>)}
  </div>;
}

/* ---- learner recording: live capture when allowed, otherwise an audio file ---- */
export function Recorder({ reference, onRecorded }: { reference?: string; onRecorded?(): void }) {
  const [phase, setPhase] = useState<'idle' | 'rec' | 'denied'>('idle');
  const [url, setUrl] = useState('');
  const mr = useRef<MediaRecorder | null>(null);
  const api = hasRecorderApi();
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  const take = (blob: Blob) => { setUrl(URL.createObjectURL(blob)); onRecorded?.(); };
  const start = async () => {
    try {
      stop();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = recorderMime();
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      const chunks: Blob[] = [];
      rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      rec.onstop = () => { stream.getTracks().forEach(t => t.stop()); take(new Blob(chunks, { type: rec.mimeType })); setPhase('idle'); };
      rec.start(); mr.current = rec; setPhase('rec');
    } catch { setPhase('denied'); }
  };
  const useFile = !api || phase === 'denied';
  return <div className="card">
    <h3>ضبط و مقایسه</h3>
    {api && phase !== 'denied' && <div className="btns">
      {phase === 'idle' ? <button className="btn quiet" onClick={start}>{url ? 'ضبط دوباره' : 'شروع ضبط'}</button>
        : <button className="btn danger" onClick={() => mr.current?.stop()}>پایان ضبط</button>}
      {reference && <Play t={reference} label="صدای مرجع" />}
    </div>}
    {useFile && <>
      <p className="notice">{inArtifact() ? 'ضبط مستقیم در این صفحه مجاز نیست.' : 'دسترسی به میکروفون ممکن نشد. اگر رد کرده‌اید، در تنظیمات Safari آن را فعال کنید.'} می‌توانید با Voice Memos صدایتان را ضبط کنید و فایل را اینجا انتخاب کنید.</p>
      <div className="btns"><label className="btn quiet" htmlFor="audio-file">انتخاب فایل صدا</label>{reference && <Play t={reference} label="صدای مرجع" />}</div>
      <input id="audio-file" hidden type="file" accept="audio/*" onChange={e => { const f = e.target.files?.[0]; if (f) take(f); }} />
    </>}
    {url && <audio controls src={url} style={{ width: '100%' }} />}
    <p className="muted small">این ابزار تلفظ شما را نمره نمی‌دهد. صدای خود را با مرجع مقایسه کنید. صدا فقط در همین صفحه می‌ماند و ذخیره نمی‌شود.</p>
  </div>;
}
