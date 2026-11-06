import { LearningCategory } from './types';

export const CATEGORIES: LearningCategory[] = [
  {
    id: 'words',
    titleHe: 'מילים חדשות',
    descriptionHe: 'ללמוד מילים וביטויים',
    longDescriptionHe:
      'עשר מילות יסוד שילוו אותך בכל מקום בתאילנד: שלום, תודה, כן, לא, מים ועוד.',
    icon: 'book',
    colorKey: 'mango',
    lessonIds: ['words-1'],
  },
  {
    id: 'conversations',
    titleHe: 'שיחות יומיומיות',
    descriptionHe: 'לדבר כמו מקומית',
    longDescriptionHe:
      'ברכות, היכרות ובקשות קטנות – כל מה שצריך כדי לפתוח שיחה ולהרגיש בנוח.',
    icon: 'chat',
    colorKey: 'lotus',
    lessonIds: ['conversations-1'],
  },
  {
    id: 'food',
    titleHe: 'אוכל ומסעדות',
    descriptionHe: 'להזמין ולהתענג',
    longDescriptionHe:
      'תפריט, מנות בסיס, בקשה ללא חריף ובקשת החשבון – השיעור הכי טעים כאן.',
    icon: 'food',
    colorKey: 'sand',
    lessonIds: ['food-1'],
  },
  {
    id: 'travel',
    titleHe: 'טיולים והתמצאות',
    descriptionHe: 'להסתדר בתאילנד',
    longDescriptionHe:
      'מלון, שדה תעופה, שירותים וכיווני דרך – כדי להגיע לכל מקום בלי להילחץ.',
    icon: 'temple',
    colorKey: 'turquoise',
    lessonIds: ['travel-1'],
  },
  {
    id: 'numbers',
    titleHe: 'מספרים',
    descriptionHe: 'לספור בתאילנדית',
    longDescriptionHe:
      'מאחת עד עשר – בסיס להבנת מחירים, כמויות ומיקוח נעים בשוק.',
    icon: 'numbers',
    colorKey: 'violet',
    lessonIds: ['numbers-1'],
  },
  {
    id: 'games',
    titleHe: 'משחקי ידע',
    descriptionHe: 'ללמוד בכיף ובמשחק',
    longDescriptionHe:
      'חידון מעורב שמשלב הקשבה, זיהוי מילים וסיטואציות מכל מה שלמדת עד כה.',
    icon: 'game',
    colorKey: 'leaf',
    lessonIds: ['games-1'],
  },
];

export const getCategory = (id?: string | null): LearningCategory | undefined =>
  CATEGORIES.find((c) => c.id === id);
