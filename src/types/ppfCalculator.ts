import { DonutSegment } from './calculator';

export interface PpfCalculatorInputs {
  annualDeposit: number;
  ppfRate: number;
  tenureYears: number;
  annualInflationRate: number;
}

export interface PpfYearRow {
  year: number;
  deposit: number;
  interest: number;
  balance: number;
  realBalance: number;
}

export interface PpfCalculatorResult {
  totalDeposits: number;
  totalInterest: number;
  maturityValue: number;
  realMaturityValue: number;
  inflationErosion: number;
  yearlyData: PpfYearRow[];
  donutSegments: DonutSegment[];
}
