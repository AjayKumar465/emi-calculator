import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, fontSizes, spacing } from '../../theme';
import { createResponsiveStyles, media } from '../../theme/responsive';
import { Badge } from './Badge';

interface AppHeaderProps {
  title: string;
  titleHighlight?: string;
  subtitle?: string;
}

export function AppHeader({ title, titleHighlight, subtitle }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.xl }]}>
      <Badge dotColor={colors.tealAccent} label="Smart calculator" />
      <Text style={styles.title}>
        {title}
        {titleHighlight ? <Text style={styles.highlight}> {titleHighlight}</Text> : null}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = createResponsiveStyles({
  header: {
    paddingBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.hero,
    color: colors.textPrimary,
    lineHeight: 40,
    [media.mobile]: {
      fontSize: fontSizes.display,
      lineHeight: 34,
    },
  },
  highlight: {
    color: colors.tealAccent,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    maxWidth: 520,
    lineHeight: 24,
    [media.mobile]: {
      fontSize: fontSizes.sm,
    },
  },
});
