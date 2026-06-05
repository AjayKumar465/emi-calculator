import { DEFAULT_ANNUAL_INFLATION_RATE } from './inflationConstants';
import { SsyCalculatorInputs } from '../types/ssyCalculator';

export const DEFAULT_SSY_INPUTS: SsyCalculatorInputs = {
  annualDeposit: 150000,
  ssyRate: 8.2,
  girlAge: 5,
  annualInflationRate: DEFAULT_ANNUAL_INFLATION_RATE,
};
