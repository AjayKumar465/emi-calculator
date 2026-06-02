import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AmortizationYear } from '../../types/calculator';
import { formatCurrency, formatPercent } from '../../utils/format';
import { colors, fonts, fontSizes, spacing } from '../../theme';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';

interface AmortizationTableProps {
  years: AmortizationYear[];
}

const HEADER_COLUMNS = [
  { key: 'year', label: 'Year', flex: 0.8 },
  { key: 'principal', label: 'Principal', flex: 1, color: colors.chart.principal },
  { key: 'interest', label: 'Interest', flex: 1, color: colors.chart.interest },
  {
    key: 'taxes',
    label: 'Taxes/Ins/Maint',
    flex: 1.1,
    color: colors.chart.taxesInsurance,
  },
  { key: 'total', label: 'Total', flex: 1, color: colors.tealAccent },
  { key: 'balance', label: 'Balance', flex: 1, color: colors.chart.balance },
  { key: 'paid', label: 'Paid %', flex: 0.8, color: colors.tealAccent },
];

export function AmortizationTable({ years }: AmortizationTableProps) {
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  const toggleYear = useCallback((year: number) => {
    setExpandedYear((current) => (current === year ? null : year));
  }, []);

  return (
    <Card>
      <SectionHeader
        title="Amortization Table"
        subtitle="Tap a year to reveal monthly detail"
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            {HEADER_COLUMNS.map((column) => (
              <Text
                key={column.key}
                style={[
                  styles.headerCell,
                  { flex: column.flex },
                  column.color ? { color: column.color } : null,
                ]}
              >
                {column.label}
              </Text>
            ))}
          </View>
          {years.map((yearRow) => {
            const expanded = expandedYear === yearRow.year;
            return (
              <View key={yearRow.year}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => toggleYear(yearRow.year)}
                  style={[styles.dataRow, expanded && styles.expandedRow]}
                >
                  <View style={[styles.yearCell, { flex: 0.8 }]}>
                    <Text style={styles.expandIcon}>{expanded ? '⌄' : '›'}</Text>
                    <Text style={styles.yearText}>{yearRow.year}</Text>
                  </View>
                  <Text style={[styles.cell, styles.mono, { flex: 1 }]}>
                    {formatCurrency(yearRow.principal)}
                  </Text>
                  <Text style={[styles.cell, styles.mono, { flex: 1 }]}>
                    {formatCurrency(yearRow.interest)}
                  </Text>
                  <Text style={[styles.cell, styles.mono, { flex: 1.1 }]}>
                    {formatCurrency(yearRow.taxesInsuranceMaintenance)}
                  </Text>
                  <Text style={[styles.cell, styles.mono, { flex: 1 }]}>
                    {formatCurrency(yearRow.totalPayment)}
                  </Text>
                  <Text style={[styles.cell, styles.mono, { flex: 1 }]}>
                    {formatCurrency(yearRow.balance)}
                  </Text>
                  <Text style={[styles.cell, styles.mono, { flex: 0.8 }]}>
                    {formatPercent(yearRow.loanPaidPercent, 1)}
                  </Text>
                </Pressable>
                {expanded
                  ? yearRow.months.map((month) => (
                      <View key={`${yearRow.year}-${month.monthIndex}`} style={styles.monthRow}>
                        <Text style={[styles.monthCell, { flex: 0.8 }]}>
                          {month.date.month}/{month.date.year}
                        </Text>
                        <Text style={[styles.monthCell, styles.mono, { flex: 1 }]}>
                          {formatCurrency(month.principal)}
                        </Text>
                        <Text style={[styles.monthCell, styles.mono, { flex: 1 }]}>
                          {formatCurrency(month.interest)}
                        </Text>
                        <Text style={[styles.monthCell, styles.mono, { flex: 1.1 }]}>
                          {formatCurrency(month.taxesInsuranceMaintenance)}
                        </Text>
                        <Text style={[styles.monthCell, styles.mono, { flex: 1 }]}>
                          {formatCurrency(month.totalPayment)}
                        </Text>
                        <Text style={[styles.monthCell, styles.mono, { flex: 1 }]}>
                          {formatCurrency(month.balance)}
                        </Text>
                        <Text style={[styles.monthCell, styles.mono, { flex: 0.8 }]}>
                          {formatPercent(month.loanPaidPercent, 1)}
                        </Text>
                      </View>
                    ))
                  : null}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  table: {
    minWidth: 920,
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.inputBackground,
  },
  headerCell: {
    paddingHorizontal: spacing.sm,
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  expandedRow: {
    backgroundColor: colors.taskCardEnd,
  },
  cell: {
    paddingHorizontal: spacing.sm,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  yearCell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  mono: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.xs,
  },
  expandIcon: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.lg,
    color: colors.tealAccent,
    marginRight: spacing.xs,
  },
  yearText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  monthRow: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
    backgroundColor: colors.inputBackgroundReadOnly,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  monthCell: {
    paddingHorizontal: spacing.sm,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
});
