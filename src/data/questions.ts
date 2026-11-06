import { QuizQuestion, QuizKind } from './types';
import { getItem } from './items';

type RawQuestion = {
  n: number;
  kind: QuizKind;
  promptHe: string;
  promptThai?: string;
  itemId?: string;
  /** שפת אפשרויות התשובה */
  lang: 'he' | 'thai';
  /** האפשרות הראשונה היא התשובה הנכונה; הסדר מעורבב בזמן ריצה */
  answers: string[];
  explanationHe?: string;
};

const build = (categoryId: string, raws: RawQuestion[]): QuizQuestion[] =>
  raws.map((r) => {
    const qid = `${categoryId}-q${r.n}`;
    const item = r.itemId ? getItem(r.itemId) : undefined;
    return {
      id: qid,
      categoryId,
      kind: r.kind,
      promptHe: r.promptHe,
      promptThai: r.promptThai,
      itemId: r.itemId,
      audio: item ? item.audio : null,
      options: r.answers.map((label, idx) => ({
        id: `${qid}-o${idx}`,
        labelHe: r.lang === 'he' ? label : undefined,
        labelThai: r.lang === 'thai' ? label : undefined,
      })),
      correctOptionId: `${qid}-o0`,
      explanationHe: r.explanationHe,
    };
  });

// ===== יחידה 1: מילים חדשות =====
const WORDS = build('words', [
  { n: 1, kind: 'thai-to-he', promptHe: 'מה פירוש המילה הזו?', promptThai: 'สวัสดี', itemId: 'words-1', lang: 'he', answers: ['שלום', 'תודה', 'מים', 'טוב'], explanationHe: 'สวัสดี (סַוַדִי) היא הברכה הבסיסית – שלום וגם להתראות.' },
  { n: 2, kind: 'he-to-thai', promptHe: 'איך אומרים "תודה"?', lang: 'thai', answers: ['ขอบคุณ', 'สวัสดี', 'ใช่', 'ดี'], explanationHe: 'ขอบคุณ (קוֹפּקוּן) = תודה.' },
  { n: 3, kind: 'he-to-thai', promptHe: 'איזו מילה פירושה "כן"?', lang: 'thai', answers: ['ใช่', 'ไม่', 'น้ำ', 'ดี'], explanationHe: 'ใช่ (צַ\'אי) = כן.' },
  { n: 4, kind: 'he-to-thai', promptHe: 'איזו מילה פירושה "לא"?', lang: 'thai', answers: ['ไม่', 'ใช่', 'บ้าน', 'กาแฟ'], explanationHe: 'ไม่ (מַאי) היא מילת השלילה, ומוצמדת לפני מילים אחרות.' },
  { n: 5, kind: 'thai-to-he', promptHe: 'מה פירוש המילה הזו?', promptThai: 'น้ำ', itemId: 'words-5', lang: 'he', answers: ['מים', 'קפה', 'בית', 'טעים'], explanationHe: 'น้ำ (נַאם) = מים.' },
  { n: 6, kind: 'he-to-thai', promptHe: 'איך אומרים "קפה"?', lang: 'thai', answers: ['กาแฟ', 'น้ำ', 'เพื่อน', 'บ้าน'], explanationHe: 'กาแฟ (קַפֶה) נשמע כמעט כמו "קפה" בעברית.' },
  { n: 7, kind: 'thai-to-he', promptHe: 'מה פירוש המילה הזו?', promptThai: 'บ้าน', itemId: 'words-7', lang: 'he', answers: ['בית', 'חבר/ה', 'טוב', 'שלום'], explanationHe: 'บ้าน (בַּאן) = בית.' },
  { n: 8, kind: 'he-to-thai', promptHe: 'איזו מילה פירושה "חבר/ה"?', lang: 'thai', answers: ['เพื่อน', 'บ้าน', 'ดี', 'อร่อย'], explanationHe: 'เพื่อน (פְּרוּאָן) = חבר או חברה.' },
  { n: 9, kind: 'thai-to-he', promptHe: 'מה פירוש המילה הזו?', promptThai: 'ดี', itemId: 'words-9', lang: 'he', answers: ['טוב', 'טעים', 'כן', 'מים'], explanationHe: 'ดี (דִי) = טוב. מופיעה גם בתוך สบายดี (אני בסדר).' },
  { n: 10, kind: 'he-to-thai', promptHe: 'איך אומרים "טעים"?', lang: 'thai', answers: ['อร่อย', 'ดี', 'ขอบคุณ', 'น้ำ'], explanationHe: 'อร่อย (אָרוֹי) = טעים. המילה שתשמעי הכי הרבה ליד אוכל.' },
]);

