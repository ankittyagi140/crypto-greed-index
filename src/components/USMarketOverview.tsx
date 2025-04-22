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
  weekChange?: number;
}

interface IndexCardProps {
  index: MarketIndex;
  isMarketOpen: boolean;
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

  const useMarketStatus = () => {
    const [isMarketOpen, setIsMarketOpen] = useState(false);

    const checkMarketStatus = useCallback(() => {
      const now = new Date();
      const nyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const day = nyTime.getDay();
      const hours = nyTime.getHours();
      const minutes = nyTime.getMinutes();
      const currentTime = hours * 60 + minutes;

      // Check if it's a weekday (Monday = 1, Friday = 5)
      if (day >= 1 && day <= 5) {
        // Regular market hours: 9:30 AM - 4:00 PM ET
        const marketOpen = 9 * 60 + 30; // 9:30 AM
        const marketClose = 16 * 60; // 4:00 PM

        // Pre-market: 4:00 AM - 9:30 AM ET
        const preMarketOpen = 4 * 60; // 4:00 AM

        // After-hours: 4:00 PM - 8:00 PM ET
        const afterHoursClose = 20 * 60; // 8:00 PM

        if (currentTime >= marketOpen && currentTime < marketClose) {
          return { isOpen: true, status: 'Regular Hours' };
        } else if (currentTime >= preMarketOpen && currentTime < marketOpen) {
          return { isOpen: true, status: 'Pre-Market' };
        } else if (currentTime >= marketClose && currentTime < afterHoursClose) {
          return { isOpen: true, status: 'After Hours' };
        }
      }

      return { isOpen: false, status: 'Closed' };
    }, []);

    useEffect(() => {
      const updateMarketStatus = () => {
        const status = checkMarketStatus();
        setIsMarketOpen(status.isOpen);
      };

      // Initial check
      updateMarketStatus();

      // Update every minute
      const interval = setInterval(updateMarketStatus, 60000);

      return () => clearInterval(interval);
    }, [checkMarketStatus]);

    return { isMarketOpen, checkMarketStatus };
  };

  const IndexCard = ({ index, isMarketOpen }: IndexCardProps) => {
    const { checkMarketStatus } = useMarketStatus();
    const { status } = checkMarketStatus();
    const isPositive = index.change >= 0;

    // Calculate week change if not provided
    const weekChangeValue = index.weekChange ?? (() => {
      if (index.historicalData && index.historicalData.length >= 2) {
        const latest = index.historicalData[index.historicalData.length - 1].value;
        const oldest = index.historicalData[0].value;
        return ((latest - oldest) / oldest) * 100;
      }
      return null;
    })();

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Regular Hours':
          return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        case 'Pre-Market':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        case 'After Hours':
          return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
        default:
          return 'bg-gray-900/10 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400';
      }
    };

    return (
      <article
        onClick={() => router.push(getRouteForSymbol(index.symbol))}
        aria-label={`${index.name} Market Index`}
        className={`
          relative overflow-hidden rounded-xl shadow-lg 
          hover:shadow-xl transition-all duration-300 cursor-pointer transform 
          hover:scale-[1.02]
          ${isPositive
            ? 'bg-gradient-to-br from-green-50/50 to-white dark:from-green-900/20 dark:to-gray-800'
            : 'bg-gradient-to-br from-red-50/50 to-white dark:from-red-900/20 dark:to-gray-800'
          }
          ${!isMarketOpen ? 'opacity-90' : ''}
        `}
      >
        <div className="relative p-6">
          {/* Move status badge to top-right corner */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>

          {/* Header without status badge */}
          <div className="mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight pr-24">
              {index.name}
            </h3>
          </div>

          {/* Price and Change */}
          <div className="flex items-baseline gap-3 mb-2">
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight tabular-nums">
              {index.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
            <div className={`
              flex items-center
              ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}
            `}>
              {isPositive ? (
                <ArrowUpIcon className="h-5 w-5 mr-1" />
              ) : (
                <ArrowDownIcon className="h-5 w-5 mr-1" />
              )}
              <span className="text-sm font-bold tabular-nums">
                {isPositive ? '+' : ''}{index.change.toFixed(2)} ({Math.abs(index.changePercent).toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Time */}
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">
            As of {new Date(index.regularMarketTime || '').toLocaleTimeString()}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                YTD
              </p>
              <p className={`
                text-sm font-bold tabular-nums
                ${index.ytdChange >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
                }
              `}>
                {index.ytdChange >= 0 ? '+' : ''}{index.ytdChange.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Volume
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                {(index.volume / 1000000).toFixed(1)}M
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                52W Range
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                {Math.round(((index.high52Week - index.low52Week) / index.low52Week) * 100)}%
              </p>
            </div>
          </div>

          {/* Chart - Moved slightly down */}
          <div className="absolute top-12 right-4 w-28 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={index.historicalData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? '#22c55e' : '#ef4444'}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
            {weekChangeValue !== null && (
              <div className="absolute -bottom-4 right-0 text-xs font-medium">
                <span className="text-gray-500 dark:text-gray-400">7D:</span>{' '}
                <span className={
                  weekChangeValue >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }>
                  {weekChangeValue >= 0 ? '+' : ''}
                  {weekChangeValue.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
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
          {indices.map((index) => {
            const now = new Date();
            const marketClosed = !index.regularMarketTime ||
              (now.getTime() - new Date(index.regularMarketTime).getTime()) > 15 * 60 * 1000;
            return (
              <IndexCard key={index.symbol} index={index} isMarketOpen={!marketClosed} />
            );
          })}
        </div>
      )}
    </div>
  );
} 