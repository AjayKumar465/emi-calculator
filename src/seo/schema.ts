import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './config';
import { FaqItem } from './faq';
import { PageSeoMeta, getAllCalculatorPages } from './metadata';

export function buildFaqSchema(faq: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildWebApplicationSchema(meta: PageSeoMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: meta.title.split('—')[0].trim() || SITE_NAME,
    description: meta.description,
    url: meta.canonical,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web, Android, iOS',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    featureList: [
      'EMI calculation',
      'Inflation-adjusted results',
      'Amortization schedule',
      'PDF export with charts',
      'Excel export with charts',
    ],
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: `${SITE_URL}/icon.png`,
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildBreadcrumbSchema(meta: PageSeoMeta) {
  const items = [
    { name: 'Home', item: SITE_URL },
  ];

  if (meta.key !== 'home') {
    items.push({
      name: meta.title.split('—')[0].trim(),
      item: meta.canonical,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

export function buildItemListSchema() {
  const calculators = getAllCalculatorPages();
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free Financial Calculators',
    itemListElement: calculators.map((page, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: page.title.split('—')[0].trim(),
      url: page.canonical,
    })),
  };
}

export function buildHowToSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to use EMI Calculator',
    description: 'Calculate loan EMI or investment returns in three simple steps.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Choose your calculator',
        text: 'Select home loan, personal loan, credit card EMI, SIP, PPF, SSY, or other calculators from the hub.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Enter your numbers',
        text: 'Input loan amount, interest rate, tenure, or investment parameters. Adjust inflation rate for real-value projections.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Review and export',
        text: 'See EMI, charts, year-by-year schedule, and export to PDF or Excel with graphs included.',
      },
    ],
  };
}

export function buildPageSchema(meta: PageSeoMeta, faq: FaqItem[]) {
  const schemas: Record<string, unknown>[] = [
    buildOrganizationSchema(),
    buildWebApplicationSchema(meta),
    buildBreadcrumbSchema(meta),
    buildFaqSchema(faq),
  ];

  if (meta.key === 'home') {
    schemas.push(buildWebSiteSchema(), buildItemListSchema(), buildHowToSchema());
  }

  return {
    '@context': 'https://schema.org',
    '@graph': schemas.map((schema) => {
      const { '@context': _context, ...rest } = schema as { '@context': string };
      return rest;
    }),
  };
}
