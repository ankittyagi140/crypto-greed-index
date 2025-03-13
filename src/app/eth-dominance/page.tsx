import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Ethereum Market Dominance Analysis | Crypto Fear & Greed Index',
  description: 'Track Ethereum\'s market dominance and influence in the cryptocurrency market. Analyze ETH dominance trends, implications, and market dynamics.',
  keywords: 'Ethereum dominance, ETH dominance, cryptocurrency market share, Ethereum market cap, crypto market analysis, DeFi impact',
  openGraph: {
    title: 'Ethereum Market Dominance Analysis | Crypto Fear & Greed Index',
    description: 'Track Ethereum\'s market dominance and influence in the cryptocurrency market. Analyze ETH dominance trends, implications, and market dynamics.',
    type: 'website',
    images: ['/cryptogreedindex.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ethereum Market Dominance Analysis',
    description: 'Track Ethereum\'s market dominance and influence in the cryptocurrency market.',
    images: ['/cryptogreedindex.png'],
  }
};

export default function ETHDominancePage() {
  return <ClientPage />;
} 