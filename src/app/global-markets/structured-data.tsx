export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Live Global Markets Overview | Stock Indices, Sentiment & Futures',
    headline: 'Live Global Markets Overview | Stock Indices, Sentiment & Futures',
    description:
      'Follow live updates of world stock markets, global indices, and investor sentiment across Asia, Europe, Americas, and MENA. Real-time data on major global financial trends.',
    url: 'https://www.cryptogreedindex.com/global-markets',
    inLanguage: 'en',
    dateModified: new Date().toISOString(),
    image: {
      '@type': 'ImageObject',
      url: 'https://www.cryptogreedindex.com/cryptogreedindex.png',
      width: 1200,
      height: 630,
      caption: 'Global Markets Overview - Cryptogreedindex.com'
    },
    about: {
      '@type': 'Thing',
      name: 'Global Stock Markets and Sentiment'
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Retail and Institutional Investors'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.cryptogreedindex.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    mainEntity: {
      '@type': 'DataFeed',
      name: 'Live Global Market Data',
      description: 'Real-time feed of stock indices and sentiment across global regions.',
      temporalCoverage: `${new Date().getFullYear()}/P1Y`,
      creator: {
        '@type': 'Organization',
        name: 'CryptoGreedIndex',
        url: 'https://www.cryptogreedindex.com'
      },
      publisher: {
        '@type': 'Organization',
        name: 'CryptoGreedIndex',
        url: 'https://www.cryptogreedindex.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.cryptogreedindex.com/cryptogreedindex.png',
          width: 1200,
          height: 630,
          caption: 'CryptoGreedIndex Logo'
        }
      },
      dataFeedElement: [
        {
          '@type': 'DataFeedItem',
          dateModified: new Date().toISOString(),
          item: {
            '@type': 'FinancialProduct',
            name: 'Asia Pacific Markets',
            category: 'Global Stock Market Index',
            marketStatus: 'Open',
            containsPlace: {
              '@type': 'Place',
              name: 'Asia Pacific',
              containedInPlace: { '@type': 'Place', name: 'World' }
            }
          }
        },
        {
          '@type': 'DataFeedItem',
          dateModified: new Date().toISOString(),
          item: {
            '@type': 'FinancialProduct',
            name: 'European Markets',
            category: 'Global Stock Market Index',
            marketStatus: 'Open',
            containsPlace: {
              '@type': 'Place',
              name: 'Europe',
              containedInPlace: { '@type': 'Place', name: 'World' }
            }
          }
        },
        {
          '@type': 'DataFeedItem',
          dateModified: new Date().toISOString(),
          item: {
            '@type': 'FinancialProduct',
            name: 'Americas Markets',
            category: 'Global Stock Market Index',
            marketStatus: 'Open',
            containsPlace: {
              '@type': 'Place',
              name: 'Americas',
              containedInPlace: { '@type': 'Place', name: 'World' }
            }
          }
        },
        {
          '@type': 'DataFeedItem',
          dateModified: new Date().toISOString(),
          item: {
            '@type': 'FinancialProduct',
            name: 'Middle East & Africa Markets',
            category: 'Global Stock Market Index',
            marketStatus: 'Open',
            containsPlace: {
              '@type': 'Place',
              name: 'Middle East & Africa',
              containedInPlace: { '@type': 'Place', name: 'World' }
            }
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
