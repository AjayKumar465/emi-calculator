import { HomeLoanInflationImpact } from './inflation';

export type ValueMode = 'amount' | 'percent';
export type TenureMode = 'years' | 'months';

export interface MonthYear {
  month: number;
  year: number;
}

export interface PrepaymentEntry {
  amount: number;
  startDate: MonthYear;
}

export interface Prepayments {
  monthly: PrepaymentEntry;
  yearly: PrepaymentEntry;
  quarterly: PrepaymentEntry;
  oneTime: PrepaymentEntry;
}

export interface LoanDetails {
  propertyValue: number;
  downPayment: number;
  downPaymentMode: ValueMode;
  loanProtection: number;
  interestRate: number;
  tenure: number;
  tenureMode: TenureMode;
  processingFees: number;
  startDate: MonthYear;
}

export interface HomeownerExpenses {
  upfrontCosts: number;
  upfrontCostsMode: ValueMode;
  annualPropertyTax: number;
  annualHomeInsurance: number;
  monthlyMaintenance: number;
}

export interface CalculatorInputs {
  loan: LoanDetails;
  expenses: HomeownerExpenses;
  prepayments: Prepayments;
  annualInflationRate: number;
  annualPropertyAppreciationRate: number;
}

export interface MonthlyBreakdown {
  baseEmi: number;
  extraMonthlyPayment: number;
  propertyTax: number;
  homeInsurance: number;
  maintenance: number;
  totalMonthlyOutgo: number;
}

export interface PaymentBreakdown {
  downPaymentAndFees: number;
  principal: number;
  prepayments: number;
  interest: number;
  taxesInsuranceMaintenance: number;
  lifetimeCost: number;
}

export interface AmortizationMonth {
  monthIndex: number;
  date: MonthYear;
  principal: number;
  interest: number;
  prepayment: number;
  taxesInsuranceMaintenance: number;
  totalPayment: number;
  balance: number;
  loanPaidPercent: number;
}

export interface AmortizationYear {
  year: number;
  principal: number;
  interest: number;
  prepayment: number;
  taxesInsuranceMaintenance: number;
  totalPayment: number;
  balance: number;
  loanPaidPercent: number;
  months: AmortizationMonth[];
}

export interface ChartYearData {
  year: number;
  principal: number;
  prepayment: number;
  interest: number;
  taxesInsuranceMaintenance: number;
  balance: number;
  totalPayment: number;
}

export interface CalculatorResult {
  netLoanAmount: number;
  downPaymentAmount: number;
  upfrontCostsAmount: number;
  monthlyBreakdown: MonthlyBreakdown;
  paymentBreakdown: PaymentBreakdown;
  amortizationYears: AmortizationYear[];
  chartData: ChartYearData[];
  inflation: HomeLoanInflationImpact;
}

export interface DonutSegment {
  key: keyof typeof import('../theme/colors').colors.chart | 'downPayment';
  label: string;
  value: number;
  color: string;
}

export interface SummaryLineItem {
  key: string;
  label: string;
  value: number;
  emphasized?: boolean;
}
