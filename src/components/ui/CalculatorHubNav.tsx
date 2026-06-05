import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, Href } from 'expo-router';

import { HorizontalScrollArea } from './HorizontalScrollArea';
import { colors, fonts, fontSizes, radii, spacing } from '../../theme';

interface CalculatorHubNavProps {
  active: 'home-loan' | 'loan-suite' | 'credit-card' | 'sip' | 'ppf' | 'ssy' | 'compounding' | 'future-cost';
}

const TABS: { key: CalculatorHubNavProps['active']; href: Href; label: string }[] = [
  { key: 'home-loan', href: '/calculator', label: 'Home Loan' },
  { key: 'loan-suite', href: '/calculator/loan', label: 'Loan Suite' },
  { key: 'credit-card', href: '/calculator/credit-card', label: 'Credit Card' },
  { key: 'sip', href: '/calculator/invest/sip', label: 'SIP' },
  { key: 'ppf', href: '/calculator/invest/ppf', label: 'PPF' },
  { key: 'ssy', href: '/calculator/invest/ssy', label: 'SSY' },
  { key: 'compounding', href: '/calculator/invest/compounding', label: 'Compounding' },
  { key: 'future-cost', href: '/calculator/invest/future-cost', label: 'Future Cost' },
];

export function CalculatorHubNav({ active }: CalculatorHubNavProps) {
  return (
    <HorizontalScrollArea style={styles.scroll}>
      <View style={styles.row}>
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <Link key={tab.key} href={tab.href} asChild>
              <Pressable style={isActive ? styles.linkActive : styles.link}>
                <Text style={isActive ? styles.linkTextActive : styles.linkText}>{tab.label}</Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </HorizontalScrollArea>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.xs,
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
