import { AmortizationMonth } from '../types/calculator';
import { HomeLoanInflationImpact, InflationImpact, InflationSummaryRow } from '../types/inflation';
import { formatCurrency, formatPercent, roundAmount } from './format';

interface CalculateInflationImpactParams {
  annualInflationRate: number;
  monthlyPayments: AmortizationMonth[];
  upfrontOutflow?: number;
  principalReference?: number;
}

function monthlyInflationFactor(annualInflationRate: number): number {
  return Math.pow(1 + annualInflationRate / 100, 1 / 12);
}

function flattenScheduleMonths(monthlyPayments: AmortizationMonth[]): AmortizationMonth[] {
  return monthlyPayments.flatMap((month) => [month]).sort((a, b) => a.monthIndex - b.monthIndex);
}

export function calculateInflationImpact({
  annualInflationRate,
  monthlyPayments,
  upfrontOutflow = 0,
  principalReference = 0,
}: CalculateInflationImpactParams): InflationImpact {
  const safeInflationRate = Math.max(0, annualInflationRate);
  const monthlyFactor = monthlyInflationFactor(safeInflationRate);
  const schedule = flattenScheduleMonths(monthlyPayments);

  const nominalScheduleOutflow = roundAmount(
    schedule.reduce((sum, month) => sum + month.totalPayment, 0),
  );

  const realScheduleOutflow = roundAmount(
    schedule.reduce((sum, month) => {
      const discountFactor = Math.pow(monthlyFactor, month.monthIndex + 1);
      return sum + month.totalPayment / discountFactor;
    }, 0),
  );

  const nominalTotalOutflow = roundAmount(upfrontOutflow + nominalScheduleOutflow);
  const realTotalOutflow = roundAmount(upfrontOutflow + realScheduleOutflow);
  const inflationBenefitOnPayments = roundAmount(
    Math.max(0, nominalTotalOutflow - realTotalOutflow),
  );

  const nominalInterestCost = roundAmount(
    Math.max(0, nominalTotalOutflow - upfrontOutflow - principalReference),
  );
  const realInterestCost = roundAmount(
    Math.max(0, realTotalOutflow - upfrontOutflow - principalReference),
  );
  const interestInflationBenefit = roundAmount(
    Math.max(0, nominalInterestCost - realInterestCost),
  );

  return {
    annualInflationRate: safeInflationRate,
    nominalTotalOutflow,
    realTotalOutflow,
    inflationBenefitOnPayments,
    nominalInterestCost,
    realInterestCost,
    interestInflationBenefit,
  };
}

export function calculateHomeLoanInflationImpact(params: {
  annualInflationRate: number;
  annualPropertyAppreciationRate: number;
  monthlyPayments: AmortizationMonth[];
  upfrontOutflow: number;
  netLoanAmount: number;
  propertyValue: number;
  tenureYears: number;
}): HomeLoanInflationImpact {
  const paymentImpact = calculateInflationImpact({
    annualInflationRate: params.annualInflationRate,
    monthlyPayments: params.monthlyPayments,
    upfrontOutflow: params.upfrontOutflow,
    principalReference: params.netLoanAmount,
  });

  const propertyAppreciationRatePerYear = Math.max(0, params.annualPropertyAppreciationRate);
  const propertyValueStart = roundAmount(params.propertyValue);
  const propertyValueAtEnd = roundAmount(
    propertyValueStart *
      Math.pow(1 + propertyAppreciationRatePerYear / 100, params.tenureYears),
  );
  const propertyAppreciationGain = roundAmount(
    Math.max(0, propertyValueAtEnd - propertyValueStart),
  );
  const netCombinedBenefit = roundAmount(
    paymentImpact.inflationBenefitOnPayments + propertyAppreciationGain,
  );

  return {
    ...paymentImpact,
    propertyAppreciationRatePerYear,
    propertyValueAtEnd,
    propertyAppreciationGain,
    netCombinedBenefit,
  };
}

export function flattenAmortizationSchedule(
  years: { months: AmortizationMonth[] }[],
): AmortizationMonth[] {
  return years.flatMap((year) => year.months);
}

export function getInflationSummaryRows(inflation: InflationImpact): InflationSummaryRow[] {
  return [
    {
      key: 'nominalTotalOutflow',
      label: 'Nominal Total Outflow',
      value: inflation.nominalTotalOutflow,
      isCurrency: true,
    },
    {
      key: 'realTotalOutflow',
      label: 'Real Total Outflow (Today\'s Value)',
      value: inflation.realTotalOutflow,
      isCurrency: true,
    },
    {
      key: 'inflationBenefitOnPayments',
      label: 'Inflation Benefit on Payments',
      value: inflation.inflationBenefitOnPayments,
      emphasized: true,
      isCurrency: true,
    },
    {
      key: 'nominalInterestCost',
      label: 'Nominal Interest Cost',
      value: inflation.nominalInterestCost,
      isCurrency: true,
    },
    {
      key: 'realInterestCost',
      label: 'Real Interest Cost',
      value: inflation.realInterestCost,
      isCurrency: true,
    },
  ];
}

export function getHomeLoanInflationSummaryRows(
  inflation: HomeLoanInflationImpact,
): InflationSummaryRow[] {
  return [
    ...getInflationSummaryRows(inflation),
    {
      key: 'propertyAppreciationRatePerYear',
      label: 'Property Appreciation Rate',
      value: inflation.propertyAppreciationRatePerYear,
      isPercent: true,
    },
    {
      key: 'propertyValueAtEnd',
      label: 'Property Value at Loan End',
      value: inflation.propertyValueAtEnd,
      isCurrency: true,
    },
    {
      key: 'propertyAppreciationGain',
      label: 'Property Appreciation Gain',
      value: inflation.propertyAppreciationGain,
      isCurrency: true,
    },
    {
      key: 'netCombinedBenefit',
      label: 'Net Combined Benefit',
      value: inflation.netCombinedBenefit,
      emphasized: true,
      isCurrency: true,
    },
  ];
}

export function formatInflationSummaryRows(
  rows: InflationSummaryRow[],
): { key: string; label: string; value: number; displayValue: string; emphasized?: boolean }[] {
  return rows.map((row) => ({
    key: row.key,
    label: row.label,
    value: row.value,
    emphasized: row.emphasized,
    displayValue: row.isPercent ? `${formatPercent(row.value, 2)} p.a.` : formatCurrency(row.value),
  }));
}
