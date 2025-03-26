import { NextResponse } from 'next/server';
import { getHistoricalData, FearGreedData } from '../../../../lib/fear-greed';

export async function GET() {
  try {
    // Fetch 30 days of data to get all the points we need
    const historicalData = await getHistoricalData(30);
    
    if (!historicalData || historicalData.length === 0) {
      throw new Error('No data received');
    }

    // Extract the required timeframes
    const now = historicalData[0];
    const yesterday = historicalData.find((_: FearGreedData, index: number) => index === 1) || now;
    const lastWeek = historicalData.find((_: FearGreedData, index: number) => index === 6) || now;
    const lastMonth = historicalData.find((_: FearGreedData, index: number) => index === 29) || now;

    return NextResponse.json({
      now,
      yesterday,
      lastWeek,
      lastMonth
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical data' },
      { status: 500 }
    );
  }
} 