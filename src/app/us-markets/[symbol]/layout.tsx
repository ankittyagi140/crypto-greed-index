import { Metadata } from 'next';
import Script from 'next/script';

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
  'dow-jones': {
    name: 'Dow Jones Industrial Average',
    description: 'The Dow Jones Industrial Average, or simply the Dow, is a stock market index that tracks 30 large, publicly-owned blue-chip companies trading on the New York Stock Exchange and the NASDAQ.',
    symbol: '^DJI'
  },
  russell2000: {
    name: 'Russell 2000',
    description: 'The Russell 2000 Index is a small-cap stock market index of the smallest 2,000 stocks in the Russell 3000 Index.',
    symbol: '^RUT'
  },
  'dollar-index': {
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
      title: 'Market Index Not Found',
      description: 'The requested market index could not be found.',
      robots: 'noindex'
    };
  }

  const title = `${index.name} - Live Market Data, Charts & Analysis`;
  const description = `${index.description} Get real-time ${index.name} price, technical indicators, market movers, and comprehensive market analysis.`;
  const imageUrl = `https://www.cryptogreedindex.com/cryptogreedindex.png`;
  const pageUrl = `https://www.cryptogreedindex.com/us-markets/${symbol}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      siteName: 'CryptoGreedIndex.com',
      url: pageUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${index.name} Market Chart`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl]
    },
    alternates: {
      canonical: pageUrl
    }
  };
}

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const index = indexInfo[symbol as keyof typeof indexInfo];

  return (
    <>
      {index && (
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialProduct",
              name: index.name,
              description: index.description,
              category: "US Stock Market Index",
              provider: {
                "@type": "Organization",
                name: "CryptoGreedIndex.com",
                url: "https://www.cryptogreedindex.com"
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://www.cryptogreedindex.com/us-markets/${symbol}`
              }
            })
          }}
        />
      )}
      {children}
    </>
  );
}
