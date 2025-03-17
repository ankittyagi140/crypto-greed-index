import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  ytdChange: number;
  high52Week: number;
  low52Week: number;
}

const INDICES = {
  '^DJI': 'Dow Jones Industrial Average',
  '^IXIC': 'NASDAQ Composite',
  '^GSPC': 'S&P 500',
  'DX-Y.NYB': 'US Dollar Index'
};

export async function GET() {
  try {
    const symbols = Object.keys(INDICES);
    const [quotes, historical] = await Promise.all([
      yahooFinance.quote(symbols),
      Promise.all(
        symbols.map(symbol =>
          yahooFinance.historical(symbol, {
            period1: new Date(new Date().getFullYear(), 0, 1), // Start of current year
            period2: new Date(),
            interval: '1d'
          })
        )
      )
    ]);

    if (!Array.isArray(quotes)) {
      throw new Error('Invalid response format from Yahoo Finance');
    }

    const indices: MarketIndex[] = quotes.map((quote, index) => {
      const yearStartData = historical[index][0];
      const currentPrice = quote.regularMarketPrice || 0;
      const yearStartPrice = yearStartData?.close || currentPrice;
      const ytdChange = ((currentPrice - yearStartPrice) / yearStartPrice) * 100;

      return {
        symbol: quote.symbol || '',
        name: INDICES[quote.symbol as keyof typeof INDICES] || quote.shortName || quote.longName || '',
        price: currentPrice,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        volume: quote.regularMarketVolume || 0,
        ytdChange,
        high52Week: quote.fiftyTwoWeekHigh || 0,
        low52Week: quote.fiftyTwoWeekLow || 0
      };
    }).filter(index => index.price > 0);

    return NextResponse.json({
      success: true,
      data: {
        indices,
        lastUpdated: new Date().toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      }
    });

  } catch (error) {
    console.error('Error fetching market indices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market indices data' },
      { status: 500 }
    );
  }
} 