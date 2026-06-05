import { useMemo, useState } from 'react';

import { CompoundingCalculatorInputs } from '../types/compoundingCalculator';
import { calculateCompounding } from '../utils/compoundingCalculator';
import { DEFAULT_COMPOUNDING_INPUTS } from '../utils/compoundingCalculatorConstants';
import { formatCurrency } from '../utils/format';

export function useCompoundingCalculator(
  initialInputs: CompoundingCalculatorInputs = DEFAULT_COMPOUNDING_INPUTS,
) {
  const [inputs, setInputs] = useState<CompoundingCalculatorInputs>(initialInputs);

  const result = useMemo(() => calculateCompounding(inputs), [inputs]);

  const updateInputs = (patch: Partial<CompoundingCalculatorInputs>) => {
    setInputs((current) => ({ ...current, ...patch }));
  };

  const formattedSummary = useMemo(
    () => [
      { key: 'principal', label: 'Principal Amount', value: inputs.principalAmount, displayValue: formatCurrency(inputs.principalAmount) },
      { key: 'additionalContribution', label: 'Additional Contribution (per period)', value: inputs.additionalContribution, displayValue: formatCurrency(inputs.additionalContribution) },
      { key: 'totalContributions', label: 'Total Contributions', value: result.totalContributions, displayValue: formatCurrency(result.totalContributions) },
      { key: 'nominalMaturity', label: 'Maturity Value (Nominal)', value: result.nominalMaturityValue, displayValue: formatCurrency(result.nominalMaturityValue), emphasized: true },
      { key: 'nominalReturns', label: 'Total Returns', value: result.nominalReturns, displayValue: formatCurrency(result.nominalReturns) },
      { key: 'realMaturity', label: 'Maturity Value (Today\'s Value)', value: result.realMaturityValue, displayValue: formatCurrency(result.realMaturityValue), emphasized: true },
      { key: 'inflationErosion', label: 'Inflation Erosion', value: result.inflationErosion, displayValue: formatCurrency(result.inflationErosion) },
    ],
    [inputs.principalAmount, inputs.additionalContribution, result],
  );

  const chartData = useMemo(
    () => result.yearlyData.map((row) => ({
      year: row.year,
      invested: row.cumulativeContributions,
      nominalValue: row.nominalValue,
      realValue: row.realValue,
    })),
    [result.yearlyData],
  );

  const tableHeaders = ['Year', 'Contributions', 'Cumulative', 'Nominal Value', 'Real Value'];
  const tableRows = useMemo(
    () => result.yearlyData.map((row) => [
      row.year,
      formatCurrency(row.contributions),
      formatCurrency(row.cumulativeContributions),
      formatCurrency(row.nominalValue),
      formatCurrency(row.realValue),
    ]),
    [result.yearlyData],
  );

  const formattedLifetimeCost = useMemo(
    () => formatCurrency(result.nominalMaturityValue),
    [result.nominalMaturityValue],
  );

  return { inputs, result, formattedSummary, chartData, tableHeaders, tableRows, formattedLifetimeCost, updateInputs };
}
