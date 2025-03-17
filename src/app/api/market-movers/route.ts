import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

const STOCKS_BY_INDEX = {
  dow: [
    'AAPL', 'MSFT', 'JPM', 'GS', 'V', 'CRM', 'HD', 'INTC', 'IBM', 'WMT',
    'NKE', 'MCD', 'DIS', 'BA', 'CAT', 'AXP', 'VZ', 'CSCO', 'KO', 'MRK',
    'MMM', 'PG', 'TRV', 'UNH', 'HON', 'DOW', 'CVX', 'AMGN', 'JNJ', 'WBA'
  ],
  nasdaq: [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'ADBE', 'NFLX', 'PYPL',
    'INTC', 'CSCO', 'CMCSA', 'PEP', 'COST', 'AVGO', 'TXN', 'QCOM', 'TMUS', 'AMAT'
  ],
  sp500: [
    'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'NVDA', 'BRK-B', 'JPM', 'V', 'JNJ',
    'PG', 'XOM', 'HD', 'CVX', 'MA', 'BAC', 'UNH', 'ABBV', 'PFE', 'DIS'
  ]
};

export async function GET(request: Request) {
  try {
    // Get the selected index from query params
    const { searchParams } = new URL(request.url);
    const selectedIndex = searchParams.get('index') || 'dow';
    
    // Get the stocks for the selected index
    const stocks = STOCKS_BY_INDEX[selectedIndex as keyof typeof STOCKS_BY_INDEX] || STOCKS_BY_INDEX.dow;
    
    const data = await yahooFinance.quote(stocks);

    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid response format from Yahoo Finance');
    }

    const marketMovers: MarketMover[] = data.map((quote) => ({
      symbol: quote.symbol || '',
      name: quote.shortName || quote.longName || quote.symbol || '',
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume || 0
    })).filter(stock => 
      stock.price > 0 && stock.symbol && stock.name
    );

    // Sort by change percent for gainers and losers
    const sortedByChange = [...marketMovers].sort((a, b) => b.changePercent - a.changePercent);
    const gainers = sortedByChange.slice(0, 5); // Top 5 gainers
    const losers = sortedByChange.reverse().slice(0, 5); // Top 5 losers

    return NextResponse.json({
      success: true,
      data: {
        gainers,
        losers,
        asOf: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        })
      }
    });

  } catch (error) {
    console.error('Error fetching market movers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market movers data' },
      { status: 500 }
    );
  }
} 