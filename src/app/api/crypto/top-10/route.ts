import { NextResponse } from 'next/server';

interface CryptoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d_in_currency: number | null;
  price_change_percentage_30d_in_currency: number | null;
  total_volume: number;
  high_24h: number | null;
  low_24h: number | null;
  ath: number;
  atl: number;
  sparkline_in_7d: {
    price: number[];
  };
}

interface EnrichedCryptoData extends CryptoMarketData {
  high_7d: number;
  low_7d: number;
  high_30d: number;
  low_30d: number;
  price_change_percentage_7d: number | null;
  price_change_percentage_30d: number | null;
}

/**
 * Fetches data with retry logic and exponential backoff
 * @param url The URL to fetch
 * @param options Fetch options
 * @param maxRetries Maximum number of retries
 * @param baseDelay Base delay in ms before retrying
 * @returns The fetch response
 */
async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  maxRetries = 3, 
  baseDelay = 1000
): Promise<Response> {
  let retries = 0;
  
  while (true) {
    try {
      const response = await fetch(url, options);
      
      // If not rate limited or we've used all retries, return the response
      if (response.status !== 429 || retries >= maxRetries) {
        return response;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, retries);
      console.log(`Rate limited. Retrying in ${delay}ms (attempt ${retries + 1}/${maxRetries})`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    } catch (error) {
      // For network errors, also use retry logic
      if (retries >= maxRetries) throw error;
      
      const delay = baseDelay * Math.pow(2, retries);
      console.log(`Network error. Retrying in ${delay}ms (attempt ${retries + 1}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
}

async function fetchCryptoMarketData() {
  try {
    const response = await fetchWithRetry(
      'https://api.coingecko.com/api/v3/coins/markets' +
      '?vs_currency=usd' +
      '&order=market_cap_desc' +
      '&per_page=10' +
      '&sparkline=true' +
      '&price_change_percentage=24h%2C7d%2C30d',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: {
          revalidate: 300 // Cache for 5 minutes to reduce API calls
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

async function fetchOHLCData(coinId: string) {
  try {
    const response = await fetchWithRetry(
      `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=30`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: {
          revalidate: 300 // Cache for 5 minutes to reduce API calls
        }
      }
    );

    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch OHLC data for ${coinId}: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching OHLC data for ${coinId}:`, error);
    throw error;
  }
}

export async function GET() {
  try {
    // Fetch basic market data
    const marketData = await fetchCryptoMarketData();

    // Enrich data with OHLC information
    const enrichedData = await Promise.all(
      marketData.map(async (crypto: CryptoMarketData) => {
        try {
          const ohlcData = await fetchOHLCData(crypto.id);

          // Process weekly and monthly ranges
          const weekData = ohlcData.slice(-7);
          const monthData = ohlcData;

          const weekHigh = weekData.length > 0 ? Math.max(...weekData.map((d: number[]) => d[2])) : null;
          const weekLow = weekData.length > 0 ? Math.min(...weekData.map((d: number[]) => d[3])) : null;
          const monthHigh = monthData.length > 0 ? Math.max(...monthData.map((d: number[]) => d[2])) : null;
          const monthLow = monthData.length > 0 ? Math.min(...monthData.map((d: number[]) => d[3])) : null;

          // Make sure sparkline_in_7d is included in the enriched data
          return {
            ...crypto,
            high_24h: crypto.high_24h || crypto.current_price,
            low_24h: crypto.low_24h || crypto.current_price,
            high_7d: weekHigh || crypto.current_price,
            low_7d: weekLow || crypto.current_price,
            high_30d: monthHigh || crypto.current_price,
            low_30d: monthLow || crypto.current_price,
            price_change_percentage_7d: crypto.price_change_percentage_7d_in_currency,
            price_change_percentage_30d: crypto.price_change_percentage_30d_in_currency,
            sparkline_in_7d: crypto.sparkline_in_7d // Ensure sparkline data is included
          } as EnrichedCryptoData;
        } catch (err) {
          console.error(`Error processing OHLC data for ${crypto.id}:`, err);
          // Return original data with current price as fallback for ranges
          return {
            ...crypto,
            high_24h: crypto.high_24h || crypto.current_price,
            low_24h: crypto.low_24h || crypto.current_price,
            high_7d: crypto.current_price,
            low_7d: crypto.current_price,
            high_30d: crypto.current_price,
            low_30d: crypto.current_price,
            price_change_percentage_7d: crypto.price_change_percentage_7d_in_currency,
            price_change_percentage_30d: crypto.price_change_percentage_30d_in_currency,
            sparkline_in_7d: crypto.sparkline_in_7d // Ensure sparkline data is included
          } as EnrichedCryptoData;
        }
      })
    );

    // Cache the response for 5 minutes
    return NextResponse.json(enrichedData, {
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
          // Cache error responses for a shorter time
          'Cache-Control': 'public, max-age=60, s-maxage=60'
        }
      }
    );
  }
} 