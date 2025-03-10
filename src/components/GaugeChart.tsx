'use client';

import Image from "next/image";

interface GaugeChartProps {
  value: number;
  classification: string;
}

export default function GaugeChart({ value, classification }: GaugeChartProps) {
  const getColor = (value: number) => {
    if (value >= 0 && value <= 25) return 'rgb(240, 41, 52)'; // Extreme Fear (Red)
    if (value > 25 && value <= 45) return '#E67E22'; // Fear (Orange)
    if (value > 45 && value <= 55) return '#F1C40F'; // Neutral (Yellow)
    if (value > 55 && value <= 75) return '#2ECC71'; // Greed (Green)
    return 'rgb(52, 179, 73)'; // Extreme Greed (Dark Green)
  };

  // Calculate the rotation angle based on the value (0-100 maps to 180-0 degrees)
  const angle = 180 - (value * 180) / 100;

  return (
    <div className="relative w-[300px] mx-auto">
      {/* SVG Gauge */}
      <svg viewBox="0 0 200 120" className="w-full">
        {/* Background arc - light gray */}
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="20"
          strokeLinecap="round"
        />
        
        {/* Colored arc - value indicator */}
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke={getColor(value)}
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 * (1 - value / 100)}
          className="transition-all duration-1000 ease-in-out"
        />

        {/* Value labels */}
        <text x="15" y="115" className="text-xs font-medium" fill="#666">0</text>
        <text x="95" y="35" className="text-xs font-medium" fill="#666" textAnchor="middle">50</text>
        <text x="185" y="115" className="text-xs font-medium" fill="#666">100</text>

        {/* Needle */}
        <g transform={`rotate(${angle}, 100, 100)`}>
          <line
            x1="100"
            y1="30"
            x2="100"
            y2="100"
            stroke="#000"
            strokeWidth="2"
            className="transition-all duration-1000 ease-in-out"
          />
          <circle cx="100" cy="100" r="5" fill="#000" />
        </g>
      </svg>

      {/* Bitcoin logo */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow">
        <Image 
          src="https://static.coinstats.app/coins/1650455588819.png" 
          alt="Bitcoin Logo" 
          className="w-6 h-6"
        />
      </div>

      {/* Current value text */}
      <div className="text-center mt-2">
        <span className="text-sm text-gray-500">Now: </span>
        <span className="text-sm font-medium" style={{ color: getColor(value) }}>
          {value} {classification}
        </span>
      </div>
    </div>
  );
} 