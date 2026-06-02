import { Platform, ViewStyle } from 'react-native';

import { colors } from './colors';

export const shadows = {
  rest: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {
      boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
    },
  }) as ViewStyle,
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 24,
    },
    android: { elevation: 8 },
    default: {
      boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
    },
  }) as ViewStyle,
  glow: Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.tealAccent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
    },
    android: { elevation: 6 },
    default: {
      boxShadow: `0 0 24px ${colors.tealGlow}`,
    },
  }) as ViewStyle,
} as const;
