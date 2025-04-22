import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface BTCComparisonProps {
  data: Array<{
    date: string;
    fgi: number;
    btcPrice: number;
    fgiClassification: string;
  }>;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      fgi: number;
      fgiClassification: string;
      btcPrice: number;
      btcPricePercentage: number;
    };
  }>;
  label?: string;
}

const BTCComparison: React.FC<BTCComparisonProps> = ({ data }) => {
  // Calculate percentage change for Bitcoin price to normalize the chart
  const normalizedData = useMemo(() => {
    if (!data.length) return [];
    
    const firstPrice = data[0].btcPrice;
    return data.map(point => ({
      ...point,
      btcPricePercentage: ((point.btcPrice - firstPrice) / firstPrice) * 100
    }));
  }, [data]);

  // Custom tooltip to show both FGI and BTC price
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Fear & Greed Index: {payload[0].payload.fgi} ({payload[0].payload.fgiClassification})
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Bitcoin Price: ${payload[0].payload.btcPrice.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              BTC Price Change: {payload[0].payload.btcPricePercentage.toFixed(2)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-12">
      <div className="mb-6 flex flex-col gap-2 items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          Fear & Greed Index vs Bitcoin Price
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-base text-center max-w-2xl mx-auto">
          Compare market sentiment with Bitcoin price movements
        </p>
      </div>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={normalizedData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveEnd"
            />
            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Fear & Greed Index',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#666' }
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'BTC Price Change %',
                angle: 90,
                position: 'insideRight',
                style: { fill: '#666' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="fgi"
              name="Fear & Greed Index"
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3B82F6"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="btcPricePercentage"
              name="BTC Price Change %"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          How to Read This Chart
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
          <li>Blue area shows the Fear & Greed Index (0-100)</li>
          <li>Orange line shows Bitcoin price change percentage</li>
          <li>High fear levels often precede price increases</li>
          <li>Extreme greed might indicate price corrections</li>
        </ul>
      </div>
    </div>
  );
};

export default BTCComparison; 