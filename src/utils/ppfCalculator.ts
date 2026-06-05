import { DonutSegment } from '../types/calculator';
import { PpfCalculatorInputs, PpfCalculatorResult, PpfYearRow } from '../types/ppfCalculator';
import { roundAmount } from './format';

export function calculatePpf(inputs: PpfCalculatorInputs): PpfCalculatorResult {
  const { annualDeposit, ppfRate, tenureYears, annualInflationRate } = inputs;
  const safeTenure = Math.max(0, Math.floor(tenureYears));
  const rate = Math.max(0, ppfRate) / 100;
  const safeInflation = Math.max(0, annualInflationRate);
  const safeDeposit = Math.max(0, annualDeposit);
  const yearlyData: PpfYearRow[] = [];
  let balance = 0;
  let totalDeposits = 0;
  const currentYear = new Date().getFullYear();

  for (let yearIndex = 0; yearIndex < safeTenure; yearIndex++) {
    const prevBalance = balance;
    balance = (balance + safeDeposit) * (1 + rate);
    totalDeposits += safeDeposit;
    const yearInterest = roundAmount(balance - prevBalance - safeDeposit);
    const realBalance = roundAmount(balance / Math.pow(1 + safeInflation / 100, yearIndex + 1));

    yearlyData.push({
      year: currentYear + yearIndex + 1,
      deposit: roundAmount(safeDeposit),
      interest: yearInterest,
      balance: roundAmount(balance),
      realBalance,
    });
  }

  const maturityValue = roundAmount(balance);
  totalDeposits = roundAmount(totalDeposits);
  const totalInterest = roundAmount(maturityValue - totalDeposits);
  const realMaturityValue = safeTenure > 0
    ? roundAmount(maturityValue / Math.pow(1 + safeInflation / 100, safeTenure))
    : maturityValue;
  const inflationErosion = roundAmount(maturityValue - realMaturityValue);

  const donutSegments = ([
    { key: 'deposits' as const, label: 'Total Deposits', value: totalDeposits, color: '#5BC0DE' },
    { key: 'interest' as const, label: 'Interest Earned', value: Math.max(0, totalInterest), color: '#ffb347' },
    { key: 'inflationErosion' as const, label: 'Inflation Erosion', value: Math.max(0, inflationErosion), color: '#ff6b6b' },
  ] satisfies DonutSegment[]).filter((s) => s.value > 0);

  return { totalDeposits, totalInterest, maturityValue, realMaturityValue, inflationErosion, yearlyData, donutSegments };
}
