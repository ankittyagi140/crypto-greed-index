'use client';

import { useCoins } from '@/hooks/useCoins';
import { formatPrice } from '@/utils/format';
import Image from 'next/image';
import { useEffect } from 'react';

export default function CoinList() {
  const {
    coins,
    loading,
    error,
    currentPage,
    setCurrentPage,
    hasMore
  } = useCoins(100); // 100 coins per page

  // Add logging to track page changes
  useEffect(() => {
    console.log('Current page:', currentPage);
  }, [currentPage]);

  const handlePrevPage = () => {
    const newPage = Math.max(1, currentPage - 1);
    console.log('Navigating to previous page:', newPage);
    setCurrentPage(newPage);
  };

  const handleNextPage = () => {
    const newPage = currentPage + 1;
    console.log('Navigating to next page:', newPage);
    setCurrentPage(newPage);
  };

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Coins Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">24h %</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Market Cap</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Volume (24h)</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              // Loading skeleton
              [...Array(10)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="ml-4 h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : (
              coins.map((coin) => (
                <tr key={coin.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {coin.market_cap_rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Image src={coin.image} alt={coin.name} className="h-8 w-8" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {coin.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                          {coin.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                    {formatPrice(coin.current_price)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${
                    coin.price_change_percentage_24h > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                    {formatPrice(coin.market_cap)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                    {formatPrice(coin.total_volume)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 py-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1 || loading}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage}
        </span>
        <button
          onClick={handleNextPage}
          disabled={!hasMore || loading}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
} 