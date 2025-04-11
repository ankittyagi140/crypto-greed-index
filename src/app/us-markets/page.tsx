'use client';

import { useEffect, useState, Suspense } from 'react';
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

// Dynamically import components with loading fallbacks
const MarketMovers = dynamic(() => import('@/components/MarketMovers'), {
  loading: () => <MarketMoversSkeletonLoader />
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
      'DX-Y.NYB': 'dollar-index',
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
        US Markets
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                7D Chart
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                LTP
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Change
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Chg%
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                High
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Low
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Open
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Prev. Close
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                52 W High
              </th>
              <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                52 W Low
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
                    {index.high52Week.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {index.low52Week.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
        Last updated: {lastUpdated}
      </p>
    </section>
  );
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
    <>
      <main className="min-h-screen py-12 bg-white">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-8xl">
          <header className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
              US Markets Live
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
              Real-time performance of major US stock indices
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2" aria-live="polite">
              Data updates every 5 minutes
            </p>
          </header>

          <nav aria-label="Market sections" className="mb-8">
            <ul className="flex flex-wrap justify-center gap-4">
              <li>
                <a href="#market-overview" className="text-sm font-medium text-blue-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                  Market Overview
                </a>
              </li>
              <li>
                <a href="#top-companies" className="text-sm font-medium text-blue-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                  Top Companies
                </a>
              </li>
              <li>
                <a href="#market-movers" className="text-sm font-medium text-blue-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                  Market Movers
                </a>
              </li>
            </ul>
          </nav>

          <div className="space-y-4 sm:space-y-8">
            <section id="market-overview" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6" aria-labelledby="market-overview-title">
           
              <Suspense fallback={<USMarketsTableSkeleton />}>
                <USMarketsTable />
              </Suspense>
            </section>

            <section id="top-companies" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6" aria-labelledby="top-companies-title">
              <h2 id="top-companies-title" className="text-xl font-bold text-gray-800 dark:text-white mb-4">Top Companies by Market Cap</h2>
              <Suspense fallback={<TopCompaniesByMarketCapSkeletonLoader />}>
                <TopCompaniesByMarketCap />
              </Suspense>
            </section>

            <section id="market-movers" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6" aria-labelledby="market-movers-title">
              <h2 id="market-movers-title" className="text-xl font-bold text-gray-800 dark:text-white mb-4">Market Movers</h2>
              <Suspense fallback={<MarketMoversSkeletonLoader />}>
                <MarketMovers index="sp500" />
              </Suspense>
            </section>
          </div>
        </div>
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Data is updated every 5 minutes. Market hours are in UTC.</p>
          <p className="mt-2">
            <Link
              href="/about"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              aria-label="Learn more about our data sources"
            >
              Learn more about our data sources
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
