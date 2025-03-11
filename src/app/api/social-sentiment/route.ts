import { NextResponse } from 'next/server';


interface MonthlyBTCPrice {
  month: string;
  min: number;
  max: number;
  avg: number;
}

// Historical BTC price ranges for the past year (approximate monthly averages)

async function getBTCPriceData() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily'
    );
    const data = await response.json();
    return data.prices;
  } catch (error) {
    console.error('Error fetching BTC price data:', error);
    
    return null;
  }
}

function getMonthlyBTCPrices(prices: [number, number][]): MonthlyBTCPrice[] {
  const monthlyData: Record<string, { min: number; max: number; sum: number; count: number }> = {};

  prices.forEach(([timestamp, price]) => {
    const date = new Date(timestamp);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { min: price, max: price, sum: price, count: 1 };
    } else {
      monthlyData[monthKey].min = Math.min(monthlyData[monthKey].min, price);
      monthlyData[monthKey].max = Math.max(monthlyData[monthKey].max, price);
      monthlyData[monthKey].sum += price;
      monthlyData[monthKey].count += 1;
    }
  });

  return Object.entries(monthlyData).map(([month, { min, max, sum, count }]) => ({
    month,
    min,
    max,
    avg: sum / count
  }));
}

function generateSocialSentiment(days: number, btcPrices: MonthlyBTCPrice[]) {
  const data = [];
  const now = new Date();
  
  // Generate last 12 months of data
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Format date as YYYY-MM-DD
    const formattedDate = `${monthKey}-01`;
    
    // Find matching BTC price data
    const monthlyBTC = btcPrices.find(p => p.month === monthKey) || {
      min: 0,
      max: 0,
      avg: 0
    };

    // Generate random sentiment data that correlates with BTC price movements
    const priceVolatility = ((monthlyBTC.max - monthlyBTC.min) / monthlyBTC.avg) * 100;
    const baseTwitterSentiment = 40 + (priceVolatility * 0.3) + (Math.random() * 20);
    const baseRedditSentiment = 35 + (priceVolatility * 0.25) + (Math.random() * 25);
    const baseTelegramSentiment = 30 + (priceVolatility * 0.2) + (Math.random() * 30);

    // Calculate platform data first
    const twitter = {
      sentiment: Math.min(100, Math.max(0, baseTwitterSentiment)),
      volume: Math.floor(100000 + Math.random() * 900000),
      positiveCount: Math.floor(10000 + Math.random() * 40000),
      negativeCount: Math.floor(5000 + Math.random() * 20000)
    };

    const reddit = {
      sentiment: Math.min(100, Math.max(0, baseRedditSentiment)),
      volume: Math.floor(80000 + Math.random() * 700000),
      positiveCount: Math.floor(8000 + Math.random() * 35000),
      negativeCount: Math.floor(4000 + Math.random() * 18000)
    };

    const telegram = {
      sentiment: Math.min(100, Math.max(0, baseTelegramSentiment)),
      volume: Math.floor(60000 + Math.random() * 500000),
      positiveCount: Math.floor(6000 + Math.random() * 30000),
      negativeCount: Math.floor(3000 + Math.random() * 15000)
    };

    // Calculate aggregate data
    const aggregate = {
      sentiment: Math.round((twitter.sentiment + reddit.sentiment + telegram.sentiment) / 3),
      volume: twitter.volume + reddit.volume + telegram.volume,
      positiveCount: twitter.positiveCount + reddit.positiveCount + telegram.positiveCount,
      negativeCount: twitter.negativeCount + reddit.negativeCount + telegram.negativeCount
    };

    data.push({
      date: formattedDate,
      btcPrice: monthlyBTC.avg,
      btcPriceMin: monthlyBTC.min,
      btcPriceMax: monthlyBTC.max,
      twitter,
      reddit,
      telegram,
      aggregate
    });
  }

  return data;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Fetch real BTC price data
    const btcPrices = await getBTCPriceData();
    if (!btcPrices) {
      throw new Error('Failed to fetch BTC price data');
    }

    // Calculate monthly BTC prices
    const monthlyBTCPrices = getMonthlyBTCPrices(btcPrices);

    // Generate social sentiment data with real BTC prices
    const data = generateSocialSentiment(days, monthlyBTCPrices);

    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error in social sentiment API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate data' },
      { status: 500 }
    );
  }
} 