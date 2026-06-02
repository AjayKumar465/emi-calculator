import { colors } from '../theme/colors';
import {
  AmortizationMonth,
  AmortizationYear,
  CalculatorInputs,
  CalculatorResult,
  ChartYearData,
  MonthYear,
  PaymentBreakdown,
  Prepayments,
  ValueMode,
} from '../types/calculator';
import { addMonths, monthYearToIndex } from './format';

function resolveModeValue(
  base: number,
  value: number,
  mode: ValueMode,
): number {
  if (mode === 'percent') {
    return (base * value) / 100;
  }
  return value;
}

function getTenureMonths(tenure: number, mode: 'years' | 'months'): number {
  return mode === 'years' ? Math.round(tenure * 12) : Math.round(tenure);
}

function calculateEmi(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) {
    return principal / months;
  }

  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

function isSameOrAfter(current: MonthYear, target: MonthYear): boolean {
  return monthYearToIndex(current) >= monthYearToIndex(target);
}

function getPrepaymentForMonth(
  monthDate: MonthYear,
  prepayments: Prepayments,
): number {
  let total = 0;
  const absoluteIndex = monthYearToIndex(monthDate);

  if (
    prepayments.monthly.amount > 0 &&
    isSameOrAfter(monthDate, prepayments.monthly.startDate)
  ) {
    total += prepayments.monthly.amount;
  }

  if (
    prepayments.yearly.amount > 0 &&
    isSameOrAfter(monthDate, prepayments.yearly.startDate)
  ) {
    const monthsSinceStart =
      absoluteIndex - monthYearToIndex(prepayments.yearly.startDate);
    if (monthsSinceStart >= 0 && monthsSinceStart % 12 === 0) {
      total += prepayments.yearly.amount;
    }
  }

  if (
    prepayments.quarterly.amount > 0 &&
    isSameOrAfter(monthDate, prepayments.quarterly.startDate)
  ) {
    const monthsSinceStart =
      absoluteIndex - monthYearToIndex(prepayments.quarterly.startDate);
    if (monthsSinceStart >= 0 && monthsSinceStart % 3 === 0) {
      total += prepayments.quarterly.amount;
    }
  }

  if (
    prepayments.oneTime.amount > 0 &&
    absoluteIndex === monthYearToIndex(prepayments.oneTime.startDate)
  ) {
    total += prepayments.oneTime.amount;
  }

  return total;
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
        principal: yearMonths.reduce((sum, item) => sum + item.principal, 0),
        interest: yearMonths.reduce((sum, item) => sum + item.interest, 0),
        prepayment: yearMonths.reduce((sum, item) => sum + item.prepayment, 0),
        taxesInsuranceMaintenance: yearMonths.reduce(
          (sum, item) => sum + item.taxesInsuranceMaintenance,
          0,
        ),
        totalPayment: yearMonths.reduce((sum, item) => sum + item.totalPayment, 0),
        balance: lastMonth.balance,
        loanPaidPercent: lastMonth.loanPaidPercent,
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
    taxesInsuranceMaintenance: year.taxesInsuranceMaintenance,
    balance: year.balance,
    totalPayment: year.totalPayment,
  }));
}

