import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, FadeIn, HeText, Pill, ProgressBar, SectionTitle } from '../../src/components/ui';
import { CategoryIcon } from '../../src/components/CategoryIcon';
import { Decoration, PhotoHero } from '../../src/components/Photo';
import { CATEGORIES } from '../../src/data/categories';
import { QUESTIONS_PER_QUIZ } from '../../src/data/questions';
import { categoryPalette, colors, radius, shadow, spacing, typography } from '../../src/theme';
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
  const {
    progress,
    bestScoreFor,
    lastResultFor,
    completedLessons,
    totalCorrect,
  } = useAppState();

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing(11) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <PhotoHero image="heroTemple" height={282} dim={0.26} style={StyleSheet.absoluteFill as any} />
          <Decoration image="palmLeaf" size={112} rotate={18} flip style={{ top: -18, left: -32 }} opacity={0.85} />
          <View style={[styles.heroContent, { paddingTop: insets.top + spacing(1) }]}>
            {/* לוחית שמנת מתחת לכותרת – הטקסט חייב להישאר קריא מעל התצלום */}
            <View style={[styles.titlePlate, shadow(2)]}>
              <HeText variant="display" style={{ color: colors.lotusDark, textAlign: 'center' }}>
                ההתקדמות שלי
              </HeText>
              <HeText variant="small" style={{ textAlign: 'center', color: colors.textSecondary }}>
                📚 כל הנושאים במקום אחד
              </HeText>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <FadeIn delay={70}>
            <View style={styles.statRow}>
              <View style={[styles.stat, shadow(1), { backgroundColor: colors.successSoft }]}>
                <HeText style={styles.statNum}>{completedLessons}</HeText>
                <HeText variant="tiny" style={{ color: colors.textSecondary, textAlign: 'center' }}>
                  שיעורים שהושלמו
                </HeText>
              </View>
              <View style={[styles.stat, shadow(1), { backgroundColor: colors.mangoSoft }]}>
                <HeText style={styles.statNum}>{totalCorrect}</HeText>
                <HeText variant="tiny" style={{ color: colors.textSecondary, textAlign: 'center' }}>
                  תשובות נכונות
                </HeText>
              </View>
              <View style={[styles.stat, shadow(1), { backgroundColor: colors.lotusSoft }]}>
                <HeText style={styles.statNum}>{progress.results.length}</HeText>
                <HeText variant="tiny" style={{ color: colors.textSecondary, textAlign: 'center' }}>
                  חידונים שסיימת
                </HeText>
              </View>
            </View>
          </FadeIn>

          <FadeIn delay={120}>
            <SectionTitle title="ההתקדמות לפי קטגוריה" emoji="📚" />
          </FadeIn>

          {CATEGORIES.map((cat, i) => {
            const palette = categoryPalette[cat.colorKey];
            const best = bestScoreFor(cat.id);
            const last = lastResultFor(cat.id);
            return (
              <FadeIn key={cat.id} delay={160 + i * 45}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`לתרגל שוב את ${cat.titleHe}`}
                  onPress={() => router.push(`/category/${cat.id}`)}
                  style={({ pressed }) => [styles.catRow, shadow(1), pressed && { opacity: 0.9 }]}
                >
                  <CategoryIcon name={cat.icon} size={40} />
                  <View style={{ flex: 1, gap: spacing(0.4) }}>
                    <View style={styles.rowBetween}>
                      <HeText variant="heading" numberOfLines={1} style={{ flex: 1, fontSize: 16 }}>
                        {cat.titleHe}
                      </HeText>
                      <Pill
                        label={last ? `ציון אחרון ${last.score}/${last.total}` : 'עוד לא התחלת'}
                        bg={last ? colors.lotusSoft : colors.border}
                        fg={last ? colors.lotusDark : colors.textSecondary}
                      />
                    </View>
                    <ProgressBar value={best} total={QUESTIONS_PER_QUIZ} color={palette.accent} height={9} trackColor={colors.sand} />
                    <HeText variant="tiny" style={{ color: colors.textSecondary }}>
                      שיא: {best}/{QUESTIONS_PER_QUIZ}
                      {last ? ` · עודכן: ${formatDate(last.completedAt)}` : ''}
                    </HeText>
                  </View>
                </Pressable>
              </FadeIn>
            );
          })}

          <FadeIn delay={460}>
            <AppButton title="חזרה למסך הבית" variant="secondary" onPress={() => router.push('/(tabs)')} />
          </FadeIn>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  titlePlate: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 252, 247, 0.93)',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.lotusMid,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(1),
  },
  hero: { height: 282, overflow: 'hidden' },
  heroContent: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: spacing(2), paddingBottom: spacing(4) },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 5,
    borderColor: colors.lotusPink,
    backgroundColor: colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  taglineChip: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.4),
    marginTop: spacing(0.5),
  },
  body: { paddingHorizontal: spacing(2), marginTop: -spacing(2), gap: spacing(1.25) },
  rowBetween: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing(1),
  },
  statRow: { flexDirection: 'row-reverse', gap: spacing(1) },
  stat: {
    flex: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing(1.4),
    paddingHorizontal: spacing(0.6),
    alignItems: 'center',
    gap: spacing(0.25),
  },
  statNum: { ...typography.display, fontSize: 28, lineHeight: 38, color: colors.textPrimary, textAlign: 'center' },
  catRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing(1.1),
    borderRadius: radius.lg,
    backgroundColor: colors.textLight,
    padding: spacing(1.25),
  },
});
