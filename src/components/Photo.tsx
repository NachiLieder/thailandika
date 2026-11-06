import React from 'react';
import { View, ImageBackground, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, images, radius, shadow, ImageKey } from '../theme';
import type { ImageSourcePropType } from 'react-native';

/**
 * אזור גיבור עם תצלום אמיתי מתאילנד.
 * מעליו שכבת גרדיאנט עדינה, כדי שכל טקסט שיונח עליו יישאר קריא.
 */
export const PhotoHero: React.FC<{
  image?: ImageKey;
  height?: number;
  rounded?: boolean;
  dim?: number;
  /** 'dark' – הכהיה קלה לטקסט לבן · 'cream' – ציפוי שמנת לרקע שקט */
  tone?: 'dark' | 'cream';
  children?: React.ReactNode;
  style?: ViewStyle;
}> = ({ image = 'phiPhiHero', height = 296, rounded = false, dim = 0.28, tone = 'dark', children, style }) => (
  <View
    style={[
      { height, width: '100%', overflow: 'hidden' },
      rounded && { borderRadius: radius.lg },
      style,
    ]}
  >
    <ImageBackground
      source={images[image] as ImageSourcePropType}
      resizeMode="cover"
      style={StyleSheet.absoluteFill as ViewStyle}
    >
      <LinearGradient
        // ציפוי שמנת אחיד, שנסגר לשמנת מלאה בתחתית כדי להתמזג עם רקע המסך
        colors={
          tone === 'cream'
            ? [
                `rgba(255, 245, 232, ${Math.min(1, dim)})`,
                `rgba(255, 245, 232, ${Math.min(1, dim + 0.08)})`,
                colors.cream,
              ]
            : [`rgba(20, 75, 90, ${dim * 0.2})`, `rgba(20, 75, 90, ${dim})`, `rgba(20, 75, 90, ${dim})`]
        }
        locations={tone === 'cream' ? [0, 0.7, 1] : [0, 0.7, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill as ViewStyle}
      />
    </ImageBackground>
    {children}
  </View>
);

/**
 * תצלום רקע למסך שלם, עם ציפוי שמנת רך מעליו כדי לשמור על קריאות הטקסט.
 */
export const PhotoBackdrop: React.FC<{
  image?: ImageKey;
  veil?: number;
  children?: React.ReactNode;
}> = ({ image = 'tropicalBeach', veil = 0.78, children }) => (
  <View style={{ flex: 1, backgroundColor: colors.cream }}>
    <Image
      source={images[image] as ImageSourcePropType}
      resizeMode="cover"
      style={StyleSheet.absoluteFill as ImageStyle}
    />
    <LinearGradient
      colors={[`rgba(255, 245, 232, ${veil * 0.72})`, `rgba(255, 245, 232, ${veil})`, colors.cream]}
      locations={[0, 0.55, 1]}
      style={StyleSheet.absoluteFill as ViewStyle}
    />
    {children}
  </View>
);

/** תמונה קטנה בתוך כרטיס – פינות מעוגלות וצל רך */
export const PhotoChip: React.FC<{
  image: ImageKey;
  width?: number;
  height?: number;
  style?: ViewStyle;
}> = ({ image, width = 96, height = 72, style }) => (
  <View
    style={[
      { width, height, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.turquoiseSoft },
      shadow(1),
      style,
    ]}
  >
    <Image
      source={images[image] as ImageSourcePropType}
      resizeMode="cover"
      style={{ width: '100%', height: '100%' }}
    />
  </View>
);

/**
 * קישוט צמחייה שקוף שמונח על קצה מסך או כרטיס.
 * pointerEvents="none" – הקישוט לעולם אינו חוסם לחיצה על טקסט או כפתור.
 */
export const Decoration: React.FC<{
  image?: ImageKey;
  size?: number;
  opacity?: number;
  rotate?: number;
  flip?: boolean;
  style?: ViewStyle;
}> = ({ image = 'palmLeaf', size = 130, opacity = 0.9, rotate = 0, flip = false, style }) => (
  <View pointerEvents="none" style={[{ position: 'absolute' }, style]}>
    <Image
      source={images[image] as ImageSourcePropType}
      resizeMode="contain"
      style={{
        width: size,
        height: size,
        opacity,
        transform: [{ rotate: `${rotate}deg` }, { scaleX: flip ? -1 : 1 }],
      }}
    />
  </View>
);
