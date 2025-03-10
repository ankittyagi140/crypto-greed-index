'use client';

import { useState, useEffect } from 'react';

interface UpdateTimerProps {
  lastUpdated: number; // Unix timestamp
}

export default function UpdateTimer({ lastUpdated }: UpdateTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      
      // Next update is 12 hours after the last update
      const nextUpdate = lastUpdated + (12 * 60 * 60); // 12 hours in seconds
      const diff = nextUpdate - now;

      if (diff <= 0) {
        // If more than 12 hours have passed, calculate the next update time
        const hoursUntilNextUpdate = 12 - (Math.abs(diff) % (12 * 60 * 60)) / 3600;
        const newDiff = Math.floor(hoursUntilNextUpdate * 3600);
        
        if (newDiff <= 0) {
          return 'Updating...';
        }

        const hoursLeft = Math.floor(newDiff / 3600);
        const minutesLeft = Math.floor((newDiff % 3600) / 60);
        const secondsLeft = newDiff % 60;

        return `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
      }

      const hoursLeft = Math.floor(diff / 3600);
      const minutesLeft = Math.floor((diff % 3600) / 60);
      const secondsLeft = diff % 60;

      return `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [lastUpdated]);

  return (
    <div className="text-center mt-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Next Update In
      </p>
      <p className="text-base font-mono text-gray-800 dark:text-gray-200">
        {timeLeft}
      </p>
    </div>
  );
} 