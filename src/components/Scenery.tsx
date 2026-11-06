import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { colors } from '../theme';

/* ----------------------------------------------------------------
   איורים מקוריים ב-SVG. המוקאפ משתמש בתצלומים טרופיים, וכאן הם
   מוחלפים באיורים שנוצרו לפרויקט, כדי לא להשתמש בתמונות מוגנות.
------------------------------------------------------------------- */

const Palm: React.FC<{ x: number; y: number; scale?: number; flip?: boolean }> = ({
  x,
  y,
  scale = 1,
  flip,
}) => (
  <G transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
    <Path d="M0 0 C -4 -26 -6 -48 -14 -70" stroke="#7E5A36" strokeWidth={5} fill="none" strokeLinecap="round" />
    {[
      'M-14 -70 C -44 -82 -62 -70 -66 -52 C -50 -66 -30 -68 -14 -70 Z',
      'M-14 -70 C 14 -86 36 -78 44 -60 C 26 -72 4 -74 -14 -70 Z',
      'M-14 -70 C -40 -96 -34 -116 -18 -126 C -24 -108 -18 -88 -14 -70 Z',
      'M-14 -70 C 8 -98 30 -98 42 -86 C 20 -88 2 -80 -14 -70 Z',
      'M-14 -70 C -34 -58 -38 -40 -30 -26 C -28 -46 -22 -60 -14 -70 Z',
    ].map((d, i) => (
      <Path key={i} d={d} fill={i % 2 ? '#2E8B57' : '#3CA468'} opacity={0.95} />
    ))}
    <Circle cx={-14} cy={-70} r={4} fill="#8A6239" />
  </G>
);

const TempleShape: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <G transform={`translate(${x} ${y}) scale(${scale})`}>
    <Path d="M0 -92 L5 -74 L-5 -74 Z" fill="#F2C44C" />
    <Path d="M-26 -52 L0 -78 L26 -52 Z" fill="#F7D277" />
    <Path d="M-34 -52 L-26 -52 L-30 -44 Z" fill="#E0A32B" />
    <Path d="M34 -52 L26 -52 L30 -44 Z" fill="#E0A32B" />
    <Path d="M-36 -24 L0 -58 L36 -24 Z" fill="#F2C44C" />
    <Rect x={-26} y={-24} width={52} height={26} rx={2} fill="#FBEBC8" />
    <Rect x={-7} y={-14} width={14} height={16} rx={6} fill="#C98A2E" />
    <Rect x={-20} y={-14} width={8} height={10} rx={3} fill="#E8C98C" />
    <Rect x={12} y={-14} width={8} height={10} rx={3} fill="#E8C98C" />
    <Rect x={-32} y={0} width={64} height={5} rx={2.5} fill="#E0A32B" />
  </G>
);

const Cliff: React.FC<{ x: number; y: number; w: number; h: number; tint?: string }> = ({
  x,
  y,
  w,
  h,
  tint = '#8FA98C',
}) => (
  <G transform={`translate(${x} ${y})`}>
    <Path
      d={`M0 0 C ${w * 0.1} ${-h * 0.75} ${w * 0.3} ${-h} ${w * 0.5} ${-h * 0.92} C ${w * 0.72} ${-h * 0.98} ${w * 0.9} ${-h * 0.6} ${w} 0 Z`}
      fill={tint}
    />
    <Path
      d={`M${w * 0.18} 0 C ${w * 0.24} ${-h * 0.5} ${w * 0.36} ${-h * 0.72} ${w * 0.46} ${-h * 0.68} C ${w * 0.4} ${-h * 0.4} ${w * 0.36} ${-h * 0.18} ${w * 0.38} 0 Z`}
      fill="#000"
      opacity={0.06}
    />
    <Ellipse cx={w * 0.3} cy={-h * 0.86} rx={w * 0.16} ry={h * 0.1} fill="#4E8B55" opacity={0.75} />
    <Ellipse cx={w * 0.62} cy={-h * 0.72} rx={w * 0.14} ry={h * 0.09} fill="#4E8B55" opacity={0.6} />
  </G>
);

const Cloud: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 0.9 }) => (
  <G transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <Ellipse cx={0} cy={0} rx={26} ry={13} fill="#FFFFFF" />
    <Ellipse cx={20} cy={4} rx={20} ry={10} fill="#FFFFFF" />
    <Ellipse cx={-20} cy={4} rx={18} ry={9} fill="#FFFFFF" />
  </G>
);

