import React from 'react';

interface PercentBadgeProps {
  value: number;
}

export default function PercentBadge({ value }: PercentBadgeProps) {
  const isPositive = value >= 0;
  const textColor = isPositive ? 'text-green-500' : 'text-red-500';
  const arrowSymbol = isPositive ? '▲' : '▼';
  
  return (
    <div className="inline-flex items-center">
      <span className={textColor}>{arrowSymbol} {Math.abs(value).toFixed(2)}%</span>
    </div>
  );
} 