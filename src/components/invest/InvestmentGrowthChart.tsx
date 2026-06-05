import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';

import { formatCurrency } from '../../utils/format';
import { colors, fonts, fontSizes, spacing } from '../../theme';
import { Card } from '../ui/Card';
import { HorizontalScrollArea } from '../ui/HorizontalScrollArea';
import { SectionHeader } from '../ui/SectionHeader';

export interface InvestmentChartPoint {
  year: number;
  invested: number;
  nominalValue: number;
  realValue: number;
}

interface InvestmentGrowthChartProps {
  data: InvestmentChartPoint[];
  title?: string;
  subtitle?: string;
  investedLabel?: string;
  returnsLabel?: string;
}

const CHART_HEIGHT = 260;
const CHART_WIDTH = 720;
const PADDING = { top: 20, right: 20, bottom: 40, left: 56 };

export const InvestmentGrowthChart = memo(function InvestmentGrowthChart({
  data,
  title = 'Growth Projection',
  subtitle = 'Invested vs growth with inflation-adjusted line',
  investedLabel = 'Invested',
  returnsLabel = 'Returns',
}: InvestmentGrowthChartProps) {
  const chartModel = useMemo(() => {
    if (data.length === 0) return null;

    const maxValue = Math.max(...data.map((d) => d.nominalValue), 1);
    const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
    const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
    const barWidth = Math.max(12, plotWidth / data.length - 8);

    const bars = data.map((item, index) => {
      const x = PADDING.left + (index * plotWidth) / Math.max(data.length - 1, 1) - barWidth / 2;
      const investedHeight = (item.invested / maxValue) * plotHeight;
      const returnsHeight = ((item.nominalValue - item.invested) / maxValue) * plotHeight;

      const investedY = PADDING.top + plotHeight - investedHeight;
      const returnsY = investedY - returnsHeight;

      const realY = PADDING.top + plotHeight - (item.realValue / maxValue) * plotHeight;

      return { year: item.year, x, barWidth, investedY, investedHeight, returnsY, returnsHeight, centerX: x + barWidth / 2, realY };
    });

    const realPoints = bars.map((b) => `${b.centerX},${b.realY}`).join(' ');

    return { bars, realPoints, maxValue };
  }, [data]);

  if (!chartModel) return null;

  return (
    <Card>
      <SectionHeader title={title} subtitle={subtitle} />
      <HorizontalScrollArea>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          <Line
            x1={PADDING.left} y1={CHART_HEIGHT - PADDING.bottom}
            x2={CHART_WIDTH - PADDING.right} y2={CHART_HEIGHT - PADDING.bottom}
            stroke={colors.border} strokeWidth={1}
          />
          {chartModel.bars.map((bar) => (
            <G key={bar.year}>
              {bar.investedHeight > 0 ? (
                <Rect x={bar.x} y={bar.investedY} width={bar.barWidth} height={bar.investedHeight} fill={colors.chart.invested} rx={2} />
              ) : null}
              {bar.returnsHeight > 0 ? (
                <Rect x={bar.x} y={bar.returnsY} width={bar.barWidth} height={bar.returnsHeight} fill={colors.chart.returns} rx={2} />
              ) : null}
              <SvgText x={bar.centerX} y={CHART_HEIGHT - 12} fontSize={10} fill={colors.textSecondary} textAnchor="middle">
                {bar.year}
              </SvgText>
            </G>
          ))}
          <Polyline points={chartModel.realPoints} fill="none" stroke={colors.chart.inflationErosion} strokeWidth={2} strokeDasharray="6,3" />
        </Svg>
      </HorizontalScrollArea>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.chart.invested }]} />
          <Text style={styles.legendLabel}>{investedLabel}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.chart.returns }]} />
          <Text style={styles.legendLabel}>{returnsLabel}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.chart.inflationErosion, borderRadius: 0, height: 2, width: 16, marginTop: 5 }]} />
          <Text style={styles.legendLabel}>Real Value (inflation-adjusted)</Text>
        </View>
      </View>
      <Text style={styles.caption}>
        Peak value {formatCurrency(chartModel.maxValue)}
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
