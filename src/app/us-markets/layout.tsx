import { Metadata } from 'next';
import StructuredData from './structured-data';

export const metadata: Metadata = {
  title: 'US Markets Live | US Stock Market Today & Indices',
  description: 'Track real-time US market data, stock indices, and market trends. Get live updates from major US markets including S&P 500, Dow Jones, NASDAQ, and Russell 2000. Updated daily with current market conditions.',
  keywords: [
    'us markets',
    'us stock market',
    'us stock market today',
    'us stock market live',
    'us market live',
    'us market today',
    'us stock market news',
    'us stock market open',
    'us stock market futures',
    'us stock market index',
    'us stock market today live',
    'us stock market today open',
    'us share market',
    'us tech 100',
    'us market news',
    'us stock',
    's&p 500 price',
    'dow today',
    'us stock market today cnn',
    'us stock market news today'
  ].join(', '),
  openGraph: {
    title: 'US Markets Live | US Stock Market Today & Indices',
    description: 'Track real-time US market data, stock indices, and market trends. Get live updates from major US markets including S&P 500, Dow Jones, NASDAQ, and Russell 2000.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Cryptogreedindex.com',
    url: 'https://www.cryptogreedindex.com/us-markets',
    images: [
      {
        url: '/cryptogreedindex.png',
        width: 1200,
        height: 630,
        alt: 'US Markets Live | US Stock Market Today & Indices',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'US Markets Live | US Stock Market Today & Indices',
    description: 'Track real-time US market data, stock indices, and market trends. Get live updates from major US markets including S&P 500, Dow Jones, NASDAQ, and Russell 2000.',
    images: ['/cryptogreedindex.png'],
  },
  alternates: {
    canonical: 'https://www.cryptogreedindex.com/us-markets',
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
};

export default function USMarketsLayout({
  children,
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