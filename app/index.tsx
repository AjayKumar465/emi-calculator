import { Platform } from 'react-native';
import { Redirect } from 'expo-router';

import { WebLandingPage } from '@/src/components/seo/WebLandingPage';

export default function IndexScreen() {
  if (Platform.OS === 'web') {
    return <WebLandingPage />;
  }

  return <Redirect href="/calculator" />;
}
