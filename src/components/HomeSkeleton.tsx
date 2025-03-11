import React from 'react';

const HomeSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4"></div>
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
      </div>

      {/* Fear & Greed Index Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="w-48 h-48 rounded-full bg-gray-200 dark:bg-gray-700 mt-4 md:mt-0"></div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center space-x-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Historical Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Market Sentiment Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Social Sentiment Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* BTC Comparison Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton; 