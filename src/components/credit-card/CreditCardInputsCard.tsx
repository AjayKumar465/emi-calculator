import { CreditCardCalculatorInputs } from '../../types/creditCardCalculator';
import { Card } from '../ui/Card';
import { DatePicker } from '../ui/DatePicker';
import { FormRow } from '../ui/FormRow';
import { NumericInputField } from '../ui/NumericInputField';
import { SectionHeader } from '../ui/SectionHeader';

interface CreditCardInputsCardProps {
  inputs: CreditCardCalculatorInputs;
  onChange: (patch: Partial<CreditCardCalculatorInputs>) => void;
}

export function CreditCardInputsCard({ inputs, onChange }: CreditCardInputsCardProps) {
  return (
    <Card>
      <SectionHeader
        title="Credit Card Loan Details"
        subtitle="Convert a transaction into EMIs with GST on processing fees and interest"
      />
      <FormRow>
        <NumericInputField
          label="Transaction Amount"
          prefix="₹"
          value={inputs.transactionAmount}
          onChangeValue={(transactionAmount) => onChange({ transactionAmount })}
        />
        <NumericInputField
          fractionDigits={2}
          label="Interest Rate"
          suffix="% p.a."
          value={inputs.interestRate}
          onChangeValue={(interestRate) => onChange({ interestRate })}
        />
      </FormRow>
      <FormRow>
        <NumericInputField
          allowDecimal={false}
          fractionDigits={0}
          keyboardType="numeric"
          label="Tenure"
          suffix="Mo"
          value={inputs.tenureMonths}
          onChangeValue={(tenureMonths) => onChange({ tenureMonths })}
        />
        <NumericInputField
          label="Processing Fees (pre-GST)"
          prefix="₹"
          helperText="Typically 1–3% of transaction amount, plus GST"
          value={inputs.processingFeePreGst}
          onChangeValue={(processingFeePreGst) => onChange({ processingFeePreGst })}
        />
      </FormRow>
      <FormRow>
        <NumericInputField
          fractionDigits={0}
          label="GST Rate"
          suffix="%"
          value={inputs.gstRate}
          onChangeValue={(gstRate) => onChange({ gstRate })}
        />
        <DatePicker
          label="EMI Schedule Starts"
          value={inputs.startDate}
          onChange={(startDate) => onChange({ startDate })}
        />
      </FormRow>
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
