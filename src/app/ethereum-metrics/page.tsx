'use client';

import { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import EthereumMetrics from '@/components/EthereumMetrics';
import TimeRangeSelector from '@/components/TimeRangeSelector';

interface HistoricalData {
  date: string;
  price: number;
  marketCap: number;
  activeAddresses: number;
  tvl: number;
  gasPrice: number;
}

export default function EthereumMetricsPage() {
  const [selectedRange, setSelectedRange] = useState('30');
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        // TODO: Replace with actual API calls
        // This is mock data for demonstration
        const mockData: HistoricalData[] = Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
          price: 2500 + Math.random() * 100,
          marketCap: 300000000000 + Math.random() * 10000000000,
          activeAddresses: 450000 + Math.random() * 50000,
          tvl: 25000000000 + Math.random() * 1000000000,
          gasPrice: 25 + Math.random() * 10
        }));
        setHistoricalData(mockData);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [selectedRange]);

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatGasPrice = (price: number): string => {
    if (price >= 100) return `${price.toFixed(0)} Gwei`;
    return `${price.toFixed(2)} Gwei`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Ethereum Network Analysis
      </h1>

      <EthereumMetrics isDetailPage={true} />

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Historical Price Data
          </h2>
          <TimeRangeSelector
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  tick={{ fontSize: 12 }}
                  interval="preserveEnd"
                />
                <YAxis
                  tickFormatter={(value) => formatNumber(value)}
                  tick={{ fontSize: 12 }}
                  label={{
                    value: 'Price (USD)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: '#666' }
                  }}
                />
                <Tooltip
                  formatter={(value: number) => [formatNumber(value), 'Price']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#627eea"
                  strokeWidth={2}
                  dot={false}
                  name="ETH Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Gas Price Trend
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    tick={{ fontSize: 12 }}
                    interval="preserveEnd"
                  />
                  <YAxis
                    tickFormatter={(value) => formatGasPrice(value)}
                    tick={{ fontSize: 12 }}
                    label={{
                      value: 'Gas Price (Gwei)',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: '#666' }
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatGasPrice(value), 'Gas Price']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  />
                  <Line
                    type="monotone"
                    dataKey="gasPrice"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    name="Gas Price"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Active Addresses
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    tick={{ fontSize: 12 }}
                    interval="preserveEnd"
                  />
                  <YAxis
                    tickFormatter={(value) => formatNumber(value)}
                    tick={{ fontSize: 12 }}
                    label={{
                      value: 'Active Addresses',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: '#666' }
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatNumber(value), 'Active Addresses']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  />
                  <Line
                    type="monotone"
                    dataKey="activeAddresses"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name="Active Addresses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 