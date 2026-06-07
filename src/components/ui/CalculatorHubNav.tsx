import { useCallback, useEffect, useRef } from 'react';
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Link, Href } from 'expo-router';

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
  const scrollRef = useRef<ScrollView>(null);
  const containerWidth = useRef(0);
  const tabLayouts = useRef<Record<string, { x: number; width: number }>>({});
  const hasScrolled = useRef(false);

  const scrollActiveIntoView = useCallback(() => {
    const layout = tabLayouts.current[active];
    if (!layout || !scrollRef.current) return;

    const centerOffset = layout.x - containerWidth.current / 2 + layout.width / 2;
    scrollRef.current.scrollTo({ x: Math.max(0, centerOffset), animated: hasScrolled.current });
    hasScrolled.current = true;
  }, [active]);

  useEffect(() => {
    const timer = setTimeout(scrollActiveIntoView, 50);
    return () => clearTimeout(timer);
  }, [scrollActiveIntoView]);

  const onContainerLayout = useCallback((e: LayoutChangeEvent) => {
    containerWidth.current = e.nativeEvent.layout.width;
  }, []);

  const createTabLayoutHandler = useCallback(
    (key: string) => (e: LayoutChangeEvent) => {
      tabLayouts.current[key] = {
        x: e.nativeEvent.layout.x,
        width: e.nativeEvent.layout.width,
      };
    },
    [],
  );

  if (Platform.OS === 'web') {
    return (
      <View style={[webStyles.scroll, styles.scroll]} onLayout={onContainerLayout}>
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
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      directionalLockEnabled
      horizontal
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      onLayout={onContainerLayout}
    >
      <View style={styles.row}>
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <View key={tab.key} onLayout={createTabLayoutHandler(tab.key)}>
              <Link href={tab.href} asChild>
                <Pressable style={isActive ? styles.linkActive : styles.link}>
                  <Text style={isActive ? styles.linkTextActive : styles.linkText}>{tab.label}</Text>
                </Pressable>
              </Link>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const webStyles = StyleSheet.create({
  scroll: {
    maxWidth: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    overscrollBehaviorX: 'contain',
    WebkitOverflowScrolling: 'touch',
  } as ViewStyle,
});

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
