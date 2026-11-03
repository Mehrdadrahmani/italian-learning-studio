import { getState } from './store';

export type SpeechStatus = 'unsupported' | 'no-italian' | 'ready';
const synth = (): SpeechSynthesis | null => ('speechSynthesis' in window ? window.speechSynthesis : null);

export function italianVoices(): SpeechSynthesisVoice[] {
  const s = synth();
  if (!s) return [];
  return s.getVoices().filter(v => v.lang.toLowerCase().replace('_', '-').startsWith('it'));
}

export function speechStatus(): SpeechStatus {
  if (!synth()) return 'unsupported';
  return italianVoices().length ? 'ready' : 'no-italian';
}

/** Voices load asynchronously on iOS; resolves once listed or after a short wait. */
export function whenVoicesReady(cb: () => void): () => void {
  const s = synth();
  if (!s) { cb(); return () => {}; }
  const on = () => cb();
  s.addEventListener?.('voiceschanged', on);
  const t = window.setTimeout(on, 900);
  on();
  return () => { s.removeEventListener?.('voiceschanged', on); clearTimeout(t); };
}

function voice(): SpeechSynthesisVoice | undefined {
  const list = italianVoices();
  return list.find(v => v.voiceURI === getState().settings.voiceURI) ?? list[0];
}

function utter(text: string, slow: boolean): SpeechSynthesisUtterance {
  const u = new SpeechSynthesisUtterance(text);
  const { rate, slowRate } = getState().settings;
  const v = voice();
  if (v) u.voice = v;
  u.lang = v?.lang ?? 'it-IT';
  u.rate = slow ? slowRate : rate;
  return u;
}

export function stop(): void { synth()?.cancel(); }

/** Must be called from a tap on iOS. Resolves false when speech fails. */
export function speak(text: string, slow = false): Promise<boolean> {
  const s = synth();
  if (!s) return Promise.resolve(false);
  s.cancel();
  return new Promise(res => {
    const u = utter(text, slow);
    u.onend = () => res(true);
    u.onerror = e => res(e.error === 'canceled' || e.error === 'interrupted');
    s.speak(u);
  });
}

/** Plays lines one after another; onLine reports the active index, -1 when finished. */
export function speakLines(lines: string[], slow: boolean, onLine: (i: number) => void): () => void {
  const s = synth();
  if (!s || !lines.length) { onLine(-1); return () => {}; }
  s.cancel();
  let i = 0, stopped = false;
  const next = () => {
    if (stopped) return;
    if (i >= lines.length) { onLine(-1); return; }
    onLine(i);
    const u = utter(lines[i], slow);
    i += 1;
    u.onend = next;
    u.onerror = () => { if (!stopped) onLine(-1); };
    s.speak(u);
  };
  next();
  return () => { stopped = true; s.cancel(); onLine(-1); };
}
