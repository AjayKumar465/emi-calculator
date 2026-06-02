import { StyleSheet, View } from 'react-native';

import { HomeownerExpenses } from '../../types/calculator';
import { spacing } from '../../theme';
import { Card } from '../ui/Card';
import { FormRow } from '../ui/FormRow';
import { NumericInputField } from '../ui/NumericInputField';
import { SectionHeader } from '../ui/SectionHeader';
import { ToggleGroup } from '../ui/ToggleGroup';

interface HomeownerExpensesCardProps {
  expenses: HomeownerExpenses;
  onChange: (expenses: HomeownerExpenses) => void;
}

export function HomeownerExpensesCard({ expenses, onChange }: HomeownerExpensesCardProps) {
  const update = (patch: Partial<HomeownerExpenses>) => {
    onChange({ ...expenses, ...patch });
  };

  const upfrontFractionDigits = expenses.upfrontCostsMode === 'percent' ? 2 : 0;

  return (
    <Card>
      <SectionHeader
        title="Homeowner Expenses"
        subtitle="Ongoing and upfront costs beyond EMI"
      />
      <FormRow>
        <View style={styles.toggleField}>
          <NumericInputField
            fractionDigits={upfrontFractionDigits}
            label="Upfront Costs"
            suffix={expenses.upfrontCostsMode === 'percent' ? '%' : '₹'}
            value={expenses.upfrontCosts}
            onChangeValue={(upfrontCosts) => update({ upfrontCosts })}
          />
          <ToggleGroup
            options={[
              { label: '%', value: 'percent' },
              { label: '₹', value: 'amount' },
            ]}
            value={expenses.upfrontCostsMode}
            onChange={(upfrontCostsMode) => update({ upfrontCostsMode })}
          />
        </View>
        <NumericInputField
          label="Annual Property Tax"
          prefix="₹"
          value={expenses.annualPropertyTax}
          onChangeValue={(annualPropertyTax) => update({ annualPropertyTax })}
        />
      </FormRow>
      <FormRow>
        <NumericInputField
          label="Annual Home Insurance"
          prefix="₹"
          value={expenses.annualHomeInsurance}
          onChangeValue={(annualHomeInsurance) => update({ annualHomeInsurance })}
        />
        <NumericInputField
          label="Monthly Maintenance"
          prefix="₹"
          value={expenses.monthlyMaintenance}
          onChangeValue={(monthlyMaintenance) => update({ monthlyMaintenance })}
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
