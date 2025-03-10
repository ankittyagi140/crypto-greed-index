interface TimeRangeSelectorProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

export default function TimeRangeSelector({ selectedRange, onRangeChange }: TimeRangeSelectorProps) {
  const ranges = [
    { value: '7', label: '1 Week' },
    { value: '30', label: '1 Month' },
    { value: '365', label: '1 Year' },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="inline-flex bg-gray-100 rounded-lg p-1 shadow-inner">
        {ranges.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onRangeChange(value)}
            className={`
              px-6 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${selectedRange === value
                ? 'bg-white text-blue-600 shadow-md transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
} 