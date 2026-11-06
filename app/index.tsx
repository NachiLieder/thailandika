import React from 'react';
import { Redirect } from 'expo-router';
import { useAppState } from '../src/state/AppStateContext';

export default function Index() {
  const { progress } = useAppState();
  return <Redirect href={progress.userName ? '/(tabs)' : '/onboarding'} />;
}
