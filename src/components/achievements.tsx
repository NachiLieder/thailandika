import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { HeText } from './ui';
import { Medal } from './Scenery';
import { colors, radius, shadow, spacing } from '../theme';
import type { Badge } from '../data/types';

/** אייקוני הסטטיסטיקה – ציורים, לא אימוג'י */
export const StatIcon: React.FC<{ kind: 'calendar' | 'clock' | 'check' }> = ({ kind }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    {kind === 'calendar' && (
      <>
        <Path d="M4 6 h16 v14 a1 1 0 0 1 -1 1 H5 a1 1 0 0 1 -1 -1 Z" fill={colors.lotusPink} />
        <Path d="M4 6 h16 v4 H4 Z" fill={colors.lotusPink} />
        <Path d="M8 3 v4 M16 3 v4" stroke={colors.lotusPink} strokeWidth={2.2} strokeLinecap="round" />
        <Circle cx="9" cy="14" r="1.6" fill={colors.textLight} />
        <Circle cx="15" cy="14" r="1.6" fill={colors.textLight} />
      </>
    )}
    {kind === 'clock' && (
      <>
        <Circle cx="12" cy="12" r="9" fill={colors.lotusPink} />
        <Circle cx="12" cy="12" r="6.6" fill={colors.textLight} />
        <Path d="M12 8 v4.4 l3 1.8" stroke={colors.lotusPink} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      </>
    )}
    {kind === 'check' && (
      <>
        <Circle cx="12" cy="12" r="9" fill={colors.palmGreen} />
        <Path
          d="M7.6 12.4 l3 3 5.8 -6.2"
          stroke={colors.textLight}
          strokeWidth={2.6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
  </Svg>
);

/** רשת תגי ההישגים – שלוש עמודות, עם מצב נעול/פתוח אמיתי */
export const BadgeGrid: React.FC<{ badges: Badge[] }> = ({ badges }) => (
  <View style={styles.row}>
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
          style={{ textAlign: 'center', color: b.unlocked ? colors.textPrimary : colors.textSecondary }}
        >
          {b.titleHe}
        </HeText>
        {!b.unlocked && (
          <HeText variant="tiny" style={{ textAlign: 'center', color: colors.textSecondary, fontSize: 10 }}>
            🔒 {b.descriptionHe}
          </HeText>
        )}
      </View>
    ))}
  </View>
);

export type StatItem = { kind: 'calendar' | 'clock' | 'check'; value: string; unit: string; label: string };

/** שורת הסטטיסטיקות – מוצגים בה נתונים אמיתיים בלבד */
export const StatRow: React.FC<{ stats: StatItem[] }> = ({ stats }) => (
  <View style={styles.row}>
    {stats.map((s) => (
      <View key={s.kind} style={[styles.statCard, shadow(1)]}>
        <StatIcon kind={s.kind} />
        <HeText variant="heading" style={{ textAlign: 'center', fontSize: 17 }}>
          {s.value} {s.unit}
        </HeText>
        <HeText variant="tiny" style={{ textAlign: 'center', color: colors.textSecondary }}>
          {s.label}
        </HeText>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row-reverse', gap: spacing(1) },
  badgeCard: {
    flex: 1,
    backgroundColor: colors.textLight,
    borderRadius: radius.lg,
    borderWidth: 2,
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(0.75),
    alignItems: 'center',
    gap: spacing(0.5),
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.textLight,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(0.6),
    alignItems: 'center',
    gap: spacing(0.4),
  },
});
