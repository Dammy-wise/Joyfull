   import { Stack } from "expo-router";

export default function AuthLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
     
      <Stack.Screen name="signin"/>
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgotpassword" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="resetpassword" />
      <Stack.Screen name="step1" />
      <Stack.Screen name="step2" />
      <Stack.Screen name="step3" />
    </Stack>
  );
}