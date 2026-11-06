import { Platform, TextStyle } from 'react-native';
import { ColorKey } from '../data/types';

/**
 * פלטת הצבעים של המוקאפ:
 * טורקיז · ורוד לוטוס · צהוב מנגו · שמנת · ורוד כהה (צבע הפעולה הראשי)
 */
export const colors = {
  // ורוד כהה – כפתור ראשי, כותרות, מצב פעיל
  pink: '#E8417F',
  pinkDeep: '#C2185B',

  // ורוד לוטוס
  lotus: '#F38AB4',
  lotusSoft: '#FDE4EE',
  lotusMid: '#FBC8DC',
  // טורקיז
  turquoise: '#22BCD9',
  turquoiseDeep: '#0E8FA8',
  turquoiseLight: '#AFE8F2',
  turquoiseSoft: '#E2F6FB',
  // צהוב מנגו
  mango: '#FFC94D',
  mangoDeep: '#E09B16',
  mangoSoft: '#FFF2D3',
  // ירוק עלים / הצלחה
  leaf: '#3E9B6B',
  leafSoft: '#DFF3E5',
  leafMid: '#A8DCBC',
  // סגול ואפרסק לכרטיסי קטגוריה
  violet: '#9C86D4',
  violetSoft: '#EDE7FA',
  sand: '#E9A977',
  sandSoft: '#FDEEDF',
  // ניטרליים
  cream: '#FFF7EC',
  creamCard: '#FFF3E2',
  white: '#FFFFFF',
  text: '#2B2A3D',
  textSoft: '#6B6880',
  textFaint: '#9B98AC',
  border: '#F0E4D8',
  error: '#D3455B',
  errorSoft: '#FCE4E7',
  shadow: '#5B2C45',
};

export const categoryPalette: Record<ColorKey, { bg: string; accent: string; ring: string }> = {
  mango: { bg: '#FFF0CE', accent: colors.mangoDeep, ring: colors.mango },
  lotus: { bg: '#FDE0EC', accent: colors.pink, ring: colors.lotus },
  turquoise: { bg: '#DCF3FA', accent: colors.turquoiseDeep, ring: colors.turquoise },
  sand: { bg: '#FDF0DC', accent: '#CE7E4F', ring: colors.sand },
  leaf: { bg: '#DFF3DF', accent: colors.leaf, ring: '#7CC58E' },
  violet: { bg: '#EDE4FA', accent: '#7B62C4', ring: colors.violet },
};

export const spacing = (n: number) => n * 8;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const shadow = (level: 1 | 2 | 3 = 1) =>
  Platform.select({
    web: {
      boxShadow:
        level === 1
          ? '0 2px 10px rgba(91,44,69,0.10)'
          : level === 2
            ? '0 6px 18px rgba(91,44,69,0.14)'
            : '0 12px 28px rgba(91,44,69,0.20)',
    } as any,
    default: {
      shadowColor: colors.shadow,
      shadowOpacity: level === 1 ? 0.1 : level === 2 ? 0.16 : 0.22,
      shadowRadius: level === 1 ? 8 : level === 2 ? 14 : 22,
      shadowOffset: { width: 0, height: level * 3 },
      elevation: level * 3,
    },
  }) as object;

/** סגנון בסיס לכל טקסט עברי – יישור לימין וכיווניות RTL */
export const he: TextStyle = {
  textAlign: 'right',
  writingDirection: 'rtl',
  color: colors.text,
};

/** סגנון בסיס לטקסט תאילנדי – LTR כדי שלא יתהפך */
export const thaiText: TextStyle = {
  textAlign: 'center',
  writingDirection: 'ltr',
  color: colors.text,
};

export const typography = {
  display: { fontSize: 32, fontWeight: '800' as const, lineHeight: 42 },
  title: { fontSize: 24, fontWeight: '800' as const, lineHeight: 34 },
  heading: { fontSize: 19, fontWeight: '800' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '600' as const, lineHeight: 25 },
  small: { fontSize: 14, fontWeight: '600' as const, lineHeight: 21 },
  tiny: { fontSize: 12, fontWeight: '700' as const, lineHeight: 18 },
  thaiBig: { fontSize: 40, fontWeight: '700' as const, lineHeight: 64 },
  thaiMedium: { fontSize: 28, fontWeight: '700' as const, lineHeight: 46 },
};

/** שורה בכיווניות RTL */
export const rtlRow = { flexDirection: 'row-reverse' as const, alignItems: 'center' as const };
