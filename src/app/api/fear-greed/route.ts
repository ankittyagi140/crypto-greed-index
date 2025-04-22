import { NextResponse } from 'next/server';

interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: number;
}

interface FearGreedResponse {
  data: FearGreedData[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '1');

    const response = await fetch(
      `https://api.alternative.me/fng/?limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Fear & Greed Index data');
    }

    const data: FearGreedResponse = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid data format received from API');
    }

    return NextResponse.json({ data: data.data });
  } catch (error) {
    console.error('Error fetching Fear & Greed Index:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Fear & Greed Index data' },
      { status: 500 }
    );
  }
} 