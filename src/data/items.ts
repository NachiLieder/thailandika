import { LearningItem } from './types';

/**
 * audio = null פירושו שאין עדיין הקלטה מקורית של דובר/ת תאילנדית.
 * המבנה המצופה לקבצים עתידיים: assets/audio/{categoryId}/{itemId}.mp3
 * כאשר קיים קובץ, יש לרשום אותו כאן ולהוסיף אותו למפת AUDIO_FILES ב-src/audio/audioAssets.ts
 */
export const ITEMS: LearningItem[] = [
  // ===== יחידה 1: מילים חדשות =====
  { id: 'words-1', categoryId: 'words', thai: 'สวัสดี', transliterationHe: 'סַוַדִי', meaningHe: 'שלום', audio: null, exampleNoteHe: 'ברכה לכל שעות היום – גם "שלום" וגם "להתראות".' },
  { id: 'words-2', categoryId: 'words', thai: 'ขอบคุณ', transliterationHe: 'קוֹפּקוּן', meaningHe: 'תודה', audio: null, exampleNoteHe: 'נשים מוסיפות ค่ะ (קַה) וגברים ครับ (קְרַפּ) לנימוס.' },
  { id: 'words-3', categoryId: 'words', thai: 'ใช่', transliterationHe: "צַ'אי", meaningHe: 'כן', audio: null },
  { id: 'words-4', categoryId: 'words', thai: 'ไม่', transliterationHe: 'מַאי', meaningHe: 'לא / לא-', audio: null, exampleNoteHe: 'מילת שלילה שמוצמדת לפני מילים אחרות, למשל ไม่เผ็ด = לא חריף.' },
  { id: 'words-5', categoryId: 'words', thai: 'น้ำ', transliterationHe: 'נַאם', meaningHe: 'מים', audio: null },
  { id: 'words-6', categoryId: 'words', thai: 'กาแฟ', transliterationHe: 'קַפֶה', meaningHe: 'קפה', audio: null },
  { id: 'words-7', categoryId: 'words', thai: 'บ้าน', transliterationHe: 'בַּאן', meaningHe: 'בית', audio: null },
  { id: 'words-8', categoryId: 'words', thai: 'เพื่อน', transliterationHe: 'פְּרוּאָן', meaningHe: 'חבר/ה', audio: null },
  { id: 'words-9', categoryId: 'words', thai: 'ดี', transliterationHe: 'דִי', meaningHe: 'טוב', audio: null },
  { id: 'words-10', categoryId: 'words', thai: 'อร่อย', transliterationHe: 'אָרוֹי', meaningHe: 'טעים', audio: null },

  // ===== יחידה 2: שיחות יומיומיות =====
  { id: 'conversations-1', categoryId: 'conversations', thai: 'สวัสดีค่ะ / สวัสดีครับ', transliterationHe: 'סַוַדִי קַה / קְרַפּ', meaningHe: 'שלום (מנומס)', audio: null, exampleNoteHe: 'ค่ะ בפי אישה, ครับ בפי גבר. זה חלקיק נימוס, לא מילה עם משמעות.' },
  { id: 'conversations-2', categoryId: 'conversations', thai: 'คุณชื่ออะไร', transliterationHe: "קון צ'וּ אָרַאי", meaningHe: 'איך קוראים לך?', audio: null },
  { id: 'conversations-3', categoryId: 'conversations', thai: 'ฉันชื่อ...', transliterationHe: "צַ'אן צ'וּ...", meaningHe: 'קוראים לי...', audio: null, exampleNoteHe: 'ฉัน היא "אני" בפי אישה. גבר יאמר ผม (פּוֹם).' },
  { id: 'conversations-4', categoryId: 'conversations', thai: 'สบายดีไหม', transliterationHe: 'סַבַּאי דִי מַאי', meaningHe: 'מה שלומך?', audio: null },
  { id: 'conversations-5', categoryId: 'conversations', thai: 'สบายดี', transliterationHe: 'סַבַּאי דִי', meaningHe: 'אני בסדר', audio: null },
  { id: 'conversations-6', categoryId: 'conversations', thai: 'ขอโทษ', transliterationHe: 'קוֹ טוֹט', meaningHe: 'סליחה', audio: null },
  { id: 'conversations-7', categoryId: 'conversations', thai: 'ไม่เป็นไร', transliterationHe: 'מַאי פֶּן רַאי', meaningHe: 'אין בעיה / לא נורא', audio: null, exampleNoteHe: 'הביטוי התאילנדי האהוב – תשובה ל"תודה" וגם ל"סליחה".' },
  { id: 'conversations-8', categoryId: 'conversations', thai: 'ยินดีที่ได้รู้จัก', transliterationHe: "יִן דִי תִי דַאי רוּג'ַק", meaningHe: 'נעים להכיר', audio: null },
  { id: 'conversations-9', categoryId: 'conversations', thai: 'ลาก่อน', transliterationHe: 'לָה קוֹן', meaningHe: 'להתראות', audio: null },
  { id: 'conversations-10', categoryId: 'conversations', thai: 'พูดช้าๆ ได้ไหม', transliterationHe: "פּוּט צָ'ה צָ'ה דַאי מַאי", meaningHe: 'אפשר לדבר לאט?', audio: null, exampleNoteHe: 'משפט הצלה אמיתי בשיחה ראשונה.' },

  // ===== יחידה 3: אוכל ומסעדות =====
  { id: 'food-1', categoryId: 'food', thai: 'เมนู', transliterationHe: 'מֶנוּ', meaningHe: 'תפריט', audio: null },
  { id: 'food-2', categoryId: 'food', thai: 'ข้าว', transliterationHe: 'קַאו', meaningHe: 'אורז', audio: null },
  { id: 'food-3', categoryId: 'food', thai: 'ไก่', transliterationHe: 'גַאי', meaningHe: 'עוף', audio: null },
  { id: 'food-4', categoryId: 'food', thai: 'ปลา', transliterationHe: 'פְּלָא', meaningHe: 'דג', audio: null },
  { id: 'food-5', categoryId: 'food', thai: 'ผัก', transliterationHe: 'פַּק', meaningHe: 'ירקות', audio: null },
  { id: 'food-6', categoryId: 'food', thai: 'น้ำเปล่า', transliterationHe: 'נַאם פְּלָאו', meaningHe: 'מים רגילים', audio: null },
  { id: 'food-7', categoryId: 'food', thai: 'ไม่เผ็ด', transliterationHe: 'מַאי פֶּט', meaningHe: 'לא חריף', audio: null, exampleNoteHe: 'שווה לומר את זה מראש – "לא חריף" בתאילנד עדיין יכול להיות חריף.' },
  { id: 'food-8', categoryId: 'food', thai: 'อร่อยมาก', transliterationHe: 'אָרוֹי מַאק', meaningHe: 'טעים מאוד', audio: null },
  { id: 'food-9', categoryId: 'food', thai: 'คิดเงินด้วย', transliterationHe: 'קִיט נְגֶן דוּאַי', meaningHe: 'חשבון בבקשה', audio: null },
  { id: 'food-10', categoryId: 'food', thai: 'เท่าไหร่', transliterationHe: 'טַאו רַאי', meaningHe: 'כמה זה עולה?', audio: null },

  // ===== יחידה 4: טיולים והתמצאות =====
  { id: 'travel-1', categoryId: 'travel', thai: 'โรงแรม', transliterationHe: 'רוֹנג רֶם', meaningHe: 'מלון', audio: null },
  { id: 'travel-2', categoryId: 'travel', thai: 'สนามบิน', transliterationHe: "סַנַאם בִּין", meaningHe: 'שדה תעופה', audio: null },
  { id: 'travel-3', categoryId: 'travel', thai: 'ห้องน้ำ', transliterationHe: 'הוֹנג נַאם', meaningHe: 'שירותים', audio: null, exampleNoteHe: 'מילולית "חדר מים" – ห้อง חדר, น้ำ מים.' },
  { id: 'travel-4', categoryId: 'travel', thai: 'ไปที่นี่', transliterationHe: 'פַּאי תִי נִי', meaningHe: 'לך/י לכאן', audio: null, exampleNoteHe: 'שימושי מול נהג מונית, יחד עם הצבעה על מפה.' },
  { id: 'travel-5', categoryId: 'travel', thai: 'อยู่ที่ไหน', transliterationHe: 'יוּ תִי נַאי', meaningHe: 'איפה נמצא/ת?', audio: null },
  { id: 'travel-6', categoryId: 'travel', thai: 'ซ้าย', transliterationHe: 'סַאי', meaningHe: 'שמאלה', audio: null },
  { id: 'travel-7', categoryId: 'travel', thai: 'ขวา', transliterationHe: 'קְוָה', meaningHe: 'ימינה', audio: null },
  { id: 'travel-8', categoryId: 'travel', thai: 'ตรงไป', transliterationHe: 'טְרוֹנג פַּאי', meaningHe: 'ישר', audio: null },
  { id: 'travel-9', categoryId: 'travel', thai: 'รถแท็กซี่', transliterationHe: 'רוֹט טֶקְסִי', meaningHe: 'מונית', audio: null },
  { id: 'travel-10', categoryId: 'travel', thai: 'ช่วยด้วย', transliterationHe: "צ'וּאַי דוּאַי", meaningHe: 'עזרה בבקשה', audio: null },

  // ===== יחידה 5: מספרים =====
  { id: 'numbers-1', categoryId: 'numbers', thai: 'หนึ่ง', transliterationHe: 'נוּנג', meaningHe: 'אחת', audio: null },
  { id: 'numbers-2', categoryId: 'numbers', thai: 'สอง', transliterationHe: 'סוֹנג', meaningHe: 'שתיים', audio: null },
  { id: 'numbers-3', categoryId: 'numbers', thai: 'สาม', transliterationHe: 'סַאם', meaningHe: 'שלוש', audio: null },
  { id: 'numbers-4', categoryId: 'numbers', thai: 'สี่', transliterationHe: 'סִי', meaningHe: 'ארבע', audio: null },
  { id: 'numbers-5', categoryId: 'numbers', thai: 'ห้า', transliterationHe: 'הָא', meaningHe: 'חמש', audio: null },
  { id: 'numbers-6', categoryId: 'numbers', thai: 'หก', transliterationHe: 'הוֹק', meaningHe: 'שש', audio: null },
  { id: 'numbers-7', categoryId: 'numbers', thai: 'เจ็ด', transliterationHe: "גֶ'ט", meaningHe: 'שבע', audio: null },
  { id: 'numbers-8', categoryId: 'numbers', thai: 'แปด', transliterationHe: 'פֶּט', meaningHe: 'שמונה', audio: null },
  { id: 'numbers-9', categoryId: 'numbers', thai: 'เก้า', transliterationHe: 'גָאו', meaningHe: 'תשע', audio: null },
  { id: 'numbers-10', categoryId: 'numbers', thai: 'สิบ', transliterationHe: 'סִיפּ', meaningHe: 'עשר', audio: null },
];

export const getItem = (id?: string | null): LearningItem | undefined =>
  ITEMS.find((i) => i.id === id);

export const getItemsByCategory = (categoryId: string): LearningItem[] =>
  ITEMS.filter((i) => i.categoryId === categoryId);

/** יחידת משחקי הידע מתבססת על אוצר המילים של היחידות הקודמות */
export const GAME_ITEM_IDS = [
  'words-5',
  'words-2',
  'travel-6',
  'food-7',
  'travel-1',
  'numbers-3',
  'words-10',
  'travel-3',
  'words-8',
  'food-10',
];

export const getGameItems = (): LearningItem[] =>
  GAME_ITEM_IDS.map((id) => getItem(id)).filter(Boolean) as LearningItem[];

/** כל הפריטים שהמשתמשת רואה בכרטיסי הלימוד של קטגוריה */
export const getLessonItems = (categoryId: string): LearningItem[] =>
  categoryId === 'games' ? getGameItems() : getItemsByCategory(categoryId);

/** רשימת נכסי שמע חסרים – לתיעוד ולמעקב */
export const missingAudioItems = (): LearningItem[] => ITEMS.filter((i) => !i.audio);
