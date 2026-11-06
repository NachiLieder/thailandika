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

/** סרגל ניווט תחתון בכיווניות RTL: בית · הישגים · הפרופיל · עוד */
function TabBar({ state, navigateToTab }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const tabs = [
    { name: 'index', label: 'בית', Icon: HomeIcon },
    { name: 'achievements', label: 'הישגים', Icon: TrophyIcon },
    { name: 'profile', label: 'הפרופיל', Icon: PersonIcon },
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
            <Icon color={focused ? colors.pink : colors.textFaint} />
            <Text style={[styles.label, focused && styles.labelActive]} allowFontScaling>
              {label}
            </Text>
            {focused && <View style={styles.activeDash} />}
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
      <Tabs.Screen name="achievements" options={{ title: 'הישגים' }} />
      <Tabs.Screen name="profile" options={{ title: 'הפרופיל' }} />
      <Tabs.Screen name="more" options={{ title: 'עוד' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    backgroundColor: colors.creamCard,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing(1.25),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingBottom: spacing(0.5),
  },
  label: {
    ...typography.tiny,
    color: colors.textFaint,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.pink,
  },
  activeDash: {
    width: 26,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.pink,
    marginTop: 1,
  },
});
