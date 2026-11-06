import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors, radius, shadow, spacing, typography } from '../../src/theme';
import { stopAllAudio } from '../../src/audio/useSpeech';

type IconProps = { color: string };

const HomeIcon: React.FC<IconProps> = ({ color }) => (
  <Svg width={25} height={25} viewBox="0 0 24 24">
    <Path d="M3 11 L12 3 L21 11 V21 H14.5 V15 H9.5 V21 H3 Z" fill={color} />
  </Svg>
);
const TrophyIcon: React.FC<IconProps> = ({ color }) => (
  <Svg width={25} height={25} viewBox="0 0 24 24">
    <Path d="M7 3 h10 v6 a5 5 0 0 1 -10 0 Z" fill={color} />
    <Path d="M7 4 C4 4 3.5 9 7 10" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" />
    <Path d="M17 4 C20 4 20.5 9 17 10" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" />
    <Rect x="10.8" y="13.5" width="2.4" height="4" fill={color} />
    <Rect x="7.5" y="17.5" width="9" height="2.6" rx="1.3" fill={color} />
  </Svg>
);
const PersonIcon: React.FC<IconProps> = ({ color }) => (
  <Svg width={25} height={25} viewBox="0 0 24 24">
    <Circle cx="12" cy="7.8" r="4.2" fill={color} />
    <Path d="M3.8 21 C4.6 15.8 8 13.6 12 13.6 C16 13.6 19.4 15.8 20.2 21 Z" fill={color} />
  </Svg>
);
const ChartIcon: React.FC<IconProps> = ({ color }) => (
  <Svg width={25} height={25} viewBox="0 0 24 24">
    <Rect x="3.4" y="12.5" width="4.2" height="8" rx="1.6" fill={color} />
    <Rect x="9.9" y="7.5" width="4.2" height="13" rx="1.6" fill={color} />
    <Rect x="16.4" y="3.5" width="4.2" height="17" rx="1.6" fill={color} />
  </Svg>
);
const MoreIcon: React.FC<IconProps> = ({ color }) => (
  <Svg width={25} height={25} viewBox="0 0 24 24">
    <Circle cx="5.5" cy="12" r="2.1" fill={color} />
    <Circle cx="12" cy="12" r="2.1" fill={color} />
    <Circle cx="18.5" cy="12" r="2.1" fill={color} />
  </Svg>
);

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigateToTab: (routeKey: string) => void;
};

/** סרגל ניווט תחתון בכיווניות RTL: בית · התקדמות · הישגים · פרופיל · עוד */
function TabBar({ state, navigateToTab }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const tabs = [
    { name: 'index', label: 'בית', Icon: HomeIcon },
    { name: 'progress', label: 'התקדמות', Icon: ChartIcon },
    { name: 'achievements', label: 'הישגים', Icon: TrophyIcon },
    { name: 'profile', label: 'פרופיל', Icon: PersonIcon },
    { name: 'more', label: 'עוד', Icon: MoreIcon },
  ];

  return (
    <View style={[styles.bar, shadow(3), { paddingBottom: Math.max(insets.bottom, spacing(1)) }]}>
      {tabs.map(({ name, label, Icon }) => {
        const routeIndex = state.routes.findIndex((r) => r.name === name);
        const route = state.routes[routeIndex];
        const focused = state.index === routeIndex;
        return (
          <Pressable
            key={name}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            onPress={() => {
              stopAllAudio();
              if (!focused && route) navigateToTab(route.key);
            }}
            style={styles.tab}
          >
            <View style={[styles.iconSlot, focused && styles.iconSlotActive, focused && shadow(2)]}>
              <Icon color={focused ? colors.textLight : colors.textSecondary} />
            </View>
            <Text style={[styles.label, focused && styles.labelActive]} allowFontScaling numberOfLines={1}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...(props as unknown as TabBarProps)} />}>
      <Tabs.Screen name="index" options={{ title: 'בית' }} />
      <Tabs.Screen name="progress" options={{ title: 'התקדמות' }} />
      <Tabs.Screen name="achievements" options={{ title: 'הישגים' }} />
      <Tabs.Screen name="profile" options={{ title: 'פרופיל' }} />
      <Tabs.Screen name="more" options={{ title: 'עוד' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    backgroundColor: colors.warmWhite,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing(1.25),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingBottom: spacing(0.5),
  },
  iconSlot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSlotActive: {
    backgroundColor: colors.lotusPink,
    marginTop: -spacing(2),
    borderWidth: 4,
    borderColor: colors.warmWhite,
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  label: {
    ...typography.tiny,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.lotusPink,
  },
});
