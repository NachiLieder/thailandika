import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppStateProvider, useAppState } from '../src/state/AppStateContext';
import { colors } from '../src/theme';

const Gate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ready } = useAppState();
  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.turquoise} />
      </View>
    );
  }
  return <>{children}</>;
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppStateProvider>
          <StatusBar style="dark" />
          <Gate>
            <View style={styles.shell}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.cream },
                animation: 'slide_from_left',
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
              <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            </Stack>
            </View>
          </Gate>
        </AppStateProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  /** מרכוז התוכן במסכים רחבים, כדי שהממשק לא יימתח לרוחב כל המסך */
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    backgroundColor: colors.cream,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
});
