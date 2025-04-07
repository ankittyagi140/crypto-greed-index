export default function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: 'US Stock Market Live',
    description: 'Real-time tracking of US stock markets including Dow Jones, S&P 500, and NASDAQ futures. Get live updates on after hours trading, market hours, and current market conditions.',
    provider: {
      '@type': 'Organization',
      name: 'Crypto Greed Index',
      url: 'https://cryptogreedindex.com'
    },
    category: 'Stock Market',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://cryptogreedindex.com/us-markets'
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Market Hours',
        value: '9:30 AM - 4:00 PM EST'
      },
      {
        '@type': 'PropertyValue',
        name: 'After Hours Trading',
        value: '4:00 PM - 8:00 PM EST'
      },
      {
        '@type': 'PropertyValue',
        name: 'Futures Trading',
        value: '24/7'
      }
    ],
    about: [
      {
        '@type': 'FinancialProduct',
        name: 'Dow Jones Industrial Average',
        tickerSymbol: 'DJIA'
      },
      {
        '@type': 'FinancialProduct',
        name: 'S&P 500 Index',
        tickerSymbol: 'SPX'
      },
      {
        '@type': 'FinancialProduct',
        name: 'NASDAQ Composite',
        tickerSymbol: 'COMP'
      }
    ],
    potentialAction: {
      '@type': 'TradeAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://cryptogreedindex.com/us-markets'
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 