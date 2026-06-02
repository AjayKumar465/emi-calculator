import { StyleSheet, View } from 'react-native';

import { spacing } from '../../theme';
import { LoanDetails } from '../../types/calculator';
import { Card } from '../ui/Card';
import { DatePicker } from '../ui/DatePicker';
import { FormRow } from '../ui/FormRow';
import { NumericInputField } from '../ui/NumericInputField';
import { SectionHeader } from '../ui/SectionHeader';
import { ToggleGroup } from '../ui/ToggleGroup';

interface LoanDetailsCardProps {
  loan: LoanDetails;
  netLoanAmount: number;
  annualInflationRate: number;
  annualPropertyAppreciationRate: number;
  onChange: (loan: LoanDetails) => void;
  onInflationRateChange: (annualInflationRate: number) => void;
  onPropertyAppreciationRateChange: (annualPropertyAppreciationRate: number) => void;
}

export function LoanDetailsCard({
  loan,
  netLoanAmount,
  annualInflationRate,
  annualPropertyAppreciationRate,
  onChange,
  onInflationRateChange,
  onPropertyAppreciationRateChange,
}: LoanDetailsCardProps) {
  const update = (patch: Partial<LoanDetails>) => {
    onChange({ ...loan, ...patch });
  };

  const downPaymentFractionDigits = loan.downPaymentMode === 'percent' ? 2 : 0;

  return (
    <Card>
      <SectionHeader title="Loan Details" subtitle="Configure your home loan parameters" />
      <FormRow>
        <NumericInputField
          label="Property Value"
          prefix="₹"
          value={loan.propertyValue}
          onChangeValue={(propertyValue) => update({ propertyValue })}
        />
        <View style={styles.toggleField}>
          <NumericInputField
            fractionDigits={downPaymentFractionDigits}
            label="Down Payment"
            suffix={loan.downPaymentMode === 'percent' ? '%' : '₹'}
            value={loan.downPayment}
            onChangeValue={(downPayment) => update({ downPayment })}
          />
          <ToggleGroup
            options={[
              { label: '%', value: 'percent' },
              { label: '₹', value: 'amount' },
            ]}
            value={loan.downPaymentMode}
            onChange={(downPaymentMode) => update({ downPaymentMode })}
          />
        </View>
      </FormRow>
      <FormRow>
        <NumericInputField
          label="Loan Protection"
          prefix="₹"
          value={loan.loanProtection}
          onChangeValue={(loanProtection) => update({ loanProtection })}
        />
        <NumericInputField
          editable={false}
          helperText="Auto-calculated from property value and down payment"
          label="Net Loan Amount"
          prefix="₹"
          value={netLoanAmount}
        />
      </FormRow>
      <FormRow>
        <NumericInputField
          fractionDigits={2}
          label="Annual Interest Rate"
          suffix="%"
          value={loan.interestRate}
          onChangeValue={(interestRate) => update({ interestRate })}
        />
        <View style={styles.toggleField}>
          <NumericInputField
            allowDecimal={false}
            fractionDigits={0}
            keyboardType="numeric"
            label="Home Loan Tenure"
            value={loan.tenure}
            onChangeValue={(tenure) => update({ tenure })}
          />
          <ToggleGroup
            options={[
              { label: 'Yr', value: 'years' },
              { label: 'Mo', value: 'months' },
            ]}
            value={loan.tenureMode}
            onChange={(tenureMode) => update({ tenureMode })}
          />
        </View>
      </FormRow>
      <FormRow>
        <NumericInputField
          label="Processing Fees"
          prefix="₹"
          value={loan.processingFees}
          onChangeValue={(processingFees) => update({ processingFees })}
        />
        <DatePicker
          label="Loan Start Date"
          value={loan.startDate}
          onChange={(startDate) => update({ startDate })}
        />
      </FormRow>
      <FormRow>
        <NumericInputField
          fractionDigits={2}
          helperText="Used to estimate real cost of future payments in today's money."
          label="Annual Inflation Rate"
          suffix="%"
          value={annualInflationRate}
          onChangeValue={onInflationRateChange}
        />
        <NumericInputField
          fractionDigits={2}
          helperText="Expected annual increase in property value (% per year)."
          label="Property Appreciation Rate"
          suffix="% p.a."
          value={annualPropertyAppreciationRate}
          onChangeValue={onPropertyAppreciationRateChange}
        />
      </FormRow>
    </Card>
  );
}

const styles = StyleSheet.create({
  toggleField: {
    flex: 1,
    minWidth: 180,
    gap: spacing.sm,
  },
});
