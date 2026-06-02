import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';

import { colors } from '../../theme';

interface GlossyBackgroundProps {
  children: ReactNode;
}

export function GlossyBackground({ children }: GlossyBackgroundProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.gridOverlay} pointerEvents="none">
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
      <View style={styles.glowOrb} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBackground,
  },
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
