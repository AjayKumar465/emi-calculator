import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../../theme';

interface GlossyBackgroundProps {
  children: ReactNode;
}

export function GlossyBackground({ children }: GlossyBackgroundProps) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBackground,
  },
});
