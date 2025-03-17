import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

const TOP_COMPANIES = [
  { symbol: 'AAPL', name: 'Apple Inc' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'NVDA', name: 'Nvidia' },
  { symbol: 'AMZN', name: 'Amazon' },
  { symbol: 'WMT', name: 'Walmart' }
];

export async function GET() {
  try {
    const companiesData = await Promise.all(
      TOP_COMPANIES.map(async (company) => {
        try {
          const quote = await yahooFinance.quote(company.symbol);
          
          // Calculate how close the current price is to 52-week high/low
          const high52Week = quote.fiftyTwoWeekHigh || 0;
          const low52Week = quote.fiftyTwoWeekLow || 0;
          const currentPrice = quote.regularMarketPrice || 0;
          
          // Consider a stock "touching" 52-week high/low if within 0.5% of it
          const touchingHigh = Math.abs((currentPrice - high52Week) / high52Week) <= 0.005;
          const touchingLow = Math.abs((currentPrice - low52Week) / low52Week) <= 0.005;

          return {
            symbol: company.symbol,
            name: company.name,
            price: currentPrice,
            marketCap: quote.marketCap || 0,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            high52Week,
            low52Week,
            touchingHigh,
            touchingLow
          };
        } catch (error) {
          console.error(`Error fetching data for ${company.symbol}:`, error);
          return null;
        }
      })
    );

    // Filter out any failed requests and sort by market cap
    const validCompanies = companiesData
      .filter((company): company is NonNullable<typeof company> => company !== null)
      .sort((a, b) => b.marketCap - a.marketCap);

    return NextResponse.json({
      success: true,
      data: {
        companies: validCompanies,
        lastUpdated: new Date().toLocaleString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
          timeZoneName: 'short'
        })
      }
    });

  } catch (error) {
    console.error('Error fetching top companies data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top companies data' },
      { status: 500 }
    );
  }
} 