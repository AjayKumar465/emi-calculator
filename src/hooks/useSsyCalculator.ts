import { useCallback, useMemo, useState } from 'react';

import { SsyCalculatorInputs } from '../types/ssyCalculator';
import { calculateSsy } from '../utils/ssyCalculator';
import { DEFAULT_SSY_INPUTS } from '../utils/ssyCalculatorConstants';
import { formatCurrency } from '../utils/format';

const TABLE_HEADERS = ['Year', 'Girl Age', 'Deposit', 'Interest', 'Balance', 'Real Balance'];

export function useSsyCalculator(initialInputs: SsyCalculatorInputs = DEFAULT_SSY_INPUTS) {
  const [inputs, setInputs] = useState<SsyCalculatorInputs>(initialInputs);

  const result = useMemo(() => calculateSsy(inputs), [inputs]);

  const updateInputs = useCallback((patch: Partial<SsyCalculatorInputs>) => {
    setInputs((current) => ({ ...current, ...patch }));
  }, []);

  const formattedSummary = useMemo(
    () => [
      { key: 'annualDeposit', label: 'Annual Deposit', value: inputs.annualDeposit, displayValue: formatCurrency(inputs.annualDeposit) },
      { key: 'girlAge', label: 'Girl\'s Current Age', value: inputs.girlAge, displayValue: `${inputs.girlAge} years` },
      { key: 'depositPeriod', label: 'Deposit Period', value: result.depositYears, displayValue: `${result.depositYears} years` },
      { key: 'maturityYear', label: 'Maturity Year', value: result.maturityYear, displayValue: `${result.maturityYear}` },
      { key: 'totalDeposits', label: 'Total Deposits', value: result.totalDeposits, displayValue: formatCurrency(result.totalDeposits) },
      { key: 'totalInterest', label: 'Interest Earned', value: result.totalInterest, displayValue: formatCurrency(result.totalInterest) },
      { key: 'maturityValue', label: 'Maturity Value', value: result.maturityValue, displayValue: formatCurrency(result.maturityValue), emphasized: true },
      { key: 'realMaturity', label: 'Real Maturity Value', value: result.realMaturityValue, displayValue: formatCurrency(result.realMaturityValue), emphasized: true },
      { key: 'inflationErosion', label: 'Inflation Erosion', value: result.inflationErosion, displayValue: formatCurrency(result.inflationErosion) },
    ],
    [inputs.annualDeposit, inputs.girlAge, result],
  );

  const chartData = useMemo(
    () => result.yearlyData.map((row) => {
      const cumulativeDeposits = result.yearlyData
        .slice(0, result.yearlyData.indexOf(row) + 1)
        .reduce((sum, r) => sum + r.deposit, 0);
      return {
        year: row.year,
        invested: cumulativeDeposits,
        nominalValue: row.balance,
        realValue: row.realBalance,
      };
    }),
    [result.yearlyData],
  );

  const tableRows = useMemo(
    () => result.yearlyData.map((row) => [
      row.year,
      row.girlAge,
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

  return { inputs, result, formattedSummary, chartData, tableHeaders: TABLE_HEADERS, tableRows, formattedLifetimeCost, updateInputs };
}
