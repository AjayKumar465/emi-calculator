export interface InflationImpact {
  annualInflationRate: number;
  nominalTotalOutflow: number;
  realTotalOutflow: number;
  inflationBenefitOnPayments: number;
  nominalInterestCost: number;
  realInterestCost: number;
  interestInflationBenefit: number;
}

export interface HomeLoanInflationImpact extends InflationImpact {
  propertyAppreciationRatePerYear: number;
  propertyValueAtEnd: number;
  propertyAppreciationGain: number;
  netCombinedBenefit: number;
}

export interface InflationSummaryRow {
  key: string;
  label: string;
  value: number;
  emphasized?: boolean;
  isCurrency?: boolean;
  isPercent?: boolean;
}
