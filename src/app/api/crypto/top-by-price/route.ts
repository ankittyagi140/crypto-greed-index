import { NextResponse } from 'next/server';

// interface CryptoMarketData {
//   id: string;
//   symbol: string;
//   name: string;
//   image: string;
//   current_price: number;
//   market_cap: number;
//   market_cap_rank: number;
//   price_change_percentage_24h: number | null;
//   total_volume: number;
//   high_24h: number | null;
//   low_24h: number | null;
//   ath: number;
//   atl: number;
//   sparkline_in_7d?: {
//     price: number[];
//   };
// }

async function fetchWithRetry(url: string, options: RequestInit = {}) {
  const maxRetries = 3;
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          ...options.headers,
        },
      });
      return response;
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  throw lastError;
}

async function fetchTopByPrice() {
  try {
    const response = await fetchWithRetry(
      'https://api.coingecko.com/api/v3/coins/markets' +
      '?vs_currency=usd' +
      '&order=price_desc' +
      '&per_page=10' +
      '&sparkline=true' +
      '&price_change_percentage=24h',
      {
        next: {
          revalidate: 300 // Cache for 5 minutes
        }
      }
    );

    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch crypto market data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching crypto market data:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const marketData = await fetchTopByPrice();

    return NextResponse.json(marketData, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch cryptocurrency data';
    const status = errorMessage.includes('Rate limit exceeded') ? 429 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { 
        status,
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60'
        }
      }
    );
  }
} 