import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

const SYMBOL_MAP = {
  'sp500': '^GSPC',
  'nasdaq': '^IXIC',
  'dow-jones': '^DJI',
  'russell2000': '^RUT',
  'dollar-index': 'DX-Y.NYB'
} as const;

type RouteParams = {
  symbol: keyof typeof SYMBOL_MAP;
};

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
    console.error('Error fetching index data:', error);
    throw error;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const resolvedParams = await params;
    const { symbol } = resolvedParams;
    const yahooSymbol = SYMBOL_MAP[symbol];

    if (!yahooSymbol) {
      return NextResponse.json(
        { success: false, error: 'Invalid market index symbol' },
        { status: 400 }
      );
    }

    const data = await fetchIndexData(yahooSymbol);

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        lastUpdated: new Date().toLocaleTimeString()
      }
    });
  } catch (error) {
    console.error('Error in market index API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
} 