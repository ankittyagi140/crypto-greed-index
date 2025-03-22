import { Metadata } from 'next';
import StructuredData from './structured-data';

export const metadata: Metadata = {
  title: 'Global Markets Today - Real-time Stock Indices Worldwide',
  description: 'Track real-time performance of major stock indices from Asia Pacific, Europe, Americas, Middle East & Africa. Get live market data, trends, and historical charts.',
  keywords: 'global markets, stock indices, market data, financial markets, stock market, world indices, market trends',
  openGraph: {
    title: 'Global Markets Today - Real-time Stock Indices Worldwide',
    description: 'Track real-time performance of major stock indices from Asia Pacific, Europe, Americas, Middle East & Africa. Get live market data, trends, and historical charts.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Cryptogreedindex.com',
    url: 'https://www.cryptogreedindex.com/global-markets',
    images: [
      {
        url: '/cryptogreedindex.png',
        width: 1200,
        height: 630,
        alt: 'Global Markets Today - Real-time Stock Indices Worldwide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Markets Today - Real-time Stock Indices Worldwide',
    description: 'Track real-time performance of major stock indices from Asia Pacific, Europe, Americas, Middle East & Africa.',
    images: ['/cryptogreedindex.png'],
  },
};

export default function GlobalMarketsLayout({
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