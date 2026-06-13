import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './config';

export type SeoPageKey =
  | 'home'
  | 'home-loan'
  | 'loan-suite'
  | 'credit-card'
  | 'sip'
  | 'ppf'
  | 'ssy'
  | 'compounding'
  | 'future-cost';

export interface PageSeoMeta {
  key: SeoPageKey;
  path: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  h1Highlight?: string;
  heroSubtitle: string;
  canonical: string;
}

const pages: Record<SeoPageKey, PageSeoMeta> = {
  home: {
    key: 'home',
    path: '/',
    title: 'Free EMI Calculator India — Home Loan, SIP, PPF & More',
    description:
      'India\'s free all-in-one EMI calculator. Home loan EMI, personal loan, credit card EMI with GST, SIP, PPF, SSY, compounding and inflation planner. Export PDF & Excel with charts.',
    keywords: [
      'emi calculator',
      'home loan emi calculator',
      'loan calculator india',
      'sip calculator',
      'ppf calculator',
      'free emi calculator',
    ],
    h1: 'Your money',
    h1Highlight: 'deserves clarity.',
    heroSubtitle:
      'Free loan and investment calculators with inflation-adjusted results, amortization schedules, charts, and instant PDF/Excel export.',
    canonical: SITE_URL,
  },
  'home-loan': {
    key: 'home-loan',
    path: '/calculator',
    title: 'Home Loan EMI Calculator — With Prepayment, Tax & Inflation',
    description:
      'Calculate home loan EMI with prepayment, property tax, insurance, maintenance and inflation benefit. Year-by-year amortization, charts and export to PDF/Excel.',
    keywords: [
      'home loan emi calculator',
      'housing loan emi',
      'home loan calculator india',
      'emi with prepayment',
      'property appreciation calculator',
    ],
    h1: 'Home Loan',
    h1Highlight: 'EMI Calculator',
    heroSubtitle:
      'Plan repayments with clarity — model prepayments, taxes, property appreciation, and lifetime cost in one view.',
    canonical: `${SITE_URL}/calculator`,
  },
  'loan-suite': {
    key: 'loan-suite',
    path: '/calculator/loan',
    title: 'Loan EMI Calculator — Personal, Car, Business Loan Suite',
    description:
      '4-in-1 loan calculator: EMI, affordability, tenure, and hidden interest rate. Includes APR, processing fees, prepayment what-if and inflation-adjusted cost.',
    keywords: [
      'loan emi calculator',
      'personal loan emi',
      'car loan calculator',
      'loan affordability calculator',
      'apr calculator india',
    ],
    h1: 'Loan',
    h1Highlight: 'Suite',
    heroSubtitle:
      'Four calculators in one — EMI, affordability, tenure, and hidden interest rate with APR and what-if prepayments.',
    canonical: `${SITE_URL}/calculator/loan`,
  },
  'credit-card': {
    key: 'credit-card',
    path: '/calculator/credit-card',
    title: 'Credit Card EMI Calculator with GST — India',
    description:
      'Convert credit card transactions to EMI with GST on processing fees and interest. See true APR, amortization schedule and total cost of credit card EMI.',
    keywords: [
      'credit card emi calculator',
      'credit card emi gst',
      'card emi calculator india',
      'credit card interest calculator',
    ],
    h1: 'Credit Card',
    h1Highlight: 'EMI with GST',
    heroSubtitle:
      'Convert card transactions into EMIs — see APR, GST on fees and interest, and the full amortization schedule.',
    canonical: `${SITE_URL}/calculator/credit-card`,
  },
  sip: {
    key: 'sip',
    path: '/calculator/invest/sip',
    title: 'SIP Calculator — Step-Up SIP with Inflation Adjustment',
    description:
      'Free SIP calculator with annual step-up, expected returns and inflation-adjusted maturity value. Year-by-year projection and growth charts.',
    keywords: [
      'sip calculator',
      'step up sip calculator',
      'mutual fund sip calculator',
      'sip return calculator india',
    ],
    h1: 'SIP',
    h1Highlight: 'Calculator',
    heroSubtitle:
      'Plan your Systematic Investment with step-up SIP, expected returns, and inflation-adjusted projections.',
    canonical: `${SITE_URL}/calculator/invest/sip`,
  },
  ppf: {
    key: 'ppf',
    path: '/calculator/invest/ppf',
    title: 'PPF Calculator — Public Provident Fund Maturity & Returns',
    description:
      'Calculate PPF maturity value with annual deposits, compounding interest and inflation-adjusted real returns. Free year-by-year PPF projection.',
    keywords: [
      'ppf calculator',
      'ppf maturity calculator',
      'public provident fund calculator',
      'ppf interest calculator',
    ],
    h1: 'PPF',
    h1Highlight: 'Calculator',
    heroSubtitle:
      'Public Provident Fund — tax-free returns with annual compounding and inflation-adjusted projections.',
    canonical: `${SITE_URL}/calculator/invest/ppf`,
  },
  ssy: {
    key: 'ssy',
    path: '/calculator/invest/ssy',
    title: 'SSY Calculator — Sukanya Samriddhi Yojana Maturity',
    description:
      'Free SSY calculator for Sukanya Samriddhi Yojana. 15-year deposit rule, maturity at age 21, interest projection and inflation-adjusted value.',
    keywords: [
      'ssy calculator',
      'sukanya samriddhi yojana calculator',
      'ssy maturity calculator',
      'ssy interest calculator',
    ],
    h1: 'SSY',
    h1Highlight: 'Calculator',
    heroSubtitle:
      'Sukanya Samriddhi Yojana — tax-free savings with guaranteed returns and inflation-adjusted projections.',
    canonical: `${SITE_URL}/calculator/invest/ssy`,
  },
  compounding: {
    key: 'compounding',
    path: '/calculator/invest/compounding',
    title: 'Compound Interest Calculator — With Periodic Contributions',
    description:
      'Flexible compound interest calculator with monthly, quarterly, or annual compounding. Add periodic contributions and see inflation-adjusted final value.',
    keywords: [
      'compound interest calculator',
      'compounding calculator india',
      'investment growth calculator',
      'ci calculator',
    ],
    h1: 'Compound',
    h1Highlight: 'Interest Calculator',
    heroSubtitle:
      'See how compounding grows your money — flexible frequency, periodic contributions, and inflation-adjusted projections.',
    canonical: `${SITE_URL}/calculator/invest/compounding`,
  },
  'future-cost': {
    key: 'future-cost',
    path: '/calculator/invest/future-cost',
    title: 'Future Cost Planner — Inflation Expense Calculator',
    description:
      'Project current monthly expenses to a future target year with inflation. Plan retirement, education, and lifestyle costs with year-by-year expense growth.',
    keywords: [
      'future cost calculator',
      'inflation calculator expenses',
      'future expense planner',
      'cost of living inflation calculator',
    ],
    h1: 'Future Cost',
    h1Highlight: 'Planner',
    heroSubtitle:
      'Project your current expenses into the future — see how inflation erodes purchasing power and plan your financial target.',
    canonical: `${SITE_URL}/calculator/invest/future-cost`,
  },
};

export function getPageSeo(key: SeoPageKey): PageSeoMeta {
  return pages[key];
}

export function getSeoForPath(pathname: string): PageSeoMeta | null {
  const normalized = pathname.replace(/\/$/, '') || '/';
  const match = Object.values(pages).find((page) => page.path === normalized);
  return match ?? null;
}

export function getAllCalculatorPages(): PageSeoMeta[] {
  return Object.values(pages).filter((page) => page.key !== 'home');
}

export function getSitemapUrls(): string[] {
  return Object.values(pages).map((page) => page.canonical);
}

export { SITE_NAME, SITE_DESCRIPTION };
