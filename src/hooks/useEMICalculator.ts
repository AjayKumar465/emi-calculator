import { useCallback, useMemo, useState } from 'react';

import {
  CalculatorInputs,
  CalculatorResult,
  DonutSegment,
  SummaryLineItem,
} from '../types/calculator';
import { DEFAULT_CALCULATOR_INPUTS } from '../utils/constants';
import { calculateEMI, getDonutSegments } from '../utils/emi';
import { formatCurrency } from '../utils/format';

export function useEMICalculator(initialInputs: CalculatorInputs = DEFAULT_CALCULATOR_INPUTS) {
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);

  const result: CalculatorResult = useMemo(() => calculateEMI(inputs), [inputs]);

  const donutSegments: DonutSegment[] = useMemo(
    () => getDonutSegments(result),
    [result],
  );

  const summaryLineItems: SummaryLineItem[] = useMemo(
    () => [
      {
        key: 'baseEmi',
        label: 'Base EMI',
        value: result.monthlyBreakdown.baseEmi,
      },
      {
        key: 'extraMonthlyPayment',
        label: 'Extra Monthly Payment',
        value: result.monthlyBreakdown.extraMonthlyPayment,
      },
      {
        key: 'propertyTax',
        label: 'Property Tax',
        value: result.monthlyBreakdown.propertyTax,
      },
      {
        key: 'homeInsurance',
        label: 'Home Insurance',
        value: result.monthlyBreakdown.homeInsurance,
      },
      {
        key: 'maintenance',
        label: 'Maintenance',
        value: result.monthlyBreakdown.maintenance,
      },
      {
        key: 'totalMonthlyOutgo',
        label: 'Your Monthly Outgo',
        value: result.monthlyBreakdown.totalMonthlyOutgo,
        emphasized: true,
      },
    ],
    [result.monthlyBreakdown],
  );

  const formattedLifetimeCost = useMemo(
    () => formatCurrency(result.paymentBreakdown.lifetimeCost),
    [result.paymentBreakdown.lifetimeCost],
  );

  const updateInputs = useCallback((updater: (current: CalculatorInputs) => CalculatorInputs) => {
    setInputs((current) => updater(current));
  }, []);

  const resetPrepayments = useCallback(() => {
    setInputs((current) => ({
      ...current,
      prepayments: DEFAULT_CALCULATOR_INPUTS.prepayments,
    }));
  }, []);

  return {
    inputs,
    result,
    donutSegments,
    summaryLineItems,
    formattedLifetimeCost,
    updateInputs,
    resetPrepayments,
  };
}
