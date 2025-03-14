import { Metadata } from 'next';
import ClientPage from './ClientPage';

// Metadata for SEO
export const metadata: Metadata = {
  title: 'Bitcoin Market Dominance Analysis | Crypto Fear & Greed Index',
  description: 'Track Bitcoin\'s market dominance and influence in the cryptocurrency market. Analyze BTC dominance trends, implications, and market dynamics.',
  keywords: 'Bitcoin dominance, BTC dominance, cryptocurrency market share, Bitcoin market cap, crypto market analysis, altcoin season, dominance, btcd ',
  openGraph: {
    title: 'Bitcoin Market Dominance Analysis | Crypto Fear & Greed Index',
    description: 'Track Bitcoin\'s market dominance and influence in the cryptocurrency market. Analyze BTC dominance trends, implications, and market dynamics.',
    type: 'website',
    images: ['/cryptogreedindex.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcoin Market Dominance Analysis',
    description: 'Track Bitcoin\'s market dominance and influence in the cryptocurrency market.',
    images: ['/cryptogreedindex.png'],
  }
};

export default function BTCDominancePage() {
  return <ClientPage />;
}
