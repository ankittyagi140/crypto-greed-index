'use client';

import { useCoins } from '../hooks/useCoins';
import Image from 'next/image';
import { useEffect } from 'react';
import PercentBadge from './PercentBadge';
import { useRouter } from 'next/navigation';

// Helper function to format large numbers
const formatLargeNumber = (num: number) => {
  if (num >= 1000000000000) {
    return `$${(num / 1000000000000).toFixed(0)}T`;
  }
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(0)}B`;
  }
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(0)}M`;
  }
  return `$${num.toFixed(0)}`;
};

export default function CoinList() {
  const router = useRouter();
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

  const navigateToCoinDetails = (coinId: string) => {
    router.push(`/coins/${coinId}`);
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
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">1h %</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">24h %</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">7d %</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Market Cap</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Volume 24h</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price Graph (7D)</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              // Loading skeleton
              [...Array(10)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-6"></div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="ml-4 h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto"></div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto"></div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto"></div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right">
                    <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : (
              coins.map((coin) => (
                <tr 
                  key={coin.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => navigateToCoinDetails(coin.id)}
                >
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {coin.market_cap_rank}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Image 
                        src={coin.image} 
                        alt={coin.name} 
                        width={24} 
                        height={24} 
                        className="rounded-full"
                      />
                      <div className="ml-2 flex">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {coin.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          • {coin.symbol.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right">
                    <PercentBadge
                      value={
                        coin.price_change_percentage_1h !== undefined
                          ? coin.price_change_percentage_1h
                          : 0
                      }
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right">
                    <PercentBadge
                      value={coin.price_change_percentage_24h}
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right">
                    <PercentBadge
                      value={coin.price_change_percentage_7d || 0}
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                    ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                    {formatLargeNumber(coin.market_cap)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                    {formatLargeNumber(coin.total_volume)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="w-32 h-10 ml-auto">
                      {coin.sparkline_data && coin.sparkline_data.length > 0 ? (
                        <svg viewBox="0 0 100 30" className="w-full h-full">
                          {/* Background gradient */}
                          <defs>
                            <linearGradient id={`gradient-${coin.id}`} x1="0" x2="0" y1="0" y2="1">
                              <stop 
                                offset="0%" 
                                stopColor={coin.price_change_percentage_7d && coin.price_change_percentage_7d >= 0 
                                  ? "rgba(34, 197, 94, 0.2)" 
                                  : "rgba(239, 68, 68, 0.2)"} 
                              />
                              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                            </linearGradient>
                          </defs>
                          
                          {/* Fill area */}
                          <path
                            d={`${generateSparkline(coin.sparkline_data, 100, 30)} L100,30 L0,30 Z`}
                            fill={`url(#gradient-${coin.id})`}
                            strokeWidth="0"
                          />
                          
                          {/* Line */}
                          <path
                            d={generateSparkline(coin.sparkline_data, 100, 30)}
                            fill="none"
                            stroke={coin.price_change_percentage_7d && coin.price_change_percentage_7d >= 0 ? "#22c55e" : "#ef4444"}
                            strokeWidth="1.5"
                          />
                        </svg>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          No data
                        </div>
                      )}
                    </div>
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
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage}
        </span>
        <button
          onClick={handleNextPage}
          disabled={!hasMore || loading}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// Function to generate sparkline SVG path
function generateSparkline(data: number[], width: number, height: number): string {
  if (!data || data.length === 0) return '';
  
  const values = data.filter(val => !isNaN(val));
  if (values.length === 0) return '';
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  // If all values are the same (like in stablecoins), add a small range to avoid division by zero
  const range = max - min || 1; 
  
  // Ensure we have a visible line even with small price changes
  const scaleFactor = height * 0.8;
  
  // Normalize and scale the values
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    
    // Use a smaller range to make the line more visible for coins with low volatility
    let y;
    if (max === min) {
      // For stablecoins or flat lines, draw a horizontal line in the middle
      y = height / 2;
    } else {
      // Scale the y value to ensure visible changes
      y = height - ((value - min) / range) * scaleFactor;
    }
    
    return `${x},${y}`;
  });
  
  return `M${points.join(' L')}`;
} 