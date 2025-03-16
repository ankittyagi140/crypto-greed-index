import React from 'react';

interface FearGreedIndicatorProps {
  value: number;
  classification: string;
  lastUpdated?: string;
  timestamp?: number;
  pointChange?: number;
}

const getRotationAngle = (value: number): number => {
  // Map 0-100 to -90 to 90 degrees for semi-circle
  return -90 + (value * 180) / 100;
};

// Define colors as constants to ensure consistency
const COLORS = {
  EXTREME_FEAR: '#FF0000',
  FEAR: '#FFA500',
  NEUTRAL: '#FFFF00',
  GREED: '#32CD32'
};

const getZoneColor = (value: number): string => {
  if (value <= 35) return COLORS.EXTREME_FEAR;    // Extreme Fear
  if (value <= 45) return COLORS.FEAR;            // Fear
  if (value <= 65) return COLORS.NEUTRAL;         // Neutral
  return COLORS.GREED;                            // Greed
};


export default function FearGreedIndicator({ 
  value, 
  classification, 
  pointChange = -16
}: FearGreedIndicatorProps) {
  const formattedTimeAgo = '7 hours ago';
  const needleZoneColor = getZoneColor(value);

  return (
    <div className="relative w-full max-w-[400px] mx-auto bg-white p-6 rounded-xl">
      <svg 
        viewBox="0 0 200 120" 
        className="w-full"
      >
        {/* Colored segments - Proper semicircle distribution */}
        <path
          d="M 20 100 A 80 80 0 0 1 60 40"
          fill="none"
          stroke={COLORS.EXTREME_FEAR}
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M 60 40 A 80 80 0 0 1 100 30"
          fill="none"
          stroke={COLORS.FEAR}
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M 100 30 A 80 80 0 0 1 140 40"
          fill="none"
          stroke={COLORS.NEUTRAL}
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          d="M 140 40 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={COLORS.GREED}
          strokeWidth="20"
          strokeLinecap="round"
        />

        {/* Needle */}
        <g transform={`translate(100, 100) rotate(${getRotationAngle(value)})`}>
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-70"
            stroke="#000000"
            strokeWidth="2"
          />
          <circle
            cx="0"
            cy="0"
            r="4"
            fill={needleZoneColor}
          />
        </g>
      </svg>

      {/* Value and Classification */}
      <div className="text-center mt-4">
        <span style={{ color: COLORS.FEAR }} className="text-4xl font-bold block">{value}</span>
        <span style={{ color: COLORS.FEAR }} className="text-xl font-medium block mt-1">{classification}</span>
      </div>

      {/* Points change and time */}
      <div className="flex justify-between text-gray-500 mt-3 text-sm">
        <div className="flex items-center">
          {pointChange < 0 ? (
            <svg viewBox="0 0 24 24" className="w-3 h-3 mr-1 fill-current text-red-500">
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-3 h-3 mr-1 fill-current text-green-500">
              <path d="M7 14l5-5 5 5H7z" />
            </svg>
          )}
          <span className={pointChange < 0 ? 'text-red-500' : 'text-green-500'}>
            {Math.abs(pointChange)} points
          </span>
        </div>
        <div>{formattedTimeAgo}</div>
      </div>
    </div>
  );
} 