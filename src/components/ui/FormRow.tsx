import { View } from 'react-native';

import { spacing } from '../../theme';
import { createResponsiveStyles, media } from '../../theme/responsive';

interface RowProps {
  children: React.ReactNode;
}

export function FormRow({ children }: RowProps) {
  return <View style={styles.row}>{children}</View>;
}

const styles = createResponsiveStyles({
  row: {
    flexDirection: 'column' as const,
    gap: spacing.md,
    [media.tabletUp]: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
    },
  },
});
