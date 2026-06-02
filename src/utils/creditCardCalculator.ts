import { colors } from '../theme/colors';
import {
  AmortizationMonth,
  AmortizationYear,
  DonutSegment,
  MonthYear,
  SummaryLineItem,
} from '../types/calculator';
import {
  CreditCardCalculatorInputs,
  CreditCardCalculatorResult,
  CreditCardChartPoint,
} from '../types/creditCardCalculator';
import { addMonths, formatMonthYear, roundAmount } from './format';

function monthlyRate(annualRate: number): number {
  return annualRate / 12 / 100;
}

function emiFromPrincipal(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) {
    return 0;
  }

  const rate = monthlyRate(annualRate);
  if (rate === 0) {
    return roundAmount(principal / months);
  }

  const factor = Math.pow(1 + rate, months);
  return roundAmount((principal * rate * factor) / (factor - 1));
}

function calculateAprExcludingGst(
  principal: number,
  emi: number,
  months: number,
  processingFeePreGst: number,
): number {
  if (principal <= 0 || emi <= 0 || months <= 0) {
    return 0;
  }

  const netProceeds = principal - processingFeePreGst;
  if (netProceeds <= 0) {
    return 0;
  }

  let low = 0;
  let high = 0.15;

  for (let iteration = 0; iteration < 100; iteration += 1) {
    const mid = (low + high) / 2;
    let npv = -netProceeds;

    for (let month = 1; month <= months; month += 1) {
      npv += emi / Math.pow(1 + mid, month);
    }

    if (npv > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return roundAmount(((low + high) / 2) * 12 * 100);
}

function buildSchedule(
  principal: number,
  annualRate: number,
  months: number,
  emi: number,
  gstRate: number,
  startDate: MonthYear,
): AmortizationMonth[] {
  const schedule: AmortizationMonth[] = [];
  const rate = monthlyRate(annualRate);
  let balance = principal;

  for (let monthIndex = 0; monthIndex < months && balance > 0.01; monthIndex += 1) {
    const interest = balance * rate;
    const gstOnInterest = interest * (gstRate / 100);
    const principalPaid = Math.max(0, Math.min(emi - interest, balance));
    balance = Math.max(0, balance - principalPaid);
    const loanPaidPercent = principal > 0 ? ((principal - balance) / principal) * 100 : 100;

    schedule.push({
      monthIndex,
      date: addMonths(startDate, monthIndex),
      principal: roundAmount(principalPaid),
      interest: roundAmount(interest),
      prepayment: 0,
      taxesInsuranceMaintenance: roundAmount(gstOnInterest),
      totalPayment: roundAmount(principalPaid + interest + gstOnInterest),
      balance: roundAmount(balance),
      loanPaidPercent: roundAmount(loanPaidPercent),
    });
  }

  return schedule;
}

function aggregateYears(months: AmortizationMonth[]): AmortizationYear[] {
  const yearMap = new Map<number, AmortizationMonth[]>();

  months.forEach((month) => {
    const existing = yearMap.get(month.date.year) ?? [];
    existing.push(month);
    yearMap.set(month.date.year, existing);
  });

  return Array.from(yearMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, yearMonths]) => {
      const lastMonth = yearMonths[yearMonths.length - 1];
      return {
        year,
        principal: roundAmount(yearMonths.reduce((sum, item) => sum + item.principal, 0)),
        interest: roundAmount(yearMonths.reduce((sum, item) => sum + item.interest, 0)),
        prepayment: 0,
        taxesInsuranceMaintenance: roundAmount(
          yearMonths.reduce((sum, item) => sum + item.taxesInsuranceMaintenance, 0),
        ),
        totalPayment: roundAmount(yearMonths.reduce((sum, item) => sum + item.totalPayment, 0)),
        balance: roundAmount(lastMonth.balance),
        loanPaidPercent: roundAmount(lastMonth.loanPaidPercent),
        months: yearMonths,
      };
    });
}

function toChartData(months: AmortizationMonth[]): CreditCardChartPoint[] {
  return months.map((month) => ({
    label: formatMonthYear(month.date),
    principal: month.principal,
    interest: month.interest,
    gstOnInterest: month.taxesInsuranceMaintenance,
    balance: month.balance,
    totalPayment: month.totalPayment,
  }));
}

function buildSummaryItems(
  emi: number,
  apr: number,
  totalInterest: number,
  totalPayment: number,
): SummaryLineItem[] {
  return [
    {
      key: 'emi',
      label: 'Monthly EMI',
      value: emi,
      emphasized: true,
    },
    {
      key: 'apr',
      label: 'Annual Percentage Rate (APR)†',
      value: apr,
    },
    {
      key: 'interest',
      label: 'Total Interest Payable',
      value: totalInterest,
    },
    {
      key: 'total',
      label: 'Total of all Payments',
      value: totalPayment,
      emphasized: true,
    },
  ];
}

export function calculateCreditCardCalculator(
  inputs: CreditCardCalculatorInputs,
): CreditCardCalculatorResult {
  const principal = inputs.transactionAmount;
  const months = Math.max(1, Math.round(inputs.tenureMonths));
  const emi = emiFromPrincipal(principal, inputs.interestRate, months);
  const processingFeeGst = roundAmount(inputs.processingFeePreGst * (inputs.gstRate / 100));
  const totalProcessingFees = roundAmount(inputs.processingFeePreGst + processingFeeGst);

  const schedule = buildSchedule(
    principal,
    inputs.interestRate,
    months,
    emi,
    inputs.gstRate,
    inputs.startDate,
  );

  const totalInterest = roundAmount(schedule.reduce((sum, row) => sum + row.interest, 0));
  const totalGstOnInterest = roundAmount(
    schedule.reduce((sum, row) => sum + row.taxesInsuranceMaintenance, 0),
  );
  const totalPayment = roundAmount(
    principal + totalProcessingFees + totalInterest + totalGstOnInterest,
  );

  const apr = calculateAprExcludingGst(
    principal,
    emi,
    months,
    inputs.processingFeePreGst,
  );

  const donutSegments = (
    [
      {
        key: 'principal' as const,
        label: 'Transaction Amount',
        value: principal,
        color: colors.chart.downPayment,
      },
      {
        key: 'prepayments' as const,
        label: 'Processing Fees + GST',
        value: totalProcessingFees,
        color: colors.chart.principal,
      },
      {
        key: 'interest' as const,
        label: 'Total Interest Payable',
        value: totalInterest,
        color: colors.chart.interest,
      },
      {
        key: 'taxesInsurance' as const,
        label: 'GST on Interest',
        value: totalGstOnInterest,
        color: colors.chart.taxesInsurance,
      },
    ] satisfies DonutSegment[]
  ).filter((segment) => segment.value > 0);

  return {
    emi,
    apr,
    processingFeeGst,
    totalProcessingFees,
    totalInterest,
    totalGstOnInterest,
    totalPayment,
    amortizationYears: aggregateYears(schedule),
    chartData: toChartData(schedule),
    donutSegments,
    summaryItems: buildSummaryItems(emi, apr, totalInterest, totalPayment),
  };
}
