import { Metadata } from 'next';

const title = 'Top 10 Cryptocurrencies - Real-Time Prices, Market Cap, and Performance | CryptoGreedIndex';
const description = 'Track the latest prices, market cap, volume, and performance metrics of the top 10 cryptocurrencies by market capitalization. Real-time data with comprehensive price analysis and trends for Bitcoin, Ethereum, and other leading digital assets.';
const imageUrl = 'https://cryptogreedindex.com/cryptogreedindex.png';
const pageUrl = 'https://cryptogreedindex.com/top-10-crypto';

export const metadata: Metadata = {
  title,
  description,
  keywords: 'top 10 cryptocurrencies, top crypto coins, cryptocurrency prices, Bitcoin price, Ethereum price, crypto market cap, cryptocurrency market, crypto price chart, crypto performance metrics, crypto price analysis, crypto market trends, cryptocurrency tracker, crypto investing, best crypto coins, BTC, ETH',
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'en_US',
    siteName: 'Crypto Greed Index',
    url: pageUrl,
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: 'Top 10 Cryptocurrencies - Real-Time Market Data',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [imageUrl],
  },
  alternates: {
    canonical: pageUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  authors: [{ name: 'Crypto Greed Index' }],
  publisher: 'Crypto Greed Index',
  creator: 'Crypto Greed Index',
  category: 'cryptocurrency',
  classification: 'finance',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}; 