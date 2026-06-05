import { DEFAULT_ANNUAL_INFLATION_RATE } from './inflationConstants';
import { FutureCostCalculatorInputs } from '../types/futureCostCalculator';

export const DEFAULT_FUTURE_COST_INPUTS: FutureCostCalculatorInputs = {
  currentMonthlyExpenses: 50000,
  annualInflationRate: DEFAULT_ANNUAL_INFLATION_RATE,
  targetYear: new Date().getFullYear() + 20,
  currentAge: 30,
  retirementAge: 60,
};
