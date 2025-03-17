import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

const DEFAULT_INDICES = {
  '^GSPC': 'sp500',  // S&P 500
  '^IXIC': 'nasdaq', // NASDAQ
  '^DJI': 'dowJones', // Dow Jones
  '^RUT': 'russell2000', // Russell 2000
  'DX-Y.NYB': 'dollarIndex' // US Dollar Index
};

interface MarketDataAccumulator {
  [key: string]: {
    historicalData: Array<{ date: string; value: number }>;
    currentStats: {
      price: number;
      change: number;
      changePercent: number;
      yearToDateChange: number;
      yearToDatePercent: number;
      high52Week: number;
      low52Week: number;
      volume: number;
    };
  };
}

async function fetchIndexData(symbol: string) {
  try {
    const [quote, historical] = await Promise.all([
      yahooFinance.quote(symbol),
      yahooFinance.historical(symbol, {
        period1: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        period2: new Date(),
        interval: '1d'
      })
    ]);

    if (!quote || !historical) {
      throw new Error(`Failed to fetch data for ${symbol}`);
    }

    // Get year start date for YTD calculations
    const yearStartDate = new Date(new Date().getFullYear(), 0, 1);
    const yearStartData = historical.find(data => 
      new Date(data.date).getTime() >= yearStartDate.getTime()
    );

    const regularMarketPrice = quote.regularMarketPrice || 0;
    const yearStartClose = yearStartData?.close || regularMarketPrice;

    // Calculate YTD change
    const yearToDateChange = regularMarketPrice - yearStartClose;
    const yearToDatePercent = (yearToDateChange / yearStartClose) * 100;

    // Format historical data
    const formattedHistorical = historical.map(item => ({
      date: item.date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      value: item.close
    }));

    return {
      historicalData: formattedHistorical,
      currentStats: {
        price: regularMarketPrice,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        yearToDateChange,
        yearToDatePercent,
        high52Week: quote.fiftyTwoWeekHigh || regularMarketPrice,
        low52Week: quote.fiftyTwoWeekLow || regularMarketPrice,
        volume: quote.regularMarketVolume || 0
      }
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    // If symbol is provided, return data for that specific index
    if (symbol) {
      const data = await fetchIndexData(symbol);
      if (!data) {
        throw new Error(`Failed to fetch data for ${symbol}`);
      }

      return NextResponse.json({
        success: true,
        data
      });
    }

    // If no symbol is provided, fetch data for all indices
    const results = await Promise.all(
      Object.entries(DEFAULT_INDICES).map(async ([symbol, key]) => {
        const data = await fetchIndexData(symbol);
        return { symbol, key, data };
      })
    );

    // Filter out any failed requests and format the response
    const marketData = results.reduce((acc, { key, data }) => {
      if (data) {
        acc[key] = data;
      }
      return acc;
    }, {} as MarketDataAccumulator);

    return NextResponse.json({
      success: true,
      data: marketData
    });

  } catch (error) {
    console.error('Error fetching market data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
} 