// ===== יחידה 2: שיחות יומיומיות =====
const CONVERSATIONS = build('conversations', [
  { n: 1, kind: 'he-to-thai', promptHe: 'מה אומרים כדי לברך לשלום בנימוס?', lang: 'thai', answers: ['สวัสดีค่ะ / สวัสดีครับ', 'ลาก่อน', 'ขอโทษ', 'สบายดี'], explanationHe: 'ค่ะ בפי אישה, ครับ בפי גבר – חלקיקי נימוס בסוף המשפט.' },
  { n: 2, kind: 'he-to-thai', promptHe: 'איך שואלים "איך קוראים לך?"', lang: 'thai', answers: ['คุณชื่ออะไร', 'ฉันชื่อ...', 'สบายดีไหม', 'อยู่ที่ไหน'], explanationHe: 'คุณ = את/ה, ชื่อ = שם, อะไร = מה.' },
  { n: 3, kind: 'he-to-thai', promptHe: 'איך אומרים "קוראים לי..."?', lang: 'thai', answers: ['ฉันชื่อ...', 'คุณชื่ออะไร', 'ยินดีที่ได้รู้จัก', 'ไม่เป็นไร'], explanationHe: 'ฉัน (צַ\'אן) = אני בפי אישה.' },
  { n: 4, kind: 'thai-to-he', promptHe: 'מה פירוש הביטוי הזה?', promptThai: 'สบายดีไหม', itemId: 'conversations-4', lang: 'he', answers: ['מה שלומך?', 'אני בסדר', 'נעים להכיר', 'להתראות'], explanationHe: 'ไหม בסוף משפט הופך אותו לשאלה.' },
  { n: 5, kind: 'he-to-thai', promptHe: 'איך אומרים "אני בסדר"?', lang: 'thai', answers: ['สบายดี', 'สบายดีไหม', 'ขอโทษ', 'ลาก่อน'], explanationHe: 'אותו ביטוי בלי ไหม – וכבר זו תשובה ולא שאלה.' },
  { n: 6, kind: 'thai-to-he', promptHe: 'מה פירוש הביטוי הזה?', promptThai: 'ขอโทษ', itemId: 'conversations-6', lang: 'he', answers: ['סליחה', 'תודה', 'אין בעיה', 'שלום'], explanationHe: 'ขอโทษ (קוֹ טוֹט) = סליחה, גם כדי להתנצל וגם כדי לפנות למישהו.' },
  { n: 7, kind: 'thai-to-he', promptHe: 'מה פירוש הביטוי הזה?', promptThai: 'ไม่เป็นไร', itemId: 'conversations-7', lang: 'he', answers: ['אין בעיה / לא נורא', 'נעים להכיר', 'מה שלומך?', 'אפשר לדבר לאט?'], explanationHe: 'הביטוי התאילנדי האהוב – תשובה גם ל"תודה" וגם ל"סליחה".' },
  { n: 8, kind: 'he-to-thai', promptHe: 'איך אומרים "נעים להכיר"?', lang: 'thai', answers: ['ยินดีที่ได้รู้จัก', 'สบายดีไหม', 'ลาก่อน', 'ขอบคุณ'], explanationHe: 'ยินดี = בשמחה, รู้จัก = להכיר.' },
  { n: 9, kind: 'thai-to-he', promptHe: 'מה פירוש הביטוי הזה?', promptThai: 'ลาก่อน', itemId: 'conversations-9', lang: 'he', answers: ['להתראות', 'שלום (מנומס)', 'סליחה', 'אני בסדר'], explanationHe: 'ลาก่อน (לָה קוֹן) = להתראות. ביומיום רבים פשוט אומרים สวัสดี.' },
  { n: 10, kind: 'he-to-thai', promptHe: 'איך מבקשים לדבר לאט?', lang: 'thai', answers: ['พูดช้าๆ ได้ไหม', 'คุณชื่ออะไร', 'ไม่เป็นไร', 'ขอโทษ'], explanationHe: 'พูด = לדבר, ช้าๆ = לאט-לאט, ได้ไหม = אפשר?' },
]);

