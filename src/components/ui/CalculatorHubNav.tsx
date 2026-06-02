import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { colors, fonts, fontSizes, radii, spacing } from '../../theme';

interface CalculatorHubNavProps {
  active: 'home-loan' | 'loan-suite';
}

export function CalculatorHubNav({ active }: CalculatorHubNavProps) {
  const homeLoanActive = active === 'home-loan';
  const loanSuiteActive = active === 'loan-suite';

  return (
    <View style={styles.row}>
      <Link href="/calculator" asChild>
        <Pressable style={homeLoanActive ? styles.linkActive : styles.link}>
          <Text style={homeLoanActive ? styles.linkTextActive : styles.linkText}>Home Loan</Text>
        </Pressable>
      </Link>
      <Link href="/calculator/loan" asChild>
        <Pressable style={loanSuiteActive ? styles.linkActive : styles.link}>
          <Text style={loanSuiteActive ? styles.linkTextActive : styles.linkText}>Loan Suite</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  link: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
  },
  linkActive: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    backgroundColor: colors.tealAccent,
    borderColor: colors.tealAccent,
  },
  linkText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  linkTextActive: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.textOnPrimary,
  },
});
