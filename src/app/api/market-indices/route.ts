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
  openPrice: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  historicalData: { date: string; value: number; }[];
  regularMarketTime?: Date;
}

interface YahooHistoricalPrice {
  date: Date;
  close: number;
}

const INDICES = {
  '^DJI': 'Dow Jones Industrial Average',
  '^IXIC': 'NASDAQ Composite',
  '^GSPC': 'S&P 500',
  '^RUT': 'Russell 2000'
};

export async function GET() {
  try {
    const symbols = Object.keys(INDICES);
    const [quotes, historical] = await Promise.all([
      yahooFinance.quote(symbols),
      Promise.all(
        symbols.map(symbol =>
          yahooFinance.historical(symbol, {
            period1: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Last 5 days
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
      // Get historical data for the chart
      const chartData = (historical[index] as YahooHistoricalPrice[])
        .map(item => ({
          date: item.date.toISOString(),
          value: item.close
        }));

      // Calculate YTD change using the current price and first historical price
      const yearStartData = historical[index][0] as YahooHistoricalPrice;
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
        low52Week: quote.fiftyTwoWeekLow || 0,
        openPrice: quote.regularMarketOpen || currentPrice,
        previousClose: quote.regularMarketPreviousClose || currentPrice,
        dayHigh: quote.regularMarketDayHigh || currentPrice,
        dayLow: quote.regularMarketDayLow || currentPrice,
        historicalData: chartData,
        regularMarketTime: quote.regularMarketTime ? new Date(Number(quote.regularMarketTime) * 1000) : undefined
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