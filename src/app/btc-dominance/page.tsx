import { Metadata } from 'next';
import ClientPage from './ClientPage';
import Script from 'next/script';

// Metadata for SEO
export const metadata: Metadata = {
  title: 'Bitcoin Dominance | Crypto Market Analysis',
  description: 'Track Bitcoin market dominance and understand its position in the cryptocurrency market.',
  keywords: [
    'bitcoin dominance',
    'btc dominance',
    'crypto market analysis',
    'bitcoin market share',
    'cryptocurrency market trends',
    'bitcoin market cap',
    'bitcoin dominance chart'
  ],
  openGraph: {
    title: 'Bitcoin Dominance Chart | Crypto Market Analysis',
    description: 'Track Bitcoin dominance trends and market share analysis. Compare Bitcoin market cap against total crypto market cap to understand market dynamics.',
    url: 'https://cryptofeargreedindex.com/btc-dominance',
    siteName: 'Cryptogreedindex.com',
    images: [
      {
        url: '/cryptogreedindex.png',
        width: 1200,
        height: 630,
        alt: 'Bitcoin Dominance | Crypto Market Analysis',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcoin Dominance Chart | Crypto Market Analysis',
    description: 'Track Bitcoin dominance trends and market share analysis. Compare Bitcoin market cap against total crypto market cap to understand market dynamics.',
    images: ['/cryptogreedindex.png'],
    creator: 'Cryptogreedindex.com',
  },
};

export default function Page() {
  return (
    <>
      <Script
        id="bitcoin-dominance-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Bitcoin Dominance Chart",
            "description": "Track Bitcoin market dominance and understand its position in the cryptocurrency market.",
            "url": "https://www.cryptogreedindex.com/btc-dominance",
            "image": "https://www.cryptogreedindex.com/cryptogreedindex.png",
            "mainEntity": {
              "@type": "DataVisualization",
              "name": "Bitcoin Dominance Chart",
              "description": "Interactive chart showing the percentage of total cryptocurrency market capitalization represented by Bitcoin",
              "dataType": "Financial Data",
              "temporalCoverage": "Real-time",
              "updateFrequency": "Daily",
              "variableMeasured": "Bitcoin Market Dominance",
              "unitText": "Percentage",
              "measurementTechnique": "Market Cap Calculation",
              "about": {
                "@type": "Thing",
                "name": "Bitcoin Market",
                "description": "The market capitalization of Bitcoin compared to the total cryptocurrency market"
              },
              "dataSource": {
                "@type": "Dataset",
                "name": "Bitcoin Dominance Data",
                "description": "Historical and real-time Bitcoin dominance data",
                "temporalCoverage": "2013-01-01/",
                "updateFrequency": "Daily",
                "variableMeasured": "Bitcoin Market Cap / Total Crypto Market Cap",
                "unitText": "Percentage"
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
            "keywords": "bitcoin dominance, btc dominance, crypto market analysis, bitcoin market share, cryptocurrency market trends, bitcoin market cap, bitcoin dominance chart",
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
                  "name": "Bitcoin Dominance",
                  "item": "https://www.cryptogreedindex.com/btc-dominance"
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
            },
            "about": {
              "@type": "Thing",
              "name": "Bitcoin Market Dominance",
              "description": "The percentage of total cryptocurrency market capitalization that Bitcoin represents",
              "category": "Financial Market Analysis"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "1250",
              "bestRating": "5",
              "worstRating": "1",
              "ratingCount": "1250"
            }
          })
        }}
      />
      <ClientPage />
    </>
  );
}
