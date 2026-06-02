import { AmortizationYear, DonutSegment, MonthYear, SummaryLineItem } from './calculator';
import { InflationImpact } from './inflation';

export interface CreditCardCalculatorInputs {
  transactionAmount: number;
  interestRate: number;
  tenureMonths: number;
  processingFeePreGst: number;
  gstRate: number;
  startDate: MonthYear;
  annualInflationRate: number;
}

export interface CreditCardChartPoint {
  label: string;
  principal: number;
  interest: number;
  gstOnInterest: number;
  balance: number;
  totalPayment: number;
}

export interface CreditCardCalculatorResult {
  emi: number;
  apr: number;
  processingFeeGst: number;
  totalProcessingFees: number;
  totalInterest: number;
  totalGstOnInterest: number;
  totalPayment: number;
  amortizationYears: AmortizationYear[];
  chartData: CreditCardChartPoint[];
  donutSegments: DonutSegment[];
  summaryItems: SummaryLineItem[];
  inflation: InflationImpact;
}
