'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface AltcoinMetricsProps {
  isDetailPage?: boolean;
}

interface NetworkMetrics {
  totalMarketCap: number;
  volume24h: number;
  numberOfCoins: number;
  topGainers: number;
  topLosers: number;
  marketSentiment: 'bearish' | 'neutral' | 'bullish';
  priceChange24h: number;
}

const formatNumber = (num: number | undefined): string => {
  if (num === undefined) return '$0.00';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

const getSentimentColor = (sentiment: string): string => {
  switch (sentiment) {
    case 'bullish':
      return 'bg-green-500';
    case 'neutral':
      return 'bg-yellow-500';
    case 'bearish':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const MetricCard = ({ title, value, change, isPositive }: { 
  title: string; 
  value: string; 
  change?: string;
  isPositive?: boolean;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
    <div className="text-xl font-semibold text-gray-900 dark:text-white">{value}</div>
    {change && (
      <div className={`text-sm mt-1 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {isPositive ? '▲' : '▼'} {change}
      </div>
    )}
  </div>
);

export default function AltcoinMetrics({ isDetailPage = false }: AltcoinMetricsProps) {
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMetrics = async () => {
      const loadingToast = toast.loading('Fetching altcoin metrics...', {
        position: 'top-right',
      });
      try {
        const response = await fetch('/api/altcoin-metrics');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch altcoin metrics');
        }

        setMetrics(result.data);
        toast.success('Metrics updated successfully', { 
          id: loadingToast,
          duration: 3000,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load altcoin metrics';
        toast.error(errorMessage, { 
          id: loadingToast,
          duration: 4000,
        });
        console.error('Error fetching altcoin metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchMetrics();

    // Set up interval for periodic updates
    const interval = setInterval(fetchMetrics, 60000); // Update every minute

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (!isDetailPage) {
      router.push('/altcoin-metrics');
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-12">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-12 ${
        !isDetailPage ? 'cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-xl' : ''
      }`}
      onClick={handleClick}
    >
      <div className="mb-6 flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Altcoin Market Metrics
          {!isDetailPage && (
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              (Click for detailed analysis)
            </span>
          )}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Real-time metrics and statistics for the altcoin market
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <MetricCard
          title="Total Market Cap"
          value={formatNumber(metrics?.totalMarketCap)}
          change={metrics?.priceChange24h ? `${metrics.priceChange24h.toFixed(2)}%` : undefined}
          isPositive={metrics?.priceChange24h ? metrics.priceChange24h >= 0 : undefined}
        />
        <MetricCard
          title="24h Volume"
          value={formatNumber(metrics?.volume24h)}
        />
        <MetricCard
          title="Number of Coins"
          value={metrics?.numberOfCoins.toString() || '0'}
        />
        <MetricCard
          title="Top Gainers (24h)"
          value={metrics?.topGainers.toString() || '0'}
        />
        <MetricCard
          title="Top Losers (24h)"
          value={metrics?.topLosers.toString() || '0'}
        />
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Sentiment</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getSentimentColor(metrics?.marketSentiment || 'neutral')}`}></div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
              {metrics?.marketSentiment || 'neutral'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 