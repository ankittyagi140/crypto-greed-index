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
  '^KOSPI': { key: 'kospi', name: 'KOSPI', region: 'Asia Pacific', country: 'South Korea' },
  '^TWII': { key: 'taiex', name: 'TAIEX', region: 'Asia Pacific', country: 'Taiwan' },
  '^STI': { key: 'sti', name: 'Straits Times Index', region: 'Asia Pacific', country: 'Singapore' },
  '^JKSE': { key: 'jakarta', name: 'Jakarta Composite', region: 'Asia Pacific', country: 'Indonesia' },
  '^SENSEX': { key: 'sensex', name: 'BSE SENSEX', region: 'Asia Pacific', country: 'India' },
  '^NSEI': { key: 'nifty50', name: 'NIFTY 50', region: 'Asia Pacific', country: 'India' },

  // Europe
  '^FTSE': { key: 'ftse100', name: 'FTSE 100', region: 'Europe', country: 'United Kingdom' },
  '^GDAXI': { key: 'dax', name: 'DAX 40', region: 'Europe', country: 'Germany' },
  '^FCHI': { key: 'cac40', name: 'CAC 40', region: 'Europe', country: 'France' },
  '^STOXX50E': { key: 'eurostoxx50', name: 'Euro Stoxx 50', region: 'Europe', country: 'Eurozone' },
  '^IBEX': { key: 'ibex35', name: 'IBEX 35', region: 'Europe', country: 'Spain' },
  '^FTMIB': { key: 'ftseItalia', name: 'FTSE MIB', region: 'Europe', country: 'Italy' },
  '^AEX': { key: 'aex', name: 'AEX', region: 'Europe', country: 'Netherlands' },
  '^SSMI': { key: 'smi', name: 'SMI', region: 'Europe', country: 'Switzerland' },
  '^OMX': { key: 'omx30', name: 'OMX 30', region: 'Europe', country: 'Sweden' },
  'IMOEX.ME': { key: 'moex', name: 'MOEX', region: 'Europe', country: 'Russia' },

  // Americas
  '^BVSP': { key: 'bovespa', name: 'Bovespa', region: 'Americas', country: 'Brazil' },
  '^MXX': { key: 'ipc', name: 'S&P/BMV IPC', region: 'Americas', country: 'Mexico' },
  '^GSPTSE': { key: 'tsx', name: 'S&P/TSX Composite', region: 'Americas', country: 'Canada' },
  '^MERV': { key: 'merval', name: 'S&P Merval', region: 'Americas', country: 'Argentina' },
  '^IPSA': { key: 'ipsa', name: 'S&P/CLX IPSA', region: 'Americas', country: 'Chile' },
  '^COLCAP': { key: 'colcap', name: 'COLCAP', region: 'Americas', country: 'Colombia' },

  // Middle East & Africa
  'TASI.SR': { key: 'tasi', name: 'Tadawul All Share', region: 'Middle East & Africa', country: 'Saudi Arabia' },
  '^TA125.TA': { key: 'ta125', name: 'TA-125', region: 'Middle East & Africa', country: 'Israel' },
  '^QSI': { key: 'qsi', name: 'Qatar General', region: 'Middle East & Africa', country: 'Qatar' },
  '^ADI': { key: 'adi', name: 'ADX General', region: 'Middle East & Africa', country: 'UAE' },
  '^DFMGI': { key: 'dfmgi', name: 'DFM General', region: 'Middle East & Africa', country: 'UAE' },
  '^EGX30': { key: 'egx30', name: 'EGX 30', region: 'Middle East & Africa', country: 'Egypt' },
  '^CASE30': { key: 'case30', name: 'EGX 30 Capped', region: 'Middle East & Africa', country: 'Egypt' },
  '^JSE': { key: 'jse', name: 'JSE Top 40', region: 'Middle East & Africa', country: 'South Africa' }
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
        volume: quote.regularMarketVolume || 0,
        regularMarketTime: quote.regularMarketTime 
          ? typeof quote.regularMarketTime === 'number' 
            ? new Date(quote.regularMarketTime * 1000)
            : new Date(quote.regularMarketTime)
          : undefined
      }
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
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
      high52Week: number;
      low52Week: number;
      volume: number;
      regularMarketTime?: Date;
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