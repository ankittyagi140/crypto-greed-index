import { NextResponse } from 'next/server';
import { isMarketOpen } from '@/utils/marketHours';

// Cache for API responses when markets are closed
interface CacheItem {
  data: Record<string, unknown>;
  timestamp: number;
  endpoint: string;
}

let apiCache: CacheItem[] = [];

// Cache expiration - 1 hour in milliseconds
const CACHE_EXPIRATION = 60 * 60 * 1000;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const endpoint = url.searchParams.get('endpoint');
  const params = Object.fromEntries(url.searchParams.entries());
  
  // Remove the endpoint parameter as it's used by this wrapper
  delete params.endpoint;
  
  // Validate endpoint
  if (!endpoint) {
    return NextResponse.json(
      { success: false, error: 'Missing endpoint parameter' },
      { status: 400 }
    );
  }
  
  // Allowed internal API endpoints
  const allowedEndpoints = [
    '/api/market-indices',
    '/api/market-movers',
    '/api/us-markets',
    '/api/top-companies',
    '/api/global-markets'
  ];
  
  if (!allowedEndpoints.includes(endpoint)) {
    return NextResponse.json(
      { success: false, error: 'Invalid endpoint' },
      { status: 400 }
    );
  }
  
  // Check if market is open
  const marketOpen = isMarketOpen();
  
  // If market is closed, try to use cached data
  if (!marketOpen) {
    // Find cached response for this endpoint
    const cacheItem = apiCache.find(item => 
      item.endpoint === endpoint &&
      // Check if cache is still valid (not expired)
      (Date.now() - item.timestamp) < CACHE_EXPIRATION
    );
    
    if (cacheItem) {
      console.log(`Using cached data for ${endpoint} - Market closed`);
      return NextResponse.json({
        ...cacheItem.data,
        cached: true,
        cachedTime: new Date(cacheItem.timestamp).toLocaleString()
      });
    }
  }
  
  // Either market is open or we don't have cached data, make the real API call
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      queryParams.append(key, value);
    }
    
    const queryString = queryParams.toString();
    const url = `${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    // Make the actual API call
    const response = await fetch(url);
    const data = await response.json();
    
    // Store in cache for future use when market closes
    apiCache.push({
      data,
      timestamp: Date.now(),
      endpoint
    });
    
    // Limit cache size to prevent memory issues
    if (apiCache.length > 50) {
      // Remove oldest items or expired items
      apiCache = apiCache
        .filter(item => (Date.now() - item.timestamp) < CACHE_EXPIRATION)
        .slice(-30); // Keep only the most recent 30 items
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error proxying request to ${endpoint}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data from endpoint' },
      { status: 500 }
    );
  }
} 