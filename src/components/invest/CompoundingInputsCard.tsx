import { StyleSheet, Text, View } from 'react-native';

import { CompoundingCalculatorInputs, CompoundingFrequency } from '../../types/compoundingCalculator';
import { Card } from '../ui/Card';
import { FormRow } from '../ui/FormRow';
import { NumericInputField } from '../ui/NumericInputField';
import { SectionHeader } from '../ui/SectionHeader';
import { ToggleGroup } from '../ui/ToggleGroup';
import { colors, fonts, fontSizes, spacing } from '../../theme';

interface CompoundingInputsCardProps {
  inputs: CompoundingCalculatorInputs;
  onChange: (patch: Partial<CompoundingCalculatorInputs>) => void;
}

export function CompoundingInputsCard({ inputs, onChange }: CompoundingInputsCardProps) {
  return (
    <Card>
      <SectionHeader
        title="Compounding Parameters"
        subtitle="Configure principal, contributions, and compounding frequency"
      />
      <FormRow>
        <NumericInputField
          label="Principal Amount"
          prefix="₹"
          value={inputs.principalAmount}
          onChangeValue={(principalAmount) => onChange({ principalAmount })}
        />
        <NumericInputField
          fractionDigits={2}
          label="Annual Return Rate"
          suffix="% p.a."
          value={inputs.annualReturnRate}
          onChangeValue={(annualReturnRate) => onChange({ annualReturnRate })}
        />
      </FormRow>
      <FormRow>
        <NumericInputField
          allowDecimal={false}
          fractionDigits={0}
          label="Investment Period"
          suffix="Years"
          value={inputs.tenureYears}
          onChangeValue={(tenureYears) => onChange({ tenureYears })}
        />
        <NumericInputField
          label="Additional Contribution"
          prefix="₹"
          helperText="Added each compounding period"
          value={inputs.additionalContribution}
          onChangeValue={(additionalContribution) => onChange({ additionalContribution })}
        />
      </FormRow>
      <FormRow>
        <View style={styles.frequencyField}>
          <Text style={styles.frequencyLabel}>Compounding Frequency</Text>
          <ToggleGroup
            options={[
              { label: 'Monthly', value: 'monthly' },
              { label: 'Quarterly', value: 'quarterly' },
              { label: 'Half-Yearly', value: 'half-yearly' },
              { label: 'Yearly', value: 'yearly' },
            ]}
            value={inputs.compoundingFrequency}
            onChange={(compoundingFrequency) => onChange({ compoundingFrequency: compoundingFrequency as CompoundingFrequency })}
          />
        </View>
      </FormRow>
      <FormRow>
        <NumericInputField
          fractionDigits={2}
          label="Annual Inflation Rate"
          suffix="%"
          helperText="Used to estimate real value in today's money"
          value={inputs.annualInflationRate}
          onChangeValue={(annualInflationRate) => onChange({ annualInflationRate })}
        />
      </FormRow>
    </Card>
  );
}

const styles = StyleSheet.create({
  frequencyField: {
    flex: 1,
    gap: spacing.sm,
  },
  frequencyLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
});
