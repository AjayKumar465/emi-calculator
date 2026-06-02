import { StyleSheet, Text, View } from 'react-native';

import { LoanCalculatorInputs } from '../../types/loanCalculator';
import { LOAN_MODE_TABS } from '../../utils/loanCalculator';
import { Card } from '../ui/Card';
import { DatePicker } from '../ui/DatePicker';
import { FormRow } from '../ui/FormRow';
import { NumericInputField } from '../ui/NumericInputField';
import { SectionHeader } from '../ui/SectionHeader';
import { ToggleGroup } from '../ui/ToggleGroup';
import { colors, fonts, fontSizes, spacing } from '../../theme';

interface LoanCalculatorInputsCardProps {
  inputs: LoanCalculatorInputs;
  onChange: (patch: Partial<LoanCalculatorInputs>) => void;
}

export function LoanCalculatorInputsCard({ inputs, onChange }: LoanCalculatorInputsCardProps) {
  const modeDescription =
    LOAN_MODE_TABS.find((tab) => tab.key === inputs.mode)?.description ?? '';

  const showLoanAmount = inputs.mode !== 'affordability';
  const showTargetEmi = inputs.mode !== 'emi';
  const showInterestRate = inputs.mode !== 'interest';
  const showTenure = inputs.mode === 'emi' || inputs.mode === 'affordability' || inputs.mode === 'interest';
  const showExtraPayment = inputs.mode !== 'interest';

  return (
    <Card>
      <SectionHeader
        title="Loan Parameters"
        subtitle={modeDescription}
      />
      {showLoanAmount ? (
        <FormRow>
          <NumericInputField
            label="Loan Amount"
            prefix="₹"
            value={inputs.loanAmount}
            onChangeValue={(loanAmount) => onChange({ loanAmount })}
          />
        </FormRow>
      ) : null}
      {showTargetEmi ? (
        <FormRow>
          <NumericInputField
            label="Monthly EMI You Can Pay"
            prefix="₹"
            value={inputs.targetEmi}
            onChangeValue={(targetEmi) => onChange({ targetEmi })}
          />
        </FormRow>
      ) : null}
      {showInterestRate ? (
        <FormRow>
          <NumericInputField
            fractionDigits={2}
            label="Annual Interest Rate"
            suffix="%"
            value={inputs.interestRate}
            onChangeValue={(interestRate) => onChange({ interestRate })}
          />
        </FormRow>
      ) : null}
      {showTenure ? (
        <FormRow>
          <View style={styles.toggleField}>
            <NumericInputField
              allowDecimal={inputs.tenureMode === 'years'}
              fractionDigits={inputs.tenureMode === 'years' ? 1 : 0}
              keyboardType="numeric"
              label="Loan Tenure"
              value={inputs.tenure}
              onChangeValue={(tenure) => onChange({ tenure })}
            />
            <ToggleGroup
              options={[
                { label: 'Yr', value: 'years' },
                { label: 'Mo', value: 'months' },
              ]}
              value={inputs.tenureMode}
              onChange={(tenureMode) => onChange({ tenureMode })}
            />
          </View>
        </FormRow>
      ) : null}
      <FormRow>
        <NumericInputField
          label="Fees & Charges"
          prefix="₹"
          helperText="One-time costs included in Loan APR"
          value={inputs.processingFees}
          onChangeValue={(processingFees) => onChange({ processingFees })}
        />
        <DatePicker
          label="EMI Schedule Starts"
          value={inputs.startDate}
          onChange={(startDate) => onChange({ startDate })}
        />
      </FormRow>
      <FormRow>
        <View style={styles.schemeField}>
          <Text style={styles.schemeLabel}>EMI Scheme</Text>
          <ToggleGroup
            options={[
              { label: 'In Arrears', value: 'arrears' },
              { label: 'In Advance', value: 'advance' },
            ]}
            value={inputs.emiScheme}
            onChange={(emiScheme) => onChange({ emiScheme })}
          />
          <Text style={styles.schemeHint}>
            Most home and personal loans use arrears. Some car loans deduct EMI in advance.
          </Text>
        </View>
      </FormRow>
      {showExtraPayment ? (
        <FormRow>
          <NumericInputField
            label="Extra Monthly Payment"
            prefix="₹"
            helperText="What-if: pay more each month to shorten tenure and save interest"
            value={inputs.extraMonthlyPayment}
            onChangeValue={(extraMonthlyPayment) => onChange({ extraMonthlyPayment })}
          />
        </FormRow>
      ) : null}
      <FormRow>
        <NumericInputField
          fractionDigits={2}
          helperText="Used to estimate real cost of future payments in today's money."
          label="Annual Inflation Rate"
          suffix="%"
          value={inputs.annualInflationRate}
          onChangeValue={(annualInflationRate) => onChange({ annualInflationRate })}
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
  schemeField: {
    flex: 1,
    gap: spacing.sm,
  },
  schemeLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  schemeHint: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
