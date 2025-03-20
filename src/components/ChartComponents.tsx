'use client';

import Image from 'next/image';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface ChartData {
  timestamp: string;
  value: number;
  price?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: ChartData;
  }>;
  label?: string;
}

interface ChartComponentsProps {
  data: ChartData[];
  chartWidth: number;
}

interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
  fill?: string;
}

const getBarColor = (value: number) => {
  if (value >= 75) return '#22c55e'; // Extreme Greed - Green
  if (value >= 55) return '#86efac'; // Greed - Light Green
  if (value >= 45) return '#fcd34d'; // Neutral - Yellow
  if (value >= 25) return '#f87171'; // Fear - Light Red
  return '#dc2626'; // Extreme Fear - Red
};

const CustomBar = (props: CustomBarProps) => {
  const { x = 0, y = 0, width = 0, height = 0, value = 0 } = props;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={getBarColor(value)}
    />
  );
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// const getTextColor = (value: number) => {
//   if (value >= 75) return 'text-green-500';
//   if (value >= 55) return 'text-green-400';
//   if (value >= 45) return 'text-yellow-400';
//   if (value >= 25) return 'text-red-400';
//   return 'text-red-500';
// };

// const getSentimentLabel = (value: number) => {
//   if (value >= 75) return 'Extreme Greed';
//   if (value >= 55) return 'Greed';
//   if (value >= 45) return 'Neutral';
//   if (value >= 25) return 'Fear';
//   return 'Extreme Fear';
// };

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="text-gray-500 dark:text-gray-400">
        {new Date(label || '').toLocaleDateString()}
      </p>
      {payload.map((item, index) => (
        <p key={index} className="text-gray-900 dark:text-gray-100 font-medium">
          {item.dataKey}: {item.value}
        </p>
      ))}
    </div>
  );
};

function ChartComponents({ data, chartWidth }: ChartComponentsProps) {
  const getResponsiveConfig = () => {
    const isMobile = chartWidth < 640;
    return {
      chartHeight: isMobile ? 300 : 400,
      barSize: isMobile ? 15 : 20,
      fontSize: isMobile ? 10 : 12,
      legendPosition: isMobile ? 'bottom' : 'center',
      tickGap: isMobile ? 30 : 50,
      yAxisWidth: isMobile ? 35 : 45,
    };
  };

  const config = getResponsiveConfig();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center gap-2 mb-3 sm:mb-4">
        <div className="flex items-center">
          <Image src="/bitcoin.svg" alt="Bitcoin" className="w-5 h-5 sm:w-6 sm:h-6 mr-2" height={24} width={24}/>
          <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">BTC</span>
        </div>
        <div className="h-4 sm:h-6 border-l border-gray-300 dark:border-gray-600 hidden sm:block"></div>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white text-center sm:text-left">
          Crypto Fear and Greed Chart (1 Year)
        </h2>
      </div>
      
      <div className="h-[300px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={data} 
            margin={{ 
              top: 20, 
              right: config.yAxisWidth, 
              left: 0, 
              bottom: config.legendPosition === 'bottom' ? 40 : 20 
            }}
          >
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatDate}
              tick={{ fill: '#6B7280', fontSize: config.fontSize }}
              axisLine={{ stroke: '#E5E7EB' }}
              interval="preserveStartEnd"
              minTickGap={config.tickGap}
              height={30}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              tick={{ fill: '#6B7280', fontSize: config.fontSize }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => `${value}`}
              width={config.yAxisWidth}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={['dataMin - 1000', 'dataMax + 1000']}
              tick={{ fill: '#6B7280', fontSize: config.fontSize }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => formatPrice(value)}
              width={config.yAxisWidth}
            />
            <Bar
              yAxisId="left"
              dataKey="value"
              shape={<CustomBar />}
              barSize={config.barSize}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="price"
              stroke="#3B82F6"
              strokeWidth={1.5}
              dot={false}
            />
            <Tooltip content={<CustomTooltip />} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className={`flex flex-wrap justify-center gap-2 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm ${config.legendPosition === 'bottom' ? 'pt-2' : ''}`}>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-600"></div>
          <span className="text-gray-600 dark:text-gray-400">Extreme Fear</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
          <span className="text-gray-600 dark:text-gray-400">Fear</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
          <span className="text-gray-600 dark:text-gray-400">Neutral</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
          <span className="text-gray-600 dark:text-gray-400">Greed</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-600"></div>
          <span className="text-gray-600 dark:text-gray-400">Extreme Greed</span>
        </div>
      </div>
    </div>
  );
}

// Make sure to export the component as default
export default ChartComponents; 