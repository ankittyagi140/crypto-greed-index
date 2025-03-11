import React from 'react';

export const HistoricalChartSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-12">
    <div className="mb-6">
      <div className="h-7 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2"></div>
      <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
    </div>
    <div className="flex justify-center space-x-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      ))}
    </div>
    <div className="h-[400px] bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

export const SocialSentimentSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
    <div className="h-7 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      ))}
    </div>
    <div className="h-[300px] bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

export const BTCComparisonSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
    <div className="h-7 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
    <div className="h-[400px] bg-gray-200 dark:bg-gray-700 rounded"></div>
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

export const FAQSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
    {[...Array(4)].map((_, i) => (
      <div key={i} className="mb-4">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    ))}
  </div>
); 