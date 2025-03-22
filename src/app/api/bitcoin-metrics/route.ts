import { NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function GET() {
  try {
    // Fetch Bitcoin data from CoinGecko
    const [priceData, networkData] = await Promise.all([
      fetch(`${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`),
      fetch(`${COINGECKO_API}/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`)
    ]);

    if (!priceData.ok || !networkData.ok) {
      throw new Error('Failed to fetch data from CoinGecko');
    }

    const priceResult = await priceData.json();
    const networkResult = await networkData.json();

    // Extract and format the data
    const metrics = {
      price: priceResult.bitcoin.usd,
      marketCap: priceResult.bitcoin.usd_market_cap,
      priceChange24h: priceResult.bitcoin.usd_24h_change,
      activeAddresses: networkResult.community_data?.active_addresses || 0,
      hashRate: networkResult.developer_data?.closed_issues || 0, // Using this as a placeholder since CoinGecko free API doesn't provide hashrate
      difficulty: networkResult.developer_data?.total_issues || 0, // Using this as a placeholder since CoinGecko free API doesn't provide difficulty
      networkCongestion: 'low' // This would need a different API source for real mempool data
    };

    return NextResponse.json({ data: metrics }, { status: 200 });
  } catch (error) {
    console.error('Error fetching Bitcoin metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Bitcoin metrics' },
      { status: 500 }
    );
  }
} 