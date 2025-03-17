'use client';

import React, { useState, useEffect } from 'react';

interface DailyData {
  date: string;
  value: number;
  classification: string;
}

interface Last30DaysChartProps {
  data: DailyData[];
}

// Colors matching the GaugeIndicator component
const COLORS = {
  'Extreme Fear': '#E53E3E', // Red
  'Fear': '#ED8936',        // Orange
  'Greed': '#48BB78',       // Light Green
  'Extreme Greed': '#38A169' // Green
};

// Helper function to get color based on value
const getColorForValue = (val: number) => {
  if (val <= 24) return COLORS['Extreme Fear'];
  if (val <= 49) return COLORS['Fear'];
  if (val <= 74) return COLORS['Greed'];
  return COLORS['Extreme Greed'];
};

export default function Last30DaysChart({ data }: Last30DaysChartProps) {
  // Ensure we only show the last 30 days
  const last30Days = data.slice(0, 30);
  const maxHeight = 150; // Maximum height for bars
  
  // Y-axis markers
  const yAxisMarkers = [0, 25, 50, 75, 100];
  
  // State to track screen size
  const [screenSize, setScreenSize] = useState('desktop');
  
  // Update screen size state on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1200) {
        setScreenSize('laptop');
      } else {
        setScreenSize('desktop');
      }
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Get bar width based on screen size
  const getBarWidth = () => {
    switch (screenSize) {
      case 'mobile':
        return '2px';
      case 'laptop':
        return '8px';
      case 'desktop':
        return '12px';
      default:
        return '410px';
    }
  };

  // Get bar max width based on screen size
  const getBarMaxWidth = () => {
    switch (screenSize) {
      case 'mobile':
        return '2px';
      case 'laptop':
        return '8px';
      case 'desktop':
        return '12px';
      default:
        return '10px';
    }
  };
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
        Last 30 Days Sentiment
      </h3>
      
      <div className="w-full overflow-hidden">
        <div className="flex">
          {/* Y-axis */}
          <div className="pr-2 flex flex-col justify-between h-[180px] text-xs text-gray-500">
            {yAxisMarkers.reverse().map((value) => (
              <div key={value} className="flex items-center">
                <span>{value}</span>
              </div>
            ))}
          </div>
          
          {/* Chart area */}
          <div className="flex-1">
            <div className="flex items-end h-[180px] justify-between w-full relative">
              {/* Horizontal grid lines */}
              {yAxisMarkers.reverse().map((value) => (
                <div 
                  key={value} 
                  className="absolute w-full border-t border-gray-200 dark:border-gray-700"
                  style={{ 
                    bottom: `${(value / 100) * maxHeight}px`, 
                    borderStyle: value === 0 ? 'solid' : 'dashed',
                    opacity: value === 0 ? 1 : 0.5
                  }}
                />
              ))}
              
              {/* Bars */}
              {last30Days.map((day, index) => {
                const barHeight = (day.value / 100) * maxHeight;
                return (
                  <div key={index} className="flex flex-col items-center z-10" style={{ width: `${100 / last30Days.length}%` }}>
                    <div 
                      className="w-full mx-auto transition-all duration-300 ease-in-out rounded-t"
                      style={{ 
                        height: `${barHeight}px`,
                        backgroundColor: getColorForValue(day.value),
                        width: getBarWidth(),
                        maxWidth: getBarMaxWidth()
                      }}
                    />
                  </div>
                );
              })}
            </div>
            
            {/* X-axis dates */}
            <div className="flex justify-between w-full mt-2">
              {last30Days.map((day, index) => (
                <div key={index} className="flex flex-col items-center" style={{ width: `${100 / last30Days.length}%` }}>
                  {/* Show fewer dates on mobile */}
                  {(screenSize === 'mobile' ? index % 7 === 0 : screenSize === 'laptop' ? index % 5 === 0 : index % 3 === 0) && (
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS['Extreme Fear'] }}></div>
          <span className="text-gray-600 dark:text-gray-400">0-24: Extreme Fear</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS['Fear'] }}></div>
          <span className="text-gray-600 dark:text-gray-400">25-49: Fear</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS['Greed'] }}></div>
          <span className="text-gray-600 dark:text-gray-400">50-74: Greed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS['Extreme Greed'] }}></div>
          <span className="text-gray-600 dark:text-gray-400">75-100: Extreme Greed</span>
        </div>
      </div>
    </div>
  );
}