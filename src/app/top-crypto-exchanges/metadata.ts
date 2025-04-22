import { Metadata } from 'next';

const title = 'Best Crypto Trading App 2025 | Top Cryptocurrency Exchanges & Platforms';
const description = 'Find the best cryptocurrency trading app and top crypto exchanges for 2025. Compare features, security, and trading volumes of leading platforms like Binance, Coinbase, and Kraken. Perfect for both beginners and day traders.';
const imageUrl = 'https://cryptogreedindex.com/cryptogreedindex.png';
const pageUrl = 'https://cryptogreedindex.com/top-crypto-exchanges';

export const metadata: Metadata = {
  title,
  description,
  keywords: 'best crypto trading app, best app for crypto trading, top crypto exchanges, best cryptocurrency exchanges, best crypto exchange for day trading, best platform for crypto trading, most secure crypto exchange, best decentralized exchange, crypto exchange ranking, best crypto futures trading platform, best cryptocurrency platform, best crypto currency app, best app for trading cryptocurrency, best app for buying cryptocurrency, best cryptocurrency broker',
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'en_US',
    siteName: 'Crypto Greed Index',
    url: pageUrl,
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: 'Best Crypto Trading App and Top Cryptocurrency Exchanges',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [imageUrl],
  },
  alternates: {
    canonical: pageUrl,
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
  authors: [{ name: 'Crypto Greed Index' }],
  publisher: 'Crypto Greed Index',
  creator: 'Crypto Greed Index',
  category: 'cryptocurrency',
  classification: 'business',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description,
  url: pageUrl,
  image: imageUrl,
  thumbnailUrl: imageUrl,
  datePublished: '2025-03-31',
  dateModified: '2025-03-31',
  inLanguage: 'en-US',
  isAccessibleForFree: true,
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: [
      // List of items (Binance, Coinbase, Kraken)...
    ],
  },
  about: {
    '@type': 'Thing',
    name: 'Cryptocurrency Trading Apps and Exchanges',
    description: 'Digital platforms and mobile applications for trading cryptocurrencies',
    sameAs: 'https://en.wikipedia.org/wiki/Cryptocurrency_exchange',
  },
  provider: {
    '@type': 'Organization',
    name: 'Crypto Greed Index',
    url: 'https://cryptogreedindex.com',
    logo: imageUrl,
    sameAs: [
      'https://x.com/AnkiTyagi007',
    ],
  },
  publisher: {
    '@type': 'Organization',
    name: 'Crypto Greed Index',
    url: 'https://cryptogreedindex.com',
    logo: imageUrl,
  },
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
    availability: 'https://schema.org/InStock',
  },
};
