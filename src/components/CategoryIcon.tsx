import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Path, Circle, Rect, G, Ellipse, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme';

type Props = { name: string; size?: number; style?: ViewStyle };

export const CategoryIcon: React.FC<Props> = ({ name, size = 56, style }) => {
  const s = { width: size, height: size };
  return (
    <View style={[s, style]} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {name === 'book' && (
          <G>
            <Path d="M10 22 Q30 14 48 22 L48 80 Q30 72 10 80 Z" fill="#FFF6E2" stroke="#C98A2E" strokeWidth={3} />
            <Path d="M90 22 Q70 14 52 22 L52 80 Q70 72 90 80 Z" fill="#FFF6E2" stroke="#C98A2E" strokeWidth={3} />
            <Path d="M18 34 H40 M18 44 H40 M18 54 H36" stroke="#C98A2E" strokeWidth={3} strokeLinecap="round" />
            <Path d="M60 34 H82 M60 44 H82 M64 54 H82" stroke="#C98A2E" strokeWidth={3} strokeLinecap="round" />
          </G>
        )}
        {name === 'chat' && (
          <G>
            <Rect x="8" y="22" width="56" height="40" rx="14" fill={colors.lotusPink} />
            <Path d="M22 62 L20 78 L38 62 Z" fill={colors.lotusPink} />
            <Circle cx="26" cy="42" r="4" fill="#FFF" />
            <Circle cx="38" cy="42" r="4" fill="#FFF" />
            <Circle cx="50" cy="42" r="4" fill="#FFF" />
            <Rect x="50" y="46" width="42" height="30" rx="12" fill={colors.turquoise} />
            <Path d="M80 76 L84 88 L68 76 Z" fill={colors.turquoise} />
          </G>
        )}
        {name === 'food' && (
          <G>
            <Ellipse cx="50" cy="58" rx="38" ry="24" fill="#2E4A52" />
            <Ellipse cx="50" cy="54" rx="33" ry="19" fill="#F3B14E" />
            <Path d="M28 52 Q38 44 48 52 Q58 44 68 52" stroke="#E86A4A" strokeWidth={5} fill="none" strokeLinecap="round" />
            <Circle cx="38" cy="58" r="5" fill="#F7E6B8" />
            <Circle cx="60" cy="60" r="5" fill="#F7E6B8" />
            <Path d="M72 26 L84 18" stroke={colors.palmGreen} strokeWidth={5} strokeLinecap="round" />
            <Ellipse cx="68" cy="30" rx="10" ry="5" fill={colors.palmGreen} transform="rotate(-25 68 30)" />
          </G>
        )}
        {name === 'temple' && (
          <G>
            <Path d="M50 8 L57 26 L43 26 Z" fill="#E0A32B" />
            <Path d="M26 46 L50 22 L74 46 Z" fill="#F3C65F" />
            <Path d="M20 66 L50 40 L80 66 Z" fill="#E0A32B" />
            <Rect x="32" y="66" width="36" height="24" rx="3" fill="#FFF0CF" />
            <Rect x="45" y="74" width="10" height="16" rx="4" fill="#C98A2E" />
            <Path d="M8 92 Q30 84 50 92 Q70 100 92 92" stroke={colors.turquoise} strokeWidth={5} fill="none" strokeLinecap="round" />
          </G>
        )}
        {name === 'numbers' && (
          <G>
            <SvgText x="14" y="62" fontSize="42" fontWeight="bold" fill={colors.lotusPink}>1</SvgText>
            <SvgText x="36" y="70" fontSize="42" fontWeight="bold" fill={colors.turquoise}>2</SvgText>
            <SvgText x="62" y="56" fontSize="42" fontWeight="bold" fill="#E9A62B">3</SvgText>
          </G>
        )}
        {name === 'game' && (
          <G>
            <Rect x="10" y="34" width="80" height="40" rx="20" fill="#F0ECF7" stroke={colors.lavender} strokeWidth={3} />
            <Rect x="24" y="50" width="16" height="5" rx="2.5" fill={colors.lavender} />
            <Rect x="29.5" y="44.5" width="5" height="16" rx="2.5" fill={colors.lavender} />
            <Circle cx="66" cy="48" r="5" fill={colors.lotusPink} />
            <Circle cx="76" cy="58" r="5" fill={colors.mangoYellow} />
            <Circle cx="66" cy="60" r="4" fill={colors.turquoise} />
          </G>
        )}
      </Svg>
    </View>
  );
};
