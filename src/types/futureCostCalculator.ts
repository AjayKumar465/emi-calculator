import { DonutSegment } from './calculator';

export interface FutureCostCalculatorInputs {
  currentMonthlyExpenses: number;
  annualInflationRate: number;
  targetYear: number;
  currentAge: number;
  retirementAge: number;
}

export interface FutureCostYearRow {
  year: number;
  monthlyExpense: number;
  annualExpense: number;
}

export interface FutureCostCalculatorResult {
  yearsAhead: number;
  futureMonthlyExpenses: number;
  futureAnnualExpenses: number;
  currentAnnualExpenses: number;
  additionalCostDueToInflation: number;
  purchasingPowerLossPercent: number;
  yearlyData: FutureCostYearRow[];
  donutSegments: DonutSegment[];
}
