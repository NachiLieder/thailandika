import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DEFAULT_PROGRESS,
  DEFAULT_SETTINGS,
  KEYS,
  clearAll,
  loadJSON,
  saveJSON,
  validateProgress,
  validateSettings,
} from '../storage/storage';
import { ActiveQuiz, AppSettings, Badge, QuizResult, UserProgress } from '../data/types';
import { CATEGORIES } from '../data/categories';
import { QUESTIONS_PER_QUIZ } from '../data/questions';

type AppStateValue = {
  ready: boolean;
  progress: UserProgress;
  settings: AppSettings;
  setUserName: (name: string) => Promise<void>;
  markItemViewed: (itemId: string) => void;
  saveActiveQuiz: (active: ActiveQuiz) => void;
  completeQuiz: (categoryId: string, score: number) => Promise<QuizResult>;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
  resetProgress: () => Promise<void>;
  recordStudyTime: (seconds: number) => void;
  badges: Badge[];
  minutesToday: number;
  streakDays: number;
  overallPercent: number;
  bestPoints: number;
  maxPoints: number;
  lastResultFor: (categoryId: string) => QuizResult | undefined;
  bestScoreFor: (categoryId: string) => number;
  categoryStatus: (categoryId: string) => 'new' | 'in-progress' | 'completed';
  totalCorrect: number;
  completedLessons: number;
};

const AppStateContext = createContext<AppStateValue | null>(null);

const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const daysBetween = (a: string, b: string) => {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const da = Date.UTC(ay, am - 1, ad);
  const db = Date.UTC(by, bm - 1, bd);
  return Math.round((db - da) / 86400000);
};

