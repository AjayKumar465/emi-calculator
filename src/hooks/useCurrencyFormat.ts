import { useMemo } from 'react';

import { formatCurrency } from '../utils/format';

export function useCurrencyFormat(value: number) {
  return useMemo(() => formatCurrency(value), [value]);
}
