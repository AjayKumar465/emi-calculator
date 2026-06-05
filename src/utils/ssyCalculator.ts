import { DonutSegment } from '../types/calculator';
import { SsyCalculatorInputs, SsyCalculatorResult, SsyYearRow } from '../types/ssyCalculator';
import { roundAmount } from './format';

export function calculateSsy(inputs: SsyCalculatorInputs): SsyCalculatorResult {
  const { annualDeposit, ssyRate, girlAge, annualInflationRate } = inputs;
  const rate = ssyRate / 100;
  const safeInflation = Math.max(0, annualInflationRate);
  const totalYears = Math.max(1, 21 - girlAge);
  const depositYears = Math.min(15, totalYears);
  const yearlyData: SsyYearRow[] = [];
  let balance = 0;
  let totalDeposits = 0;
  const currentYear = new Date().getFullYear();

  for (let yearIndex = 0; yearIndex < totalYears; yearIndex++) {
    const deposit = yearIndex < depositYears ? annualDeposit : 0;
    balance = (balance + deposit) * (1 + rate);
    totalDeposits += deposit;
    const cumulativeInterest = roundAmount(balance - totalDeposits);
    const realBalance = roundAmount(balance / Math.pow(1 + safeInflation / 100, yearIndex + 1));

    yearlyData.push({
      year: currentYear + yearIndex + 1,
      girlAge: girlAge + yearIndex + 1,
      deposit: roundAmount(deposit),
      interest: cumulativeInterest,
      balance: roundAmount(balance),
      realBalance,
    });
  }

  const maturityValue = roundAmount(balance);
  totalDeposits = roundAmount(totalDeposits);
  const totalInterest = roundAmount(maturityValue - totalDeposits);
  const realMaturityValue = roundAmount(maturityValue / Math.pow(1 + safeInflation / 100, totalYears));
  const inflationErosion = roundAmount(maturityValue - realMaturityValue);
  const maturityYear = currentYear + totalYears;

  const donutSegments = ([
    { key: 'deposits' as const, label: 'Total Deposits', value: totalDeposits, color: '#5BC0DE' },
    { key: 'interest' as const, label: 'Interest Earned', value: Math.max(0, totalInterest), color: '#ffb347' },
    { key: 'inflationErosion' as const, label: 'Inflation Erosion', value: Math.max(0, inflationErosion), color: '#ff6b6b' },
  ] satisfies DonutSegment[]).filter((s) => s.value > 0);

  return { totalDeposits, totalInterest, maturityValue, realMaturityValue, inflationErosion, maturityYear, depositYears, totalYears, yearlyData, donutSegments };
}
