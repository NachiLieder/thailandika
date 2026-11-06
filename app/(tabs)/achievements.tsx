import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { Card, FadeIn, HeText, ProgressBar, SectionTitle } from '../../src/components/ui';
import { Avatar, Bloom, Medal, TropicalScene } from '../../src/components/Scenery';
import { colors, radius, shadow, spacing } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';

const GearIcon: React.FC = () => (
  <Svg width={21} height={21} viewBox="0 0 24 24">
    <Path
      d="M12 2.6 l1.9 2.8 h3.3 l.5 3.3 2.8 1.9 -2.8 1.9 -.5 3.3 h-3.3 L12 18.6 l-1.9 -2.8 H6.8 l-.5 -3.3 -2.8 -1.9 2.8 -1.9 .5 -3.3 h3.3 Z"
      fill={colors.white}
    />
    <Circle cx="12" cy="10.6" r="3" fill={colors.pink} />
  </Svg>
);

const StatIcon: React.FC<{ kind: 'calendar' | 'clock' | 'check' }> = ({ kind }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    {kind === 'calendar' && (
      <>
        <Path d="M4 6 h16 v14 a1 1 0 0 1 -1 1 H5 a1 1 0 0 1 -1 -1 Z" fill={colors.lotus} />
        <Path d="M4 6 h16 v4 H4 Z" fill={colors.pink} />
        <Path d="M8 3 v4 M16 3 v4" stroke={colors.pink} strokeWidth={2.2} strokeLinecap="round" />
        <Circle cx="9" cy="14" r="1.6" fill={colors.white} />
        <Circle cx="15" cy="14" r="1.6" fill={colors.white} />
      </>
    )}
    {kind === 'clock' && (
      <>
        <Circle cx="12" cy="12" r="9" fill={colors.lotus} />
        <Circle cx="12" cy="12" r="6.6" fill={colors.white} />
        <Path d="M12 8 v4.4 l3 1.8" stroke={colors.pink} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      </>
    )}
    {kind === 'check' && (
      <>
        <Circle cx="12" cy="12" r="9" fill={colors.leaf} />
        <Path d="M7.6 12.4 l3 3 5.8 -6.2" stroke={colors.white} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
  </Svg>
);

export default function AchievementsScreen() {
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

  const stats = [
    { kind: 'calendar' as const, value: `${streakDays}`, unit: streakDays === 1 ? 'יום' : 'ימים', label: 'ברצף' },
    {
      kind: 'clock' as const,
      value: `${minutesToday}`,
      unit: minutesToday === 1 ? 'דקה' : 'דקות',
      label: 'לימוד היום',
    },
    { kind: 'check' as const, value: `${completedLessons}`, unit: completedLessons === 1 ? 'נושא' : 'נושאים', label: 'הושלמו' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing(11) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <TropicalScene height={250} style={StyleSheet.absoluteFill as any} />
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
                accessibilityLabel="עריכת השם בפרופיל"
                onPress={() => router.push('/(tabs)/profile')}
                style={styles.nameRow}
              >
                <HeText variant="display" style={{ color: colors.pinkDeep }}>
                  {progress.userName || 'חברה'}
                </HeText>
                <HeText style={{ fontSize: 18 }}>✏️</HeText>
              </Pressable>
              <View style={styles.taglineChip}>
                <HeText variant="small" style={{ color: colors.text, textAlign: 'center' }}>
                  🌴 לומדת תאילנדית במסע גדול
                </HeText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <FadeIn>
            <Card color={colors.creamCard} style={{ borderWidth: 2, borderColor: colors.lotusMid }}>
              <View style={styles.overallHeader}>
                <HeText variant="heading">התקדמות כללית</HeText>
                <HeText style={{ fontSize: 22 }}>⭐</HeText>
              </View>
              <View style={styles.barRow}>
                <View style={{ flex: 1 }}>
                  <ProgressBar value={bestPoints} total={maxPoints} color={colors.pink} height={14} />
                </View>
                <View style={styles.percentChip}>
                  <HeText variant="tiny" style={{ color: colors.white, textAlign: 'center' }}>
                    {overallPercent}%
                  </HeText>
                </View>
              </View>
              <HeText variant="small" style={{ color: colors.textSoft, marginTop: spacing(0.75) }}>
                {bestPoints}/{maxPoints} נקודות
              </HeText>
            </Card>
          </FadeIn>

          <FadeIn delay={80}>
            <SectionTitle title="ההישגים שלי" emoji="🏆" />
          </FadeIn>

          <FadeIn delay={120}>
            <View style={styles.badgeRow}>
              {badges.map((b) => (
                <View
                  key={b.id}
                  accessible
                  accessibilityLabel={`${b.titleHe}. ${b.unlocked ? 'הושג' : 'עדיין נעול'}. ${b.descriptionHe}`}
                  style={[
                    styles.badgeCard,
                    shadow(1),
                    { borderColor: b.unlocked ? colors.lotusMid : colors.border },
                    !b.unlocked && { backgroundColor: '#F7F3EC' },
                  ]}
                >
                  <Medal size={50} unlocked={b.unlocked} tone={b.tone} />
                  <HeText
                    variant="tiny"
                    style={{ textAlign: 'center', color: b.unlocked ? colors.text : colors.textFaint }}
                  >
                    {b.titleHe}
                  </HeText>
                  {!b.unlocked && (
                    <HeText variant="tiny" style={{ textAlign: 'center', color: colors.textFaint, fontSize: 10 }}>
                      🔒 {b.descriptionHe}
                    </HeText>
                  )}
                </View>
              ))}
            </View>
          </FadeIn>

          <FadeIn delay={180}>
            <SectionTitle title="הסטטיסטיקות שלי" emoji="📊" />
          </FadeIn>

          <FadeIn delay={220}>
            <View style={styles.badgeRow}>
              {stats.map((s) => (
                <View key={s.kind} style={[styles.statCard, shadow(1)]}>
                  <StatIcon kind={s.kind} />
                  <HeText variant="heading" style={{ textAlign: 'center', fontSize: 17 }}>
                    {s.value} {s.unit}
                  </HeText>
                  <HeText variant="tiny" style={{ textAlign: 'center', color: colors.textSoft }}>
                    {s.label}
                  </HeText>
                </View>
              ))}
            </View>
          </FadeIn>

          <Bloom size={30} color={colors.lotus} style={{ alignSelf: 'center', opacity: 0.5 }} />
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
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  avatarRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 5,
    borderColor: colors.lotus,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  nameRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, marginTop: spacing(0.75) },
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
    backgroundColor: colors.pink,
    borderRadius: radius.pill,
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(0.35),
    minWidth: 50,
  },
  badgeRow: { flexDirection: 'row-reverse', gap: spacing(1) },
  badgeCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 2,
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(0.75),
    alignItems: 'center',
    gap: spacing(0.5),
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(0.6),
    alignItems: 'center',
    gap: spacing(0.4),
  },
});
