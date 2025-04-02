import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

interface GlobalIndexInfo {
  key: string;
  name: string;
  region: string;
  country: string;
}

const GLOBAL_INDICES: Record<string, GlobalIndexInfo> = {
  // Asia Pacific
  '^N225': { key: 'nikkei225', name: 'Nikkei 225', region: 'Asia Pacific', country: 'Japan' },
  '^HSI': { key: 'hangSeng', name: 'Hang Seng', region: 'Asia Pacific', country: 'Hong Kong' },
  '000001.SS': { key: 'shanghai', name: 'Shanghai Composite', region: 'Asia Pacific', country: 'China' },
  '399001.SZ': { key: 'shenzhen', name: 'Shenzhen Component', region: 'Asia Pacific', country: 'China' },
  '^AXJO': { key: 'asx200', name: 'ASX 200', region: 'Asia Pacific', country: 'Australia' },
  '^TWII': { key: 'taiex', name: 'TAIEX', region: 'Asia Pacific', country: 'Taiwan' },
  '^STI': { key: 'sti', name: 'Straits Times Index', region: 'Asia Pacific', country: 'Singapore' },
  '^JKSE': { key: 'jakarta', name: 'Jakarta Composite', region: 'Asia Pacific', country: 'Indonesia' },
  '^NSEI': { key: 'nifty50', name: 'NIFTY 50', region: 'Asia Pacific', country: 'India' },

  // Europe
  '^FTSE': { key: 'ftse100', name: 'FTSE 100', region: 'Europe', country: 'United Kingdom' },
  '^GDAXI': { key: 'dax', name: 'DAX 40', region: 'Europe', country: 'Germany' },
  '^FCHI': { key: 'cac40', name: 'CAC 40', region: 'Europe', country: 'France' },
  '^STOXX50E': { key: 'eurostoxx50', name: 'Euro Stoxx 50', region: 'Europe', country: 'Eurozone' },
  '^IBEX': { key: 'ibex35', name: 'IBEX 35', region: 'Europe', country: 'Spain' },
  '^AEX': { key: 'aex', name: 'AEX', region: 'Europe', country: 'Netherlands' },
  '^SSMI': { key: 'smi', name: 'SMI', region: 'Europe', country: 'Switzerland' },
  '^OMX': { key: 'omx30', name: 'OMX 30', region: 'Europe', country: 'Sweden' },
  'IMOEX.ME': { key: 'moex', name: 'MOEX', region: 'Europe', country: 'Russia' },

  // Americas
  '^DJI': { key: 'dowjones', name: 'Dow Jones Industrial Average', region: 'Americas', country: 'United States' },
  '^GSPC': { key: 'sp500', name: 'S&P 500', region: 'Americas', country: 'United States' },
  '^IXIC': { key: 'nasdaq', name: 'NASDAQ Composite', region: 'Americas', country: 'United States' },
  '^RUT': { key: 'russell2000', name: 'Russell 2000', region: 'Americas', country: 'United States' },
  '^BVSP': { key: 'bovespa', name: 'Bovespa', region: 'Americas', country: 'Brazil' },
  '^MXX': { key: 'ipc', name: 'S&P/BMV IPC', region: 'Americas', country: 'Mexico' },
  '^GSPTSE': { key: 'tsx', name: 'S&P/TSX Composite', region: 'Americas', country: 'Canada' },
  '^MERV': { key: 'merval', name: 'S&P Merval', region: 'Americas', country: 'Argentina' },
  '^IPSA': { key: 'ipsa', name: 'S&P/CLX IPSA', region: 'Americas', country: 'Chile' },

  // Middle East & Africa
  '^TA125.TA': { key: 'ta125', name: 'TA-125', region: 'Middle East & Africa', country: 'Israel' },
  '^CASE30': { key: 'case30', name: 'EGX 30 Capped', region: 'Middle East & Africa', country: 'Egypt' }
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
        // Add daily range
        dailyRange: {
          low: quote.regularMarketDayLow || 0,
          high: quote.regularMarketDayHigh || 0,
          range: `${quote.regularMarketDayLow || 0} - ${quote.regularMarketDayHigh || 0}`
        },
        // Add 52-week range
        fiftyTwoWeekRange: {
          low: quote.fiftyTwoWeekLow || 0,
          high: quote.fiftyTwoWeekHigh || 0,
          range: `${quote.fiftyTwoWeekLow || 0} - ${quote.fiftyTwoWeekHigh || 0}`
        },
        // Add volume
        volume: quote.regularMarketVolume || 0,
        // Add previous close
        previousClose: quote.regularMarketPreviousClose || 0,
        // Add open price
        open: quote.regularMarketOpen || 0
      }
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw error;
  }
}

interface MarketDataAccumulator {
  [region: string]: Array<{
    key: string;
    name: string;
    country: string;
    historicalData: Array<{ date: string; value: number }>;
    currentStats: {
      price: number;
      change: number;
      changePercent: number;
      yearToDateChange: number;
      yearToDatePercent: number;
      dailyRange: {
        low: number;
        high: number;
        range: string;
      };
      fiftyTwoWeekRange: {
        low: number;
        high: number;
        range: string;
      };
      volume: number;
      previousClose: number;
      open: number;
    };
  }>;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const region = searchParams.get('region');

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

    // If region is provided, fetch data for that region only
    const symbolsToFetch = region
      ? Object.entries(GLOBAL_INDICES).filter(([, info]) => info.region === region)
      : Object.entries(GLOBAL_INDICES);
    
    // Fetch data for selected indices
    const results = await Promise.all(
      symbolsToFetch.map(async ([symbol, info]) => {
        const data = await fetchIndexData(symbol);
        return { ...info, data };
      })
    );

    // Filter out any failed requests and format the response by region
    const marketData = results.reduce((acc, { region, key, name, country, data }) => {
      if (data) {
        if (!acc[region]) {
          acc[region] = [];
        }
        acc[region].push({
          key,
          name,
          country,
          ...data
        });
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