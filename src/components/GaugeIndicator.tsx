'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from "recharts";

interface GaugeIndicatorProps {
  value: number;
  classification: string;
}

const GaugeIndicator: React.FC<GaugeIndicatorProps> = ({ value, classification }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setAnimatedValue(value);
      setIsAnimating(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const gaugeValue = Math.max(0, Math.min(animatedValue, 100)); // Ensure value is within 0-100

  // Define colors for different sections with enhanced gradients
  const COLORS = {
    extremeFear: '#EF4444', // Red
    fear: '#F97316',       // Orange
    greed: '#10B981',      // Light Green
    extremeGreed: '#059669' // Green
  };

  // Get color based on value
  // const getColorForValue = (val: number) => {
  //   if (val <= 24) return COLORS.extremeFear;
  //   if (val <= 49) return COLORS.fear;
  //   if (val <= 74) return COLORS.greed;
  //   return COLORS.extremeGreed;
  // };

  // Define gauge sectors
  const data = [
    { name: 'Extreme Fear', value: 25 },
    { name: 'Fear', value: 25 },
    { name: 'Greed', value: 25 },
    { name: 'Extreme Greed', value: 25 }
  ];

  // Calculate needle rotation based on value
  // The gauge spans from 0 (left) to 100 (right), which is 180 degrees
  // We need to convert the value to the correct angle position
  // 0 should point to -90 degrees (left), 50 should point to 0 degrees (up), 100 should point to 90 degrees (right)
  const needleRotation = (gaugeValue - 50) * 1.8; // Convert 0-100 to -90 to 90 degrees

  // Chart dimensions
  const chartWidth = 600;
  const chartHeight = 300;


  // Current color based on value
  // const currentColor = getColorForValue(gaugeValue);

  // Get sentiment icon (professional)
  const getSentimentIcon = (val: number) => {
    if (val <= 24) return '⚠️';
    if (val <= 49) return '📉';
    if (val <= 74) return '📈';
    return '🚀';
  };

  return (
    <div className="relative w-full max-w-[700px] mx-auto group">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

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
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Pie>

          {/* Center point for needle with enhanced styling */}
          <circle cx="50%" cy="100%" r="12" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
        </PieChart>

        {/* Needle positioned absolutely above the chart */}
        <div
          className="absolute left-1/2 bottom-0 -translate-x-1/2 pointer-events-none origin-bottom"
          style={{
            transform: `rotate(${needleRotation}deg)`,
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Main needle line */}
          <div className="w-[6px] h-[180px] bg-gradient-to-b from-slate-800 to-slate-600 rounded-full shadow-lg"></div>

          {/* Bitcoin logo at needle tip */}
          <div className="absolute -top-7 w-10 h-10 bg-[#F7931A] rounded-full border-2 border-[#EAB308] flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">₿</span>
          </div>
        </div>

        {/* Enhanced scale markers with better positioning */}
        <div className="absolute top-[85%] left-[12%] text-xs sm:text-sm md:text-base font-bold text-slate-700 bg-white/80 px-2 py-1 rounded-full shadow-sm">0</div>
        <div className="absolute top-[40%] left-[25%] text-xs sm:text-sm md:text-base font-bold text-slate-700 bg-white/80 px-2 py-1 rounded-full shadow-sm">25</div>
        <div className="absolute top-[25%] left-[50%] -translate-x-1/2 text-xs sm:text-sm md:text-base font-bold text-slate-700 bg-white/80 px-2 py-1 rounded-full shadow-sm">50</div>
        <div className="absolute top-[40%] right-[25%] text-xs sm:text-sm md:text-base font-bold text-slate-700 bg-white/80 px-2 py-1 rounded-full shadow-sm">75</div>
        <div className="absolute top-[85%] right-[10%] text-xs sm:text-sm md:text-base font-bold text-slate-700 bg-white/80 px-2 py-1 rounded-full shadow-sm">100</div>
      </div>

      {/* Enhanced current value and classification display */}
      <div className="text-center mt-6">
        <div className="inline-flex items-center gap-4 bg-gradient-to-r from-white to-slate-50 px-8 py-6 rounded-2xl shadow-xl border border-slate-200/50">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-slate-800 mb-2">
              {isAnimating ? '...' : gaugeValue}
            </div>
            <div className="text-lg text-slate-600 font-semibold">
              {isAnimating ? 'Calculating...' : classification}
            </div>
          </div>
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
            <span className="text-2xl">{getSentimentIcon(gaugeValue)}</span>
          </div>
        </div>
      </div>

      {/* Sentiment indicator line */}
      <div className="mt-4 flex justify-center">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span>Extreme Fear</span>
          <div className="w-16 h-1 bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-emerald-500 to-purple-500 rounded-full"></div>
          <span>Extreme Greed</span>
        </div>
      </div>
    </div>
  );
};

export default GaugeIndicator; 