import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MonthYear } from '../../types/calculator';
import { MONTH_LABELS } from '../../utils/constants';
import { clampMonthYear, formatMonthYear } from '../../utils/format';
import { colors, fonts, fontSizes, radii, spacing } from '../../theme';
import { Button } from './Button';

interface MonthYearPickerModalProps {
  visible: boolean;
  value: MonthYear;
  title: string;
  onConfirm: (value: MonthYear) => void;
  onCancel: () => void;
}

export function MonthYearPickerModal({
  visible,
  value,
  title,
  onConfirm,
  onCancel,
}: MonthYearPickerModalProps) {
  const [draft, setDraft] = useState<MonthYear>(() => clampMonthYear(value));

  useEffect(() => {
    if (visible) {
      setDraft(clampMonthYear(value));
    }
  }, [visible, value]);

  const shiftYear = (delta: number) => {
    setDraft((current) => clampMonthYear({ ...current, year: current.year + delta }));
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable accessibilityRole="button" onPress={onCancel} style={styles.backdropPressable} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.yearRow}>
            <Pressable
              accessibilityLabel="Previous year"
              accessibilityRole="button"
              onPress={() => shiftYear(-1)}
              style={styles.yearButton}
            >
              <Text style={styles.yearButtonText}>‹</Text>
            </Pressable>
            <Text style={styles.yearValue}>{draft.year}</Text>
            <Pressable
              accessibilityLabel="Next year"
              accessibilityRole="button"
              onPress={() => shiftYear(1)}
              style={styles.yearButton}
            >
              <Text style={styles.yearButtonText}>›</Text>
            </Pressable>
          </View>

          <View style={styles.monthGrid}>
            {MONTH_LABELS.map((monthLabel, index) => {
              const month = index + 1;
              const selected = draft.month === month;
              return (
                <Pressable
                  key={monthLabel}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setDraft((current) => ({ ...current, month }))}
                  style={[styles.monthChip, selected && styles.monthChipSelected]}
                >
                  <Text style={[styles.monthChipText, selected && styles.monthChipTextSelected]}>
                    {monthLabel}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actions}>
            <Button label="Cancel" onPress={onCancel} style={styles.actionButton} variant="ghost" />
            <Button
              label="Apply"
              onPress={() => onConfirm(clampMonthYear(draft))}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  backdropPressable: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.darkSurface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.lg,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  yearButton: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearButtonText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.xl,
    color: colors.tealAccent,
  },
  yearValue: {
    fontFamily: fonts.monoBold,
    fontSize: fontSizes.xl,
    color: colors.textPrimary,
    minWidth: 72,
    textAlign: 'center',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  monthChip: {
    width: '30%',
    minWidth: 88,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
  },
  monthChipSelected: {
    backgroundColor: colors.tealAccent,
    borderColor: colors.tealAccent,
  },
  monthChipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  monthChipTextSelected: {
    color: colors.textOnPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
