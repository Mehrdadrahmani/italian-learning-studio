export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export type ContentLabel = 'VERIFIED' | 'AI-GENERATED' | 'AI-REVIEWED' | 'COMMUNITY AUDIO' | 'SYNTHETIC AUDIO' | 'UNVERIFIED';

export interface Conjugation { io: string; tu: string; lui: string; noi: string; voi: string; loro: string; pp?: string }

export interface Vocab {
  id: string; it: string; art?: string; g?: 'm' | 'f'; pl?: string; pos: string;
  fa: string; en: string; ipa?: string; exIt: string; exFa: string;
  topic: string; level: Level; col: string[]; rel: string[];
  verb?: Conjugation; label: ContentLabel;
}

export type Exercise =
  | { k: 'mcq'; q: string; opts: string[]; a: number; why: string; tag?: string; say?: string }
  | { k: 'fill'; q: string; a: string[]; why: string; tag?: string; fa?: string }
  | { k: 'order'; fa: string; words: string[]; why: string; tag?: string }
  | { k: 'dict'; it: string; fa: string; why: string; tag?: string };

export interface PronExample { it: string; ipa: string; fa: string; tr: string }
export interface PronRule {
  id: string; group: string; title: string; ipa?: string; mouth: string;
  examples: PronExample[]; pairs?: [string, string][]; errors: string; diff?: string; quiz: Exercise[];
}

export interface GrammarTopic {
  id: string; level: Level; title: string; it: string; what: string; when: string;
  rules: string[]; table?: { head: string[]; rows: string[][] };
  examples: { it: string; fa: string; kind?: 'مثبت' | 'منفی' | 'پرسشی' }[];
  mistakes: { bad: string; good: string; why: string }[];
  compare?: string; ex: Exercise[]; pattern: { front: string; back: string };
}

export interface TextLine { sp?: string; it: string; fa: string }
export interface StudyText {
  id: string; level: Level; title: string; it: string; kind: 'گفت‌وگو' | 'متن';
  lines: TextLine[]; gloss: Record<string, string>; grammar: string[]; pron?: string; qs: Exercise[];
}

export interface Lesson {
  id: string; level: Level; title: string; it: string; goal: string; intro: string;
  pron?: string; topics?: string[]; vocabIds?: string[]; vocabLimit?: number; grammar?: string[]; text?: string; ex: Exercise[];
}
export interface PlannedLesson { title: string; note?: string }
export interface Module { title: string; lessons: Lesson[]; planned?: PlannedLesson[] }
export interface LevelPlan {
  id: Level; title: string; summary: string; objectives: string[]; themes: string[]; grammar: string[];
  pron: string[]; listening: string; speaking: string; reading: string; writing: string; modules: Module[];
}

export interface ListeningItem { id: string; level: Level; title: string; textId?: string; lines: TextLine[]; keywords: string[]; qs: Exercise[]; gap: { before: string; a: string; after: string }; dict: string; dictFa: string }
export interface SpeakingScenario { id: string; level: Level; title: string; situation: string; role: string; phrases: { it: string; fa: string }[]; model: { sp: string; it: string; fa: string }[]; prompt: string; answers: { it: string; fa: string }[] }
export interface ReadingItem { id: string; level: Level; title: string; textId: string; note: string; qs: Exercise[] }
export interface WritingTask { id: string; level: Level; title: string; prompt: string; hints: string[]; sample: string; sampleFa: string }

export interface SrsCard { due: number; interval: number; ease: number; reps: number; lapses: number; last: number; grade?: Grade }
export type Grade = 'again' | 'hard' | 'good' | 'easy';
export interface DayStat { reviews: number; correct: number; lessons: number; seconds: number; quizzes: number; pron: number }
export interface TestResult { id: string; title: string; kind: string; score: number; total: number; ts: number; weak: string[] }
export interface WritingEntry { id: string; task: string; text: string; ts: number; feedback?: string }

export interface Settings {
  voiceURI: string; rate: number; slowRate: number; showEnglish: boolean; showTranslit: boolean;
  dailyGoal: number; autoplay: boolean; theme: 'system' | 'light' | 'dark'; lang: 'fa' | 'en' | 'it';
}
export interface AppState {
  v: 1; updatedAt: number; settings: Settings;
  lessons: Record<string, { ts: number; score: number; total: number }>;
  srs: Record<string, SrsCard>;
  known: Record<string, number>;
  days: Record<string, DayStat>;
  tests: TestResult[];
  pron: Record<string, { reps: number; quiz?: number; self?: 'good' | 'ok' | 'practice'; ts: number }>;
  done: Record<string, number>;
  writing: WritingEntry[];
  speaking: Record<string, number>;
  recent: string[];
  leitner: Record<string, { box: number; due: number; last: number }>;
  /** Words the learner saved from the dictionary; meanings come from machine translation or the learner. */
  mine: Record<string, MyWord>;
}
export interface MyWord { it: string; fa: string; en: string; ts: number }
