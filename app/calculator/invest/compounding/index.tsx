import { useMemo } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { InvestmentGrowthChart } from '@/src/components/invest/InvestmentGrowthChart';
import { InvestmentSummaryCard } from '@/src/components/invest/InvestmentSummaryCard';
import { InvestmentYearlyTable } from '@/src/components/invest/InvestmentYearlyTable';
import { CompoundingInputsCard } from '@/src/components/invest/CompoundingInputsCard';
import { PaymentBreakdownChart } from '@/src/components/calculator/PaymentBreakdownChart';
import { AppHeader } from '@/src/components/ui/AppHeader';
import { CalculatorHeaderShell } from '@/src/components/ui/CalculatorHeaderShell';
import { CalculatorHubNav } from '@/src/components/ui/CalculatorHubNav';
import { CalculatorScrollView } from '@/src/components/ui/CalculatorScrollView';
import { ExportActions } from '@/src/components/ui/ExportActions';
import { GlossyBackground } from '@/src/components/ui/GlossyBackground';
import { useCompoundingCalculator } from '@/src/hooks/useCompoundingCalculator';
import { spacing } from '@/src/theme';
import { buildInvestmentExportPayload } from '@/src/utils/export/buildExportPayloads';
import { createResponsiveStyles, media } from '@/src/theme/responsive';

export default function CompoundingCalculatorScreen() {
  const { inputs, result, formattedSummary, chartData, tableHeaders, tableRows, formattedLifetimeCost, updateInputs } = useCompoundingCalculator();

  const exportPayload = useMemo(
    () =>
      buildInvestmentExportPayload({
        calculatorId: 'compounding',
        calculatorName: 'Compound Interest Calculator',
        subtitle: 'Flexible compounding with periodic contributions',
        summaryItems: formattedSummary,
        donutSegments: result.donutSegments,
        tableHeaders,
        tableRows,
        fileBaseName: 'compounding-calculator',
      }),
    [formattedSummary, result.donutSegments, tableHeaders, tableRows],
  );

  return (
    <GlossyBackground>
      <StatusBar style="light" />
      <CalculatorScrollView contentContainerStyle={styles.scrollContent}>
        <CalculatorHeaderShell>
          <AppHeader
            title="Compound"
            titleHighlight="Interest Calculator"
            subtitle="See how compounding grows your money over time — with flexible frequency, periodic contributions, and inflation-adjusted projections."
          />
          <CalculatorHubNav active="compounding" />
        </CalculatorHeaderShell>
        <View style={styles.pageContent}>
          <View style={styles.layoutGrid}>
            <View style={styles.column}>
              <View style={styles.section}>
                <CompoundingInputsCard inputs={inputs} onChange={updateInputs} />
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.section}>
                <InvestmentSummaryCard items={formattedSummary} title="Compounding Summary" subtitle="Final value with inflation impact" />
              </View>
              <View style={styles.section}>
                <PaymentBreakdownChart segments={result.donutSegments} lifetimeCostLabel={formattedLifetimeCost} title="Investment Breakdown" subtitle="Contributions vs returns vs inflation erosion" centerTitle="Final" centerSubtitle="Value" />
              </View>
              <View style={styles.section}>
                <InvestmentGrowthChart data={chartData} investedLabel="Contributions" returnsLabel="Returns" />
              </View>
              <View style={styles.section}>
                <InvestmentYearlyTable headers={tableHeaders} rows={tableRows} />
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
