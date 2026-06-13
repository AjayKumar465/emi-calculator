import { Stack, usePathname } from 'expo-router';

import { SeoHead } from '@/src/components/seo/SeoHead';
import { getFaqForPage } from '@/src/seo/faq';
import { getSeoForPath } from '@/src/seo/metadata';

function CalculatorSeoHead() {
  const pathname = usePathname();
  const meta = getSeoForPath(pathname);

  if (!meta || meta.key === 'home') {
    return null;
  }

  return <SeoHead meta={meta} faq={getFaqForPage(meta.key)} />;
}

export default function CalculatorLayout() {
  return (
    <>
      <CalculatorSeoHead />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="loan/index" options={{ headerShown: false }} />
        <Stack.Screen name="credit-card/index" options={{ headerShown: false }} />
        <Stack.Screen name="invest" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
