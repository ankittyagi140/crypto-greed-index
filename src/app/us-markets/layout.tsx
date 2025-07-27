import type { Metadata } from 'next';
import StructuredData from './structured-data';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cryptogreedindex.com'),
  title: 'US Stock Market Live: S&P 500, Dow Jones, NASDAQ Futures & Index Updates',
  description:
    'Track live updates from US stock markets including S&P 500, Dow Jones, and NASDAQ. Monitor index charts, futures, ETFs, after-hours trading, and today’s market performance with real-time data.',
  keywords: [
    'us stock market live',
    's&p 500 today',
    's&p 500 futures',
    'dow jones today',
    'nasdaq live',
    'stock market updates',
    's&p 500 index',
    'us markets today',
    'market indices live',
    'futures market',
    'after hours trading',
    'stock market today',
    's&p 500 etf',
    'spy etf',
    'index funds performance',
    'stock market news',
    'live market data',
    'market hours us',
    'vanguard s&p 500',
    'us market summary'
  ],
  openGraph: {
    title: 'Live US Markets: S&P 500, Dow Jones, NASDAQ Futures & Stock Data',
    description:
      'Get real-time US stock market updates including S&P 500, Dow Jones, and NASDAQ index data, futures charts, ETF performance, and after-hours movement.',
    type: 'website',
    locale: 'en_US',
    siteName: 'CryptoGreedIndex',
    url: 'https://www.cryptogreedindex.com/us-markets',
    images: [
      {
        url: 'https://www.cryptogreedindex.com/cryptogreedindex.png',
        width: 1200,
        height: 630,
        alt: 'Live S&P 500, Dow Jones & NASDAQ Market Updates'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'US Stock Market Live: S&P 500, NASDAQ & Dow Jones Futures Today',
    description:
      'Monitor real-time stock market data for S&P 500, NASDAQ, and Dow Jones. Get index futures, after-hours charts, and live performance tracking for 2025.',
    images: ['https://www.cryptogreedindex.com/cryptogreedindex.png'],
    creator: 'https://www.linkedin.com/in/atyagi-js/'
  },
  alternates: {
    canonical: 'https://www.cryptogreedindex.com/us-markets'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default function USMarketsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <StructuredData />
      {children}
    </div>
  );
}
