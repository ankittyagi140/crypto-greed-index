import { useMemo } from 'react';
import ShareButtons from './ShareButtons';

interface FearAndGreedIndexProps {
  value: number;
  classification: string;
}

export default function FearAndGreedIndex({ value, classification }: FearAndGreedIndexProps) {
  const getBackgroundColor = (value: number) => {
    if (value <= 20) return 'bg-red-500';
    if (value <= 40) return 'bg-orange-500';
    if (value <= 60) return 'bg-yellow-500';
    if (value <= 80) return 'bg-lime-500';
    return 'bg-green-500';
  };

  const shareText = useMemo(() => {
    return `🎯 Crypto Fear & Greed Index\n` +
           `Current Value: ${value}\n` +
           `Classification: ${classification}\n` +
           `\nTrack market sentiment and make informed decisions!`;
  }, [value, classification]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Crypto Fear & Greed Index
      </h2>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center ${getBackgroundColor(value)}`}>
          <span className="text-4xl font-bold text-white">{value}</span>
        </div>
        <div className="text-xl font-semibold text-gray-900 dark:text-white">
          {classification}
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The Fear & Greed Index is a way to gauge market sentiment. Extreme fear can mean investors are too worried, while extreme greed may signal the market is due for a correction.
          </p>
        </div>
        <ShareButtons 
          title="Crypto Fear & Greed Index"
          text={shareText}
          hashtags={['crypto', 'fearandgreed', 'marketsentiment']}
        />
      </div>
    </div>
  );
} 