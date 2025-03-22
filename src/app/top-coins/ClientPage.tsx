'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatLargeNumber } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import Script from 'next/script';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import ResponsivePagination from '@/components/ResponsivePagination';
import { useRouter } from 'next/navigation';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
  total_volume: number;
  circulating_supply: number;
  sparkline_data: number[];
  price_change_percentage_7d_formatted: string;
  price_change_percentage_30d_formatted: string;
  high_24h: number;
  ath: number;
}

export default function ClientPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 100;
  const totalPages = 10; // 100 coins total / 20 coins per page
  const router = useRouter();

  useEffect(() => {
    const fetchCoins = async () => {
      const loadingToast = toast.loading('Fetching cryptocurrency data...', {
        position: 'top-right',
      });
      try {
        const response = await fetch(`/api/coins?per_page=100&page=${currentPage}`);
        if (!response.ok) throw new Error('Failed to fetch coins');
        const data = await response.json();
        setCoins(data);
        setIsLoading(false);
        toast.success('Data updated successfully', {
          id: loadingToast,
          duration: 3000,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load cryptocurrency data';
        toast.error(errorMessage, {
          id: loadingToast,
          duration: 4000,
        });
        setIsLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 5 * 60 * 1000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [currentPage]);

  // Get current coins for the page
  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCoinClick = (coinId: string) => {
    router.push(`/coin/${coinId}`);
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Table",
    "about": "Top 100 Cryptocurrencies by Market Cap",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": coins.length,
      "itemListElement": coins.map((coin, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Cryptocurrency",
          "name": coin.name,
          "symbol": coin.symbol.toUpperCase(),
          "image": coin.image,
          "price": coin.current_price,
          "marketCap": coin.market_cap,
        }
      }))
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4" />
          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-2/3 mx-auto" />
        </div>

        {/* Market Overview Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2" />
              <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded mt-4" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2" />
              <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded mt-4" />
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  {[...Array(7)].map((_, i) => (
                    <th key={i} className="px-6 py-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {[...Array(10)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-8" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        <div className="ml-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
                          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-16" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded w-32" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-16 ml-auto" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-28 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center items-center space-x-2 py-4">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-md" />
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md" />
            ))}
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4 py-8 space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Top 100 Cryptocurrencies by Market Cap
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real-time prices and market data for the top 100 cryptocurrencies. Updated every 5 minutes to provide you with the most accurate market information.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Coin
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last 7 Days
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    24h Change
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    24h Volume
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    High 24h
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    All Time High
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Circulating Supply
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {coins?.map((coin) => (
                  <tr 
                    key={coin.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" 
                    onClick={() => handleCoinClick(coin.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {coin.market_cap_rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 relative">
                          <Image
                            src={coin.image}
                            alt={coin.name}
                            height={32}
                            width={32}
                            className="rounded-full w-auto h-auto"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {coin.name.length > 12 ? coin.symbol : coin.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                            {formatLargeNumber(coin.market_cap)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-32 h-8">
                        <Sparklines data={coin.sparkline_data} width={100} height={30} margin={5}>
                          <SparklinesLine
                            color={coin.price_change_percentage_24h >= 0 ? "#22c55e" : "#ef4444"}
                            style={{
                              strokeWidth: 1.5,
                              fill: "none",
                              filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))"
                            }}
                          />
                        </Sparklines>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                      ${coin.current_price.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${coin.price_change_percentage_24h >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                      }`}>
                      {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                      {formatLargeNumber(coin.total_volume)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white'>${coin?.high_24h?.toLocaleString()}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white'>${coin?.ath?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                      {formatLargeNumber(coin.circulating_supply)} {coin.symbol.toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-5">
          Showing {indexOfFirstCoin + 1} to {Math.min(indexOfLastCoin, coins.length)} of {coins.length} coins
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 py-4">
          <ResponsivePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          />
        </div>
      </div>
    </>
  );
} 