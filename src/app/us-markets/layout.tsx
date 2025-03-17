import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'US Stock Market Today | Real-time Market Data',
  description: 'Track major US stock market indices including S&P 500, NASDAQ, Dow Jones, and Russell 2000. Get real-time market data, top gainers, losers, and most active stocks.',
  keywords: 'US stock market, S&P 500, NASDAQ, Dow Jones, Russell 2000, market movers, stock indices, market data',
  openGraph: {
    title: 'US Stock Market Today | Real-time Market Data',
    description: 'Track major US stock market indices including S&P 500, NASDAQ, Dow Jones, and Russell 2000. Get real-time market data, top gainers, losers, and most active stocks.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Market Overview'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'US Stock Market Today | Real-time Market Data',
    description: 'Track major US stock market indices including S&P 500, NASDAQ, Dow Jones, and Russell 2000. Get real-time market data, top gainers, losers, and most active stocks.'
  }
};

export default function USMarketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 