import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { AppButton, Card, FadeIn, HeText, ThaiLabel } from '../../src/components/ui';
import { BeachScene, Bloom, Medal, TrophyCup } from '../../src/components/Scenery';
import { getCategory } from '../../src/data/categories';
import { getLessonItems } from '../../src/data/items';
import { QUESTIONS_PER_QUIZ } from '../../src/data/questions';
import { colors, radius, shadow, spacing } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';

const messageFor = (score: number) => {
  if (score >= 10) return 'מושלם! שליטה נהדרת!';
  if (score >= 8) return 'עבודה מעולה! את בדרך הנכונה.';
  if (score >= 6) return 'יפה מאוד! עוד קצת תרגול וזה יישב.';
  return 'כל התחלה היא הצלחה. כדאי לחזור על המילים ולנסות שוב.';
};

const praiseFor = (score: number) => {
  if (score >= 10) return 'את אלופה בתאילנדית!';
  if (score >= 8) return 'את ממש מתקדמת יפה!';
  if (score >= 6) return 'את בדרך הנכונה!';
  return 'כל תרגול מקרב אותך!';
};

/** סרט ורוד עם הכיתוב "כל הכבוד!" */
const Ribbon: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.ribbonWrap}>
    <Svg width="100%" height="64" viewBox="0 0 300 64" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
      <Path d="M8 10 H292 L276 32 L292 54 H8 L24 32 Z" fill={colors.pink} />
      <Path d="M8 10 L24 32 L8 54 Z" fill={colors.pinkDeep} opacity={0.5} />
      <Path d="M292 10 L276 32 L292 54 Z" fill={colors.pinkDeep} opacity={0.5} />
    </Svg>
    <HeText variant="display" style={styles.ribbonText}>
      {text}
    </HeText>
  </View>
);

export default function ResultScreen() {
  const { id, score } = useLocalSearchParams<{ id: string; score?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { progress, bestScoreFor, badges } = useAppState();

  const category = getCategory(id);
  const parsed = Number(score);
  const finalScore = Number.isFinite(parsed)
    ? Math.max(0, Math.min(QUESTIONS_PER_QUIZ, Math.round(parsed)))
    : (progress.results.filter((r) => r.categoryId === id).slice(-1)[0]?.score ?? 0);
  const percent = Math.round((finalScore / QUESTIONS_PER_QUIZ) * 100);

  const pop = useRef(new Animated.Value(0.7)).current;
  useEffect(() => {
    Animated.spring(pop, { toValue: 1, useNativeDriver: true, bounciness: 12, speed: 7 }).start();
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

  const best = bestScoreFor(category.id);
  const items = getLessonItems(category.id);
  const freshBadge = badges.filter((b) => b.unlocked).slice(-1)[0];

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <BeachScene height={420} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.body,
          { paddingTop: insets.top + spacing(2), paddingBottom: insets.bottom + spacing(4) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <FadeIn>
          <Animated.View style={{ alignItems: 'center', transform: [{ scale: pop }] }}>
            <TrophyCup size={150} />
            <Ribbon text="כל הכבוד!" />
            <HeText style={styles.bigScore}>
              {finalScore}/{QUESTIONS_PER_QUIZ}
            </HeText>
            <HeText variant="heading" style={{ textAlign: 'center', color: colors.text }}>
              סיימת את כל {QUESTIONS_PER_QUIZ} השאלות!
            </HeText>
          </Animated.View>
        </FadeIn>

        <FadeIn delay={120}>
          <Card color={colors.creamCard} style={styles.praiseCard}>
            <HeText style={{ fontSize: 20 }}>❤️</HeText>
            <HeText variant="heading" style={{ flex: 1, textAlign: 'center' }}>
              {praiseFor(finalScore)}
            </HeText>
          </Card>
        </FadeIn>

        <FadeIn delay={180}>
          <Card color={colors.creamCard} style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <HeText style={{ fontSize: 24, textAlign: 'center' }}>⭐</HeText>
            </View>
            <View style={styles.infoDivider} />
            <View style={{ flex: 1 }}>
              <HeText variant="small" style={{ color: colors.textSoft }}>
                ציון סופי
              </HeText>
              <HeText variant="title" style={{ color: colors.pinkDeep }}>
                {percent}%
              </HeText>
            </View>
          </Card>
        </FadeIn>

        {!!freshBadge && (
          <FadeIn delay={220}>
            <Card color={colors.creamCard} style={styles.infoCard}>
              <Medal size={44} tone={freshBadge.tone} />
              <View style={styles.infoDivider} />
              <View style={{ flex: 1 }}>
                <HeText variant="small" style={{ color: colors.textSoft }}>
                  הישג חדש!
                </HeText>
                <HeText variant="heading">{freshBadge.titleHe}</HeText>
              </View>
            </Card>
          </FadeIn>
        )}

        <FadeIn delay={260}>
          <Card style={{ gap: spacing(0.75) }}>
            <HeText variant="heading">{messageFor(finalScore)}</HeText>
            <HeText variant="small" style={{ color: colors.textSoft }}>
              {category.longDescriptionHe} השיא שלך ביחידה: {best}/{QUESTIONS_PER_QUIZ}.
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
          <AppButton title="🏠  חזרה למסך הבית" onPress={() => router.replace('/(tabs)')} />
          <AppButton title="↻  שחקי שוב" variant="secondary" onPress={() => router.replace(`/quiz/${category.id}`)} />
          <AppButton
            title="חזרה על כרטיסי הלימוד"
            variant="ghost"
            onPress={() => router.replace(`/lesson/${category.id}`)}
          />
        </View>

        <Bloom size={30} color={colors.lotus} style={{ alignSelf: 'center', opacity: 0.6 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing(2), gap: spacing(1.5) },
  ribbonWrap: {
    width: '92%',
    height: 64,
    justifyContent: 'center',
    marginTop: -spacing(1),
  },
  ribbonText: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 30,
    lineHeight: 40,
    fontWeight: '900',
  },
  bigScore: {
    textAlign: 'center',
    fontSize: 58,
    lineHeight: 72,
    fontWeight: '900',
    color: colors.pink,
  },
  praiseCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing(1),
    borderWidth: 2,
    borderColor: colors.lotusMid,
  },
  infoCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing(1.25),
    borderWidth: 2,
    borderColor: colors.lotusMid,
  },
  infoIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.mangoSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoDivider: { width: 2, height: 36, borderRadius: 1, backgroundColor: colors.lotusMid },
  wordGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: spacing(0.75), marginTop: spacing(0.5) },
  wordChip: {
    backgroundColor: colors.turquoiseSoft,
    borderRadius: radius.md,
    paddingVertical: spacing(0.85),
    paddingHorizontal: spacing(1),
    minWidth: '30%',
    flexGrow: 1,
  },
});
