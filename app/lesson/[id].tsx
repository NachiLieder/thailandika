import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, Card, FadeIn, HeText, Pill, ProgressBar, ThaiLabel } from '../../src/components/ui';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { AudioButton } from '../../src/components/AudioButton';
import { Elephant, Hibiscus, PalmLeaf } from '../../src/components/Decor';
import { getCategory } from '../../src/data/categories';
import { getLessonItems } from '../../src/data/items';
import { categoryPalette, colors, radius, shadow, spacing } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';
import { useStudyTimer } from '../../src/state/useStudyTimer';
import { stopAllAudio } from '../../src/audio/useSpeech';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { markItemViewed } = useAppState();
  useStudyTimer();

  const category = getCategory(id);
  const items = category ? getLessonItems(category.id) : [];
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);

  const item = items[index];

  useEffect(() => {
    if (item) markItemViewed(item.id);
  }, [item, markItemViewed]);

  useEffect(() => () => stopAllAudio(), []);

  if (!category || items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <ScreenHeader title="אין עדיין תוכן" />
        <View style={{ padding: spacing(2) }}>
          <Card>
            <HeText variant="heading">לא מצאנו כרטיסי לימוד ליחידה הזו</HeText>
            <HeText variant="body" style={{ color: colors.textSoft, marginTop: spacing(0.5) }}>
              אפשר לחזור לבית ולנסות קטגוריה אחרת.
            </HeText>
            <AppButton title="חזרה לבית" style={{ marginTop: spacing(2) }} onPress={() => router.replace('/(tabs)')} />
          </Card>
        </View>
      </View>
    );
  }

  const palette = categoryPalette[category.colorKey];

  /* מסך הביניים לפני החידון */
  if (ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <View style={[styles.hero, { backgroundColor: palette.bg }]}>
          <PalmLeaf size={140} style={{ position: 'absolute', top: -26, left: -44, opacity: 0.3 }} />
          <ScreenHeader title={category.titleHe} subtitle="סיימנו את כרטיסי הלימוד" onBack={() => setReady(false)} />
        </View>
        <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing(4) }]}>
          <FadeIn>
            <Card style={{ alignItems: 'center', gap: spacing(1), paddingVertical: spacing(3) }}>
              <Elephant size={110} />
              <HeText variant="title" style={{ textAlign: 'center' }}>
                מוכנה לבדוק מה למדת?
              </HeText>
              <HeText variant="body" style={{ color: colors.textSoft, textAlign: 'center' }}>
                עשר שאלות קצרות. טעות היא לא נורא – פשוט מנסים שוב באותה שאלה.
              </HeText>
              <AppButton
                title="מתחילים בחידון"
                style={{ marginTop: spacing(1.5), alignSelf: 'stretch' }}
                onPress={() => router.replace(`/quiz/${category.id}`)}
              />
              <AppButton
                title="חוזרים על הכרטיסים"
                variant="secondary"
                style={{ alignSelf: 'stretch' }}
                onPress={() => {
                  setIndex(0);
                  setReady(false);
                }}
              />
            </Card>
          </FadeIn>
        </ScrollView>
      </View>
    );
  }

  const next = () => {
    stopAllAudio();
    if (index + 1 < items.length) setIndex(index + 1);
    else setReady(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={[styles.hero, { backgroundColor: palette.bg }]}>
        <PalmLeaf size={140} style={{ position: 'absolute', top: -26, left: -44, opacity: 0.3 }} />
        <Hibiscus size={46} style={{ position: 'absolute', bottom: 6, left: 12, opacity: 0.35 }} />
        <ScreenHeader title={category.titleHe} subtitle={`כרטיס ${index + 1} מתוך ${items.length}`} />
        <View style={{ paddingHorizontal: spacing(2), paddingBottom: spacing(1.5) }}>
          <ProgressBar value={index + 1} total={items.length} color={palette.accent} trackColor={colors.white} />
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing(4) }]}>
        <FadeIn key={item.id}>
          <Card style={[styles.flashCard, shadow(2)]}>
            <Pill label="כרטיס לימוד" bg={palette.bg} fg={palette.accent} style={{ alignSelf: 'center' }} />

            <View style={styles.thaiBox}>
              <ThaiLabel size="big">{item.thai}</ThaiLabel>
            </View>

            <View style={styles.translitBox}>
              <HeText variant="tiny" style={{ color: colors.textFaint, textAlign: 'center' }}>
                תעתיק עברי מקורב
              </HeText>
              <HeText variant="title" style={{ textAlign: 'center', color: colors.pinkDeep }}>
                {item.transliterationHe}
              </HeText>
            </View>

            <View style={{ alignItems: 'center', gap: spacing(0.25) }}>
              <HeText variant="tiny" style={{ color: colors.textFaint, textAlign: 'center' }}>
                משמעות
              </HeText>
              <HeText variant="title" style={{ textAlign: 'center' }}>
                {item.meaningHe}
              </HeText>
            </View>

            <AudioButton thai={item.thai} itemId={item.id} style={{ marginTop: spacing(1) }} />

            <HeText variant="small" style={{ color: colors.textSoft, textAlign: 'center' }}>
              🔊 הקשיבי וחזרי בקול אחרי ההשמעה.
            </HeText>

            {!!item.exampleNoteHe && (
              <View style={styles.note}>
                <HeText variant="small" style={{ color: '#6A5316' }}>
                  💡 {item.exampleNoteHe}
                </HeText>
              </View>
            )}

            <HeText variant="tiny" style={{ color: colors.textFaint }}>
              התעתיק העברי הוא קירוב בלבד. בתאילנדית יש טונים וצלילים שאי אפשר לייצג במדויק בעברית – כדאי להישען על ההשמעה.
            </HeText>
          </Card>
        </FadeIn>

        <View style={{ gap: spacing(1) }}>
          <AppButton title="הבנתי, ממשיכים" onPress={next} />
          <View style={styles.row}>
            <AppButton
              title="שוב"
              variant="secondary"
              style={{ flex: 1 }}
              onPress={() => {
                stopAllAudio();
                setIndex(index);
              }}
            />
            <AppButton
              title="הקודם"
              variant="ghost"
              style={{ flex: 1 }}
              disabled={index === 0}
              onPress={() => {
                stopAllAudio();
                setIndex(Math.max(0, index - 1));
              }}
            />
          </View>
          <AppButton
            title="לדלג ישר לחידון"
            variant="ghost"
            onPress={() => {
              stopAllAudio();
              router.replace(`/quiz/${category.id}`);
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { overflow: 'hidden' },
  body: { paddingHorizontal: spacing(2), paddingTop: spacing(2), gap: spacing(2) },
  flashCard: { gap: spacing(1.5), paddingVertical: spacing(2.5) },
  thaiBox: {
    backgroundColor: colors.turquoiseSoft,
    borderRadius: radius.lg,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(1),
  },
  translitBox: { alignItems: 'center', gap: spacing(0.25) },
  note: {
    backgroundColor: colors.mangoSoft,
    borderRadius: radius.md,
    padding: spacing(1.25),
  },
  row: { flexDirection: 'row-reverse', gap: spacing(1) },
});
