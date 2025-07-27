import type { Metadata } from 'next';
import StructuredData from './structured-data';

export const metadata: Metadata = {
  title: 'Global Market Live Updates | World Stock Indices & Sentiment Today',
  description:
    'Live global market updates across Asia, Europe, and the Americas. Track world stock indices, futures, and investor sentiment. Updated daily with key trends and data analysis.',
  keywords: [
    'global markets',
    'world markets',
    'global stock market',
    'global market index',
    'world stock market',
    'global stock index',
    'world indices',
    'global market data',
    'major world indices',
    'international stock market',
    'global market live',
    'global market analysis',
    'world market live',
    'world stock exchange',
    'global market news',
    'global equity index',
    'world market today',
    'stock market global',
    'world market index',
    'real-time global market'
  ],
  openGraph: {
    title: 'Global Market Live Updates | Stock Indices & Sentiment Today',
    description:
      'Follow live global stock markets and major world indices. Track real-time sentiment data across regions with daily updates.',
    type: 'website',
    locale: 'en_US',
    siteName: 'CryptoGreedIndex',
    url: 'https://www.cryptogreedindex.com/global-markets',
    images: [
      {
        url: 'https://www.cryptogreedindex.com/cryptogreedindex.png',
        width: 1200,
        height: 630,
        alt: 'Global Markets Live - World Stock Indices & Sentiment'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Global Market Tracker | Stock Indices & Sentiment',
    description:
      'Get real-time updates on world stock indices, market sentiment, and futures. Stay informed with global financial data trends.',
    images: ['https://www.cryptogreedindex.com/cryptogreedindex.png']
  },
  alternates: {
    canonical: 'https://www.cryptogreedindex.com/global-markets'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1
    }
  }
};


export default function GlobalMarketsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData />
      {children}
    </>
  );
}
