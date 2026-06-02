import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, radii, spacing } from '../../theme';

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  showPercent?: boolean;
}

export function ProgressBar({
  label,
  value,
  max = 100,
  showPercent = true,
}: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {showPercent ? <Text style={styles.percent}>{Math.round(percent)}%</Text> : null}
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  percent: {
    fontFamily: fonts.monoMedium,
    fontSize: fontSizes.sm,
    color: colors.tealAccent,
  },
  track: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.inputBackground,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.tealAccent,
  },
});
