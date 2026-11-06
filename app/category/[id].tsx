import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, Card, FadeIn, HeText, Pill, ProgressBar, ThaiLabel } from '../../src/components/ui';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { CategoryIcon } from '../../src/components/CategoryIcon';
import { Hibiscus, PalmLeaf } from '../../src/components/Decor';
import { getCategory } from '../../src/data/categories';
import { getLessonItems } from '../../src/data/items';
import { getQuestionsByCategory, QUESTIONS_PER_QUIZ } from '../../src/data/questions';
import { categoryPalette, colors, radius, shadow, spacing } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { categoryStatus, bestScoreFor, lastResultFor, progress } = useAppState();

  const category = getCategory(id);

  if (!category) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <ScreenHeader title="קטגוריה לא נמצאה" />
        <View style={{ padding: spacing(2) }}>
          <Card>
            <HeText variant="heading">אופס, לא מצאנו את השיעור הזה</HeText>
            <HeText variant="body" style={{ color: colors.textSoft, marginTop: spacing(0.5) }}>
              אפשר לחזור למסך הבית ולבחור קטגוריה אחרת.
            </HeText>
            <AppButton title="חזרה לבית" style={{ marginTop: spacing(2) }} onPress={() => router.replace('/(tabs)')} />
          </Card>
        </View>
      </View>
    );
  }

  const palette = categoryPalette[category.colorKey];
  const items = getLessonItems(category.id);
  const questions = getQuestionsByCategory(category.id);
  const status = categoryStatus(category.id);
  const best = bestScoreFor(category.id);
  const last = lastResultFor(category.id);
  const inProgress = progress.activeQuiz?.categoryId === category.id;

  const statusLabel = status === 'completed' ? '✓ הושלם' : status === 'in-progress' ? 'בתהליך' : 'חדש';

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={[styles.hero, { backgroundColor: palette.bg }]}>
        <PalmLeaf size={140} style={{ position: 'absolute', top: -26, left: -44, opacity: 0.3 }} />
        <Hibiscus size={48} style={{ position: 'absolute', bottom: 8, left: 14, opacity: 0.35 }} />
        <ScreenHeader title={category.titleHe} subtitle={category.descriptionHe} />
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing(4) }]}>
        <FadeIn>
          <Card style={styles.introCard}>
            <View style={styles.introRow}>
              <CategoryIcon name={category.icon} size={62} />
              <View style={{ flex: 1 }}>
                <HeText variant="heading">מה לומדים כאן?</HeText>
                <HeText variant="small" style={{ color: colors.textSoft }}>
                  {category.longDescriptionHe}
                </HeText>
              </View>
            </View>
          </Card>
        </FadeIn>

        <FadeIn delay={90}>
          <HeText variant="heading">יחידות הלימוד</HeText>
        </FadeIn>

        <FadeIn delay={140}>
          <Card style={{ borderWidth: 2, borderColor: palette.accent }}>
            <View style={styles.lessonHeader}>
              <HeText variant="heading">יחידה 1 · {category.titleHe}</HeText>
              <Pill
                label={statusLabel}
                bg={status === 'completed' ? colors.leafSoft : status === 'in-progress' ? colors.mangoSoft : colors.turquoiseSoft}
                fg={status === 'completed' ? colors.leaf : status === 'in-progress' ? '#8A5F00' : colors.turquoise}
              />
            </View>
            <HeText variant="small" style={{ color: colors.textSoft, marginTop: spacing(0.5) }}>
              {items.length} כרטיסי לימוד · {questions.length} שאלות בחידון
            </HeText>

            <View style={{ marginTop: spacing(1.5) }}>
              <ProgressBar value={best} total={QUESTIONS_PER_QUIZ} color={palette.accent} />
              <HeText variant="small" style={{ color: colors.textSoft, marginTop: spacing(0.75) }}>
                {last
                  ? `הציון האחרון שלך: ${last.score} מתוך ${last.total} · השיא שלך: ${best}/${QUESTIONS_PER_QUIZ}`
                  : 'עוד לא ענית על החידון הזה.'}
              </HeText>
            </View>

            <AppButton
              title={inProgress ? 'ממשיכים בחידון' : status === 'completed' ? 'מתרגלים שוב' : 'מתחילים'}
              style={{ marginTop: spacing(2) }}
              onPress={() =>
                inProgress ? router.push(`/quiz/${category.id}`) : router.push(`/lesson/${category.id}`)
              }
            />
            {!inProgress && (
              <AppButton
                title="ישר לחידון"
                variant="secondary"
                style={{ marginTop: spacing(1) }}
                onPress={() => router.push(`/quiz/${category.id}`)}
              />
            )}
          </Card>
        </FadeIn>

        <FadeIn delay={200}>
          <HeText variant="heading" style={{ marginTop: spacing(1) }}>
            הצצה למילים
          </HeText>
        </FadeIn>

        <FadeIn delay={240}>
          <View style={styles.peekWrap}>
            {items.slice(0, 4).map((item) => (
              <View key={item.id} style={[styles.peekCard, shadow(1)]}>
                <ThaiLabel size="small">{item.thai}</ThaiLabel>
                <HeText variant="tiny" style={{ color: colors.textSoft, textAlign: 'center' }}>
                  {item.meaningHe}
                </HeText>
              </View>
            ))}
          </View>
          <HeText variant="small" style={{ color: colors.textFaint, marginTop: spacing(1) }}>
            ועוד {Math.max(0, items.length - 4)} מילים בתוך השיעור.
          </HeText>
        </FadeIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { overflow: 'hidden', paddingBottom: spacing(1) },
  body: { paddingHorizontal: spacing(2), paddingTop: spacing(2), gap: spacing(1.5) },
  introCard: {},
  introRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing(1.5) },
  lessonHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing(1),
  },
  peekWrap: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: spacing(1) },
  peekCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(1.5),
    minWidth: '47%',
    flexGrow: 1,
  },
});