export function calculateEMI(inputs: CalculatorInputs): CalculatorResult {
  const { loan, expenses, prepayments } = inputs;

  const downPaymentAmount = resolveModeValue(
    loan.propertyValue,
    loan.downPayment,
    loan.downPaymentMode,
  );
  const upfrontCostsAmount = resolveModeValue(
    loan.propertyValue,
    expenses.upfrontCosts,
    expenses.upfrontCostsMode,
  );

  const netLoanAmount = Math.max(
    0,
    loan.propertyValue - downPaymentAmount - loan.loanProtection,
  );

  const totalMonths = getTenureMonths(loan.tenure, loan.tenureMode);
  const monthlyRate = loan.interestRate / 12 / 100;
  const monthlyPropertyTax = expenses.annualPropertyTax / 12;
  const monthlyHomeInsurance = expenses.annualHomeInsurance / 12;
  const monthlyMaintenance = expenses.monthlyMaintenance;
  const monthlyTaxesInsuranceMaintenance =
    monthlyPropertyTax + monthlyHomeInsurance + monthlyMaintenance;

  let balance = netLoanAmount;
  let totalPrincipalPaid = 0;
  let totalInterestPaid = 0;
  let totalPrepayments = 0;
  let totalTaxesInsuranceMaintenance = 0;

  const schedule: AmortizationMonth[] = [];
  const baseEmi = calculateEmi(netLoanAmount, loan.interestRate, totalMonths);

  for (let monthIndex = 0; monthIndex < totalMonths && balance > 0; monthIndex += 1) {
    const date = addMonths(loan.startDate, monthIndex);
    const interest = balance * monthlyRate;
    let principal = Math.min(balance, Math.max(0, baseEmi - interest));
    let prepayment = getPrepaymentForMonth(date, prepayments);

    if (principal + prepayment > balance) {
      prepayment = Math.max(0, balance - principal);
    }

    balance = Math.max(0, balance - principal - prepayment);

    totalPrincipalPaid += principal;
    totalInterestPaid += interest;
    totalPrepayments += prepayment;
    totalTaxesInsuranceMaintenance += monthlyTaxesInsuranceMaintenance;

    const loanPaidPercent =
      netLoanAmount > 0 ? ((netLoanAmount - balance) / netLoanAmount) * 100 : 100;

    schedule.push({
      monthIndex,
      date,
      principal,
      interest,
      prepayment,
      taxesInsuranceMaintenance: monthlyTaxesInsuranceMaintenance,
      totalPayment:
        principal + interest + prepayment + monthlyTaxesInsuranceMaintenance,
      balance,
      loanPaidPercent,
    });
  }

  const monthlyExtraPayment =
    prepayments.monthly.amount > 0 &&
    isSameOrAfter(loan.startDate, prepayments.monthly.startDate)
      ? prepayments.monthly.amount
      : 0;

  const paymentBreakdown: PaymentBreakdown = {
    downPaymentAndFees:
      downPaymentAmount + loan.processingFees + upfrontCostsAmount,
    principal: totalPrincipalPaid,
    prepayments: totalPrepayments,
    interest: totalInterestPaid,
    taxesInsuranceMaintenance: totalTaxesInsuranceMaintenance,
    lifetimeCost:
      downPaymentAmount +
      loan.processingFees +
      upfrontCostsAmount +
      totalPrincipalPaid +
      totalPrepayments +
      totalInterestPaid +
      totalTaxesInsuranceMaintenance,
  };

  const amortizationYears = aggregateYears(schedule);

  return {
    netLoanAmount,
    downPaymentAmount,
    upfrontCostsAmount,
    monthlyBreakdown: {
      baseEmi,
      extraMonthlyPayment: monthlyExtraPayment,
      propertyTax: monthlyPropertyTax,
      homeInsurance: monthlyHomeInsurance,
      maintenance: monthlyMaintenance,
      totalMonthlyOutgo:
        baseEmi +
        monthlyExtraPayment +
        monthlyPropertyTax +
        monthlyHomeInsurance +
        monthlyMaintenance,
    },
    paymentBreakdown,
    amortizationYears,
    chartData: toChartData(amortizationYears),
  };
}

export function getDonutSegments(result: CalculatorResult) {
  const { paymentBreakdown } = result;

  return [
    {
      key: 'downPayment' as const,
      label: 'Down Payment & Fees',
      value: paymentBreakdown.downPaymentAndFees,
      color: colors.chart.downPayment,
    },
    {
      key: 'principal' as const,
      label: 'Principal',
      value: paymentBreakdown.principal,
      color: colors.chart.principal,
    },
    {
      key: 'prepayments' as const,
      label: 'Prepayments',
      value: paymentBreakdown.prepayments,
      color: colors.chart.prepayments,
    },
    {
      key: 'interest' as const,
      label: 'Interest',
      value: paymentBreakdown.interest,
      color: colors.chart.interest,
    },
    {
      key: 'taxesInsurance' as const,
      label: 'Taxes, Insurance & Maintenance',
      value: paymentBreakdown.taxesInsuranceMaintenance,
      color: colors.chart.taxesInsurance,
    },
  ].filter((segment) => segment.value > 0);
}
