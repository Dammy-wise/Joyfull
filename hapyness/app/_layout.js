
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
 import   Splashscreen  from '../components/splashscreen';
 import { useState, useEffect } from 'react';


SplashScreen.preventAutoHideAsync(); // keep splash visible

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();        // ✅ hide when your splash animation finishes
    }
  }, [ready]);

  if (!ready) {
    return <Splashscreen onFinish={() => setReady(true)} />;
  }

  return  (

     <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splashscreen" />
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="tabs" />
   
  </Stack>
  );
}