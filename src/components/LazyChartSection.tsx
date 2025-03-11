import React, { useEffect, useRef, useState } from 'react';

interface LazyChartSectionProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
}

const LazyChartSection: React.FC<LazyChartSectionProps> = ({ children, placeholder }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading when chart is 100px from viewport
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {isVisible ? children : (
        placeholder || (
          <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        )
      )}
    </div>
  );
};

export default LazyChartSection; 