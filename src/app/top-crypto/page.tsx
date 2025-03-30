import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: "Top Cryptocurrencies by Market Cap | Live Prices & Rankings 2025",
  description: "Track real-time cryptocurrency rankings, prices, and market cap. Compare top 10, top 50, and top 100 cryptocurrencies. Live charts, trading volume, and 24h changes for Bitcoin, Ethereum, and more.",
  keywords: "top cryptocurrencies, top 10 crypto, top 100 cryptocurrencies, crypto market cap, cryptocurrency rankings, bitcoin price, ethereum price, crypto prices live, best crypto to invest, cryptocurrency market, digital assets, crypto trading, live crypto charts",
  openGraph: {
    title: "Top 100 Cryptocurrencies by Market Cap | Real-time Crypto Rankings",
    description: "Track the top 100 cryptocurrencies by market capitalization. Get real-time prices, 24h changes, volume, and market cap data for the leading digital assets.",
    url: 'https://www.cryptogreedindex.com/top-crypto',
    siteName: 'Cryptogreedindex.com',
    images: [
      {
        url: '/cryptogreedindex.png',
        width: 1200,
        height: 630,
        alt: 'Top 100 Cryptocurrencies',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Top 100 Cryptocurrencies by Market Cap | Real-time Crypto Rankings",
    description: "Track the top 100 cryptocurrencies by market capitalization. Get real-time prices, 24h changes, volume, and market cap data for the leading digital assets.",
    images: ['/cryptogreedindex.png'],
    creator: '@cryptogreedindex',
  },
  alternates: {
    canonical: 'https://www.cryptogreedindex.com/top-crypto'
  }
};

export default function TopCoinsPage() {
  return <ClientPage />;
}
