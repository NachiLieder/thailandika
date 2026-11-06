import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { Card, FadeIn, HeText, ProgressBar, SectionTitle } from '../../src/components/ui';
import { BadgeGrid, StatRow, StatItem } from '../../src/components/achievements';
import { Avatar, Bloom } from '../../src/components/Scenery';
import { Decoration, PhotoHero } from '../../src/components/Photo';
import { colors, radius, shadow, spacing } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';

const GearIcon: React.FC = () => (
  <Svg width={21} height={21} viewBox="0 0 24 24">
    <Path
      d="M12 2.6 l1.9 2.8 h3.3 l.5 3.3 2.8 1.9 -2.8 1.9 -.5 3.3 h-3.3 L12 18.6 l-1.9 -2.8 H6.8 l-.5 -3.3 -2.8 -1.9 2.8 -1.9 .5 -3.3 h3.3 Z"
      fill={colors.textLight}
    />
    <Circle cx="12" cy="10.6" r="3" fill={colors.lotusPink} />
  </Svg>
);

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    progress,
    badges,
    minutesToday,
    streakDays,
    overallPercent,
    bestPoints,
    maxPoints,
    completedLessons,
  } = useAppState();

  const stats: StatItem[] = [
    { kind: 'calendar', value: `${streakDays}`, unit: streakDays === 1 ? 'יום' : 'ימים', label: 'ברצף' },
    {
      kind: 'clock',
      value: `${minutesToday}`,
      unit: minutesToday === 1 ? 'דקה' : 'דקות',
      label: 'לימוד היום',
    },
    { kind: 'check', value: `${completedLessons}`, unit: completedLessons === 1 ? 'נושא' : 'נושאים', label: 'הושלמו' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing(11) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <PhotoHero image="tropicalBeach" height={250} tone="cream" dim={0.42} style={StyleSheet.absoluteFill as any} />
          <Decoration image="palmLeaf" size={118} rotate={-16} style={{ top: -20, right: -34 }} opacity={0.8} />
          <Decoration image="hibiscus" size={54} style={{ top: 10, left: -14 }} opacity={0.85} />
          <View style={[styles.heroContent, { paddingTop: insets.top + spacing(1) }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="הגדרות"
              onPress={() => router.push('/(tabs)/more')}
              style={[styles.gearBtn, shadow(2)]}
            >
              <GearIcon />
            </Pressable>

            <View style={{ alignItems: 'center', marginTop: spacing(1) }}>
              <View style={[styles.avatarRing, shadow(2)]}>
                <Avatar size={92} />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="שינוי השם"
                onPress={() => router.push('/(tabs)/more')}
                style={[styles.nameRow, shadow(1)]}
              >
                <HeText variant="display" style={{ color: colors.lotusDark }}>
                  {progress.userName || 'חברה'}
                </HeText>
                <HeText style={{ fontSize: 18 }}>✏️</HeText>
              </Pressable>
              <View style={styles.taglineChip}>
                <HeText variant="small" style={{ color: colors.textPrimary, textAlign: 'center' }}>
                  🌴 לומדת תאילנדית במסע גדול
                </HeText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <FadeIn>
            <Card color={colors.warmWhite} style={{ borderWidth: 2, borderColor: colors.lotusMid }}>
              <View style={styles.overallHeader}>
                <HeText variant="heading">התקדמות כללית</HeText>
                <HeText style={{ fontSize: 22 }}>⭐</HeText>
              </View>
              <View style={styles.barRow}>
                <View style={{ flex: 1 }}>
                  <ProgressBar value={bestPoints} total={maxPoints} color={colors.lotusPink} height={14} trackColor={colors.sand} />
                </View>
                <View style={styles.percentChip}>
                  <HeText variant="tiny" style={{ color: colors.textLight, textAlign: 'center' }}>
                    {overallPercent}%
                  </HeText>
                </View>
              </View>
              <HeText variant="small" style={{ color: colors.textSecondary, marginTop: spacing(0.75) }}>
                {bestPoints}/{maxPoints} נקודות
              </HeText>
            </Card>
          </FadeIn>

          <FadeIn delay={80}>
            <SectionTitle title="ההישגים שלי" emoji="🏆" />
          </FadeIn>

          <FadeIn delay={120}>
            <BadgeGrid badges={badges} />
          </FadeIn>

          <FadeIn delay={180}>
            <SectionTitle title="הסטטיסטיקות שלי" emoji="📊" />
          </FadeIn>

          <FadeIn delay={220}>
            <StatRow stats={stats} />
          </FadeIn>

          <Bloom size={30} color={colors.lotusPink} style={{ alignSelf: 'center', opacity: 0.5 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 250, overflow: 'hidden' },
  heroContent: { flex: 1, paddingHorizontal: spacing(2) },
  gearBtn: {
    position: 'absolute',
    top: spacing(1),
    left: spacing(2),
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.lotusPink,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  avatarRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 5,
    borderColor: colors.lotusPink,
    backgroundColor: colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  nameRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing(0.75),
    backgroundColor: 'rgba(255, 252, 247, 0.92)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(0.4),
  },
  taglineChip: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.4),
    marginTop: spacing(0.5),
  },
  body: { paddingHorizontal: spacing(2), marginTop: -spacing(2), gap: spacing(1.25) },
  overallHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  barRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing(1), marginTop: spacing(1.25) },
  percentChip: {
    backgroundColor: colors.lotusPink,
    borderRadius: radius.pill,
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(0.35),
    minWidth: 50,
  },
});
