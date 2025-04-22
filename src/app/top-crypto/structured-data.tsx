import { metadata } from './page';

export const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Top Cryptocurrencies by Market Cap',
    description: metadata.description,
    url: metadata.openGraph?.url,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    datePublished: '2025-04-01',
    dateModified: '2025-04-01',
    license: 'https://cryptogreedindex.com/terms',
    publisher: {
      '@type': 'Organization',
      name: 'Crypto Greed Index',
      url: 'https://www.cryptogreedindex.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cryptogreedindex.com/cryptogreedindex.png',
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Cryptocurrency',
            name: 'Bitcoin',
            url: 'https://www.cryptogreedindex.com/bitcoin',
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Cryptocurrency',
            name: 'Ethereum',
            url: 'https://www.cryptogreedindex.com/ethereum',
          },
        },
        // Add more cryptocurrencies as needed
      ],
    },
  };
  