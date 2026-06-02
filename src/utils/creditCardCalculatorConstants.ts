import { DEFAULT_START_DATE } from './constants';
import { DEFAULT_ANNUAL_INFLATION_RATE } from './inflationConstants';
import { CreditCardCalculatorInputs } from '../types/creditCardCalculator';

export const DEFAULT_GST_RATE = 18;

export const DEFAULT_CREDIT_CARD_INPUTS: CreditCardCalculatorInputs = {
  transactionAmount: 15_000,
  interestRate: 18,
  tenureMonths: 6,
  processingFeePreGst: 300,
  gstRate: DEFAULT_GST_RATE,
  startDate: DEFAULT_START_DATE,
  annualInflationRate: DEFAULT_ANNUAL_INFLATION_RATE,
};
