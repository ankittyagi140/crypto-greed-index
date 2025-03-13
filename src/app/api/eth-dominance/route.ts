import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch global crypto market data
    const response = await fetch('https://api.coingecko.com/api/v3/global', {
      headers: {
        'Accept': 'application/json',
      },
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
    });

    if (response.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch global market data: ${response.status} ${response.statusText}`);
    }

    const globalData = await response.json();

    // Fetch ETH market cap over time
    const ethResponse = await fetch(
      'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=365',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: {
          revalidate: 300, // Cache for 5 minutes
        },
      }
    );

    if (ethResponse.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (!ethResponse.ok) {
      throw new Error(`Failed to fetch ETH data: ${ethResponse.status} ${ethResponse.statusText}`);
    }

    const ethData = await ethResponse.json();

    // Validate data structure
    if (
      !globalData.data?.total_market_cap?.usd ||
      !ethData.market_caps ||
      !Array.isArray(ethData.market_caps)
    ) {
      throw new Error('Invalid data structure received from API');
    }

    const totalMarketCap = globalData.data.total_market_cap.usd;

    // Process the data to calculate dominance
    const dominanceData = ethData.market_caps.map(([timestamp, ethMarketCap]: [number, number]) => {
      const dominance = ethMarketCap > 0 ? (ethMarketCap / totalMarketCap) * 100 : 0;

      return {
        date: new Date(timestamp).toISOString(),
        dominance: Number(dominance.toFixed(2)),
      };
    });

    return NextResponse.json({ data: dominanceData });
  } catch (error) {
    console.error('Error fetching ETH dominance data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch ETH dominance data';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 