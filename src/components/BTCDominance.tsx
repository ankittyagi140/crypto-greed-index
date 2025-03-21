'use client';

import { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import TimeRangeSelector from './TimeRangeSelector';
import { useRouter } from 'next/navigation';

interface BTCDominanceProps {
  data: {
    date: string;
    dominance: number;
  }[];
  isDetailPage?: boolean;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

const CurrentDominance = ({ value, data }: { value: number; data: { date: string; dominance: number }[] }) => {
  // Calculate the actual change in dominance from yesterday's value
  const currentIndex = data.length - 1;
  const previousIndex = currentIndex - 1;
  const change = previousIndex >= 0 ? value - data[previousIndex].dominance : 0;
  const isPositive = change >= 0;

  return (
    <div className={`${isPositive ? 'bg-green-100 dark:bg-green-900/40' : 'bg-red-100 dark:bg-red-900/40'} rounded-lg p-4 mb-6 max-w-xs mx-auto border ${isPositive ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'}`}>
      <div className={`${isPositive ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'} text-sm font-medium mb-1 text-center`}>Current BTC Dominance</div>
      <div className="flex items-baseline gap-2 justify-center">
        <div className={`text-2xl font-bold ${isPositive ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
          {value.toFixed(1)}%
        </div>
        <div className={`text-sm font-medium ${isPositive ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {new Date(label || '').toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          BTC Dominance: {payload[0].value.toFixed(2)}%
        </p>
      </div>
    );
  }
  return null;
};

export default function BTCDominance({ data, isDetailPage = false }: BTCDominanceProps) {
  const [selectedRange, setSelectedRange] = useState('30');
  const router = useRouter();

  // Filter data based on selected time range
  const filteredData = data.filter(item => {
    const date = new Date(item.date);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days <= parseInt(selectedRange);
  });

  // Get current dominance value (latest data point)
  const currentDominance = data[data.length - 1]?.dominance || 0;

  // Calculate min and max values for better Y-axis scaling
  const minDominance = Math.floor(Math.min(...filteredData.map(d => d.dominance)));
  const maxDominance = Math.ceil(Math.max(...filteredData.map(d => d.dominance)));
  const yAxisDomain = [minDominance - 1, maxDominance + 1];

  const handleClick = () => {
    if (!isDetailPage) {
      router.push('/btcDominance');
    }
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-12 ${
        !isDetailPage ? 'cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-xl' : ''
      }`}
      onClick={handleClick}
    >
      {isDetailPage && <CurrentDominance value={currentDominance} data={data} />}
      <div className="mb-6 flex flex-col gap-2 items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Bitcoin Market Dominance
          {!isDetailPage && (
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              (Click for detailed analysis)
            </span>
          )}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Track Bitcoin&apos;s share of the total cryptocurrency market capitalization
        </p>
        <TimeRangeSelector
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />
      </div>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="btcDominanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f7931a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f7931a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              tick={{ fontSize: 12 }}
              interval="preserveEnd"
            />
            <YAxis
              domain={yAxisDomain}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12 }}
              label={{
                value: 'BTC Dominance (%)',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#666' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="dominance"
              stroke="#f7931a"
              strokeWidth={2}
              fill="url(#btcDominanceGradient)"
              name="BTC Dominance"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 