/**
 * תפאורה טרופית מלאה: שמיים, עננים, צוקי גיר, ים טורקיז, חוף,
 * מקדש ועצי דקל. משמשת כרקע למסכים הראשיים.
 */
export const TropicalScene: React.FC<{ height?: number; style?: ViewStyle }> = ({
  height = 290,
  style,
}) => (
  <View style={[{ height }, style]} pointerEvents="none">
    <Svg width="100%" height="100%" viewBox="0 0 400 250" preserveAspectRatio="xMidYMax slice">
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#4FC3E8" />
          <Stop offset="0.65" stopColor="#A4E2F2" />
          <Stop offset="1" stopColor="#D9F2F7" />
        </LinearGradient>
        <LinearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#30B6D4" />
          <Stop offset="1" stopColor="#86DFE2" />
        </LinearGradient>
        <LinearGradient id="shore" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FBECCB" />
          <Stop offset="1" stopColor="#F3DCAD" />
        </LinearGradient>
      </Defs>

      <Rect x="0" y="0" width="400" height="250" fill="url(#sky)" />
      <Cloud x={72} y={34} s={0.95} o={0.85} />
      <Cloud x={296} y={24} s={0.75} o={0.65} />
      <Cloud x={196} y={58} s={0.55} o={0.45} />

      {/* צוקי גיר ברקע */}
      <Cliff x={-14} y={152} w={108} h={104} tint="#8BAA8C" />
      <Cliff x={78} y={152} w={76} h={66} tint="#9FBC99" />
      <Cliff x={286} y={152} w={104} h={84} tint="#9FBC99" />

      {/* ים */}
      <Rect x="0" y="152" width="400" height="52" fill="url(#sea)" />
      <Path d="M0 160 C 70 154 130 166 200 160 C 270 154 340 166 400 158 L400 152 L0 152 Z" fill="#2AA7C6" opacity={0.45} />
      <Path d="M46 174 h26 M132 184 h22 M248 176 h26 M322 188 h20" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.65} />

      {/* סירת זנב ארוך */}
      <G transform="translate(116 184)">
        <Path d="M-24 0 C -16 7 16 7 24 0 C 14 4 -14 4 -24 0 Z" fill="#B05B3B" />
        <Path d="M-22 -1 L28 -11" stroke="#8A4630" strokeWidth={2.5} strokeLinecap="round" />
        <Path d="M-5 -2 L-5 -13 L7 -7 Z" fill="#E8417F" opacity={0.9} />
      </G>

      {/* חוף */}
      <Path d="M0 198 C 70 190 150 210 230 200 C 300 192 356 206 400 198 L400 250 L0 250 Z" fill="url(#shore)" />
      <Path d="M0 198 C 70 190 150 210 230 200 C 300 192 356 206 400 198" stroke="#FFFFFF" strokeWidth={3.5} fill="none" opacity={0.75} />

      <TempleShape x={318} y={212} scale={0.95} />
      <Palm x={52} y={236} scale={0.95} />
      <Palm x={374} y={246} scale={0.8} flip />
    </Svg>
  </View>
);

/** תפאורת חוף רגועה למסך הסיום */
export const BeachScene: React.FC<{ height?: number; style?: ViewStyle }> = ({
  height = 260,
  style,
}) => (
  <View style={[{ height }, style]} pointerEvents="none">
    <Svg width="100%" height="100%" viewBox="0 0 400 260" preserveAspectRatio="xMidYMax slice">
      <Defs>
        <LinearGradient id="bsky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#6CCFEA" />
          <Stop offset="1" stopColor="#CFF0F7" />
        </LinearGradient>
        <LinearGradient id="bsea" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#36BBD4" />
          <Stop offset="1" stopColor="#8BE2E2" />
        </LinearGradient>
        <LinearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FBEBC9" />
          <Stop offset="1" stopColor="#F2D9A8" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="400" height="260" fill="url(#bsky)" />
      <Cloud x={80} y={34} s={0.9} o={0.8} />
      <Cloud x={310} y={22} s={0.7} o={0.6} />
      <Rect x="0" y="120" width="400" height="80" fill="url(#bsea)" />
      <Path d="M0 198 C 70 186 150 210 230 198 C 310 186 360 206 400 196 L400 260 L0 260 Z" fill="url(#sand)" />
      <Path d="M0 198 C 70 186 150 210 230 198 C 310 186 360 206 400 196" stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.8} />
      <Palm x={40} y={226} scale={0.95} />
      <Palm x={366} y={232} scale={0.8} flip />
    </Svg>
  </View>
);

