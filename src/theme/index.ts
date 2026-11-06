import { Platform, TextStyle } from 'react-native';

export { colors, categoryPalette } from './colors';
export { images, categoryPhoto } from './images';
export type { ImageKey } from './images';
import { colors } from './colors';

/** יחידת מרווח בסיסית: spacing(1) = 8px */
export const spacing = (n: number) => n * 8;

/** מרווחי המסך לפי מסמך העיצוב */
export const layout = {
  screenPadding: 20,
  itemGap: 14,
  sectionGap: 24,
  heroHeight: 296,
  maxContentWidth: 520,
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 26,
  xl: 32,
  pill: 999,
};

export const shadow = (level: 1 | 2 | 3 = 1) =>
  Platform.select({
    web: {
      boxShadow:
        level === 1
          ? '0 3px 10px rgba(81, 47, 57, 0.09)'
          : level === 2
            ? '0 6px 18px rgba(81, 47, 57, 0.14)'
            : '0 14px 30px rgba(81, 47, 57, 0.22)',
    } as any,
    default: {
      shadowColor: colors.shadowColor,
      shadowOpacity: level === 1 ? 0.09 : level === 2 ? 0.14 : 0.22,
      shadowRadius: level === 1 ? 8 : level === 2 ? 16 : 24,
      shadowOffset: { width: 0, height: level * 3 },
      elevation: level * 3,
    },
  }) as object;

/** משפחות הגופן – נטענות ב-app/_layout.tsx */
export const fonts = {
  regular: 'Heebo_400Regular',
  medium: 'Heebo_500Medium',
  bold: 'Heebo_700Bold',
  black: 'Heebo_800ExtraBold',
};

/** סגנון בסיס לכל טקסט עברי – יישור לימין וכיווניות RTL */
export const he: TextStyle = {
  textAlign: 'right',
  writingDirection: 'rtl',
  color: colors.textPrimary,
};

/** סגנון בסיס לטקסט תאילנדי – LTR כדי שהסקריפט לא יתהפך */
export const thaiText: TextStyle = {
  textAlign: 'center',
  writingDirection: 'ltr',
  color: colors.textPrimary,
};

/**
 * היררכיית הטיפוגרפיה ממסמך העיצוב.
 * line-height נדיב בכוונה – עברית ותאית צריכות אוויר.
 */
export const typography = {
  display: { fontFamily: fonts.black, fontSize: 32, lineHeight: 44 },
  title: { fontFamily: fonts.black, fontSize: 24, lineHeight: 36 },
  heading: { fontFamily: fonts.bold, fontSize: 19, lineHeight: 29 },
  body: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 26 },
  bodyBold: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 26 },
  small: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 22 },
  smallBold: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 22 },
  tiny: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 18 },
  // הטקסט התאילנדי נשאר בגופן המערכת: ל-Heebo אין גליפים תאילנדיים
  thaiBig: { fontSize: 38, lineHeight: 60, fontWeight: '700' as const },
  thaiMedium: { fontSize: 27, lineHeight: 44, fontWeight: '700' as const },
};

/** שורה בכיווניות RTL */
export const rtlRow = { flexDirection: 'row-reverse' as const, alignItems: 'center' as const };
