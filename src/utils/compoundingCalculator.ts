import { DonutSegment } from '../types/calculator';
import { CompoundingCalculatorInputs, CompoundingCalculatorResult, CompoundingYearRow } from '../types/compoundingCalculator';
import { roundAmount } from './format';

function getPeriodsPerYear(frequency: CompoundingCalculatorInputs['compoundingFrequency']): number {
  switch (frequency) {
    case 'monthly': return 12;
    case 'quarterly': return 4;
    case 'half-yearly': return 2;
    case 'yearly': return 1;
  }
}

export function calculateCompounding(inputs: CompoundingCalculatorInputs): CompoundingCalculatorResult {
  const { principalAmount, annualReturnRate, tenureYears, compoundingFrequency, additionalContribution, annualInflationRate } = inputs;
  const periodsPerYear = getPeriodsPerYear(compoundingFrequency);
  const ratePerPeriod = annualReturnRate / 100 / periodsPerYear;
  const safeInflation = Math.max(0, annualInflationRate);
  const totalPeriods = tenureYears * periodsPerYear;
  const yearlyData: CompoundingYearRow[] = [];
  let value = principalAmount;
  let totalContributions = principalAmount;
  const currentYear = new Date().getFullYear();

  for (let period = 1; period <= totalPeriods; period++) {
    if (period > 1) {
      value += additionalContribution;
      totalContributions += additionalContribution;
    }
    value = value * (1 + ratePerPeriod);

    if (period % periodsPerYear === 0) {
      const yearIndex = period / periodsPerYear;
      const realValue = roundAmount(value / Math.pow(1 + safeInflation / 100, yearIndex));
      yearlyData.push({
        year: currentYear + yearIndex,
        contributions: yearIndex === 1
          ? roundAmount(principalAmount + additionalContribution * (periodsPerYear - 1))
          : roundAmount(additionalContribution * periodsPerYear),
        cumulativeContributions: roundAmount(totalContributions),
        nominalValue: roundAmount(value),
        realValue,
      });
    }
  }

  const nominalMaturityValue = roundAmount(value);
  totalContributions = roundAmount(totalContributions);
  const nominalReturns = roundAmount(nominalMaturityValue - totalContributions);
  const realMaturityValue = roundAmount(nominalMaturityValue / Math.pow(1 + safeInflation / 100, tenureYears));
  const inflationErosion = roundAmount(nominalMaturityValue - realMaturityValue);

  const donutSegments = ([
    { key: 'invested' as const, label: 'Total Contributions', value: totalContributions, color: '#2ec4b6' },
    { key: 'returns' as const, label: 'Returns', value: Math.max(0, nominalReturns), color: '#4ade80' },
    { key: 'inflationErosion' as const, label: 'Inflation Erosion', value: Math.max(0, inflationErosion), color: '#ff6b6b' },
  ] satisfies DonutSegment[]).filter((s) => s.value > 0);

  return { totalContributions, nominalMaturityValue, nominalReturns, realMaturityValue, inflationErosion, yearlyData, donutSegments };
}
