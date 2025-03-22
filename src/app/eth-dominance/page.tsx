import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Ethereum Market Dominance | Crypto Fear & Greed Index',
  description: 'Track Ethereum\'s influence in the cryptocurrency market through its dominance metrics. Analyze historical trends and market implications.',
  keywords: 'Ethereum dominance, ETH market share, ETH market cap, ETH dominance chart, dominance, eth dominance, eth market dominance, eth market share, eth market cap, eth market dominance, ethererun dominance chart',
};

export default function ETHDominancePage() {
  return <ClientPage />;
} 