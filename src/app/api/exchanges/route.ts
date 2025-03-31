import { NextResponse } from 'next/server';

interface CoinGeckoExchange {
  id: string;
  name: string;
  image: string;
  description: string;
  trade_volume_24h_btc: number;
  number_of_trading_pairs: number;
  trust_score: number;
  trust_score_rank: number;
  year_established: number;
  url: string;
  api_url: string;
  has_trading_incentive: boolean;
  centralized: boolean;
  public_interest_score: number;
  liquidity_score: number;
  market_data: {
    trading_volume_24h_btc: number;
    number_of_trading_pairs: number;
  };
}

interface FormattedExchange {
  id: string;
  name: string;
  image: string;
  description: string;
  volume24h: number;
  tradingPairs: string | number;
  status: string;
  founded: string;
  website: string;
  apiUrl: string;
  features: string[];
  trust_score: number;
}

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/exchanges?per_page=200&page=1',
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error('Failed to fetch exchanges');
    }

    const data: CoinGeckoExchange[] = await response.json();

    const formattedExchanges: FormattedExchange[] = data.map((exchange) => ({
      id: exchange.id,
      name: exchange.name,
      image: exchange.image || `https://assets.coingecko.com/markets/images/${exchange.id}/small.png`,
      description: exchange.description || 'No description available',
      volume24h: exchange.trade_volume_24h_btc || 0,
      tradingPairs: exchange.number_of_trading_pairs || 'N/A',
      status: exchange.trust_score_rank ? 'Active' : 'Inactive',
      founded: exchange.year_established ? exchange.year_established.toString() : 'N/A',
      website: exchange.url || 'N/A',
      apiUrl: exchange.api_url || 'N/A',
      features: [
        exchange.has_trading_incentive ? 'Trading Incentives' : null,
        exchange.trust_score_rank ? 'Active' : 'Inactive',
        exchange.public_interest_score > 0 ? 'High Public Interest' : null,
        exchange.liquidity_score > 0 ? 'High Liquidity' : null,
        'Spot Trading',
        exchange.trust_score ? `Trust Score: ${exchange.trust_score}` : null
      ].filter((feature): feature is string => feature !== null),
      trust_score: exchange.trust_score || 0,
      trust_rank: exchange.trust_score_rank || 0
    }));


    return NextResponse.json(formattedExchanges);
  } catch (error) {
    console.error('Error fetching exchanges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exchanges' },
      { status: 500 }
    );
  }
} 