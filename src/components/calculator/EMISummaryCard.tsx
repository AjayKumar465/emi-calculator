import { StyleSheet, Text, View } from 'react-native';

import { SummaryLineItem } from '../../types/calculator';
import { formatCurrency } from '../../utils/format';
import { colors, fonts, fontSizes, spacing } from '../../theme';
import { AnimatedValue } from '../ui/AnimatedValue';
import { Card } from '../ui/Card';
import { Divider } from '../ui/Divider';
import { ProgressBar } from '../ui/ProgressBar';
import { SectionHeader } from '../ui/SectionHeader';

interface EMISummaryCardProps {
  items: SummaryLineItem[];
  loanPaidPercent: number;
}

export function EMISummaryCard({ items, loanPaidPercent }: EMISummaryCardProps) {
  return (
    <Card glow>
      <SectionHeader title="Monthly Summary" subtitle="Your complete monthly outgo" />
      <ProgressBar label="Loan paid to date" value={loanPaidPercent} />
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <View key={item.key}>
            <View style={[styles.row, item.emphasized && styles.emphasizedRow]}>
              <Text style={[styles.label, item.emphasized && styles.emphasizedLabel]}>
                {item.label}
              </Text>
              {item.emphasized ? (
                <AnimatedValue
                  style={styles.emphasizedValue}
                  value={formatCurrency(item.value)}
                />
              ) : (
                <Text style={styles.value}>{formatCurrency(item.value)}</Text>
              )}
            </View>
            {!isLast ? <Divider /> : null}
          </View>
        );
      })}
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
});
