import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, radii, spacing } from '../../theme';

interface BadgeProps {
  label: string;
  dotColor?: string;
}

export function Badge({ label, dotColor = colors.success }: BadgeProps) {
  return (
    <View style={styles.badge}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.ghostOnDark,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
});
