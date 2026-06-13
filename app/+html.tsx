import { ScrollViewStyleReset } from 'expo-router/html';
import type { ReactNode } from 'react';

import { SITE_DESCRIPTION, SITE_LANGUAGE, SITE_NAME, SITE_URL } from '../src/seo/config';

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang={SITE_LANGUAGE}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <title>{SITE_NAME}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="theme-color" content="#0a1628" />
        <link rel="canonical" href={SITE_URL} />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #0a1628;
}`;
