import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch ETH price and market data
    const ethResponse = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_market_cap=true&include_24hr_change=true',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: {
          revalidate: 300, // Cache for 5 minutes
        },
      }
    );

    if (!ethResponse.ok) {
      if (ethResponse.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      throw new Error(`Failed to fetch ETH price data: ${ethResponse.status} ${ethResponse.statusText}`);
    }

    const ethData = await ethResponse.json();

    // Validate ETH data structure
    if (!ethData?.ethereum?.usd || !ethData?.ethereum?.usd_market_cap) {
      throw new Error('Invalid ETH data structure received from API');
    }

    // Fetch ETH network data
    const networkResponse = await fetch(
      'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1&interval=daily',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: {
          revalidate: 300, // Cache for 5 minutes
        },
      }
    );

    if (!networkResponse.ok) {
      if (networkResponse.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      throw new Error(`Failed to fetch network data: ${networkResponse.status} ${networkResponse.statusText}`);
    }

    const networkData = await networkResponse.json();

    // Fetch DeFi TVL data
    const defiResponse = await fetch(
      'https://api.coingecko.com/api/v3/coins/ethereum/tickers?include_exchange_logo=true&depth=true&sparkline=false',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: {
          revalidate: 300, // Cache for 5 minutes
        },
      }
    );

    if (!defiResponse.ok) {
      if (defiResponse.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      throw new Error(`Failed to fetch DeFi data: ${defiResponse.status} ${defiResponse.statusText}`);
    }

    const defiData = await defiResponse.json();

    // Calculate network congestion based on gas price
    const gasPrice = networkData.gas_prices?.[networkData.gas_prices.length - 1]?.[1] || 0;
    const networkCongestion = gasPrice < 30 ? 'low' : gasPrice < 100 ? 'medium' : 'high';

    const metrics = {
      price: ethData.ethereum.usd,
      marketCap: ethData.ethereum.usd_market_cap,
      activeAddresses: networkData.active_addresses?.[networkData.active_addresses.length - 1]?.[1] || 0,
      tvl: defiData.tickers?.[0]?.converted_volume?.['usd'] || 0,
      gasPrice: gasPrice,
      networkCongestion,
      priceChange24h: ethData.ethereum.usd_24h_change
    };

    return NextResponse.json({ data: metrics });
  } catch (error) {
    console.error('Error fetching Ethereum metrics:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Ethereum metrics';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 