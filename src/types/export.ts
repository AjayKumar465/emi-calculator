import { AmortizationYear, ChartYearData, DonutSegment } from './calculator';
import { CreditCardChartPoint } from './creditCardCalculator';

export interface ExportSummaryRow {
  label: string;
  value: string;
  numericValue?: number;
}

export interface ExportBreakdownSegment {
  label: string;
  value: number;
  color: string;
}

export interface CalculatorExportPayload {
  calculatorId: string;
  calculatorName: string;
  subtitle?: string;
  generatedAt: string;
  summaryRows: ExportSummaryRow[];
  breakdownSegments: ExportBreakdownSegment[];
  amortizationYears: AmortizationYear[];
  chartData?: ChartYearData[];
  creditCardChartData?: CreditCardChartPoint[];
  thirdColumnLabel: string;
  footnotes?: string[];
  fileBaseName: string;
}
