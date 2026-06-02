import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';

import { CreditCardChartPoint } from '../../types/creditCardCalculator';
import { formatCurrency } from '../../utils/format';
import { colors, fonts, fontSizes, spacing } from '../../theme';
import { Card } from '../ui/Card';
import { HorizontalScrollArea } from '../ui/HorizontalScrollArea';
import { SectionHeader } from '../ui/SectionHeader';

interface CreditCardPaymentChartProps {
  data: CreditCardChartPoint[];
}

const CHART_HEIGHT = 260;
const CHART_WIDTH = 720;
const PADDING = { top: 20, right: 20, bottom: 48, left: 56 };

const STACK_KEYS = [
  { key: 'principal' as const, color: colors.chart.principal, label: 'Principal' },
  { key: 'interest' as const, color: colors.chart.interest, label: 'Interest' },
  { key: 'gstOnInterest' as const, color: colors.chart.taxesInsurance, label: 'GST on Interest' },
];

export const CreditCardPaymentChart = memo(function CreditCardPaymentChart({
  data,
}: CreditCardPaymentChartProps) {
  const chartModel = useMemo(() => {
    if (data.length === 0) {
      return null;
    }

    const maxPayment = Math.max(...data.map((item) => item.totalPayment), 1);
    const maxBalance = Math.max(...data.map((item) => item.balance), 1);
    const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
    const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
    const barWidth = Math.max(10, plotWidth / data.length - 6);

    const bars = data.map((item, index) => {
      const x = PADDING.left + index * (barWidth + 6);
      let yCursor = PADDING.top + plotHeight;

      const stacks = STACK_KEYS.map((stack) => {
        const value = item[stack.key];
        const height = (value / maxPayment) * plotHeight;
        yCursor -= height;
        return { ...stack, x, y: yCursor, width: barWidth, height };
      });

      const balanceY =
        PADDING.top + plotHeight - (item.balance / maxBalance) * plotHeight;

      return {
        label: item.label,
        x: x + barWidth / 2,
        balanceY,
        stacks,
      };
    });

    return {
      bars,
      balancePoints: bars.map((bar) => `${bar.x},${bar.balanceY}`).join(' '),
      maxPayment,
      maxBalance,
    };
  }, [data]);

  if (!chartModel) {
    return null;
  }

  return (
    <Card>
      <SectionHeader
        title="Repayment Chart"
        subtitle="Monthly principal, interest, GST, and declining balance"
      />
      <HorizontalScrollArea>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          <Line
            x1={PADDING.left}
            y1={CHART_HEIGHT - PADDING.bottom}
            x2={CHART_WIDTH - PADDING.right}
            y2={CHART_HEIGHT - PADDING.bottom}
            stroke={colors.border}
            strokeWidth={1}
          />
          {chartModel.bars.map((bar) => (
            <G key={bar.label}>
              {bar.stacks.map((stack) =>
                stack.height > 0 ? (
                  <Rect
                    key={`${bar.label}-${stack.key}`}
                    x={stack.x}
                    y={stack.y}
                    width={stack.width}
                    height={stack.height}
                    fill={stack.color}
                    rx={2}
                  />
                ) : null,
              )}
              <SvgText
                x={bar.x}
                y={CHART_HEIGHT - 14}
                fontSize={9}
                fill={colors.textSecondary}
                textAnchor="middle"
              >
                {bar.label.split(' ')[0]}
              </SvgText>
            </G>
          ))}
          <Polyline
            points={chartModel.balancePoints}
            fill="none"
            stroke={colors.chart.balance}
            strokeWidth={2}
          />
        </Svg>
      </HorizontalScrollArea>
      <View style={styles.legend}>
        {STACK_KEYS.map((item) => (
          <View key={item.key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
          </View>
        ))}
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.chart.balance }]} />
          <Text style={styles.legendLabel}>Balance</Text>
        </View>
      </View>
      <Text style={styles.caption}>
        Peak monthly payment {formatCurrency(chartModel.maxPayment)} · Balance scale{' '}
        {formatCurrency(chartModel.maxBalance)}
      </Text>
    </Card>
  );
});

const styles = StyleSheet.create({
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  caption: {
    marginTop: spacing.sm,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
});
