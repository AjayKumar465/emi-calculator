import { StyleSheet } from 'react-native';

import { BREAKPOINTS } from '../utils/constants';

/** Shared breakpoint tokens for StyleSheet @media rules (react-native-web). */
export const media = {
  mobile: `@media (max-width: ${BREAKPOINTS.tablet - 1}px)`,
  tabletUp: `@media (min-width: ${BREAKPOINTS.tablet}px)`,
  desktopUp: `@media (min-width: ${BREAKPOINTS.desktop}px)`,
  tabletOnly: `@media (min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`,
} as const;

/** StyleSheet.create wrapper — RN Web @media keys are not in ViewStyle typings. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createResponsiveStyles(styles: Record<string, object>): any {
  return StyleSheet.create(styles as never);
}
