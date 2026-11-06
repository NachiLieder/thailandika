import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, FadeIn, HeText, Logo } from '../src/components/ui';
import { Elephant } from '../src/components/Decor';
import { Lotus, ThaiFlag } from '../src/components/Scenery';
import { Decoration, PhotoHero } from '../src/components/Photo';
import { colors, he, radius, shadow, spacing, typography } from '../src/theme';
import { useAppState } from '../src/state/AppStateContext';

export default function Onboarding() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { setUserName } = useAppState();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const submit = async () => {
    if (!name.trim()) {
      setError('כדי להמשיך צריך למלא שם. אפשר גם כינוי.');
      return;
    }
    setError(null);
    await setUserName(name);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.cream }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.hero}>
        <PhotoHero image="phiPhiHero" height={250} dim={0.3} style={StyleSheet.absoluteFill as any} />
        <Decoration image="palmLeaf" size={132} rotate={-18} style={{ top: -24, right: -38 }} />
        <View style={styles.heroLogo}>
          <Lotus size={44} style={{ marginBottom: -12, zIndex: 2 }} />
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
            <Logo />
            <ThaiFlag width={32} style={{ marginRight: -8, marginBottom: 22 }} />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing(4) }]}
        keyboardShouldPersistTaps="handled"
      >
        <FadeIn delay={120}>
          <View style={styles.welcomeRow}>
            <Elephant size={78} />
            <View style={{ flex: 1 }}>
              <HeText variant="title">איזה כיף שבאת ללמוד תאילנדית!</HeText>
              <HeText variant="body" style={{ color: colors.textSecondary, marginTop: spacing(0.5) }}>
                כמה דקות ביום ואת מתחילה להבין ולדבר.
              </HeText>
            </View>
          </View>
        </FadeIn>

        <FadeIn delay={220}>
          <View style={[styles.formCard, shadow(2)]}>
            <HeText variant="heading">איך קוראים לך?</HeText>
            <TextInput
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (error) setError(null);
              }}
              placeholder="השם שלך"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, he, error ? { borderColor: colors.error } : null]}
              accessibilityLabel="שדה הזנת שם"
              returnKeyType="done"
              onSubmitEditing={submit}
              maxLength={24}
              allowFontScaling
            />
            {error && (
              <HeText variant="small" style={{ color: colors.error, marginTop: spacing(0.75) }}>
                ⚠ {error}
              </HeText>
            )}
            <AppButton
              title="מתחילים ללמוד"
              onPress={submit}
              disabled={!name.trim()}
              style={{ marginTop: spacing(2) }}
            />
            <HeText variant="small" style={{ color: colors.textSecondary, marginTop: spacing(1.5) }}>
              השם וההתקדמות נשמרים רק במכשיר שלך. אפשר לשנות את השם בכל רגע במסך ההגדרות.
            </HeText>
          </View>
        </FadeIn>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  heroLogo: {
    position: 'absolute',
    bottom: 22,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hero: {
    height: 250,
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: spacing(2.5),
    paddingTop: spacing(2.5),
    gap: spacing(2.5),
  },
  welcomeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing(1.5),
  },
  formCard: {
    backgroundColor: colors.textLight,
    borderRadius: radius.lg,
    padding: spacing(2.5),
  },
  input: {
    marginTop: spacing(1),
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.cream,
    paddingHorizontal: spacing(2),
    minHeight: 56,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
  },
});
