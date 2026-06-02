import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MonthYear } from '../../types/calculator';
import { clampMonthYear, formatMonthYear } from '../../utils/format';
import { colors, fonts, fontSizes, radii, spacing } from '../../theme';
import { MonthYearPickerModal } from './MonthYearPickerModal';

interface DatePickerProps {
  label: string;
  value: MonthYear;
  onChange: (value: MonthYear) => void;
}

export function DatePicker({ label, value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const safeValue = clampMonthYear(value);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <Pressable
          accessibilityHint="Opens month and year picker"
          accessibilityLabel={`${label}, ${formatMonthYear(safeValue)}`}
          accessibilityRole="button"
          onPress={() => setOpen(true)}
          style={({ pressed }) => [styles.inputSurface, pressed && styles.inputSurfacePressed]}
        >
          <Text style={styles.displayValue}>{formatMonthYear(safeValue)}</Text>
          <Text style={styles.chevron}>▾</Text>
        </Pressable>
        <Text style={styles.hint}>Tap to pick month and year</Text>
      </View>

      <MonthYearPickerModal
        title={label}
        value={safeValue}
        visible={open}
        onCancel={() => setOpen(false)}
        onConfirm={(nextValue) => {
          onChange(nextValue);
          setOpen(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minWidth: 180,
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  inputSurface: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.inputBackground,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputSurfacePressed: {
    borderColor: colors.tealAccent,
    backgroundColor: colors.cardBackgroundElevated,
  },
  displayValue: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  chevron: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.lg,
    color: colors.tealAccent,
    marginLeft: spacing.sm,
  },
  hint: {
    marginTop: spacing.xs,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
});
