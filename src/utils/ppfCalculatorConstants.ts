import { DEFAULT_ANNUAL_INFLATION_RATE } from './inflationConstants';
import { PpfCalculatorInputs } from '../types/ppfCalculator';

export const DEFAULT_PPF_INPUTS: PpfCalculatorInputs = {
  annualDeposit: 150000,
  ppfRate: 7.1,
  tenureYears: 15,
  annualInflationRate: DEFAULT_ANNUAL_INFLATION_RATE,
};
