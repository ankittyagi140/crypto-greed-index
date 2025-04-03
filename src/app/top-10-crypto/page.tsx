'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { formatNumber, formatPercentage } from '@/utils/formatters';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d: number | null;
  price_change_percentage_30d: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  high_7d: number;
  low_7d: number;
  high_30d: number;
  low_30d: number;
  ath: number;
  atl: number;
  sparkline_in_7d: {
    price: number[];
  };
}

const RangeBar = ({ current, low, high, lowLabel, highLabel }: { 
  current: number | null | undefined; 
  low: number | null | undefined; 
  high: number | null | undefined;
  lowLabel: string;
  highLabel: string;
}) => {
  // If any of the required values are missing, show a placeholder
  if (!current || !low || !high) {
    return (
      <div className="w-full">
        <div className="relative h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
          <div className="absolute h-full w-full bg-gray-200 dark:bg-gray-600 rounded-full" />
        </div>
        <div className="flex justify-between mt-1 text-xs">
          <div>
            <div>N/A</div>
            <div className="text-gray-500">-</div>
          </div>
          <div className="text-center">
            <div>N/A</div>
            <div className="text-gray-500">Current</div>
          </div>
          <div className="text-right">
            <div>N/A</div>
            <div className="text-gray-500">-</div>
          </div>
        </div>
      </div>
    );
  }

  const percentage = ((current - low) / (high - low)) * 100;

  return (
    <div className="w-full">
      <div className="relative h-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
        <div 
          className="absolute h-full bg-green-500 rounded-l-full"
          style={{ width: `${percentage}%` }}
        />
        <div 
          className="absolute w-2 h-4 bg-black dark:bg-white -mt-1 transform -translate-x-1/2 rounded shadow-md"
          style={{ left: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs">
        <div>
          <div>${formatNumber(low)}</div>
          <div className="text-gray-500">{lowLabel}</div>
        </div>
        <div className="text-center">
          <div>${formatNumber(current)}</div>
          <div className="text-gray-500">Current</div>
        </div>
        <div className="text-right">
          <div>${formatNumber(high)}</div>
          <div className="text-gray-500">{highLabel}</div>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
      </div>
      <div className="text-right">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>

    {/* Market Stats */}
    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div>
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div>
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>

    {/* Sparkline Chart */}
    <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>

    {/* Range Bars */}
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="flex justify-between">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 text-center pt-3">
        {[...Array(3)].map((_, i) => (
          <div key={i}>
            <div className="h-4 w-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-5 w-20 mx-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function Top10Crypto() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/crypto/top-10');

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again in a minute.');
          }
          throw new Error('Failed to fetch crypto data');
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setCryptoData(data);
      } catch (err) {
        console.error('Error fetching crypto data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load cryptocurrency data';
        setError(errorMessage);
        toast.error(errorMessage, {
          duration: 5000,
          position: 'top-right',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(10)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Top 10 Cryptocurrencies
            </h1>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cryptoData.map((crypto, index) => (
              <motion.div
                key={crypto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Image
                          src={crypto.image}
                          alt={`${crypto.name} logo`}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{crypto.name}</h3>
                          <p className="text-sm text-gray-500 uppercase">{crypto.symbol}</p>
                        </div>
                      </div>
                      <div className={`text-lg ${crypto.price_change_percentage_24h && crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${formatNumber(crypto.current_price)} {' '}
                        <span className="font-semibold">
                          ({formatPercentage(crypto.price_change_percentage_24h)})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Market Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Market Cap</div>
                      <div className="text-base font-semibold text-gray-900 dark:text-white">
                        ${formatNumber(crypto.market_cap)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Rank #{crypto.market_cap_rank}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">24h Volume</div>
                      <div className="text-base font-semibold text-gray-900 dark:text-white">
                        ${formatNumber(crypto.total_volume)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Vol/MCap: {((crypto.total_volume / crypto.market_cap) * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* Sparkline Chart */}
                  <div className="mb-4 h-20">
                    {crypto.sparkline_in_7d?.price && (
                      <Sparklines
                        data={crypto.sparkline_in_7d.price}
                        width={300}
                        height={80}
                        margin={5}
                      >
                        <SparklinesLine
                          style={{
                            stroke: crypto.price_change_percentage_7d && crypto.price_change_percentage_7d >= 0 
                              ? '#22c55e'  // green
                              : '#ef4444', // red
                            strokeWidth: 2,
                            fill: 'none'
                          }}
                        />
                      </Sparklines>
                    )}
                  </div>

                  {/* Range Bars */}
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">Daily Range</div>
                      <RangeBar
                        current={crypto.current_price}
                        low={crypto.low_24h}
                        high={crypto.high_24h}
                        lowLabel={`${((crypto.low_24h - crypto.current_price) / crypto.current_price * 100).toFixed(2)}% from low`}
                        highLabel={`${((crypto.high_24h - crypto.current_price) / crypto.current_price * 100).toFixed(2)}% from high`}
                      />
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">Weekly Range</div>
                      <RangeBar
                        current={crypto.current_price}
                        low={crypto.low_7d}
                        high={crypto.high_7d}
                        lowLabel={`${((crypto.low_7d - crypto.current_price) / crypto.current_price * 100).toFixed(2)}% from low`}
                        highLabel={`${((crypto.high_7d - crypto.current_price) / crypto.current_price * 100).toFixed(2)}% from high`}
                      />
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">Monthly Range</div>
                      <RangeBar
                        current={crypto.current_price}
                        low={crypto.low_30d}
                        high={crypto.high_30d}
                        lowLabel={`${((crypto.low_30d - crypto.current_price) / crypto.current_price * 100).toFixed(2)}% from low`}
                        highLabel={`${((crypto.high_30d - crypto.current_price) / crypto.current_price * 100).toFixed(2)}% from high`}
                      />
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">All Time Range</div>
                      <RangeBar
                        current={crypto.current_price}
                        low={crypto.atl}
                        high={crypto.ath}
                        lowLabel={`${((crypto.atl - crypto.current_price) / crypto.current_price * 100).toFixed(2)}% from low`}
                        highLabel={`${((crypto.ath - crypto.current_price) / crypto.current_price * 100).toFixed(2)}% from high`}
                      />
                    </div>

                    {/* Price Changes */}
                    <div className="grid grid-cols-3 gap-4 text-center pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <div className="text-sm font-medium text-gray-500">24H Change</div>
                        {crypto.price_change_percentage_24h !== null ? (
                          <div className={`text-base font-bold ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatPercentage(crypto.price_change_percentage_24h)}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 italic">
                            Data updating...
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">7D Change</div>
                        {crypto.price_change_percentage_7d !== null ? (
                          <div className={`text-base font-bold ${crypto.price_change_percentage_7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatPercentage(crypto.price_change_percentage_7d)}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 italic">
                            Weekly data loading
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">30D Change</div>
                        {crypto.price_change_percentage_30d !== null ? (
                          <div className={`text-base font-bold ${crypto.price_change_percentage_30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatPercentage(crypto.price_change_percentage_30d)}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 italic">
                            Monthly data loading
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 