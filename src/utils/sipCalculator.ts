import { DonutSegment } from '../types/calculator';
import { SipCalculatorInputs, SipCalculatorResult, SipYearRow } from '../types/sipCalculator';
import { roundAmount } from './format';

export function calculateSip(inputs: SipCalculatorInputs): SipCalculatorResult {
  const { monthlyInvestment, expectedReturnRate, tenureYears, annualInflationRate, annualStepUpRate } = inputs;
  const monthlyRate = expectedReturnRate / 12 / 100;
  const safeInflation = Math.max(0, annualInflationRate);
  const yearlyData: SipYearRow[] = [];
  let totalInvested = 0;
  let corpusValue = 0;
  const currentYear = new Date().getFullYear();

  for (let yearIndex = 0; yearIndex < tenureYears; yearIndex++) {
    const monthlySip = roundAmount(monthlyInvestment * Math.pow(1 + annualStepUpRate / 100, yearIndex));
    let yearInvested = 0;

    for (let month = 0; month < 12; month++) {
      corpusValue = (corpusValue + monthlySip) * (1 + monthlyRate);
      yearInvested += monthlySip;
    }

    totalInvested += yearInvested;
    const realValue = roundAmount(corpusValue / Math.pow(1 + safeInflation / 100, yearIndex + 1));

    yearlyData.push({
      year: currentYear + yearIndex + 1,
      yearlyInvestment: roundAmount(yearInvested),
      cumulativeInvested: roundAmount(totalInvested),
      nominalValue: roundAmount(corpusValue),
      realValue,
    });
  }

  const nominalMaturityValue = roundAmount(corpusValue);
  totalInvested = roundAmount(totalInvested);
  const nominalReturns = roundAmount(nominalMaturityValue - totalInvested);
  const realMaturityValue = roundAmount(nominalMaturityValue / Math.pow(1 + safeInflation / 100, tenureYears));
  const inflationErosion = roundAmount(nominalMaturityValue - realMaturityValue);

  const donutSegments = ([
    { key: 'invested' as const, label: 'Total Invested', value: totalInvested, color: '#2ec4b6' },
    { key: 'returns' as const, label: 'Returns', value: Math.max(0, nominalReturns), color: '#4ade80' },
    { key: 'inflationErosion' as const, label: 'Inflation Erosion', value: Math.max(0, inflationErosion), color: '#ff6b6b' },
  ] satisfies DonutSegment[]).filter((s) => s.value > 0);

  return { totalInvested, nominalMaturityValue, nominalReturns, realMaturityValue, inflationErosion, yearlyData, donutSegments };
}
