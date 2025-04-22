import { Metadata } from 'next';
import ClientPage from './ClientPage';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Altcoin Dominance | Crypto Market Analysis',
  description: 'Track altcoin market dominance and understand the shifting dynamics of the cryptocurrency market.',
  keywords: [
    'altcoin dominance',
    'crypto market analysis',
    'altcoin market share',
    'cryptocurrency market trends',
    'altcoin market cap',
    'altcoin dominance chart'
  ],  
  openGraph: {
    title: 'Altcoin Dominance Chart | Crypto Market Analysis',
    description: 'Track altcoin dominance trends and market share analysis. Compare altcoin market cap against total crypto market cap to understand market dynamics.',
    url: 'https://cryptofeargreedindex.com/altcoin-dominance',
    siteName: 'Cryptogreedindex.com',
    images: [
      {
        url: '/cryptogreedindex.png',
        width: 1200,
        height: 630,
        alt: 'Altcoin Dominance | Crypto Market Analysis',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Altcoin Dominance Chart | Crypto Market Analysis',
    description: 'Track altcoin dominance trends and market share analysis. Compare altcoin market cap against total crypto market cap to understand market dynamics.',
    images: ['/cryptogreedindex.png'],
    creator: 'Cryptogreedindex.com',
  },
};

export default function Page() {
  return (
    <>
      <Script
        id="altcoin-dominance-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Altcoin Dominance Chart",
            "description": "Track altcoin market dominance and understand the shifting dynamics of the cryptocurrency market.",
            "url": "https://www.cryptogreedindex.com/altcoin-dominance",
            "image": "https://www.cryptogreedindex.com/cryptogreedindex.png",
            "mainEntity": {
              "@type": "DataVisualization",
              "name": "Altcoin Dominance Chart",
              "description": "Interactive chart showing the percentage of total cryptocurrency market capitalization represented by altcoins",
              "dataType": "Financial Data",
              "temporalCoverage": "Real-time",
              "updateFrequency": "Daily",
              "variableMeasured": "Altcoin Market Dominance",
              "unitText": "Percentage",
              "measurementTechnique": "Market Cap Calculation",
              "about": {
                "@type": "Thing",
                "name": "Cryptocurrency Market",
                "description": "The total market capitalization of all cryptocurrencies excluding Bitcoin"
              }
            },
            "author": {
              "@type": "Organization",
              "name": "CryptoGreedIndex",
              "url": "https://www.cryptogreedindex.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "CryptoGreedIndex",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.cryptogreedindex.com/cryptogreedindex.png"
              }
            },
            "inLanguage": "en-US",
            "isAccessibleForFree": true,
            "license": "https://www.cryptogreedindex.com/terms",
            "keywords": "altcoin dominance, crypto market analysis, altcoin market share, cryptocurrency market trends, altcoin market cap, altcoin dominance chart",
            "dateModified": new Date().toISOString(),
            "datePublished": "2024-01-01T00:00:00Z",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.cryptogreedindex.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Altcoin Dominance",
                  "item": "https://www.cryptogreedindex.com/altcoin-dominance"
                }
              ]
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.cryptogreedindex.com/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <ClientPage />
    </>
  );
} 