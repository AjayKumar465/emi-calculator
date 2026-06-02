import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

import { AmortizationChart } from '@/src/components/calculator/AmortizationChart';
import { AmortizationTable } from '@/src/components/calculator/AmortizationTable';
import { EMISummaryCard } from '@/src/components/calculator/EMISummaryCard';
import { HomeownerExpensesCard } from '@/src/components/calculator/HomeownerExpensesCard';
import { LoanDetailsCard } from '@/src/components/calculator/LoanDetailsCard';
import { PaymentBreakdownChart } from '@/src/components/calculator/PaymentBreakdownChart';
import { PrepaymentCard } from '@/src/components/calculator/PrepaymentCard';
import { AppHeader } from '@/src/components/ui/AppHeader';
import { CalculatorHubNav } from '@/src/components/ui/CalculatorHubNav';
import { GlossyBackground } from '@/src/components/ui/GlossyBackground';
import { useEMICalculator } from '@/src/hooks/useEMICalculator';
import { spacing } from '@/src/theme';
import { createResponsiveStyles, media } from '@/src/theme/responsive';

export default function CalculatorScreen() {
  const {
    inputs,
    result,
    donutSegments,
    summaryLineItems,
    formattedLifetimeCost,
    updateInputs,
    resetPrepayments,
  } = useEMICalculator();

  const loanPaidPercent =
    result.amortizationYears.length > 0
      ? result.amortizationYears[result.amortizationYears.length - 1].loanPaidPercent
      : 0;

  const inputColumn = (
    <>
      <Animated.View entering={FadeInDown.springify().damping(16)} style={styles.section}>
        <LoanDetailsCard
          loan={inputs.loan}
          netLoanAmount={result.netLoanAmount}
          onChange={(loan) => updateInputs((current) => ({ ...current, loan }))}
        />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(80).springify().damping(16)} style={styles.section}>
        <HomeownerExpensesCard
          expenses={inputs.expenses}
          onChange={(expenses) => updateInputs((current) => ({ ...current, expenses }))}
        />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(120).springify().damping(16)} style={styles.section}>
        <PrepaymentCard
          prepayments={inputs.prepayments}
          onChange={(prepayments) => updateInputs((current) => ({ ...current, prepayments }))}
          onRemove={resetPrepayments}
        />
      </Animated.View>
    </>
  );

  const resultsColumn = (
    <>
      <Animated.View entering={FadeInDown.delay(160).springify().damping(16)} style={styles.section}>
        <EMISummaryCard items={summaryLineItems} loanPaidPercent={loanPaidPercent} />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(200).springify().damping(16)} style={styles.section}>
        <PaymentBreakdownChart
          segments={donutSegments}
          lifetimeCostLabel={formattedLifetimeCost}
        />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(240).springify().damping(16)} style={styles.section}>
        <AmortizationChart data={result.chartData} />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(280).springify().damping(16)} style={styles.section}>
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
          title="Home Loan"
          titleHighlight="EMI Calculator"
          subtitle="Plan repayments with clarity — model prepayments, taxes, and lifetime cost in one glossy view."
        />
        <CalculatorHubNav active="home-loan" />
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
