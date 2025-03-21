'use client';

import React from 'react';
import { PieChart, Pie, Cell } from "recharts";

interface GaugeIndicatorProps {
  value: number;
  classification: string;
}

const GaugeIndicator: React.FC<GaugeIndicatorProps> = ({ value, classification }) => {
  const gaugeValue = Math.max(0, Math.min(value, 100)); // Ensure value is within 0-100

  // Define colors for different sections
  const COLORS = {
    extremeFear: '#E53E3E', // Red
    fear: '#ED8936',       // Orange
    greed: '#48BB78',      // Light Green
    extremeGreed: '#38A169' // Green
  };

  // Get color based on value
  const getColorForValue = (val: number) => {
    if (val <= 24) return COLORS.extremeFear;
    if (val <= 49) return COLORS.fear;
    if (val <= 74) return COLORS.greed;
    return COLORS.extremeGreed;
  };

  // Define gauge sectors
  const data = [
    { name: 'Extreme Fear', value: 25 },
    { name: 'Fear', value: 25 },
    { name: 'Greed', value: 25 },
    { name: 'Extreme Greed', value: 25 }
  ];

  // Calculate needle rotation based on value
  const needleRotation = gaugeValue * 1.8 - 90; // Convert 0-100 to -90 to 90 degrees

  // Chart dimensions
  const chartWidth = 600;
  const chartHeight = 300;
  const centerX = chartWidth / 2;
  const centerY = chartHeight;

  // Current color based on value
  const currentColor = getColorForValue(gaugeValue);

  return (
    <div className="relative w-full max-w-[700px] mx-auto">
      <div className="relative flex justify-center items-center">
        <PieChart width={chartWidth} height={chartHeight}>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={140}
            outerRadius={200}
            fill="#ddd"
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={Object.values(COLORS)[index]}
              />
            ))}
          </Pie>
          
          {/* Center point for needle */}
          <circle cx="50%" cy="100%" r="8" fill="#333" />
          
          {/* Needle */}
          <g 
            transform={`translate(${centerX}, ${centerY}) rotate(${needleRotation})`}
            style={{
              transition: 'transform 0.5s ease-out'
            }}
          >
            {/* Main needle line */}
            <line 
              x1="0" 
              y1="0" 
              x2="0" 
              y2="-170" 
              stroke="#333" 
              strokeWidth="3"
            />
            
            {/* Bitcoin logo at needle tip */}
            <circle cx="0" cy="-170" r="20" fill="#F7931A" />
            <text
              x="0"
              y="-170"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="20"
              fontWeight="bold"
            >
              ₿
            </text>
          </g>
        </PieChart>

        {/* Scale markers */}
        <div className="absolute top-[85%] left-[17%] text-xs sm:text-sm md:text-base font-medium text-gray-600">0</div>
        <div className="absolute top-[40%] left-[25%] text-xs sm:text-sm md:text-base font-medium text-gray-600">25</div>
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 text-xs sm:text-sm md:text-base font-medium text-gray-600">50</div>
        <div className="absolute top-[40%] right-[25%] text-xs sm:text-sm md:text-base font-medium text-gray-600">75</div>
        <div className="absolute top-[85%] right-[15%] text-xs sm:text-sm md:text-base font-medium text-gray-600">100</div>
      </div>

      {/* Current value and classification */}
      <div className="text-center">
        <div className="font-semibold flex items-center justify-center gap-2">
            <span className="text-gray-400 dark:text-white">Now:</span>
          <span style={{ color: currentColor }} className="font-bold text-xl"> {value}</span>
          <span style={{ color: currentColor }} className="font-bold text-xl">{classification}</span>
        </div>
      </div>

   
    </div>
  );
};

export default GaugeIndicator; 