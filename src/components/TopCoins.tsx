'use client';

import { useEffect, useState } from 'react';
import { formatNumber } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_change_percentage_24h: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

export default function TopCoins() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch('/api/top-coins');
        if (!response.ok) {
          throw new Error('Failed to fetch coins');
        }
        const data = await response.json();
        setCoins(data.data);
      } catch (error) {
        console.error('Error fetching coins:', error);
        toast.error('Failed to load coins');
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getPriceChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      {coins.map((coin) => (
        <Link
          key={coin.id}
          href={`/coins/${coin.id}`}
          className="block bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {coin.name} ({coin.symbol.toUpperCase()})
              </h3>
              <p className="text-gray-600">${formatNumber(coin.current_price)}</p>
            </div>
            <div className="text-right">
              <div className={`flex items-center justify-end ${getPriceChangeColor(coin.price_change_percentage_24h)}`}>
                {getPriceChangeIcon(coin.price_change_percentage_24h)}
                {coin.price_change_percentage_24h.toFixed(2)}%
              </div>
              <p className="text-sm text-gray-600">
                MCap: ${formatNumber(coin.market_cap)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 