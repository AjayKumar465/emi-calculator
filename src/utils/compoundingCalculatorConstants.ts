import { DEFAULT_ANNUAL_INFLATION_RATE } from './inflationConstants';
import { CompoundingCalculatorInputs } from '../types/compoundingCalculator';

export const DEFAULT_COMPOUNDING_INPUTS: CompoundingCalculatorInputs = {
  principalAmount: 500000,
  annualReturnRate: 10,
  tenureYears: 10,
  compoundingFrequency: 'monthly',
  additionalContribution: 5000,
  annualInflationRate: DEFAULT_ANNUAL_INFLATION_RATE,
};
