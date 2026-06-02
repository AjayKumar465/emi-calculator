import { useMemo } from 'react';

import { CalculatorInputs } from '../types/calculator';
import { calculateEMI } from '../utils/emi';

export function useAmortization(inputs: CalculatorInputs) {
  return useMemo(() => {
    const result = calculateEMI(inputs);
    return {
      years: result.amortizationYears,
      chartData: result.chartData,
    };
  }, [inputs]);
}
