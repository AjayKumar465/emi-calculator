import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LoanCalculatorMode } from '../../types/loanCalculator';
import { LOAN_MODE_TABS } from '../../utils/loanCalculator';
import { colors, fonts, fontSizes, radii, spacing } from '../../theme';

interface LoanModeTabsProps {
  mode: LoanCalculatorMode;
  onChange: (mode: LoanCalculatorMode) => void;
}

export function LoanModeTabs({ mode, onChange }: LoanModeTabsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      <View style={styles.row}>
        {LOAN_MODE_TABS.map((tab) => {
          const active = tab.key === mode;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onChange(tab.key)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Text style={[styles.shortLabel, active && styles.shortLabelActive]}>
                {tab.shortLabel}
              </Text>
              <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  tab: {
    width: 132,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
  },
  tabActive: {
    backgroundColor: colors.taskCardStart,
    borderColor: colors.tealAccent,
  },
  shortLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  shortLabelActive: {
    color: colors.tealAccent,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.textPrimary,
  },
});