/** פרח לוטוס – מופיע מעל שלט הלוגו */
export const Lotus: React.FC<{ size?: number; style?: ViewStyle }> = ({ size = 54, style }) => (
  <View style={style} pointerEvents="none">
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {[-62, -31, 0, 31, 62].map((deg, i) => (
        <Ellipse
          key={deg}
          cx="50"
          cy="44"
          rx={i === 2 ? 15 : 12}
          ry={i === 2 ? 34 : 30}
          fill={i === 2 ? '#F7A9C8' : '#F38AB4'}
          transform={`rotate(${deg} 50 72)`}
        />
      ))}
      <Ellipse cx="50" cy="52" rx="13" ry="26" fill="#FBC6DA" />
      <Circle cx="50" cy="48" r="7" fill={colors.mangoYellow} />
    </Svg>
  </View>
);

/** דגל תאילנד */
export const ThaiFlag: React.FC<{ width?: number; style?: ViewStyle }> = ({ width = 40, style }) => (
  <View style={style} pointerEvents="none">
    <Svg width={width} height={width * 0.67} viewBox="0 0 60 40">
      <Rect x="0" y="0" width="60" height="40" rx="3" fill="#FFFFFF" />
      <Rect x="0" y="0" width="60" height="7" fill="#A51931" />
      <Rect x="0" y="33" width="60" height="7" fill="#A51931" />
      <Rect x="0" y="13" width="60" height="14" fill="#2D2A4A" />
    </Svg>
  </View>
);

/** גביע זהב עם זר דפנה – מסך הסיום */
export const TrophyCup: React.FC<{ size?: number; style?: ViewStyle }> = ({ size = 140, style }) => (
  <View style={style} pointerEvents="none">
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        <LinearGradient id="goldc" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFE28A" />
          <Stop offset="0.5" stopColor="#F5C13B" />
          <Stop offset="1" stopColor="#D79A18" />
        </LinearGradient>
      </Defs>
      {/* זר דפנה */}
      {[-1, 1].map((dir) => (
        <G key={dir} transform={`translate(60 70) scale(${dir} 1)`}>
          <Path d="M-34 24 C -50 6 -50 -18 -36 -34" stroke="#E3B02B" strokeWidth={4} fill="none" strokeLinecap="round" />
          {[0, 1, 2, 3, 4].map((i) => (
            <Ellipse
              key={i}
              cx={-44 + i * 2.2}
              cy={14 - i * 12}
              rx={8}
              ry={4.5}
              fill="#EFBE3E"
              transform={`rotate(${-50 + i * 14} ${-44 + i * 2.2} ${14 - i * 12})`}
            />
          ))}
        </G>
      ))}
      {/* גביע */}
      <Path d="M38 22 H82 V44 C82 62 72 72 60 72 C48 72 38 62 38 44 Z" fill="url(#goldc)" />
      <Path d="M38 28 C 24 28 22 48 38 52" stroke="#E3B02B" strokeWidth={6} fill="none" strokeLinecap="round" />
      <Path d="M82 28 C 96 28 98 48 82 52" stroke="#E3B02B" strokeWidth={6} fill="none" strokeLinecap="round" />
      <Rect x="54" y="70" width="12" height="14" fill="#DFA92A" />
      <Rect x="42" y="84" width="36" height="8" rx="3" fill="url(#goldc)" />
      <Rect x="36" y="92" width="48" height="9" rx="4" fill="#DFA92A" />
      <Path
        d="M60 32 l4.2 8.6 9.4 1.4 -6.8 6.6 1.6 9.4 -8.4 -4.4 -8.4 4.4 1.6 -9.4 -6.8 -6.6 9.4 -1.4 Z"
        fill="#FFF3C9"
      />
    </Svg>
  </View>
);

