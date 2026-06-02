import { BlurView } from 'expo-blur';
import { ReactNode } from 'react';
import { Platform, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing } from '../../theme';

interface CardProps extends ViewProps {
  children: ReactNode;
  elevated?: boolean;
  glow?: boolean;
}

export function Card({ children, elevated = true, glow = false, style, ...rest }: CardProps) {
  const content = (
    <View
      style={[
        styles.inner,
        elevated ? styles.elevated : null,
        glow ? shadows.glow : shadows.card,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );

  if (Platform.OS === 'web') {
    return <View style={[styles.wrapper, styles.webCard]}>{content}</View>;
  }

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={28} style={styles.blur} tint="dark">
        {content}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
    borderRadius: radii.xl,
    overflow: Platform.OS === 'web' ? 'visible' : 'hidden',
    position: 'relative',
    zIndex: 0,
  },
  blur: {
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  inner: {
    backgroundColor: colors.cardBackground,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  elevated: {
    backgroundColor: colors.cardBackgroundElevated,
    borderColor: colors.glassHighlight,
  },
  webCard: {
    contain: 'layout paint',
  } as ViewStyle,
});
