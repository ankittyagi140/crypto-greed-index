import { MetadataRoute } from 'next'

const BASE_URL = 'https://www.cryptogreedindex.com'

const US_MARKET_INDICES = [
  'sp500',
  'nasdaq',
  'dow-jones',
  'russell2000'
] as const;

const PAGES = {
  HOME: {
    path: '',
    priority: 1,
    changeFrequency: 'daily' as const,
  },
  US_MARKETS: {
    path: 'us-markets',
    priority: 1,
    changeFrequency: 'daily' as const,
  },
  GLOBAL_MARKETS: {
    path: 'global-markets',
    priority: 1,
    changeFrequency: 'daily' as const,
  },
  BTC_DOMINANCE: {
    path: 'btc-dominance',
    priority: 1,
    changeFrequency: 'daily' as const,
  },
  ETH_DOMINANCE: {
    path: 'eth-dominance',
    priority: 1,
    changeFrequency: 'daily' as const,
  },
  ABOUT: {
    path: 'about',
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  },
  CONTACT: {
    path: 'contact',
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  },
  PRIVACY: {
    path: 'privacy',
    priority: 0.5,
    changeFrequency: 'monthly' as const,
  },
  TERMS: {
    path: 'terms',
    priority: 0.5,
    changeFrequency: 'monthly' as const,
  },
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  
  // Generate main pages
  const mainPages = Object.values(PAGES).map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path ? `/${path}` : ''}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  // Generate US market index pages
  const marketIndexPages = US_MARKET_INDICES.map(index => ({
    url: `${BASE_URL}/us-markets/${index}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [
    ...mainPages,
    ...marketIndexPages,
  ]
} 