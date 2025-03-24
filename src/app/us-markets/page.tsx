'use client';

import { useEffect, Suspense } from 'react';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

// Dynamically import components with loading fallbacks
const MarketMovers = dynamic(() => import('@/components/MarketMovers'), {
  loading: () => <MarketMoversSkeletonLoader />
});

const USMarketOverview = dynamic(() => import('@/components/USMarketOverview'), {
  loading: () => <USMarketOverviewSkeletonLoader />
});

const TopCompaniesByMarketCap = dynamic(() => import('@/components/TopCompaniesByMarketCap'), {
  loading: () => <TopCompaniesByMarketCapSkeletonLoader />
});

// Skeleton loaders with matching dimensions
function MarketMoversSkeletonLoader() {
  return (
    <div className="min-h-[400px]">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            {[...Array(5)].map((_, j) => (
              <div key={j} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function USMarketOverviewSkeletonLoader() {
  return (
    <div className="min-h-[200px]">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  );
}

function TopCompaniesByMarketCapSkeletonLoader() {
  return (
    <div className="min-h-[300px]">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  );
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface MarketMovers {
  gainers: StockData[];
  losers: StockData[];
  mostActive: StockData[];
}

export default function USMarkets() {

  const fetchData = async () => {
    const loadingToast = toast.loading('Updating market data...', {
      position: 'top-right',
    });
    try {
   
      const [marketData, moversData] = await Promise.all([
        fetch('/api/us-markets').then(res => res.json()),
        fetch('/api/market-movers').then(res => res.json())
      ]);

      if (marketData.error || moversData.error) {
        throw new Error(marketData.error || moversData.error);
      }

      toast.success('Market data updated', {
        id: loadingToast,
        duration: 2000,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load US markets data';
      console.error('Error fetching data:', error);
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-8xl">
      <div className="space-y-4 sm:space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <Suspense fallback={<USMarketOverviewSkeletonLoader />}>
            <USMarketOverview />
          </Suspense>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <Suspense fallback={<TopCompaniesByMarketCapSkeletonLoader />}>
            <TopCompaniesByMarketCap />
          </Suspense>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <Suspense fallback={<MarketMoversSkeletonLoader />}>
            <MarketMovers index="sp500" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
