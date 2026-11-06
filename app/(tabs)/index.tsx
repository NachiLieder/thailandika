import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { AppButton, Card, FadeIn, HeText, Logo, Pill, ProgressBar } from '../../src/components/ui';
import { CategoryIcon } from '../../src/components/CategoryIcon';
import { Elephant, Hibiscus, PalmLeaf, Temple, Wave } from '../../src/components/Decor';
import { CATEGORIES, getCategory } from '../../src/data/categories';
import { QUESTIONS_PER_QUIZ } from '../../src/data/questions';
import { categoryPalette, colors, radius, shadow, spacing, typography } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';

const Chevron: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path d="M15 5 L8 12 L15 19" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { progress, bestScoreFor, categoryStatus, completedLessons } = useAppState();

  const active = progress.activeQuiz;
  const activeCategory = getCategory(active?.categoryId);
  const lastResult = progress.results[progress.results.length - 1];
  const totalPoints = progress.results.reduce((s, r) => s + r.score, 0);
  const maxPoints = CATEGORIES.length * QUESTIONS_PER_QUIZ;
  const bestPoints = CATEGORIES.reduce((s, c) => s + bestScoreFor(c.id), 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing(12) }}
        showsVerticalScrollIndicator={false}
      >
        {/* כותרת טרופית */}
        <View style={[styles.hero, { paddingTop: insets.top + spacing(1) }]}>
          <PalmLeaf size={160} style={{ position: 'absolute', top: -24, left: -46, opacity: 0.4 }} />
          <Temple size={110} style={{ position: 'absolute', bottom: 24, right: -6, opacity: 0.95 }} />
          <Hibiscus size={54} style={{ position: 'absolute', top: 24, right: 90, opacity: 0.55 }} />
          <Hibiscus size={40} color={colors.mango} style={{ position: 'absolute', bottom: 60, left: 18, opacity: 0.6 }} />
          <Wave width={900} height={40} style={{ position: 'absolute', bottom: -2, left: 0 }} />
          <Logo />
        </View>

        <View style={styles.body}>
          {/* ברכה אישית */}
          <FadeIn>
            <Card style={styles.greetCard} color="#FFF4E2">
              <Elephant size={70} />
              <View style={{ flex: 1 }}>
                <HeText variant="title">שלום, {progress.userName || 'חברה'}! 🌺</HeText>
                <HeText variant="body" style={{ color: colors.textSoft }}>
                  לאן נטייל ונלמד היום?
                </HeText>
              </View>
            </Card>
          </FadeIn>

          {/* ממשיכים ללמוד */}
          {active && activeCategory && (
            <FadeIn delay={80}>
              <Card style={{ borderWidth: 2, borderColor: colors.mango }}>
                <Pill label="שיעור בתהליך" bg={colors.mangoSoft} fg="#8A5F00" />
                <HeText variant="heading" style={{ marginTop: spacing(1) }}>
                  ממשיכים ללמוד: {activeCategory.titleHe}
                </HeText>
                <HeText variant="small" style={{ color: colors.textSoft, marginBottom: spacing(1) }}>
                  עצרת בשאלה {active.questionIndex + 1} מתוך {QUESTIONS_PER_QUIZ}, עם {active.score} נקודות.
                </HeText>
                <ProgressBar value={active.questionIndex} total={QUESTIONS_PER_QUIZ} color={colors.mango} />
                <AppButton
                  title="ממשיכים מאיפה שעצרנו"
                  variant="mango"
                  style={{ marginTop: spacing(1.5) }}
                  onPress={() => router.push(`/quiz/${activeCategory.id}`)}
                />
              </Card>
            </FadeIn>
          )}

          {/* שש הקטגוריות */}
          <View style={styles.grid}>
            {CATEGORIES.map((cat, i) => {
              const palette = categoryPalette[cat.colorKey];
              const status = categoryStatus(cat.id);
              const best = bestScoreFor(cat.id);
              return (
                <FadeIn key={cat.id} delay={120 + i * 60} style={styles.gridItem}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${cat.titleHe}. ${cat.descriptionHe}`}
                    onPress={() => router.push(`/category/${cat.id}`)}
                    style={({ pressed }) => [
                      styles.catCard,
                      shadow(1),
                      { backgroundColor: palette.bg },
                      pressed && { opacity: 0.85, transform: [{ scale: 0.985 }] },
                    ]}
                  >
                    <View style={styles.catTop}>
                      <CategoryIcon name={cat.icon} size={52} />
                      <View style={{ flex: 1 }}>
                        <HeText variant="heading" numberOfLines={1}>
                          {cat.titleHe}
                        </HeText>
                        <HeText variant="small" style={{ color: colors.textSoft }} numberOfLines={1}>
                          {cat.descriptionHe}
                        </HeText>
                      </View>
                      <View style={[styles.chev, { backgroundColor: palette.accent }]}>
                        <Chevron color={colors.white} />
                      </View>
                    </View>

                    <View style={styles.catBottom}>
                      <Pill
                        label={status === 'completed' ? '✓ הושלם' : status === 'in-progress' ? 'בתהליך' : 'חדש'}
                        bg={status === 'completed' ? colors.leafSoft : colors.white}
                        fg={status === 'completed' ? colors.leaf : colors.textSoft}
                      />
                      <View style={{ flex: 1 }}>
                        <ProgressBar
                          value={best}
                          total={QUESTIONS_PER_QUIZ}
                          color={palette.accent}
                          trackColor={colors.white}
                          height={9}
                        />
                      </View>
                      <HeText variant="tiny" style={{ color: colors.textSoft }}>
                        {best}/{QUESTIONS_PER_QUIZ}
                      </HeText>
                    </View>
                  </Pressable>
                </FadeIn>
              );
            })}
          </View>

          {/* ההתקדמות שלי */}
          <FadeIn delay={520}>
            <Card color="#FFF4E2">
              <View style={styles.progressHeader}>
                <HeText variant="heading">ההתקדמות שלי</HeText>
                <Pill
                  label={`${completedLessons} מתוך ${CATEGORIES.length} שיעורים`}
                  bg={colors.lotusSoft}
                  fg="#A63C6B"
                />
              </View>
              <ProgressBar value={bestPoints} total={maxPoints} color={colors.lotus} height={14} />
              <HeText variant="small" style={{ color: colors.textSoft, marginTop: spacing(1) }}>
                {bestPoints} מתוך {maxPoints} נקודות
                {lastResult
                  ? ` · ציון אחרון: ${lastResult.score}/${lastResult.total} ב"${getCategory(lastResult.categoryId)?.titleHe}"`
                  : ' · עוד לא סיימת חידון'}
              </HeText>
              <AppButton
                title="למסך ההתקדמות המלא"
                variant="secondary"
                style={{ marginTop: spacing(1.5) }}
                onPress={() => router.push('/(tabs)/progress')}
              />
            </Card>
          </FadeIn>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.turquoiseLight,
    paddingBottom: spacing(5),
    overflow: 'hidden',
  },
  body: {
    paddingHorizontal: spacing(2),
    marginTop: -spacing(3),
    gap: spacing(2),
  },
  greetCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing(1.5),
  },
  grid: {
    gap: spacing(1.5),
  },
  gridItem: {
    width: '100%',
  },
  catCard: {
    borderRadius: radius.lg,
    padding: spacing(1.75),
    gap: spacing(1.25),
  },
  catTop: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing(1.25),
  },
  catBottom: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing(1),
  },
  chev: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing(1.25),
    gap: spacing(1),
  },
});
