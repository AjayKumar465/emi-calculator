import { useMemo } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { InvestmentGrowthChart } from '@/src/components/invest/InvestmentGrowthChart';
import { InvestmentSummaryCard } from '@/src/components/invest/InvestmentSummaryCard';
import { InvestmentYearlyTable } from '@/src/components/invest/InvestmentYearlyTable';
import { PpfInputsCard } from '@/src/components/invest/PpfInputsCard';
import { PaymentBreakdownChart } from '@/src/components/calculator/PaymentBreakdownChart';
import { AppHeader } from '@/src/components/ui/AppHeader';
import { CalculatorHeaderShell } from '@/src/components/ui/CalculatorHeaderShell';
import { CalculatorHubNav } from '@/src/components/ui/CalculatorHubNav';
import { CalculatorScrollView } from '@/src/components/ui/CalculatorScrollView';
import { ExportActions } from '@/src/components/ui/ExportActions';
import { GlossyBackground } from '@/src/components/ui/GlossyBackground';
import { usePpfCalculator } from '@/src/hooks/usePpfCalculator';
import { spacing } from '@/src/theme';
import { buildInvestmentExportPayload } from '@/src/utils/export/buildExportPayloads';
import { createResponsiveStyles, media } from '@/src/theme/responsive';

export default function PpfCalculatorScreen() {
  const { inputs, result, formattedSummary, chartData, tableHeaders, tableRows, formattedLifetimeCost, updateInputs } = usePpfCalculator();

  const exportPayload = useMemo(
    () =>
      buildInvestmentExportPayload({
        calculatorId: 'ppf',
        calculatorName: 'PPF Calculator',
        subtitle: 'Public Provident Fund with annual compounding',
        summaryItems: formattedSummary,
        donutSegments: result.donutSegments,
        tableHeaders,
        tableRows,
        fileBaseName: 'ppf-calculator',
      }),
    [formattedSummary, result.donutSegments, tableHeaders, tableRows],
  );

  return (
    <GlossyBackground>
      <StatusBar style="light" />
      <CalculatorScrollView contentContainerStyle={styles.scrollContent}>
        <CalculatorHeaderShell>
          <AppHeader
            title="PPF"
            titleHighlight="Calculator"
            subtitle="Public Provident Fund — tax-free returns with annual compounding and inflation-adjusted projections."
          />
          <CalculatorHubNav active="ppf" />
        </CalculatorHeaderShell>
        <View style={styles.pageContent}>
          <View style={styles.layoutGrid}>
            <View style={styles.column}>
              <View style={styles.section}>
                <PpfInputsCard inputs={inputs} onChange={updateInputs} />
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.section}>
                <InvestmentSummaryCard items={formattedSummary} title="PPF Summary" subtitle="Maturity projection with inflation impact" />
              </View>
              <View style={styles.section}>
                <PaymentBreakdownChart segments={result.donutSegments} lifetimeCostLabel={formattedLifetimeCost} title="Investment Breakdown" subtitle="Deposits vs interest vs inflation erosion" centerTitle="Maturity" centerSubtitle="Value" />
              </View>
              <View style={styles.section}>
                <InvestmentGrowthChart data={chartData} investedLabel="Deposits" returnsLabel="Interest Earned" />
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
