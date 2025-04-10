import { NextRequest, NextResponse } from 'next/server';

type Params = {
  symbol: string;
}

interface MarketBreadthData {
  advancing: number;
  declining: number;
  unchanged: number;
  total: number;
}

// Mock data for different indices - in real implementation, this would fetch from a market data API
const mockBreadthData: Record<string, MarketBreadthData> = {
  'sp': {
    advancing: 325,
    declining: 175,
    unchanged: 10,
    total: 510
  },
  'nasdaq': {
    advancing: 1876,
    declining: 1243,
    unchanged: 98,
    total: 3217
  },
  'dow': {
    advancing: 23,
    declining: 7,
    unchanged: 0,
    total: 30
  },
  'russell': {
    advancing: 1125,
    declining: 842,
    unchanged: 33,
    total: 2000
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const resolvedParams = await params;
    const symbol = resolvedParams.symbol.toLowerCase();
    
    // In a real implementation, you would fetch this data from a market data provider
    // For now, we're using mock data
    
    // Check if we have data for this symbol
    if (symbol in mockBreadthData) {
      // Generate some variation in the data to make it more realistic
      const mockData = { ...mockBreadthData[symbol] };
      
      // Add some randomness to the data to simulate changing market conditions
      // while keeping the total consistent
      const variation = Math.floor(Math.random() * 50);
      if (mockData.advancing > variation && mockData.declining > variation) {
        mockData.advancing -= variation;
        mockData.declining += variation;
      }
      
      return NextResponse.json({
        success: true,
        data: mockData
      });
    }
    
    // If no data is available for this symbol
    return NextResponse.json({
      success: false,
      error: `No market breadth data available for ${symbol}`
    }, { status: 404 });
    
  } catch (error) {
    console.error('Error fetching market breadth data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch market breadth data'
    }, { status: 500 });
  }
} 