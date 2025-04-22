import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch data from Alternative.me API for different time periods
    const response = await fetch('https://api.alternative.me/fng/?limit=30');
    
    if (!response.ok) {
      throw new Error('Failed to fetch historical fear and greed data');
    }

    const data = await response.json();
    const historicalData = data.data;

    // Get data points for different time periods
    const now = historicalData[0];
    const yesterday = historicalData[1] || now;
    const lastWeek = historicalData[7] || yesterday;
    const lastMonth = historicalData[29] || lastWeek;

    return NextResponse.json({
      now: {
        value: now.value,
        value_classification: now.value_classification,
        timestamp: parseInt(now.timestamp)
      },
      yesterday: {
        value: yesterday.value,
        value_classification: yesterday.value_classification,
        timestamp: parseInt(yesterday.timestamp)
      },
      lastWeek: {
        value: lastWeek.value,
        value_classification: lastWeek.value_classification,
        timestamp: parseInt(lastWeek.timestamp)
      },
      lastMonth: {
        value: lastMonth.value,
        value_classification: lastMonth.value_classification,
        timestamp: parseInt(lastMonth.timestamp)
      }
    });
  } catch (error) {
    console.error('Error fetching historical fear and greed data:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch historical fear and greed data' 
    }, { status: 500 });
  }
} 