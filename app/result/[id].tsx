import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, Card, FadeIn, HeText, Pill, ProgressBar, ThaiLabel } from '../../src/components/ui';
import { Elephant, Hibiscus, PalmLeaf, Temple, Wave } from '../../src/components/Decor';
import { getCategory } from '../../src/data/categories';
import { getLessonItems } from '../../src/data/items';
import { QUESTIONS_PER_QUIZ } from '../../src/data/questions';
import { categoryPalette, colors, radius, shadow, spacing } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';

const messageFor = (score: number) => {
  if (score >= 10) return 'מושלם! שליטה נהדרת!';
  if (score >= 8) return 'עבודה מעולה! את בדרך הנכונה.';
  if (score >= 6) return 'יפה מאוד! עוד קצת תרגול וזה יישב.';
  return 'כל התחלה היא הצלחה. כדאי לחזור על המילים ולנסות שוב.';
};

export default function ResultScreen() {
  const { id, score } = useLocalSearchParams<{ id: string; score?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { progress, bestScoreFor } = useAppState();

  const category = getCategory(id);
  const parsed = Number(score);
  const finalScore = Number.isFinite(parsed)
    ? Math.max(0, Math.min(QUESTIONS_PER_QUIZ, Math.round(parsed)))
    : (progress.results.filter((r) => r.categoryId === id).slice(-1)[0]?.score ?? 0);

  const pop = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    Animated.spring(pop, { toValue: 1, useNativeDriver: true, bounciness: 14, speed: 8 }).start();
  }, [pop]);

  if (!category) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream, padding: spacing(2), justifyContent: 'center' }}>
        <Card>
          <HeText variant="heading">לא מצאנו את השיעור</HeText>
          <AppButton title="חזרה לבית" style={{ marginTop: spacing(2) }} onPress={() => router.replace('/(tabs)')} />
        </Card>
      </View>
    );
  }

  const palette = categoryPalette[category.colorKey];
  const best = bestScoreFor(category.id);
  const items = getLessonItems(category.id);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={[styles.hero, { backgroundColor: palette.bg, paddingTop: insets.top + spacing(2) }]}>
        <PalmLeaf size={150} style={{ position: 'absolute', top: -26, left: -48, opacity: 0.3 }} />
        <Hibiscus size={50} style={{ position: 'absolute', top: 30, right: 20, opacity: 0.5 }} />
        <Temple size={92} style={{ position: 'absolute', bottom: 22, right: -4, opacity: 0.8 }} />
        <Wave width={900} height={34} style={{ position: 'absolute', bottom: -2, left: 0 }} />
        <View style={{ alignItems: 'center', paddingBottom: spacing(4) }}>
          <Elephant size={92} />
          <HeText variant="title" style={{ textAlign: 'center' }}>
            כל הכבוד, סיימת את השיעור!
          </HeText>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing(4) }]}>
        <FadeIn>
          <Animated.View style={{ transform: [{ scale: pop }] }}>
            <Card style={[styles.scoreCard, shadow(2)]}>
              <HeText variant="small" style={{ color: colors.textSoft, textAlign: 'center' }}>
                הציון שלך ביחידה "{category.titleHe}"
              </HeText>
              <HeText style={styles.bigScore}>
                {finalScore} מתוך {QUESTIONS_PER_QUIZ}
              </HeText>
              <ProgressBar value={finalScore} total={QUESTIONS_PER_QUIZ} color={palette.accent} height={14} />
              <HeText variant="heading" style={{ textAlign: 'center', marginTop: spacing(1) }}>
                {messageFor(finalScore)}
              </HeText>
              <View style={{ alignItems: 'center', marginTop: spacing(1) }}>
                <Pill label={`השיא שלך ביחידה: ${best}/${QUESTIONS_PER_QUIZ}`} bg={colors.leafSoft} fg={colors.leaf} />
              </View>
            </Card>
          </Animated.View>
        </FadeIn>

        <FadeIn delay={120}>
          <Card>
            <HeText variant="heading">מה למדת כאן</HeText>
            <HeText variant="small" style={{ color: colors.textSoft, marginTop: spacing(0.25) }}>
              {category.longDescriptionHe}
            </HeText>
            <View style={styles.wordGrid}>
              {items.slice(0, 6).map((item) => (
                <View key={item.id} style={styles.wordChip}>
                  <ThaiLabel size="small">{item.thai}</ThaiLabel>
                  <HeText variant="tiny" style={{ color: colors.textSoft, textAlign: 'center' }}>
                    {item.meaningHe}
                  </HeText>
                </View>
              ))}
            </View>
          </Card>
        </FadeIn>

        <View style={{ gap: spacing(1) }}>
          <AppButton title="לתרגול נוסף" onPress={() => router.replace(`/quiz/${category.id}`)} />
          <AppButton
            title="חזרה על כרטיסי הלימוד"
            variant="secondary"
            onPress={() => router.replace(`/lesson/${category.id}`)}
          />
          <AppButton title="חזרה לבית" variant="ghost" onPress={() => router.replace('/(tabs)')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { overflow: 'hidden' },
  body: { paddingHorizontal: spacing(2), paddingTop: spacing(2), gap: spacing(2) },
  scoreCard: { gap: spacing(1), paddingVertical: spacing(2.5) },
  bigScore: {
    textAlign: 'center',
    fontSize: 44,
    lineHeight: 58,
    fontWeight: '900',
    color: colors.turquoise,
  },
  wordGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: spacing(1),
    marginTop: spacing(1.5),
  },
  wordChip: {
    backgroundColor: colors.turquoiseSoft,
    borderRadius: radius.md,
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(1.25),
    minWidth: '30%',
    flexGrow: 1,
  },
});
