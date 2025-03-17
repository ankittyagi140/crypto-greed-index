'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  ytdChange: number;
  high52Week: number;
  low52Week: number;
}

export default function USMarketOverview() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const router = useRouter();

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const getRouteForSymbol = (symbol: string): string => {
    const routes: { [key: string]: string } = {
      '^DJI': '/us-markets/dow-jones',
      '^IXIC': '/us-markets/nasdaq',
      '^GSPC': '/us-markets/sp500',
      'DX-Y.NYB': '/us-markets/dollar-index',
      '^RUT': '/us-markets/russell2000'
    };
    return routes[symbol] || '/us-markets';
  };

  const fetchIndices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/market-indices');
      const result = await response.json();
      
      if (result.success && result.data) {
        setIndices(result.data.indices);
        setLastUpdated(result.data.lastUpdated);
      } else {
        console.error('Invalid market indices data:', result);
      }
    } catch (error) {
      console.error('Error fetching market indices:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const IndexCard = ({ index }: { index: MarketIndex }) => (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:translate-y-[-2px]"
      onClick={() => router.push(getRouteForSymbol(index.symbol))}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{index.name}</h3>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {index.price.toFixed(2)}
          </div>
          <div className={`text-sm font-medium ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">YTD:</span>{' '}
            <span className={index.ytdChange >= 0 ? 'text-green-600' : 'text-red-600'}>
              {index.ytdChange >= 0 ? '+' : ''}{index.ytdChange.toFixed(2)}%
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">52W High:</span> {index.high52Week.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">52W Low:</span> {index.low52Week.toFixed(2)}
          </div>
          {index.volume > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">Volume:</span> {(index.volume / 1e6).toFixed(2)}M
            </div>
          )}
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const intervalId = setInterval(fetchIndices, 60000);
    fetchIndices();
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchIndices]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">US Markets Overview</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Real-time performance of major US market indices and Dollar Index
        </p>
        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastUpdated}
          </p>
        )}
      </div>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {indices.map((index) => (
            <IndexCard key={index.symbol} index={index} />
          ))}
        </div>
      )}
    </div>
  );
} 