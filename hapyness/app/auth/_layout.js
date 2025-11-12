   import { Stack } from "expo-router";

export default function AuthLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
     
      <Stack.Screen name="/auth/signin" />
      <Stack.Screen name="/auth/signup" />
      <Stack.Screen name="/auth/forgotpassword" />
      <Stack.Screen name="/auth/verification" />
      <Stack.Screen name="/auth/resetpassword" />
      <Stack.Screen name="/auth/step1" />
      <Stack.Screen name="/auth/step2" />
      <Stack.Screen name="/auth/step3" />
    </Stack>
  );
}