import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '90';
    
    const response = await fetch(`https://api.alternative.me/fng/?limit=${limit}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Fear & Greed API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching fear & greed data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fear & greed index data' },
      { status: 500 }
    );
  }
} 