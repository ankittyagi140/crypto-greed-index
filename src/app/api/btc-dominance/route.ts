import { NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function GET() {
  try {
    // Fetch global market data from CoinGecko
    const response = await fetch(`${COINGECKO_API}/global`);

    if (!response.ok) {
      throw new Error('Failed to fetch data from CoinGecko');
    }

    const result = await response.json();
    const btcDominance = result.data?.market_cap_percentage?.btc || 0;

    // Create a 30-day array of dominance data (for historical view)
    // Note: For real historical data, you'd need CoinGecko's Pro API or another data source
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const data = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      
      // Add some random variation to create a realistic looking chart
      // In production, this should be replaced with real historical data
      const randomVariation = (Math.random() - 0.5) * 2; // ±1% variation
      const dominance = Math.max(0, Math.min(100, btcDominance + randomVariation));
      
      return {
        date: date.toISOString(),
        dominance
      };
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching BTC dominance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch BTC dominance data' },
      { status: 500 }
    );
  }
}
