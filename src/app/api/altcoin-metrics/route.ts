import { NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

interface CoinGeckoGlobalData {
  data: {
    total_market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    market_cap_percentage: {
      btc: number;
      eth: number;
    };
    active_cryptocurrencies: number;
  };
}

interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  price_change_percentage_24h: number | null;
  market_cap: number;
  total_volume: number;
}

export async function GET() {
  try {
    // Fetch global market data from CoinGecko
    const [globalData, topCoinsData] = await Promise.all([
      fetch(`${COINGECKO_API}/global`),
      fetch(`${COINGECKO_API}/coins/markets?vs_currency=usd&order=volume_desc&per_page=100&page=1&sparkline=false`)
    ]);

    if (!globalData.ok || !topCoinsData.ok) {
      throw new Error('Failed to fetch data from CoinGecko');
    }

    const globalResult = (await globalData.json()) as CoinGeckoGlobalData;
    const topCoins = (await topCoinsData.json()) as CoinGeckoCoin[];

    // Calculate total altcoin market cap (total - BTC - ETH)
    const totalMarketCap = globalResult.data?.total_market_cap?.usd || 0;
    const btcMarketCap = (globalResult.data?.market_cap_percentage?.btc || 0) * totalMarketCap / 100;
    const ethMarketCap = (globalResult.data?.market_cap_percentage?.eth || 0) * totalMarketCap / 100;
    const altcoinMarketCap = totalMarketCap - btcMarketCap - ethMarketCap;

    // Count gainers and losers
    const gainers = topCoins.filter((coin) => (coin.price_change_percentage_24h || 0) > 0).length;
    const losers = topCoins.filter((coin) => (coin.price_change_percentage_24h || 0) < 0).length;

    // Calculate average price change for sentiment
    const avgPriceChange = topCoins.reduce((acc, coin) => 
      acc + (coin.price_change_percentage_24h || 0), 0) / topCoins.length;

    // Determine market sentiment
    let marketSentiment: 'bearish' | 'neutral' | 'bullish';
    if (avgPriceChange < -2) marketSentiment = 'bearish';
    else if (avgPriceChange > 2) marketSentiment = 'bullish';
    else marketSentiment = 'neutral';

    const metrics = {
      totalMarketCap: altcoinMarketCap,
      volume24h: globalResult.data?.total_volume?.usd || 0,
      numberOfCoins: globalResult.data?.active_cryptocurrencies || 0,
      topGainers: gainers,
      topLosers: losers,
      marketSentiment,
      priceChange24h: avgPriceChange
    };

    return NextResponse.json({ data: metrics }, { status: 200 });
  } catch (error) {
    console.error('Error fetching altcoin metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch altcoin metrics' },
      { status: 500 }
    );
  }
} 