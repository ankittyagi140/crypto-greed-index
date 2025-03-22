'use client';

import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useParams } from 'next/navigation';
import MarketMovers from '@/components/MarketMovers';
import Script from 'next/script';


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

export default function IndexDetail() {
  const params = useParams();
  const symbol = params?.symbol as string;
  const index = indexInfo[symbol as keyof typeof indexInfo];

  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  const [currentStats, setCurrentStats] = useState({
    price: null as number | null,
    change: null as number | null,
    changePercent: null as number | null,
    yearToDateChange: null as number | null,
    yearToDatePercent: null as number | null,
    high52Week: null as number | null,
    low52Week: null as number | null,
    volume: null as number | null
  });
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicators | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

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
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/us-markets/${symbol}`);
        if (!response.ok) {
          throw new Error('Failed to fetch market data');
        }
        const data = await response.json();
        
        if (isMounted) {
          setHistoricalData(data.historicalData);
          setCurrentStats(data.currentStats);
          setTechnicalIndicators(calculateIndicators(data.historicalData));
          setLastUpdated(new Date().toLocaleTimeString());
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [symbol, calculateIndicators]);

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

  if (loading || !index) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <main className="container mx-auto px-4 py-8" aria-busy="true">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto"></div>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </main>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
          {/* Header Section */}
          <header className="text-center mb-8 sm:mb-12">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <article className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h2 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400">Current Price</h2>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  ${currentStats?.price?.toLocaleString() ?? 'Loading...'}
                </div>
                {currentStats.change !== null && currentStats.changePercent !== null && (
                  <div className={`flex items-center text-base sm:text-lg mt-1 ${currentStats.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <span>{currentStats.change >= 0 ? '+' : ''}{currentStats.change.toFixed(2)}</span>
                    <span className="ml-2">({currentStats.changePercent.toFixed(2)}%)</span>
                  </div>
                )}
              </article>
              <article className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h2 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400">Year to Date</h2>
                {currentStats.yearToDateChange !== null && currentStats.yearToDatePercent !== null && (
                  <div className={`text-xl sm:text-2xl font-bold mt-2 ${currentStats.yearToDateChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {currentStats.yearToDateChange >= 0 ? '+' : ''}{currentStats.yearToDatePercent.toFixed(2)}%
                  </div>
                )}
              </article>
              <article className="lg:col-span-2 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h2 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400">52 Week Range</h2>
                <PriceGauge
                  currentPrice={currentStats.price}
                  lowPrice={currentStats.low52Week}
                  highPrice={currentStats.high52Week}
                />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Volume</div>
                    <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      {currentStats.volume ? `${(currentStats.volume / 1000000).toFixed(1)}M` : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Volatility</div>
                    <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      {technicalIndicators?.atr ? `${technicalIndicators.atr.toFixed(2)}` : 'N/A'}
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* Chart Section */}
          <section aria-label="Historical Performance" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">Historical Performance</h2>
            <div className="h-64 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval="preserveEnd"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    width={60}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="Price" stroke={index.color} strokeWidth={2} dot={false} />
                  {technicalIndicators && (
                    <>
                      <Line type="monotone" dataKey="ma50" name="50 MA" stroke="#8884d8" dot={false} strokeWidth={1} />
                      <Line type="monotone" dataKey="ma200" name="200 MA" stroke="#82ca9d" dot={false} strokeWidth={1} />
                      <Line type="monotone" dataKey="ema20" name="20 EMA" stroke="#ffc658" dot={false} strokeWidth={1} />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

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