'use client';

// import UpdateTimer from './UpdateTimer';

interface FearGreedMeterProps {
  value: number;
  classification: string;
  lastUpdated?: string;
  timestamp?: number;
}

const getColor = (value: number): string => {
  if (value <= 25) return '#E31B23';     // Red for Extreme Fear
  if (value <= 45) return '#FF9800';     // Orange for Fear
  if (value <= 55) return '#FFD700';     // Yellow for Neutral
  if (value <= 75) return '#90EE90';     // Light Green for Greed
  return '#008000';                      // Green for Extreme Greed
};

const getBackgroundGradient = (): string => {
  return `M20 100 A80 80 0 1 1 180 100`;
};

const getColoredPath = (value: number): string => {
  const angle = (value / 100) * Math.PI;
  const x = 100 - 80 * Math.cos(angle);
  const y = 100 - 80 * Math.sin(angle);
  const largeArcFlag = angle > Math.PI / 2 ? 1 : 0;
  return `M20 100 A80 80 0 ${largeArcFlag} 1 ${x} ${y}`;
};

export default function FearGreedMeter({ 
  value, 
  classification, 
  lastUpdated = 'Mar 10, 2025',
  timestamp = Date.now() / 1000
}: FearGreedMeterProps) {
  const color = getColor(value);

  return (
    <div className="relative w-full max-w-[95vw] sm:max-w-md mx-auto p-2 sm:p-4">
      {/* Title and Last Updated */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
          Crypto Fear and Greed Indicator
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Last Updated: {lastUpdated}
        </p>
        {/* <UpdateTimer lastUpdated={timestamp} /> */}
      </div>

      <div className="aspect-[2/1.3] w-full">
        <svg 
          viewBox="0 0 200 130" 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background gradient */}
          <defs>
            <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#E31B23' }} />
              <stop offset="25%" style={{ stopColor: '#FF9800' }} />
              <stop offset="50%" style={{ stopColor: '#FFD700' }} />
              <stop offset="75%" style={{ stopColor: '#90EE90' }} />
              <stop offset="100%" style={{ stopColor: '#008000' }} />
            </linearGradient>
          </defs>

          {/* Background semicircle with gradient */}
          <path
            d={getBackgroundGradient()}
            fill="none"
            stroke="url(#meterGradient)"
            strokeWidth="16"
            opacity="0.2"
          />
          
          {/* Colored portion */}
          <path
            d={getColoredPath(value)}
            fill="none"
            stroke={color}
            strokeWidth="16"
          />

          {/* Center value */}
          <text
            x="100"
            y="60"
            textAnchor="middle"
            className="text-[2.5rem] sm:text-[3rem] font-bold"
            fill={color}
          >
            {value}
          </text>

          {/* Classification */}
          <text
            x="100"
            y="85"
            textAnchor="middle"
            className="text-base sm:text-l"
            fill={color}
          >
            {classification}
          </text>
         

          {/* Scale numbers */}
          <g className=" block text-[0.7rem] text-xs">
            <text x="20" y="130" textAnchor="middle" fill="#E31B23">0</text>
            <text x="60" y="130" textAnchor="middle" fill="#FF9800">25</text>
            <text x="100" y="130" textAnchor="middle" fill="#FFD700">50</text>
            <text x="140" y="130" textAnchor="middle" fill="#90EE90">75</text>
            <text x="180" y="130" textAnchor="middle" fill="#008000">100</text>
          </g>

          {/* Mobile-friendly labels (simplified) */}
        </svg>
      </div>
    </div>
  );
} 