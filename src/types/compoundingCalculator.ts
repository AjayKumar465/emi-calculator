import { DonutSegment } from './calculator';

export type CompoundingFrequency = 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

export interface CompoundingCalculatorInputs {
  principalAmount: number;
  annualReturnRate: number;
  tenureYears: number;
  compoundingFrequency: CompoundingFrequency;
  additionalContribution: number;
  annualInflationRate: number;
}

export interface CompoundingYearRow {
  year: number;
  contributions: number;
  cumulativeContributions: number;
  nominalValue: number;
  realValue: number;
}

export interface CompoundingCalculatorResult {
  totalContributions: number;
  nominalMaturityValue: number;
  nominalReturns: number;
  realMaturityValue: number;
  inflationErosion: number;
  yearlyData: CompoundingYearRow[];
  donutSegments: DonutSegment[];
}
