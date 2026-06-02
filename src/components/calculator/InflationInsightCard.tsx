import { StyleSheet, Text, View } from 'react-native';

import { InflationSummaryRow } from '../../types/inflation';
import { colors, fonts, fontSizes, spacing } from '../../theme';
import { AnimatedValue } from '../ui/AnimatedValue';
import { Card } from '../ui/Card';
import { Divider } from '../ui/Divider';
import { SectionHeader } from '../ui/SectionHeader';

export interface FormattedInflationRow extends InflationSummaryRow {
  displayValue: string;
}

interface InflationInsightCardProps {
  items: FormattedInflationRow[];
  annualInflationRate: number;
  showHomeLoanFields?: boolean;
}

export function InflationInsightCard({
  items,
  annualInflationRate,
  showHomeLoanFields = false,
}: InflationInsightCardProps) {
  return (
    <Card>
      <SectionHeader
        title="Inflation Benefit"
        subtitle={`Estimated at ${annualInflationRate}% annual inflation`}
      />
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <View key={item.key}>
            <View style={[styles.row, item.emphasized && styles.emphasizedRow]}>
              <Text style={[styles.label, item.emphasized && styles.emphasizedLabel]}>
                {item.label}
              </Text>
              {item.emphasized ? (
                <AnimatedValue style={styles.emphasizedValue} value={item.displayValue} />
              ) : (
                <Text style={styles.value}>{item.displayValue}</Text>
              )}
            </View>
            {!isLast ? <Divider /> : null}
          </View>
        );
      })}
      <Text style={styles.footnote}>
        Higher inflation reduces the real burden of future EMIs. This is a borrower's benefit,
        separate from bank interest rate.
        {showHomeLoanFields
          ? ' Property end value compounds at your property appreciation rate (% per year), separate from payment inflation.'
          : null}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  emphasizedRow: {
    backgroundColor: colors.taskCardStart,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    flex: 1,
    paddingRight: spacing.md,
  },
  emphasizedLabel: {
    fontFamily: fonts.bodySemiBold,
    color: colors.textPrimary,
  },
  value: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  emphasizedValue: {
    fontFamily: fonts.monoBold,
    fontSize: fontSizes.lg,
    color: colors.tealAccent,
  },
  footnote: {
    marginTop: spacing.md,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
