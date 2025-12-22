import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import Splashscreen from '../components/splashscreen';
import { useState, useEffect } from 'react';
import { LogBox } from 'react-native';

// Ignore keep awake warnings in development
LogBox.ignoreLogs(['Unable to activate keep awake']);

SplashScreen.preventAutoHideAsync().catch((error) => {
  console.warn('SplashScreen prevent hide error:', error);
}); // keep splash visible

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync(); // ✅ hide when your splash animation finishes
    }
  }, [ready]);

  if (!ready) {
    return <Splashscreen onFinish={() => setReady(true)} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="tabs" />
    </Stack>
  );
}