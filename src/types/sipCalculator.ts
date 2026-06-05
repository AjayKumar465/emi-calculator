import { DonutSegment } from './calculator';

export interface SipCalculatorInputs {
  monthlyInvestment: number;
  expectedReturnRate: number;
  tenureYears: number;
  annualInflationRate: number;
  annualStepUpRate: number;
}

export interface SipYearRow {
  year: number;
  yearlyInvestment: number;
  cumulativeInvested: number;
  nominalValue: number;
  realValue: number;
}

export interface SipCalculatorResult {
  totalInvested: number;
  nominalMaturityValue: number;
  nominalReturns: number;
  realMaturityValue: number;
  inflationErosion: number;
  yearlyData: SipYearRow[];
  donutSegments: DonutSegment[];
}
