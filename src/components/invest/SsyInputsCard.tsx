import { SsyCalculatorInputs } from '../../types/ssyCalculator';
import { Card } from '../ui/Card';
import { FormRow } from '../ui/FormRow';
import { NumericInputField } from '../ui/NumericInputField';
import { SectionHeader } from '../ui/SectionHeader';

interface SsyInputsCardProps {
  inputs: SsyCalculatorInputs;
  onChange: (patch: Partial<SsyCalculatorInputs>) => void;
}

export function SsyInputsCard({ inputs, onChange }: SsyInputsCardProps) {
  return (
    <Card>
      <SectionHeader
        title="SSY Parameters"
        subtitle="Sukanya Samriddhi Yojana with guaranteed returns"
      />
      <FormRow>
        <NumericInputField
          label="Annual Deposit"
          prefix="₹"
          helperText="Min ₹250, max ₹1,50,000 per year"
          value={inputs.annualDeposit}
          onChangeValue={(annualDeposit) => onChange({ annualDeposit })}
        />
        <NumericInputField
          fractionDigits={2}
          label="SSY Interest Rate"
          suffix="% p.a."
          value={inputs.ssyRate}
          onChangeValue={(ssyRate) => onChange({ ssyRate })}
        />
      </FormRow>
      <FormRow>
        <NumericInputField
          allowDecimal={false}
          fractionDigits={0}
          label="Girl's Current Age"
          suffix="Years"
          helperText="Account matures when girl turns 21"
          value={inputs.girlAge}
          onChangeValue={(girlAge) => onChange({ girlAge })}
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
