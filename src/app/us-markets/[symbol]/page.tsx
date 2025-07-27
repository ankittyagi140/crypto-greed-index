'use client';

import { useState, useEffect, useCallback } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { useParams } from 'next/navigation';
import MarketMovers from '../../../components/MarketMovers';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import Head from 'next/head';
import React from 'react';

const indexInfo = {
  'sp500': {
    name: 'S&P 500',
    symbol: '^GSPC',
    description: 'The Standard and Poor\'s 500 tracks the performance of 500 large US companies.',
    color: '#2E7D32'
  },
  'nasdaq': {
    name: 'NASDAQ Composite',
    symbol: '^IXIC',
    description: 'The Nasdaq Composite includes all stocks listed on the Nasdaq stock market.',
    color: '#1976D2'
  },
  'dow-jones': {
    name: 'Dow Jones Industrial Average',
    symbol: '^DJI',
    description: 'The Dow Jones Industrial Average tracks 30 large US companies.',
    color: '#D32F2F'
  },
  'russell2000': {
    name: 'Russell 2000',
    symbol: '^RUT',
    description: 'The Russell 2000 tracks 2,000 small-cap US companies.',
    color: '#7B1FA2'
  }
};

interface HistoricalData {
  date: string;
  value: number;
  ma50?: number;
  ma100?: number;
  ma200?: number;
  ema20?: number;
  rsi?: number;
  volume?: number;
}

interface TechnicalIndicators {
  ma50: number;
  ma100: number;
  ma200: number;
  ema20: number;
  rsi: number;
  macdLine: number;
  signalLine: number;
  histogram: number;
  support: number;
  resistance: number;
  bollingerUpper: number;
  bollingerMiddle: number;
  bollingerLower: number;
  stochasticK: number;
  stochasticD: number;
  atr: number;
  obv: number;
}

// Add a type definition for the time range
type TimeRangeType = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

