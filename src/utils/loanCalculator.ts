import { colors } from '../theme/colors';
import {
  AmortizationMonth,
  AmortizationYear,
  ChartYearData,
  DonutSegment,
  MonthYear,
  SummaryLineItem,
  TenureMode,
} from '../types/calculator';
import {
  EmiScheme,
  LoanCalculatorInputs,
  LoanCalculatorMode,
  LoanCalculatorResult,
  ResolvedLoanParameters,
} from '../types/loanCalculator';
import { addMonths, roundAmount } from './format';
import { calculateInflationImpact } from './inflation';

function getTenureMonths(tenure: number, mode: TenureMode): number {
  return mode === 'years' ? Math.round(tenure * 12) : Math.round(tenure);
}

function monthlyRate(annualRate: number): number {
  return annualRate / 12 / 100;
}

function emiFromPrincipal(
  principal: number,
  annualRate: number,
  months: number,
  scheme: EmiScheme,
): number {
  if (principal <= 0 || months <= 0) {
    return 0;
  }

  const rate = monthlyRate(annualRate);
  if (rate === 0) {
    return roundAmount(principal / months);
  }

  const factor = Math.pow(1 + rate, months);
  if (scheme === 'advance') {
    return roundAmount(
      (principal * rate * Math.pow(1 + rate, months - 1)) / (factor - 1),
    );
  }

  return roundAmount((principal * rate * factor) / (factor - 1));
}

function principalFromEmi(
  emi: number,
  annualRate: number,
  months: number,
  scheme: EmiScheme,
): number {
  if (emi <= 0 || months <= 0) {
    return 0;
  }

  const rate = monthlyRate(annualRate);
  if (rate === 0) {
    return roundAmount(emi * months);
  }

  const factor = Math.pow(1 + rate, months);
  if (scheme === 'advance') {
    return roundAmount((emi * (factor - 1)) / (rate * Math.pow(1 + rate, months - 1)));
  }

  return roundAmount((emi * (factor - 1)) / (rate * factor));
}

function tenureFromEmi(
  principal: number,
  emi: number,
  annualRate: number,
  scheme: EmiScheme,
): number {
  if (principal <= 0 || emi <= 0) {
    return 0;
  }

  const rate = monthlyRate(annualRate);
  if (rate === 0) {
    return Math.ceil(principal / emi);
  }

  const numerator = emi;
  const denominator =
    scheme === 'advance' ? emi - principal * rate : emi - principal * rate;

  if (denominator <= 0) {
    return 0;
  }

  const months = Math.log(numerator / denominator) / Math.log(1 + rate);
  return Math.max(1, Math.ceil(months));
}

