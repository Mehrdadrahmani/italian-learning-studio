/* Live capability detection. Nothing here assumes a feature works. */
export type ClaudeRuntime = { use(name: string): Promise<any> };
declare global { interface Window { claude?: ClaudeRuntime; webkitAudioContext?: unknown } }

export const inArtifact = (): boolean => typeof window !== 'undefined' && !!window.claude;

export async function capability<T = any>(name: string): Promise<T | null> {
  if (!window.claude) return null;
  try { return await window.claude.use(name); } catch { return null; }
}

export const isStandalone = (): boolean =>
  (navigator as any).standalone === true || window.matchMedia?.('(display-mode: standalone)').matches;

export const isIOS = (): boolean =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const isNative = (): boolean => !!(window as any).Capacitor?.isNativePlatform?.();

export const hasRecorderApi = (): boolean =>
  !!navigator.mediaDevices?.getUserMedia && typeof window.MediaRecorder !== 'undefined';

export function recorderMime(): string {
  for (const m of ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm']) {
    if (MediaRecorder.isTypeSupported?.(m)) return m;
  }
  return '';
}
