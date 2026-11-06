import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Path } from 'react-native-svg';
import { AppButton, Card, FadeIn, HeText, ProgressBar, ThaiLabel } from '../../src/components/ui';
import { AudioButton } from '../../src/components/AudioButton';
import { CategoryIcon } from '../../src/components/CategoryIcon';
import { Decoration, PhotoHero } from '../../src/components/Photo';
import { getCategory } from '../../src/data/categories';
import { getQuestionsByCategory, QUESTIONS_PER_QUIZ } from '../../src/data/questions';
import { QuizOption } from '../../src/data/types';
import { categoryPhoto, colors, fonts, radius, shadow, spacing } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';
import { useStudyTimer } from '../../src/state/useStudyTimer';
import { shuffle } from '../../src/utils/shuffle';
import { stopAllAudio } from '../../src/audio/useSpeech';

type Phase = 'question' | 'correct-feedback' | 'retry';

const PRAISE = ['עבודה מעולה! 🌸', 'מדויק לגמרי! 🌺', 'ככה זה נשמע נכון! 🐘', 'את זוכרת מצוין! ⭐'];

const BackArrow: React.FC = () => (
  <Svg width={21} height={21} viewBox="0 0 24 24">
    <Path d="M15 5 L8 12 L15 19" stroke={colors.textLight} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckCircle: React.FC<{ size?: number; bg?: string; fg?: string }> = ({
  size = 26,
  bg = colors.textLight,
  fg = colors.lotusPink,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11" fill={bg} />
    <Path d="M7 12.4 l3.2 3.2 6.2 -6.6" stroke={fg} strokeWidth={2.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CrossCircle: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11" fill={colors.error} />
    <Path d="M8.4 8.4 l7.2 7.2 M15.6 8.4 l-7.2 7.2" stroke={colors.textLight} strokeWidth={2.6} strokeLinecap="round" />
  </Svg>
);

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { progress, saveActiveQuiz, completeQuiz, settings } = useAppState();
  useStudyTimer();

  const category = getCategory(id);
  const questions = useMemo(() => (category ? getQuestionsByCategory(category.id) : []), [category]);

  const resume = useRef(
    progress.activeQuiz && progress.activeQuiz.categoryId === id ? progress.activeQuiz : null,
  ).current;

  const [index, setIndex] = useState(resume?.questionIndex ?? 0);
  const [score, setScore] = useState(resume?.score ?? 0);
  const [phase, setPhase] = useState<Phase>('question');
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [praise] = useState(() => PRAISE[Math.floor(Math.random() * PRAISE.length)]);

  const awarded = useRef<Set<string>>(new Set());
  const locked = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishing = useRef(false);

  const question = questions[index];

  const shuffledOptions = useMemo(() => {
    const map: Record<string, QuizOption[]> = {};
    questions.forEach((q) => {
      map[q.id] = shuffle(q.options);
    });
    return map;
  }, [questions]);

  useEffect(() => {
    if (!category || finishing.current) return;
    if (index >= questions.length) return;
    saveActiveQuiz({ categoryId: category.id, questionIndex: index, score });
  }, [category, index, score, questions.length, saveActiveQuiz]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      stopAllAudio();
    },
    [],
  );

  const goToResult = useCallback(
    async (finalScore: number) => {
      if (!category) return;
      finishing.current = true;
      await completeQuiz(category.id, finalScore);
      router.replace(`/result/${category.id}?score=${finalScore}`);
    },
    [category, completeQuiz, router],
  );

  const advance = useCallback(
    (finalScore: number) => {
      if (timer.current) clearTimeout(timer.current);
      locked.current = false;
      setChosenId(null);
      setWrongIds([]);
      setPhase('question');
      if (index + 1 >= questions.length) void goToResult(finalScore);
      else setIndex(index + 1);
    },
    [index, questions.length, goToResult],
  );

  const onSelect = useCallback(
    (optionId: string) => {
      if (!question || locked.current) return;
      if (phase === 'correct-feedback') return;

      const isCorrect = optionId === question.correctOptionId;
      setChosenId(optionId);

      if (isCorrect) {
        locked.current = true;
        let nextScore = score;
        if (!awarded.current.has(question.id)) {
          awarded.current.add(question.id);
          nextScore = score + 1;
          setScore(nextScore);
        }
        setPhase('correct-feedback');
        if (Platform.OS !== 'web' && settings.soundEnabled) {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
        }
        // מעבר אוטומטי; הכפתור "לשאלה הבאה" רק מקצר את ההמתנה
        timer.current = setTimeout(() => advance(nextScore), 1200);
      } else {
        setWrongIds((prev) => (prev.includes(optionId) ? prev : [...prev, optionId]));
        setPhase('retry');
        if (Platform.OS !== 'web' && settings.soundEnabled) {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined);
        }
      }
    },
    [question, phase, score, advance, settings.soundEnabled],
  );

  if (!category || questions.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream, padding: spacing(2), justifyContent: 'center' }}>
        <Card>
          <HeText variant="heading">לא מצאנו חידון לקטגוריה הזו</HeText>
          <HeText variant="body" style={{ color: colors.textSecondary, marginTop: spacing(0.5) }}>
            אפשר לחזור לבית ולבחור קטגוריה אחרת.
          </HeText>
          <AppButton title="חזרה לבית" style={{ marginTop: spacing(2) }} onPress={() => router.replace('/(tabs)')} />
        </Card>
      </View>
    );
  }

  if (!question) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center' }}>
        <HeText variant="heading">מסכמים את השיעור...</HeText>
      </View>
    );
  }

  const options = shuffledOptions[question.id] ?? question.options;

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* כותרת */}
      <View style={[styles.header, { paddingTop: insets.top + spacing(1) }]}>
        <View style={[styles.catBadge, shadow(1)]}>
          <CategoryIcon name={category.icon} size={30} />
        </View>

        <HeText variant="title" style={{ flex: 1, textAlign: 'center', color: colors.lotusDark }} numberOfLines={1}>
          {category.titleHe}
        </HeText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="חזרה"
          onPress={() => {
            stopAllAudio();
            if (router.canGoBack()) router.back();
            else router.replace('/(tabs)');
          }}
          style={[styles.backBtn, shadow(2)]}
          hitSlop={10}
        >
          <BackArrow />
        </Pressable>
      </View>

      <View style={styles.progressWrap}>
        <HeText variant="small" style={{ color: colors.textSecondary, textAlign: 'center' }}>
          📖 שאלה {index + 1} מתוך {QUESTIONS_PER_QUIZ}
        </HeText>
        <ProgressBar value={index} total={QUESTIONS_PER_QUIZ} color={colors.lotusPink} height={10} trackColor={colors.sand} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing(4) }]}
        keyboardShouldPersistTaps="handled"
      >
        <FadeIn key={question.id}>
          <PhotoHero
            image={categoryPhoto[category.id] ?? 'thaiTemple'}
            height={146}
            rounded
            dim={0.22}
            style={shadow(1)}
          >
            <View style={styles.sceneBadge}>
              <CategoryIcon name={category.icon} size={46} />
            </View>
            <Decoration image="palmLeaf" size={88} rotate={-20} style={{ top: -12, right: -20 }} opacity={0.9} />
          </PhotoHero>
        </FadeIn>

        <FadeIn key={`${question.id}-q`} delay={60}>
          <View style={{ gap: spacing(1) }}>
            <HeText variant="title" style={{ textAlign: 'center' }}>
              {question.promptHe}
            </HeText>

            {!!question.promptThai && (
              <View style={styles.thaiBox}>
                <ThaiLabel size="medium">{question.promptThai}</ThaiLabel>
              </View>
            )}

            {!!question.promptThai && (
              <AudioButton
                thai={question.promptThai}
                itemId={question.itemId}
                label={question.kind === 'listening' ? 'להשמעה חוזרת' : 'השמעה'}
                compact
              />
            )}

            <HeText variant="small" style={{ color: colors.textSecondary, textAlign: 'center' }}>
              בחרי את התשובה הנכונה:
            </HeText>
          </View>
        </FadeIn>

        <View style={{ gap: spacing(1) }}>
          {options.map((opt) => {
            const isWrong = wrongIds.includes(opt.id);
            const isChosenCorrect = phase === 'correct-feedback' && chosenId === opt.id;

            return (
              <Pressable
                key={opt.id}
                accessibilityRole="button"
                accessibilityLabel={opt.labelHe || opt.labelThai}
                accessibilityState={{ disabled: phase === 'correct-feedback', selected: chosenId === opt.id }}
                disabled={phase === 'correct-feedback'}
                onPress={() => onSelect(opt.id)}
                style={({ pressed }) => [
                  styles.option,
                  shadow(1),
                  isChosenCorrect && { backgroundColor: colors.lotusPink, borderColor: colors.lotusPink },
                  isWrong && { backgroundColor: colors.errorSoft, borderColor: colors.error },
                  pressed && !isChosenCorrect && { opacity: 0.9 },
                ]}
              >
                <View style={styles.optionRow}>
                  <View style={{ flex: 1 }}>
                    {opt.labelThai ? (
                      <ThaiLabel
                        size="small"
                        color={isChosenCorrect ? colors.textLight : colors.textPrimary}
                        style={{ textAlign: 'center' }}
                      >
                        {opt.labelThai}
                      </ThaiLabel>
                    ) : (
                      <HeText
                        variant="body"
                        style={{
                          textAlign: 'center',
                          fontFamily: fonts.bold,
                          color: isChosenCorrect ? colors.textLight : isWrong ? colors.error : colors.textPrimary,
                        }}
                      >
                        {opt.labelHe}
                      </HeText>
                    )}
                  </View>
                  {isChosenCorrect && <CheckCircle />}
                  {isWrong && <CrossCircle />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {phase === 'correct-feedback' && (
          <FadeIn>
            <View style={[styles.feedback, { backgroundColor: colors.successSoft, borderColor: colors.palmGreen }]}>
              <View style={styles.feedbackRow}>
                <CheckCircle size={34} bg={colors.palmGreen} fg={colors.textLight} />
                <View style={{ flex: 1 }}>
                  <HeText variant="heading" style={{ color: colors.palmGreen }}>
                    בחירה נכונה!
                  </HeText>
                  <HeText variant="small" style={{ color: '#2F6B51' }}>
                    {praise}
                  </HeText>
                </View>
              </View>
              {!!question.explanationHe && (
                <HeText variant="tiny" style={{ color: '#2F6B51' }}>
                  {question.explanationHe}
                </HeText>
              )}
            </View>
          </FadeIn>
        )}

        {phase === 'retry' && (
          <FadeIn>
            <View style={[styles.feedback, { backgroundColor: colors.errorSoft, borderColor: colors.error }]}>
              <View style={styles.feedbackRow}>
                <CrossCircle size={34} />
                <View style={{ flex: 1 }}>
                  <HeText variant="heading" style={{ color: colors.error }}>
                    לא בדיוק — נסי שוב!
                  </HeText>
                  <HeText variant="small" style={{ color: '#8E3A36' }}>
                    {question.explanationHe ? `רמז: ${question.explanationHe}` : 'אפשר להשמיע שוב ולבחור תשובה אחרת.'}
                  </HeText>
                </View>
              </View>
              <HeText variant="tiny" style={{ color: '#8E3A36' }}>
                טעות לא מורידה נקודות. נשארים באותה שאלה עד שמוצאים את התשובה הנכונה.
              </HeText>
            </View>
          </FadeIn>
        )}

        {phase === 'correct-feedback' && (
          <AppButton
            title={index + 1 >= questions.length ? 'לסיכום השיעור ←' : 'לשאלה הבאה ←'}
            onPress={() => advance(score)}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sceneBadge: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(255, 252, 247, 0.93)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing(1),
    paddingHorizontal: spacing(2),
    paddingBottom: spacing(1),
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.lotusPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressWrap: { paddingHorizontal: spacing(2), paddingBottom: spacing(1), gap: spacing(0.6) },
  body: { paddingHorizontal: spacing(2), paddingTop: spacing(1), gap: spacing(1.75) },
  thaiBox: {
    backgroundColor: colors.turquoiseSoft,
    borderRadius: radius.lg,
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(1),
    borderWidth: 2,
    borderColor: colors.turquoiseMid,
  },
  option: {
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.textLight,
    paddingVertical: spacing(1.4),
    paddingHorizontal: spacing(2),
    minHeight: 58,
    justifyContent: 'center',
  },
  optionRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing(1) },
  feedback: {
    borderRadius: radius.lg,
    borderWidth: 2,
    padding: spacing(1.5),
    gap: spacing(0.75),
  },
  feedbackRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing(1) },
});
