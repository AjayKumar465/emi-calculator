import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, spacing } from '../../theme';
import { Card } from '../ui/Card';
import { HorizontalScrollArea } from '../ui/HorizontalScrollArea';
import { SectionHeader } from '../ui/SectionHeader';

interface InvestmentYearlyTableProps {
  title?: string;
  subtitle?: string;
  headers: string[];
  rows: (string | number)[][];
}

export const InvestmentYearlyTable = memo(function InvestmentYearlyTable({
  title = 'Year-by-Year Projection',
  subtitle = 'Nominal and inflation-adjusted values',
  headers,
  rows,
}: InvestmentYearlyTableProps) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <Card>
      <SectionHeader title={title} subtitle={subtitle} />
      <HorizontalScrollArea>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            {headers.map((header, i) => (
              <Text key={header} style={[styles.headerCell, i === 0 && styles.firstCol]}>
                {header}
              </Text>
            ))}
          </View>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.dataRow}>
              {row.map((cell, colIndex) => (
                <Text
                  key={colIndex}
                  style={[
                    styles.cell,
                    colIndex === 0 && styles.firstCol,
                    colIndex > 0 && styles.mono,
                  ]}
                >
                  {typeof cell === 'number' ? cell.toLocaleString('en-IN') : cell}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </HorizontalScrollArea>
    </Card>
  );
});

const styles = StyleSheet.create({
  table: {
    minWidth: 700,
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.inputBackground,
  },
  headerCell: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  firstCol: {
    flex: 0.6,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cell: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  mono: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.xs,
  },
});
