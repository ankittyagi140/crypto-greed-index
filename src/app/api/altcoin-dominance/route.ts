import { NextResponse } from 'next/server';

// Mark this route as dynamic to allow using searchParams
export const dynamic = 'force-dynamic';

interface MarketCapPercentage {
  btc: number;
  eth: number;
  [key: string]: number;
}

interface CoinGeckoDayData {
  date: string;
  market_cap_percentage: MarketCapPercentage;
}

interface HistoricalDataPoint {
  date: string;
  dominance: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '7d';

    let days = 7; // default to 7 days
    switch (timeframe) {
      case '1d':
        days = 1;
        break;
      case '30d':
        days = 30;
        break;
    }

    // Fetch historical data for total market cap and BTC/ETH dominance
    const response = await fetch(
      `https://api.coingecko.com/api/v3/global/history?days=${days}`,
      {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'public, max-age=300'
        }
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a few minutes.' },
          { status: 429 }
        );
      }
      throw new Error('Failed to fetch data from CoinGecko');
    }

    const data = await response.json() as CoinGeckoDayData[];
    
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid data received from CoinGecko');
    }

    // Process the historical data
    const historicalData = data.map((day: CoinGeckoDayData) => {
      if (!day.market_cap_percentage) return null;

      const btcDominance = day.market_cap_percentage.btc || 0;
      const ethDominance = day.market_cap_percentage.eth || 0;
      const altcoinDominance = 100 - btcDominance - ethDominance;

      return {
        date: new Date(day.date).toISOString().split('T')[0],
        dominance: altcoinDominance
      };
    }).filter((item): item is HistoricalDataPoint => item !== null);

    return NextResponse.json({
      data: historicalData
    });
  } catch (error) {
    console.error('Error fetching altcoin dominance data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch altcoin dominance data' },
      { status: 500 }
    );
  }
} 