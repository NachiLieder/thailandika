import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Path, Polygon } from 'react-native-svg';
import { colors, radius, shadow, spacing, typography, he, rtlRow } from '../theme';
import { useAppState } from '../state/AppStateContext';
import { useSpeech } from '../audio/useSpeech';
import { hasRecording } from '../audio/audioAssets';

const SpeakerIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Polygon points="4,9 8,9 13,5 13,19 8,15 4,15" fill={color} />
    <Path d="M16 9 Q18.5 12 16 15" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
    <Path d="M18.5 7 Q22 12 18.5 17" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
  </Svg>
);

type Props = {
  thai: string;
  itemId?: string | null;
  label?: string;
  style?: ViewStyle;
  compact?: boolean;
};

export const AudioButton: React.FC<Props> = ({ thai, itemId, label = 'השמעה', style, compact }) => {
  const { settings } = useAppState();
  const { speak, state, supported } = useSpeech({
    enabled: settings.soundEnabled,
    rate: settings.speechRate,
  });

  const unavailable = supported === false && !hasRecording(itemId);
  const disabled = unavailable || !settings.soundEnabled;

  const text =
    state === 'loading'
      ? 'מכינים את השמע...'
      : state === 'playing'
        ? 'מושמע...'
        : !settings.soundEnabled
          ? 'הצלילים כבויים'
          : unavailable
            ? 'השמע יתווסף בקרוב'
            : label;

  return (
    <View style={style}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label} של הביטוי בתאילנדית`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => void speak(thai, itemId)}
        style={[
          styles.btn,
          shadow(1),
          compact && { minHeight: 44, paddingHorizontal: spacing(2) },
          disabled && { backgroundColor: colors.border },
        ]}
      >
        <View style={[rtlRow, { gap: spacing(1), justifyContent: 'center' }]}>
          {state === 'loading' ? (
            <ActivityIndicator color={disabled ? colors.textFaint : colors.white} />
          ) : (
            <SpeakerIcon color={disabled ? colors.textFaint : colors.white} size={compact ? 20 : 24} />
          )}
          <Text
            allowFontScaling
            style={[
              typography.heading,
              compact && typography.small,
              { color: disabled ? colors.textFaint : colors.white, textAlign: 'center' },
            ]}
          >
            {text}
          </Text>
        </View>
      </Pressable>

      {state === 'error' && (
        <Text allowFontScaling style={[he, typography.small, styles.note]}>
          לא הצלחנו להשמיע כרגע. אפשר להמשיך ולקרוא את הביטוי.
        </Text>
      )}
      {unavailable && state !== 'error' && (
        <Text allowFontScaling style={[he, typography.small, styles.note]}>
          אין עדיין הקלטה לביטוי הזה במכשיר. אפשר להמשיך ולקרוא את התעתיק.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    minHeight: 54,
    borderRadius: radius.pill,
    backgroundColor: colors.turquoise,
    paddingHorizontal: spacing(3),
    justifyContent: 'center',
  },
  note: {
    marginTop: spacing(0.75),
    color: colors.textSoft,
  },
});
