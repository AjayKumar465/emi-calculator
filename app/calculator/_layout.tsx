import { Stack } from 'expo-router';

export default function CalculatorLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="loan/index" options={{ headerShown: false }} />
      <Stack.Screen name="credit-card/index" options={{ headerShown: false }} />
    </Stack>
  );
}
