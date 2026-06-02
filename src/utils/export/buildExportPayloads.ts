import { CalculatorExportPayload } from '../../types/export';
import { CalculatorInputs, CalculatorResult, DonutSegment, SummaryLineItem } from '../../types/calculator';
import { CreditCardCalculatorInputs, CreditCardCalculatorResult } from '../../types/creditCardCalculator';
import { LoanCalculatorInputs, LoanCalculatorResult } from '../../types/loanCalculator';
import { formatCurrency, formatMonthYear, formatPercent, roundAmount } from '../format';
import {
  formatInflationSummaryRows,
  getHomeLoanInflationSummaryRows,
  getInflationSummaryRows,
} from '../inflation';
import { LOAN_MODE_TABS } from '../loanCalculator';

function toBreakdown(segments: DonutSegment[]) {
  return segments.map((segment) => ({
    label: segment.label,
    value: roundAmount(segment.value),
    color: segment.color,
  }));
}

function toInflationExportRows(
  rows: ReturnType<typeof formatInflationSummaryRows>,
) {
  return rows.map((row) => ({
    label: row.label,
    value: row.displayValue,
    numericValue: roundAmount(row.value),
  }));
}

function flattenMonthlyRows(
  years: CalculatorExportPayload['amortizationYears'],
  thirdColumnLabel: string,
) {
  const headers = [
    'Period',
    'Principal',
    'Interest',
    thirdColumnLabel,
    'Prepayment',
    'Total Payment',
    'Balance',
    'Loan Paid %',
  ];

  const rows: (string | number)[][] = [];

  years.forEach((yearRow) => {
    yearRow.months.forEach((month) => {
      rows.push([
        formatMonthYear(month.date),
        roundAmount(month.principal),
        roundAmount(month.interest),
        roundAmount(month.taxesInsuranceMaintenance),
        roundAmount(month.prepayment),
        roundAmount(month.totalPayment),
        roundAmount(month.balance),
        roundAmount(month.loanPaidPercent),
      ]);
    });
  });

  return { headers, rows };
}

export function buildHomeLoanExportPayload(
  inputs: CalculatorInputs,
  result: CalculatorResult,
  summaryItems: SummaryLineItem[],
  donutSegments: DonutSegment[],
): CalculatorExportPayload {
  const summaryRows = [
    { label: 'Property Value', value: formatCurrency(inputs.loan.propertyValue), numericValue: roundAmount(inputs.loan.propertyValue) },
    { label: 'Net Loan Amount', value: formatCurrency(result.netLoanAmount), numericValue: roundAmount(result.netLoanAmount) },
    { label: 'Annual Interest Rate', value: formatPercent(inputs.loan.interestRate, 2), numericValue: roundAmount(inputs.loan.interestRate) },
    ...summaryItems.map((item) => ({
      label: item.label,
      value: formatCurrency(item.value),
      numericValue: roundAmount(item.value),
    })),
    {
      label: 'Lifetime Cost',
      value: formatCurrency(result.paymentBreakdown.lifetimeCost),
      numericValue: roundAmount(result.paymentBreakdown.lifetimeCost),
    },
    {
      label: 'Annual Inflation Rate',
      value: formatPercent(inputs.annualInflationRate, 2),
      numericValue: roundAmount(inputs.annualInflationRate),
    },
    ...toInflationExportRows(
      formatInflationSummaryRows(getHomeLoanInflationSummaryRows(result.inflation)),
    ),
  ];

  return {
    calculatorId: 'home-loan',
    calculatorName: 'Home Loan EMI Calculator',
    subtitle: 'Includes taxes, insurance, maintenance, and prepayments',
    generatedAt: new Date().toISOString(),
    summaryRows,
    breakdownSegments: toBreakdown(donutSegments),
    amortizationYears: result.amortizationYears,
    chartData: result.chartData,
    thirdColumnLabel: 'Taxes/Ins/Maint',
    fileBaseName: 'home-loan-emi',
  };
}

