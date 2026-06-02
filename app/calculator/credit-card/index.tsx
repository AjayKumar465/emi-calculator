import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CreditCardInputsCard } from '@/src/components/credit-card/CreditCardInputsCard';
import { CreditCardPaymentChart } from '@/src/components/credit-card/CreditCardPaymentChart';
import { AmortizationTable } from '@/src/components/calculator/AmortizationTable';
import { PaymentBreakdownChart } from '@/src/components/calculator/PaymentBreakdownChart';
import { LoanResultSummary } from '@/src/components/loan/LoanResultSummary';
import { AppHeader } from '@/src/components/ui/AppHeader';
import { CalculatorHubNav } from '@/src/components/ui/CalculatorHubNav';
import { ExportActions } from '@/src/components/ui/ExportActions';
import { GlossyBackground } from '@/src/components/ui/GlossyBackground';
import { useCreditCardCalculator } from '@/src/hooks/useCreditCardCalculator';
import { spacing, colors, fonts, fontSizes } from '@/src/theme';
import { buildCreditCardExportPayload } from '@/src/utils/export/buildExportPayloads';
import { createResponsiveStyles, media } from '@/src/theme/responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

export default function CreditCardCalculatorScreen() {
  const {
    inputs,
    result,
    formattedSummary,
    formattedLifetimeCost,
    updateInputs,
  } = useCreditCardCalculator();

  const loanPaidPercent =
    result.amortizationYears.length > 0
      ? result.amortizationYears[result.amortizationYears.length - 1].loanPaidPercent
      : 0;

  const exportPayload = useMemo(
    () => buildCreditCardExportPayload(inputs, result, formattedSummary),
    [inputs, result, formattedSummary],
  );

  const inputColumn = (
    <>
      <Animated.View entering={FadeInDown.springify().damping(16)} style={styles.section}>
        <CreditCardInputsCard inputs={inputs} onChange={updateInputs} />
      </Animated.View>
    </>
  );

  const resultsColumn = (
    <>
      <Animated.View entering={FadeInDown.delay(80).springify().damping(16)} style={styles.section}>
        <LoanResultSummary
          items={formattedSummary}
          loanPaidPercent={loanPaidPercent}
          modeLabel="Credit Card EMI with GST"
        />
        <Text style={footnoteStyles.text}>† APR calculation excludes GST</Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(120).springify().damping(16)} style={styles.section}>
        <PaymentBreakdownChart
          segments={result.donutSegments}
          lifetimeCostLabel={formattedLifetimeCost}
          title="Total of all Payments"
          subtitle="Principal, fees, interest, and GST"
          centerTitle="Total of"
          centerSubtitle="Payments"
        />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(160).springify().damping(16)} style={styles.section}>
        <CreditCardPaymentChart data={result.chartData} />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(200).springify().damping(16)} style={styles.section}>
        <AmortizationTable years={result.amortizationYears} thirdColumnLabel="GST on Interest (C)" />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(240).springify().damping(16)} style={styles.section}>
        <ExportActions payload={exportPayload} />
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
          title="Credit Card"
          titleHighlight="EMI with GST"
          subtitle="Convert card transactions into EMIs — see APR, GST on fees and interest, and the full amortization schedule."
        />
        <CalculatorHubNav active="credit-card" />
        <View style={styles.layoutGrid}>
          <View style={styles.column}>{inputColumn}</View>
          <View style={styles.column}>{resultsColumn}</View>
        </View>
      </ScrollView>
    </GlossyBackground>
  );
}

const footnoteStyles = StyleSheet.create({
  text: {
    marginTop: spacing.sm,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
});

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
