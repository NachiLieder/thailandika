import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { colors, he, radius, shadow, spacing, thaiText, typography, rtlRow } from '../theme';

/* ---------- טקסט ---------- */

export const HeText: React.FC<{
  style?: TextStyle | TextStyle[];
  variant?: keyof typeof typography;
  children: React.ReactNode;
  numberOfLines?: number;
}> = ({ style, variant = 'body', children, numberOfLines }) => (
  <Text
    numberOfLines={numberOfLines}
    style={[he, typography[variant] as TextStyle, style as TextStyle]}
    allowFontScaling
  >
    {children}
  </Text>
);

export const ThaiLabel: React.FC<{
  children: React.ReactNode;
  size?: 'big' | 'medium' | 'small';
  color?: string;
  style?: TextStyle;
}> = ({ children, size = 'medium', color, style }) => (
  <View style={{ direction: 'ltr', width: '100%' }}>
    <Text
      allowFontScaling
      style={[
        thaiText,
        size === 'big'
          ? typography.thaiBig
          : size === 'medium'
            ? typography.thaiMedium
            : { fontSize: 20, lineHeight: 36, fontWeight: '700' },
        color ? { color } : null,
        style,
      ]}
    >
      {children}
    </Text>
  </View>
);

/* ---------- כרטיס ---------- */

export const Card: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  color?: string;
}> = ({ children, style, color = colors.white }) => (
  <View style={[styles.card, { backgroundColor: color }, shadow(1), style as ViewStyle]}>{children}</View>
);

/* ---------- כפתור ---------- */

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'mango';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
  accessibilityLabel?: string;
};

export const AppButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  icon,
  accessibilityLabel,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const press = (to: number) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

  const palette: Record<string, { bg: string; fg: string; border?: string }> = {
    primary: { bg: colors.turquoise, fg: colors.white },
    mango: { bg: colors.mango, fg: '#4A3508' },
    secondary: { bg: colors.white, fg: colors.turquoise, border: colors.turquoise },
    ghost: { bg: 'transparent', fg: colors.textSoft },
    danger: { bg: colors.errorSoft, fg: colors.error, border: colors.error },
  };
  const p = palette[variant];

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityState={{ disabled: !!disabled || !!loading }}
        disabled={disabled || loading}
        onPressIn={() => press(0.97)}
        onPressOut={() => press(1)}
        onPress={onPress}
        style={[
          styles.button,
          variant !== 'ghost' && shadow(1),
          {
            backgroundColor: p.bg,
            borderWidth: p.border ? 2 : 0,
            borderColor: p.border,
            opacity: disabled ? 0.45 : 1,
          },
        ]}
      >
        <View style={[rtlRow, { gap: spacing(1), justifyContent: 'center' }]}>
          {loading ? <ActivityIndicator color={p.fg} /> : icon}
          <Text style={[typography.heading, { color: p.fg, textAlign: 'center' }]} allowFontScaling>
            {title}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

/* ---------- פס התקדמות ---------- */

export const ProgressBar: React.FC<{
  value: number;
  total: number;
  color?: string;
  height?: number;
  trackColor?: string;
}> = ({ value, total, color = colors.leaf, height = 12, trackColor = colors.border }) => {
  const pct = total > 0 ? Math.max(0, Math.min(1, value / total)) : 0;
  const anim = useRef(new Animated.Value(pct)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: 420, useNativeDriver: false }).start();
  }, [pct, anim]);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: value }}
      style={[styles.track, { height, backgroundColor: trackColor, borderRadius: height }]}
    >
      <Animated.View
        style={{
          height: '100%',
          borderRadius: height,
          backgroundColor: color,
          width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        }}
      />
    </View>
  );
};

/* ---------- תגית ---------- */

export const Pill: React.FC<{ label: string; bg?: string; fg?: string; style?: ViewStyle }> = ({
  label,
  bg = colors.mangoSoft,
  fg = '#8A5F00',
  style,
}) => (
  <View style={[styles.pill, { backgroundColor: bg }, style]}>
    <Text style={[typography.tiny, { color: fg, textAlign: 'center' }]} allowFontScaling>
      {label}
    </Text>
  </View>
);

/* ---------- לוגו ---------- */

export const Logo: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <View style={{ alignItems: 'center' }}>
    <View style={[styles.logoPlate, shadow(2), compact && { paddingVertical: spacing(1) }]}>
      <Text
        style={[
          he,
          {
            textAlign: 'center',
            color: '#C2185B',
            fontSize: compact ? 26 : 38,
            lineHeight: compact ? 38 : 52,
            fontWeight: '900',
          },
        ]}
        allowFontScaling
      >
        תאילנדיקה
      </Text>
      {!compact && (
        <Text style={[he, typography.small, { textAlign: 'center', color: colors.textSoft }]} allowFontScaling>
          מתחילים לדבר תאילנדית
        </Text>
      )}
    </View>
  </View>
);

/* ---------- הופעה רכה ---------- */

export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; style?: ViewStyle }> = ({
  children,
  delay = 0,
  style,
}) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 360, delay, useNativeDriver: true }).start();
  }, [anim, delay]);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing(2),
  },
  button: {
    minHeight: 56,
    borderRadius: radius.pill,
    paddingHorizontal: spacing(3),
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  pill: {
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  logoPlate: {
    backgroundColor: '#FFF4E2',
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: '#F6D9A8',
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(1.5),
  },
});
