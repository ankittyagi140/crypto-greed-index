export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Global Markets Live | World Stock Markets & Indices Today',
    description: 'Track real-time global market data, world stock indices, and international market trends. Get live updates from major world markets including Asia, Europe, Americas, and Middle East.',
    url: 'https://www.cryptogreedindex.com/global-markets',
    dateModified: new Date().toISOString(),
    mainEntity: {
      '@type': 'DataFeed',
      name: 'Global Markets Data',
      description: 'Real-time global market data and indices from major world markets',
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
              containedInPlace: {
                '@type': 'Place',
                name: 'World'
              }
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
              containedInPlace: {
                '@type': 'Place',
                name: 'World'
              }
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
              containedInPlace: {
                '@type': 'Place',
                name: 'World'
              }
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
              containedInPlace: {
                '@type': 'Place',
                name: 'World'
              }
            }
          }
        }
      ],
      temporalCoverage: `${new Date().getFullYear()}/P1Y`,
      creator: {
        '@type': 'Organization',
        name: 'Cryptogreedindex.com',
        url: 'https://www.cryptogreedindex.com'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Cryptogreedindex.com',
        url: 'https://www.cryptogreedindex.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.cryptogreedindex.com/cryptogreedindex.png',
          width: 1200,
          height: 630,
          caption: 'Cryptogreedindex.com Logo'
        }
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cryptogreedindex.com',
      url: 'https://www.cryptogreedindex.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cryptogreedindex.com/cryptogreedindex.png',
        width: 1200,
        height: 630,
        caption: 'Cryptogreedindex.com Logo'
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 