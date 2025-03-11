const Skeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8 animate-pulse">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4"></div>
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
      </div>

      {/* Mission Section */}
      <div className="space-y-4">
        <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="space-y-4">
        <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-600 rounded"></div>
              <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Section */}
      <div className="space-y-4">
        <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>

      {/* Data Sources Section */}
      <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default Skeleton; 