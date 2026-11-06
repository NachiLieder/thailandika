import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path, Circle, Ellipse, G, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '../theme';

/** עלה דקל מסוגנן */
export const PalmLeaf: React.FC<{ size?: number; color?: string; style?: ViewStyle }> = ({
  size = 90,
  color = colors.palmGreen,
  style,
}) => (
  <View style={style} pointerEvents="none">
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G opacity={0.55}>
        <Path d="M50 95 C48 65 44 40 20 12" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((i) => (
          <G key={i}>
            <Path
              d={`M${46 - i * 6} ${72 - i * 14} C${20 - i * 3} ${66 - i * 14} ${14 - i * 2} ${52 - i * 13} ${30 - i * 4} ${44 - i * 13}`}
              stroke={color}
              strokeWidth={6}
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d={`M${48 - i * 6} ${72 - i * 14} C${74 - i * 6} ${64 - i * 14} ${80 - i * 6} ${50 - i * 13} ${62 - i * 6} ${44 - i * 13}`}
              stroke={color}
              strokeWidth={6}
              strokeLinecap="round"
              fill="none"
            />
          </G>
        ))}
      </G>
    </Svg>
  </View>
);

/** פרח היביסקוס/לוטוס מסוגנן */
export const Hibiscus: React.FC<{ size?: number; color?: string; style?: ViewStyle }> = ({
  size = 60,
  color = colors.lotusPink,
  style,
}) => (
  <View style={style} pointerEvents="none">
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G>
        {[0, 72, 144, 216, 288].map((deg) => (
          <Ellipse
            key={deg}
            cx="50"
            cy="28"
            rx="17"
            ry="25"
            fill={color}
            opacity={0.9}
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
        <Circle cx="50" cy="50" r="11" fill={colors.mangoYellow} />
        <Circle cx="50" cy="50" r="5" fill="#FFF3D6" />
      </G>
    </Svg>
  </View>
);

/** גל ים */
export const Wave: React.FC<{ width?: number; height?: number; color?: string; style?: ViewStyle }> = ({
  width = 400,
  height = 40,
  color = colors.turquoiseMid,
  style,
}) => (
  <View style={style} pointerEvents="none">
    <Svg width={width} height={height} viewBox="0 0 400 40" preserveAspectRatio="none">
      <Path
        d="M0 20 C 50 0, 100 40, 150 20 S 250 0, 300 20 S 380 40, 400 22 L400 40 L0 40 Z"
        fill={color}
      />
    </Svg>
  </View>
);

/** מקדש תאילנדי מסוגנן */
export const Temple: React.FC<{ size?: number; style?: ViewStyle }> = ({ size = 110, style }) => (
  <View style={style} pointerEvents="none">
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFD97A" />
          <Stop offset="1" stopColor="#E0A32B" />
        </LinearGradient>
      </Defs>
      <Path d="M50 6 L58 26 L42 26 Z" fill="url(#gold)" />
      <Path d="M28 44 L50 22 L72 44 Z" fill="url(#gold)" />
      <Path d="M22 62 L50 38 L78 62 Z" fill="url(#gold)" />
      <Rect x="32" y="62" width="36" height="28" rx="3" fill="#F7E2B5" />
      <Rect x="45" y="72" width="10" height="18" rx="4" fill="#C98A2E" />
      <Rect x="26" y="88" width="48" height="6" rx="3" fill="url(#gold)" />
    </Svg>
  </View>
);

/** פיל ידידותי – דמות הקמע של האפליקציה */
export const Elephant: React.FC<{ size?: number; style?: ViewStyle }> = ({ size = 72, style }) => (
  <View style={style} pointerEvents="none">
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G>
        <Ellipse cx="22" cy="46" rx="13" ry="16" fill="#B9A7C9" />
        <Ellipse cx="78" cy="46" rx="13" ry="16" fill="#B9A7C9" />
        <Circle cx="50" cy="48" r="28" fill="#CDBEDA" />
        <Path
          d="M50 70 C50 84 62 88 66 80 C68 76 64 73 62 76"
          stroke="#CDBEDA"
          strokeWidth={10}
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx="40" cy="44" r="4" fill={colors.textPrimary} />
        <Circle cx="60" cy="44" r="4" fill={colors.textPrimary} />
        <Circle cx="34" cy="55" r="5" fill={colors.lotusPink} opacity={0.5} />
        <Circle cx="66" cy="55" r="5" fill={colors.lotusPink} opacity={0.5} />
        <Path d="M30 26 Q50 14 70 26" stroke={colors.lotusPink} strokeWidth={5} fill="none" strokeLinecap="round" />
      </G>
    </Svg>
  </View>
);

/** רקע טרופי עדין למסכי תוכן – לא פוגע בקריאות */
export const TropicalBackdrop: React.FC<{ tint?: string }> = ({ tint = colors.turquoiseSoft }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]} />
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 220,
        backgroundColor: tint,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
        opacity: 0.85,
      }}
    />
    <PalmLeaf size={150} color={colors.palmGreen} style={{ position: 'absolute', top: -20, left: -40, opacity: 0.35 }} />
    <Hibiscus size={64} color={colors.lotusPink} style={{ position: 'absolute', top: 120, right: -14, opacity: 0.3 }} />
    <Hibiscus size={44} color={colors.mangoYellow} style={{ position: 'absolute', bottom: 40, left: 10, opacity: 0.22 }} />
  </View>
);
