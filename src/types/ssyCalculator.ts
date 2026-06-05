import { DonutSegment } from './calculator';

export interface SsyCalculatorInputs {
  annualDeposit: number;
  ssyRate: number;
  girlAge: number;
  annualInflationRate: number;
}

export interface SsyYearRow {
  year: number;
  girlAge: number;
  deposit: number;
  interest: number;
  balance: number;
  realBalance: number;
}

export interface SsyCalculatorResult {
  totalDeposits: number;
  totalInterest: number;
  maturityValue: number;
  realMaturityValue: number;
  inflationErosion: number;
  maturityYear: number;
  depositYears: number;
  totalYears: number;
  yearlyData: SsyYearRow[];
  donutSegments: DonutSegment[];
}
