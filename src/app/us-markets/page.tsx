'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  ClockIcon 
} from '@heroicons/react/24/solid';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { isMarketOpen, getRefreshInterval } from '../../utils/marketHours';

// Dynamically import components with loading fallbacks
const MarketMovers = dynamic(() => import('../../components/MarketMovers'), {
  loading: () => <MarketMoversSkeletonLoader />
});

const TopCompaniesByMarketCap = dynamic(() => import('../../components/TopCompaniesByMarketCap'), {
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

function USMarketsTableSkeleton() {
  return (
    <div className="min-h-[200px]">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
      <div className="bg-gray-200 dark:bg-gray-700 rounded h-60"></div>
    </div>
  );
}

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
  yearLowPrice: number;
  yearHighPrice: number;
  openPrice: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  historicalData?: { date: string; value: number; }[];
  regularMarketTime?: Date;
  weekChange?: number;
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

// Country flag codes for US markets

function USMarketsTable() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchIndices();
    const interval = setInterval(fetchIndices, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchIndices = async () => {
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
  };

  // Format date safely
  const formatTime = (dateVal: string | Date | number | null | undefined) => {
    try {
      if (!dateVal) return "";
      const date = new Date(dateVal);
      // Check if date is valid
      if (isNaN(date.getTime())) return "";
      
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "";
    }
  };

  const isMarketOpen = (index: MarketIndex): boolean => {
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

      // Only consider regular market hours for "open" status
      if (currentTime >= marketOpen && currentTime < marketClose) {
        // Check if market data is recent (last 15 minutes)
        if (index.regularMarketTime) {
          const marketUpdateTime = new Date(index.regularMarketTime);
          const updateTimeDiff = now.getTime() - marketUpdateTime.getTime();
          return updateTimeDiff <= 15 * 60 * 1000; // 15 minutes in milliseconds
        }
      }
    }
    return false;
  };

  const getMarketStatus = (): string => {
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
        return 'Regular Hours';
      } else if (currentTime >= preMarketOpen && currentTime < marketOpen) {
        return 'Pre-Market';
      } else if (currentTime >= marketClose && currentTime < afterHoursClose) {
        return 'After Hours';
      }
    }
    return 'Closed';
  };

  // Function to navigate to detail page
  const handleRowClick = (symbol: string) => {
    const symbolMap: Record<string, string> = {
      '^DJI': 'dow-jones',
      '^GSPC': 'sp500',
      '^IXIC': 'nasdaq',
      '^RUT': 'russell2000',
    };

    const route = symbolMap[symbol] || symbol.toLowerCase().replace(/[^\w-]+/g, '-');
    router.push(`/us-markets/${route}`);
  };

  if (loading) {
    return <USMarketsTableSkeleton />;
  }

  return (
    <section className="mb-10 sm:mb-14">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
        S&P 500 and Major US Market Indices
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" aria-label="S&P 500 and Major US Market Indices">
          <caption className="sr-only">S&P 500, Dow Jones, NASDAQ, and Russell 2000 real-time market data</caption>
          <thead>
            <tr>
              <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Index Name
              </th>
              <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                7D Chart
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Change
              </th>
                                <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                % Change
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Day High
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Day Low
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Open
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Prev. Close
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                52 Week High
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                52 Week Low
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {indices.map((index) => {
              const isOpen = isMarketOpen(index);
              const isPositive = index.change >= 0;
              const statusClass = isOpen ? "text-green-500" : "text-red-500";
              const flagCode = 'us'; // All US markets

              return (
                <tr 
                  key={index.symbol} 
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => handleRowClick(index.symbol)}
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="mr-2" title={getMarketStatus()}>
                        <ClockIcon className={`h-4 w-4 ${statusClass}`} />
                      </div>
                      <div className="mr-2">
                        <Image 
                          src={`https://flagcdn.com/16x12/${flagCode}.png`} 
                          width={16} 
                          height={12} 
                          alt="US flag"
                          className="inline-block"
                          unoptimized
                        />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 dark:text-white">{index.name}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTime(index.regularMarketTime)} {index.symbol.replace('^', '')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div style={{ width: 100, height: 30 }}>
                      {index.historicalData && index.historicalData.length > 0 ? (
                        <Sparklines data={index.historicalData.map(item => item.value)} width={100} height={30}>
                          <SparklinesLine color={isPositive ? "#22c55e" : "#ef4444"} />
                        </Sparklines>
                      ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-right">
                    {index.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4">
                    <div className={`flex items-center justify-end whitespace-nowrap ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {isPositive ? (
                        <ArrowUpIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      )}
                      <span className="font-medium">
                        {isPositive ? '+' : ''}{index.change.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`text-right ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {index.dayHigh ? index.dayHigh.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {index.dayLow ? index.dayLow.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {index.openPrice ? index.openPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }) : index.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {index.previousClose ? index.previousClose.toLocaleString(undefined, { minimumFractionDigits: 2 }) : index.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {index.high52Week.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {index.low52Week.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
        <span>Last updated: </span>{lastUpdated}
      </p>
    </section>
  );
}

export default function USMarkets() {
  const [lastUpdateTime, setLastUpdateTime] = useState<number | null>(null);
  
  const fetchData = useCallback(async () => {
    // Only fetch if market is open or we haven't fetched yet
    if (!isMarketOpen() && lastUpdateTime) {
      return;
    }
    
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

      setLastUpdateTime(Date.now());
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
  // Removed the dependency on lastUpdateTime that was causing infinite loop
  }, [lastUpdateTime]);

  useEffect(() => {
    // Initial data fetch
    fetchData();
    
    // Set up interval for updates - only if market is open
    const intervalId = setInterval(() => {
      if (isMarketOpen()) {
        fetchData();
      }
    }, getRefreshInterval());
    
    return () => clearInterval(intervalId);
  // Using fetchData dependency to ensure the effect runs when fetchData changes
  }, [fetchData]);

  return (
    <>
      {/* Market Stats Banner */}
      <div className="w-full bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 border-b border-blue-700 dark:border-gray-700 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg border border-white/20">
              <ClockIcon className="h-5 w-5 text-blue-200" />
              <span className="text-blue-100 font-semibold">US Markets Live</span>
              <span className="text-blue-200 text-sm">•</span>
              <span className="text-blue-200 text-sm">Data updates every 5 minutes</span>
            </div>
          </div>
        </div>
      </div>

      <main className="min-h-screen py-8 sm:py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 sm:py-12 max-w-8xl">
          {/* Header Section */}
          <div className="text-center py-12 sm:py-16 lg:py-20 mb-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
            
            <div className="relative z-10 max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full mb-8 shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">Live Market Data</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-6 sm:mb-8 tracking-tight">
                S&P 500 Live & US Markets Today
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 font-medium">
                Real-time performance of S&P 500, Dow Jones, NASDAQ and major US stock indices
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Real-time Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">S&P 500 Index</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">Market Movers</span>
                </div>
              </div>
            </div>
          </div>

          <nav aria-label="Market sections" className="mb-8 sm:mb-12 px-2 sm:px-0">
            <div className="flex flex-wrap justify-center gap-2">
              <a
                href="#market-overview"
                className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 rounded-xl shadow-lg border border-blue-100 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-all duration-200"
              >
                S&P 500 & Index Overview
              </a>
              <a
                href="#top-companies"
                className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 rounded-xl shadow-lg border border-blue-100 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-all duration-200"
              >
                Top S&P 500 Companies
              </a>
              <a
                href="#market-movers"
                className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 rounded-xl shadow-lg border border-blue-100 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-all duration-200"
              >
                S&P 500 Market Movers
              </a>
            </div>
          </nav>

          <div className="space-y-8 sm:space-y-12">
            <section id="market-overview" className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-3xl shadow-2xl border border-blue-100 dark:border-blue-800/30 p-8 sm:p-10 relative overflow-hidden" aria-labelledby="market-overview-title">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 dark:from-blue-800/10 dark:to-indigo-800/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-100/30 to-pink-100/30 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full -ml-32 -mb-32"></div>
              
              <div className="relative z-10">
                <header className="mb-6">
                  <h2 id="market-overview-title" className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">S&P 500 Index & US Markets Overview</h2>
                </header>
                <Suspense fallback={<USMarketsTableSkeleton />}>
                  <USMarketsTable />
                </Suspense>
              </div>
            </section>

            <section id="top-companies" className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-3xl shadow-2xl border border-blue-100 dark:border-blue-800/30 p-8 sm:p-10 relative overflow-hidden" aria-labelledby="top-companies-title">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 dark:from-blue-800/10 dark:to-indigo-800/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-100/30 to-pink-100/30 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full -ml-32 -mb-32"></div>
              
              <div className="relative z-10">
                <h2 id="top-companies-title" className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-6">Top S&P 500 Companies by Market Cap</h2>
                <Suspense fallback={<TopCompaniesByMarketCapSkeletonLoader />}>
                  <TopCompaniesByMarketCap />
                </Suspense>
              </div>
            </section>

            <section id="market-movers" className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-3xl shadow-2xl border border-blue-100 dark:border-blue-800/30 p-8 sm:p-10 relative overflow-hidden" aria-labelledby="market-movers-title">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 dark:from-blue-800/10 dark:to-indigo-800/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-100/30 to-pink-100/30 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full -ml-32 -mb-32"></div>
              
              <div className="relative z-10">
                <h2 id="market-movers-title" className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-6">S&P 500 Market Movers Today</h2>
                <Suspense fallback={<MarketMoversSkeletonLoader />}>
                  <MarketMovers index="sp500" />
                </Suspense>
              </div>
            </section>
          </div>
        </div>
        <footer className="mt-12 sm:mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 shadow-lg border border-blue-100 dark:border-blue-800/30">
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-4">S&P 500 and market data is updated every 5 minutes. Market hours are in EST/EDT.</p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Learn more about our S&P 500 and market data sources"
            >
              Learn more about our data sources
              <span>→</span>
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}
