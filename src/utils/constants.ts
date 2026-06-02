import { CalculatorInputs, MonthYear } from '../types/calculator';

export const DEFAULT_START_DATE: MonthYear = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
};

export const DEFAULT_CALCULATOR_INPUTS: CalculatorInputs = {
  loan: {
    propertyValue: 5_000_000,
    downPayment: 20,
    downPaymentMode: 'percent',
    loanProtection: 0,
    interestRate: 8.5,
    tenure: 20,
    tenureMode: 'years',
    processingFees: 10_000,
    startDate: DEFAULT_START_DATE,
  },
  expenses: {
    upfrontCosts: 0,
    upfrontCostsMode: 'percent',
    annualPropertyTax: 12_000,
    annualHomeInsurance: 8_000,
    monthlyMaintenance: 2_000,
  },
  prepayments: {
    monthly: { amount: 0, startDate: DEFAULT_START_DATE },
    yearly: { amount: 0, startDate: DEFAULT_START_DATE },
    quarterly: { amount: 0, startDate: DEFAULT_START_DATE },
    oneTime: { amount: 0, startDate: DEFAULT_START_DATE },
  },
};

export const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
} as const;
