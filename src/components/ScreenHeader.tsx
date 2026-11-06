import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { HeText } from './ui';
import { colors, shadow, spacing } from '../theme';
import { stopAllAudio } from '../audio/useSpeech';

/** חץ חזרה ב-RTL מצביע ימינה */
const BackArrow: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path d="M9 5 L16 12 L9 19" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
};

export const ScreenHeader: React.FC<Props> = ({ title, subtitle, onBack, backLabel = 'חזרה', right, style }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    stopAllAudio();
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing(1) }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={backLabel}
        onPress={handleBack}
        style={[styles.backBtn, shadow(1)]}
        hitSlop={10}
      >
        <BackArrow color={colors.turquoise} />
      </Pressable>
      <View style={{ flex: 1 }}>
        <HeText variant="heading" numberOfLines={1}>
          {title}
        </HeText>
        {!!subtitle && (
          <HeText variant="small" style={{ color: colors.textSoft }} numberOfLines={1}>
            {subtitle}
          </HeText>
        )}
      </View>
      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing(1.5),
    paddingHorizontal: spacing(2),
    paddingBottom: spacing(1.5),
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
