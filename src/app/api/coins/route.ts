import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Mark this route as dynamic to allow using searchParams
export const dynamic = 'force-dynamic';

export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: NextRequest) {
  try {
    // Get the per_page parameter from the URL, default to 10 if not specified
    const searchParams = request.nextUrl.searchParams;
    const perPage = searchParams.get('per_page') || '10';

    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?' +
      new URLSearchParams({
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: perPage,
        page: '1',
        sparkline: 'false',
        locale: 'en'
      }),
      {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'public, max-age=300'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data from CoinGecko');
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data' },
      { status: 500 }
    );
  }
} 