

import { Metadata } from 'next';
import ClientPage from './ClientPage';



export const metadata: Metadata = {
  title: "Top 100 Cryptocurrencies by Market Cap | Real-time Crypto Rankings",
  description: "Track the top 100 cryptocurrencies by market capitalization. Get real-time prices, 24h changes, volume, and market cap data for the leading digital assets.",
  keywords: "top 100 cryptocurrencies, crypto market cap, cryptocurrency rankings, bitcoin price, ethereum price, crypto chart,crypto prices live, top 100 crypto, cryptocurrency market, digital assets, crypto trading, live crypto charts",
  openGraph: {
    title: "Top 100 Cryptocurrencies by Market Cap | Real-time Crypto Rankings",
    description: "Track the top 100 cryptocurrencies by market capitalization. Get real-time prices, 24h changes, volume, and market cap data for the leading digital assets.",
    url: 'https://www.cryptogreedindex.com/top-coins',
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
};


export default function TopCoinsPage() {
  return <ClientPage />;
}
