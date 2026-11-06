import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { AppButton, Card, FadeIn, HeText, Logo, Pill, ProgressBar } from '../../src/components/ui';
import { CategoryIcon } from '../../src/components/CategoryIcon';
import { Elephant } from '../../src/components/Decor';
import { Lotus, ThaiFlag, TrophyCup } from '../../src/components/Scenery';
import { Decoration, PhotoHero } from '../../src/components/Photo';
import { homeCategories, getCategory } from '../../src/data/categories';
import { QUESTIONS_PER_QUIZ } from '../../src/data/questions';
import { categoryPalette, colors, layout, radius, shadow, spacing } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';

const Chevron: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={15} height={15} viewBox="0 0 24 24">
    <Path d="M15 5 L8 12 L15 19" stroke={color} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MenuIcon: React.FC = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    {[6, 12, 18].map((y) => (
      <Path key={y} d={`M4 ${y} H20`} stroke={colors.textLight} strokeWidth={2.6} strokeLinecap="round" />
    ))}
  </Svg>
);

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { progress, bestScoreFor, categoryStatus, bestPoints, maxPoints } = useAppState();

  const active = progress.activeQuiz;
  const activeCategory = getCategory(active?.categoryId);
  const stage = Math.min(6, Math.floor(bestPoints / 10) + 1);
  const cats = homeCategories();

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing(11) }}
        showsVerticalScrollIndicator={false}
      >
        {/* תפאורה טרופית וכותרת */}
        <View style={styles.hero}>
          <PhotoHero image="phiPhiHero" height={layout.heroHeight} dim={0.3} style={StyleSheet.absoluteFill as any} />
          <Decoration image="palmLeaf" size={150} rotate={-18} style={{ top: -26, right: -42 }} opacity={0.95} />
          <Decoration image="palmLeaf" size={128} rotate={24} flip style={{ top: -18, left: -36 }} opacity={0.9} />
          <View style={[styles.heroContent, { paddingTop: insets.top + spacing(1) }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="עוד אפשרויות"
              onPress={() => router.push('/(tabs)/more')}
              style={[styles.menuBtn, shadow(2)]}
            >
              <MenuIcon />
            </Pressable>

            <View style={styles.logoWrap}>
              <Lotus size={46} style={{ marginBottom: -12, zIndex: 2 }} />
              <View style={styles.logoRow}>
                <Logo />
                <ThaiFlag width={34} style={styles.flag} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {/* ברכה אישית */}
          <FadeIn>
            <Card style={styles.greetCard} color={colors.warmWhite}>
              <View style={{ flex: 1 }}>
                <HeText variant="title">שלום {progress.userName || 'חברה'}! ❤️</HeText>
                <HeText variant="body" style={{ color: colors.textSecondary }}>
                  איזה כיף שאת כאן!
                </HeText>
              </View>
              <Elephant size={66} />
              <Decoration image="hibiscus" size={46} style={{ bottom: -18, left: -18 }} opacity={0.95} />
            </Card>
          </FadeIn>

          {/* ממשיכים ללמוד */}
          {active && activeCategory && (
            <FadeIn delay={70}>
              <Card style={{ borderWidth: 2, borderColor: colors.mangoYellow }}>
                <Pill label="שיעור בתהליך" bg={colors.mangoSoft} fg="#8A5F00" />
                <HeText variant="heading" style={{ marginTop: spacing(1) }}>
                  ממשיכים ללמוד: {activeCategory.titleHe}
                </HeText>
                <HeText variant="small" style={{ color: colors.textSecondary, marginBottom: spacing(1) }}>
                  עצרת בשאלה {active.questionIndex + 1} מתוך {QUESTIONS_PER_QUIZ}, עם {active.score} נקודות.
                </HeText>
                <ProgressBar value={active.questionIndex} total={QUESTIONS_PER_QUIZ} color={colors.mangoYellow} trackColor={colors.sand} />
                <AppButton
                  title="ממשיכים מאיפה שעצרנו"
                  variant="mango"
                  style={{ marginTop: spacing(1.5) }}
                  onPress={() => router.push(`/quiz/${activeCategory.id}`)}
                />
              </Card>
            </FadeIn>
          )}

          {/* רשת שש הקטגוריות – שתי עמודות */}
          <View style={styles.grid}>
            {cats.map((cat, i) => {
              const palette = categoryPalette[cat.colorKey];
              const status = categoryStatus(cat.id);
              const best = bestScoreFor(cat.id);
              return (
                <FadeIn key={cat.id} delay={100 + i * 55} style={styles.gridCell}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${cat.titleHe}. ${cat.descriptionHe}`}
                    onPress={() => router.push(`/category/${cat.id}`)}
                    style={({ pressed }) => [
                      styles.catCard,
                      shadow(1),
                      { backgroundColor: palette.bg, borderColor: palette.ring },
                      pressed && { opacity: 0.86, transform: [{ scale: 0.98 }] },
                    ]}
                  >
                    <View style={styles.catTop}>
                      <CategoryIcon name={cat.icon} size={38} />
                      {status === 'completed' && (
                        <View style={[styles.doneDot, { backgroundColor: colors.palmGreen }]}>
                          <HeText variant="tiny" style={{ color: colors.textLight, textAlign: 'center' }}>
                            ✓
                          </HeText>
                        </View>
                      )}
                    </View>

                    <View style={styles.catTitleRow}>
                      <View style={[styles.chev, { backgroundColor: palette.accent }]}>
                        <Chevron color={colors.textLight} />
                      </View>
                      <HeText variant="heading" numberOfLines={2} style={{ flex: 1, fontSize: 15, lineHeight: 21 }}>
                        {cat.titleHe}
                      </HeText>
                    </View>

                    <HeText variant="small" style={{ color: colors.textSecondary, fontSize: 13 }} numberOfLines={2}>
                      {cat.descriptionHe}
                    </HeText>

                    <ProgressBar
                      value={best}
                      total={QUESTIONS_PER_QUIZ}
                      color={palette.accent}
                      trackColor={colors.textLight}
                      height={7}
                    />
                  </Pressable>
                </FadeIn>
              );
            })}
          </View>

          {/* ההתקדמות שלך */}
          <FadeIn delay={440}>
            <Card color={colors.warmWhite} style={styles.progressCard}>
              <View style={styles.trophyBubble}>
                <TrophyCup size={40} />
              </View>
              <View style={{ flex: 1, gap: spacing(0.5) }}>
                <HeText variant="heading" style={{ fontSize: 16 }}>
                  ההתקדמות שלך
                </HeText>
                <ProgressBar value={bestPoints} total={maxPoints} color={colors.lotusPink} height={11} trackColor={colors.sand} />
                <HeText variant="tiny" style={{ color: colors.textSecondary }}>
                  {bestPoints}/{maxPoints} נקודות
                </HeText>
              </View>
              <View style={styles.stageBadge}>
                <HeText variant="tiny" style={{ color: colors.textLight, textAlign: 'center' }}>
                  ⭐ שלב {stage}
                </HeText>
              </View>
            </Card>
          </FadeIn>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: layout.heroHeight, overflow: 'hidden' },
  heroContent: { flex: 1, paddingHorizontal: spacing(2) },
  menuBtn: {
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
  logoWrap: { alignItems: 'center', marginTop: spacing(1) },
  logoRow: { flexDirection: 'row-reverse', alignItems: 'center' },
  flag: { marginRight: -8, marginBottom: 22 },
  body: {
    paddingHorizontal: spacing(2),
    marginTop: -spacing(5.5),
    gap: spacing(1.5),
  },
  greetCard: {
    overflow: 'visible',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing(1.25),
    borderWidth: 2,
    borderColor: colors.lotusMid,
  },
  grid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: spacing(1.25),
  },
  gridCell: { width: '47.8%', flexGrow: 1 },
  catCard: {
    borderRadius: radius.lg,
    borderWidth: 2,
    padding: spacing(1.25),
    gap: spacing(0.65),
    minHeight: 146,
  },
  catTop: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  catTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing(0.75) },
  chev: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  doneDot: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  progressCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing(1.25),
    borderWidth: 2,
    borderColor: colors.lotusMid,
  },
  trophyBubble: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.mangoSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageBadge: {
    backgroundColor: colors.lotusPink,
    borderRadius: radius.pill,
    paddingHorizontal: spacing(1.1),
    paddingVertical: spacing(0.6),
  },
});
