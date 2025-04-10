'use client';

import { useState, useEffect, useCallback } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { useParams } from 'next/navigation';
import MarketMovers from '@/components/MarketMovers';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import Head from 'next/head';

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
  },
  'dollar-index': {
    name: 'US Dollar Index',
    symbol: 'DX-Y.NYB',
    description: 'The US Dollar Index measures the value of the USD against a basket of major world currencies.',
    color: '#00796B'
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

export default function IndexDetail() {
  const router = useRouter();
  const params = useParams();
  const symbol = Array.isArray(params.symbol) ? params.symbol[0] : params.symbol || '';
  const index = indexInfo[symbol as keyof typeof indexInfo];
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRangeType>('1D');
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
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [marketBreadth, setMarketBreadth] = useState({
    advancing: 0,
    declining: 0,
    unchanged: 0,
    total: 0
  });

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
    const volumes = data.map(d => d.volume || 0);

    // Calculate Moving Averages
    const ma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / Math.min(50, length);
    const ma100 = prices.slice(-100).reduce((a, b) => a + b, 0) / Math.min(100, length);
    const ma200 = prices.slice(-200).reduce((a, b) => a + b, 0) / Math.min(200, length);

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
    const avgGain = gains.length ? gains.reduce((a, b) => a + b, 0) / 14 : 0;
    const avgLoss = losses.length ? losses.reduce((a, b) => a + b, 0) / 14 : 0;
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

  // Memoize the fetchData function with useCallback
  const fetchData = useCallback(async () => {
    if (!symbol) return;
    
      try {
        setLoading(true);
        setError(null);
        const loadingToast = toast.loading('Fetching market data...', {
          position: 'top-right',
        });
      
      // Fetch both market data and market breadth data in parallel
      const [marketDataResponse, marketBreadthResponse] = await Promise.all([
        fetch(`/api/us-markets/${symbol}?timeRange=${timeRange}`),
        fetch(`/api/market-breadth/${symbol.replace('dow-jones', 'dow').replace('sp500', 'sp')}`)
      ]);
      
      const marketDataResult = await marketDataResponse.json();
      
      if (!marketDataResult.success) {
        throw new Error(marketDataResult.error || 'Failed to fetch market data');
      }

      const { historicalData, currentStats, lastUpdated } = marketDataResult.data;
        setHistoricalData(historicalData);
        setCurrentStats(currentStats);
        setLastUpdated(lastUpdated);
      
      // Process market breadth data if available
      if (marketBreadthResponse.ok) {
        const breadthData = await marketBreadthResponse.json();
        if (breadthData.success && breadthData.data) {
          setMarketBreadth(breadthData.data);
        }
      }
        
        // Calculate technical indicators after setting historical data
        const indicators = calculateIndicators(historicalData);
        setTechnicalIndicators(indicators);

        toast.success('Market data updated', {
          id: loadingToast,
          duration: 2000,
        });
      } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load market data. Please try again later.');
      toast.error('Failed to load market data. Please try again later.', {
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
  }, [symbol, timeRange, calculateIndicators]); // Only include dependencies that are used in the function

  useEffect(() => {
    if (!symbol) return;

      fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
      return () => clearInterval(interval);
  }, [fetchData, symbol]); // Add symbol to dependency array

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

  // Format date for chart tooltip
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isPositive = currentStats.change !== null ? currentStats.change >= 0 : false;
  const chartColor = getChartColor(historicalData);

  if (!index) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 bg-white">
      <Head>
        <title>{index.name} Live Chart | US Markets</title>
        <meta name="description" content={`Live chart and data for ${index.name}. Track performance, technical indicators, and market trends.`} />
      </Head>

      <main className="container mx-auto px-4 max-w-8xl">
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        ) : (
          <>
            {/* Breadcrumb Navigation */}
            <div className="mb-6">
              <button
                onClick={() => router.push('/us-markets')}
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                <span className="cursor-pointer">Back to US Markets</span>
              </button>
            </div>

            {/* Header with name and price info */}
            <div className="mb-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              {index.name}
                    <span className="ml-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-1 px-2 rounded">
                      {index.symbol}
                    </span>
            </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-3xl">
              {index.description}
            </p>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                      {currentStats.price !== null ? currentStats.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }) : 'Loading...'}
                    </p>
                    
                    {currentStats.change !== null && (
                      <div className={`ml-3 flex items-center ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                        {isPositive ? (
                          <ArrowUpIcon className="h-5 w-5 mr-1" />
                        ) : (
                          <ArrowDownIcon className="h-5 w-5 mr-1" />
                        )}
                        <span className="font-medium tabular-nums">
                          {isPositive ? '+' : ''}{currentStats.change.toFixed(2)} ({isPositive ? '+' : ''}{currentStats.changePercent?.toFixed(2)}%)
                        </span>
                  </div>
                )}
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    As on {lastUpdated || 'Loading...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Chart section with time interval selectors */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {index.name} Graph
                </h2>
                
                <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {['1D', '1W', '1M', '3M', '6M', '1Y'].map((range) => (
                  <button
                    key={range}
                    className={`px-2 py-1 text-sm rounded-md cursor-pointer ${timeRange === range 
                      ? 'bg-white dark:bg-gray-600 shadow-sm font-medium' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    onClick={() => setTimeRange(range as TimeRangeType)}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
              
              {loading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="animate-spin h-10 w-10 border-4 border-gray-300 dark:border-gray-600 rounded-full border-t-blue-600"></div>
                </div>
              ) : (
                <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart 
                  data={historicalData} 
                      margin={{ top: 15, right: 65, left: 20, bottom: 5 }}
                >
                  <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartColor.fill} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={chartColor.fill} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="date" 
                        scale="auto"
                        tickFormatter={(date) => {
                          const d = new Date(date);
                          return timeRange === '1D' 
                            ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
                        }}
                        minTickGap={30}
                  />
                  <YAxis 
                        domain={['auto', 'auto']}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                        formatter={(value: number) => [value.toLocaleString(undefined, { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                        }), 'Price']}
                        labelFormatter={formatDate}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '6px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                          border: 'none'
                        }}
                      />
                      
                  <Area
                    type="monotone"
                    dataKey="value"
                        stroke={chartColor.stroke} 
                        strokeWidth={2}
                    fillOpacity={1}
                        fill="url(#colorGradient)" 
                      />
                      
                      {/* Reference line for current price */}
                      {currentStats.price && (
                        <ReferenceLine 
                          y={currentStats.price} 
                          stroke="#888888" 
                        strokeDasharray="3 3"
                          label={{ 
                            value: `${currentStats.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}`, 
                            position: 'right',
                            fill: '#555555',
                            fontSize: 12,
                          }}
                        />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div> 
              )}
            </div>

            {/* Price range indicator */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                52-Week Range
              </h2>
              <PriceGauge 
                currentPrice={currentStats.price} 
                lowPrice={currentStats.low52Week}
                highPrice={currentStats.high52Week}
              />
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
                  
                  {/* YTD Change % */}
                  <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">YTD Change</p>
                    <p className={`text-base font-medium ${
                      currentStats.yearToDatePercent && currentStats.yearToDatePercent > 0 
                        ? 'text-green-600 dark:text-green-500' 
                        : currentStats.yearToDatePercent && currentStats.yearToDatePercent < 0 
                          ? 'text-red-600 dark:text-red-500' 
                          : 'text-gray-900 dark:text-white'
                    }`}>
                      {currentStats.yearToDatePercent 
                        ? `${currentStats.yearToDatePercent > 0 ? '+' : ''}${currentStats.yearToDatePercent.toFixed(2)}%` 
                        : '-'}
                    </p>
                </div>

                  {/* 1 Month Change % */}
                  <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">1 Month Change</p>
                    <p className={`text-base font-medium ${
                      currentStats.monthChangePercent && currentStats.monthChangePercent > 0 
                        ? 'text-green-600 dark:text-green-500' 
                        : currentStats.monthChangePercent && currentStats.monthChangePercent < 0 
                          ? 'text-red-600 dark:text-red-500' 
                          : 'text-gray-900 dark:text-white'
                    }`}>
                      {currentStats.monthChangePercent 
                        ? `${currentStats.monthChangePercent > 0 ? '+' : ''}${currentStats.monthChangePercent.toFixed(2)}%` 
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Advance/Decline Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Advance / Decline
                </h2>
                
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ) : (
                  <div>
                    {marketBreadth.total > 0 ? (
                      <>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-green-400" 
                            style={{ width: `${(marketBreadth.advancing / marketBreadth.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2">
                          <div className="text-green-600 dark:text-green-500">
                            <div className="text-xl font-bold">{marketBreadth.advancing}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Advancing</div>
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            <div className="text-xl font-bold text-center">{marketBreadth.unchanged}</div>
                            <div className="text-xs">Unchanged</div>
                          </div>
                          <div className="text-red-600 dark:text-red-500">
                            <div className="text-xl font-bold text-right">{marketBreadth.declining}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Declining</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        <p>Market breadth data not available</p>
                      </div>
                    )}
                  </div>
                )}
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
          </>
        )}
        </main>
      </div>
  );
} 