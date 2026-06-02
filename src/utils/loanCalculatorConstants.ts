import { DEFAULT_START_DATE } from '../utils/constants';
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
};