// ===== יחידה 3: אוכל ומסעדות =====
const FOOD = build('food', [
  { n: 1, kind: 'thai-to-he', promptHe: 'מה פירוש המילה הזו?', promptThai: 'เมนู', itemId: 'food-1', lang: 'he', answers: ['תפריט', 'חשבון', 'אורז', 'ירקות'], explanationHe: 'เมนู (מֶנוּ) = תפריט, מילה שאולה מאנגלית.' },
  { n: 2, kind: 'he-to-thai', promptHe: 'איך אומרים "אורז"?', lang: 'thai', answers: ['ข้าว', 'ไก่', 'ปลา', 'ผัก'], explanationHe: 'ข้าว (קַאו) = אורז, ובהשאלה גם "ארוחה".' },
  { n: 3, kind: 'thai-to-he', promptHe: 'מה פירוש המילה הזו?', promptThai: 'ไก่', itemId: 'food-3', lang: 'he', answers: ['עוף', 'דג', 'ירקות', 'אורז'], explanationHe: 'ไก่ (גַאי) = עוף.' },
  { n: 4, kind: 'he-to-thai', promptHe: 'איזו מילה פירושה "דג"?', lang: 'thai', answers: ['ปลา', 'ไก่', 'ข้าว', 'เมนู'], explanationHe: 'ปลา (פְּלָא) = דג.' },
  { n: 5, kind: 'thai-to-he', promptHe: 'מה פירוש המילה הזו?', promptThai: 'ผัก', itemId: 'food-5', lang: 'he', answers: ['ירקות', 'עוף', 'מים רגילים', 'תפריט'], explanationHe: 'ผัก (פַּק) = ירקות.' },
  { n: 6, kind: 'he-to-thai', promptHe: 'איך מבקשים מים רגילים?', lang: 'thai', answers: ['น้ำเปล่า', 'กาแฟ', 'ไม่เผ็ด', 'เท่าไหร่'], explanationHe: 'เปล่า = ריק/פשוט, כלומר מים בלי כלום.' },
  { n: 7, kind: 'he-to-thai', promptHe: 'איך אומרים "לא חריף"?', lang: 'thai', answers: ['ไม่เผ็ด', 'อร่อยมาก', 'คิดเงินด้วย', 'น้ำเปล่า'], explanationHe: 'ไม่ (לא) + เผ็ด (חריף).' },
  { n: 8, kind: 'thai-to-he', promptHe: 'מה פירוש הביטוי הזה?', promptThai: 'อร่อยมาก', itemId: 'food-8', lang: 'he', answers: ['טעים מאוד', 'טעים', 'לא חריף', 'כמה זה עולה?'], explanationHe: 'มาก (מַאק) = מאוד, ומוסיפים אותו אחרי שם התואר.' },
  { n: 9, kind: 'he-to-thai', promptHe: 'איך מבקשים חשבון?', lang: 'thai', answers: ['คิดเงินด้วย', 'เมนู', 'เท่าไหร่', 'ไม่เผ็ด'], explanationHe: 'คิดเงิน = לחשב כסף, ด้วย מרכך את הבקשה.' },
  { n: 10, kind: 'thai-to-he', promptHe: 'מה פירוש הביטוי הזה?', promptThai: 'เท่าไหร่', itemId: 'food-10', lang: 'he', answers: ['כמה זה עולה?', 'חשבון בבקשה', 'תפריט', 'טעים מאוד'], explanationHe: 'เท่าไหร่ (טַאו רַאי) = כמה? שאלת המחיר החשובה בשוק.' },
]);

