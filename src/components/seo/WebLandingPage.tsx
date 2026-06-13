import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SeoHead } from './SeoHead';
import { getFaqForPage } from '../../seo/faq';
import { getAllCalculatorPages, getPageSeo } from '../../seo/metadata';
import { colors, fonts, fontSizes, radii, spacing } from '../../theme';
import { GlossyBackground } from '../ui/GlossyBackground';

const STATS = [
  { value: '8+', label: 'Free calculators' },
  { value: '100%', label: 'Free to use' },
  { value: 'PDF', label: '& Excel export' },
  { value: 'Real', label: 'Inflation-adjusted' },
];

const STEPS = [
  {
    step: '01',
    title: 'Pick a calculator',
    body: 'Home loan EMI, personal loan, credit card EMI with GST, SIP, PPF, SSY, compounding, or future cost planner.',
  },
  {
    step: '02',
    title: 'Enter your numbers',
    body: 'Loan amount, rate, tenure, or investment parameters. Toggle inflation to see real purchasing power.',
  },
  {
    step: '03',
    title: 'Review & export',
    body: 'Charts, year-by-year tables, and one-tap PDF or Excel download with graphs included.',
  },
];

const HIGHLIGHTS = [
  'Inflation-adjusted real cost on every calculator',
  'Home loan with prepayment, tax, insurance & property appreciation',
  'Credit card EMI with GST on fees and interest',
  'SIP step-up, PPF, SSY & compound interest projections',
  'Export PDF and Excel with donut & schedule charts',
  'No signup. No data stored. Runs locally.',
];

export function WebLandingPage() {
  const meta = getPageSeo('home');
  const faq = getFaqForPage('home');
  const calculators = getAllCalculatorPages();

  return (
    <GlossyBackground>
      <SeoHead meta={meta} faq={faq} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Free · No signup · Export included</Text>
          </View>

          <Text style={styles.h1} accessibilityRole="header">
            {meta.h1}{' '}
            <Text style={styles.h1Highlight}>{meta.h1Highlight}</Text>
          </Text>
          <Text style={styles.heroSubtitle}>{meta.heroSubtitle}</Text>

          <Link href="/calculator" asChild>
            <Pressable style={styles.ctaPrimary}>
              <Text style={styles.ctaPrimaryText}>Start with Home Loan EMI</Text>
            </Pressable>
          </Link>
          <Link href="/calculator/invest/sip" asChild>
            <Pressable style={styles.ctaGhost}>
              <Text style={styles.ctaGhostText}>Try SIP Calculator →</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.statsRow}>
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle} accessibilityRole="header">
          Free calculators
        </Text>
        <Text style={styles.sectionSubtitle}>
          One hub for loans and investments — built for India with inflation in mind.
        </Text>
        <View style={styles.calcGrid}>
          {calculators.map((calc) => (
            <Link key={calc.key} href={calc.path as '/'} asChild>
              <Pressable style={styles.calcCard}>
                <Text style={styles.calcTitle}>
                  {calc.h1} {calc.h1Highlight ?? ''}
                </Text>
                <Text style={styles.calcDesc} numberOfLines={3}>
                  {calc.description}
                </Text>
                <Text style={styles.calcLink}>Open calculator →</Text>
              </Pressable>
            </Link>
          ))}
        </View>

        <Text style={styles.sectionTitle} accessibilityRole="header">
          3 steps. Instant clarity.
        </Text>
        <View style={styles.steps}>
          {STEPS.map((step) => (
            <View key={step.step} style={styles.stepCard}>
              <Text style={styles.stepNum}>{step.step}</Text>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepBody}>{step.body}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle} accessibilityRole="header">
          Why choose this over other EMI sites?
        </Text>
        <View style={styles.highlightList}>
          {HIGHLIGHTS.map((item) => (
            <View key={item} style={styles.highlightRow}>
              <Text style={styles.highlightBullet}>✓</Text>
              <Text style={styles.highlightText}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle} accessibilityRole="header">
          Common questions
        </Text>
        <View style={styles.faqList}>
          {faq.map((item) => (
            <View key={item.question} style={styles.faqCard}>
              <Text style={styles.faqQ}>{item.question}</Text>
              <Text style={styles.faqA}>{item.answer}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerCta}>
          <Text style={styles.footerCtaTitle}>Ready to plan smarter?</Text>
          <Text style={styles.footerCtaBody}>
            Join thousands of Indians using free calculators with real inflation math — not just basic EMI.
          </Text>
          <Link href="/calculator" asChild>
            <Pressable style={styles.ctaPrimary}>
              <Text style={styles.ctaPrimaryText}>Open Home Loan Calculator</Text>
            </Pressable>
          </Link>
        </View>

        <Text style={styles.footerNote}>
          © {new Date().getFullYear()} EMI Calculator · Free financial calculators for India
        </Text>
      </ScrollView>
    </GlossyBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
    gap: spacing.lg,
  },
  hero: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  badgeText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  h1: {
    fontFamily: fonts.bodyBold,
    fontSize: 42,
    lineHeight: 48,
    color: colors.textPrimary,
  },
  h1Highlight: {
    color: colors.tealAccent,
  },
  heroSubtitle: {
    fontFamily: fonts.body,
    fontSize: fontSizes.lg,
    lineHeight: 28,
    color: colors.textSecondary,
    maxWidth: 640,
  },
  ctaPrimary: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tealAccent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    marginTop: spacing.sm,
  },
  ctaPrimaryText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: colors.textOnPrimary,
  },
  ctaGhost: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
  },
  ctaGhostText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.tealAccent,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: colors.cardBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  statValue: {
    fontFamily: fonts.monoBold,
    fontSize: fontSizes.xl,
    color: colors.tealAccent,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.xxl,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  sectionSubtitle: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginTop: -spacing.sm,
  },
  calcGrid: {
    gap: spacing.sm,
  },
  calcCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  calcTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.lg,
    color: colors.textPrimary,
  },
  calcDesc: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  calcLink: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.tealAccent,
  },
  steps: {
    gap: spacing.sm,
  },
  stepCard: {
    backgroundColor: colors.cardBackgroundElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  stepNum: {
    fontFamily: fonts.monoBold,
    fontSize: fontSizes.sm,
    color: colors.tealAccent,
  },
  stepTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.lg,
    color: colors.textPrimary,
  },
  stepBody: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  highlightList: {
    gap: spacing.sm,
  },
  highlightRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  highlightBullet: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: colors.tealAccent,
  },
  highlightText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  faqList: {
    gap: spacing.sm,
  },
  faqCard: {
    backgroundColor: colors.inputBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  faqQ: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  faqA: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footerCta: {
    marginTop: spacing.lg,
    backgroundColor: colors.cardBackgroundElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.tealAccent,
    padding: spacing.xl,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  footerCtaTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.xl,
    color: colors.textPrimary,
  },
  footerCtaBody: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footerNote: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
