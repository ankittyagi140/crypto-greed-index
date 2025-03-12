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