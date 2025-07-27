import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Top 10 Cryptocurrencies Prices | Best Crypto Coins by Market Cap',
  description: 'Live tracking of world\'s top 10 cryptocurrencies including Bitcoin, Ethereum, and trending coins. Real-time prices, market cap rankings, charts, and trading volumes. Updated every minute with CoinGecko data.',
  keywords: 'top 10 cryptocurrency, best crypto coins, trending cryptocurrency now, top 10 cryptocurrencies, top crypto coins, trending coins coingecko, world largest cryptocurrency, top 10 coins, cryptocurrency prices live, best crypto to invest',
  openGraph: {
    title: 'Top 10 Cryptocurrencies Prices | Best Crypto Coins by Market Cap',
    description: 'Live tracking of world\'s top 10 cryptocurrencies. Real-time prices, market cap rankings, charts, and trading volumes for Bitcoin, Ethereum, and other leading digital currencies.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/cryptogreedindex.png',
        width: 1200,
        height: 630,
        alt: 'Top 10 Cryptocurrencies Live Prices and Charts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top 10 Cryptocurrency Prices | Best Crypto Coins by Market Cap',
    description: 'Live tracking of world\'s top 10 cryptocurrencies. Real-time prices, market cap rankings, charts, and trading volumes for Bitcoin, Ethereum, and other leading digital currencies.',
    images: ['/cryptogreedindex.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://cryptogreedindex.com/top-10-crypto',
  }
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="top-10-crypto-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Top 10 Cryptocurrency Prices & Market Data",
            "description": "Live tracking of world's top 10 cryptocurrencies with real-time prices, market caps, trading volumes, and price charts.",
            "url": "https://cryptogreedindex.com/top-10-crypto",
            "image": "https://cryptogreedindex.com/cryptogreedindex.png",
            "dateModified": new Date().toISOString(),
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://cryptogreedindex.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Top 10 Cryptocurrencies",
                  "item": "https://cryptogreedindex.com/top-10-crypto"
                }
              ]
            },
            "mainEntity": {
              "@type": "Dataset",
              "name": "Top 10 Cryptocurrency Market Data",
              "description": "Real-time cryptocurrency market data including prices, market caps, trading volumes, and price changes",
              "url": "https://cryptogreedindex.com/top-10-crypto",
              "keywords": [
                "cryptocurrency prices",
                "crypto market cap",
                "bitcoin price",
                "ethereum price",
                "top cryptocurrencies",
                "crypto trading volume",
                "crypto price charts"
              ],
              "isAccessibleForFree": true,
              "creator": {
                "@type": "Organization",
                "name": "CryptoGreedIndex",
                "url": "https://cryptogreedindex.com"
              },
              "temporalCoverage": "PT5M",
              "accrualPeriodicity": "PT1M",
              "provider": {
                "@type": "Organization",
                "name": "CoinGecko",
                "url": "https://www.coingecko.com"
              }
            },
            "about": {
              "@type": "Thing",
              "name": "Cryptocurrency Market Data",
              "description": "Live cryptocurrency prices, market capitalization, and trading volumes for the top 10 digital currencies."
            },
            "specialty": "Cryptocurrency Market Analysis",
            "significantLink": "https://cryptogreedindex.com/",
            "lastReviewed": new Date().toISOString(),
            "audience": {
              "@type": "Audience",
              "audienceType": "Cryptocurrency Investors and Traders"
            }
          })
        }}
      />
      {children}
    </>
  );
} 