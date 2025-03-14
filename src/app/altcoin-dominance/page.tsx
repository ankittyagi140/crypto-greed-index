import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Altcoin Dominance Chart | Crypto Market Analysis',
  description: 'Track altcoin dominance trends and market share analysis. Compare altcoin market cap against total crypto market cap to understand market dynamics.',
  keywords: ['altcoin dominance', 'crypto market analysis', 'altcoin market share', 'cryptocurrency market trends', 'altcoin market cap ,altcoin dominance chart'],
  openGraph: {
    title: 'Altcoin Dominance Chart | Crypto Market Analysis',
    description: 'Track altcoin dominance trends and market share analysis. Compare altcoin market cap against total crypto market cap to understand market dynamics.',
    url: 'https://cryptofeargreedindex.com/altcoin-dominance',
    siteName: 'Crypto Fear & Greed Index',
    images: [
      {
        url: 'https://cryptofeargreedindex.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Crypto Fear & Greed Index',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Altcoin Dominance Chart | Crypto Market Analysis',
    description: 'Track altcoin dominance trends and market share analysis. Compare altcoin market cap against total crypto market cap to understand market dynamics.',
    images: ['https://cryptofeargreedindex.com/og-image.png'],
    creator: '@cryptofeargreed',
  },
};

export default function AltcoinDominancePage() {
  return <ClientPage />;
} 