import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, Card, FadeIn, HeText, Pill, ProgressBar, SectionTitle } from '../../src/components/ui';
import { CategoryIcon } from '../../src/components/CategoryIcon';
import { Avatar, TropicalScene } from '../../src/components/Scenery';
import { CATEGORIES } from '../../src/data/categories';
import { QUESTIONS_PER_QUIZ } from '../../src/data/questions';
import { categoryPalette, colors, he, radius, shadow, spacing, typography } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  } catch {
    return '';
  }
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    progress,
    bestScoreFor,
    lastResultFor,
    completedLessons,
    totalCorrect,
    setUserName,
  } = useAppState();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(progress.userName);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!name.trim()) {
      setError('השם לא יכול להישאר ריק.');
      return;
    }
    await setUserName(name);
    setError(null);
    setEditing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing(11) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <TropicalScene height={230} style={StyleSheet.absoluteFill as any} />
          <View style={[styles.heroContent, { paddingTop: insets.top + spacing(2) }]}>
            <View style={[styles.avatarRing, shadow(2)]}>
              <Avatar size={84} />
            </View>
            <HeText variant="title" style={{ color: colors.pinkDeep, marginTop: spacing(0.75) }}>
              {progress.userName || 'חברה'}
            </HeText>
            <View style={styles.taglineChip}>
              <HeText variant="small" style={{ textAlign: 'center' }}>
                🌸 הפרופיל שלי
              </HeText>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <FadeIn>
            <Card color={colors.creamCard} style={{ borderWidth: 2, borderColor: colors.lotusMid }}>
              <View style={styles.rowBetween}>
                <HeText variant="heading">השם שלי</HeText>
                {!editing && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="שינוי השם"
                    onPress={() => {
                      setName(progress.userName);
                      setEditing(true);
                    }}
                  >
                    <HeText variant="small" style={{ color: colors.pink }}>
                      ✏️ שינוי
                    </HeText>
                  </Pressable>
                )}
              </View>

              {editing ? (
                <>
                  <TextInput
                    value={name}
                    onChangeText={(t) => {
                      setName(t);
                      if (error) setError(null);
                    }}
                    placeholder="השם שלך"
                    placeholderTextColor={colors.textFaint}
                    style={[styles.input, he, error ? { borderColor: colors.error } : null]}
                    accessibilityLabel="שדה שינוי שם"
                    maxLength={24}
                    allowFontScaling
                  />
                  {!!error && (
                    <HeText variant="small" style={{ color: colors.error, marginTop: spacing(0.5) }}>
                      ⚠ {error}
                    </HeText>
                  )}
                  <View style={styles.editRow}>
                    <AppButton title="שמירה" style={{ flex: 1 }} onPress={save} />
                    <AppButton
                      title="ביטול"
                      variant="ghost"
                      style={{ flex: 1 }}
                      onPress={() => {
                        setEditing(false);
                        setError(null);
                      }}
                    />
                  </View>
                </>
              ) : (
                <HeText variant="body" style={{ color: colors.textSoft, marginTop: spacing(0.25) }}>
                  {progress.userName || 'עוד לא בחרת שם'}
                </HeText>
              )}
            </Card>
          </FadeIn>

          <FadeIn delay={70}>
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
                  תשובות נכונות
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
                        fg={last ? colors.pinkDeep : colors.textSoft}
                      />
                    </View>
                    <ProgressBar value={best} total={QUESTIONS_PER_QUIZ} color={palette.accent} height={9} />
                    <HeText variant="tiny" style={{ color: colors.textFaint }}>
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
  hero: { height: 230, overflow: 'hidden' },
  heroContent: { flex: 1, alignItems: 'center', paddingHorizontal: spacing(2) },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 5,
    borderColor: colors.lotus,
    backgroundColor: colors.white,
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
  input: {
    marginTop: spacing(1),
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing(2),
    minHeight: 52,
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  editRow: { flexDirection: 'row-reverse', gap: spacing(1), marginTop: spacing(1.25) },
  statRow: { flexDirection: 'row-reverse', gap: spacing(1) },
  stat: {
    flex: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing(1.4),
    paddingHorizontal: spacing(0.6),
    alignItems: 'center',
    gap: spacing(0.25),
  },
  statNum: { fontSize: 28, lineHeight: 38, fontWeight: '900', color: colors.text, textAlign: 'center' },
  catRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing(1.1),
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing(1.25),
  },
});
