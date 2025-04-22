import React from 'react';

interface RangeBarProps {
  low: number;
  high: number;
  current: number;
  label: string;
}

const RangeBar: React.FC<RangeBarProps> = ({ low, high, current, label }) => {
  // Calculate percentages for positioning
  const range = high - low;
  const currentPosition = ((current - low) / range) * 100;
  const fromLowPercent = ((current - low) / low) * 100;
  const fromHighPercent = ((high - current) / high) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
        {/* Red to Yellow to Green Gradient */}
        <div
          className="absolute h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full shadow-sm"
          style={{ width: '100%' }}
        />
        {/* Current Price Marker */}
        <div
          className="absolute w-2 h-5 bg-gray-800 dark:bg-white rounded-full -top-1.5 transform -translate-x-1/2 shadow-md"
          style={{ left: `${currentPosition}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex flex-col">
          <span className="font-medium">{low.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          <span className="text-red-500 font-medium">{fromLowPercent.toFixed(1)}% from low</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-gray-800 dark:text-white">{current.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          <span>Current</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-medium">{high.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          <span className="text-green-500 font-medium">{fromHighPercent.toFixed(1)}% from high</span>
        </div>
      </div>
    </div>
  );
};

export default RangeBar; 