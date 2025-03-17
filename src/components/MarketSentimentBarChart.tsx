import React from 'react';

interface SentimentData {
  title: string;
  value: number;
  classification: string;
}

interface MarketSentimentBarChartProps {
  data: SentimentData[];
}

// Updated colors to match GaugeIndicator component
const COLORS = {
  'Extreme Fear': '#E53E3E', // Red - matches extremeFear in GaugeIndicator
  'Fear': '#ED8936',        // Orange - matches fear in GaugeIndicator
  'Greed': '#48BB78',       // Light Green - matches greed in GaugeIndicator
  'Extreme Greed': '#38A169' // Green - matches extremeGreed in GaugeIndicator
};

// Helper function to get color based on value
const getColorForValue = (val: number) => {
  if (val <= 24) return COLORS['Extreme Fear'];
  if (val <= 49) return COLORS['Fear'];
  if (val <= 74) return COLORS['Greed'];
  return COLORS['Extreme Greed'];
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
                backgroundColor: getColorForValue(item.value),
              }}
            />
            <span className="text-sm font-medium" style={{ color: getColorForValue(item.value) }}>
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