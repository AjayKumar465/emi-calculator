import { FutureCostCalculatorInputs } from '../../types/futureCostCalculator';
import { Card } from '../ui/Card';
import { FormRow } from '../ui/FormRow';
import { NumericInputField } from '../ui/NumericInputField';
import { SectionHeader } from '../ui/SectionHeader';

interface FutureCostInputsCardProps {
  inputs: FutureCostCalculatorInputs;
  onChange: (patch: Partial<FutureCostCalculatorInputs>) => void;
}

export function FutureCostInputsCard({ inputs, onChange }: FutureCostInputsCardProps) {
  return (
    <Card>
      <SectionHeader
        title="Expense Projection"
        subtitle="See how inflation impacts your future expenses"
      />
      <FormRow>
        <NumericInputField
          label="Current Monthly Expenses"
          prefix="₹"
          value={inputs.currentMonthlyExpenses}
          onChangeValue={(currentMonthlyExpenses) => onChange({ currentMonthlyExpenses })}
        />
        <NumericInputField
          fractionDigits={2}
          label="Annual Inflation Rate"
          suffix="%"
          value={inputs.annualInflationRate}
          onChangeValue={(annualInflationRate) => onChange({ annualInflationRate })}
        />
      </FormRow>
      <FormRow>
        <NumericInputField
          allowDecimal={false}
          fractionDigits={0}
          label="Target Year"
          value={inputs.targetYear}
          onChangeValue={(targetYear) => onChange({ targetYear })}
        />
      </FormRow>
      <FormRow>
        <NumericInputField
          allowDecimal={false}
          fractionDigits={0}
          label="Current Age"
          suffix="Years"
          value={inputs.currentAge}
          onChangeValue={(currentAge) => onChange({ currentAge })}
        />
        <NumericInputField
          allowDecimal={false}
          fractionDigits={0}
          label="Retirement Age"
          suffix="Years"
          helperText="For reference — expenses projected to target year regardless"
          value={inputs.retirementAge}
          onChangeValue={(retirementAge) => onChange({ retirementAge })}
        />
      </FormRow>
    </Card>
  );
}
