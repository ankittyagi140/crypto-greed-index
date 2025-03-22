'use client';

import { useState, useEffect } from 'react';

import { toast } from 'react-hot-toast';
import MarketMovers from '@/components/MarketMovers';
import USMarketOverview from '@/components/USMarketOverview';
import TopCompaniesByMarketCap from '@/components/TopCompaniesByMarketCap';

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
  const [loading, setLoading] = useState(true);
 

  const fetchData = async () => {
    const loadingToast = toast.loading('Fetching US markets data...', {
      position: 'top-right',
    });
    try {
      setLoading(true);
      const [marketData, moversData] = await Promise.all([
        fetch('/api/us-markets').then(res => res.json()),
        fetch('/api/market-movers').then(res => res.json())
      ]);

      if (marketData.error || moversData.error) {
        throw new Error(marketData.error || moversData.error);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load US markets data';
      console.error('Error fetching data:', error);
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <main className="container mx-auto px-4 py-4 sm:py-8" aria-busy="true">
          <div className="animate-pulse space-y-4 sm:space-y-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full sm:w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 sm:h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
      <div className="space-y-4 sm:space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <USMarketOverview />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <TopCompaniesByMarketCap />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <MarketMovers index="sp500" />
        </div>
      </div>
    </div>
  );
}