// ===== יחידה 4: טיולים והתמצאות =====
const TRAVEL = build('travel', [
  { n: 1, kind: 'thai-to-he', promptHe: 'מה פירוש המילה הזו?', promptThai: 'โรงแรม', itemId: 'travel-1', lang: 'he', answers: ['מלון', 'שדה תעופה', 'שירותים', 'מונית'], explanationHe: 'โรงแรม (רוֹנג רֶם) = מלון.' },
  { n: 2, kind: 'he-to-thai', promptHe: 'איך אומרים "שדה תעופה"?', lang: 'thai', answers: ['สนามบิน', 'โรงแรม', 'รถแท็กซี่', 'ห้องน้ำ'], explanationHe: 'สนาม = מגרש/שדה, บิน = לעוף.' },
  { n: 3, kind: 'thai-to-he', promptHe: 'מה פירוש המילה הזו?', promptThai: 'ห้องน้ำ', itemId: 'travel-3', lang: 'he', answers: ['שירותים', 'מלון', 'שמאלה', 'עזרה בבקשה'], explanationHe: 'מילולית "חדר מים": ห้อง חדר + น้ำ מים.' },
  { n: 4, kind: 'thai-to-he', promptHe: 'מה פירוש הביטוי הזה?', promptThai: 'ไปที่นี่', itemId: 'travel-4', lang: 'he', answers: ['לך/י לכאן', 'איפה נמצא/ת?', 'ישר', 'ימינה'], explanationHe: 'ไป = ללכת/לנסוע, ที่นี่ = כאן. מצוין מול נהג מונית.' },
  { n: 5, kind: 'he-to-thai', promptHe: 'איך שואלים "איפה נמצא/ת?"', lang: 'thai', answers: ['อยู่ที่ไหน', 'ไปที่นี่', 'ตรงไป', 'ช่วยด้วย'], explanationHe: 'อยู่ = נמצא, ที่ไหน = איפה.' },
  { n: 6, kind: 'thai-to-he', promptHe: 'מה פירוש המילה הזו?', promptThai: 'ซ้าย', itemId: 'travel-6', lang: 'he', answers: ['שמאלה', 'ימינה', 'ישר', 'מונית'], explanationHe: 'ซ้าย (סַאי) = שמאלה.' },
  { n: 7, kind: 'he-to-thai', promptHe: 'איזו מילה פירושה "ימינה"?', lang: 'thai', answers: ['ขวา', 'ซ้าย', 'ตรงไป', 'โรงแรม'], explanationHe: 'ขวา (קְוָה) = ימינה.' },
  { n: 8, kind: 'thai-to-he', promptHe: 'מה פירוש המילה הזו?', promptThai: 'ตรงไป', itemId: 'travel-8', lang: 'he', answers: ['ישר', 'שמאלה', 'ימינה', 'שדה תעופה'], explanationHe: 'ตรง = ישר, ไป = ללכת.' },
  { n: 9, kind: 'he-to-thai', promptHe: 'איך אומרים "מונית"?', lang: 'thai', answers: ['รถแท็กซี่', 'สนามบิน', 'โรงแรม', 'ห้องน้ำ'], explanationHe: 'รถ (רוֹט) = רכב, ואחריו "טקסי" בהשאלה מאנגלית.' },
  { n: 10, kind: 'thai-to-he', promptHe: 'מה פירוש הביטוי הזה?', promptThai: 'ช่วยด้วย', itemId: 'travel-10', lang: 'he', answers: ['עזרה בבקשה', 'סליחה', 'לך/י לכאן', 'איפה נמצא/ת?'], explanationHe: 'ช่วยด้วย (צ\'וּאַי דוּאַי) – קריאה לעזרה.' },
]);

