import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, fonts, fontSizes, radii, shadows, spacing } from '../../theme';

type ButtonVariant = 'primary' | 'ghost' | 'destructive';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        variant === 'primary' && shadows.glow,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, styles[`${variant}Label` as const]]}>
        {label}
        {variant === 'primary' ? '  ›' : ''}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.tealAccent,
  },
  ghost: {
    backgroundColor: colors.ghostOnDark,
    borderWidth: 1,
    borderColor: colors.border,
  },
  destructive: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderWidth: 1,
    borderColor: colors.destructive,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.md,
  },
  primaryLabel: {
    color: colors.textOnPrimary,
  },
  ghostLabel: {
    color: colors.textPrimary,
  },
  destructiveLabel: {
    color: colors.destructive,
  },
});
