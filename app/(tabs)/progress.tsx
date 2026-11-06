import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, Card, FadeIn, HeText, Pill, ProgressBar } from '../../src/components/ui';
import { CategoryIcon } from '../../src/components/CategoryIcon';
import { Hibiscus, PalmLeaf, Wave } from '../../src/components/Decor';
import { CATEGORIES } from '../../src/data/categories';
import { QUESTIONS_PER_QUIZ } from '../../src/data/questions';
import { categoryPalette, colors, radius, shadow, spacing } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  } catch {
    return '';
  }
};

export default function ProgressScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { progress, bestScoreFor, lastResultFor, completedLessons, totalCorrect } = useAppState();

  const maxPoints = CATEGORIES.length * QUESTIONS_PER_QUIZ;
  const bestPoints = CATEGORIES.reduce((s, c) => s + bestScoreFor(c.id), 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing(12) }}>
        <View style={[styles.hero, { paddingTop: insets.top + spacing(2) }]}>
          <PalmLeaf size={140} style={{ position: 'absolute', top: -24, left: -44, opacity: 0.32 }} />
          <Hibiscus size={46} style={{ position: 'absolute', top: 40, right: 18, opacity: 0.45 }} />
          <Wave width={900} height={34} style={{ position: 'absolute', bottom: -2, left: 0 }} />
          <View style={{ paddingHorizontal: spacing(2), paddingBottom: spacing(4) }}>
            <HeText variant="display">ההתקדמות שלי</HeText>
            <HeText variant="body" style={{ color: colors.textSoft }}>
              {progress.userName ? `${progress.userName}, הנה התמונה המלאה.` : 'הנה התמונה המלאה.'}
            </HeText>
          </View>
        </View>

        <View style={styles.body}>
          <FadeIn>
            <View style={styles.statRow}>
              <View style={[styles.stat, shadow(1), { backgroundColor: colors.leafSoft }]}>
                <HeText style={styles.statNum}>{completedLessons}</HeText>
                <HeText variant="tiny" style={{ color: colors.textSoft, textAlign: 'center' }}>
                  שיעורים שהושלמו
                </HeText>
              </View>
              <View style={[styles.stat, shadow(1), { backgroundColor: colors.mangoSoft }]}>
                <HeText style={styles.statNum}>{totalCorrect}</HeText>
                <HeText variant="tiny" style={{ color: colors.textSoft, textAlign: 'center' }}>
                  תשובות נכונות בסך הכול
                </HeText>
              </View>
              <View style={[styles.stat, shadow(1), { backgroundColor: colors.lotusSoft }]}>
                <HeText style={styles.statNum}>{progress.results.length}</HeText>
                <HeText variant="tiny" style={{ color: colors.textSoft, textAlign: 'center' }}>
                  חידונים שסיימת
                </HeText>
              </View>
            </View>
          </FadeIn>

          <FadeIn delay={90}>
            <Card color="#FFF4E2">
              <HeText variant="heading">הניקוד הכולל שלך</HeText>
              <HeText variant="small" style={{ color: colors.textSoft, marginBottom: spacing(1) }}>
                מחושב לפי התוצאה הטובה ביותר בכל אחת מ-{CATEGORIES.length} היחידות.
              </HeText>
              <ProgressBar value={bestPoints} total={maxPoints} color={colors.lotus} height={14} />
              <HeText variant="small" style={{ color: colors.textSoft, marginTop: spacing(1) }}>
                {bestPoints} מתוך {maxPoints} נקודות
              </HeText>
            </Card>
          </FadeIn>

          <FadeIn delay={140}>
            <HeText variant="heading">לפי קטגוריה</HeText>
          </FadeIn>

          {CATEGORIES.map((cat, i) => {
            const palette = categoryPalette[cat.colorKey];
            const best = bestScoreFor(cat.id);
            const last = lastResultFor(cat.id);
            return (
              <FadeIn key={cat.id} delay={180 + i * 50}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`לתרגל שוב את ${cat.titleHe}`}
                  onPress={() => router.push(`/category/${cat.id}`)}
                  style={({ pressed }) => [
                    styles.catRow,
                    shadow(1),
                    { backgroundColor: colors.white },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <CategoryIcon name={cat.icon} size={44} />
                  <View style={{ flex: 1, gap: spacing(0.5) }}>
                    <View style={styles.catTitleRow}>
                      <HeText variant="heading" numberOfLines={1} style={{ flex: 1 }}>
                        {cat.titleHe}
                      </HeText>
                      <Pill
                        label={last ? `ציון אחרון ${last.score}/${last.total}` : 'עוד לא התחלת'}
                        bg={last ? colors.turquoiseSoft : colors.border}
                        fg={last ? colors.turquoise : colors.textSoft}
                      />
                    </View>
                    <ProgressBar value={best} total={QUESTIONS_PER_QUIZ} color={palette.accent} height={10} />
                    <HeText variant="tiny" style={{ color: colors.textFaint }}>
                      שיא: {best}/{QUESTIONS_PER_QUIZ}
                      {last ? ` · עודכן: ${formatDate(last.completedAt)}` : ''}
                    </HeText>
                  </View>
                </Pressable>
              </FadeIn>
            );
          })}

          <FadeIn delay={520}>
            <AppButton title="חזרה לבית" variant="secondary" onPress={() => router.push('/(tabs)')} />
          </FadeIn>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.turquoiseLight, overflow: 'hidden' },
  body: { paddingHorizontal: spacing(2), marginTop: -spacing(2), gap: spacing(1.5) },
  statRow: { flexDirection: 'row-reverse', gap: spacing(1) },
  stat: {
    flex: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(0.75),
    alignItems: 'center',
    gap: spacing(0.25),
  },
  statNum: { fontSize: 30, lineHeight: 40, fontWeight: '900', color: colors.text, textAlign: 'center' },
  catRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing(1.25),
    borderRadius: radius.lg,
    padding: spacing(1.5),
  },
  catTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing(1) },
});
