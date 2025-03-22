import { Metadata } from 'next';
import ClientPage from './ClientPage';

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
  return <ClientPage />;
} 