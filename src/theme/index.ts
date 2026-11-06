import { Platform, TextStyle } from 'react-native';
import { ColorKey } from '../data/types';

export const colors = {
  turquoise: '#087E8B',
  turquoiseLight: '#BFEDE7',
  turquoiseSoft: '#E6F7F5',
  mango: '#FFC857',
  mangoSoft: '#FFF0D0',
  lotus: '#F28AB2',
  lotusSoft: '#FDE3EC',
  leaf: '#3D8063',
  leafSoft: '#DDF0E5',
  violet: '#8E7CC3',
  violetSoft: '#EAE4F7',
  sand: '#E8A87C',
  sandSoft: '#FBE8DA',
  cream: '#FFF9EF',
  white: '#FFFFFF',
  text: '#243238',
  textSoft: '#5A6B72',
  textFaint: '#8C9AA0',
  border: '#E7DFD2',
  error: '#C2504B',
  errorSoft: '#FBE3E1',
  shadow: '#0B3A40',
};

export const categoryPalette: Record<ColorKey, { bg: string; accent: string }> = {
  lotus: { bg: colors.lotusSoft, accent: colors.lotus },
  mango: { bg: colors.mangoSoft, accent: '#E9A62B' },
  turquoise: { bg: colors.turquoiseSoft, accent: colors.turquoise },
  leaf: { bg: colors.leafSoft, accent: colors.leaf },
  sand: { bg: colors.sandSoft, accent: '#CE7E4F' },
  violet: { bg: colors.violetSoft, accent: colors.violet },
};

export const spacing = (n: number) => n * 8;

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
};

export const shadow = (level: 1 | 2 | 3 = 1) =>
  Platform.select({
    web: {
      boxShadow:
        level === 1
          ? '0 2px 10px rgba(11,58,64,0.08)'
          : level === 2
            ? '0 6px 20px rgba(11,58,64,0.12)'
            : '0 12px 30px rgba(11,58,64,0.18)',
    } as any,
    default: {
      shadowColor: colors.shadow,
      shadowOpacity: level === 1 ? 0.08 : level === 2 ? 0.14 : 0.2,
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
  heading: { fontSize: 19, fontWeight: '700' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '500' as const, lineHeight: 25 },
  small: { fontSize: 14, fontWeight: '500' as const, lineHeight: 21 },
  tiny: { fontSize: 12, fontWeight: '600' as const, lineHeight: 18 },
  thaiBig: { fontSize: 40, fontWeight: '700' as const, lineHeight: 64 },
  thaiMedium: { fontSize: 28, fontWeight: '700' as const, lineHeight: 46 },
};

/** שורה בכיווניות RTL */
export const rtlRow = { flexDirection: 'row-reverse' as const, alignItems: 'center' as const };
