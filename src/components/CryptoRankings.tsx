'use client'
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
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
  total_volume: number;
  high_24h: number | null;
  low_24h: number | null;
  ath: number;
  atl: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

type RankingType = 'market-cap' | 'price' | 'volume';

// Mini Line Chart Component
const MiniLineChart = ({ data, color = '#3B82F6' }: { data: number[], color?: string, height?: number }) => {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex-shrink-0 w-24 h-12 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
      <svg width="96" height="48" viewBox="0 0 96 48" className="w-full h-full">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

export default function CryptoRankings() {
  const [activeTab, setActiveTab] = useState<RankingType>('market-cap');
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'market-cap' as RankingType, label: 'Market Cap', icon: '💰' },
    { id: 'price' as RankingType, label: 'Price', icon: '💎' },
    { id: 'volume' as RankingType, label: 'Volume', icon: '📊' },
  ];

  const fetchData = async (type: RankingType) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/crypto/top-by-${type}?sparkline=true`);

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
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load cryptocurrency data';
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    } else {
      return `$${volume.toLocaleString()}`;
    }
  };

  const getPriceChangeColor = (change: number | null) => {
    if (change === null) return 'text-gray-500';
    return change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const getPriceChangeIcon = (change: number | null) => {
    if (change === null) return null;
    return change >= 0 ? (
      <ArrowTrendingUpIcon className="h-4 w-4" />
    ) : (
      <ArrowTrendingDownIcon className="h-4 w-4" />
    );
  };

  const getChartColor = (change: number | null) => {
    if (change === null) return '#6B7280';
    return change >= 0 ? '#16A34A' : '#DC2626';
  };

  const generateMockSparkline = (price: number, change: number | null) => {
    const points = [];
    const basePrice = price;
    const volatility = 0.02; // 2% volatility

    for (let i = 0; i < 7; i++) {
      const randomChange = (Math.random() - 0.5) * volatility;
      const trend = change ? (change / 100) * (i / 6) : 0;
      const newPrice = basePrice * (1 + randomChange + trend);
      points.push(newPrice);
    }

    return points;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Top Cryptocurrencies
        </h2>
        <Link
          href="/top-10-crypto"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="hidden sm:flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <span className="w-8 text-center">#</span>
            <span className="w-10"></span>
          </div>
          <span>Name</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="min-w-[120px] text-right">Price</span>
          <span className="min-w-[100px] text-right">
            {activeTab === 'market-cap' && 'Market Cap'}
            {activeTab === 'price' && 'Market Cap'}
            {activeTab === 'volume' && 'Volume'}
          </span>
          <span className="w-24 text-center">7D Chart</span>
        </div>
      </div>

      {/* Crypto List */}
      <div className="space-y-1">
        {cryptoData.map((crypto, index) => {
          const sparklineData = crypto.sparkline_in_7d?.price || generateMockSparkline(crypto.current_price, crypto.price_change_percentage_24h);
          const chartColor = getChartColor(crypto.price_change_percentage_24h);

          return (
            <Link
              key={crypto.id}
              href={`/coins/${crypto.id}`}
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group border-b border-gray-100 dark:border-gray-800 last:border-b-0"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-8 text-center">
                    #{index + 1}
                  </span>
                  <Image
                    src={crypto.image}
                    alt={crypto.name}
                    height={40}
                    width={40}
                    className="w-10 h-10 rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {crypto.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {crypto.symbol.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Price and Change */}
                <div className="text-right min-w-[120px]">
                  <div className="font-medium text-gray-900 dark:text-white text-lg">
                    {formatPrice(crypto.current_price)}
                  </div>
                  <div className="flex items-center justify-end space-x-1 text-sm">
                    {getPriceChangeIcon(crypto.price_change_percentage_24h)}
                    <span className={`font-semibold ${getPriceChangeColor(crypto.price_change_percentage_24h)}`}>
                      {crypto.price_change_percentage_24h !== null
                        ? `${crypto.price_change_percentage_24h >= 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(2)}%`
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Market Cap/Volume */}
                <div className="text-right min-w-[100px]">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {activeTab === 'market-cap' && 'Market Cap'}
                    {activeTab === 'price' && 'Market Cap'}
                    {activeTab === 'volume' && 'Volume'}
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {activeTab === 'market-cap' && formatMarketCap(crypto.market_cap)}
                    {activeTab === 'price' && formatMarketCap(crypto.market_cap)}
                    {activeTab === 'volume' && formatVolume(crypto.total_volume)}
                  </div>
                </div>

                {/* Price Chart */}
                <div className="hidden sm:block">
                  <MiniLineChart data={sparklineData} color={chartColor} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* View More Button */}
      <div className="mt-6 text-center">
        <Link
          href="/top-10-crypto"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          <CurrencyDollarIcon className="h-5 w-5" />
          <span>View All Cryptocurrencies</span>
        </Link>
      </div>
    </div>
  );
} 