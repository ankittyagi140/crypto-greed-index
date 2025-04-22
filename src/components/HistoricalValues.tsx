import React from 'react';

interface HistoricalValue {
  label: string;
  value: string;
  classification: string;
}

interface HistoricalValuesProps {
  data: HistoricalValue[];
}

const HistoricalValues: React.FC<HistoricalValuesProps> = ({ data }) => {
  const getClassificationColor = (classification: string): { bg: string; text: string } => {
    switch (classification.toLowerCase()) {
      case 'neutral':
        return { bg: 'bg-yellow-500', text: 'text-yellow-500' };
      case 'fear':
        return { bg: 'bg-orange-500', text: 'text-orange-500' };
      case 'extreme fear':
        return { bg: 'bg-red-500', text: 'text-red-500' };
      case 'greed':
        return { bg: 'bg-green-500', text: 'text-green-500' };
      case 'extreme greed':
        return { bg: 'bg-green-600', text: 'text-green-600' };
      default:
        return { bg: 'bg-gray-500', text: 'text-gray-500' };
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Historical Values
      </h3>
      <div className="space-y-4">
        {data.map((item, index) => {
          const colors = getClassificationColor(item.classification);
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {item.label}
                </span>
                <span className={`text-sm font-medium ${colors.text} dark:text-opacity-90`}>
                  {item.classification}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center text-white font-bold`}>
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoricalValues; 