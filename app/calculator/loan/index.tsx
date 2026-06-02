import { useMemo } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { AmortizationChart } from '@/src/components/calculator/AmortizationChart';
import { AmortizationTable } from '@/src/components/calculator/AmortizationTable';
import { PaymentBreakdownChart } from '@/src/components/calculator/PaymentBreakdownChart';
import { LoanCalculatorInputsCard } from '@/src/components/loan/LoanCalculatorInputsCard';
import { LoanModeTabs } from '@/src/components/loan/LoanModeTabs';
import { LoanResultSummary } from '@/src/components/loan/LoanResultSummary';
import { AppHeader } from '@/src/components/ui/AppHeader';
import { CalculatorHubNav } from '@/src/components/ui/CalculatorHubNav';
import { CalculatorScrollView } from '@/src/components/ui/CalculatorScrollView';
import { ExportActions } from '@/src/components/ui/ExportActions';
import { GlossyBackground } from '@/src/components/ui/GlossyBackground';
import { useLoanCalculator } from '@/src/hooks/useLoanCalculator';
import { spacing } from '@/src/theme';
import { buildLoanSuiteExportPayload } from '@/src/utils/export/buildExportPayloads';
import { LOAN_MODE_TABS } from '@/src/utils/loanCalculator';
import { createResponsiveStyles, media } from '@/src/theme/responsive';

export default function LoanCalculatorScreen() {
  const {
    inputs,
    result,
    formattedSummary,
    formattedLifetimeCost,
    updateInputs,
    setMode,
  } = useLoanCalculator();

  const modeLabel =
    LOAN_MODE_TABS.find((tab) => tab.key === inputs.mode)?.label ?? 'Loan Calculator';

  const loanPaidPercent =
    result.amortizationYears.length > 0
      ? result.amortizationYears[result.amortizationYears.length - 1].loanPaidPercent
      : 0;

  const exportPayload = useMemo(
    () => buildLoanSuiteExportPayload(inputs, result, formattedSummary),
    [inputs, result, formattedSummary],
  );

  return (
    <GlossyBackground>
      <StatusBar style="light" />
      <CalculatorScrollView contentContainerStyle={styles.scrollContent}>
        <AppHeader
          title="Loan"
          titleHighlight="Suite"
          subtitle="Four calculators in one — EMI, affordability, tenure, and hidden interest rate with APR and what-if prepayments."
        />
        <CalculatorHubNav active="loan-suite" />
        <View style={styles.layoutGrid}>
          <View style={styles.column}>
            <View style={styles.section}>
              <LoanModeTabs mode={inputs.mode} onChange={setMode} />
            </View>
            <View style={styles.section}>
              <LoanCalculatorInputsCard inputs={inputs} onChange={updateInputs} />
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.section}>
              <LoanResultSummary
                items={formattedSummary}
                loanPaidPercent={loanPaidPercent}
                modeLabel={modeLabel}
              />
            </View>
            <View style={styles.section}>
              <PaymentBreakdownChart
                segments={result.donutSegments}
                lifetimeCostLabel={formattedLifetimeCost}
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
