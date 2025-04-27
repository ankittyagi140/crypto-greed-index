import { NextRequest, NextResponse } from 'next/server';

// CoinStats API base URL
const COINSTATS_API = 'https://openapiv1.coinstats.app/coins';
// Use the provided API key
const COINSTATS_API_KEY = process.env.COINSTAT_API_KEY || 'BzGqUBQbt6Zmd/hI4E2iD2mloJWjj0Ub0ZBMbvh9IQY=';
// Cache duration of 5 minutes
const CACHE_DURATION = 300;

// Function to format percentage values
function formatPercentage(value: number | undefined): string {
  if (value === undefined || isNaN(value)) {
    return '0.00';
  }
  return value.toFixed(2);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ coinId: string }> }
) {
  try {
    const { coinId } = await context.params;
    
    if (!coinId) {
      return NextResponse.json({ error: 'Coin ID is required' }, { status: 400 });
    }

    // The correct URL format for CoinStats API
    const response = await fetch(
      `${COINSTATS_API}/${coinId}`,
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
      throw new Error(`Failed to fetch coin data: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if data has the expected structure
    if (!data || !data.id) {
      throw new Error('Invalid response format from CoinStats API');
    }
    
    // Enrich the coin data with formatted percentages
    const enrichedData = {
      id: data.id,
      symbol: data.symbol.toLowerCase(),
      name: data.name,
      image: data.icon,
      current_price: data.price,
      market_cap: data.marketCap,
      market_cap_rank: data.rank,
      total_volume: data.volume,
      high_24h: data.price * (1 + Math.max(0, data.priceChange1d/100)),
      low_24h: data.price * (1 - Math.max(0, -data.priceChange1d/100)),
      price_change_24h: data.price * (data.priceChange1d / 100),
      price_change_percentage_24h: data.priceChange1d,
      price_change_percentage_7d: data.priceChange1w,
      price_change_percentage_1h: data.priceChange1h,
      price_change_percentage_30d: data.priceChange1w, // Note: API doesn't provide 30d data, using 1w
      price_change_percentage_24h_formatted: formatPercentage(data.priceChange1d),
      price_change_percentage_7d_formatted: formatPercentage(data.priceChange1w),
      price_change_percentage_1h_formatted: formatPercentage(data.priceChange1h),
      price_change_percentage_30d_formatted: formatPercentage(data.priceChange1w),
      fully_diluted_valuation: data.fullyDilutedValuation,
      total_supply: data.totalSupply,
      available_supply: data.availableSupply,
      website_url: data.websiteUrl,
      twitter_url: data.twitterUrl,
      reddit_url: data.redditUrl,
      explorers: data.explorers || [],
      contract_address: data.contractAddress || null // May not exist for non-token coins
    };

    return NextResponse.json(enrichedData, {
      headers: {
        'Cache-Control': `public, max-age=${CACHE_DURATION}`,
      },
    });

  } catch (error) {
    console.error('Error fetching coin data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coin data' },
      { status: 500 }
    );
  }
} 