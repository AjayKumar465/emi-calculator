import Head from 'expo-router/head';
import { Platform } from 'react-native';

import { DEFAULT_OG_IMAGE, SITE_LOCALE, SITE_NAME } from '../../seo/config';
import { FaqItem } from '../../seo/faq';
import { PageSeoMeta } from '../../seo/metadata';
import { buildPageSchema } from '../../seo/schema';

interface SeoHeadProps {
  meta: PageSeoMeta;
  faq?: FaqItem[];
  noIndex?: boolean;
}

export function SeoHead({ meta, faq = [], noIndex = false }: SeoHeadProps) {
  if (Platform.OS !== 'web') {
    return null;
  }

  const schemas = buildPageSchema(meta, faq);
  const keywords = meta.keywords.join(', ');

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <link rel="canonical" href={meta.canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:locale" content={SITE_LOCALE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
    </Head>
  );
}
