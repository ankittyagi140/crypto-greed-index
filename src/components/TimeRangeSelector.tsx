interface TimeRangeSelectorProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

export default function TimeRangeSelector({ selectedRange, onRangeChange }: TimeRangeSelectorProps) {
  const ranges = [
    { value: '7', label: '1W', fullLabel: '1 Week' },
    { value: '30', label: '1M', fullLabel: '1 Month' },
    { value: '90', label: '3M', fullLabel: '3 Months' },
    { value: '180', label: '6M', fullLabel: '6 Months' },
    { value: '365', label: '1Y', fullLabel: '1 Year' },
  ];

  return (
    <div className="w-full max-w-[500px] px-2 sm:px-4 mx-auto">
      <div className="grid grid-cols-5 sm:inline-flex bg-gray-100 dark:bg-gray-700/50 rounded-lg p-0.5 sm:p-1 gap-0.5 sm:gap-1">
        {ranges.map(({ value, label, fullLabel }) => (
          <button
            key={value}
            onClick={() => onRangeChange(value)}
            className={`
              px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium 
              transition-all duration-200 whitespace-nowrap cursor-pointer
              ${selectedRange === value
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm transform scale-[1.02]'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
              }
            `}
            title={fullLabel}
          >
            <span className="block sm:hidden">{label}</span>
            <span className="hidden sm:block">{fullLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 