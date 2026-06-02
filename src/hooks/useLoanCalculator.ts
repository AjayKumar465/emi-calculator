import { useMemo, useState } from 'react';

import { LoanCalculatorInputs, LoanCalculatorMode } from '../types/loanCalculator';
import { calculateLoanCalculator } from '../utils/loanCalculator';
import { DEFAULT_LOAN_CALCULATOR_INPUTS } from '../utils/loanCalculatorConstants';
import { formatCurrency, formatNumber, formatPercent } from '../utils/format';

export function useLoanCalculator(
  initialInputs: LoanCalculatorInputs = DEFAULT_LOAN_CALCULATOR_INPUTS,
) {
  const [inputs, setInputs] = useState<LoanCalculatorInputs>(initialInputs);

  const result = useMemo(() => calculateLoanCalculator(inputs), [inputs]);

  const updateInputs = (patch: Partial<LoanCalculatorInputs>) => {
    setInputs((current) => ({ ...current, ...patch }));
  };

  const setMode = (mode: LoanCalculatorMode) => {
    setInputs((current) => ({ ...current, mode }));
  };

  const formattedSummary = useMemo(
    () =>
      result.summaryItems.map((item) => {
        if (item.key === 'apr' || item.key === 'interestRate') {
          return { ...item, displayValue: formatPercent(item.value, 2) };
        }

        if (item.key === 'tenureMonths' || item.key === 'revisedTenure') {
          const years = Math.floor(item.value / 12);
          const months = Math.round(item.value % 12);
          const label =
            years > 0 && months > 0
              ? `${years} yr ${months} mo (${formatNumber(item.value, 0)} months)`
              : years > 0
                ? `${years} yr (${formatNumber(item.value, 0)} months)`
                : `${formatNumber(item.value, 0)} months`;
          return { ...item, displayValue: label };
        }

        return { ...item, displayValue: formatCurrency(item.value) };
      }),
    [result.summaryItems],
  );

  const formattedLifetimeCost = useMemo(
    () => formatCurrency(result.totalPayment),
    [result.totalPayment],
  );

  return {
    inputs,
    result,
    formattedSummary,
    formattedLifetimeCost,
    updateInputs,
    setMode,
  };
}
