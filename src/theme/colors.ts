import { ColorKey } from '../data/types';

/**
 * אסימוני הצבע של תאילנדיקה.
 * כל צבע באפליקציה מגיע מכאן – שינוי גוון כאן משנה את כל המסכים.
 */
export const colors = {
  // --- ראשיים ---
  turquoise: '#27C6C8',
  turquoiseDark: '#159DA8',
  lotusPink: '#F45B9A',
  lotusDark: '#D93679',
  mangoYellow: '#FFC94A',

  // --- רקעים ---
  cream: '#FFF5E8',
  warmWhite: '#FFFCF7',
  sand: '#F8E5D2',

  // --- תומכים ---
  palmGreen: '#398B68',
  skyBlue: '#8DDCF1',
  lavender: '#DCC7F4',
  softGreen: '#D9EDB8',

  // --- טקסט ---
  textPrimary: '#45263A',
  textSecondary: '#806276',
  textLight: '#FFFFFF',

  // --- גוונים נגזרים לשימוש פנימי ---
  lotusSoft: '#FDE6F0',
  lotusMid: '#FBC4DA',
  turquoiseSoft: '#DFF6F6',
  turquoiseMid: '#A8E6E7',
  mangoSoft: '#FFF2D4',
  palmSoft: '#E3F2E9',
  lavenderSoft: '#F0E8FB',
  sandSoft: '#FDF0E3',
  border: '#F1E2D2',
  success: '#2F9E6B',
  successSoft: '#DFF3E6',
  error: '#E0526B',
  errorSoft: '#FDE5E9',
  shadowColor: '#512F39',
  overlay: 'rgba(20, 75, 90, 0.25)',
} as const;

/** צבעי כרטיסי הקטגוריות – כל קטגוריה בגוון פסטלי משלה */
export const categoryPalette: Record<ColorKey, { bg: string; accent: string; ring: string }> = {
  lotus: { bg: colors.lotusSoft, accent: colors.lotusDark, ring: colors.lotusPink },
  mango: { bg: colors.mangoSoft, accent: '#C98707', ring: colors.mangoYellow },
  turquoise: { bg: colors.turquoiseSoft, accent: colors.turquoiseDark, ring: colors.turquoise },
  sand: { bg: colors.sandSoft, accent: '#C87C45', ring: '#EFA86B' },
  leaf: { bg: '#EAF6DA', accent: colors.palmGreen, ring: '#8CC96B' },
  violet: { bg: colors.lavenderSoft, accent: '#7B5AC2', ring: colors.lavender },
};
