/**
 * מפת קובצי שמע מוקלטים.
 * כשמתווספת הקלטה מקורית של דובר/ת תאילנדית:
 *   1. לשמור את הקובץ ב-assets/audio/{categoryId}/{itemId}.mp3
 *   2. לעדכן כאן: 'words-1': require('../../assets/audio/words/words-1.mp3')
 *   3. לעדכן את השדה audio של הפריט ב-src/data/items.ts
 * כל עוד המפה ריקה, האפליקציה משתמשת במנוע ההקראה של המכשיר (TTS בתאילנדית),
 * ואם גם הוא אינו זמין – מוצגת הודעה שהשמע יתווסף בקרוב.
 */
export const RECORDED_AUDIO: Record<string, number> = {};

export const hasRecording = (itemId?: string | null): boolean =>
  !!itemId && Object.prototype.hasOwnProperty.call(RECORDED_AUDIO, itemId);
