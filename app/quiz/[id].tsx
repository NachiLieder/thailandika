import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { AppButton, Card, FadeIn, HeText, Pill, ProgressBar, ThaiLabel } from '../../src/components/ui';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { AudioButton } from '../../src/components/AudioButton';
import { PalmLeaf } from '../../src/components/Decor';
import { getCategory } from '../../src/data/categories';
import { getQuestionsByCategory, QUESTIONS_PER_QUIZ } from '../../src/data/questions';
import { QuizOption } from '../../src/data/types';
import { categoryPalette, colors, radius, shadow, spacing, typography } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';
import { shuffle } from '../../src/utils/shuffle';
import { stopAllAudio } from '../../src/audio/useSpeech';

type Phase = 'question' | 'correct-feedback' | 'retry';

const PRAISE = ['יופי של עבודה!', 'מדויק לגמרי.', 'ככה זה נשמע נכון.', 'את זוכרת מצוין.'];

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { progress, saveActiveQuiz, completeQuiz, settings } = useAppState();

  const category = getCategory(id);
  const questions = useMemo(() => (category ? getQuestionsByCategory(category.id) : []), [category]);

  // המשך מחידון שנשמר, אם יש כזה לקטגוריה הנוכחית
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

  // סדר אפשרויות מעורבב, קבוע לכל הפעלה של החידון
  const shuffledOptions = useMemo(() => {
    const map: Record<string, QuizOption[]> = {};
    questions.forEach((q) => {
      map[q.id] = shuffle(q.options);
    });
    return map;
  }, [questions]);

  // שמירת מצב החידון כדי לאפשר המשך אחרי יציאה
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
      locked.current = false;
      setChosenId(null);
      setWrongIds([]);
      setPhase('question');
      if (index + 1 >= questions.length) {
        void goToResult(finalScore);
      } else {
        setIndex(index + 1);
      }
    },
    [index, questions.length, goToResult],
  );

  const onSelect = useCallback(
    (optionId: string) => {
      if (!question || locked.current) return; // מונע לחיצה כפולה ורישום כפול
      if (phase === 'correct-feedback') return;

      const isCorrect = optionId === question.correctOptionId;
      setChosenId(optionId);

      if (isCorrect) {
        locked.current = true; // נעילה עד המעבר האוטומטי
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
        timer.current = setTimeout(() => advance(nextScore), 1100);
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
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <ScreenHeader title="אין שאלות ליחידה הזו" />
        <View style={{ padding: spacing(2) }}>
          <Card>
            <HeText variant="heading">לא מצאנו חידון לקטגוריה הזו</HeText>
            <HeText variant="body" style={{ color: colors.textSoft, marginTop: spacing(0.5) }}>
              אפשר לחזור לבית ולבחור קטגוריה אחרת.
            </HeText>
            <AppButton title="חזרה לבית" style={{ marginTop: spacing(2) }} onPress={() => router.replace('/(tabs)')} />
          </Card>
        </View>
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

  const palette = categoryPalette[category.colorKey];
  const options = shuffledOptions[question.id] ?? question.options;
  const showAudio = !!question.promptThai;

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={[styles.hero, { backgroundColor: palette.bg }]}>
        <PalmLeaf size={130} style={{ position: 'absolute', top: -24, left: -44, opacity: 0.25 }} />
        <ScreenHeader
          title={category.titleHe}
          subtitle={`ההתקדמות שלך נשמרת – אפשר לצאת ולחזור`}
          right={<Pill label={`${score} נק'`} bg={colors.white} fg={colors.leaf} />}
        />
        <View style={{ paddingHorizontal: spacing(2), paddingBottom: spacing(1.5), gap: spacing(0.75) }}>
          <HeText variant="small" style={{ color: colors.text }}>
            שאלה {index + 1} מתוך {QUESTIONS_PER_QUIZ}
          </HeText>
          <ProgressBar value={index} total={QUESTIONS_PER_QUIZ} color={palette.accent} trackColor={colors.white} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing(4) }]}
        keyboardShouldPersistTaps="handled"
      >
        <FadeIn key={question.id}>
          <Card style={{ gap: spacing(1.5) }}>
            <HeText variant="heading">{question.promptHe}</HeText>

            {!!question.promptThai && (
              <View style={styles.thaiBox}>
                <ThaiLabel size="medium">{question.promptThai}</ThaiLabel>
              </View>
            )}

            {showAudio && (
              <AudioButton
                thai={question.promptThai as string}
                itemId={question.itemId}
                label={question.kind === 'listening' ? 'להשמעה חוזרת' : 'השמעה'}
                compact
              />
            )}
          </Card>
        </FadeIn>

        <View style={{ gap: spacing(1) }}>
          {options.map((opt) => {
            const isCorrectOpt = opt.id === question.correctOptionId;
            const isWrong = wrongIds.includes(opt.id);
            const isChosenCorrect = phase === 'correct-feedback' && chosenId === opt.id;

            const bg = isChosenCorrect
              ? colors.leafSoft
              : isWrong
                ? colors.errorSoft
                : colors.white;
            const border = isChosenCorrect ? colors.leaf : isWrong ? colors.error : colors.border;

            return (
              <Pressable
                key={opt.id}
                accessibilityRole="button"
                accessibilityLabel={opt.labelHe || opt.labelThai}
                accessibilityState={{
                  disabled: phase === 'correct-feedback',
                  selected: chosenId === opt.id,
                }}
                disabled={phase === 'correct-feedback'}
                onPress={() => onSelect(opt.id)}
                style={({ pressed }) => [
                  styles.option,
                  shadow(1),
                  { backgroundColor: bg, borderColor: border },
                  pressed && { opacity: 0.9 },
                ]}
              >
                <View style={styles.optionRow}>
                  <View
                    style={[
                      styles.marker,
                      {
                        backgroundColor: isChosenCorrect ? colors.leaf : isWrong ? colors.error : colors.turquoiseSoft,
                      },
                    ]}
                  >
                    <HeText
                      variant="small"
                      style={{
                        color: isChosenCorrect || isWrong ? colors.white : colors.turquoise,
                        textAlign: 'center',
                      }}
                    >
                      {isChosenCorrect ? '✓' : isWrong ? '✕' : '•'}
                    </HeText>
                  </View>

                  <View style={{ flex: 1 }}>
                    {opt.labelThai ? (
                      <ThaiLabel size="small" style={{ textAlign: 'right' }}>
                        {opt.labelThai}
                      </ThaiLabel>
                    ) : (
                      <HeText variant="body" style={{ fontWeight: '700' }}>
                        {opt.labelHe}
                      </HeText>
                    )}
                    {isWrong && (
                      <HeText variant="tiny" style={{ color: colors.error }}>
                        לא זו – אפשר לנסות שוב
                      </HeText>
                    )}
                    {isChosenCorrect && (
                      <HeText variant="tiny" style={{ color: colors.leaf }}>
                        תשובה נכונה
                      </HeText>
                    )}
                  </View>

                  {isCorrectOpt && phase === 'correct-feedback' && (
                    <Pill label="נכון" bg={colors.leaf} fg={colors.white} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* משוב */}
        {phase === 'correct-feedback' && (
          <FadeIn>
            <View style={[styles.feedback, { backgroundColor: colors.leafSoft, borderColor: colors.leaf }]}>
              <HeText variant="title" style={{ color: colors.leaf }}>
                ✓ בחירה נכונה!
              </HeText>
              <HeText variant="heading" style={{ color: colors.leaf }}>
                עבודה מעולה
              </HeText>
              <HeText variant="small" style={{ color: '#2F6B51' }}>
                {praise} {question.explanationHe ?? ''}
              </HeText>
              <HeText variant="tiny" style={{ color: '#2F6B51' }}>
                עוברים לשאלה הבאה...
              </HeText>
            </View>
          </FadeIn>
        )}

        {phase === 'retry' && (
          <FadeIn>
            <View style={[styles.feedback, { backgroundColor: colors.errorSoft, borderColor: colors.error }]}>
              <HeText variant="heading" style={{ color: colors.error }}>
                ✕ לא בדיוק — נסי שוב!
              </HeText>
              <HeText variant="small" style={{ color: '#8E3A36' }}>
                {question.explanationHe
                  ? `רמז: ${question.explanationHe}`
                  : 'אפשר להשמיע שוב את הביטוי ולבחור תשובה אחרת.'}
              </HeText>
              <HeText variant="tiny" style={{ color: '#8E3A36' }}>
                טעות לא מורידה נקודות. נשארים באותה שאלה עד שמוצאים את התשובה הנכונה.
              </HeText>
            </View>
          </FadeIn>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { overflow: 'hidden' },
  body: { paddingHorizontal: spacing(2), paddingTop: spacing(2), gap: spacing(2) },
  thaiBox: {
    backgroundColor: colors.turquoiseSoft,
    borderRadius: radius.lg,
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(1),
  },
  option: {
    borderRadius: radius.md,
    borderWidth: 2,
    padding: spacing(1.5),
    minHeight: 64,
    justifyContent: 'center',
  },
  optionRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing(1.25) },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedback: {
    borderRadius: radius.lg,
    borderWidth: 2,
    padding: spacing(2),
    gap: spacing(0.5),
  },
});
