import { Metadata } from 'next';

const indexInfo = {
  sp500: {
    name: 'S&P 500',
    description: 'The Standard & Poor\'s 500, or simply the S&P 500, is a stock market index tracking the performance of 500 large companies listed on stock exchanges in the United States.',
    symbol: '^GSPC'
  },
  nasdaq: {
    name: 'NASDAQ Composite',
    description: 'The NASDAQ Composite is a stock market index that includes almost all stocks listed on the NASDAQ stock market.',
    symbol: '^IXIC'
  },
  dowJones: {
    name: 'Dow Jones Industrial Average',
    description: 'The Dow Jones Industrial Average, or simply the Dow, is a stock market index that tracks 30 large, publicly-owned blue-chip companies trading on the New York Stock Exchange and the NASDAQ.',
    symbol: '^DJI'
  },
  russell2000: {
    name: 'Russell 2000',
    description: 'The Russell 2000 Index is a small-cap stock market index of the smallest 2,000 stocks in the Russell 3000 Index.',
    symbol: '^RUT'
  },
  dollarIndex: {
    name: 'US Dollar Index',
    description: 'The US Dollar Index (DXY) measures the value of the United States dollar relative to a basket of foreign currencies.',
    symbol: 'DX-Y.NYB'
  }
};

interface LayoutProps {
  params: Promise<{ symbol: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { symbol } = await params;
  const index = indexInfo[symbol as keyof typeof indexInfo];

  if (!index) {
    return {
      title: 'Market Not Found | Crypto Greed Index',
      description: 'The requested market index could not be found.'
    };
  }

  return {
    title: `${index.name} Market Data | Crypto Greed Index`,
    description: index.description,
    openGraph: {
      title: `${index.name} Market Data | Crypto Greed Index`,
      description: index.description,
      type: 'website',
      locale: 'en_US',
      siteName: 'Crypto Greed Index',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${index.name} Market Data | Crypto Greed Index`,
      description: index.description,
    },
  };
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ symbol: string }>;
}) {
  return children;
} 