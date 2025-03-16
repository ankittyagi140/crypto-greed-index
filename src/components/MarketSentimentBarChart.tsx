import React from 'react';

interface SentimentData {
  title: string;
  value: number;
  classification: string;
}

interface MarketSentimentBarChartProps {
  data: SentimentData[];
}

const COLORS = {
  'Extreme Fear': '#FF0000',
  'Fear': '#FFA500',
  'Neutral': '#FFFF00',
  'Greed': '#32CD32'
};

export default function MarketSentimentBarChart({ data }: MarketSentimentBarChartProps) {
  const maxHeight = 200; // Maximum height for bars

  return (
    <div className="w-full">
      <div className="flex justify-around items-end h-[250px]">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div 
              className="w-16 transition-all duration-500 ease-in-out rounded-t"
              style={{ 
                height: `${(item.value / 100) * maxHeight}px`,
                backgroundColor: COLORS[item.classification as keyof typeof COLORS],
              }}
            />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {item.value}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 