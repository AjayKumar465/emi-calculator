import { useMemo, useState } from 'react';

import { PpfCalculatorInputs } from '../types/ppfCalculator';
import { calculatePpf } from '../utils/ppfCalculator';
import { DEFAULT_PPF_INPUTS } from '../utils/ppfCalculatorConstants';
import { formatCurrency } from '../utils/format';

export function usePpfCalculator(initialInputs: PpfCalculatorInputs = DEFAULT_PPF_INPUTS) {
  const [inputs, setInputs] = useState<PpfCalculatorInputs>(initialInputs);

  const result = useMemo(() => calculatePpf(inputs), [inputs]);

  const updateInputs = (patch: Partial<PpfCalculatorInputs>) => {
    setInputs((current) => ({ ...current, ...patch }));
  };

  const formattedSummary = useMemo(
    () => [
      { key: 'annualDeposit', label: 'Annual Deposit', value: inputs.annualDeposit, displayValue: formatCurrency(inputs.annualDeposit) },
      { key: 'totalDeposits', label: 'Total Deposits', value: result.totalDeposits, displayValue: formatCurrency(result.totalDeposits) },
      { key: 'totalInterest', label: 'Interest Earned', value: result.totalInterest, displayValue: formatCurrency(result.totalInterest) },
      { key: 'maturityValue', label: 'Maturity Value (Nominal)', value: result.maturityValue, displayValue: formatCurrency(result.maturityValue), emphasized: true },
      { key: 'realMaturity', label: 'Maturity Value (Today\'s Value)', value: result.realMaturityValue, displayValue: formatCurrency(result.realMaturityValue), emphasized: true },
      { key: 'inflationErosion', label: 'Inflation Erosion', value: result.inflationErosion, displayValue: formatCurrency(result.inflationErosion) },
    ],
    [inputs.annualDeposit, result],
  );

  const chartData = useMemo(
    () => result.yearlyData.map((row) => ({
      year: row.year,
      invested: row.balance - row.interest,
      nominalValue: row.balance,
      realValue: row.realBalance,
    })),
    [result.yearlyData],
  );

  const tableHeaders = ['Year', 'Deposit', 'Interest', 'Balance', 'Real Balance'];
  const tableRows = useMemo(
    () => result.yearlyData.map((row) => [
      row.year,
      formatCurrency(row.deposit),
      formatCurrency(row.interest),
      formatCurrency(row.balance),
      formatCurrency(row.realBalance),
    ]),
    [result.yearlyData],
  );

  const formattedLifetimeCost = useMemo(
    () => formatCurrency(result.maturityValue),
    [result.maturityValue],
  );

  return { inputs, result, formattedSummary, chartData, tableHeaders, tableRows, formattedLifetimeCost, updateInputs };
}
