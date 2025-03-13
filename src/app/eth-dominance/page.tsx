import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Ethereum Market Dominance | Crypto Fear & Greed Index',
  description: 'Track Ethereum\'s influence in the cryptocurrency market through its dominance metrics. Analyze historical trends and market implications.',
  keywords: 'Ethereum dominance, ETH market share, cryptocurrency market analysis, ETH market cap, crypto metrics',
};

export default function ETHDominancePage() {
  return <ClientPage />;
} 