import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') || '90';
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Bitcoin price data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Bitcoin price data' },
      { status: 500 }
    );
  }
} 