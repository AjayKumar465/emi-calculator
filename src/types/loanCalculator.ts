import { MonthYear, TenureMode } from './calculator';

export type LoanCalculatorMode = 'emi' | 'affordability' | 'tenure' | 'interest';

export type EmiScheme = 'arrears' | 'advance';

export interface LoanCalculatorInputs {
  mode: LoanCalculatorMode;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  tenureMode: TenureMode;
  targetEmi: number;
  processingFees: number;
  emiScheme: EmiScheme;
  startDate: MonthYear;
  extraMonthlyPayment: number;
}

export interface ResolvedLoanParameters {
  principal: number;
  annualRate: number;
  months: number;
  emi: number;
}

export interface LoanCalculatorResult {
  resolved: ResolvedLoanParameters;
  loanApr: number;
  totalInterest: number;
  totalPayment: number;
  amortizationYears: import('./calculator').AmortizationYear[];
  chartData: import('./calculator').ChartYearData[];
  donutSegments: import('./calculator').DonutSegment[];
  summaryItems: import('./calculator').SummaryLineItem[];
}

export interface LoanModeTab {
  key: LoanCalculatorMode;
  label: string;
  shortLabel: string;
  description: string;
}
