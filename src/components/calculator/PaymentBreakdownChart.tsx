import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import { DonutSegment } from '../../types/calculator';
import { formatCurrency } from '../../utils/format';
import { colors, fonts, fontSizes, spacing } from '../../theme';
import { AnimatedValue } from '../ui/AnimatedValue';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';

interface PaymentBreakdownChartProps {
  segments: DonutSegment[];
  lifetimeCostLabel: string;
  title?: string;
  subtitle?: string;
  centerTitle?: string;
  centerSubtitle?: string;
}

const CHART_SIZE = 220;
const STROKE_WIDTH = 28;
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CHART_CENTER = CHART_SIZE / 2;

export const PaymentBreakdownChart = memo(function PaymentBreakdownChart({
  segments,
  lifetimeCostLabel,
  title = 'Lifetime Cost',
  subtitle = 'Total of all payments',
  centerTitle = 'Lifetime',
  centerSubtitle = 'Cost',
}: PaymentBreakdownChartProps) {
  const total = useMemo(
    () => segments.reduce((sum, segment) => sum + segment.value, 0),
    [segments],
  );

  const arcs = useMemo(() => {
    let offset = 0;
    return segments.map((segment) => {
      const ratio = total > 0 ? segment.value / total : 0;
      const length = ratio * CIRCUMFERENCE;
      const arc = {
        ...segment,
        dashArray: `${length} ${CIRCUMFERENCE - length}`,
        dashOffset: -offset,
      };
      offset += length;
      return arc;
    });
  }, [segments, total]);

  return (
    <Card>
      <SectionHeader title={title} subtitle={subtitle} />
      <View style={styles.chartRow}>
        <View style={styles.chartWrap}>
          <Svg width={CHART_SIZE} height={CHART_SIZE}>
            <G transform={`rotate(-90 ${CHART_CENTER} ${CHART_CENTER})`}>
              <Circle
                cx={CHART_CENTER}
                cy={CHART_CENTER}
                r={RADIUS}
                stroke={colors.inputBackground}
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
              />
              {arcs.map((arc) => (
                <Circle
                  key={arc.key}
                  cx={CHART_CENTER}
                  cy={CHART_CENTER}
                  r={RADIUS}
                  stroke={arc.color}
                  strokeWidth={STROKE_WIDTH}
                  strokeDasharray={arc.dashArray}
                  strokeDashoffset={arc.dashOffset}
                  strokeLinecap="butt"
                  fill="transparent"
                />
              ))}
            </G>
          </Svg>
          <View style={styles.centerLabel}>
            <Text style={styles.centerTitle}>{centerTitle}</Text>
            <Text style={styles.centerSubtitle}>{centerSubtitle}</Text>
          </View>
        </View>
        <View style={styles.legend}>
          {segments.map((segment) => (
            <View key={segment.key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: segment.color }]} />
              <View style={styles.legendTextWrap}>
                <Text style={styles.legendLabel}>{segment.label}</Text>
                <Text style={styles.legendValue}>{formatCurrency(segment.value)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <AnimatedValue style={styles.total} value={lifetimeCostLabel} />
    </Card>
  );
});

const styles = StyleSheet.create({
  chartRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    alignItems: 'center',
  },
  chartWrap: {
    width: CHART_SIZE,
    height: CHART_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  centerTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.lg,
    color: colors.textPrimary,
  },
  centerSubtitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  legend: {
    flex: 1,
    minWidth: 220,
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  legendTextWrap: {
    flex: 1,
  },
  legendLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  legendValue: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  total: {
    marginTop: spacing.lg,
    textAlign: 'center',
    fontFamily: fonts.monoBold,
    fontSize: fontSizes.hero,
    color: colors.tealAccent,
  },
});
