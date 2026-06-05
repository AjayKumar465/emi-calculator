import { useCallback, useMemo, useState } from 'react';

import { SipCalculatorInputs } from '../types/sipCalculator';
import { calculateSip } from '../utils/sipCalculator';
import { DEFAULT_SIP_INPUTS } from '../utils/sipCalculatorConstants';
import { formatCurrency } from '../utils/format';

const TABLE_HEADERS = ['Year', 'SIP/Year', 'Cumulative Invested', 'Nominal Value', 'Real Value'];

export function useSipCalculator(initialInputs: SipCalculatorInputs = DEFAULT_SIP_INPUTS) {
  const [inputs, setInputs] = useState<SipCalculatorInputs>(initialInputs);

  const result = useMemo(() => calculateSip(inputs), [inputs]);

  const updateInputs = useCallback((patch: Partial<SipCalculatorInputs>) => {
    setInputs((current) => ({ ...current, ...patch }));
  }, []);

  const formattedSummary = useMemo(
    () => [
      { key: 'monthlyInvestment', label: 'Monthly SIP', value: inputs.monthlyInvestment, displayValue: formatCurrency(inputs.monthlyInvestment) },
      { key: 'totalInvested', label: 'Total Invested', value: result.totalInvested, displayValue: formatCurrency(result.totalInvested) },
      { key: 'nominalMaturity', label: 'Maturity Value (Nominal)', value: result.nominalMaturityValue, displayValue: formatCurrency(result.nominalMaturityValue), emphasized: true },
      { key: 'nominalReturns', label: 'Total Returns', value: result.nominalReturns, displayValue: formatCurrency(result.nominalReturns) },
      { key: 'realMaturity', label: 'Maturity Value (Today\'s Value)', value: result.realMaturityValue, displayValue: formatCurrency(result.realMaturityValue), emphasized: true },
      { key: 'inflationErosion', label: 'Inflation Erosion', value: result.inflationErosion, displayValue: formatCurrency(result.inflationErosion) },
    ],
    [inputs.monthlyInvestment, result],
  );

  const chartData = useMemo(
    () => result.yearlyData.map((row) => ({
      year: row.year,
      invested: row.cumulativeInvested,
      nominalValue: row.nominalValue,
      realValue: row.realValue,
    })),
    [result.yearlyData],
  );

  const tableRows = useMemo(
    () => result.yearlyData.map((row) => [
      row.year,
      formatCurrency(row.yearlyInvestment),
      formatCurrency(row.cumulativeInvested),
      formatCurrency(row.nominalValue),
      formatCurrency(row.realValue),
    ]),
    [result.yearlyData],
  );

  const formattedLifetimeCost = useMemo(
    () => formatCurrency(result.nominalMaturityValue),
    [result.nominalMaturityValue],
  );

  return { inputs, result, formattedSummary, chartData, tableHeaders: TABLE_HEADERS, tableRows, formattedLifetimeCost, updateInputs };
}
