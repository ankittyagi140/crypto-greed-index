'use client';

import { useState, useEffect, useCallback } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { useParams } from 'next/navigation';
import MarketMovers from '@/components/MarketMovers';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const indexInfo = {
  'sp500': {
    name: 'S&P 500',
    symbol: 'sp500',
    description: 'The Standard and Poor\'s 500 tracks the performance of 500 large US companies.',
    color: '#2E7D32'
  },
  'nasdaq': {
    name: 'NASDAQ',
    symbol: 'nasdaq',
    description: 'The Nasdaq Composite includes all stocks listed on the Nasdaq stock market.',
    color: '#1976D2'
  },
  'dow-jones': {
    name: 'Dow Jones Industrial Average',
    symbol: 'dow-jones',
    description: 'The Dow Jones Industrial Average tracks 30 large US companies.',
    color: '#D32F2F'
  },
  'russell2000': {
    name: 'Russell 2000',
    symbol: 'russell2000',
    description: 'The Russell 2000 tracks 2,000 small-cap US companies.',
    color: '#7B1FA2'
  },
  'dollar-index': {
    name: 'US Dollar Index',
    symbol: 'dollar-index',
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

export default function IndexDetail() {
  const params = useParams();
  const symbol = params?.symbol as string;
  const index = indexInfo[symbol as keyof typeof indexInfo];
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y'>('1Y');
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
  const router = useRouter();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadingToast = toast.loading('Fetching market data...', {
          position: 'top-right',
        });
        const response = await fetch(`/api/us-markets/${symbol}?timeRange=${timeRange}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch market data');
        }

        const { historicalData, currentStats, lastUpdated } = result.data;
        setHistoricalData(historicalData);
        setCurrentStats(currentStats);
        setLastUpdated(lastUpdated);
        
        // Calculate technical indicators after setting historical data
        const indicators = calculateIndicators(historicalData);
        setTechnicalIndicators(indicators);

        toast.success('Market data updated', {
          id: loadingToast,
          duration: 2000,
        });
      } catch (err) {
        console.error('Error fetching market data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch market data';
        setError(errorMessage);
        toast.error(errorMessage, {
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchData();
      // Set up interval for periodic updates
      const interval = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes
      return () => clearInterval(interval);
    }
  }, [symbol, calculateIndicators, timeRange]);

  const TechnicalIndicatorCard = ({ title, value, description }: { title: string; value: number | null; description?: string }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
      <div className="mt-1">
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          {value ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'}
        </span>
      </div>
      {description && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
  );

  // Generate structured data for SEO
  const generateStructuredData = () => {
    if (!currentStats || !currentStats.price || !index) return null;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FinancialProduct',
      name: index.name,
      description: index.description,
      url: typeof window !== 'undefined' ? window.location.href : '',
      dateModified: new Date().toISOString(),
      price: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: currentStats.price
      },
      additionalProperty: [] as Array<{
        '@type': string;
        name: string;
        value: number | null;
      }>
    };

    // Only add properties that have values
    if (currentStats.change !== null) {
      structuredData.additionalProperty.push({
        '@type': 'PropertyValue',
        name: 'Change',
        value: currentStats.change
      });
    }

    if (currentStats.changePercent !== null) {
      structuredData.additionalProperty.push({
        '@type': 'PropertyValue',
        name: 'Change Percentage',
        value: currentStats.changePercent
      });
    }

    if (currentStats.high52Week !== null) {
      structuredData.additionalProperty.push({
        '@type': 'PropertyValue',
        name: '52 Week High',
        value: currentStats.high52Week
      });
    }

    if (currentStats.low52Week !== null) {
      structuredData.additionalProperty.push({
        '@type': 'PropertyValue',
        name: '52 Week Low',
        value: currentStats.low52Week
      });
    }

    if (currentStats.volume !== null) {
      structuredData.additionalProperty.push({
        '@type': 'PropertyValue',
        name: 'Trading Volume',
        value: currentStats.volume
      });
    }

    return structuredData;
  };


  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Market Data</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!index) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Invalid Market Index</h2>
          <p className="text-gray-600 dark:text-gray-400">The requested market index does not exist.</p>
        </div>
      </div>
    );
  }

  const structuredData = generateStructuredData();

  return (
    <>
      {structuredData && (
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify(structuredData)}
        </Script>
      )}
      <div className="min-h-screen">
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-8xl">
          {/* Header Section */}
          <header className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-start mb-4">
              <button
                onClick={() => router.push('/us-markets')}
                className="flex justify-start text-gray-600 dark:text-gray-400 hover:text-[#048f04] dark:hover:text-white transition-colors cursor-pointer"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to US Markets
              </button>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
              {index.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-3xl mx-auto px-4">
              {index.description}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {lastUpdated}
            </p>
          </header>

          {/* Current Stats Section */}
          <section aria-label="Current Statistics" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${currentStats.price?.toLocaleString()}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Change</h3>
                <p className={`text-2xl font-bold ${currentStats.change && currentStats.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentStats.change && currentStats.change >= 0 ? '+' : ''}{currentStats.change?.toLocaleString()}
                  <span className="text-sm ml-1">
                    ({currentStats.changePercent?.toFixed(2)}%)
                  </span>
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">7-Day Change</h3>
                <p className={`text-2xl font-bold ${currentStats.weekChange && currentStats.weekChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentStats.weekChange && currentStats.weekChange >= 0 ? '+' : ''}{currentStats.weekChange?.toLocaleString()}
                  <span className="text-sm ml-1">
                    ({currentStats.weekChangePercent?.toFixed(2)}%)
                  </span>
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">1-Month Change</h3>
                <p className={`text-2xl font-bold ${currentStats.monthChange && currentStats.monthChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentStats.monthChange && currentStats.monthChange >= 0 ? '+' : ''}{currentStats.monthChange?.toLocaleString()}
                  <span className="text-sm ml-1">
                    ({currentStats.monthChangePercent?.toFixed(2)}%)
                  </span>
                </p>
              </div>
            </div>

            {/* Daily Range Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-8">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Daily Range</h3>
              <PriceGauge 
                currentPrice={currentStats.price}
                lowPrice={currentStats.dailyLow}
                highPrice={currentStats.dailyHigh}
              />
            </div>

            {/* 52-Week Range Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-8">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">52-Week Range</h3>
              <PriceGauge 
                currentPrice={currentStats.price}
                lowPrice={currentStats.low52Week}
                highPrice={currentStats.high52Week}
              />
            </div>
          </section>

          {/* Chart Section */}
          <section aria-label="Historical Performance" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">Historical Performance</h2>
              <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                {(['1D', '1W', '1M', '3M', '6M', '1Y'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                      timeRange === range
                        ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            {!loading ?
            <div className="h-[400px] sm:h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart 
                  data={historicalData} 
                  margin={{ top: 20, right: 30, left: 10, bottom: 50 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop 
                        offset="5%" 
                        stopColor={getChartColor(historicalData).fill} 
                        stopOpacity={0.2}
                      />
                      <stop 
                        offset="95%" 
                        stopColor={getChartColor(historicalData).fill} 
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e5e7eb" 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="date" 
                    tick={{ 
                      fill: '#6b7280', 
                      fontSize: 12 
                    }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    interval="preserveEnd"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis 
                    tick={{ 
                      fill: '#6b7280', 
                      fontSize: 12 
                    }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    width={65}
                    tickFormatter={(value) => value.toLocaleString()}
                    domain={['auto', 'auto']}
                    padding={{ top: 20, bottom: 20 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      padding: '12px'
                    }}
                    labelStyle={{
                      color: '#374151',
                      fontWeight: 600,
                      marginBottom: '4px'
                    }}
                    itemStyle={{
                      color: '#6b7280',
                      fontSize: '12px',
                      padding: '2px 0'
                    }}
                    formatter={(value: number) => [
                      `$${value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}`,
                      ''
                    ]}
                  />
                  <Legend 
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                      paddingBottom: '20px'
                    }}
                  />
                  
                  {/* High and Low Reference Lines */}
                  {currentStats.high52Week && (
                    <ReferenceLine
                      y={currentStats.high52Week}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                      label={{
                        value: `52W High ($${currentStats.high52Week.toLocaleString()})`,
                        position: 'right',
                        fill: '#ef4444',
                        fontSize: 11,
                        fontWeight: 500
                      }}
                    />
                  )}
                  {currentStats.low52Week && (
                    <ReferenceLine
                      y={currentStats.low52Week}
                      stroke="#22c55e"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                      label={{
                        value: `52W Low ($${currentStats.low52Week.toLocaleString()})`,
                        position: 'right',
                        fill: '#22c55e',
                        fontSize: 11,
                        fontWeight: 500
                      }}
                    />
                  )}

                  {/* Shaded Area under the line */}
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="none"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />

                  {/* Price Line */}
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Price" 
                    stroke={getChartColor(historicalData).stroke}
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{
                      r: 6,
                      stroke: '#fff',
                      strokeWidth: 2
                    }}
                  />

                  {/* Moving Averages */}
                  {technicalIndicators && (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="ma50" 
                        name="50 MA" 
                        stroke="#8884d8" 
                        dot={false} 
                        strokeWidth={1}
                        strokeDasharray="3 3"
                        opacity={0.6}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="ma200" 
                        name="200 MA" 
                        stroke="#82ca9d" 
                        dot={false} 
                        strokeWidth={1}
                        strokeDasharray="3 3"
                        opacity={0.6}
                      />
                    </>
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div> 
            : 
            <div className="h-[400px] sm:h-[500px] relative">
              {/* Chart Skeleton */}
              <div className="absolute inset-0 flex flex-col">
                {/* Y-axis skeleton */}
                <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between py-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
                
                {/* Chart area skeleton */}
                <div className="flex-1 ml-16 mr-4">
                  {/* Chart line skeleton */}
                  <div className="h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                    <div className="absolute inset-0">
                      <div className="h-full w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>

                {/* X-axis skeleton */}
                <div className="h-16 ml-16 mr-4 mt-2 flex justify-between">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Legend skeleton */}
              <div className="absolute top-0 right-0 flex space-x-4 p-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mr-2"></div>
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          }
          </section>

          {/* Add this style to your global CSS or in a style tag */}
          <style jsx>{`
            @keyframes shimmer {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
            .animate-shimmer {
              animation: shimmer 2s infinite;
            }
          `}</style>

          {/* Technical Indicators Section */}
          <section aria-label="Technical Indicators" className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">Technical Indicators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {technicalIndicators && (
                <>
                  {/* Moving Averages */}
                  <div className="space-y-3 sm:space-y-4 bg-white dark:bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">Moving Averages</h3>
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
                  </div>

                  {/* Momentum Indicators */}
                  <div className="space-y-3 sm:space-y-4 bg-white dark:bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">Momentum</h3>
                    <TechnicalIndicatorCard
                      title="RSI (14)"
                      value={technicalIndicators.rsi}
                      description="Overbought (>70) or Oversold (<30)"
                    />
                    <TechnicalIndicatorCard
                      title="Stochastic %K"
                      value={technicalIndicators.stochasticK}
                      description="Fast stochastic indicator"
                    />
                    <TechnicalIndicatorCard
                      title="Stochastic %D"
                      value={technicalIndicators.stochasticD}
                      description="Slow stochastic indicator"
                    />
                  </div>

                  {/* Volatility Indicators */}
                  <div className="space-y-3 sm:space-y-4 bg-white dark:bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">Volatility</h3>
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
                    <TechnicalIndicatorCard
                      title="ATR (14)"
                      value={technicalIndicators.atr}
                      description="Average True Range - Volatility measure"
                    />
                  </div>

                  {/* Trend Indicators */}
                  <div className="space-y-3 sm:space-y-4 bg-white dark:bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">Trend</h3>
                    <TechnicalIndicatorCard
                      title="MACD"
                      value={technicalIndicators.macdLine}
                      description="Moving Average Convergence Divergence"
                    />
                    <TechnicalIndicatorCard
                      title="Signal Line"
                      value={technicalIndicators.signalLine}
                      description="9-day EMA of MACD"
                    />
                    <TechnicalIndicatorCard
                      title="OBV"
                      value={technicalIndicators.obv}
                      description="On Balance Volume"
                    />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Market Movers Section */}
          <section aria-label="Market Movers" className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">Market Movers</h2>
            <MarketMovers index={index.symbol} />
          </section>
        </main>
      </div>
    </>
  );
} 