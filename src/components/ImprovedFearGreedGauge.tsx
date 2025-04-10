import React from 'react';

interface ImprovedFearGreedGaugeProps {
  value: number;
  classification: string;
  timestamp?: number;
}

const ImprovedFearGreedGauge: React.FC<ImprovedFearGreedGaugeProps> = ({ 
  value, 
  classification,
  timestamp 
}) => {
  // Ensure value is within 0-100 range
  const gaugeValue = Math.max(0, Math.min(100, value));
  
  // Format the timestamp if available
  const formattedDate = timestamp 
    ? new Date(timestamp * 1000).toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    : '4/10/2025, 5:30:00 AM';
  
  // Calculate needle angle based on value (0 = -90°, 100 = 90°)
  const needleAngle = -90 + (gaugeValue / 100) * 180;
  
  return (
    <div className="flex flex-col max-w-md w-full mx-auto bg-white p-4">
      {/* Title */}
      <h2 className="text-center text-xl font-bold text-gray-800 mb-6">Crypto Fear and Greed Index today</h2>
      
      {/* Gauge */}
      <div className="relative mb-5">
        <svg viewBox="0 0 300 200" className="w-full">
          {/* Background gradient */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF4136" /> {/* Red (Extreme Fear) */}
              <stop offset="25%" stopColor="#FF851B" /> {/* Orange (Fear) */}
              <stop offset="50%" stopColor="#FFDC00" /> {/* Yellow (Neutral) */}
              <stop offset="75%" stopColor="#2ECC40" /> {/* Green (Greed) */}
              <stop offset="100%" stopColor="#01FF70" /> {/* Light Green (Extreme Greed) */}
            </linearGradient>
          </defs>
          
          {/* Main semicircle gauge */}
          <path 
            d="M 50 150 A 100 100 0 0 1 250 150" 
            fill="none" 
            stroke="url(#gaugeGradient)" 
            strokeWidth="30"
            strokeLinecap="round"
          />
          
          {/* Value markers */}
          <text x="50" y="190" fontSize="14" textAnchor="middle" fill="#666">0</text>
          <text x="100" y="140" fontSize="14" textAnchor="middle" fill="#666">25</text>
          <text x="150" y="130" fontSize="14" textAnchor="middle" fill="#666">50</text>
          <text x="200" y="140" fontSize="14" textAnchor="middle" fill="#666">75</text>
          <text x="250" y="190" fontSize="14" textAnchor="middle" fill="#666">100</text>
          
          {/* Bitcoin icon in the orange section */}
          <text x="125" y="140" fontSize="20" fontWeight="bold" fill="#FF851B">₿</text>
          
          {/* Black needle */}
          <g transform={`rotate(${needleAngle}, 150, 150)`}>
            <line 
              x1="150" 
              y1="150" 
              x2="150" 
              y2="70" 
              stroke="#000" 
              strokeWidth="2" 
            />
            <circle cx="150" cy="70" r="5" fill="#000" />
          </g>
          
          {/* Center pivot */}
          <circle cx="150" cy="150" r="3" fill="#000" />
          
          {/* Current value text */}
          <text x="150" y="180" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#666">
            Now: <tspan fill="#FF851B">{value} {classification}</tspan>
          </text>
        </svg>
      </div>
      
      {/* Last updated timestamp */}
      <div className="text-center text-xs text-gray-500">
        Last updated: {formattedDate}
      </div>
    </div>
  );
};

export default ImprovedFearGreedGauge; 