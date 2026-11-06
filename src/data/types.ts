export type ColorKey = 'lotus' | 'mango' | 'turquoise' | 'leaf' | 'sand' | 'violet';

export type LearningCategory = {
  id: string;
  titleHe: string;
  descriptionHe: string;
  longDescriptionHe: string;
  icon: string;
  colorKey: ColorKey;
  lessonIds: string[];
};

export type LearningItem = {
  id: string;
  categoryId: string;
  thai: string;
  transliterationHe: string;
  meaningHe: string;
  /** נתיב לקובץ שמע מוקלט, או null כל עוד אין הקלטה מקורית */
  audio: string | null;
  exampleNoteHe?: string;
};

export type QuizOption = {
  id: string;
  labelHe?: string;
  labelThai?: string;
};

export type QuizKind = 'thai-to-he' | 'he-to-thai' | 'listening' | 'situation';

export type QuizQuestion = {
  id: string;
  categoryId: string;
  kind: QuizKind;
  promptHe: string;
  promptThai?: string;
  /** מזהה הפריט שאליו השאלה מתייחסת – משמש גם להשמעת השמע */
  itemId?: string;
  audio?: string | null;
  options: QuizOption[];
  correctOptionId: string;
  explanationHe?: string;
};

export type QuizResult = {
  id: string;
  categoryId: string;
  score: number;
  total: number;
  completedAt: string;
};

export type ActiveQuiz = {
  categoryId: string;
  questionIndex: number;
  score: number;
} | null;

export type UserProgress = {
  userName: string;
  completedCategoryIds: string[];
  results: QuizResult[];
  activeQuiz: ActiveQuiz;
  viewedItemIds: string[];
  /** תאריך הפעילות האחרון, בפורמט YYYY-MM-DD */
  lastActiveDate: string | null;
  /** רצף ימי לימוד */
  streakDays: number;
  /** שניות לימוד לפי תאריך; נשמרים 14 הימים האחרונים */
  studySeconds: Record<string, number>;
};

export type BadgeId = 'beginner' | 'wordster' | 'quizChampion';

export type Badge = {
  id: BadgeId;
  titleHe: string;
  descriptionHe: string;
  tone: 'gold' | 'rose' | 'violet';
  unlocked: boolean;
};

export type AppSettings = {
  soundEnabled: boolean;
  speechRate: number;
};
