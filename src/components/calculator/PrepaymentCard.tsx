import { StyleSheet, Text, View } from 'react-native';

import { PrepaymentEntry, Prepayments } from '../../types/calculator';
import { colors, fonts, fontSizes, radii, spacing } from '../../theme';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { DatePicker } from '../ui/DatePicker';
import { FormRow } from '../ui/FormRow';
import { NumericInputField } from '../ui/NumericInputField';
import { SectionHeader } from '../ui/SectionHeader';

interface PrepaymentCardProps {
  prepayments: Prepayments;
  onChange: (prepayments: Prepayments) => void;
  onRemove: () => void;
}

const PREPAYMENT_FIELDS: Array<{
  key: keyof Prepayments;
  label: string;
}> = [
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
  { key: 'quarterly', label: 'Quarterly' },
  { key: 'oneTime', label: 'One-time' },
];

export function PrepaymentCard({ prepayments, onChange, onRemove }: PrepaymentCardProps) {
  const updateEntry = (key: keyof Prepayments, patch: Partial<PrepaymentEntry>) => {
    onChange({
      ...prepayments,
      [key]: {
        ...prepayments[key],
        ...patch,
      },
    });
  };

  return (
    <Card>
      <SectionHeader
        title="Early Repayments"
        subtitle="Model partial prepayments to reduce lifetime interest"
      />
      {PREPAYMENT_FIELDS.map((field) => (
        <View key={field.key} style={styles.block}>
          <Text style={styles.blockTitle}>{field.label}</Text>
          <FormRow>
            <NumericInputField
              label="Amount"
              prefix="₹"
              value={prepayments[field.key].amount}
              onChangeValue={(amount) => updateEntry(field.key, { amount })}
            />
            <DatePicker
              label="Starting From"
              value={prepayments[field.key].startDate}
              onChange={(startDate) => updateEntry(field.key, { startDate })}
            />
          </FormRow>
        </View>
      ))}
      <Button label="Remove Prepayments" onPress={onRemove} variant="destructive" />
    </Card>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    position: 'relative',
    zIndex: 1,
    overflow: 'visible',
  },
  blockTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
});
