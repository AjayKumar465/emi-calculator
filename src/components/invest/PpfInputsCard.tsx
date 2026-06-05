import { PpfCalculatorInputs } from '../../types/ppfCalculator';
import { Card } from '../ui/Card';
import { FormRow } from '../ui/FormRow';
import { NumericInputField } from '../ui/NumericInputField';
import { SectionHeader } from '../ui/SectionHeader';

interface PpfInputsCardProps {
  inputs: PpfCalculatorInputs;
  onChange: (patch: Partial<PpfCalculatorInputs>) => void;
}

export function PpfInputsCard({ inputs, onChange }: PpfInputsCardProps) {
  return (
    <Card>
      <SectionHeader
        title="PPF Parameters"
        subtitle="Public Provident Fund with annual compounding"
      />
      <FormRow>
        <NumericInputField
          label="Annual Deposit"
          prefix="₹"
          helperText="Max ₹1,50,000 per year under Section 80C"
          value={inputs.annualDeposit}
          onChangeValue={(annualDeposit) => onChange({ annualDeposit })}
        />
        <NumericInputField
          fractionDigits={2}
          label="PPF Interest Rate"
          suffix="% p.a."
          value={inputs.ppfRate}
          onChangeValue={(ppfRate) => onChange({ ppfRate })}
        />
      </FormRow>
      <FormRow>
        <NumericInputField
          allowDecimal={false}
          fractionDigits={0}
          label="Tenure"
          suffix="Years"
          helperText="Minimum 15 years, extendable in 5-year blocks"
          value={inputs.tenureYears}
          onChangeValue={(tenureYears) => onChange({ tenureYears })}
        />
        <NumericInputField
          fractionDigits={2}
          label="Annual Inflation Rate"
          suffix="%"
          value={inputs.annualInflationRate}
          onChangeValue={(annualInflationRate) => onChange({ annualInflationRate })}
        />
      </FormRow>
    </Card>
  );
}
