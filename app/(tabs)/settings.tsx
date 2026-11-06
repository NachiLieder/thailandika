import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, Card, FadeIn, HeText, Pill } from '../../src/components/ui';
import { Hibiscus, PalmLeaf, Wave } from '../../src/components/Decor';
import { colors, he, radius, shadow, spacing, typography } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';
import { missingAudioItems } from '../../src/data/items';
import { stopAllAudio } from '../../src/audio/useSpeech';

const RATES: { label: string; value: number }[] = [
  { label: 'איטי', value: 0.55 },
  { label: 'רגיל', value: 0.75 },
  { label: 'מהיר', value: 1.0 },
];

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { progress, settings, setUserName, updateSettings, resetProgress } = useAppState();
  const [name, setName] = useState(progress.userName);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const missing = missingAudioItems().length;

  const saveName = async () => {
    if (!name.trim()) {
      setSavedMsg('השם לא יכול להישאר ריק.');
      return;
    }
    await setUserName(name);
    setSavedMsg('השם נשמר ✓');
    setTimeout(() => setSavedMsg(null), 2200);
  };

  const doReset = async () => {
    stopAllAudio();
    await resetProgress();
    setConfirmReset(false);
    router.replace('/(tabs)');
  };

  const askReset = () => {
    if (Platform.OS === 'web') {
      setConfirmReset(true);
      return;
    }
    Alert.alert(
      'לאפס את כל ההתקדמות?',
      'כל הציונים, ההישגים והחידונים שסיימת יימחקו מהמכשיר. השם שלך יישמר. אי אפשר לבטל את הפעולה.',
      [
        { text: 'ביטול', style: 'cancel' },
        { text: 'כן, לאפס', style: 'destructive', onPress: () => void doReset() },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing(12) }}>
        <View style={[styles.hero, { paddingTop: insets.top + spacing(2) }]}>
          <PalmLeaf size={130} style={{ position: 'absolute', top: -24, left: -42, opacity: 0.3 }} />
          <Hibiscus size={44} style={{ position: 'absolute', top: 38, right: 18, opacity: 0.45 }} />
          <Wave width={900} height={34} style={{ position: 'absolute', bottom: -2, left: 0 }} />
          <View style={{ paddingHorizontal: spacing(2), paddingBottom: spacing(4) }}>
            <HeText variant="display">הגדרות</HeText>
            <HeText variant="body" style={{ color: colors.textSoft }}>
              הכול נשמר במכשיר שלך בלבד.
            </HeText>
          </View>
        </View>

        <View style={styles.body}>
          <FadeIn>
            <Card>
              <HeText variant="heading">השם שלי</HeText>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="השם שלך"
                placeholderTextColor={colors.textFaint}
                style={[styles.input, he]}
                accessibilityLabel="שדה שינוי שם"
                maxLength={24}
                allowFontScaling
              />
              <AppButton title="שמירת השם" style={{ marginTop: spacing(1.5) }} onPress={saveName} />
              {!!savedMsg && (
                <HeText variant="small" style={{ color: colors.leaf, marginTop: spacing(1) }}>
                  {savedMsg}
                </HeText>
              )}
            </Card>
          </FadeIn>

          <FadeIn delay={80}>
            <Card>
              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <HeText variant="heading">צלילי ממשק והשמעה</HeText>
                  <HeText variant="small" style={{ color: colors.textSoft }}>
                    כשהאפשרות כבויה, כפתורי ההשמעה אינם פעילים.
                  </HeText>
                </View>
                <Switch
                  value={settings.soundEnabled}
                  onValueChange={(v) => {
                    if (!v) stopAllAudio();
                    void updateSettings({ soundEnabled: v });
                  }}
                  trackColor={{ true: colors.turquoise, false: colors.border }}
                  thumbColor={colors.white}
                  accessibilityLabel="הפעלה או כיבוי של צלילים"
                />
              </View>
            </Card>
          </FadeIn>

          <FadeIn delay={140}>
            <Card>
              <HeText variant="heading">מהירות ההשמעה</HeText>
              <HeText variant="small" style={{ color: colors.textSoft, marginBottom: spacing(1) }}>
                כדאי להתחיל באיטי ולהאיץ כשהאוזן מתרגלת.
              </HeText>
              <View style={styles.rateRow}>
                {RATES.map((r) => {
                  const active = Math.abs(settings.speechRate - r.value) < 0.01;
                  return (
                    <Pressable
                      key={r.label}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={`מהירות ${r.label}`}
                      onPress={() => void updateSettings({ speechRate: r.value })}
                      style={[
                        styles.rateBtn,
                        shadow(1),
                        active && { backgroundColor: colors.turquoise, borderColor: colors.turquoise },
                      ]}
                    >
                      <HeText
                        variant="body"
                        style={{ textAlign: 'center', color: active ? colors.white : colors.text }}
                      >
                        {active ? '✓ ' : ''}
                        {r.label}
                      </HeText>
                    </Pressable>
                  );
                })}
              </View>
            </Card>
          </FadeIn>

          <FadeIn delay={200}>
            <Card>
              <HeText variant="heading">איפוס התקדמות</HeText>
              <HeText variant="small" style={{ color: colors.textSoft, marginTop: spacing(0.25) }}>
                מוחק את כל הציונים וההתקדמות מהמכשיר. השם שלך יישמר.
              </HeText>
              {confirmReset ? (
                <View style={{ gap: spacing(1), marginTop: spacing(1.5) }}>
                  <View style={styles.warnBox}>
                    <HeText variant="small" style={{ color: colors.error }}>
                      ⚠ בטוחה? אי אפשר לבטל את הפעולה.
                    </HeText>
                  </View>
                  <AppButton title="כן, לאפס הכול" variant="danger" onPress={() => void doReset()} />
                  <AppButton title="ביטול" variant="ghost" onPress={() => setConfirmReset(false)} />
                </View>
              ) : (
                <AppButton
                  title="איפוס ההתקדמות"
                  variant="danger"
                  style={{ marginTop: spacing(1.5) }}
                  onPress={askReset}
                />
              )}
            </Card>
          </FadeIn>

          <FadeIn delay={260}>
            <Card color={colors.turquoiseSoft}>
              <HeText variant="heading">על האפליקציה</HeText>
              <HeText variant="small" style={{ color: colors.textSoft, marginTop: spacing(0.5) }}>
                תאילנדיקה · גרסה 1.0{'\n'}
                אפליקציה ללימוד תאילנדית למתחילות דוברות עברית. כל התוכן, ההתקדמות והניקוד נשמרים במכשיר
                שלך בלבד, ואינם נשלחים לשום שרת. האפליקציה עובדת גם ללא חיבור לאינטרנט.
              </HeText>
              <HeText variant="small" style={{ color: colors.textSoft, marginTop: spacing(1) }}>
                התעתיקים בעברית הם קירוב למתחילות. תאילנדית היא שפה טונאלית, ולכן כדאי להישען על ההשמעה
                ועל אוזן של דובר/ת תאילנדית.
              </HeText>
              <View style={{ marginTop: spacing(1.25) }}>
                <Pill
                  label={`${missing} ביטויים ממתינים להקלטה מקורית`}
                  bg={colors.mangoSoft}
                  fg="#8A5F00"
                />
              </View>
            </Card>
          </FadeIn>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.turquoiseLight, overflow: 'hidden' },
  body: { paddingHorizontal: spacing(2), marginTop: -spacing(2), gap: spacing(1.5) },
  input: {
    marginTop: spacing(1),
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.cream,
    paddingHorizontal: spacing(2),
    minHeight: 54,
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  switchRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing(1.5) },
  rateRow: { flexDirection: 'row-reverse', gap: spacing(1) },
  rateBtn: {
    flex: 1,
    minHeight: 50,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warnBox: {
    backgroundColor: colors.errorSoft,
    borderRadius: radius.md,
    padding: spacing(1.25),
  },
});
