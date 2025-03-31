import { MetadataRoute } from 'next'

const BASE_URL = 'https://www.cryptogreedindex.com'

const US_MARKET_INDICES = [
  'sp500',
  'nasdaq',
  'dow-jones',
  'russell2000',
  'dollar-index',  
] as const;

const PAGES = {
  HOME: {
    path: '',
    priority: 1,
    changeFrequency: 'daily' as const,
  },
  FEAR_GREED_VS_BTC: {
    path: 'fear-greed-vs-btc',
    priority: 1,
    changeFrequency: 'daily' as const,
  },
  SOCIAL_SENTIMENTS_BTC: {
    path: 'social-sentiments-btc',
    priority: 1,
    changeFrequency: 'daily' as const,
  },
  DONATE: {
    path: 'donate',
    priority: 0.8,
    changeFrequency: 'monthly' as const,
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
  ALTCOIN_DOMINANCE: {
    path: 'altcoin-dominance',
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
  DISCLAIMER: {
    path: 'disclaimer',
    priority: 0.5,
    changeFrequency: 'monthly' as const,
  },
  EXCHANGES: {
    path: 'top-crypto-exchanges',
    priority: 0.9,
    changeFrequency: 'daily' as const,
  },
};

async function getTopCoins() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false',
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch coins');
    }

    const coins = await response.json();
    return coins.map((coin: { id: string }) => coin.id);
  } catch (error) {
    console.error('Error fetching coins for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Generate coin pages
  const topCoins = await getTopCoins();
  const coinPages = topCoins.map((coinId: string) => ({
    url: `${BASE_URL}/${coinId}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    ...mainPages,
    ...marketIndexPages,
    ...coinPages,
  ]
} 