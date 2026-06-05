import { useMemo, useState } from 'react';

import { FutureCostCalculatorInputs } from '../types/futureCostCalculator';
import { calculateFutureCost } from '../utils/futureCostCalculator';
import { DEFAULT_FUTURE_COST_INPUTS } from '../utils/futureCostCalculatorConstants';
import { formatCurrency, formatPercent } from '../utils/format';

export function useFutureCostCalculator(
  initialInputs: FutureCostCalculatorInputs = DEFAULT_FUTURE_COST_INPUTS,
) {
  const [inputs, setInputs] = useState<FutureCostCalculatorInputs>(initialInputs);

  const result = useMemo(() => calculateFutureCost(inputs), [inputs]);

  const updateInputs = (patch: Partial<FutureCostCalculatorInputs>) => {
    setInputs((current) => ({ ...current, ...patch }));
  };

  const formattedSummary = useMemo(
    () => [
      { key: 'currentMonthly', label: 'Current Monthly Expenses', value: inputs.currentMonthlyExpenses, displayValue: formatCurrency(inputs.currentMonthlyExpenses) },
      { key: 'currentAnnual', label: 'Current Annual Expenses', value: result.currentAnnualExpenses, displayValue: formatCurrency(result.currentAnnualExpenses) },
      { key: 'targetYear', label: 'Target Year', value: inputs.targetYear, displayValue: String(inputs.targetYear) },
      { key: 'yearsAhead', label: 'Years Ahead', value: result.yearsAhead, displayValue: `${result.yearsAhead} years` },
      { key: 'futureMonthly', label: 'Future Monthly Expenses', value: result.futureMonthlyExpenses, displayValue: formatCurrency(result.futureMonthlyExpenses), emphasized: true },
      { key: 'futureAnnual', label: 'Future Annual Expenses', value: result.futureAnnualExpenses, displayValue: formatCurrency(result.futureAnnualExpenses), emphasized: true },
      { key: 'additionalCost', label: 'Additional Cost (Inflation)', value: result.additionalCostDueToInflation, displayValue: formatCurrency(result.additionalCostDueToInflation) },
      { key: 'purchasingPowerLoss', label: 'Purchasing Power Loss', value: result.purchasingPowerLossPercent, displayValue: formatPercent(result.purchasingPowerLossPercent) },
    ],
    [inputs.currentMonthlyExpenses, inputs.targetYear, result],
  );

  const chartData = useMemo(
    () => result.yearlyData.map((row) => ({
      year: row.year,
      invested: result.currentAnnualExpenses,
      nominalValue: row.annualExpense,
      realValue: result.currentAnnualExpenses,
    })),
    [result],
  );

  const tableHeaders = ['Year', 'Monthly Expense', 'Annual Expense'];
  const tableRows = useMemo(
    () => result.yearlyData.map((row) => [
      row.year,
      formatCurrency(row.monthlyExpense),
      formatCurrency(row.annualExpense),
    ]),
    [result.yearlyData],
  );

  const formattedLifetimeCost = useMemo(
    () => formatCurrency(result.futureAnnualExpenses),
    [result.futureAnnualExpenses],
  );

  return { inputs, result, formattedSummary, chartData, tableHeaders, tableRows, formattedLifetimeCost, updateInputs };
}
