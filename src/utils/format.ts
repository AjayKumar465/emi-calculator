import { MONTH_LABELS } from './constants';
import { MonthYear } from '../types/calculator';

export function formatCurrency(value: number, compact = false): string {
  const safeValue = Number.isFinite(value) ? value : 0;

  if (compact && Math.abs(safeValue) >= 100000) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(safeValue);
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(safeValue);
}

export function formatNumber(value: number, fractionDigits = 0): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(safeValue);
}

/** Display numeric values in inputs without grouping or forced trailing zeros. */
export function formatEditableNumber(value: number, fractionDigits = 0): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(safeValue);
}

export function sanitizeNumericText(text: string, allowDecimal = true): string {
  let cleaned = text.replace(/[^0-9.]/g, '');
  if (!allowDecimal) {
    return cleaned.replace(/\./g, '');
  }

  const [whole, ...fractionParts] = cleaned.split('.');
  if (fractionParts.length === 0) {
    return whole;
  }

  return `${whole}.${fractionParts.join('')}`;
}

export function formatPercent(value: number, fractionDigits = 2): string {
  return `${formatNumber(value, fractionDigits)}%`;
}

export function parseNumericInput(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '');
  if (!cleaned) {
    return 0;
  }

  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function clampMonthYear(date: MonthYear): MonthYear {
  const month = Math.min(12, Math.max(1, Math.round(date.month) || 1));
  const year = Math.min(
    2100,
    Math.max(2000, Math.round(date.year) || new Date().getFullYear()),
  );
  return { month, year };
}

export function formatMonthYear(date: MonthYear): string {
  const safe = clampMonthYear(date);
  const monthLabel = MONTH_LABELS[safe.month - 1];
  return `${monthLabel} ${safe.year}`;
}

export function monthYearToIndex(date: MonthYear): number {
  const safe = clampMonthYear(date);
  return safe.year * 12 + (safe.month - 1);
}

export function indexToMonthYear(index: number): MonthYear {
  const month = (index % 12) + 1;
  const year = Math.floor(index / 12);
  return { month, year };
}

export function addMonths(date: MonthYear, months: number): MonthYear {
  const safe = clampMonthYear(date);
  const total = monthYearToIndex(safe) + months;
  return clampMonthYear(indexToMonthYear(total));
}
