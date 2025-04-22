import { NextRequest, NextResponse } from 'next/server';
 
 // Cache duration of 5 minutes
 const CACHE_DURATION = 300;
 
 interface CoinData {
   id: string;
   symbol: string;
   name: string;
   current_price: number;
   market_cap: number;
   market_cap_rank: number;
   total_volume: number;
   high_24h: number;
   low_24h: number;
   price_change_24h: number;
   price_change_percentage_24h: number;
   price_change_percentage_7d?: number;
   price_change_percentage_30d?: number;
   sparkline_in_7d?: {
     price: number[];
   };
 }
 
 interface EnrichedCoinData extends CoinData {
   sparkline_data: number[];
   price_change_percentage_24h_formatted: string;
   price_change_percentage_7d_formatted: string;
   price_change_percentage_30d_formatted: string;
 }
 
 export async function GET(request: NextRequest) {
   try {
     const searchParams = request.nextUrl.searchParams;
     const page = searchParams.get('page') || '1';
     const perPage = searchParams.get('per_page') || '10';
 
     const response = await fetch(
       'https://api.coingecko.com/api/v3/coins/markets?' +
       new URLSearchParams({
         vs_currency: 'usd',
         order: 'market_cap_desc',
         per_page: perPage,
         page: page,
         sparkline: 'true',
         price_change_percentage: '24h,7d,30d',
         locale: 'en'
       }),
       {
         headers: {
           'Accept': 'application/json'
         },
         next: {
           revalidate: CACHE_DURATION
         }
       }
     );
 
     if (!response.ok) {
       throw new Error(`Failed to fetch data: ${response.status}`);
     }
 
     const data = await response.json() as CoinData[];
     
     const enrichedData: EnrichedCoinData[] = data.map(coin => ({
       ...coin,
       sparkline_data: coin.sparkline_in_7d?.price || [],
       price_change_percentage_24h_formatted: coin.price_change_percentage_24h?.toFixed(2) || '0.00',
       price_change_percentage_7d_formatted: coin.price_change_percentage_7d?.toFixed(2) || '0.00',
       price_change_percentage_30d_formatted: coin.price_change_percentage_30d?.toFixed(2) || '0.00'
     }));
     
     return NextResponse.json(enrichedData, {
       headers: {
         'Cache-Control': `public, max-age=${CACHE_DURATION}`,
       },
     });
 
   } catch (error) {
     console.error('Error in GET handler:', error);
     return NextResponse.json(
       { error: 'Failed to fetch cryptocurrency data' },
       { status: 500 }
     );
   }
 } 