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
  initialPeriod?: string;
}

interface ChartData {
  t: number[];
  c: number[];
}

// Define an interface for API responses that might have a chart property
interface ChartApiResponse {
  chart?: Array<[number, number]>;
}

const CoinChart: React.FC<CoinChartProps> = ({ coinId, initialPeriod = '24h' }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [period, setPeriod] = useState(initialPeriod);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceChange] = useState<number>(0);
  const chartRef = useRef<ChartJS<'line'>>(null);
  
  // Helper function to generate mock chart data for demonstration
  const generateMockChartData = useCallback((period: string, endTime: number): ChartData => {
    // Calculate the number of data points based on the period
    const dataPoints = period === '24h' ? 24 : 
                      period === '1w' ? 7 : 
                      period === '1m' ? 30 : 
                      period === '3m' ? 90 : 
                      period === '6m' ? 180 : 
                      period === '1y' ? 365 : 100;
    
    // Calculate time step in seconds
    const timeStep = period === '24h' ? 3600 : // 1 hour
                    period === '1w' ? 86400 : // 1 day
                    period === '1m' ? 86400 : // 1 day
                    period === '3m' ? 86400*3 : // 3 days
                    period === '6m' ? 86400*6 : // 6 days
                    period === '1y' ? 86400*7 : // 7 days
                    86400; // default 1 day
    
    // Generate timestamps going back from the end time
    const timestamps = Array.from({ length: dataPoints }, (_, i) => 
      endTime - (dataPoints - i - 1) * timeStep
    );
    
    // Base price depends on the coin
    const basePrice = coinId === 'bitcoin' ? 30000 : 
                   coinId === 'ethereum' ? 1800 : 
                   coinId === 'binancecoin' ? 250 : 
                   coinId === 'solana' ? 40 : 100;
    
    // Generate price data with slight trend and noise
    let currentPrice = basePrice;
    const trend = Math.random() > 0.5 ? 1.0005 : 0.9995; // Slight trend up or down
    
    const priceData = timestamps.map(() => {
      // Apply trend
      currentPrice = currentPrice * trend;
      
      // Add noise (5% max variation)
      const noise = currentPrice * 0.05 * (Math.random() - 0.5);
      return currentPrice + noise;
    });
    
    // Return in ChartData format with t and c arrays
    return {
      t: timestamps,
      c: priceData
    };
  }, [coinId]);

  // Function to fetch chart data
  const fetchChartData = useCallback(async () => {
    if (!coinId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = `/api/coins/${coinId}/charts?period=${period}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Error fetching chart data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // For backward compatibility, also check for chart array structure
      let chartPoints = Array.isArray(data) ? data : (data as ChartApiResponse).chart || [];
      
      // Filter out any invalid data points
      chartPoints = chartPoints.filter((point: unknown) => 
        Array.isArray(point) && point.length >= 2 && 
        !isNaN(Number(point[0])) && !isNaN(Number(point[1]))
      );
      
      if (chartPoints.length === 0) {
        throw new Error('No valid chart data available');
      }
      
      // Transform API data format (array of [timestamp, price] arrays) to ChartData format
      const timestamps = chartPoints.map((point: [number, number]) => point[0]);
      const prices = chartPoints.map((point: [number, number]) => point[1]);
      
      setChartData({ t: timestamps, c: prices });
    } catch (err) {
      console.error('Failed to fetch chart data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load chart data');
      
      // Fall back to mock data in development
      if (process.env.NODE_ENV === 'development') {
        const now = Math.floor(Date.now() / 1000);
        setChartData(generateMockChartData(period, now));
      }
    } finally {
      setIsLoading(false);
    }
  }, [coinId, period, generateMockChartData]);

  // Initial data fetch and period change effect
  useEffect(() => {
    fetchChartData();
  }, [fetchChartData, period]);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
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

  // Format for X-axis labels with improved readability based on period
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
      
      if (period === '24h') {
        return new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).format(date);
      } else if (period === '1w') {
        return new Intl.DateTimeFormat('en-US', {
          weekday: 'short',
          day: 'numeric'
        }).format(date);
      } else if (period === '1m') {
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric'
        }).format(date);
      } else if (period === '3m' || period === '6m') {
        const day = date.getDate();
        // Only show the month name for the 1st day of the month or important dates
        if (day === 1 || day === 15) {
          return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric'
          }).format(date);
        } else {
          return day.toString();
        }
      } else {
        // 1y or all
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          year: '2-digit'
        }).format(date);
      }
    } catch (error) {
      console.error('Error formatting timestamp:', timestamp, error);
      return '';
    }
  };

  // Generate appropriate tick marks for the chart based on period
  const getAppropriateTicksFromData = (): number[] => {
    if (!chartData || !chartData.t || chartData.t.length === 0) return [];
    
    const dataLength = chartData.t.length;
    const ticks: number[] = [];
    
    if (period === '24h') {
      // For 24h, show every 4 hours
      const hourlyInterval = Math.max(1, Math.floor(dataLength / 6));
      for (let i = 0; i < dataLength; i += hourlyInterval) {
        ticks.push(i);
      }
    } else if (period === '1w') {
      // For 1w, try to show each day
      const dailyInterval = Math.max(1, Math.floor(dataLength / 7));
      for (let i = 0; i < dataLength; i += dailyInterval) {
        ticks.push(i);
      }
    } else if (period === '1m') {
      // For 1m, show approximately weekly points
      const weeklyInterval = Math.max(1, Math.floor(dataLength / 4));
      for (let i = 0; i < dataLength; i += weeklyInterval) {
        ticks.push(i);
      }
    } else if (period === '3m' || period === '6m') {
      // For 3m/6m, show approximately bi-weekly points
      const biWeeklyInterval = Math.max(1, Math.floor(dataLength / 6));
      for (let i = 0; i < dataLength; i += biWeeklyInterval) {
        ticks.push(i);
      }
    } else {
      // For 1y/all, show monthly points
      const monthlyInterval = Math.max(1, Math.floor(dataLength / 12));
      for (let i = 0; i < dataLength; i += monthlyInterval) {
        ticks.push(i);
      }
    }
    
    // Always include the first and last point
    if (ticks.length > 0 && ticks[0] !== 0) ticks.unshift(0);
    if (ticks.length > 0 && ticks[ticks.length - 1] !== dataLength - 1) ticks.push(dataLength - 1);
    
    return ticks;
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
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleFont: { size: 13 },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 6,
        displayColors: false,
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
          autoSkip: false,
          callback: function(value: unknown, index: number) {
            // Only show labels for specific indices calculated for even distribution
            const ticks = getAppropriateTicksFromData();
            return ticks.includes(index) ? chartData?.t ? formatXAxis(chartData.t[index]) : '' : '';
          },
          color: 'rgba(100, 100, 100, 0.8)',
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
          // Ensure y-axis has enough ticks to show the range properly
          maxTicksLimit: 8,
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
        // Set min and max based on data range
        suggestedMin: chartData?.c ? Math.floor(Math.min(...chartData.c) * 0.95) : undefined,
        suggestedMax: chartData?.c ? Math.ceil(Math.max(...chartData.c) * 1.05) : undefined,
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
    labels: chartData.t.map((timestamp) => formatXAxis(timestamp)),
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
        cubicInterpolationMode: 'monotone' as const,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: priceChange >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
        pointHoverBackgroundColor: 'white',
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: priceChange >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
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
        cubicInterpolationMode: 'monotone' as const,
        tension: 0.4,
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
                period === p.value
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