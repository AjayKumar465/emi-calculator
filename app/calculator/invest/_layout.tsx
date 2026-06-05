import { Stack } from 'expo-router';

export default function InvestLayout() {
  return (
    <Stack>
      <Stack.Screen name="sip/index" options={{ headerShown: false }} />
      <Stack.Screen name="ppf/index" options={{ headerShown: false }} />
      <Stack.Screen name="ssy/index" options={{ headerShown: false }} />
      <Stack.Screen name="compounding/index" options={{ headerShown: false }} />
      <Stack.Screen name="future-cost/index" options={{ headerShown: false }} />
    </Stack>
  );
}