/** מדליית הישג. unlocked=false מציג אותה דהויה */
export const Medal: React.FC<{ size?: number; unlocked?: boolean; tone?: 'gold' | 'rose' | 'violet' }> = ({
  size = 56,
  unlocked = true,
  tone = 'gold',
}) => {
  const tones = {
    gold: ['#FFE28A', '#E8A91E'],
    rose: ['#FBC6DA', '#E8417F'],
    violet: ['#D9CCF5', '#8266CC'],
  }[tone];
  const a = unlocked ? tones[0] : '#E8E4DC';
  const b = unlocked ? tones[1] : '#C3BDB2';
  return (
    <View pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M30 8 L44 44 L30 50 Z" fill={unlocked ? '#F38AB4' : '#D8D2C8'} />
        <Path d="M70 8 L56 44 L70 50 Z" fill={unlocked ? '#22BCD9' : '#C8C2B8'} />
        <Circle cx="50" cy="60" r="30" fill={b} />
        <Circle cx="50" cy="60" r="23" fill={a} />
        <Path
          d="M50 44 l5.2 10.8 11.8 1.7 -8.5 8.3 2 11.7 -10.5 -5.5 -10.5 5.5 2 -11.7 -8.5 -8.3 11.8 -1.7 Z"
          fill={unlocked ? '#FFFFFF' : '#EFECE6'}
        />
      </Svg>
    </View>
  );
};

/** אווטאר מאויר למסכי הפרופיל וההישגים */
export const Avatar: React.FC<{ size?: number; style?: ViewStyle }> = ({ size = 96, style }) => (
  <View style={style} pointerEvents="none">
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="50" fill="#FDE4EE" />
      {/* כתפיים */}
      <Path d="M18 100 C 22 78 34 70 50 70 C 66 70 78 78 82 100 Z" fill={colors.turquoise} />
      <Path d="M42 62 h16 v12 h-16 Z" fill="#EFC3A6" />
      {/* קונטיה */}
      <Circle cx="50" cy="17" r="10" fill="#6B4430" />
      {/* פנים */}
      <Ellipse cx="50" cy="44" rx="20" ry="22" fill="#F6D2B8" />
      {/* שיער */}
      <Path d="M28 44 C 26 24 36 16 50 16 C 64 16 74 24 72 44 C 70 32 62 28 50 28 C 38 28 30 32 28 44 Z" fill="#6B4430" />
      <Path d="M28 40 C 24 50 25 58 27 62 C 25 52 26 46 28 40 Z" fill="#5A3828" />
      <Path d="M72 40 C 76 50 75 58 73 62 C 75 52 74 46 72 40 Z" fill="#5A3828" />
      {/* עיניים מחייכות */}
      <Path d="M39 44 q4.5 -5 9 0" stroke="#2B2A3D" strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <Path d="M52 44 q4.5 -5 9 0" stroke="#2B2A3D" strokeWidth={2.6} fill="none" strokeLinecap="round" />
      {/* לחיים וחיוך */}
      <Circle cx="34" cy="51" r="4" fill="#F3A5B4" opacity={0.75} />
      <Circle cx="66" cy="51" r="4" fill="#F3A5B4" opacity={0.75} />
      <Path d="M44 53 q6 7 12 0" stroke="#C25A6B" strokeWidth={2.6} fill="none" strokeLinecap="round" />
      {/* פרח בשיער */}
      <Circle cx="74" cy="30" r="7" fill={colors.lotusPink} />
      <Circle cx="74" cy="30" r="3" fill={colors.mangoYellow} />
    </Svg>
  </View>
);

/** פרח קישוט קטן, לפינות הכרטיסים */
export const Bloom: React.FC<{ size?: number; color?: string; style?: ViewStyle }> = ({
  size = 34,
  color = colors.lotusPink,
  style,
}) => (
  <View style={style} pointerEvents="none">
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {[0, 72, 144, 216, 288].map((deg) => (
        <Ellipse key={deg} cx="50" cy="26" rx="16" ry="24" fill={color} transform={`rotate(${deg} 50 50)`} />
      ))}
      <Circle cx="50" cy="50" r="10" fill={colors.mangoYellow} />
    </Svg>
  </View>
);

/** כרטיס תמונה לשאלה: תפאורה טרופית עם אייקון הקטגוריה במרכז */
export const SceneCard: React.FC<{ height?: number; children?: React.ReactNode; style?: ViewStyle }> = ({
  height = 150,
  children,
  style,
}) => (
  <View style={[{ height, borderRadius: 20, overflow: 'hidden' }, style]}>
    <TropicalScene height={height} />
    {!!children && (
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.86)',
            borderRadius: 999,
            padding: 12,
          }}
        >
          {children}
        </View>
      </View>
    )}
  </View>
);

/** רקע מסך: תפאורה למעלה וגוון שמנת מתחתיה */
export const ScreenBackdrop: React.FC<{ variant?: 'tropical' | 'beach'; height?: number }> = ({
  variant = 'tropical',
  height = 300,
}) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]} />
    {variant === 'tropical' ? <TropicalScene height={height} /> : <BeachScene height={height} />}
  </View>
);
