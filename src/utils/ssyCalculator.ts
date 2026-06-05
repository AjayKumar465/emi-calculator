import { DonutSegment } from '../types/calculator';
import { SsyCalculatorInputs, SsyCalculatorResult, SsyYearRow } from '../types/ssyCalculator';
import { roundAmount } from './format';

export function calculateSsy(inputs: SsyCalculatorInputs): SsyCalculatorResult {
  const { annualDeposit, ssyRate, girlAge, annualInflationRate } = inputs;
  const safeGirlAge = Math.max(0, Math.min(20, Math.floor(girlAge)));
  const rate = Math.max(0, ssyRate) / 100;
  const safeInflation = Math.max(0, annualInflationRate);
  const safeDeposit = Math.max(0, annualDeposit);
  const totalYears = 21 - safeGirlAge;
  const depositYears = Math.min(15, totalYears);
  const yearlyData: SsyYearRow[] = [];
  let balance = 0;
  let totalDeposits = 0;
  const currentYear = new Date().getFullYear();

  for (let yearIndex = 0; yearIndex < totalYears; yearIndex++) {
    const prevBalance = balance;
    const deposit = yearIndex < depositYears ? safeDeposit : 0;
    balance = (balance + deposit) * (1 + rate);
    totalDeposits += deposit;
    const yearInterest = roundAmount(balance - prevBalance - deposit);
    const realBalance = roundAmount(balance / Math.pow(1 + safeInflation / 100, yearIndex + 1));

    yearlyData.push({
      year: currentYear + yearIndex + 1,
      girlAge: safeGirlAge + yearIndex + 1,
      deposit: roundAmount(deposit),
      interest: yearInterest,
      balance: roundAmount(balance),
      realBalance,
    });
  }

  const maturityValue = roundAmount(balance);
  totalDeposits = roundAmount(totalDeposits);
  const totalInterest = roundAmount(maturityValue - totalDeposits);
  const realMaturityValue = totalYears > 0
    ? roundAmount(maturityValue / Math.pow(1 + safeInflation / 100, totalYears))
    : maturityValue;
  const inflationErosion = roundAmount(maturityValue - realMaturityValue);
  const maturityYear = currentYear + totalYears;

  const donutSegments = ([
    { key: 'deposits' as const, label: 'Total Deposits', value: totalDeposits, color: '#5BC0DE' },
    { key: 'interest' as const, label: 'Interest Earned', value: Math.max(0, totalInterest), color: '#ffb347' },
    { key: 'inflationErosion' as const, label: 'Inflation Erosion', value: Math.max(0, inflationErosion), color: '#ff6b6b' },
  ] satisfies DonutSegment[]).filter((s) => s.value > 0);

  return { totalDeposits, totalInterest, maturityValue, realMaturityValue, inflationErosion, maturityYear, depositYears, totalYears, yearlyData, donutSegments };
}
