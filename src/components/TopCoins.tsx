'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatLargeNumber } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import {useRouter} from 'next/navigation'

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

export default function TopCoins() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
 
  const router = useRouter();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch('/api/coins?per_page=10');
        if (!response.ok) throw new Error('Failed to fetch coins');
        const data = await response.json();
        setCoins(data);
        setIsLoading(false);
      } catch (error) {
        toast.error('Failed to load cryptocurrency data');
        console.error('Error fetching coins:', error);
        setIsLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 5 * 60 * 1000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

 

 const handleShowMoreClick=()=>{
  router.push('/top-coins')
 }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded mb-2" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {coins.map((coin) => (
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
                        {formatLargeNumber(coin.market_cap)}
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
                    {formatLargeNumber(coin.total_volume)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                    {formatLargeNumber(coin.circulating_supply)} {coin.symbol.toUpperCase()}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                    {formatLargeNumber(coin.market_cap)}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    <button className='text-center bg-white dark:bg-gray-800 rounded-lg shadow p-4 w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
    onClick={handleShowMoreClick}>Show More</button>
    </div>
  );
} 