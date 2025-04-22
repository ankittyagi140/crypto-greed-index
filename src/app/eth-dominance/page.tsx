import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Ethereum Market Dominance | ETH Dominance Chart',
  description: 'Track Ethereum\'s influence in the cryptocurrency market through its dominance metrics. Analyze historical trends and market implications.',
  keywords: 'Ethereum dominance, ETH market share, ETH market cap, ETH dominance chart, dominance, eth dominance, eth market dominance, eth market share, ethereun dominance chart',
  openGraph: {
    title: 'Ethereum Market Dominance | ETH Dominance Chart',
    description: 'Track Ethereum\'s influence in the cryptocurrency market through its dominance metrics. Analyze historical trends and market implications.',
    type: 'website',
    images: ['/cryptogreedindex.png'],
    url: 'https://www.cryptogreedindex.com/eth-dominance',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ethereum Market Dominance',
    description: 'Track Ethereum\'s influence in the cryptocurrency market through its dominance metrics. Analyze historical trends and market implications.',
    images: ['/cryptogreedindex.png'],
  }
};

export default function ETHDominancePage() {
  return <ClientPage />;
} 