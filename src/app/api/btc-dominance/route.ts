import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch total market cap data
    const response = await fetch(
      'https://api.coingecko.com/api/v3/global/market_cap_chart?vs_currency=usd&days=365',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: {
          revalidate: 300 // Cache for 5 minutes
        }
      }
    );

    if (response.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Fetch BTC data
    const btcResponse = await fetch(
      'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: {
          revalidate: 300 // Cache for 5 minutes
        }
      }
    );

    if (btcResponse.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (!btcResponse.ok) {
      throw new Error(`Failed to fetch BTC data: ${btcResponse.status} ${btcResponse.statusText}`);
    }

    const btcData = await btcResponse.json();

    // Validate data structure
    if (!data.total_market_cap || !btcData.market_caps || 
        !Array.isArray(data.total_market_cap) || !Array.isArray(btcData.market_caps)) {
      throw new Error('Invalid data structure received from API');
    }

    // Process the data to calculate dominance
    const dominanceData = data.total_market_cap.map((total: [number, number], index: number) => {
      const timestamp = total[0];
      const totalMarketCap = total[1];
      const btcMarketCap = btcData.market_caps[index]?.[1] ?? 0;
      const dominance = btcMarketCap > 0 ? (btcMarketCap / totalMarketCap) * 100 : 0;

      return {
        date: new Date(timestamp).toISOString(),
        dominance: Number(dominance.toFixed(2))
      };
    });

    return NextResponse.json({ data: dominanceData });
  } catch (error) {
    console.error('Error fetching BTC dominance data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch BTC dominance data';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 