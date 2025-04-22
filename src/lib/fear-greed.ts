export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: number;
}

interface FearGreedApiResponse {
  data: {
    value: string;
    value_classification: string;
    timestamp: string;
  }[];
  metadata: {
    error: string | null;
  };
}

const API_URL = 'https://api.alternative.me/fng/';

export async function getHistoricalData(limit: number = 1): Promise<FearGreedData[]> {
  try {
    const response = await fetch(`${API_URL}?limit=${limit}`);
    const data: FearGreedApiResponse = await response.json();
    
    if (!response.ok) {
      throw new Error(data.metadata?.error || 'Failed to fetch fear and greed data');
    }

    return data.data.map((item) => ({
      value: item.value,
      value_classification: item.value_classification,
      timestamp: parseInt(item.timestamp)
    }));
  } catch (error) {
    console.error('Error fetching fear and greed data:', error);
    throw error;
  }
} 