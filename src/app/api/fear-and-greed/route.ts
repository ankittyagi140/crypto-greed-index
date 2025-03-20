import { NextResponse } from 'next/server';

interface FearAndGreedDataItem {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update: string;
}

interface ApiResponse {
  data: FearAndGreedDataItem[];
}

interface ProcessedFearAndGreedData {
  value: number;
  timestamp: string;
  value_classification: string;
}

interface BTCPriceData {
  timestamp: string;
  price: number;
}

// Cache the responses for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cachedData: {
  fearGreed: ProcessedFearAndGreedData[];
  btcPrice: BTCPriceData[];
  timeRange: {
    start: string;
    end: string;
  };
} | null = null;
let lastFetchTime = 0;

async function fetchFearAndGreedData(): Promise<ProcessedFearAndGreedData[]> {
  try {
    // Fetch 365 days of fear and greed data
    const response = await fetch('https://api.alternative.me/fng/?limit=365');
    if (!response.ok) {
      throw new Error('Failed to fetch fear and greed data');
    }
    const data: ApiResponse = await response.json();
    return data.data
      .map((item) => ({
        value: parseInt(item.value),
        timestamp: new Date(parseInt(item.timestamp) * 1000).toISOString(),
        value_classification: item.value_classification
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort by date descending
  } catch (error) {
    console.error('Error fetching fear and greed data:', error);
    throw error;
  }
}

async function fetchBTCPriceHistory(): Promise<BTCPriceData[]> {
  try {
    // Fetch 365 days of BTC price data
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily'
    );
    if (!response.ok) {
      throw new Error('Failed to fetch BTC price data');
    }
    const data = await response.json();
    return data.prices
      .map(([timestamp, price]: [number, number]) => ({
        timestamp: new Date(timestamp).toISOString(),
        price
      }))
      .sort((a: BTCPriceData, b: BTCPriceData) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); // Sort by date ascending
  } catch (error) {
    console.error('Error fetching BTC price data:', error);
    throw error;
  }
}

export async function GET() {
  try {
    // Check if we have cached data that's still valid
    const now = Date.now();
    if (cachedData && now - lastFetchTime < CACHE_DURATION) {
      return NextResponse.json(cachedData);
    }

    // Fetch new data
    const [fearGreedData, btcPriceData] = await Promise.all([
      fetchFearAndGreedData(),
      fetchBTCPriceHistory()
    ]);

    // Prepare the response data
    const responseData = {
      fearGreed: fearGreedData,
      btcPrice: btcPriceData,
      timeRange: {
        start: fearGreedData[0]?.timestamp,
        end: fearGreedData[fearGreedData.length - 1]?.timestamp
      }
    };

    // Update cache
    cachedData = responseData;
    lastFetchTime = now;

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
} 