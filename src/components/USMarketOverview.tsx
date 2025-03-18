'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

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
  historicalData?: { date: string; value: number; }[];
  regularMarketTime?: Date;
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

  const IndexCard = ({ index }: { index: MarketIndex }) => {
    // Get current time in UTC
    const now = new Date();
    const marketClosed = !index.regularMarketTime || 
      (now.getTime() - new Date(index.regularMarketTime).getTime()) > 15 * 60 * 1000;

    const formattedTime = index.regularMarketTime 
      ? new Date(index.regularMarketTime).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      : '';

    return (
      <article 
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
        onClick={() => router.push(getRouteForSymbol(index.symbol))}
        aria-label={`${index.name} Market Index`}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {index.name}
              </h3>
              {marketClosed && (
                <span className="px-2 py-0.5 text-xs font-medium bg-gray-900 text-white rounded">
                  CLOSED
                </span>
              )}
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {index.price.toLocaleString()}
          </p>
          <div className={`flex items-center ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {index.change >= 0 ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">
              {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
            </span>
          </div>
          {formattedTime && (
            <p className="text-xs text-gray-500 mt-1">
              As of {formattedTime}
            </p>
          )}
          <div className="flex justify-between mt-4">
            <div>
              <p className="text-xs text-gray-500">YTD</p>
              <p className={`text-sm font-medium ${index.ytdChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {index.ytdChange.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Volume</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {(index.volume / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
          {index.historicalData && index.historicalData.length > 0 && (
            <div className="absolute top-4 right-4 w-24 h-12 opacity-25">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={index.historicalData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={index.change >= 0 ? '#22c55e' : '#ef4444'}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </article>
    );
  };

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