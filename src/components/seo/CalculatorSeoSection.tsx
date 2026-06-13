import { Link, usePathname } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { getFaqForPage } from '../../seo/faq';
import { getPageSeo, getSeoForPath } from '../../seo/metadata';
import { colors, fonts, fontSizes, radii, spacing } from '../../theme';

const FEATURES = [
  {
    title: 'Inflation-Adjusted Results',
    body: 'See nominal and real values so you understand true purchasing power — not just headline numbers.',
  },
  {
    title: 'Year-by-Year Schedules',
    body: 'Full amortization or investment projection tables with principal, interest, and balance breakdown.',
  },
  {
    title: 'Charts & Export',
    body: 'Visual donut and schedule charts. Export PDF or Excel with graphs included — free.',
  },
];

export function CalculatorSeoSection() {
  const pathname = usePathname();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (Platform.OS !== 'web') {
    return null;
  }

  const seo = getSeoForPath(pathname);
  if (!seo || seo.key === 'home') {
    return null;
  }

  const pageKey = seo.key;
  const meta = getPageSeo(pageKey);
  const faq = getFaqForPage(pageKey);

  return (
    <View style={styles.wrap} accessibilityRole="none">
      <Text style={styles.h2} accessibilityRole="header">
        About this {meta.h1} {meta.h1Highlight ?? ''}
      </Text>
      <Text style={styles.lead}>{meta.description}</Text>

      <View style={styles.featureGrid}>
        {FEATURES.map((feature) => (
          <View key={feature.title} style={styles.featureCard}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureBody}>{feature.body}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.h2} accessibilityRole="header">
        Frequently asked questions
      </Text>
      {faq.map((item, index) => {
        const isOpen = openFaq === index;
        return (
          <View key={item.question} style={styles.faqItem}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setOpenFaq(isOpen ? null : index)}
              style={styles.faqQuestion}
            >
              <Text style={styles.faqQuestionText}>{item.question}</Text>
              <Text style={styles.faqToggle}>{isOpen ? '−' : '+'}</Text>
            </Pressable>
            {isOpen ? <Text style={styles.faqAnswer}>{item.answer}</Text> : null}
          </View>
        );
      })}

      <Link href="/" asChild>
        <Pressable style={styles.backLink}>
          <Text style={styles.backLinkText}>← All free calculators</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  h2: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.xl,
    color: colors.textPrimary,
  },
  lead: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  featureGrid: {
    gap: spacing.sm,
  },
  featureCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  featureTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.md,
    color: colors.tealAccent,
  },
  featureBody: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  faqItem: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    gap: spacing.sm,
  },
  faqQuestionText: {
    flex: 1,
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  faqToggle: {
    fontFamily: fonts.monoBold,
    fontSize: fontSizes.lg,
    color: colors.tealAccent,
  },
  faqAnswer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  backLink: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  backLinkText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.tealAccent,
  },
});
