import { DEFAULT_ANNUAL_INFLATION_RATE } from './inflationConstants';
import { SipCalculatorInputs } from '../types/sipCalculator';

export const DEFAULT_SIP_INPUTS: SipCalculatorInputs = {
  monthlyInvestment: 10000,
  expectedReturnRate: 12,
  tenureYears: 15,
  annualInflationRate: DEFAULT_ANNUAL_INFLATION_RATE,
  annualStepUpRate: 10,
};
