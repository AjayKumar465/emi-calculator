import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';

import { colors } from '../../theme';

interface GlossyBackgroundProps {
  children: ReactNode;
}

export function GlossyBackground({ children }: GlossyBackgroundProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View pointerEvents="none" style={styles.webBackdrop}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.webGridPattern} />
          <View style={styles.glowOrb} />
        </View>
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={styles.gridOverlay}>
        <Svg height="100%" width="100%">
          <Defs>
            <Pattern height="32" id="grid" patternUnits="userSpaceOnUse" width="32">
              <Line stroke={colors.gridLine} strokeWidth="1" x1="0" x2="0" y1="0" y2="32" />
              <Line stroke={colors.gridLine} strokeWidth="1" x1="0" x2="32" y1="0" y2="0" />
            </Pattern>
          </Defs>
          <Rect fill="url(#grid)" height="100%" width="100%" />
        </Svg>
      </View>
      <View pointerEvents="none" style={styles.glowOrb} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBackground,
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  webBackdrop: {
    ...StyleSheet.absoluteFill,
    position: 'fixed',
    zIndex: 0,
  } as ViewStyle,
  webGridPattern: {
    ...StyleSheet.absoluteFill,
    opacity: 0.35,
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
    backgroundSize: '32px 32px',
  } as ViewStyle,
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.9,
  },
  glowOrb: {
    position: 'absolute',
    top: -80,
    left: -60,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.glowOrb,
  },
});
