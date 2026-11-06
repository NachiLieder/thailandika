import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors, radius, shadow, spacing, typography } from '../../src/theme';
import { stopAllAudio } from '../../src/audio/useSpeech';

const HomeIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={26} height={26} viewBox="0 0 24 24">
    <Path d="M3 11 L12 3 L21 11 V21 H14 V15 H10 V21 H3 Z" fill={color} />
  </Svg>
);
const ChartIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={26} height={26} viewBox="0 0 24 24">
    <Rect x="3" y="12" width="4.5" height="9" rx="2" fill={color} />
    <Rect x="9.75" y="7" width="4.5" height="14" rx="2" fill={color} />
    <Rect x="16.5" y="3" width="4.5" height="18" rx="2" fill={color} />
  </Svg>
);
const GearIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={26} height={26} viewBox="0 0 24 24">
    <Path
      d="M12 2 l2 3 h3.5 l.5 3.5 3 2 -3 2 -.5 3.5 H14 l-2 3 -2-3 H6.5 L6 12.5 l-3-2 3-2 L6.5 5 H10 Z"
      fill={color}
    />
    <Circle cx="12" cy="11.5" r="3.2" fill={colors.cream} />
  </Svg>
);

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigateToTab: (routeKey: string) => void;
};

/** סרגל ניווט תחתון בכיווניות RTL, עם כפתור "בית" מורם במרכז */
function TabBar({ state, navigateToTab }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const tabs = [
    { name: 'progress', label: 'ההתקדמות', Icon: ChartIcon },
    { name: 'index', label: 'בית', Icon: HomeIcon, center: true },
    { name: 'settings', label: 'הגדרות', Icon: GearIcon },
  ];

  return (
    <View style={[styles.bar, shadow(3), { paddingBottom: Math.max(insets.bottom, spacing(1)) }]}>
      {tabs.map(({ name, label, Icon, center }) => {
        const routeIndex = state.routes.findIndex((r) => r.name === name);
        const route = state.routes[routeIndex];
        const focused = state.index === routeIndex;
        const onPress = () => {
          stopAllAudio();
          if (!focused && route) navigateToTab(route.key);
        };

        if (center) {
          return (
            <Pressable
              key={name}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              style={styles.centerWrap}
            >
              <View style={[styles.centerBtn, shadow(2), focused && { backgroundColor: colors.turquoise }]}>
                <Icon color={colors.white} />
              </View>
              <Text style={[styles.label, focused && styles.labelActive]} allowFontScaling>
                {label}
              </Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={name}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            style={styles.tab}
          >
            <Icon color={focused ? colors.turquoise : colors.textFaint} />
            <Text style={[styles.label, focused && styles.labelActive]} allowFontScaling>
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
      <Tabs.Screen name="progress" options={{ title: 'ההתקדמות שלי' }} />
      <Tabs.Screen name="settings" options={{ title: 'הגדרות' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing(1),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: spacing(0.5),
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    marginTop: -spacing(3),
  },
  centerBtn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.lotus,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
  label: {
    ...typography.tiny,
    color: colors.textFaint,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.turquoise,
  },
});
