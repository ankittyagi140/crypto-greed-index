import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

interface SocialPlatformData {
  sentiment: number;
  volume: number;
  positiveCount?: number;
  negativeCount?: number;
}

interface SentimentDataPoint {
  date: string;
  btcPrice: number;
  btcPriceMin: number;
  btcPriceMax: number;
  twitter: SocialPlatformData;
  reddit: SocialPlatformData;
  telegram: SocialPlatformData;
  aggregate: SocialPlatformData;
}

interface SocialSentimentProps {
  data: SentimentDataPoint[];
}

type PlatformId = 'all' | 'twitter' | 'reddit' | 'telegram';

interface Platform {
  id: PlatformId;
  name: string;
  color: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      date: string;
      btcPrice: number;
      btcPriceChange: number;
      sentiment: number;
      sentimentChange: number;
      volume: number;
      positive: number | null;
      negative: number | null;
      classification: string;
    };
  }>;
  label?: string;
}

const platforms: Platform[] = [
  { id: 'all', name: 'All Platforms', color: '#3B82F6' },
  { id: 'twitter', name: 'Twitter', color: '#1DA1F2' },
  { id: 'reddit', name: 'Reddit', color: '#FF4500' },
  { id: 'telegram', name: 'Telegram', color: '#0088CC' }
];

const SocialSentiment: React.FC<SocialSentimentProps> = ({ data }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('all');

  // Return early if no data
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-300 text-center">No data available</p>
      </div>
    );
  }

  // Get date range for display
  const dateRange = {
    start: new Date(data[0].date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    end: new Date(data[data.length - 1].date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  };

  // Format data based on selected platform
  const chartData = data.map((item, index) => {
    // Parse the date string and format it
    const [year, month] = item.date.split('-');
    const monthYear = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short'
    });

    // Ensure platform data exists before accessing
    const platformData = selectedPlatform === 'all' ? item.aggregate :
                        selectedPlatform === 'twitter' ? item.twitter :
                        selectedPlatform === 'reddit' ? item.reddit :
                        item.telegram;

    if (!platformData) {
      console.error(`Missing data for platform ${selectedPlatform} at index ${index}`);
      return null;
    }

    const sentiment = platformData.sentiment;
    const volume = platformData.volume;

    // Calculate month-over-month changes
    const prevItem = index > 0 ? data[index - 1] : null;
    const btcPriceChange = prevItem ? ((item.btcPrice - prevItem.btcPrice) / prevItem.btcPrice * 100) : 0;
    const sentimentChange = prevItem ? 
      (selectedPlatform === 'all' ? 
        ((platformData.sentiment - (prevItem.aggregate?.sentiment || 0)) / (prevItem.aggregate?.sentiment || 1) * 100) :
        ((sentiment - (selectedPlatform === 'twitter' ? prevItem.twitter?.sentiment :
                      selectedPlatform === 'reddit' ? prevItem.reddit?.sentiment :
                      prevItem.telegram?.sentiment || 0)) / 
         (selectedPlatform === 'twitter' ? prevItem.twitter?.sentiment :
          selectedPlatform === 'reddit' ? prevItem.reddit?.sentiment :
          prevItem.telegram?.sentiment || 1) * 100)) : 0;

    return {
      date: monthYear,
      btcPrice: item.btcPrice,
      btcPriceChange: Math.round(btcPriceChange * 10) / 10,
      sentiment,
      sentimentChange: Math.round(sentimentChange * 10) / 10,
      volume,
      positive: selectedPlatform !== 'all' ? 
               platformData.positiveCount : null,
      negative: selectedPlatform !== 'all' ? 
               platformData.negativeCount : null,
      classification: sentiment >= 75 ? 'Very Bullish' :
                     sentiment >= 60 ? 'Bullish' :
                     sentiment >= 40 ? 'Neutral' :
                     sentiment >= 25 ? 'Bearish' : 'Very Bearish'
    };
  }).filter(Boolean); // Remove any null entries

  // Calculate averages for the reference lines
  const averages = chartData.reduce((acc, item) => {
    if (!item) return acc;
    acc.sentiment += item.sentiment;
    acc.volume += item.volume;
    acc.btcPrice += item.btcPrice;
    return acc;
  }, { sentiment: 0, volume: 0, btcPrice: 0 });

  const avgSentiment = averages.sentiment / chartData.length;
  const avgBtcPrice = averages.btcPrice / chartData.length;

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                BTC Price: ${payload[0].payload.btcPrice.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                MoM Change: {payload[0].payload.btcPriceChange > 0 ? '+' : ''}{payload[0].payload.btcPriceChange}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Sentiment: {payload[0].payload.sentiment.toFixed(1)} ({payload[0].payload.classification})
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                MoM Change: {payload[0].payload.sentimentChange > 0 ? '+' : ''}{payload[0].payload.sentimentChange}%
              </p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Volume: {payload[0].payload.volume.toLocaleString()}
            </p>
            {selectedPlatform !== 'all' && (
              <>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Positive: {payload[0].payload.positive?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Negative: {payload[0].payload.negative?.toLocaleString() || 0}
                </p>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-12">
      <div className="mb-6 flex flex-col gap-2 items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          12-Month Social Media Sentiment & BTC Price Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
          {dateRange.start} - {dateRange.end}
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Month-by-month analysis of cryptocurrency sentiment and price trends
        </p>
        
        {/* Platform selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {platforms.map(platform => (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedPlatform === platform.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {platform.name}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{
                value: 'Sentiment Score',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#666' }
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 'auto']}
              tick={{ fontSize: 12 }}
              label={{
                value: 'Volume',
                angle: 90,
                position: 'insideRight',
                style: { fill: '#666' }
              }}
            />
            <YAxis
              yAxisId="price"
              orientation="right"
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
              label={{
                value: 'BTC Price',
                angle: 90,
                position: 'insideRight',
                offset: 50,
                style: { fill: '#666' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Reference lines for averages */}
            <ReferenceLine 
              y={avgSentiment} 
              yAxisId="left" 
              stroke="#666" 
              strokeDasharray="3 3" 
              label={{ 
                value: 'Avg Sentiment',
                position: 'insideLeft',
                fill: '#666',
                fontSize: 10
              }} 
            />
            <ReferenceLine 
              y={avgBtcPrice} 
              yAxisId="price" 
              stroke="#F7931A" 
              strokeDasharray="3 3"
              label={{ 
                value: 'Avg BTC Price',
                position: 'insideRight',
                fill: '#F7931A',
                fontSize: 10
              }} 
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sentiment"
              name="Sentiment Score"
              stroke={platforms.find(p => p.id === selectedPlatform)?.color || '#3B82F6'}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Bar
              yAxisId="right"
              dataKey="volume"
              name="Volume"
              fill={platforms.find(p => p.id === selectedPlatform)?.color || '#3B82F6'}
              fillOpacity={0.2}
            />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="btcPrice"
              name="BTC Price"
              stroke="#F7931A"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Understanding the Metrics
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
          <li>Displaying last 12 months of data ({dateRange.start} - {dateRange.end})</li>
          <li>Sentiment Score: 0-25 (Very Bearish), 25-40 (Bearish), 40-60 (Neutral), 60-75 (Bullish), 75-100 (Very Bullish)</li>
          <li>Month-over-Month (MoM) changes shown in tooltips</li>
          <li>Volume shows the average daily activity for each month</li>
          <li>Dotted lines show yearly averages for sentiment and BTC price</li>
        </ul>
      </div>
    </div>
  );
};

export default SocialSentiment; 