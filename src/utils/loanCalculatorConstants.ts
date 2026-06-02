import { DEFAULT_START_DATE } from './constants';
import { DEFAULT_ANNUAL_INFLATION_RATE } from './inflationConstants';
import { LoanCalculatorInputs } from '../types/loanCalculator';

export const DEFAULT_LOAN_CALCULATOR_INPUTS: LoanCalculatorInputs = {
  mode: 'emi',
  loanAmount: 1_000_000,
  interestRate: 10.75,
  tenure: 5,
  tenureMode: 'years',
  targetEmi: 20_000,
  processingFees: 10_000,
  emiScheme: 'arrears',
  startDate: DEFAULT_START_DATE,
  extraMonthlyPayment: 0,
  annualInflationRate: DEFAULT_ANNUAL_INFLATION_RATE,
};
