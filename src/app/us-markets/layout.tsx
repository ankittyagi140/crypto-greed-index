import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'US Stock Market Today | US Markets Live Charts',
  description: 'Track major US stock market indices including S&P 500, NASDAQ, Dow Jones, and Russell 2000. Get real-time market data, top gainers, losers, and most active stocks.',
  keywords: 'US stock market, S&P 500, NASDAQ, Dow Jones, Russell 2000, market movers,live charts, stock indices, market data, us markets live, us markets live data, us markets live charts, us markets live prices, us markets live news, us markets live analysis, us markets live updates, us markets live trends, us markets live predictions, us markets live forecasts, us markets live reports, us markets live research, us markets live analysis, us markets live updates, us markets live trends, us markets live predictions, us markets live forecasts, us markets live reports, us markets live research',
  openGraph: {
    title: 'US Stock Market Today | US Markets Live Charts',
    description: 'Track major US stock market indices including S&P 500, NASDAQ, Dow Jones, and Russell 2000. Get real-time market data, top gainers, losers, and most active stocks.',
    type: 'website',
    locale: 'en_US',
    siteName: 'cryptogreedindex.com',
    url: 'https://www.cryptogreedindex.com/us-markets',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'US Stock Market Today | US Markets Live Charts',
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