// ===== יחידה 5: מספרים =====
const NUMBERS = build('numbers', [
  { n: 1, kind: 'thai-to-he', promptHe: 'איזה מספר זה?', promptThai: 'หนึ่ง', itemId: 'numbers-1', lang: 'he', answers: ['אחת', 'שתיים', 'שלוש', 'עשר'], explanationHe: 'หนึ่ง (נוּנג) = 1.' },
  { n: 2, kind: 'he-to-thai', promptHe: 'איך אומרים שתיים?', lang: 'thai', answers: ['สอง', 'สาม', 'หนึ่ง', 'สี่'], explanationHe: 'สอง (סוֹנג) = 2.' },
  { n: 3, kind: 'thai-to-he', promptHe: 'איזה מספר זה?', promptThai: 'สาม', itemId: 'numbers-3', lang: 'he', answers: ['שלוש', 'ארבע', 'שתיים', 'שבע'], explanationHe: 'สาม (סַאם) = 3.' },
  { n: 4, kind: 'he-to-thai', promptHe: 'איזו מילה פירושה ארבע?', lang: 'thai', answers: ['สี่', 'ห้า', 'สาม', 'สิบ'], explanationHe: 'สี่ (סִי) = 4.' },
  { n: 5, kind: 'he-to-thai', promptHe: 'איך אומרים חמש?', lang: 'thai', answers: ['ห้า', 'หก', 'สี่', 'เก้า'], explanationHe: 'ห้า (הָא) = 5. "555" בצ\'אט תאילנדי פירושו צחוק.' },
  { n: 6, kind: 'thai-to-he', promptHe: 'איזה מספר זה?', promptThai: 'หก', itemId: 'numbers-6', lang: 'he', answers: ['שש', 'חמש', 'שבע', 'שמונה'], explanationHe: 'หก (הוֹק) = 6.' },
  { n: 7, kind: 'he-to-thai', promptHe: 'איך אומרים שבע?', lang: 'thai', answers: ['เจ็ด', 'แปด', 'หก', 'เก้า'], explanationHe: 'เจ็ด (גֶ\'ט) = 7.' },
  { n: 8, kind: 'thai-to-he', promptHe: 'איזה מספר זה?', promptThai: 'แปด', itemId: 'numbers-8', lang: 'he', answers: ['שמונה', 'תשע', 'שבע', 'שש'], explanationHe: 'แปด (פֶּט) = 8.' },
  { n: 9, kind: 'he-to-thai', promptHe: 'איזו מילה פירושה תשע?', lang: 'thai', answers: ['เก้า', 'สิบ', 'แปด', 'ห้า'], explanationHe: 'เก้า (גָאו) = 9.' },
  { n: 10, kind: 'he-to-thai', promptHe: 'איך אומרים עשר?', lang: 'thai', answers: ['สิบ', 'เก้า', 'หนึ่ง', 'สอง'], explanationHe: 'สิบ (סִיפּ) = 10, ומכאן בונים 11, 12 וכן הלאה.' },
]);