function interestRateFromEmi(
  principal: number,
  emi: number,
  months: number,
  scheme: EmiScheme,
): number {
  if (principal <= 0 || emi <= 0 || months <= 0) {
    return 0;
  }

  let low = 0;
  let high = 100;

  for (let iteration = 0; iteration < 80; iteration += 1) {
    const mid = (low + high) / 2;
    const estimatedEmi = emiFromPrincipal(principal, mid, months, scheme);
    if (estimatedEmi > emi) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return roundAmount((low + high) / 2);
}

function calculateLoanApr(
  principal: number,
  emi: number,
  months: number,
  fees: number,
  scheme: EmiScheme,
): number {
  if (principal <= 0 || emi <= 0 || months <= 0) {
    return 0;
  }

  const netProceeds = principal - fees;
  if (netProceeds <= 0) {
    return 0;
  }

  let low = 0;
  let high = 0.15;

  for (let iteration = 0; iteration < 100; iteration += 1) {
    const mid = (low + high) / 2;
    let npv = -netProceeds;

    for (let month = 1; month <= months; month += 1) {
      const discount = Math.pow(1 + mid, scheme === 'advance' ? month - 1 : month);
      npv += emi / discount;
    }

    if (npv > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return roundAmount(((low + high) / 2) * 12 * 100);
}

function resolveParameters(inputs: LoanCalculatorInputs): ResolvedLoanParameters {
  const monthsInput = getTenureMonths(inputs.tenure, inputs.tenureMode);

  switch (inputs.mode) {
    case 'affordability': {
      const principal = principalFromEmi(
        inputs.targetEmi,
        inputs.interestRate,
        monthsInput,
        inputs.emiScheme,
      );
      return {
        principal,
        annualRate: inputs.interestRate,
        months: monthsInput,
        emi: inputs.targetEmi,
      };
    }
    case 'tenure': {
      const months = tenureFromEmi(
        inputs.loanAmount,
        inputs.targetEmi,
        inputs.interestRate,
        inputs.emiScheme,
      );
      return {
        principal: inputs.loanAmount,
        annualRate: inputs.interestRate,
        months,
        emi: inputs.targetEmi,
      };
    }
    case 'interest': {
      const annualRate = interestRateFromEmi(
        inputs.loanAmount,
        inputs.targetEmi,
        monthsInput,
        inputs.emiScheme,
      );
      return {
        principal: inputs.loanAmount,
        annualRate,
        months: monthsInput,
        emi: inputs.targetEmi,
      };
    }
    case 'emi':
    default: {
      const emi = emiFromPrincipal(
        inputs.loanAmount,
        inputs.interestRate,
        monthsInput,
        inputs.emiScheme,
      );
      return {
        principal: inputs.loanAmount,
        annualRate: inputs.interestRate,
        months: monthsInput,
        emi,
      };
    }
  }
}

function buildSchedule(
  principal: number,
  annualRate: number,
  months: number,
  emi: number,
  startDate: MonthYear,
  extraMonthlyPayment: number,
  scheme: EmiScheme,
): AmortizationMonth[] {
  const schedule: AmortizationMonth[] = [];
  const rate = monthlyRate(annualRate);
  let balance = principal;

  for (let monthIndex = 0; monthIndex < months && balance > 0.01; monthIndex += 1) {
    const interest =
      scheme === 'advance' && monthIndex === 0
        ? balance * rate
        : balance * rate;

    let payment = Math.min(emi, balance + interest);
    let principalPaid = Math.max(0, payment - interest);
    let extra = extraMonthlyPayment;

    if (principalPaid + extra > balance) {
      extra = Math.max(0, balance - principalPaid);
    }

    balance = Math.max(0, balance - principalPaid - extra);
    const loanPaidPercent = principal > 0 ? ((principal - balance) / principal) * 100 : 100;

    schedule.push({
      monthIndex,
      date: addMonths(startDate, monthIndex),
      principal: roundAmount(principalPaid),
      interest: roundAmount(interest),
      prepayment: roundAmount(extra),
      taxesInsuranceMaintenance: 0,
      totalPayment: roundAmount(principalPaid + interest + extra),
      balance: roundAmount(balance),
      loanPaidPercent: roundAmount(loanPaidPercent),
    });

    if (extraMonthlyPayment > 0 && balance <= 0.01) {
      break;
    }
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
        prepayment: roundAmount(yearMonths.reduce((sum, item) => sum + item.prepayment, 0)),
        taxesInsuranceMaintenance: 0,
        totalPayment: roundAmount(yearMonths.reduce((sum, item) => sum + item.totalPayment, 0)),
        balance: roundAmount(lastMonth.balance),
        loanPaidPercent: roundAmount(lastMonth.loanPaidPercent),
        months: yearMonths,
      };
    });
}

function toChartData(years: AmortizationYear[]): ChartYearData[] {
  return years.map((year) => ({
    year: year.year,
    principal: year.principal,
    prepayment: year.prepayment,
    interest: year.interest,
    taxesInsuranceMaintenance: 0,
    balance: year.balance,
    totalPayment: year.totalPayment,
  }));
}

function buildSummaryItems(
  mode: LoanCalculatorMode,
  resolved: ResolvedLoanParameters,
  loanApr: number,
  totalInterest: number,
  totalPayment: number,
  actualMonths: number,
): SummaryLineItem[] {
  const items: SummaryLineItem[] = [
    {
      key: 'emi',
      label: 'Loan EMI',
      value: resolved.emi,
      emphasized: mode === 'emi' || mode === 'affordability',
    },
    {
      key: 'apr',
      label: 'Loan APR',
      value: loanApr,
    },
    {
      key: 'interest',
      label: 'Total Interest Payable',
      value: totalInterest,
    },
    {
      key: 'total',
      label: 'Total Payment',
      value: totalPayment,
      emphasized: true,
    },
  ];

  if (mode === 'affordability') {
    items.unshift({
      key: 'affordable',
      label: 'Affordable Loan Amount',
      value: resolved.principal,
      emphasized: true,
    });
  }

  if (mode === 'tenure') {
    items.unshift({
      key: 'tenureMonths',
      label: 'Home Loan Tenure',
      value: actualMonths,
      emphasized: true,
    });
  }

  if (mode === 'interest') {
    items.unshift({
      key: 'interestRate',
      label: 'Effective Interest Rate',
      value: resolved.annualRate,
      emphasized: true,
    });
  }

  if (actualMonths < resolved.months && mode !== 'tenure') {
    items.splice(mode === 'interest' ? 1 : mode === 'affordability' ? 2 : 1, 0, {
      key: 'revisedTenure',
      label: 'Revised Tenure (with extra payment)',
      value: actualMonths,
      emphasized: mode === 'emi',
    });
  }

  return items;
}

export function calculateLoanCalculator(inputs: LoanCalculatorInputs): LoanCalculatorResult {
  const resolved = resolveParameters(inputs);
  const schedule = buildSchedule(
    resolved.principal,
    resolved.annualRate,
    resolved.months,
    resolved.emi,
    inputs.startDate,
    inputs.extraMonthlyPayment,
    inputs.emiScheme,
  );

  const totalInterest = roundAmount(schedule.reduce((sum, row) => sum + row.interest, 0));
  const totalPrepayment = roundAmount(schedule.reduce((sum, row) => sum + row.prepayment, 0));
  const totalPrincipal = roundAmount(schedule.reduce((sum, row) => sum + row.principal, 0));
  const totalPayment = roundAmount(
    totalPrincipal + totalInterest + totalPrepayment + inputs.processingFees,
  );
  const actualMonths = schedule.length;
  const loanApr = calculateLoanApr(
    resolved.principal,
    resolved.emi,
    actualMonths,
    inputs.processingFees,
    inputs.emiScheme,
  );

  const amortizationYears = aggregateYears(schedule);
  const inflation = calculateInflationImpact({
    annualInflationRate: inputs.annualInflationRate,
    monthlyPayments: schedule,
    upfrontOutflow: inputs.processingFees,
    principalReference: resolved.principal,
  });
  const donutSegments = (
    [
      {
        key: 'principal' as const,
        label: 'Principal',
        value: totalPrincipal + totalPrepayment,
        color: colors.chart.principal,
      },
      {
        key: 'interest' as const,
        label: 'Interest',
        value: totalInterest,
        color: colors.chart.interest,
      },
      {
        key: 'downPayment' as const,
        label: 'Fees & Charges',
        value: inputs.processingFees,
        color: colors.chart.downPayment,
      },
    ] satisfies DonutSegment[]
  ).filter((segment) => segment.value > 0);

  return {
    resolved,
    loanApr,
    totalInterest,
    totalPayment,
    amortizationYears,
    chartData: toChartData(amortizationYears),
    donutSegments,
    summaryItems: buildSummaryItems(
      inputs.mode,
      resolved,
      loanApr,
      totalInterest,
      totalPayment,
      actualMonths,
    ),
    inflation,
  };
}

export const LOAN_MODE_TABS = [
  {
    key: 'emi' as const,
    label: 'EMI Calculator',
    shortLabel: 'EMI',
    description: 'Calculate monthly payment from loan amount, rate and tenure.',
  },
  {
    key: 'affordability' as const,
    label: 'Loan Affordability',
    shortLabel: 'Amount',
    description: 'Find how much you can borrow for a comfortable EMI.',
  },
  {
    key: 'tenure' as const,
    label: 'Loan Tenure',
    shortLabel: 'Tenure',
    description: 'Estimate repayment duration for a fixed EMI.',
  },
  {
    key: 'interest' as const,
    label: 'Interest Rate',
    shortLabel: 'Rate',
    description: 'Uncover the true rate behind low-EMI retail schemes.',
  },
];
