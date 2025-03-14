'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatLargeNumber } from '@/lib/utils';
import { toast, Toaster } from 'react-hot-toast';
import Script from 'next/script';

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
}

export default function ClientPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 20;
  const totalPages = 5; // 100 coins total / 20 coins per page

  useEffect(() => {
    const fetchCoins = async () => {
      const loadingToast = toast.loading('Fetching cryptocurrency data...', {
        position: 'top-right',
      });
      try {
        const response = await fetch('/api/coins?per_page=100');
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
  }, []);

  // Get current coins for the page
  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = coins.slice(indexOfFirstCoin, indexOfLastCoin);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the table
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            {[...Array(20)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded mb-2" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#059669',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#DC2626',
              color: '#fff',
            },
          },
          loading: {
            style: {
              background: '#2563EB',
              color: '#fff',
            },
          },
        }}
      />
      
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Coin
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    24h Change
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    24h Volume
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Circulating Supply
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Market Cap
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentCoins.map((coin) => (
                  <tr key={coin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {coin.market_cap_rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 relative">
                          <Image
                            src={coin.image}
                            alt={coin.name}
                            fill
                            className="rounded-full"
                          />
                        </div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                      ${coin.current_price.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                      coin.price_change_percentage_24h >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                      ${formatLargeNumber(coin.total_volume)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                      {formatLargeNumber(coin.circulating_supply)} {coin.symbol.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                      {formatLargeNumber(coin.market_cap)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 py-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            aria-label="Previous page"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-label={`Page ${index + 1}`}
                aria-current={currentPage === index + 1 ? 'page' : undefined}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Showing {indexOfFirstCoin + 1} to {Math.min(indexOfLastCoin, coins.length)} of {coins.length} coins
        </div>
      </div>
    </>
  );
} 