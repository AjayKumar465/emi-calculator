import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { formatEditableNumber, sanitizeNumericText } from '../../utils/format';
import { colors, fonts, fontSizes, radii, spacing } from '../../theme';
import { createResponsiveStyles, media } from '../../theme/responsive';

interface NumericInputFieldProps {
  label: string;
  value: number;
  onChangeValue?: (value: number) => void;
  fractionDigits?: number;
  allowDecimal?: boolean;
  suffix?: string;
  prefix?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  editable?: boolean;
  helperText?: string;
}

export function NumericInputField({
  label,
  value,
  onChangeValue,
  fractionDigits = 0,
  allowDecimal = true,
  suffix,
  prefix,
  keyboardType = 'decimal-pad',
  editable = true,
  helperText,
}: NumericInputFieldProps) {
  const [text, setText] = useState(() => formatEditableNumber(value, fractionDigits));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setText(formatEditableNumber(value, fractionDigits));
    }
  }, [value, fractionDigits, focused]);

  const commitText = (raw: string) => {
    const sanitized = sanitizeNumericText(raw, allowDecimal);
    setText(sanitized);

    if (sanitized === '' || sanitized === '.') {
      onChangeValue?.(0);
      return;
    }

    const parsed = Number.parseFloat(sanitized);
    if (Number.isFinite(parsed)) {
      onChangeValue?.(parsed);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, !editable && styles.readOnly]}>
        {prefix ? <Text style={styles.affix}>{prefix}</Text> : null}
        <TextInput
          editable={editable}
          keyboardType={keyboardType}
          onBlur={() => {
            setFocused(false);
            const sanitized = sanitizeNumericText(text, allowDecimal);
            if (sanitized === '' || sanitized === '.') {
              onChangeValue?.(0);
              setText(formatEditableNumber(0, fractionDigits));
              return;
            }

            const parsed = Number.parseFloat(sanitized);
            const nextValue = Number.isFinite(parsed) ? parsed : 0;
            onChangeValue?.(nextValue);
            setText(formatEditableNumber(nextValue, fractionDigits));
          }}
          onChangeText={commitText}
          onFocus={() => {
            setFocused(true);
            if (value === 0) {
              setText('');
              return;
            }

            setText(formatEditableNumber(value, fractionDigits));
          }}
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.tealAccent}
          style={styles.input}
          value={text}
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
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
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
