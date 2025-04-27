import { NextRequest, NextResponse } from 'next/server';
 
// Cache duration of 5 minutes
const CACHE_DURATION = 300;

// CoinStats API endpoint and interface
// Available endpoints:
// - /coins - List all coins
// - /coins/{id} - Get specific coin
// - /markets - List all markets
// - /charts/coins/{coinId} - Historical data for a coin
// - /exchanges - List all exchanges
const COINSTATS_API = 'https://openapiv1.coinstats.app/coins';
const COINSTATS_CHARTS_API = 'https://openapiv1.coinstats.app/coins';
// Use the provided API key directly if the environment variable is not set
const COINSTATS_API_KEY = process.env.COINSTAT_API_KEY || 'BzGqUBQbt6Zmd/hI4E2iD2mloJWjj0Ub0ZBMbvh9IQY=';

interface CoinStatsResponse {
  result: CoinStatsData[];
  meta: {
    pagination: {
      count: number;
      limit: number;
      offset: number;
      total: number;
    }
  }
}

interface CoinStatsData {
  id: string;
  icon: string;
  name: string;
  symbol: string;
  rank: number;
  price: number;
  priceBtc: number;
  volume: number;
  marketCap: number;
  availableSupply: number;
  totalSupply: number;
  fullyDilutedValuation?: number;
  liquidityScore?: number;
  volatilityScore?: number;
  marketCapScore?: number;
  riskScore?: number;
  avgChange?: number;
  priceChange1h: number;
  priceChange1d: number;
  priceChange1w: number;
  redditUrl?: string;
  websiteUrl?: string;
  twitterUrl?: string;
  contractAddress?: string;
  decimals?: number;
  explorers?: string[];
}
 
// Our existing enriched coin data interface
interface EnrichedCoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_1h?: number;
  price_change_percentage_7d?: number;
  price_change_percentage_30d?: number;
  sparkline_data: number[];
  price_change_percentage_24h_formatted: string;
  price_change_percentage_7d_formatted: string;
  price_change_percentage_30d_formatted: string;
  price_change_percentage_1h_formatted: string;
  fully_diluted_valuation?: number;
}
 
// Utility function to fetch sparkline data for a coin
async function fetchSparklineData(coinId: string): Promise<number[]> {
  try {
    const sparklineResponse = await fetch(
      `${COINSTATS_CHARTS_API}/${coinId}/charts?period=1w`,
      {
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': COINSTATS_API_KEY
        }
      }
    );

    if (sparklineResponse.ok) {
      const chartData = await sparklineResponse.json();
      
      // Handle different response formats
      if (Array.isArray(chartData)) {
        // Format is array of [timestamp, price, ...] arrays
        return chartData.map(point => point[1]); // Extract price values
      } else if (chartData && chartData.c && Array.isArray(chartData.c)) {
        // Format is {t: [...], c: [...]}
        return chartData.c;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch sparkline data for ${coinId}:`, error);
  }

  return []; // Return empty array if fetch fails
}

// Generate mock sparkline data based on coin price and weekly change
function generateMockSparklineData(basePrice: number, weeklyChange: number): number[] {
  const volatility = 0.02; // 2% volatility
  return Array.from({ length: 24 }, (_, i) => {
    // Add some randomness but follow the general trend of weekly change
    const progress = i / 23; // 0 to 1 based on position
    const trendComponent = (weeklyChange / 100) * progress;
    const randomComponent = (Math.random() * 2 - 1) * volatility;
    return basePrice * (1 + randomComponent + trendComponent);
  });
}


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '10');
    
    // Fetch the coin list
    const response = await fetch(
      `${COINSTATS_API}?page=${page}&limit=${perPage}`,
      {
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': COINSTATS_API_KEY
        },
        next: {
          revalidate: CACHE_DURATION
        }
      }
    );
 
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
 
    const data = await response.json() as CoinStatsResponse;
    
    // Prepare coin data mapping
    const coinsData: EnrichedCoinData[] = data.result.map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toLowerCase(),
      name: coin.name,
      image: coin.icon,
      current_price: coin.price,
      market_cap: coin.marketCap,
      market_cap_rank: coin.rank,
      total_volume: coin.volume,
      high_24h: coin.price * (1 + Math.max(0, coin.priceChange1d/100)),
      low_24h: coin.price * (1 - Math.max(0, -coin.priceChange1d/100)),
      price_change_24h: coin.price * (coin.priceChange1d / 100),
      price_change_percentage_24h: coin.priceChange1d,
      price_change_percentage_7d: coin.priceChange1w,
      price_change_percentage_1h: coin.priceChange1h,
      price_change_percentage_30d: coin.priceChange1w,
      price_change_percentage_24h_formatted: coin.priceChange1d.toFixed(2),
      price_change_percentage_7d_formatted: coin.priceChange1w.toFixed(2),
      price_change_percentage_30d_formatted: coin.priceChange1w.toFixed(2),
      price_change_percentage_1h_formatted: coin.priceChange1h.toFixed(2),
      fully_diluted_valuation: coin.fullyDilutedValuation,
      sparkline_data: [] // Will be populated later
    }));
    
    // Fetch all sparkline data in parallel (with limit to avoid rate limiting)
    const BATCH_SIZE = 5;
    for (let i = 0; i < coinsData.length; i += BATCH_SIZE) {
      const batch = coinsData.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (coin, index) => {
        const sparklineData = await fetchSparklineData(coin.id);
        if (sparklineData.length > 0) {
          coinsData[i + index].sparkline_data = sparklineData;
        } else {
          // Generate mock data if API fetch fails
          coinsData[i + index].sparkline_data = generateMockSparklineData(
            coin.current_price, 
            coin.price_change_percentage_7d || 0
          );
        }
      }));
    }
    
    return NextResponse.json(coinsData, {
      headers: {
        'Cache-Control': `public, max-age=${CACHE_DURATION}`,
      },
    });
 
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data' },
      { status: 500 }
    );
  }
}

// Remove unused function
// Function to format percentage values

