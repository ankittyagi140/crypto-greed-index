import type { Metadata } from 'next';
import StructuredData from './structured-data';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cryptogreedindex.com'),
  title: 'US Stock Market Live Updates: Dow Jones, S&P 500, NASDAQ Futures & After Hours Trading 2025',
  description:
    'Stay updated with real-time US stock market live updates, including Dow Jones, S&P 500, and NASDAQ futures. Track after hours trading, market hours, stock market news, and today’s market conditions. Follow major indices and futures market trends now.',
  keywords: [
    'us stock market live',
    'dow jones',
    's&p 500',
    'nasdaq',
    'stock market',
    'futures market',
    'after hours trading',
    'market hours',
    'stock market today',
    'dow futures',
    's&p 500 futures',
    'nasdaq futures',
    'stock market live updates',
    'market news',
    'stock market after hours',
    'market conditions',
    'bear market',
    'stock market indices',
    'us stock market',
    'stock market futures',
    'market tracking',
    'stock market updates',
    'market analysis',
    'stock market data',
    'market trends',
    'stock market performance'
  ],
  openGraph: {
    title: 'US Stock Market Live Updates: Dow Jones, S&P 500, NASDAQ Futures & After Hours Trading 2025',
    description:
      'Stay updated with real-time US stock market live updates, including Dow Jones, S&P 500, and NASDAQ futures. Track after hours trading, market hours, stock market news, and today’s market conditions.',
    type: 'website',
    locale: 'en_US',
    siteName: 'CryptoGreedIndex',
    url: 'https://www.cryptogreedindex.com/us-markets',
    images: [
      {
        url: 'https://www.cryptogreedindex.com/cryptogreedindex.png', // ⚡ Changed to specific US Markets image for higher CTR
        width: 1200,
        height: 630,
        alt: 'US Stock Market Live: Dow Jones, S&P 500, NASDAQ Futures 2025'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'US Stock Market Live Updates: Dow Jones, S&P 500, NASDAQ Futures & After Hours Trading 2025',
    description:
      'Real-time tracking of Dow Jones, S&P 500, and NASDAQ futures. Get after hours trading updates, market hours, and live stock market news today.',
    images: ['https://www.cryptogreedindex.com/cryptogreedindex.png'],
    creator: 'https://www.linkedin.com/in/atyagi-js/'
  },
  alternates: {
    canonical: 'https://www.cryptogreedindex.com/us-markets'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};


export default function USMarketsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <StructuredData />
      {children}
    </div>
  );
}
