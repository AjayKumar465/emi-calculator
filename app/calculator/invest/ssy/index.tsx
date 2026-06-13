import { useMemo } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { InvestmentGrowthChart } from '@/src/components/invest/InvestmentGrowthChart';
import { InvestmentSummaryCard } from '@/src/components/invest/InvestmentSummaryCard';
import { InvestmentYearlyTable } from '@/src/components/invest/InvestmentYearlyTable';
import { SsyInputsCard } from '@/src/components/invest/SsyInputsCard';
import { PaymentBreakdownChart } from '@/src/components/calculator/PaymentBreakdownChart';
import { AppHeader } from '@/src/components/ui/AppHeader';
import { CalculatorHeaderShell } from '@/src/components/ui/CalculatorHeaderShell';
import { CalculatorHubNav } from '@/src/components/ui/CalculatorHubNav';
import { CalculatorScrollView } from '@/src/components/ui/CalculatorScrollView';
import { ExportActions } from '@/src/components/ui/ExportActions';
import { GlossyBackground } from '@/src/components/ui/GlossyBackground';
import { useSsyCalculator } from '@/src/hooks/useSsyCalculator';
import { spacing } from '@/src/theme';
import { buildInvestmentExportPayload } from '@/src/utils/export/buildExportPayloads';
import { createResponsiveStyles, media } from '@/src/theme/responsive';

export default function SsyCalculatorScreen() {
  const { inputs, result, formattedSummary, chartData, tableHeaders, tableRows, formattedLifetimeCost, updateInputs } = useSsyCalculator();

  const exportPayload = useMemo(
    () =>
      buildInvestmentExportPayload({
        calculatorId: 'ssy',
        calculatorName: 'SSY Calculator',
        subtitle: 'Sukanya Samriddhi Yojana',
        summaryItems: formattedSummary,
        donutSegments: result.donutSegments,
        investmentChartData: chartData,
        tableHeaders,
        tableRows,
        fileBaseName: 'ssy-calculator',
      }),
    [formattedSummary, result.donutSegments, chartData, tableHeaders, tableRows],
  );

  return (
    <GlossyBackground>
      <StatusBar style="light" />
      <CalculatorScrollView contentContainerStyle={styles.scrollContent}>
        <CalculatorHeaderShell>
          <AppHeader
            title="SSY"
            titleHighlight="Calculator"
            subtitle="Sukanya Samriddhi Yojana — tax-free savings for your daughter with guaranteed returns and inflation-adjusted projections."
          />
          <CalculatorHubNav active="ssy" />
        </CalculatorHeaderShell>
        <View style={styles.pageContent}>
          <View style={styles.layoutGrid}>
            <View style={styles.column}>
              <View style={styles.section}>
                <SsyInputsCard inputs={inputs} onChange={updateInputs} />
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.section}>
                <InvestmentSummaryCard items={formattedSummary} title="SSY Summary" subtitle="Maturity projection with inflation impact" />
              </View>
              <View style={styles.section}>
                <PaymentBreakdownChart segments={result.donutSegments} lifetimeCostLabel={formattedLifetimeCost} title="Investment Breakdown" subtitle="Deposits vs interest vs inflation erosion" centerTitle="Maturity" centerSubtitle="Value" />
              </View>
              <View style={styles.section}>
                <InvestmentGrowthChart data={chartData} investedLabel="Deposits" returnsLabel="Interest" />
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
