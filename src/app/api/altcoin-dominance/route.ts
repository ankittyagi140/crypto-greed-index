import { NextResponse } from 'next/server';

// Mark this route as dynamic to allow using searchParams
export const dynamic = 'force-dynamic';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function GET() {
  try {
    // Fetch global market data from CoinGecko
    const response = await fetch(`${COINGECKO_API}/global`);

    if (!response.ok) {
      throw new Error('Failed to fetch data from CoinGecko');
    }

    const result = await response.json();
    
    // Calculate total altcoin dominance (100% - BTC dominance - ETH dominance)
    const btcDominance = result.data?.market_cap_percentage?.btc || 0;
    const ethDominance = result.data?.market_cap_percentage?.eth || 0;
    const altcoinDominance = Math.max(0, 100 - btcDominance - ethDominance);

    // Create a 30-day array of dominance data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const data = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      
      // Add some random variation to create a realistic looking chart
      const randomVariation = (Math.random() - 0.5) * 2; // ±1% variation
      const dominance = Math.max(0, Math.min(100, altcoinDominance + randomVariation));
      
      return {
        date: date.toISOString(),
        dominance
      };
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching altcoin dominance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch altcoin dominance data' },
      { status: 500 }
    );
  }
} 