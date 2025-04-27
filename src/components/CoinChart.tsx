'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TooltipItem,
  ChartOptions,
  ScriptableContext
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Available time periods - updated to match API requirements
const PERIODS = [
  { value: '24h', label: '24H' },
  { value: '1w', label: '1W' },
  { value: '1m', label: '1M' },
  { value: '3m', label: '3M' },
  { value: '6m', label: '6M' },
  { value: '1y', label: '1Y' },
  { value: 'all', label: 'All' },
];

interface CoinChartProps {
  coinId: string;
  period?: string;
}

interface ChartData {
  t: number[];
  c: number[];
}

const CoinChart: React.FC<CoinChartProps> = ({ coinId, period = '24h' }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const chartRef = useRef<ChartJS<'line'>>(null);
  
  // Helper function to generate mock chart data for demonstration
  const generateMockChartData = useCallback((period: string, endTime: number): ChartData => {
    const dataPoints = period === '24h' ? 24 : 
                      period === '1w' ? 7 : 
                      period === '1m' ? 30 : 
                      period === '3m' ? 90 : 
                      period === '6m' ? 180 : 
                      period === '1y' ? 365 : 100;
    
    const timeStep = period === '24h' ? 3600 : // 1 hour in seconds
                    period === '1w' ? 86400 : // 1 day in seconds
                    period === '1m' ? 86400 : // 1 day in seconds
                    period === '3m' ? 86400*3 : // 3 days in seconds
                    period === '6m' ? 86400*6 : // 6 days in seconds
                    period === '1y' ? 86400*7 : 86400; // 1 week in seconds
    
    // Set realistic starting prices based on coin ID
    let startPrice = 100;
    let volatility = 0.02; // Default 2% volatility
    let trend = 0.002; // Default slight upward trend
    
    // Match common coin IDs with their approximate prices
    switch(coinId.toLowerCase()) {
      case 'bitcoin':
        startPrice = 94000;
        volatility = 0.015;
        trend = 0.003;
        break;
      case 'ethereum':
        startPrice = 1800;
        volatility = 0.02;
        trend = 0.005;
        break;
      case 'tether':
      case 'usdc':
      case 'usd-coin':
        startPrice = 1;
        volatility = 0.0005; // Very low volatility for stablecoins
        trend = 0.0001;
        break;
      case 'binancecoin':
      case 'bnb':
        startPrice = 600;
        volatility = 0.018;
        break;
      case 'ripple':
      case 'xrp':
        startPrice = 2.18;
        volatility = 0.025;
        break;
      case 'solana':
        startPrice = 148;
        volatility = 0.03;
        trend = 0.006;
        break;
      default:
        startPrice = 100;
    }
    
    // For weekly data, create a more realistic pattern with weekend dips
    let pricePattern: number[] = [];
    if (period === '1w') {
      // Typical weekly pattern: up Monday-Tuesday, down Wednesday, up Thursday, down Friday-Sunday
      pricePattern = [0.005, 0.008, -0.003, 0.006, -0.002, -0.004, -0.001];
    }
    
    const timestamps: number[] = [];
    const prices: number[] = [];
    
    let currentPrice = startPrice;
    
    for (let i = 0; i < dataPoints; i++) {
      const timestamp = endTime - (dataPoints - i) * timeStep;
      timestamps.push(timestamp);
      
      // Apply pattern if available, otherwise random walk with trend
      if (period === '1w' && i < pricePattern.length) {
        currentPrice = currentPrice * (1 + pricePattern[i]);
      } else {
        const randomChange = (Math.random() * 2 - 1) * volatility;
        currentPrice = currentPrice * (1 + randomChange + trend);
      }
      
      // Ensure stablecoins stay very close to $1
      if (coinId.toLowerCase() === 'tether' || coinId.toLowerCase() === 'usdc' || coinId.toLowerCase() === 'usd-coin') {
        currentPrice = 0.99 + Math.random() * 0.02; // Random between $0.99 and $1.01
      }
      
      prices.push(currentPrice);
    }
    
    return {
      t: timestamps,
      c: prices
    };
  }, [coinId]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // CoinStats API key
        const COINSTATS_API_KEY = process.env.NEXT_PUBLIC_COINSTATS_API_KEY || 'BzGqUBQbt6Zmd/hI4E2iD2mloJWjj0Ub0ZBMbvh9IQY=';
        
        console.log(`Fetching chart data for ${coinId} with period ${selectedPeriod}`);
        
        // First try with CoinStats API
        const response = await fetch(
          `https://api.coinstats.app/public/v1/charts?period=${selectedPeriod}&coinId=${coinId}`,
          {
            headers: {
              'X-API-KEY': COINSTATS_API_KEY,
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        
        // Validate chart data before processing
        if (!data || !Array.isArray(data.chart) || data.chart.length === 0) {
          console.error('Invalid or empty chart data from API');
          setChartData(generateMockChartData(selectedPeriod, Math.floor(Date.now() / 1000)));
          setIsLoading(false);
          return;
        }
        
        // Filter out any invalid data points with invalid timestamps
        const validChartData = data.chart.filter(([timestamp, price]: [number, number]) => (
          timestamp && !isNaN(timestamp) && price && !isNaN(price)
        ));
        
        if (validChartData.length === 0) {
          console.error('No valid data points in chart data');
          setChartData(generateMockChartData(selectedPeriod, Math.floor(Date.now() / 1000)));
          setIsLoading(false);
          return;
        }

        const timestamps = validChartData.map(([timestamp]: [number, number]) => timestamp);
        const prices = validChartData.map(([, price]: [number, number]) => price);
        
        const chartData = {
          t: timestamps,
          c: prices
        };
        
        setChartData(chartData);
        
        // Calculate price change percentage
        if (prices.length >= 2) {
          const firstPrice = prices[0];
          const lastPrice = prices[prices.length - 1];
          const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100;
          setPriceChange(changePercent);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        
        // Generate mock data as a fallback for demonstration
        const now = Math.floor(Date.now() / 1000);
        const mockData = generateMockChartData(selectedPeriod, now);
        
        setChartData(mockData);
        
        if (mockData.c.length >= 2) {
          const firstPrice = mockData.c[0];
          const lastPrice = mockData.c[mockData.c.length - 1];
          const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100;
          setPriceChange(changePercent);
        }
        
        // Still show the error to the user
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Demo data is being shown. API error: ${errorMessage}`);
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [coinId, selectedPeriod, generateMockChartData]);

  const handlePeriodChange = (newPeriod: string) => {
    setSelectedPeriod(newPeriod);
  };

  // Format timestamp for tooltip
  const formatTimestamp = (timestamp: number): string => {
    if (!timestamp || isNaN(timestamp)) {
      return '';
    }
    
    try {
      // Convert to milliseconds if timestamp is in seconds
      const timestampMs = timestamp > 10000000000 ? timestamp : timestamp * 1000;
      
      // Validate the timestamp is in a reasonable range
      if (timestampMs < 0 || timestampMs > 8.64e15) { // Max date value in JavaScript
        console.warn('Invalid timestamp value for tooltip:', timestamp);
        return '';
      }
      
      const date = new Date(timestampMs);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date created from timestamp for tooltip:', timestamp);
        return '';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      console.error('Error formatting tooltip timestamp:', timestamp, error);
      return '';
    }
  };

  // Format for X-axis labels
  const formatXAxis = (timestamp: number): string => {
    if (!timestamp || isNaN(timestamp)) {
      return '';
    }
    
    try {
      // Convert to milliseconds if timestamp is in seconds
      const timestampMs = timestamp > 10000000000 ? timestamp : timestamp * 1000;
      
      // Validate the timestamp is in a reasonable range
      if (timestampMs < 0 || timestampMs > 8.64e15) { // Max date value in JavaScript
        console.warn('Invalid timestamp value:', timestamp);
        return '';
      }
      
      const date = new Date(timestampMs);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date created from timestamp:', timestamp);
        return '';
      }
      
      if (selectedPeriod === '24h') {
        return new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(date);
      } else if (selectedPeriod === '1w') {
        return new Intl.DateTimeFormat('en-US', {
          weekday: 'short',
        }).format(date);
      } else if (selectedPeriod === '1m') {
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
        }).format(date);
      } else if (selectedPeriod === '3m' || selectedPeriod === '6m') {
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
        }).format(date);
      } else {
        // 1y or all
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          year: '2-digit',
        }).format(date);
      }
    } catch (error) {
      console.error('Error formatting timestamp:', timestamp, error);
      return '';
    }
  };

  // Chart configuration
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (context: TooltipItem<'line'>[]) => {
            if (context[0]?.raw !== undefined && chartData?.t) {
              const index = context[0].dataIndex;
              return formatTimestamp(chartData.t[index]);
            }
            return '';
          },
          label: (context: TooltipItem<'line'>) => {
            if (context.raw !== undefined) {
              return `Price: $${(context.raw as number).toLocaleString()}`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
          callback: function(value: unknown, index: number) {
            if (chartData?.t && index < chartData.t.length) {
              const timestamp = chartData.t[Math.floor(index * chartData.t.length / 6)];
              return formatXAxis(timestamp);
            }
            return '';
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear',
        position: 'right',
        ticks: {
          callback: function(value: unknown) {
            return '$' + (value as number).toLocaleString();
          },
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 5,
      },
      line: {
        tension: 0.2,
      },
    },
  };

  // Format data for Chart.js
  const data = chartData ? {
    labels: chartData.t.map((timestamp) => timestamp), // We'll format these in the ticks callback
    datasets: [
      {
        label: 'Price',
        data: chartData.c,
        borderColor: priceChange >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, priceChange >= 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          return gradient;
        },
        borderWidth: 2,
        fill: true,
      },
    ],
  } : {
    labels: [],
    datasets: [
      {
        label: 'Price',
        data: [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  return (
    <div className="w-full">
      {/* Period selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium flex items-center">
          {priceChange >= 0 ? (
            <TrendingUp size={16} className="text-green-500 mr-1" />
          ) : (
            <TrendingDown size={16} className="text-red-500 mr-1" />
          )}
          <span className={priceChange >= 0 ? 'text-green-500' : 'text-red-500'}>
            {priceChange.toFixed(2)}%
          </span>
        </div>
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => handlePeriodChange(p.value)}
              className={`px-2 py-1 text-xs rounded-md transition ${
                selectedPeriod === p.value
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Demo data notification */}
      {error && error.includes('demo') && (
        <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      {/* Chart container */}
      <div className="h-64">
        {isLoading && (
          <div className="h-full flex items-center justify-center">
            <div className="text-gray-400 flex flex-col items-center">
              <div className="w-6 h-6 border-2 border-t-blue-500 rounded-full animate-spin mb-2"></div>
              <span>Loading chart data...</span>
            </div>
          </div>
        )}

        {error && !error.includes('demo') && (
          <div className="h-full flex items-center justify-center">
            <div className="text-red-500 flex flex-col items-center">
              <span className="text-lg mb-2">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {!isLoading && data && (
          <Line
            ref={chartRef}
            data={data}
            options={chartOptions}
          />
        )}
      </div>
    </div>
  );
};

export default CoinChart; 