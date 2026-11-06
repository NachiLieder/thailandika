/**
 * בדיקת שלמות התוכן – מריצים עם: npm run check:content
 * (ה-script מקמפל קודם את src/data אל .content-check/ ואז מריץ את הבדיקות)
 * מאמת את דרישות האפיון: 6 קטגוריות, 10 פריטים ו-10 שאלות ביחידה,
 * 3–4 אפשרויות לכל שאלה, תשובה נכונה קיימת, ואין כפילויות.
 */
const { CATEGORIES } = require('../.content-check/src/data/categories.js');
const { ITEMS, getLessonItems } = require('../.content-check/src/data/items.js');
const { QUESTIONS, getQuestionsByCategory } = require('../.content-check/src/data/questions.js');

let fail = 0;
const ok = (cond, msg) => {
  console.log((cond ? '✓ ' : '✗ ') + msg);
  if (!cond) fail++;
};

ok(CATEGORIES.length === 6, `6 קטגוריות (${CATEGORIES.length})`);
ok(ITEMS.length === 50, `50 פריטי לימוד (${ITEMS.length})`);
ok(QUESTIONS.length === 60, `60 שאלות בסך הכול (${QUESTIONS.length})`);

for (const c of CATEGORIES) {
  const qs = getQuestionsByCategory(c.id);
  const items = getLessonItems(c.id);
  ok(qs.length === 10, `${c.titleHe}: בדיוק 10 שאלות (${qs.length})`);
  ok(items.length === 10, `${c.titleHe}: 10 כרטיסי לימוד (${items.length})`);
  let bad = 0;
  for (const q of qs) {
    if (q.options.length < 3 || q.options.length > 4) bad++;
    if (!q.options.some((o) => o.id === q.correctOptionId)) bad++;
    const labels = q.options.map((o) => o.labelHe ?? o.labelThai);
    if (new Set(labels).size !== labels.length) bad++;
    if (!labels.every((l) => typeof l === 'string' && l.length > 0)) bad++;
  }
  ok(bad === 0, `${c.titleHe}: מבנה כל השאלות תקין`);
}

ok(new Set(ITEMS.map((i) => i.id)).size === ITEMS.length, 'מזהי הפריטים ייחודיים');
ok(new Set(QUESTIONS.map((q) => q.id)).size === QUESTIONS.length, 'מזהי השאלות ייחודיים');
ok(
  QUESTIONS.every((q) => q.promptHe && q.promptHe.length > 0),
  'לכל שאלה יש נוסח בעברית',
);
ok(
  ITEMS.every((i) => i.thai && i.transliterationHe && i.meaningHe),
  'לכל פריט יש כתב תאילנדי, תעתיק ומשמעות',
);

console.log(fail === 0 ? '\nכל בדיקות התוכן עברו ✅' : `\n${fail} בדיקות נכשלו ❌`);
process.exit(fail === 0 ? 0 : 1);
