import { Metadata, Viewport } from 'next';
import ClientPage from './ClientPage';

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Top Cryptocurrencies by Market Cap | Live Prices & Rankings 2025",
  description: "Track real-time cryptocurrency rankings, prices, and market cap. Compare top 10, top 50, and top 100 cryptocurrencies. Live charts, trading volume, and 24h changes for Bitcoin, Ethereum, and more.",
  keywords: "top cryptocurrencies, top 10 crypto, top 100 cryptocurrencies, crypto market cap, cryptocurrency rankings, bitcoin price, ethereum price, crypto prices live, best crypto to invest, cryptocurrency market, digital assets, crypto trading, live crypto charts",
  openGraph: {
    title: "Top Cryptocurrencies by Market Cap | Live Prices & Rankings 2025",
    description: "Track real-time cryptocurrency rankings, prices, and market cap. Compare top 10, top 50, and top 100 cryptocurrencies. Live charts, trading volume, and 24h changes for Bitcoin, Ethereum, and more.",
    url: 'https://www.cryptogreedindex.com/top-crypto',
    siteName: 'Crypto Greed Index',
    images: [
      {
        url: 'https://www.cryptogreedindex.com/cryptogreedindex.png',
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
    title: "Top Cryptocurrencies by Market Cap | Live Prices & Rankings 2025",
    description: "Track real-time cryptocurrency rankings, prices, and market cap. Compare top 10, top 50, and top 100 cryptocurrencies. Live charts, trading volume, and 24h changes for Bitcoin, Ethereum, and more.",
    images: ['https://www.cryptogreedindex.com/cryptogreedindex.png'],
    creator: '@AnkiTyagi007',
  },
  alternates: {
    canonical: 'https://www.cryptogreedindex.com/top-crypto',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  referrer: 'origin-when-cross-origin',
  creator: 'Crypto Greed Index',
  publisher: 'Crypto Greed Index',
};

export default function TopCoinsPage() {
  return <ClientPage />;
}
