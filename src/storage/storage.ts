import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, QuizResult, UserProgress, ActiveQuiz } from '../data/types';

export const KEYS = {
  user: 'thailandika:user',
  progress: 'thailandika:progress',
  settings: 'thailandika:settings',
};

export const DEFAULT_PROGRESS: UserProgress = {
  userName: '',
  completedCategoryIds: [],
  results: [],
  activeQuiz: null,
  viewedItemIds: [],
  lastActiveDate: null,
  streakDays: 0,
  studySeconds: {},
};

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  speechRate: 0.75,
};

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string');

const validateResult = (r: any): QuizResult | null => {
  if (!r || typeof r !== 'object') return null;
  if (typeof r.categoryId !== 'string') return null;
  const score = Number(r.score);
  const total = Number(r.total);
  if (!Number.isFinite(score) || !Number.isFinite(total) || total <= 0) return null;
  return {
    id: typeof r.id === 'string' ? r.id : `${r.categoryId}-${Date.now()}`,
    categoryId: r.categoryId,
    score: Math.max(0, Math.min(total, Math.round(score))),
    total: Math.round(total),
    completedAt: typeof r.completedAt === 'string' ? r.completedAt : new Date().toISOString(),
  };
};

const validateActiveQuiz = (a: any): ActiveQuiz => {
  if (!a || typeof a !== 'object') return null;
  if (typeof a.categoryId !== 'string') return null;
  const questionIndex = Number(a.questionIndex);
  const score = Number(a.score);
  if (!Number.isFinite(questionIndex) || !Number.isFinite(score)) return null;
  return {
    categoryId: a.categoryId,
    questionIndex: Math.max(0, Math.round(questionIndex)),
    score: Math.max(0, Math.round(score)),
  };
};

const validateStudySeconds = (raw: any): Record<string, number> => {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw)) {
    const n = Number(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(key) && Number.isFinite(n) && n >= 0) {
      out[key] = Math.round(n);
    }
  }
  return out;
};

export const validateProgress = (raw: unknown): UserProgress => {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_PROGRESS };
  const r = raw as any;
  return {
    userName: typeof r.userName === 'string' ? r.userName : '',
    completedCategoryIds: isStringArray(r.completedCategoryIds) ? r.completedCategoryIds : [],
    results: Array.isArray(r.results)
      ? (r.results.map(validateResult).filter(Boolean) as QuizResult[])
      : [],
    activeQuiz: validateActiveQuiz(r.activeQuiz),
    viewedItemIds: isStringArray(r.viewedItemIds) ? r.viewedItemIds : [],
    lastActiveDate: typeof r.lastActiveDate === 'string' ? r.lastActiveDate : null,
    streakDays: Number.isFinite(Number(r.streakDays)) ? Math.max(0, Math.round(Number(r.streakDays))) : 0,
    studySeconds: validateStudySeconds(r.studySeconds),
  };
};

export const validateSettings = (raw: unknown): AppSettings => {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_SETTINGS };
  const r = raw as any;
  const rate = Number(r.speechRate);
  return {
    soundEnabled: typeof r.soundEnabled === 'boolean' ? r.soundEnabled : true,
    speechRate: Number.isFinite(rate) && rate >= 0.3 && rate <= 1.2 ? rate : DEFAULT_SETTINGS.speechRate,
  };
};

export async function loadJSON<T>(key: string, validate: (raw: unknown) => T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return validate(undefined);
    return validate(JSON.parse(raw));
  } catch {
    return validate(undefined);
  }
}

export async function saveJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // כשל כתיבה לא אמור להפיל את האפליקציה; ההתקדמות פשוט לא תישמר
  }
}

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([KEYS.user, KEYS.progress, KEYS.settings]);
  } catch {
    /* noop */
  }
}
