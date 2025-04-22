import type { Metadata } from 'next';
import StructuredData from './structured-data';

export const metadata: Metadata = {
  title: 'Global Markets Live | World Stock Markets & Indices Today',
  description:
    'Track real-time global market data, world stock indices, and international market trends. Get live updates from major world markets including Asia, Europe, Americas, and Middle East. Updated daily with current market conditions.',
  keywords: [
    'global markets',
    'world markets',
    'global market live',
    'global market index',
    'world stock market',
    'global market today',
    'world market index',
    'world markets today',
    'global stock market',
    'global market futures',
    'world indices',
    'global indices live',
    'world market live',
    'global market data',
    'world stock market live',
    'global market analysis',
    'major world indices',
    'global equity index',
    'world stock exchange',
    'global stock index'
  ],
  openGraph: {
    title: 'Global Markets Live | World Stock Markets & Indices Today',
    description:
      'Track real-time global market data, world stock indices, and international market trends. Get live updates from major world markets.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Cryptogreedindex.com',
    url: 'https://www.cryptogreedindex.com/global-markets',
    images: [
      {
        url: 'https://www.cryptogreedindex.com/cryptogreedindex.png',
        width: 1200,
        height: 630,
        alt: 'Global Markets Live | World Stock Markets & Indices Today'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Markets Live | World Stock Markets & Indices Today',
    description:
      'Track real-time global market data, world stock indices, and international market trends. Get live updates from major world markets.',
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
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
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
