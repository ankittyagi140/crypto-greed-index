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

// Professional Mini Line Chart Component
const MiniLineChart = ({ data, color = '#3B82F6' }: { data: number[], color?: string }) => {
  if (!data || data.length < 2) return null;

  // Add padding to prevent edge clipping
  const padding = 0.1; // 10% padding
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const paddedRange = range * (1 + 2 * padding);
  const paddedMin = min - range * padding;

  // Generate smooth curve points with better scaling
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 80 + 10; // Add horizontal padding
    const y = 35 - ((value - paddedMin) / paddedRange) * 30; // Add vertical padding
    return `${x},${y}`;
  });

  // Create smooth path using quadratic curves
  const createSmoothPath = (points: string[]) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0]}`;
    
    for (let i = 1; i < points.length; i++) {
      const [x, y] = points[i].split(',').map(Number);
      const [prevX, prevY] = points[i - 1].split(',').map(Number);
      
      if (i === 1) {
        // First curve
        const cpX = prevX + (x - prevX) / 3;
        path += ` Q ${cpX},${prevY} ${(prevX + x) / 2},${(prevY + y) / 2}`;
      } else if (i === points.length - 1) {
        // Last curve
        const cpX = prevX + (x - prevX) * 2 / 3;
        path += ` Q ${cpX},${y} ${x},${y}`;
      } else {
        // Middle curves
        const [nextX] = points[i + 1].split(',').map(Number);
        const cp1X = prevX + (x - prevX) / 3;
        const cp2X = x - (nextX - x) / 3;
        path += ` C ${cp1X},${prevY} ${cp2X},${y} ${x},${y}`;
      }
    }
    
    return path;
  };

  const smoothPath = createSmoothPath(points);

  return (
    <div className="flex-shrink-0 w-24 h-12 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-lg p-1 border border-slate-200/50 dark:border-slate-600/50">
      <svg width="96" height="48" viewBox="0 0 96 48" className="w-full h-full">
        {/* Background gradient for better visibility */}
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.05"/>
          </linearGradient>
        </defs>
        
        {/* Area under the curve for better visual appeal */}
        <path
          d={`${smoothPath} L 86,35 L 10,35 Z`}
          fill={`url(#gradient-${color.replace('#', '')})`}
        />
        
        {/* Smooth curve line */}
        <path
          d={smoothPath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
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
    const volatility = 0.015; // Reduced volatility for smoother curves
    const trend = change ? change / 100 : 0;

    // Generate more points for smoother curves (24 points for 7 days = ~3.4 hours per point)
    const numPoints = 24;
    
    for (let i = 0; i < numPoints; i++) {
      // Create a more realistic price movement with trend and noise
      const timeProgress = i / (numPoints - 1);
      
      // Main trend component
      const trendComponent = trend * timeProgress;
      
      // Add some realistic market noise with autocorrelation
      const noise: number = i === 0 ? 0 : (points[i - 1] - basePrice) / basePrice * 0.3;
      const randomNoise: number = (Math.random() - 0.5) * volatility;
      
      // Combine trend, noise, and random component
      const totalChange = trendComponent + noise + randomNoise;
      const newPrice = basePrice * (1 + totalChange);
      
      points.push(Math.max(newPrice, basePrice * 0.95)); // Prevent extreme drops
    }

    return points;
  };

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 dark:border-gray-700/50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-xl w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded w-24"></div>
                  <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded w-20"></div>
                <div className="w-24 h-12 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 dark:border-gray-700/50 p-6">
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

      {/* Professional Tabs */}
      <div className="flex space-x-1 mb-6 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl p-1 border border-slate-200/50 dark:border-slate-600/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-lg border border-blue-200/50 dark:border-blue-400/50'
                : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-600/50'
              }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Professional Table Header */}
      <div className="hidden sm:flex items-center justify-between p-3 border-b border-slate-200/50 dark:border-slate-600/50 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-gradient-to-r from-slate-50/50 to-blue-50/30 dark:from-slate-700/50 dark:to-slate-800/50 rounded-t-lg">
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
              className="flex items-center justify-between p-3 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 dark:hover:from-slate-700/50 dark:hover:to-slate-800/50 transition-all duration-200 group border-b border-slate-100/50 dark:border-slate-700/50 last:border-b-0 rounded-lg hover:shadow-sm"
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

      {/* Professional View More Button */}
      <div className="mt-6 text-center">
        <Link
          href="/top-10-crypto"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <CurrencyDollarIcon className="h-5 w-5" />
          <span>View All Cryptocurrencies</span>
        </Link>
      </div>
    </div>
  );
} 