const PriceGauge = ({ 
  currentPrice, 
  lowPrice, 
  highPrice 
}: { 
  currentPrice: number | null; 
  lowPrice: number | null; 
  highPrice: number | null; 
}) => {
  if (!currentPrice || !lowPrice || !highPrice) return null;

  const percentage = ((currentPrice - lowPrice) / (highPrice - lowPrice)) * 100;
  const distanceFromLow = ((currentPrice - lowPrice) / lowPrice * 100).toFixed(1);
  const distanceFromHigh = ((highPrice - currentPrice) / highPrice * 100).toFixed(1);
  
  return (
    <div className="mt-2">
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
          style={{ width: '100%' }}
        />
        <div 
          className="absolute w-2 h-4 bg-gray-800 dark:bg-white -mt-1 transform -translate-x-1/2 rounded"
          style={{ left: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="text-left">
          <div>${lowPrice.toLocaleString()}</div>
          <div className="text-xs text-gray-400">{distanceFromLow}% from low</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-gray-700 dark:text-gray-300">
            ${currentPrice.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Current</div>
        </div>
        <div className="text-right">
          <div>${highPrice.toLocaleString()}</div>
          <div className="text-xs text-gray-400">{distanceFromHigh}% from high</div>
        </div>
      </div>
    </div>
  );
};

const getChartColor = (data: HistoricalData[]) => {
  if (data.length < 2) return { stroke: '#6B7280', fill: '#6B7280' };
  const firstPrice = data[0].value;
  const lastPrice = data[data.length - 1].value;
  return lastPrice >= firstPrice 
    ? { stroke: '#22c55e', fill: '#22c55e' }  // Green for upward trend
    : { stroke: '#ef4444', fill: '#ef4444' };  // Red for downward trend
};

const TechnicalIndicatorCard = ({ title, value, description }: { title: string; value: number | null; description?: string }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
    <div className="mt-1">
      <span className="text-lg font-bold text-gray-900 dark:text-white">
        {value !== null ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'}
      </span>
    </div>
    {description && (
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
    )}
  </div>
);

// Define types for API responses
interface SuccessfulApiResult {
  indexKey: string;
  data: {
    success: boolean;
    data: {
      currentStats: {
        price: number;
        change: number;
        changePercent: number;
      }
    }
  };
  success: true;
}

interface FailedApiResult {
  indexKey: string;
  error: Error;
  success: false;
}

type ApiResult = SuccessfulApiResult | FailedApiResult;

// Define type for other indices data
interface IndexData {
  price: number;
  change: number;
  changePercent: number;
}

// Add a skeleton component for the chart
const ChartSkeleton = () => (
  <div className="p-2 sm:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg w-full">
    <div className="flex flex-wrap justify-between items-center mb-4">
      <div>
        {/* Price skeleton */}
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        <div className="flex items-center mt-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-2 sm:mt-0">
        {/* Dropdown selector skeleton */}
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
      </div>
    </div>
    
    {/* Chart area skeleton */}
    <div className="h-60 sm:h-72 md:h-80 lg:h-96 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse">
      <div className="h-full w-full p-4">
        {/* Y-axis ticks */}
        <div className="flex flex-col justify-between h-5/6 w-full">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-10 mb-1"></div>
              <div className="h-px bg-gray-300 dark:bg-gray-600 w-full ml-2"></div>
            </div>
          ))}
        </div>
        
        {/* X-axis ticks */}
        <div className="flex justify-between mt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-10"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Add cache constants and utilities
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const DATA_CACHE_KEY_PREFIX = 'market_data_cache_';
const OTHER_INDICES_CACHE_KEY = 'other_indices_cache';
const YTD_CACHE_KEY_PREFIX = 'ytd_data_cache_';

// Memoized chart component with its own state management
const IndexChartContainer = React.memo(({ 
  symbol,
  initialData,
  initialTimeRange,
  calculateIndicators
}: { 
  symbol: string,
  initialData: HistoricalData[],
  initialTimeRange: TimeRangeType,
  calculateIndicators: (data: HistoricalData[]) => TechnicalIndicators | null
}) => {
  const [chartData, setChartData] = useState<HistoricalData[]>(initialData);
  const [timeRange, setTimeRange] = useState<TimeRangeType>(initialTimeRange);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // If initialData is empty, create a simple dataset with just today's data point
  useEffect(() => {
    if (initialData.length === 0) {
      // Find the price from indexInfo to create a fallback chart
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - (2 * 60 * 60 * 1000));
      
      // Create a simple dataset with just two points to show a flat line
      const fallbackData: HistoricalData[] = [
        {
          date: twoHoursAgo.toISOString(),
          value: 0 // This will be updated by the parent component's currentStats
        },
        {
          date: now.toISOString(),
          value: 0 // This will be updated by the parent component's currentStats
        }
      ];
      
      setChartData(fallbackData);
    } else {
      setChartData(initialData);
    }
  }, [initialData]);
  
  // Wrap formatDateByTimeRange and formatDateForTooltip in useCallback
  const formatDateByTimeRange = useCallback((date: string, timeRange: TimeRangeType) => {
    try {
      const d = new Date(date);
      if (timeRange === '1D') {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch (error) {
      console.error('Error formatting date by time range:', error, date);
      return date;
    }
  }, []);

  // Format date for tooltip based on the selected time range
  const formatDateForTooltip = useCallback((date: string, timeRange: TimeRangeType) => {
    try {
      const d = new Date(date);
      if (timeRange === '1D') {
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (timeRange === '1W' || timeRange === '1M') {
        return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      } else {
        return d.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
      }
    } catch (error) {
      console.error('Error formatting date for tooltip:', error, date);
      return date;
    }
  }, []);

  // Updated function with caching
  const handleTimeRangeChange = useCallback(async (newTimeRange: TimeRangeType) => {
    if (newTimeRange === timeRange) return;
    
    setTimeRange(newTimeRange);
    setLoading(true);
    setError(null);
    
    try {
      // Check cache first
      const cacheKey = `${DATA_CACHE_KEY_PREFIX}${symbol}_${newTimeRange}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        try {
          const parsedCache = JSON.parse(cachedData);
          const now = Date.now();
          const cacheTime = new Date(parsedCache.timestamp).getTime();
          
          if (now - cacheTime < CACHE_DURATION) {
            console.log(`Using cached data for ${symbol} with timeRange ${newTimeRange}`);
            setChartData(parsedCache.historicalData);
            calculateIndicators(parsedCache.historicalData);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error parsing cached data:', error);
          // Continue with API call if cache fails
        }
      }
      
      // If no valid cache, fetch from API
      console.log(`Fetching chart data for ${symbol} with timeRange ${newTimeRange}`);
      const response = await fetch(`/api/us-markets/${symbol}?timeRange=${newTimeRange}`, {
        cache: 'no-store', // Prevent browser caching
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        if (!result.data.historicalData || result.data.historicalData.length === 0) {
          throw new Error(`No data available for ${symbol} with timeRange ${newTimeRange}`);
        }
        
        setChartData(result.data.historicalData);
        calculateIndicators(result.data.historicalData);
        
        // Save to cache
        localStorage.setItem(cacheKey, JSON.stringify({
          historicalData: result.data.historicalData,
          timestamp: new Date().toISOString()
        }));
      } else {
        throw new Error(result.error || 'Failed to fetch market data');
      }
    } catch (err) {
      console.error('Error fetching time range data:', err);
      setError(err instanceof Error ? err.message : 'Failed to update chart data');
      toast.error('Failed to update chart data');
    } finally {
      setLoading(false);
    }
  }, [timeRange, symbol, calculateIndicators]);

  const chartColor = getChartColor(chartData);

  // Check if we have valid data
  const hasValidData = chartData && chartData.length > 0;
  const lastValue = hasValidData ? chartData[chartData.length - 1]?.value : null;
  const firstValue = hasValidData ? chartData[0]?.value : null;
  const changeValue = hasValidData && firstValue !== null && lastValue !== null ? lastValue - firstValue : null;
  const changePercent = hasValidData && firstValue !== null && lastValue !== null && firstValue !== 0 ? 
    (lastValue - firstValue) / firstValue * 100 : null;

  return (
    <div className="p-2 sm:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg w-full">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {lastValue !== null ? 
              `$${lastValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
              'Data not available'}
          </h3>
          <div className="flex items-center mt-1">
            {changeValue !== null && changePercent !== null ? (
              <span className={`flex items-center text-sm font-medium ${
                changeValue >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {changeValue >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {Math.abs(changeValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                ({Math.abs(changePercent).toFixed(2)}%)
              </span>
            ) : (
              <span className="text-sm text-gray-500">Change not available</span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              Today
            </span>
          </div>
        </div>
        
        <div className="mt-2 sm:mt-0 space-y-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-end">
              <select 
                value={timeRange}
                onChange={(e) => handleTimeRangeChange(e.target.value as TimeRangeType)}
                className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                disabled={loading}
              >
                <option value="1D">1D</option>
                <option value="1W">1W</option>
                <option value="1M">1M</option>
                <option value="3M">3M</option>
                <option value="6M">6M</option>
                <option value="1Y">1Y</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <div className="h-60 sm:h-72 md:h-80 lg:h-96 w-full">
        {loading ? (
          <div className="h-full w-full">
            <div className="animate-pulse w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
              <div className="h-full w-full p-4">
                {/* Y-axis ticks */}
                <div className="flex flex-col justify-between h-5/6 w-full">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-10 mb-1"></div>
                      <div className="h-px bg-gray-300 dark:bg-gray-600 w-full ml-2"></div>
                    </div>
                  ))}
                </div>
                
                {/* X-axis ticks */}
                <div className="flex justify-between mt-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-10"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : hasValidData ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor.fill} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={chartColor.fill} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'gray' }}
                tickFormatter={(value) => formatDateByTimeRange(value, timeRange)}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'gray' }}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderColor: '#E5E7EB',
                  borderRadius: '0.375rem'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'value') return ['Price', `$${value.toLocaleString(undefined, {minimumFractionDigits: 2})}`];
                  if (name === 'ma50') return ['MA50', `$${value.toLocaleString(undefined, {minimumFractionDigits: 2})}`];
                  if (name === 'ma200') return ['MA200', `$${value.toLocaleString(undefined, {minimumFractionDigits: 2})}`];
                  if (name === 'ma100') return ['MA100', `$${value.toLocaleString(undefined, {minimumFractionDigits: 2})}`];
                  if (name === 'ema20') return ['EMA20', `$${value.toLocaleString(undefined, {minimumFractionDigits: 2})}`];
                  if (name === 'volume') {
                    const formattedValue = value > 1000000 
                      ? `${(value / 1000000).toFixed(2)}M`
                      : value > 1000 
                        ? `${(value / 1000).toFixed(2)}K` 
                        : value.toFixed(2);
                    return ['Volume', formattedValue];
                  }
                  return [name, value.toLocaleString(undefined, {minimumFractionDigits: 2})];
                }}
                labelFormatter={(value) => formatDateForTooltip(value, timeRange)}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chartColor.stroke} 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>No chart data available</p>
              <p className="text-sm mt-2">Try selecting a different time range</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

IndexChartContainer.displayName = 'IndexChartContainer';

export default function IndexDetail() {
  const router = useRouter();
  const params = useParams();
  const symbol = Array.isArray(params.symbol) ? params.symbol[0] : params.symbol || '';
  const index = indexInfo[symbol as keyof typeof indexInfo];
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange] = useState<TimeRangeType>('1D');
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [currentStats, setCurrentStats] = useState({
    price: null as number | null,
    change: null as number | null,
    changePercent: null as number | null,
    weekChange: null as number | null,
    weekChangePercent: null as number | null,
    monthChange: null as number | null,
    monthChangePercent: null as number | null,
    yearToDateChange: null as number | null,
    yearToDatePercent: null as number | null,
    high52Week: null as number | null,
    low52Week: null as number | null,
    dailyHigh: null as number | null,
    dailyLow: null as number | null,
    volume: null as number | null
  });
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicators | null>(null);
  const [ytdStats, setYtdStats] = useState({
    yearToDateChange: null as number | null,
    yearToDatePercent: null as number | null
  });
  const [otherIndices, setOtherIndices] = useState<Record<string, IndexData>>({});

  // Redirect from dollar-index to another index since we don't have historical data
  useEffect(() => {
    if (symbol === 'dollar-index') {
      router.push('/us-markets/sp500');
    }
  }, [symbol, router]);

  // Helper function to check if cache is valid
  const isDataCacheValid = useCallback((cacheData: { timestamp: string | number | Date }) => {
    if (!cacheData) return false;
    
    const now = Date.now();
    const cacheTime = new Date(cacheData.timestamp).getTime();
    return now - cacheTime < CACHE_DURATION;
  }, []);

  // Calculate technical indicators
  const calculateEMA = useCallback((prices: number[], period: number): number => {
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    prices.forEach(price => {
      ema = (price - ema) * multiplier + ema;
    });
    return ema;
  }, []);

  const calculateIndicators = useCallback((data: HistoricalData[]) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return null;
    }

    const prices = data.map(d => d.value);
    const length = prices.length;
    
    // If we have minimal data (like our fallback 2-point dataset), return simplified indicators
    if (length < 5) {
      const currentPrice = prices[prices.length - 1];
      return {
        ma50: currentPrice,
        ma100: currentPrice,
        ma200: currentPrice,
        ema20: currentPrice,
        rsi: 50, // Neutral RSI
        macdLine: 0,
        signalLine: 0,
        histogram: 0,
        support: currentPrice * 0.98, // Simple 2% estimate
        resistance: currentPrice * 1.02, // Simple 2% estimate
        bollingerUpper: currentPrice * 1.02,
        bollingerMiddle: currentPrice,
        bollingerLower: currentPrice * 0.98,
        stochasticK: 50,
        stochasticD: 50,
        atr: currentPrice * 0.01, // 1% of price
        obv: 0
      };
    }
    
    const volumes = data.map(d => d.volume || 0);

    // Calculate Moving Averages
    const ma50 = prices.slice(-Math.min(50, length)).reduce((a, b) => a + b, 0) / Math.min(50, length);
    const ma100 = prices.slice(-Math.min(100, length)).reduce((a, b) => a + b, 0) / Math.min(100, length);
    const ma200 = prices.slice(-Math.min(200, length)).reduce((a, b) => a + b, 0) / Math.min(200, length);

    // Calculate EMA-20
    const multiplier = 2 / (20 + 1);
    let ema20 = prices[0];
    prices.forEach(price => {
      ema20 = (price - ema20) * multiplier + ema20;
    });

    // Calculate RSI
    const changes = prices.slice(1).map((price, i) => price - prices[i]);
    const gains = changes.filter(change => change > 0);
    const losses = changes.filter(change => change < 0).map(loss => Math.abs(loss));
    const avgGain = gains.length ? gains.reduce((a, b) => a + b, 0) / Math.min(14, gains.length) : 0;
    const avgLoss = losses.length ? losses.reduce((a, b) => a + b, 0) / Math.min(14, losses.length) : 0;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    // Calculate Bollinger Bands (20-period SMA with 2 standard deviations)
    const period = 20;
    const stdDevMultiplier = 2;
    const sma20 = prices.slice(-period).reduce((a, b) => a + b, 0) / period;
    const stdDev = Math.sqrt(
      prices.slice(-period).reduce((sum, price) => sum + Math.pow(price - sma20, 2), 0) / period
    );
    const bollingerUpper = sma20 + stdDevMultiplier * stdDev;
    const bollingerMiddle = sma20;
    const bollingerLower = sma20 - stdDevMultiplier * stdDev;

    // Calculate Stochastic Oscillator
    const period14 = prices.slice(-14);
    const low14 = Math.min(...period14);
    const high14 = Math.max(...period14);
    const stochasticK = ((prices[prices.length - 1] - low14) / (high14 - low14)) * 100;
    const stochasticD = prices.slice(-3).reduce((acc, _, i) => {
      const periodPrices = prices.slice(-14 - i, -i);
      const periodLow = Math.min(...periodPrices);
      const periodHigh = Math.max(...periodPrices);
      return acc + ((prices[prices.length - 1 - i] - periodLow) / (periodHigh - periodLow)) * 100;
    }, 0) / 3;

    // Calculate Average True Range (ATR)
    const tr = prices.slice(1).map((price, i) => {
      const high = price;
      const low = prices[i];
      const prevClose = prices[i];
      return Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
    });
    const atr = tr.slice(-14).reduce((a, b) => a + b, 0) / 14;

    // Calculate On Balance Volume (OBV)
    const obv = volumes.reduce((acc, volume, i) => {
      if (i === 0) return volume;
      return prices[i] > prices[i - 1] ? acc + volume : prices[i] < prices[i - 1] ? acc - volume : acc;
    }, 0);

    // Simple support and resistance levels
    const recentPrices = prices.slice(-30);
    const support = Math.min(...recentPrices);
    const resistance = Math.max(...recentPrices);

    // Calculate MACD (12,26,9)
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);
    const macdLine = ema12 - ema26;
    const signalLine = calculateEMA([macdLine], 9);
    const histogram = macdLine - signalLine;

    return {
      ma50,
      ma100,
      ma200,
      ema20,
      rsi,
      macdLine,
      signalLine,
      histogram,
      support,
      resistance,
      bollingerUpper,
      bollingerMiddle,
      bollingerLower,
      stochasticK,
      stochasticD,
      atr,
      obv
    };
  }, [calculateEMA]);

  // Enhanced fetchData with caching
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!symbol) return;
    
    console.log(`Fetching market data for ${symbol}, timeRange: ${timeRange}, forceRefresh: ${forceRefresh}`);
    
    // Try to get from cache unless force refresh is requested
    if (!forceRefresh) {
      const cacheKey = `${DATA_CACHE_KEY_PREFIX}${symbol}_${timeRange}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        try {
          const parsedCache = JSON.parse(cachedData);
          if (isDataCacheValid(parsedCache)) {
            console.log(`Using cached data for ${symbol} with timeRange ${timeRange}`);
            setHistoricalData(parsedCache.historicalData);
            setCurrentStats(parsedCache.currentStats);
            
            // Calculate technical indicators with cached data
            const indicators = calculateIndicators(parsedCache.historicalData);
            setTechnicalIndicators(indicators);
            
            setLoading(false);
            return;
          } else {
            console.log(`Cache expired for ${symbol}, fetching fresh data`);
          }
        } catch (error) {
          console.error('Error parsing cached data:', error);
          // Continue with fetching fresh data if cache parsing fails
        }
      } else {
        console.log(`No cache found for ${symbol}, fetching fresh data`);
      }
    }
    
    try {
      setLoading(true);
      setError(null);
      const loadingToast = toast.loading('Fetching market data...', {
        position: 'top-right',
      });
      
      console.log(`Making API request to /api/us-markets/${symbol}?timeRange=${timeRange}`);
      const marketDataResponse = await fetch(`/api/us-markets/${symbol}?timeRange=${timeRange}`, {
        // Add cache control to prevent browser caching issues
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!marketDataResponse.ok) {
        throw new Error(`API request failed with status ${marketDataResponse.status}: ${marketDataResponse.statusText}`);
      }
      
      const marketDataResult = await marketDataResponse.json();
      console.log(`API response for ${symbol}:`, marketDataResult);
      
      if (!marketDataResult.success) {
        throw new Error(marketDataResult.error || 'Failed to fetch market data');
      }

      const { historicalData, currentStats } = marketDataResult.data;
      
      // Add better validation for historical data
      const validHistoricalData = Array.isArray(historicalData) && historicalData.length > 0 
        ? historicalData 
        : [
            { date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), value: currentStats?.price || 0 },
            { date: new Date().toISOString(), value: currentStats?.price || 0 }
          ];
          
      const validCurrentStats = currentStats || {
        price: 0,
        change: 0,
        changePercent: 0,
        weekChange: 0,
        weekChangePercent: 0,
        monthChange: 0,
        monthChangePercent: 0,
        yearToDateChange: 0,
        yearToDatePercent: 0,
        high52Week: 0,
        low52Week: 0,
        dailyHigh: 0,
        dailyLow: 0,
        volume: 0
      };
      
      // Cache the data even if it's fallback data
      const cacheKey = `${DATA_CACHE_KEY_PREFIX}${symbol}_${timeRange}`;
      localStorage.setItem(cacheKey, JSON.stringify({
        historicalData: validHistoricalData,
        currentStats: validCurrentStats,
        timestamp: new Date().toISOString()
      }));
      
      console.log(`Successfully fetched and cached data for ${symbol}`);
      setHistoricalData(validHistoricalData);
      setCurrentStats(validCurrentStats);
      
      // Calculate technical indicators after setting historical data
      const indicators = calculateIndicators(validHistoricalData);
      setTechnicalIndicators(indicators);

      toast.success('Market data updated', {
        id: loadingToast,
        duration: 2000,
      });
    } catch (err) {
      console.error(`Error fetching data for ${symbol}:`, err);
      setError(`Failed to load market data for ${symbol}. ${err instanceof Error ? err.message : 'Please try again later.'}`);
      toast.error(`Failed to load market data for ${symbol}. Please try again later.`, {
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  }, [symbol, timeRange, calculateIndicators, isDataCacheValid]);

  // Enhanced fetchYtdData with caching
  const fetchYtdData = useCallback(async () => {
    if (!symbol) return;

    const cacheKey = `${YTD_CACHE_KEY_PREFIX}${symbol}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      try {
        const parsedCache = JSON.parse(cachedData);
        if (isDataCacheValid(parsedCache)) {
          console.log(`Using cached YTD data for ${symbol}`);
          setYtdStats(parsedCache.ytdStats);
          return;
        }
      } catch (error) {
        console.error('Error parsing cached YTD data:', error);
      }
    }
    
    try {
      const ytdResponse = await fetch(`/api/us-markets/${symbol}?timeRange=1Y`);
      const ytdResult = await ytdResponse.json();
      
      if (ytdResult.success) {
        const newYtdStats = {
          yearToDateChange: ytdResult.data.currentStats.yearToDateChange,
          yearToDatePercent: ytdResult.data.currentStats.yearToDatePercent
        };
        
        setYtdStats(newYtdStats);
        
        localStorage.setItem(cacheKey, JSON.stringify({
          ytdStats: newYtdStats,
          timestamp: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Error fetching YTD data:', error);
    }
  }, [symbol, isDataCacheValid]);

  // Enhanced fetchOtherIndices with caching
  const fetchOtherIndices = useCallback(async () => {
    if (!symbol) return;
    
    const cachedData = localStorage.getItem(OTHER_INDICES_CACHE_KEY);
    
    if (cachedData) {
      try {
        const parsedCache = JSON.parse(cachedData);
        if (isDataCacheValid(parsedCache)) {
          console.log('Using cached other indices data');
          setOtherIndices(parsedCache.otherIndices);
          return;
        }
      } catch (error) {
        console.error('Error parsing cached other indices data:', error);
      }
    }
    
    try {
      const indicesToFetch = Object.keys(indexInfo).filter(key => key !== symbol);
      
      // Create default values for all indices
      const defaultIndexData: Record<string, IndexData> = {};
      indicesToFetch.forEach(key => {
        // Set appropriate default prices based on the index
        const defaultPrice = key === 'sp500' ? 5400 : 
                             key === 'nasdaq' ? 19000 : 
                             key === 'dow-jones' ? 42500 : 
                             key === 'russell2000' ? 2100 : 1000;
                             
        defaultIndexData[key] = {
          price: defaultPrice,
          change: defaultPrice * 0.001, // Positive by default (~0.1%)
          changePercent: 0.1
        };
      });
      
      const results = await Promise.all(
        indicesToFetch.map(indexKey => 
          fetch(`/api/us-markets/${indexKey}?timeRange=1D`)
            .then(res => {
              if (!res.ok) throw new Error(`HTTP error ${res.status}`);
              return res.json();
            })
            .then(data => ({ indexKey, data, success: true } as SuccessfulApiResult))
            .catch(err => ({ indexKey, error: err as Error, success: false } as FailedApiResult))
        )
      );
      
      // Start with defaults and update with successful results
      const indexData: Record<string, IndexData> = {...defaultIndexData};
      
      results.forEach((result: ApiResult) => {
        if (result.success && result.data && result.data.success && result.data.data?.currentStats) {
          indexData[result.indexKey] = {
            price: result.data.data.currentStats.price || defaultIndexData[result.indexKey].price,
            change: result.data.data.currentStats.change || defaultIndexData[result.indexKey].change,
            changePercent: result.data.data.currentStats.changePercent || defaultIndexData[result.indexKey].changePercent
          };
        } else {
          console.warn(`Failed to get valid data for ${result.indexKey}, using default values`);
        }
      });
      
      setOtherIndices(indexData);
      
      localStorage.setItem(OTHER_INDICES_CACHE_KEY, JSON.stringify({
        otherIndices: indexData,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching other indices data:', error);
      // Try to use any cached data even if expired
      const staleCachedData = localStorage.getItem(OTHER_INDICES_CACHE_KEY);
      if (staleCachedData) {
        try {
          const parsedStaleCache = JSON.parse(staleCachedData);
          setOtherIndices(parsedStaleCache.otherIndices || {});
          console.log('Using stale cached data as fallback');
        } catch (parseError) {
          console.error('Error parsing stale cached data:', parseError);
          
          // If all else fails, generate default data
          const emergencyData: Record<string, IndexData> = {};
          Object.keys(indexInfo).filter(key => key !== symbol).forEach(key => {
            const defaultPrice = key === 'sp500' ? 5400 : 
                                key === 'nasdaq' ? 19000 : 
                                key === 'dow-jones' ? 42500 : 
                                key === 'russell2000' ? 2100 : 1000;
            
            emergencyData[key] = {
              price: defaultPrice,
              change: defaultPrice * 0.001,
              changePercent: 0.1
            };
          });
          
          setOtherIndices(emergencyData);
        }
      }
    }
  }, [symbol, isDataCacheValid]);

  // Update all useEffects to use the optimized fetch functions
  useEffect(() => {
    if (!symbol) {
      console.log('No symbol provided, skipping data fetch');
      return;
    }

    console.log(`Setting up data fetching for ${symbol}`);
    
    // Clear any previous data to ensure we show loading state
    setHistoricalData([]);
    setCurrentStats({
      price: null,
      change: null,
      changePercent: null,
      weekChange: null,
      weekChangePercent: null,
      monthChange: null,
      monthChangePercent: null,
      yearToDateChange: null,
      yearToDatePercent: null,
      high52Week: null,
      low52Week: null,
      dailyHigh: null,
      dailyLow: null,
      volume: null
    });
    setTechnicalIndicators(null);
    setLoading(true);
    
    // Function to attempt data fetching with retries
    const fetchWithRetry = async (retryCount = 0, maxRetries = 3) => {
      try {
        await fetchData(retryCount > 0); // Force refresh on retry attempts
        console.log(`Data fetch for ${symbol} successful`);
      } catch (error) {
        console.error(`Fetch attempt ${retryCount + 1} failed for ${symbol}:`, error);
        if (retryCount < maxRetries) {
          console.log(`Retrying fetch for ${symbol} (attempt ${retryCount + 2}/${maxRetries + 1})`);
          setTimeout(() => fetchWithRetry(retryCount + 1, maxRetries), 2000);
        } else {
          console.error(`All retry attempts failed for ${symbol}`);
          setLoading(false);
          setError(`Failed to load ${index?.name || symbol} data after multiple attempts. Please try again later.`);
        }
      }
    };
    
    // Start the fetch process
    fetchWithRetry();
    
    // Set up regular refresh
    const interval = setInterval(() => {
      console.log(`Running scheduled data refresh for ${symbol}`);
      fetchData(true); // Force refresh every interval
    }, 5 * 60 * 1000); // Every 5 minutes
    
    return () => {
      console.log(`Cleaning up data fetching for ${symbol}`);
      clearInterval(interval);
    };
  }, [fetchData, symbol, index?.name]);

  useEffect(() => {
    fetchYtdData();
    // YTD doesn't change frequently, no need for interval
  }, [fetchYtdData]);

  useEffect(() => {
    fetchOtherIndices();
    const interval = setInterval(fetchOtherIndices, 5 * 60 * 1000);
    
      return () => clearInterval(interval);
  }, [fetchOtherIndices]);

  // Format large numbers with abbreviations
  const formatLargeNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toString();
  };

  const isPositive = currentStats.change !== null ? currentStats.change >= 0 : false;

  if (!index) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Head>
        <title>{index.name} Live Chart | US Markets</title>
        <meta name="description" content={`Live chart and data for ${index.name}. Track performance, technical indicators, and market trends.`} />
      </Head>

      <main className="container mx-auto px-0 sm:px-6 py-4 sm:py-12 w-full">
        <header className="mb-4 sm:mb-8 flex items-center gap-2 px-2 sm:px-0">
          <button
            onClick={() => router.push('/us-markets')}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Back to US Markets"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center">
            {index?.name || 'Market Index'}
          </h1>
        </header>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-400">{error}</p>
              <button
                onClick={() => router.push('/us-markets')}
              className="mt-2 text-sm font-medium text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 cursor-pointer"
              >
              Return to US Markets
              </button>
            </div>
        ) : loading ? (
          <div className="space-y-4 px-2 sm:px-0 w-full">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 sm:p-6 w-full">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
                <ChartSkeleton />
                </div>
                
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
                  </div>
                  </div>
                </div>
        ) : (
          <div className="space-y-6 px-0 sm:px-0 w-full">
            {/* Price Overview */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 sm:p-6 w-full" aria-labelledby="price-overview">
              <h2 id="price-overview" className="text-xl font-bold text-gray-800 dark:text-white mb-4 px-2 sm:px-0">
                Price Overview
                </h2>
                
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 lg:gap-6 w-full">
                <div className="lg:col-span-1 w-full">
                  {/* Replace chart section with the new isolated component */}
                  {(historicalData.length > 0 || currentStats.price !== null) && (
                    <IndexChartContainer
                      symbol={symbol}
                      initialData={historicalData.length > 0 ? historicalData : [
                        {
                          date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                          value: currentStats.price || 0
                        },
                        {
                          date: new Date().toISOString(),
                          value: currentStats.price || 0
                        }
                      ]}
                      initialTimeRange={timeRange}
                      calculateIndicators={calculateIndicators}
                    />
                  )}
              </div>
            </div>
            </section>

            {/* Other US Markets Quick View */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <div className="flex flex-wrap justify-between gap-4">
                {Object.entries(indexInfo)
                  .filter(([key]) => key !== symbol)
                  .slice(0, 3)
                  .map(([key, info]) => {
                    const indexData = otherIndices[key];
                    const isPositiveChange = indexData && indexData.change >= 0;
                    
                    return (
                      <div 
                        key={key}
                        className="flex-1 min-w-[220px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                        onClick={() => router.push(`/us-markets/${key}`)}
                      >
                        <div className="flex items-center">
                          <div 
                            className={`w-2 h-2 rounded-full mr-2 ${
                              key === 'sp500' ? 'bg-green-600' : 
                              key === 'nasdaq' ? 'bg-blue-600' : 
                              key === 'dow-jones' ? 'bg-red-600' : 
                              key === 'russell2000' ? 'bg-purple-600' : 'bg-gray-600'
                            }`}
                          ></div>
                          <span className="font-medium text-gray-900 dark:text-white">{info.name}</span>
                        </div>
                        {indexData ? (
                          <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-lg font-bold tabular-nums">
                              {indexData.price.toLocaleString(undefined, { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                              })}
                            </span>
                            <div className={`flex items-center ${
                              isPositiveChange ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {isPositiveChange ? (
                                <ArrowUpIcon className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDownIcon className="h-3 w-3 mr-1" />
                              )}
                              <span className="text-sm">
                                {isPositiveChange ? '+' : ''}
                                {indexData.change.toFixed(2)} 
                                ({isPositiveChange ? '+' : ''}
                                {indexData.changePercent.toFixed(2)}%)
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-1 flex items-center justify-between">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            </div> 
              )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Price range indicators - displayed side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* 52-Week Range */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                52-Week Range
              </h2>
              <PriceGauge 
                currentPrice={currentStats.price} 
                lowPrice={currentStats.low52Week}
                highPrice={currentStats.high52Week}
              />
              </div>

              {/* Day Range */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Day Range
                </h2>
                <PriceGauge 
                  currentPrice={currentStats.price} 
                  lowPrice={currentStats.dailyLow}
                  highPrice={currentStats.dailyHigh}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Market Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Market Stats
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Previous Close */}
                  <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Previous Close</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {currentStats.price && currentStats.change 
                        ? (currentStats.price - currentStats.change).toLocaleString(undefined, { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          }) 
                        : '-'}
                    </p>
                  </div>
                  
                  {/* Day Range */}
                  <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Day Range</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {currentStats.dailyLow && currentStats.dailyHigh 
                        ? `${currentStats.dailyLow.toLocaleString(undefined, { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })} - ${currentStats.dailyHigh.toLocaleString(undefined, { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}` 
                        : '-'}
                    </p>
                </div>
                
                  {/* 52 Week Range */}
                  <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">52 Week Range</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {currentStats.low52Week && currentStats.high52Week 
                        ? `${currentStats.low52Week.toLocaleString(undefined, { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })} - ${currentStats.high52Week.toLocaleString(undefined, { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}` 
                        : '-'}
                    </p>
                    </div>
                  
                  {/* Volume */}
                  <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {currentStats.volume ? formatLargeNumber(currentStats.volume) : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional future feature can be added here */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Index Performance
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Daily Change</p>
                    <p className={`text-xl font-bold ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                      {currentStats.changePercent ? `${isPositive ? '+' : ''}${currentStats.changePercent.toFixed(2)}%` : '-'}
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">YTD Change</p>
                    <p className={`text-xl font-bold ${ytdStats.yearToDatePercent && ytdStats.yearToDatePercent > 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                      {ytdStats.yearToDatePercent ? `${ytdStats.yearToDatePercent > 0 ? '+' : ''}${ytdStats.yearToDatePercent.toFixed(2)}%` : '-'}
                    </p>
                        </div>
                          </div>
              </div>
            </div>

          {/* Technical Indicators Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Technical Indicators
              </h2>
              
              {loading ? (
                <div className="animate-pulse grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              ) : (
                <>
                  {technicalIndicators ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Moving Averages */}
                    <TechnicalIndicatorCard
                      title="50-Day MA"
                      value={technicalIndicators.ma50}
                      description="Medium-term trend indicator"
                    />
                    <TechnicalIndicatorCard
                      title="200-Day MA"
                      value={technicalIndicators.ma200}
                      description="Long-term trend indicator"
                    />
                    <TechnicalIndicatorCard
                      title="20-Day EMA"
                      value={technicalIndicators.ema20}
                      description="Short-term trend with more weight on recent prices"
                    />

                  {/* Momentum Indicators */}
                    <TechnicalIndicatorCard
                      title="RSI (14)"
                      value={technicalIndicators.rsi}
                      description="Overbought (>70) or Oversold (<30)"
                    />

                  {/* Volatility Indicators */}
                    <TechnicalIndicatorCard
                      title="Bollinger Upper"
                      value={technicalIndicators.bollingerUpper}
                      description="Upper band (2 std dev)"
                    />
                    <TechnicalIndicatorCard
                      title="Bollinger Lower"
                      value={technicalIndicators.bollingerLower}
                      description="Lower band (2 std dev)"
                    />

                  {/* Trend Indicators */}
                    <TechnicalIndicatorCard
                      title="MACD"
                      value={technicalIndicators.macdLine}
                      description="Moving Average Convergence Divergence"
                    />
                    <TechnicalIndicatorCard
                        title="MACD Signal"
                      value={technicalIndicators.signalLine}
                      description="9-day EMA of MACD"
                    />
                  </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      Technical indicators not available for the selected time range
                    </p>
                  )}
                </>
              )}
            </div>

          {/* Market Movers Section */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Market Movers</h2>
              <MarketMovers index={symbol === 'sp500' ? 'sp500' : 'dow-jones'} />
            </div>

            {/* SEO-Friendly Index Information */}
            <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                {index?.name || 'Market Index'} Overview
              </h2>
              
              {symbol === 'sp500' && (
                <div className="text-gray-700 dark:text-gray-300 space-y-4">
                  <p>The S&P 500 (Standard & Poor&apos;s 500) is one of the most widely followed equity indices in the world, measuring the stock performance of 500 large companies listed on stock exchanges in the United States. It covers approximately 80% of available U.S. market capitalization, making it an excellent indicator of the overall U.S. stock market and economy.</p>
                  
                  <p>Created in 1957, the S&P 500 is a market-capitalization-weighted index, meaning that companies with larger market values have a greater impact on the index&apos;s movements. This differs from the Dow Jones Industrial Average, which is price-weighted. The S&P 500 is maintained by S&P Dow Jones Indices, a joint venture majority-owned by S&P Global.</p>
                  
                  <p>For investors, the S&P 500 serves as a crucial benchmark for portfolio performance and a key barometer of U.S. economic health. Many index funds and ETFs track the S&P 500, allowing investors to gain exposure to a diverse range of large American companies across all 11 market sectors: Communication Services, Consumer Discretionary, Consumer Staples, Energy, Financials, Health Care, Industrials, Information Technology, Materials, Real Estate, and Utilities.</p>
                  
                  <p>Companies must meet specific criteria to be included in the S&P 500, including market capitalization requirements, financial viability standards, and sufficient public float. The index is rebalanced quarterly, with additions and removals reflecting changes in company performance and market conditions.</p>
                </div>
              )}
              
              {symbol === 'nasdaq' && (
                <div className="text-gray-700 dark:text-gray-300 space-y-4">
                  <p>The NASDAQ Composite is a stock market index that includes nearly all companies listed on the Nasdaq stock exchange. Launched in 1971, it has become synonymous with technology and innovation, as it contains many of the world&apos;s largest technology companies and is heavily weighted toward the tech sector.</p>
                  
                  <p>Unlike the S&P 500 or Dow Jones Industrial Average, which are selective in their component stocks, the NASDAQ Composite includes over 3,000 companies. It is a market-capitalization-weighted index, meaning larger companies have a greater influence on its performance.</p>
                  
                  <p>The NASDAQ Composite is widely regarded as a key indicator of the technology sector&apos;s health and has historically been more volatile than broader market indices due to its tech concentration. Companies across various tech segments are represented, including software, semiconductors, telecommunications, biotechnology, and internet services.</p>
                  
                  <p>For investors, the NASDAQ Composite provides insights into growth-oriented sectors and emerging technologies. Its performance often reflects trends in innovation, digital transformation, and technological disruption across the global economy. Many investors use NASDAQ-tracking index funds or ETFs to gain exposure to the growth potential of the technology sector.</p>
                </div>
              )}
              
              {symbol === 'dow-jones' && (
                <div className="text-gray-700 dark:text-gray-300 space-y-4">
                  <p>The Dow Jones Industrial Average (DJIA), often referred to simply as &quot;the Dow,&quot; is one of the oldest and most recognizable stock market indices in the world. Created in 1896 by Charles Dow, it originally tracked just 12 industrial companies but has evolved to include 30 large, established American companies that represent diverse sectors of the U.S. economy.</p>
                  
                  <p>Unlike many other indices, the Dow is price-weighted rather than market-capitalization-weighted, meaning that higher-priced stocks have a greater influence on the index regardless of their total market value. The index is maintained by S&P Dow Jones Indices, a joint venture majority-owned by S&P Global.</p>
                  
                  <p>Despite tracking only 30 companies, the Dow serves as a significant barometer for the U.S. stock market and broader economy due to the size and importance of its components. These &quot;blue-chip&quot; companies are typically household names with strong financial foundations and long histories of stable performance.</p>
                  
                  <p>The composition of the Dow changes over time to reflect the evolving nature of the U.S. economy. When originally created, it mainly consisted of industrial companies, but today it includes representatives from sectors such as technology, healthcare, financial services, and consumer goods. Changes to the index components are made by the Dow Jones Index Committee based on factors like company reputation, growth history, and sector representation.</p>
                </div>
              )}
              
              {symbol === 'russell2000' && (
                <div className="text-gray-700 dark:text-gray-300 space-y-4">
                  <p>The Russell 2000 Index is a small-cap stock market index that measures the performance of approximately 2,000 smallest companies in the Russell 3000 Index. Created in 1984 by the Frank Russell Company, it represents about 10% of the total market capitalization of the Russell 3000 Index.</p>
                  
                  <p>As a market-capitalization-weighted index focusing on smaller U.S. companies, the Russell 2000 provides investors with insight into a different segment of the market than large-cap indices like the S&P 500 or Dow Jones Industrial Average. Small-cap stocks often behave differently than large-cap stocks, potentially offering different risk and return characteristics.</p>
                  
                  <p>The Russell 2000 is widely regarded as a key benchmark for small-cap investment performance. Many investors and fund managers use it to gauge the health of smaller businesses in the U.S. economy. Small-cap companies are typically more sensitive to domestic economic conditions and may respond differently to economic cycles than larger multinational corporations.</p>
                  
                  <p>The index is reconstituted annually to ensure it accurately represents the small-cap segment of the U.S. equity market. As companies grow, they may graduate from the Russell 2000 to the Russell 1000 (which tracks larger companies), while others may be added to the index as they meet the criteria for inclusion.</p>
                </div>
              )}
            </div>
          </div>
        )}
        </main>
      </div>
  );
} 