export function buildLoanSuiteExportPayload(
  inputs: LoanCalculatorInputs,
  result: LoanCalculatorResult,
  formattedSummary: { label: string; displayValue: string; value: number }[],
): CalculatorExportPayload {
  const modeLabel = LOAN_MODE_TABS.find((tab) => tab.key === inputs.mode)?.label ?? 'Loan Calculator';

  const summaryRows = [
    { label: 'Calculator Mode', value: modeLabel },
    { label: 'Loan Amount', value: formatCurrency(inputs.loanAmount), numericValue: roundAmount(inputs.loanAmount) },
    { label: 'Target EMI', value: formatCurrency(inputs.targetEmi), numericValue: roundAmount(inputs.targetEmi) },
    { label: 'Interest Rate', value: formatPercent(inputs.interestRate, 2), numericValue: roundAmount(inputs.interestRate) },
    { label: 'Processing Fees', value: formatCurrency(inputs.processingFees), numericValue: roundAmount(inputs.processingFees) },
    { label: 'EMI Scheme', value: inputs.emiScheme === 'advance' ? 'In Advance' : 'In Arrears' },
    ...formattedSummary.map((item) => ({
      label: item.label,
      value: item.displayValue,
      numericValue: roundAmount(item.value),
    })),
    {
      label: 'Annual Inflation Rate',
      value: formatPercent(inputs.annualInflationRate, 2),
      numericValue: roundAmount(inputs.annualInflationRate),
    },
    ...toInflationExportRows(
      formatInflationSummaryRows(getInflationSummaryRows(result.inflation)),
    ),
  ];

  return {
    calculatorId: 'loan-suite',
    calculatorName: 'Loan Suite Calculator',
    subtitle: modeLabel,
    generatedAt: new Date().toISOString(),
    summaryRows,
    breakdownSegments: toBreakdown(result.donutSegments),
    amortizationYears: result.amortizationYears,
    chartData: result.chartData,
    thirdColumnLabel: 'Extra/Other',
    footnotes: ['Loan APR reflects interest plus upfront fees (excludes GST).'],
    fileBaseName: `loan-suite-${inputs.mode}`,
  };
}

export function buildCreditCardExportPayload(
  inputs: CreditCardCalculatorInputs,
  result: CreditCardCalculatorResult,
  formattedSummary: { label: string; displayValue: string; value: number }[],
): CalculatorExportPayload {
  const summaryRows = [
    {
      label: 'Transaction Amount',
      value: formatCurrency(inputs.transactionAmount),
      numericValue: roundAmount(inputs.transactionAmount),
    },
    {
      label: 'Interest Rate',
      value: formatPercent(inputs.interestRate, 2),
      numericValue: roundAmount(inputs.interestRate),
    },
    {
      label: 'Tenure (months)',
      value: String(inputs.tenureMonths),
      numericValue: inputs.tenureMonths,
    },
    {
      label: 'Processing Fee (pre-GST)',
      value: formatCurrency(inputs.processingFeePreGst),
      numericValue: roundAmount(inputs.processingFeePreGst),
    },
    {
      label: 'GST Rate',
      value: formatPercent(inputs.gstRate, 0),
      numericValue: roundAmount(inputs.gstRate),
    },
    {
      label: 'Processing Fee GST',
      value: formatCurrency(result.processingFeeGst),
      numericValue: roundAmount(result.processingFeeGst),
    },
    ...formattedSummary.map((item) => ({
      label: item.label.replace('†', '').trim(),
      value: item.displayValue,
      numericValue: roundAmount(item.value),
    })),
    {
      label: 'Annual Inflation Rate',
      value: formatPercent(inputs.annualInflationRate, 2),
      numericValue: roundAmount(inputs.annualInflationRate),
    },
    ...toInflationExportRows(
      formatInflationSummaryRows(getInflationSummaryRows(result.inflation)),
    ),
  ];

  return {
    calculatorId: 'credit-card',
    calculatorName: 'Credit Card EMI Calculator with GST',
    subtitle: 'EMI conversion with GST on processing fees and interest',
    generatedAt: new Date().toISOString(),
    summaryRows,
    breakdownSegments: toBreakdown(result.donutSegments),
    amortizationYears: result.amortizationYears,
    creditCardChartData: result.chartData,
    thirdColumnLabel: 'GST on Interest',
    footnotes: ['APR calculation excludes GST applied on processing fees and interest.'],
    fileBaseName: 'credit-card-emi-gst',
  };
}

export function getYearlyExportRows(payload: CalculatorExportPayload) {
  const headers = [
    'Year',
    'Principal',
    'Interest',
    payload.thirdColumnLabel,
    'Prepayment',
    'Total Payment',
    'Balance',
    'Loan Paid %',
  ];

  const rows = payload.amortizationYears.map((yearRow) => [
    yearRow.year,
    roundAmount(yearRow.principal),
    roundAmount(yearRow.interest),
    roundAmount(yearRow.taxesInsuranceMaintenance),
    roundAmount(yearRow.prepayment),
    roundAmount(yearRow.totalPayment),
    roundAmount(yearRow.balance),
    roundAmount(yearRow.loanPaidPercent),
  ]);

  return { headers, rows };
}

export { flattenMonthlyRows };
