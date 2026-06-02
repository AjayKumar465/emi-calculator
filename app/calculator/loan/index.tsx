import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

import { AmortizationChart } from '@/src/components/calculator/AmortizationChart';
import { AmortizationTable } from '@/src/components/calculator/AmortizationTable';
import { PaymentBreakdownChart } from '@/src/components/calculator/PaymentBreakdownChart';
import { LoanCalculatorInputsCard } from '@/src/components/loan/LoanCalculatorInputsCard';
import { LoanModeTabs } from '@/src/components/loan/LoanModeTabs';
import { LoanResultSummary } from '@/src/components/loan/LoanResultSummary';
import { AppHeader } from '@/src/components/ui/AppHeader';
import { CalculatorHubNav } from '@/src/components/ui/CalculatorHubNav';
import { GlossyBackground } from '@/src/components/ui/GlossyBackground';
import { useLoanCalculator } from '@/src/hooks/useLoanCalculator';
import { spacing } from '@/src/theme';
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

  const inputColumn = (
    <>
      <Animated.View entering={FadeInDown.springify().damping(16)} style={styles.section}>
        <LoanModeTabs mode={inputs.mode} onChange={setMode} />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(80).springify().damping(16)} style={styles.section}>
        <LoanCalculatorInputsCard inputs={inputs} onChange={updateInputs} />
      </Animated.View>
    </>
  );

  const resultsColumn = (
    <>
      <Animated.View entering={FadeInDown.delay(120).springify().damping(16)} style={styles.section}>
        <LoanResultSummary
          items={formattedSummary}
          loanPaidPercent={loanPaidPercent}
          modeLabel={modeLabel}
        />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(160).springify().damping(16)} style={styles.section}>
        <PaymentBreakdownChart
          segments={result.donutSegments}
          lifetimeCostLabel={formattedLifetimeCost}
        />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(200).springify().damping(16)} style={styles.section}>
        <AmortizationChart data={result.chartData} />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(240).springify().damping(16)} style={styles.section}>
        <AmortizationTable years={result.amortizationYears} />
      </Animated.View>
    </>
  );

  return (
    <GlossyBackground>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          title="Loan"
          titleHighlight="Suite"
          subtitle="Four calculators in one — EMI, affordability, tenure, and hidden interest rate with APR and what-if prepayments."
        />
        <CalculatorHubNav active="loan-suite" />
        <View style={styles.layoutGrid}>
          <View style={styles.column}>{inputColumn}</View>
          <View style={styles.column}>{resultsColumn}</View>
        </View>
      </ScrollView>
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
