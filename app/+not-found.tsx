import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton, Card, HeText } from '../src/components/ui';
import { Elephant } from '../src/components/Decor';
import { colors, spacing } from '../src/theme';

export default function NotFound() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: colors.cream, justifyContent: 'center', padding: spacing(2) }}>
      <Card style={{ alignItems: 'center', gap: spacing(1), paddingVertical: spacing(3) }}>
        <Elephant size={96} />
        <HeText variant="title" style={{ textAlign: 'center' }}>
          אופס, הדף הזה לא קיים
        </HeText>
        <HeText variant="body" style={{ color: colors.textSoft, textAlign: 'center' }}>
          בואי נחזור למסך הבית ונמשיך ללמוד.
        </HeText>
        <AppButton title="חזרה לבית" style={{ alignSelf: 'stretch', marginTop: spacing(1) }} onPress={() => router.replace('/')} />
      </Card>
    </View>
  );
}
