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
  const getClassificationColor = (classification: string): { bg: string; text: string; border: string; progress: string } => {
    switch (classification.toLowerCase()) {
      case 'neutral':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          border: 'border-yellow-200',
          progress: 'from-yellow-400 to-yellow-500'
        };
      case 'fear':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-700',
          border: 'border-orange-200',
          progress: 'from-orange-400 to-orange-500'
        };
      case 'extreme fear':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-200',
          progress: 'from-red-400 to-red-500'
        };
      case 'greed':
        return {
          bg: 'bg-emerald-100',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          progress: 'from-emerald-400 to-emerald-500'
        };
      case 'extreme greed':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-700',
          border: 'border-purple-200',
          progress: 'from-purple-400 to-purple-500'
        };
      default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-200',
          progress: 'from-slate-400 to-slate-500'
        };
    }
  };

  const getSentimentIcon = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'neutral':
        return '📊';
      case 'fear':
        return '📉';
      case 'extreme fear':
        return '⚠️';
      case 'greed':
        return '📈';
      case 'extreme greed':
        return '🚀';
      default:
        return '📊';
    }
  };

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const colors = getClassificationColor(item.classification);
        const sentimentIcon = getSentimentIcon(item.classification);
        const value = parseInt(item.value);
        const progressPercentage = (value / 100) * 100;

        return (
          <div
            key={index}
            className={`group relative p-4 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer backdrop-blur-sm`}
          >
            {/* Progress Bar Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-transparent rounded-xl"></div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 border border-slate-200">
                  <span className="text-lg">{sentimentIcon}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800">
                    {item.label}
                  </span>
                  <span className={`text-xs font-medium ${colors.text}`}>
                    {item.classification}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                {/* Circular Progress Indicator */}
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 w-12 h-12 rounded-full bg-slate-200"></div>
                  <div
                    className="absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-r from-slate-400 to-slate-500"
                    style={{
                      background: `conic-gradient(from 0deg, ${colors.progress} ${progressPercentage * 3.6}deg, #e2e8f0 ${progressPercentage * 3.6}deg, #e2e8f0 360deg)`
                    }}
                  ></div>
                  <div className="absolute inset-1 w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-800">{item.value}</span>
                  </div>
                </div>

                {/* Value Label */}
                <span className="text-xs font-medium text-slate-600">Score</span>
              </div>
            </div>

            {/* Hover Effect Line */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoricalValues; 