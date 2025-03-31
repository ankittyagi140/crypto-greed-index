import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Crypto Trading App 2025 | Top Cryptocurrency Exchanges & Platforms',
  description: 'Find the best cryptocurrency trading app and top crypto exchanges for 2025. Compare features, security, and trading volumes of leading platforms like Binance, Coinbase, and Kraken. Perfect for both beginners and day traders.',
  keywords: 'best crypto trading app, best app for crypto trading, top crypto exchanges, best cryptocurrency exchanges, best crypto exchange for day trading, best platform for crypto trading, most secure crypto exchange, best decentralized exchange, crypto exchange ranking, best crypto futures trading platform, best cryptocurrency platform, best crypto currency app, best app for trading cryptocurrency, best app for buying cryptocurrency, best cryptocurrency broker',
  openGraph: {
    title: 'Best Crypto Trading App 2025 | Top Cryptocurrency Exchanges & Platforms',
    description: 'Find the best cryptocurrency trading app and top crypto exchanges for 2025. Compare features, security, and trading volumes of leading platforms like Binance, Coinbase, and Kraken. Perfect for both beginners and day traders.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Crypto Greed Index',
    images: [
      {
        url: '/images/cryptogreedindex.png',
        width: 1200,
        height: 630,
        alt: 'Best Crypto Trading App and Top Cryptocurrency Exchanges',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Crypto Trading App 2025 | Top Cryptocurrency Exchanges & Platforms',
    description: 'Find the best cryptocurrency trading app and top crypto exchanges for 2025. Compare features, security, and trading volumes of leading platforms.',
    images: ['/images/cryptogreedindex.png'],
  },
  alternates: {
    canonical: 'https://cryptogreedindex.com/top-crypto-exchanges',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
  authors: [{ name: 'Crypto Greed Index' }],
  category: 'cryptocurrency',
  classification: 'business',
  referrer: 'origin-when-cross-origin',
  creator: 'Crypto Greed Index',
  publisher: 'Crypto Greed Index',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Best Crypto Trading App 2025 | Top Cryptocurrency Exchanges',
  description: 'Find the best cryptocurrency trading app and top crypto exchanges for 2025. Compare features, security, and trading volumes of leading platforms like Binance, Coinbase, and Kraken. Perfect for both beginners and day traders.',
  url: 'https://cryptogreedindex.com/top-crypto-exchanges',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Organization',
          name: 'Binance',
          description: 'World\'s largest cryptocurrency exchange by trading volume, offering advanced trading features and mobile app',
          url: 'https://www.binance.com',
          sameAs: [
            'https://twitter.com/binance',
            'https://www.facebook.com/binance',
            'https://www.linkedin.com/company/binance'
          ],
          logo: 'https://assets.coingecko.com/markets/images/52/small/binance.jpg',
          foundingDate: '2017-07-14',
          areaServed: 'Worldwide',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        }
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Organization',
          name: 'Coinbase',
          description: 'Leading US-based cryptocurrency exchange with user-friendly mobile app and high security standards',
          url: 'https://www.coinbase.com',
          sameAs: [
            'https://twitter.com/coinbase',
            'https://www.facebook.com/coinbase',
            'https://www.linkedin.com/company/coinbase'
          ],
          logo: 'https://assets.coingecko.com/markets/images/23/small/coinbase.jpg',
          foundingDate: '2012-06-20',
          areaServed: 'Worldwide',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        }
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Organization',
          name: 'Kraken',
          description: 'Established cryptocurrency exchange known for security and advanced trading features',
          url: 'https://www.kraken.com',
          sameAs: [
            'https://twitter.com/kraken',
            'https://www.facebook.com/kraken',
            'https://www.linkedin.com/company/kraken'
          ],
          logo: 'https://assets.coingecko.com/markets/images/29/small/kraken.jpg',
          foundingDate: '2011-07-28',
          areaServed: 'Worldwide',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        }
      }
    ]
  },
  about: {
    '@type': 'Thing',
    name: 'Cryptocurrency Trading Apps and Exchanges',
    description: 'Digital platforms and mobile applications for trading cryptocurrencies',
    sameAs: 'https://en.wikipedia.org/wiki/Cryptocurrency_exchange'
  },
  provider: {
    '@type': 'Organization',
    name: 'Crypto Greed Index',
    url: 'https://cryptogreedindex.com',
    logo: 'https://cryptogreedindex.com/cryptogreedindex.png',
    sameAs: [
      'https://twitter.com/cryptogreedindex',
      'https://www.facebook.com/cryptogreedindex',
      'https://www.linkedin.com/company/cryptogreedindex'
    ]
  },
  datePublished: '2025-03-31',
  dateModified: '2025-03-31',
  inLanguage: 'en-US',
  isAccessibleForFree: true,
  license: 'https://cryptogreedindex.com/terms',
  keywords: 'cryptocurrency trading app, crypto exchange, trading platform, digital assets, blockchain, crypto trading, cryptocurrency exchange, crypto platform, best crypto app, crypto day trading, crypto futures trading, decentralized exchange',
  articleSection: 'Cryptocurrency Trading',
  articleBody: 'Comprehensive comparison of top cryptocurrency exchanges and trading apps including features, security ratings, trading volumes, and user reviews. Perfect for both beginners and experienced traders.',
  wordCount: 1500,
  timeRequired: 'PT10M',
  educationalLevel: 'beginner',
  interactivityType: 'mixed',
  isFamilyFriendly: true,
  copyrightYear: 2025,
  version: '1.0',
  accessibilityFeature: ['readingOrder', 'structuralNavigation'],
  accessibilityHazard: 'none',
  accessibilityControl: ['fullKeyboardControl', 'fullMouseControl'],
  accessibilityAPI: ['ARIA'],
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  softwareVersion: '1.0.0',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  }
}; 