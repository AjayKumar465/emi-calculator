import { SipCalculatorInputs } from '../../types/sipCalculator';
import { Card } from '../ui/Card';
import { FormRow } from '../ui/FormRow';
import { NumericInputField } from '../ui/NumericInputField';
import { SectionHeader } from '../ui/SectionHeader';

interface SipInputsCardProps {
  inputs: SipCalculatorInputs;
  onChange: (patch: Partial<SipCalculatorInputs>) => void;
}

export function SipInputsCard({ inputs, onChange }: SipInputsCardProps) {
  return (
    <Card>
      <SectionHeader
        title="SIP Parameters"
        subtitle="Systematic Investment Plan with optional annual step-up"
      />
      <FormRow>
        <NumericInputField
          label="Monthly SIP Amount"
          prefix="₹"
          value={inputs.monthlyInvestment}
          onChangeValue={(monthlyInvestment) => onChange({ monthlyInvestment })}
        />
        <NumericInputField
          fractionDigits={2}
          label="Expected Return Rate"
          suffix="% p.a."
          value={inputs.expectedReturnRate}
          onChangeValue={(expectedReturnRate) => onChange({ expectedReturnRate })}
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
          fractionDigits={2}
          label="Annual Step-Up"
          suffix="% p.a."
          helperText="Increase SIP amount by this % each year"
          value={inputs.annualStepUpRate}
          onChangeValue={(annualStepUpRate) => onChange({ annualStepUpRate })}
        />
      </FormRow>
      <FormRow>
        <NumericInputField
          fractionDigits={2}
          label="Annual Inflation Rate"
          suffix="%"
          helperText="Used to estimate real value of future corpus in today's money"
          value={inputs.annualInflationRate}
          onChangeValue={(annualInflationRate) => onChange({ annualInflationRate })}
        />
      </FormRow>
    </Card>
  );
}
