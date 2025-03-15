import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch current global data
    const currentResponse = await fetch('https://api.coingecko.com/api/v3/global', {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!currentResponse.ok) {
      if (currentResponse.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      throw new Error(`CoinGecko API responded with status: ${currentResponse.status}`);
    }

    const currentData = await currentResponse.json();

    // Fetch top coins data to get volume change
    const topCoinsResponse = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_vol_change=true',
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    let volumeChangePercentage = 0;

    if (topCoinsResponse.ok) {
      const topCoinsData = await topCoinsResponse.json();
      // Use Bitcoin's volume change as a proxy for overall market volume change
      volumeChangePercentage = topCoinsData.bitcoin?.usd_24h_vol_change || 0;
    }

    // Fetch Fear and Greed Index
    const fearGreedResponse = await fetch('https://api.alternative.me/fng/', {
      headers: {
        'Accept': 'application/json',
      },
    });

    let fearGreedValue = undefined;
    let fearGreedClassification = undefined;

    if (fearGreedResponse.ok) {
      const fearGreedData = await fearGreedResponse.json();
      if (fearGreedData.data?.[0]) {
        fearGreedValue = parseInt(fearGreedData.data[0].value);
        fearGreedClassification = fearGreedData.data[0].value_classification;
      }
    }

    // Add the volume change and fear/greed data to the response
    const enrichedData = {
      ...currentData,
      data: {
        ...currentData.data,
        volume_change_percentage_24h_usd: Number(volumeChangePercentage.toFixed(2)),
        fear_greed_value: fearGreedValue,
        fear_greed_classification: fearGreedClassification
      }
    };

    return NextResponse.json(enrichedData);
  } catch (error) {
    console.error('Error fetching global data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch global market data' },
      { status: 500 }
    );
  }
} 