// ===== יחידה 6: משחקי ידע =====
const GAMES = build('games', [
  { n: 1, kind: 'thai-to-he', promptHe: 'מוצגת המילה הזו. מה משמעותה?', promptThai: 'น้ำ', itemId: 'words-5', lang: 'he', answers: ['מים', 'קפה', 'אורז', 'ירקות'], explanationHe: 'น้ำ (נַאם) = מים.' },
  { n: 2, kind: 'listening', promptHe: 'הקשיבי לביטוי. מה אומרים בעברית?', promptThai: 'ขอบคุณ', itemId: 'words-2', lang: 'he', answers: ['תודה', 'שלום', 'סליחה', 'להתראות'], explanationHe: 'ขอบคุณ (קוֹפּקוּן) = תודה.' },
  { n: 3, kind: 'thai-to-he', promptHe: 'מוצגת המילה הזו. לאיזה כיוון היא מתייחסת?', promptThai: 'ซ้าย', itemId: 'travel-6', lang: 'he', answers: ['שמאלה', 'ימינה', 'ישר', 'אחורה'], explanationHe: 'ซ้าย (סַאי) = שמאלה.' },
  { n: 4, kind: 'listening', promptHe: 'הקשיבי לביטוי. מה מבקשים?', promptThai: 'ไม่เผ็ด', itemId: 'food-7', lang: 'he', answers: ['לא חריף', 'חשבון', 'מים רגילים', 'תפריט'], explanationHe: 'ไม่เผ็ด (מַאי פֶּט) = לא חריף.' },
  { n: 5, kind: 'situation', promptHe: 'מוצגת המילה הזו. מה מחפשים?', promptThai: 'โรงแรม', itemId: 'travel-1', lang: 'he', answers: ['מלון', 'מסעדה', 'שדה תעופה', 'שירותים'], explanationHe: 'โรงแรม (רוֹנג רֶם) = מלון.' },
  { n: 6, kind: 'listening', promptHe: 'הקשיבי למספר. איזה מספר זה?', promptThai: 'สาม', itemId: 'numbers-3', lang: 'he', answers: ['שלוש', 'ארבע', 'שתיים', 'עשר'], explanationHe: 'สาม (סַאם) = 3.' },
  { n: 7, kind: 'thai-to-he', promptHe: 'מוצגת המילה הזו. מה פירושה?', promptThai: 'อร่อย', itemId: 'words-10', lang: 'he', answers: ['טעים', 'טוב', 'חריף', 'יקר'], explanationHe: 'อร่อย (אָרוֹי) = טעים.' },
  { n: 8, kind: 'listening', promptHe: 'הקשיבי לביטוי. לאן מחפשים להגיע?', promptThai: 'ห้องน้ำ', itemId: 'travel-3', lang: 'he', answers: ['לשירותים', 'למלון', 'לשדה התעופה', 'למונית'], explanationHe: 'ห้องน้ำ (הוֹנג נַאם) = שירותים, מילולית "חדר מים".' },
  { n: 9, kind: 'situation', promptHe: 'מוצגת המילה הזו. למי היא מתייחסת?', promptThai: 'เพื่อน', itemId: 'words-8', lang: 'he', answers: ['חבר/ה', 'אמא', 'מוכר בשוק', 'נהג מונית'], explanationHe: 'เพื่อน (פְּרוּאָן) = חבר או חברה.' },
  { n: 10, kind: 'listening', promptHe: 'הקשיבי לביטוי. מה רוצים לדעת?', promptThai: 'เท่าไหร่', itemId: 'food-10', lang: 'he', answers: ['כמה זה עולה?', 'איפה זה נמצא?', 'מה השעה?', 'איך קוראים לך?'], explanationHe: 'เท่าไหร่ (טַאו רַאי) = כמה? בדרך כלל על מחיר.' },
]);

export const QUESTIONS: QuizQuestion[] = [
  ...WORDS,
  ...CONVERSATIONS,
  ...FOOD,
  ...TRAVEL,
  ...NUMBERS,
  ...GAMES,
];

export const getQuestionsByCategory = (categoryId: string): QuizQuestion[] =>
  QUESTIONS.filter((q) => q.categoryId === categoryId);

export const QUESTIONS_PER_QUIZ = 10;
