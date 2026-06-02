import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Line, Path, Pattern, Rect } from 'react-native-svg';

import { colors, spacing } from '../../theme';
import { createResponsiveStyles, media } from '../../theme/responsive';

interface CalculatorHeaderShellProps {
  children: ReactNode;
}

const CURVE_HEIGHT = 40;

export function CalculatorHeaderShell({ children }: CalculatorHeaderShellProps) {
  return (
    <View style={styles.shell}>
      <View pointerEvents="none" style={styles.backdrop}>
        <LinearGradient
          colors={[colors.headerGradientStart, colors.headerGradientMid, colors.headerGradientEnd]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        {Platform.OS === 'web' ? (
          <View style={styles.webGrid} />
        ) : (
          <Svg height="100%" style={StyleSheet.absoluteFill} width="100%">
            <Defs>
              <Pattern height="32" id="headerGrid" patternUnits="userSpaceOnUse" width="32">
                <Line stroke={colors.gridLine} strokeWidth="1" x1="0" x2="0" y1="0" y2="32" />
                <Line stroke={colors.gridLine} strokeWidth="1" x1="0" x2="32" y1="0" y2="0" />
              </Pattern>
            </Defs>
            <Rect fill="url(#headerGrid)" height="100%" width="100%" />
          </Svg>
        )}
        <Svg height="100%" style={styles.curveDecor} width="100%" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
          <Circle cx="340" cy="40" fill={colors.headerOrbPrimary} r="110" />
          <Circle cx="30" cy="180" fill={colors.headerOrbSecondary} r="140" />
          <Circle cx="260" cy="220" fill={colors.headerCurveAccent} r="70" />
          <Path
            d="M-20,120 C80,60 160,180 280,100 C340,60 400,140 420,90"
            fill="none"
            opacity={0.35}
            stroke={colors.skyHighlight}
            strokeWidth="2"
          />
        </Svg>
      </View>
      <View style={styles.content}>{children}</View>
      <View pointerEvents="none" style={styles.curveWrap}>
        <Svg height={CURVE_HEIGHT} preserveAspectRatio="none" viewBox="0 0 400 40" width="100%">
          <Path
            d="M0,18 C80,42 160,0 240,18 C320,36 360,10 400,22 L400,40 L0,40 Z"
            fill={colors.pageBackground}
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = createResponsiveStyles({
  shell: {
    position: 'relative' as const,
    marginBottom: spacing.md,
    overflow: 'hidden' as const,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    bottom: CURVE_HEIGHT,
  },
  webGrid: {
    ...StyleSheet.absoluteFill,
    opacity: 0.35,
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
    backgroundSize: '32px 32px',
  } as ViewStyle,
  curveDecor: {
    ...StyleSheet.absoluteFill,
    opacity: 0.9,
  },
  content: {
    position: 'relative' as const,
    zIndex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    [media.mobile]: {
      paddingHorizontal: spacing.md,
    },
  },
  curveWrap: {
    height: CURVE_HEIGHT,
    marginTop: -1,
  },
});
