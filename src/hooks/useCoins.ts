import { useState, useEffect } from 'react';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  price_change_percentage_1h?: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  sparkline_data?: number[];
}

interface UseCoinsReturn {
  coins: Coin[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  hasMore: boolean;
}

export function useCoins(perPage: number = 100): UseCoinsReturn {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchCoins() {
      try {
        console.log(`Fetching coins for page ${currentPage} with ${perPage} per page`);
        setLoading(true);
        setError(null);

        const url = `/api/coins?per_page=${perPage}&page=${currentPage}`;
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch coins: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Received ${data.length} coins`);

        if (isMounted) {
          setCoins(data);
          // If we receive fewer coins than perPage, we've reached the end
          setHasMore(data.length === perPage);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching coins:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setLoading(false);
        }
      }
    }

    fetchCoins();

    return () => {
      isMounted = false;
    };
  }, [currentPage, perPage]);

  const handleSetCurrentPage = (page: number) => {
    console.log('Setting current page to:', page);
    setCurrentPage(page);
  };

  return {
    coins,
    loading,
    error,
    currentPage,
    setCurrentPage: handleSetCurrentPage,
    hasMore
  };
} 