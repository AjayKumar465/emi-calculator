export const SITE_NAME = 'EMI Calculator';
export const SITE_TAGLINE = 'Free Loan & Investment Calculators for India';
export const SITE_DESCRIPTION =
  'Free EMI calculator for home loans, personal loans, credit cards, SIP, PPF, SSY and more. Includes inflation-adjusted results, amortization schedules, charts, and PDF/Excel export.';

export const SITE_URL =
  (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_SITE_URL) ||
  'https://emi-calculator.app';

export const SITE_LOCALE = 'en_IN';
export const SITE_LANGUAGE = 'en';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const SOCIAL_LINKS = {
  twitter: '@emicalculator',
} as const;
