import { NextResponse } from 'next/server';

interface CoinGeckoResponse {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketCap: number;
  volume: number;
}

export async function GET() {
  try {
    // Fetch crypto data from CoinGecko
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=price_change_percentage_24h_desc&per_page=100&sparkline=false'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data from CoinGecko');
    }

    const data: CoinGeckoResponse[] = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No crypto data available');
    }

    // Process top 10 gainers
    const gainers: MarketMover[] = data.slice(0, 10).map((coin: CoinGeckoResponse) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume: coin.total_volume
    }));

    // Process top 10 losers (reverse the array and take first 10)
    const losers: MarketMover[] = data.slice(-10).reverse().map((coin: CoinGeckoResponse) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume: coin.total_volume
    }));

    return NextResponse.json({ gainers, losers });
  } catch (error) {
    console.error('Error fetching crypto movers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crypto movers data' },
      { status: 500 }
    );
  }
} 