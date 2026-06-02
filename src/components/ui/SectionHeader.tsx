import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, spacing } from '../../theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  italic?: boolean;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.xl,
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
});
