import { useMemo } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { InvestmentGrowthChart } from '@/src/components/invest/InvestmentGrowthChart';
import { InvestmentSummaryCard } from '@/src/components/invest/InvestmentSummaryCard';
import { InvestmentYearlyTable } from '@/src/components/invest/InvestmentYearlyTable';
import { FutureCostInputsCard } from '@/src/components/invest/FutureCostInputsCard';
import { PaymentBreakdownChart } from '@/src/components/calculator/PaymentBreakdownChart';
import { AppHeader } from '@/src/components/ui/AppHeader';
import { CalculatorHeaderShell } from '@/src/components/ui/CalculatorHeaderShell';
import { CalculatorHubNav } from '@/src/components/ui/CalculatorHubNav';
import { CalculatorScrollView } from '@/src/components/ui/CalculatorScrollView';
import { ExportActions } from '@/src/components/ui/ExportActions';
import { GlossyBackground } from '@/src/components/ui/GlossyBackground';
import { useFutureCostCalculator } from '@/src/hooks/useFutureCostCalculator';
import { spacing } from '@/src/theme';
import { buildInvestmentExportPayload } from '@/src/utils/export/buildExportPayloads';
import { createResponsiveStyles, media } from '@/src/theme/responsive';

export default function FutureCostCalculatorScreen() {
  const { inputs, result, formattedSummary, chartData, tableHeaders, tableRows, formattedLifetimeCost, updateInputs } = useFutureCostCalculator();

  const exportPayload = useMemo(
    () =>
      buildInvestmentExportPayload({
        calculatorId: 'future-cost',
        calculatorName: 'Future Cost Planner',
        subtitle: 'Inflation-adjusted expense projection',
        summaryItems: formattedSummary,
        donutSegments: result.donutSegments,
        tableHeaders,
        tableRows,
        fileBaseName: 'future-cost-planner',
      }),
    [formattedSummary, result.donutSegments, tableHeaders, tableRows],
  );

  return (
    <GlossyBackground>
      <StatusBar style="light" />
      <CalculatorScrollView contentContainerStyle={styles.scrollContent}>
        <CalculatorHeaderShell>
          <AppHeader
            title="Future Cost"
            titleHighlight="Planner"
            subtitle="Project your current expenses into the future — see how inflation erodes purchasing power and plan your financial target."
          />
          <CalculatorHubNav active="future-cost" />
        </CalculatorHeaderShell>
        <View style={styles.pageContent}>
          <View style={styles.layoutGrid}>
            <View style={styles.column}>
              <View style={styles.section}>
                <FutureCostInputsCard inputs={inputs} onChange={updateInputs} />
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.section}>
                <InvestmentSummaryCard items={formattedSummary} title="Future Cost Summary" subtitle="Projected expenses with inflation" />
              </View>
              <View style={styles.section}>
                <PaymentBreakdownChart segments={result.donutSegments} lifetimeCostLabel={formattedLifetimeCost} title="Cost Breakdown" subtitle="Today's cost vs inflation increase" centerTitle="Future" centerSubtitle="Annual Cost" />
              </View>
              <View style={styles.section}>
                <InvestmentGrowthChart data={chartData} title="Expense Growth Over Time" subtitle="Annual expenses rising with inflation" investedLabel="Today's Annual Cost" returnsLabel="Inflation Increase" />
              </View>
              <View style={styles.section}>
                <InvestmentYearlyTable headers={tableHeaders} rows={tableRows} title="Year-by-Year Expenses" subtitle="Monthly and annual expense projection" />
              </View>
              <View style={styles.section}>
                <ExportActions payload={exportPayload} />
              </View>
            </View>
          </View>
        </View>
      </CalculatorScrollView>
    </GlossyBackground>
  );
}

const styles = createResponsiveStyles({
  scrollContent: { paddingBottom: spacing.section },
  pageContent: { paddingHorizontal: spacing.lg, [media.mobile]: { paddingHorizontal: spacing.md } },
  layoutGrid: { width: '100%' as const, flexDirection: 'column' as const, gap: spacing.lg, [media.desktopUp]: { flexDirection: 'row' as const, alignItems: 'flex-start' as const } },
  column: { width: '100%' as const, minWidth: 0, flexShrink: 0, [media.desktopUp]: { flex: 1 } },
  section: { width: '100%' as const, flexShrink: 0 },
});
