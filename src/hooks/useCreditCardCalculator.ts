import { useMemo, useState } from 'react';

import { CreditCardCalculatorInputs } from '../types/creditCardCalculator';
import { calculateCreditCardCalculator } from '../utils/creditCardCalculator';
import { DEFAULT_CREDIT_CARD_INPUTS } from '../utils/creditCardCalculatorConstants';
import { formatCurrency, formatPercent } from '../utils/format';

export function useCreditCardCalculator(
  initialInputs: CreditCardCalculatorInputs = DEFAULT_CREDIT_CARD_INPUTS,
) {
  const [inputs, setInputs] = useState<CreditCardCalculatorInputs>(initialInputs);

  const result = useMemo(() => calculateCreditCardCalculator(inputs), [inputs]);

  const updateInputs = (patch: Partial<CreditCardCalculatorInputs>) => {
    setInputs((current) => ({ ...current, ...patch }));
  };

  const formattedSummary = useMemo(
    () =>
      result.summaryItems.map((item) => {
        if (item.key === 'apr') {
          return { ...item, displayValue: formatPercent(item.value, 2) };
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
  };
}
