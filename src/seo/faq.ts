import { SeoPageKey } from './metadata';

export interface FaqItem {
  question: string;
  answer: string;
}

export const GLOBAL_FAQ: FaqItem[] = [
  {
    question: 'Is this EMI calculator free to use?',
    answer:
      'Yes. All calculators on EMI Calculator are completely free — home loan EMI, personal loan, credit card EMI with GST, SIP, PPF, SSY, compounding, and future cost planner. No signup required.',
  },
  {
    question: 'How is this different from other EMI calculators online?',
    answer:
      'Most EMI calculators only show basic monthly payment. Ours includes inflation-adjusted real cost, prepayment impact, property appreciation for home loans, GST on credit card EMI, year-by-year amortization, visual charts, and PDF/Excel export with graphs — all in one place.',
  },
  {
    question: 'Can I export my calculation results?',
    answer:
      'Yes. Every calculator supports PDF and Excel export with summary tables, donut breakdown charts, and schedule/growth graphs. Excel files use plain numbers so you can continue calculating in spreadsheets.',
  },
  {
    question: 'Does the calculator include inflation?',
    answer:
      'Yes. All calculators include an annual inflation rate input. You see both nominal values and inflation-adjusted (real) values so you understand true purchasing power over time.',
  },
  {
    question: 'Is my data stored or shared?',
    answer:
      'No. All calculations run locally in your browser or app. We do not store, sell, or share your financial inputs.',
  },
  {
    question: 'Which calculators are included?',
    answer:
      'Home Loan EMI, Loan Suite (EMI, affordability, tenure, hidden rate), Credit Card EMI with GST, SIP with step-up, PPF, SSY (Sukanya Samriddhi), Compound Interest, and Future Cost Planner.',
  },
];

export const PAGE_FAQ: Partial<Record<SeoPageKey, FaqItem[]>> = {
  'home-loan': [
    {
      question: 'How is home loan EMI calculated?',
      answer:
        'EMI uses the standard reducing balance formula: EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is loan amount, r is monthly interest rate, and n is tenure in months. Our calculator also adds taxes, insurance, maintenance, and prepayments.',
    },
    {
      question: 'What is inflation benefit on a home loan?',
      answer:
        'As inflation rises, the real (inflation-adjusted) cost of your fixed EMI decreases over time. We also model property appreciation so you can see net combined benefit of owning vs renting.',
    },
    {
      question: 'Can I model prepayments on my home loan?',
      answer:
        'Yes. Add one-time or recurring prepayments to see how they reduce interest, shorten tenure, and lower total lifetime cost with updated amortization schedules.',
    },
  ],
  'loan-suite': [
    {
      question: 'What loan modes does the Loan Suite include?',
      answer:
        'Four modes: calculate EMI from loan amount, find affordable loan for a target EMI, estimate tenure for fixed EMI, and uncover the true interest rate behind low-EMI retail schemes.',
    },
    {
      question: 'Does it include processing fees and APR?',
      answer:
        'Yes. Processing fees are factored in, and we show effective APR reflecting interest plus upfront fees for a true cost comparison.',
    },
  ],
  'credit-card': [
    {
      question: 'Does this credit card EMI calculator include GST?',
      answer:
        'Yes. GST is applied on processing fees and on interest charges separately, matching how Indian banks structure credit card EMI conversions.',
    },
    {
      question: 'What is the true cost of credit card EMI?',
      answer:
        'Beyond the advertised rate, GST and processing fees increase total cost. Our calculator shows principal, interest, GST breakdown, and effective APR.',
    },
  ],
  sip: [
    {
      question: 'What is step-up SIP?',
      answer:
        'Step-up SIP increases your monthly investment by a fixed percentage each year. This models salary growth and helps accelerate wealth accumulation compared to flat SIP.',
    },
    {
      question: 'What is real vs nominal SIP maturity value?',
      answer:
        'Nominal value is the projected corpus at expected returns. Real value adjusts for inflation to show what that money is worth in today\'s purchasing power.',
    },
  ],
  ppf: [
    {
      question: 'How does PPF interest compound?',
      answer:
        'PPF interest compounds annually on the lowest balance between the 5th and last day of each month. Our calculator applies annual compounding with yearly deposits.',
    },
  ],
  ssy: [
    {
      question: 'How long do I deposit in SSY?',
      answer:
        'Deposits are made for 15 years from account opening. The account matures when the girl child turns 21, with interest continuing on the accumulated balance.',
    },
  ],
  compounding: [
    {
      question: 'What compounding frequencies are supported?',
      answer:
        'Monthly, quarterly, half-yearly, and annual compounding. You can also add periodic contributions at the same frequency.',
    },
  ],
  'future-cost': [
    {
      question: 'How does the future cost planner work?',
      answer:
        'Enter current monthly expenses and an annual inflation rate. The calculator projects expenses to your target year, showing how much more you will need due to inflation.',
    },
  ],
};

export function getFaqForPage(key: SeoPageKey): FaqItem[] {
  const pageFaq = PAGE_FAQ[key] ?? [];
  return [...pageFaq, ...GLOBAL_FAQ.slice(0, 3)];
}
