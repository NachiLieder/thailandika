import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, Card, FadeIn, HeText, ProgressBar, SectionTitle } from '../../src/components/ui';
import { BadgeGrid, StatRow, StatItem } from '../../src/components/achievements';
import { Medal, TrophyCup } from '../../src/components/Scenery';
import { Decoration, PhotoHero } from '../../src/components/Photo';
import { colors, radius, shadow, spacing } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';

export default function AchievementsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    badges,
    minutesToday,
    streakDays,
    overallPercent,
    bestPoints,
    maxPoints,
    completedLessons,
  } = useAppState();

  const unlocked = badges.filter((b) => b.unlocked).length;

  const stats: StatItem[] = [
    { kind: 'calendar', value: `${streakDays}`, unit: streakDays === 1 ? 'יום' : 'ימים', label: 'ברצף' },
    { kind: 'clock', value: `${minutesToday}`, unit: minutesToday === 1 ? 'דקה' : 'דקות', label: 'לימוד היום' },
    {
      kind: 'check',
      value: `${completedLessons}`,
      unit: completedLessons === 1 ? 'נושא' : 'נושאים',
      label: 'הושלמו',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing(11) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <PhotoHero
            image="tropicalBeach"
            height={236}
            tone="cream" dim={0.42}
            style={StyleSheet.absoluteFill as any}
          />
          <Decoration image="palmLeaf" size={118} rotate={-16} style={{ top: -20, right: -34 }} opacity={0.8} />
          <Decoration image="hibiscus" size={52} style={{ bottom: 12, left: -12 }} opacity={0.85} />

          <View style={[styles.heroContent, { paddingTop: insets.top + spacing(1.5) }]}>
            <View style={[styles.trophyRing, shadow(2)]}>
              <TrophyCup size={74} />
            </View>
            <HeText variant="display" style={{ color: colors.lotusDark, textAlign: 'center' }}>
              ההישגים שלי
            </HeText>
            <View style={styles.chip}>
              <HeText variant="small" style={{ textAlign: 'center' }}>
                🏆 {unlocked} מתוך {badges.length} הישגים נפתחו
              </HeText>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <FadeIn>
            <Card color={colors.warmWhite} style={{ borderWidth: 2, borderColor: colors.lotusMid }}>
              <View style={styles.rowBetween}>
                <HeText variant="heading">הניקוד הכולל</HeText>
                <View style={styles.percentChip}>
                  <HeText variant="tiny" style={{ color: colors.textLight, textAlign: 'center' }}>
                    {overallPercent}%
                  </HeText>
                </View>
              </View>
              <ProgressBar
                value={bestPoints}
                total={maxPoints}
                color={colors.lotusPink}
                height={14}
                trackColor={colors.sand}
              />
              <HeText variant="small" style={{ color: colors.textSecondary, marginTop: spacing(0.75) }}>
                {bestPoints}/{maxPoints} נקודות
              </HeText>
            </Card>
          </FadeIn>

          <FadeIn delay={80}>
            <SectionTitle title="התגים שלי" emoji="🎖️" />
          </FadeIn>

          <FadeIn delay={120}>
            <BadgeGrid badges={badges} />
          </FadeIn>

          <FadeIn delay={170}>
            <SectionTitle title="איך פותחים כל תג" emoji="🔑" />
          </FadeIn>

          {badges.map((b, i) => (
            <FadeIn key={b.id} delay={200 + i * 50}>
              <Card color={colors.warmWhite} style={styles.howRow}>
                <Medal size={38} unlocked={b.unlocked} tone={b.tone} />
                <View style={{ flex: 1, gap: 2 }}>
                  <HeText variant="heading" style={{ fontSize: 16 }}>
                    {b.titleHe}
                  </HeText>
                  <HeText variant="small" style={{ color: colors.textSecondary }}>
                    {b.descriptionHe}
                  </HeText>
                </View>
                <HeText style={{ fontSize: 18 }}>{b.unlocked ? '✅' : '🔒'}</HeText>
              </Card>
            </FadeIn>
          ))}

          <FadeIn delay={380}>
            <SectionTitle title="הסטטיסטיקות שלי" emoji="📊" />
          </FadeIn>

          <FadeIn delay={420}>
            <StatRow stats={stats} />
          </FadeIn>

          <FadeIn delay={470}>
            <AppButton title="ממשיכים ללמוד" onPress={() => router.push('/(tabs)')} />
          </FadeIn>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 236, overflow: 'hidden' },
  heroContent: { flex: 1, paddingHorizontal: spacing(2), alignItems: 'center' },
  trophyRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 5,
    borderColor: colors.mangoYellow,
    backgroundColor: colors.warmWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing(0.75),
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.85)',
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
    marginBottom: spacing(1.25),
  },
  percentChip: {
    backgroundColor: colors.lotusPink,
    borderRadius: radius.pill,
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(0.35),
    minWidth: 50,
  },
  howRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing(1.25) },
});
