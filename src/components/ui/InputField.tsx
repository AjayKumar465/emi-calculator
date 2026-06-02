import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fonts, fontSizes, radii, spacing } from '../../theme';
import { createResponsiveStyles, media } from '../../theme/responsive';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  suffix?: string;
  prefix?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  editable?: boolean;
  helperText?: string;
}

export function InputField({
  label,
  value,
  onChangeText,
  suffix,
  prefix,
  keyboardType = 'numeric',
  editable = true,
  helperText,
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, !editable && styles.readOnly]}>
        {prefix ? <Text style={styles.affix}>{prefix}</Text> : null}
        <TextInput
          editable={editable}
          keyboardType={keyboardType}
          onChangeText={onChangeText ?? (() => undefined)}
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.tealAccent}
          style={styles.input}
          value={value}
        />
        {suffix ? <Text style={styles.affix}>{suffix}</Text> : null}
      </View>
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
}

const styles = createResponsiveStyles({
  container: {
    flex: 1,
    minWidth: '100%',
    marginBottom: spacing.md,
    [media.tabletUp]: {
      minWidth: 140,
    },
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  readOnly: {
    backgroundColor: colors.inputBackgroundReadOnly,
    borderColor: colors.borderSubtle,
  },
  input: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  affix: {
    fontFamily: fonts.monoMedium,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    marginHorizontal: spacing.xs,
  },
  helper: {
    marginTop: spacing.xs,
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
});