/** שומר רק את 14 הימים האחרונים, כדי שהאחסון לא יגדל בלי גבול */
const trimStudySeconds = (map: Record<string, number>, today: string) => {
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(map)) {
    const diff = daysBetween(key, today);
    if (diff >= 0 && diff < 14) out[key] = value;
  }
  return out;
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    let alive = true;
    (async () => {
      const [p, s] = await Promise.all([
        loadJSON(KEYS.progress, validateProgress),
        loadJSON(KEYS.settings, validateSettings),
      ]);
      if (!alive) return;
      const today = toKey(new Date());
      let next = p;
      if (p.lastActiveDate !== today) {
        const gap = p.lastActiveDate ? daysBetween(p.lastActiveDate, today) : null;
        const streakDays = gap === 1 ? p.streakDays + 1 : 1;
        next = {
          ...p,
          lastActiveDate: today,
          streakDays,
          studySeconds: trimStudySeconds(p.studySeconds, today),
        };
        void saveJSON(KEYS.progress, next);
      }
      progressRef.current = next;
      setProgress(next);
      setSettings(s);
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const persist = useCallback((next: UserProgress) => {
    progressRef.current = next;
    setProgress(next);
    void saveJSON(KEYS.progress, next);
  }, []);

  const setUserName = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const next = { ...progressRef.current, userName: trimmed };
      persist(next);
      await saveJSON(KEYS.user, { userName: trimmed });
    },
    [persist],
  );

  const markItemViewed = useCallback(
    (itemId: string) => {
      const current = progressRef.current;
      if (current.viewedItemIds.includes(itemId)) return;
      persist({ ...current, viewedItemIds: [...current.viewedItemIds, itemId] });
    },
    [persist],
  );

  /** נצבר בזמן שהמשתמשת נמצאת במסך לימוד או חידון */
  const recordStudyTime = useCallback(
    (seconds: number) => {
      if (seconds <= 0) return;
      const current = progressRef.current;
      const today = toKey(new Date());
      const prev = current.studySeconds[today] ?? 0;
      persist({
        ...current,
        studySeconds: { ...current.studySeconds, [today]: prev + Math.round(seconds) },
      });
    },
    [persist],
  );

  const saveActiveQuiz = useCallback(
    (active: ActiveQuiz) => {
      persist({ ...progressRef.current, activeQuiz: active });
    },
    [persist],
  );

  const completeQuiz = useCallback(
    async (categoryId: string, score: number) => {
      const current = progressRef.current;
      const result: QuizResult = {
        id: `${categoryId}-${Date.now()}`,
        categoryId,
        score,
        total: QUESTIONS_PER_QUIZ,
        completedAt: new Date().toISOString(),
      };
      const completed = current.completedCategoryIds.includes(categoryId)
        ? current.completedCategoryIds
        : [...current.completedCategoryIds, categoryId];
      persist({
        ...current,
        results: [...current.results, result],
        completedCategoryIds: completed,
        activeQuiz: null,
      });
      return result;
    },
    [persist],
  );

  const updateSettings = useCallback(
    async (patch: Partial<AppSettings>) => {
      const next = { ...settings, ...patch };
      setSettings(next);
      await saveJSON(KEYS.settings, next);
    },
    [settings],
  );

  const resetProgress = useCallback(async () => {
    const name = progressRef.current.userName;
    const next: UserProgress = { ...DEFAULT_PROGRESS, userName: name };
    persist(next);
    setSettings(DEFAULT_SETTINGS);
    await clearAll();
    await saveJSON(KEYS.progress, next);
    await saveJSON(KEYS.user, { userName: name });
  }, [persist]);

  const lastResultFor = useCallback(
    (categoryId: string) =>
      [...progress.results].reverse().find((r) => r.categoryId === categoryId),
    [progress.results],
  );

  const bestScoreFor = useCallback(
    (categoryId: string) =>
      progress.results
        .filter((r) => r.categoryId === categoryId)
        .reduce((max, r) => Math.max(max, r.score), 0),
    [progress.results],
  );

  const categoryStatus = useCallback(
    (categoryId: string): 'new' | 'in-progress' | 'completed' => {
      if (progress.completedCategoryIds.includes(categoryId)) return 'completed';
      if (progress.activeQuiz?.categoryId === categoryId) return 'in-progress';
      const seen = progress.viewedItemIds.some((id) => id.startsWith(`${categoryId}-`));
      return seen ? 'in-progress' : 'new';
    },
    [progress],
  );

  const totalCorrect = useMemo(
    () => progress.results.reduce((sum, r) => sum + r.score, 0),
    [progress.results],
  );

  const completedLessons = progress.completedCategoryIds.length;

  const maxPoints = CATEGORIES.length * QUESTIONS_PER_QUIZ;
  const bestPoints = useMemo(
    () =>
      CATEGORIES.reduce(
        (sum, c) =>
          sum +
          progress.results
            .filter((r) => r.categoryId === c.id)
            .reduce((max, r) => Math.max(max, r.score), 0),
        0,
      ),
    [progress.results],
  );
  const overallPercent = maxPoints > 0 ? Math.round((bestPoints / maxPoints) * 100) : 0;

  const minutesToday = useMemo(() => {
    const today = toKey(new Date());
    return Math.round((progress.studySeconds[today] ?? 0) / 60);
  }, [progress.studySeconds]);

  const badges = useMemo<Badge[]>(
    () => [
      {
        id: 'beginner',
        titleHe: 'לומדת מתחילה',
        descriptionHe: 'סיימת את השיעור הראשון שלך',
        tone: 'rose',
        unlocked: progress.completedCategoryIds.length >= 1,
      },
      {
        id: 'wordster',
        titleHe: 'מוכרת מילים',
        descriptionHe: 'למדת 20 מילים וביטויים',
        tone: 'gold',
        unlocked: progress.viewedItemIds.length >= 20,
      },
      {
        id: 'quizChampion',
        titleHe: 'אלופת חידונים',
        descriptionHe: 'השגת ציון מושלם של 10 מתוך 10',
        tone: 'violet',
        unlocked: progress.results.some((r) => r.score >= QUESTIONS_PER_QUIZ),
      },
    ],
    [progress.completedCategoryIds.length, progress.viewedItemIds.length, progress.results],
  );

  const value = useMemo<AppStateValue>(
    () => ({
      ready,
      progress,
      settings,
      setUserName,
      markItemViewed,
      recordStudyTime,
      saveActiveQuiz,
      completeQuiz,
      updateSettings,
      resetProgress,
      lastResultFor,
      bestScoreFor,
      categoryStatus,
      totalCorrect,
      completedLessons,
      badges,
      minutesToday,
      streakDays: progress.streakDays,
      overallPercent,
      bestPoints,
      maxPoints,
    }),
    [
      ready,
      progress,
      settings,
      setUserName,
      markItemViewed,
      recordStudyTime,
      saveActiveQuiz,
      completeQuiz,
      updateSettings,
      resetProgress,
      lastResultFor,
      bestScoreFor,
      categoryStatus,
      totalCorrect,
      completedLessons,
      badges,
      minutesToday,
      overallPercent,
      bestPoints,
      maxPoints,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = (): AppStateValue => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
};

export const TOTAL_CATEGORIES = CATEGORIES.length;
