export default function FearAndGreedSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-lg animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center gap-2 mb-3 sm:mb-4">
        <div className="flex items-center">
          <div className="w-5 h-5 sm:w-6 sm:h-6 mr-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-4 sm:h-6 border-l border-gray-300 dark:border-gray-600 hidden sm:block"></div>
        <div className="w-48 sm:w-64 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      
      {/* Chart Area */}
      <div className="h-[300px] sm:h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg"></div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-3 sm:mt-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-1 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="w-16 sm:w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
} 