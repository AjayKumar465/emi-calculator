import { DonutSegment } from '../types/calculator';
import { FutureCostCalculatorInputs, FutureCostCalculatorResult, FutureCostYearRow } from '../types/futureCostCalculator';
import { roundAmount } from './format';

export function calculateFutureCost(inputs: FutureCostCalculatorInputs): FutureCostCalculatorResult {
  const { currentMonthlyExpenses, annualInflationRate, targetYear } = inputs;
  const safeExpenses = Math.max(0, currentMonthlyExpenses);
  const safeInflation = Math.max(0, annualInflationRate);
  const currentYear = new Date().getFullYear();
  const yearsAhead = Math.max(0, Math.floor(targetYear - currentYear));
  const currentAnnualExpenses = roundAmount(safeExpenses * 12);
  const yearlyData: FutureCostYearRow[] = [];

  for (let i = 0; i <= yearsAhead; i++) {
    const monthlyExpense = roundAmount(safeExpenses * Math.pow(1 + safeInflation / 100, i));
    yearlyData.push({
      year: currentYear + i,
      monthlyExpense,
      annualExpense: roundAmount(monthlyExpense * 12),
    });
  }

  const futureMonthlyExpenses = roundAmount(safeExpenses * Math.pow(1 + safeInflation / 100, yearsAhead));
  const futureAnnualExpenses = roundAmount(futureMonthlyExpenses * 12);
  const additionalCostDueToInflation = roundAmount(futureAnnualExpenses - currentAnnualExpenses);
  const purchasingPowerLossPercent = yearsAhead > 0
    ? roundAmount((1 - 1 / Math.pow(1 + safeInflation / 100, yearsAhead)) * 100)
    : 0;

  const donutSegments = ([
    { key: 'todayCost' as const, label: "Today's Annual Cost", value: currentAnnualExpenses, color: '#f472b6' },
    { key: 'futureCost' as const, label: 'Additional Cost (Inflation)', value: Math.max(0, additionalCostDueToInflation), color: '#a78bfa' },
  ] satisfies DonutSegment[]).filter((s) => s.value > 0);

  return {
    yearsAhead,
    futureMonthlyExpenses,
    futureAnnualExpenses,
    currentAnnualExpenses,
    additionalCostDueToInflation,
    purchasingPowerLossPercent,
    yearlyData,
    donutSegments,
  };
}
