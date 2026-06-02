import { useMemo } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { AmortizationChart } from '@/src/components/calculator/AmortizationChart';
import { AmortizationTable } from '@/src/components/calculator/AmortizationTable';
import { EMISummaryCard } from '@/src/components/calculator/EMISummaryCard';
import { InflationInsightCard } from '@/src/components/calculator/InflationInsightCard';
import { HomeownerExpensesCard } from '@/src/components/calculator/HomeownerExpensesCard';
import { LoanDetailsCard } from '@/src/components/calculator/LoanDetailsCard';
import { PaymentBreakdownChart } from '@/src/components/calculator/PaymentBreakdownChart';
import { PrepaymentCard } from '@/src/components/calculator/PrepaymentCard';
import { AppHeader } from '@/src/components/ui/AppHeader';
import { CalculatorHubNav } from '@/src/components/ui/CalculatorHubNav';
import { CalculatorScrollView } from '@/src/components/ui/CalculatorScrollView';
import { ExportActions } from '@/src/components/ui/ExportActions';
import { GlossyBackground } from '@/src/components/ui/GlossyBackground';
import { useEMICalculator } from '@/src/hooks/useEMICalculator';
import { spacing } from '@/src/theme';
import { buildHomeLoanExportPayload } from '@/src/utils/export/buildExportPayloads';
import { createResponsiveStyles, media } from '@/src/theme/responsive';

export default function CalculatorScreen() {
  const {
    inputs,
    result,
    donutSegments,
    summaryLineItems,
    formattedLifetimeCost,
    formattedInflationSummary,
    updateInputs,
    resetPrepayments,
  } = useEMICalculator();

  const loanPaidPercent =
    result.amortizationYears.length > 0
      ? result.amortizationYears[result.amortizationYears.length - 1].loanPaidPercent
      : 0;

  const exportPayload = useMemo(
    () => buildHomeLoanExportPayload(inputs, result, summaryLineItems, donutSegments),
    [inputs, result, summaryLineItems, donutSegments],
  );

  return (
    <GlossyBackground>
      <StatusBar style="light" />
      <CalculatorScrollView contentContainerStyle={styles.scrollContent}>
        <AppHeader
          title="Home Loan"
          titleHighlight="EMI Calculator"
          subtitle="Plan repayments with clarity — model prepayments, taxes, and lifetime cost in one glossy view."
        />
        <CalculatorHubNav active="home-loan" />
        <View style={styles.layoutGrid}>
          <View style={styles.column}>
            <View style={styles.section}>
              <LoanDetailsCard
                loan={inputs.loan}
                netLoanAmount={result.netLoanAmount}
                annualInflationRate={inputs.annualInflationRate}
                annualPropertyAppreciationRate={inputs.annualPropertyAppreciationRate}
                onChange={(loan) => updateInputs((current) => ({ ...current, loan }))}
                onInflationRateChange={(annualInflationRate) =>
                  updateInputs((current) => ({ ...current, annualInflationRate }))
                }
                onPropertyAppreciationRateChange={(annualPropertyAppreciationRate) =>
                  updateInputs((current) => ({ ...current, annualPropertyAppreciationRate }))
                }
              />
            </View>
            <View style={styles.section}>
              <HomeownerExpensesCard
                expenses={inputs.expenses}
                onChange={(expenses) => updateInputs((current) => ({ ...current, expenses }))}
              />
            </View>
            <View style={styles.section}>
              <PrepaymentCard
                prepayments={inputs.prepayments}
                onChange={(prepayments) => updateInputs((current) => ({ ...current, prepayments }))}
                onRemove={resetPrepayments}
              />
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.section}>
              <EMISummaryCard items={summaryLineItems} loanPaidPercent={loanPaidPercent} />
            </View>
            <View style={styles.section}>
              <PaymentBreakdownChart
                segments={donutSegments}
                lifetimeCostLabel={formattedLifetimeCost}
              />
            </View>
            <View style={styles.section}>
              <InflationInsightCard
                items={formattedInflationSummary}
                annualInflationRate={inputs.annualInflationRate}
                showHomeLoanFields
              />
            </View>
            <View style={styles.section}>
              <AmortizationChart data={result.chartData} />
            </View>
            <View style={styles.section}>
              <AmortizationTable years={result.amortizationYears} />
            </View>
            <View style={styles.section}>
              <ExportActions payload={exportPayload} />
            </View>
          </View>
        </View>
      </CalculatorScrollView>
    </GlossyBackground>
  );
}

const styles = createResponsiveStyles({
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.section,
    [media.mobile]: {
      paddingHorizontal: spacing.md,
    },
  },
  layoutGrid: {
    width: '100%' as const,
    flexDirection: 'column' as const,
    gap: spacing.lg,
    [media.desktopUp]: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
    },
  },
  column: {
    width: '100%' as const,
    minWidth: 0,
    flexShrink: 0,
    [media.desktopUp]: {
      flex: 1,
    },
  },
  section: {
    width: '100%' as const,
    flexShrink: 0,
  },
});
