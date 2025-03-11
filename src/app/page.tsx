// pages/index.js
'use client'
import { useState, useEffect } from 'react';
import { Line, ReferenceLine } from 'recharts';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Toaster, toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import HomeSkeleton from '@/components/HomeSkeleton';
import LazyChartSection from '@/components/LazyChartSection';
import {
  HistoricalChartSkeleton,
  SocialSentimentSkeleton,
  BTCComparisonSkeleton,
  FAQSkeleton
} from '@/components/ChartSkeletons';

// Lazy load components with custom loading states
const MarketOverview = dynamic(() => import('../components/MarketOverview'), {
  loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-20"></div>,
  ssr: false
});

const TimeRangeSelector = dynamic(() => import('../components/TimeRangeSelector'));
const FGIScore = dynamic(() => import('../components/FGIScore'));
const FearGreedMeter = dynamic(() => import('../components/FearGreedMeter'));

// Lazy load chart components with custom loading states
const BTCComparison = dynamic(() => import('../components/BTCComparison'), {
  loading: () => <BTCComparisonSkeleton />,
  ssr: false
});

const SocialSentiment = dynamic(() => import('../components/SocialSentiment'), {
  loading: () => <SocialSentimentSkeleton />,
  ssr: false
});

const FAQSection = dynamic(() => import('../components/FAQSection'), {
  loading: () => <FAQSkeleton />,
  ssr: false
});

interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: number;
}

interface ChartData {
  date: string;
  value: number;
  classification: string;
}

interface DotProps {
  cx?: number;
  cy?: number;
  value?: number;
  index?: number;
}

interface MarketSentiment {
  now: {
    value: string;
    value_classification: string;
  };
  yesterday: {
    value: string;
    value_classification: string;
  };
  lastWeek: {
    value: string;
    value_classification: string;
  };
  lastMonth: {
    value: string;
    value_classification: string;
  };
  lastQuarter: {
    value: string;
    value_classification: string;
  };
}

interface BTCData {
  date: string;
  fgi: number;
  btcPrice: number;
  fgiClassification: string;
}

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
  aggregate: {
    sentiment: number;
    volume: number;
  };
}

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState<FearGreedData | null>(null);
  const [historicalData, setHistoricalData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState('30');
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null);
  const [btcComparisonData, setBtcComparisonData] = useState<BTCData[]>([]);
  const [socialSentimentData, setSocialSentimentData] = useState<SentimentDataPoint[]>([]);

  useEffect(() => {
    // Function to fetch all data
    const fetchData = async () => {
      const loadingToast = toast.loading('Fetching market data...');
      try {
        // Fetch all data in parallel
        const [fgiResponse, btcResponse, socialResponse] = await Promise.all([
          fetch('/api/fear-greed?limit=90'),
          fetch('/api/bitcoin-price?days=90'),
          fetch('/api/social-sentiment?days=365')
        ]);

        const [fgiData, btcData, socialData] = await Promise.all([
          fgiResponse.json(),
          btcResponse.json(),
          socialResponse.json()
        ]);

        // Set social sentiment data directly since it now includes proper BTC price data
        if (socialData.success && Array.isArray(socialData.data)) {
          setSocialSentimentData(socialData.data);
        }

        if (fgiData.data && fgiData.data[0]) {
          setCurrentIndex(fgiData.data[0]);
          
          // Set market sentiment data
          setMarketSentiment({
            now: {
              value: fgiData.data[0].value,
              value_classification: fgiData.data[0].value_classification
            },
            yesterday: {
              value: fgiData.data[1]?.value || fgiData.data[0].value,
              value_classification: fgiData.data[1]?.value_classification || fgiData.data[0].value_classification
            },
            lastWeek: {
              value: fgiData.data[7]?.value || fgiData.data[0].value,
              value_classification: fgiData.data[7]?.value_classification || fgiData.data[0].value_classification
            },
            lastMonth: {
              value: fgiData.data[30]?.value || fgiData.data[0].value,
              value_classification: fgiData.data[30]?.value_classification || fgiData.data[0].value_classification
            },
            lastQuarter: {
              value: fgiData.data[89]?.value || fgiData.data[0].value,
              value_classification: fgiData.data[89]?.value_classification || fgiData.data[0].value_classification
            }
          });

          // Format data for charts
          const formattedData = fgiData.data
            .slice(0, parseInt(selectedRange))
            .map((item: FearGreedData) => ({
              date: new Date(item.timestamp * 1000).toLocaleDateString(),
              value: parseInt(item.value),
              classification: item.value_classification
            }))
            .reverse();
          
          setHistoricalData(formattedData);

          // Prepare combined BTC and FGI data
          if (btcData.prices) {
            const combinedData = fgiData.data
              .slice(0, 90)
              .map((fgiItem: FearGreedData, index: number) => {
                const btcPrice = btcData.prices[index] ? btcData.prices[index][1] : null;
                return {
                  date: new Date(fgiItem.timestamp * 1000).toLocaleDateString(),
                  fgi: parseInt(fgiItem.value),
                  btcPrice: btcPrice,
                  fgiClassification: fgiItem.value_classification
                };
              })
              .reverse()
              .filter((item: BTCData) => item.btcPrice !== null);

            setBtcComparisonData(combinedData);
          }

          toast.success('Market data updated', {
            id: loadingToast,
            duration: 2000,
          });
        }
        
        setLoading(false);
      } catch (err: Error | unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch market data.';
        toast.error(errorMessage, {
          id: loadingToast,
          duration: 4000,
        });
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for real-time updates (every 5 minutes)
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, [selectedRange]);

  // Function to determine the color based on the index value
  const getIndexColor = (value: number) => {
    if (value >= 0 && value <= 25) return '#E74C3C'; // Extreme Fear (Red)
    if (value > 25 && value <= 45) return '#E67E22'; // Fear (Orange)
    if (value > 45 && value <= 55) return '#F1C40F'; // Neutral (Yellow)
    if (value > 55 && value <= 75) return '#2ECC71'; // Greed (Green)
    return '#27AE60'; // Extreme Greed (Dark Green)
  };

  // Custom dot component for the line chart
  const CustomDot = (props: DotProps) => {
    const { cx, cy, value, index } = props;
    return (
      <circle 
        key={`dot-${index}`}
        cx={cx} 
        cy={cy} 
        r={4} 
        fill={getIndexColor(value || 0)}
        stroke={getIndexColor(value || 0)}
      />
    );
  };

  // Custom active dot component
  const CustomActiveDot = (props: DotProps) => {
    const { cx, cy, value, index } = props;
    return (
      <circle 
        key={`active-dot-${index}`}
        cx={cx} 
        cy={cy} 
        r={6} 
        fill={getIndexColor(value || 0)}
        stroke="#FFF"
        strokeWidth={2}
      />
    );
  };

  // Function to get a description of the current index
  // const getIndexDescription = (classification: string) => {
  //   switch (classification) {
  //     case 'Extreme Fear':
  //       return 'Investors are in extreme fear. This could be a buying opportunity.';
  //     case 'Fear':
  //       return 'Investors are fearful, which may indicate undervalued markets.';
  //     case 'Neutral':
  //       return 'Market sentiment is balanced.';
  //     case 'Greed':
  //       return 'Investors are showing greed. The market might be overvalued.';
  //     case 'Extreme Greed':
  //       return 'Investors are showing extreme greed. Consider this a warning sign.';
  //     default:
  //       return '';
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <main className="container mx-auto px-4 py-8">
          <HomeSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#10B981',
              color: 'white',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: 'white',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#EF4444',
            },
          },
          loading: {
            style: {
              background: '#3B82F6',
              color: 'white',
            },
          },
        }}
      />
      <MarketOverview />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Crypto Fear & Greed Index
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base max-w-2xl mx-auto">
            A powerful tool that measures market sentiment, helping you make informed investment decisions
          </p>
        </div>
        
        {currentIndex && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column - Fear & Greed Meter */}
              <div className="flex flex-col items-center justify-center">
                <FearGreedMeter
                  value={parseInt(currentIndex.value)}
                  classification={currentIndex.value_classification}
                  lastUpdated={new Date(currentIndex.timestamp * 1000).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                  timestamp={currentIndex.timestamp}
                />
              </div>
              
              {/* Right column - Market Sentiment */}
              {marketSentiment && (
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Market Sentiment</h3>
                  <div className="space-y-4">
                    <FGIScore
                      title="Now"
                      value={parseInt(marketSentiment.now.value)}
                      classification={marketSentiment.now.value_classification}
                    />
                    <FGIScore
                      title="Yesterday"
                      value={parseInt(marketSentiment.yesterday.value)}
                      classification={marketSentiment.yesterday.value_classification}
                    />
                    <FGIScore
                      title="Last Week"
                      value={parseInt(marketSentiment.lastWeek.value)}
                      classification={marketSentiment.lastWeek.value_classification}
                    />
                    <FGIScore
                      title="Last Month"
                      value={parseInt(marketSentiment.lastMonth.value)}
                      classification={marketSentiment.lastMonth.value_classification}
                    />
                 
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Historical Chart Section */}
        <LazyChartSection placeholder={<HistoricalChartSkeleton />}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-12">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 text-center">
                Historical Trend Analysis
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                Track the evolution of market sentiment over time
              </p>
            </div>
            
            <TimeRangeSelector
              selectedRange={selectedRange}
              onRangeChange={(range) => setSelectedRange(range)}
            />
            
            <div className="h-[400px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={historicalData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval="preserveEnd"
                    padding={{ left: 20, right: 20 }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    padding={{ top: 20, bottom: 20 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [
                      `${value} (${historicalData.find(d => d.value === value)?.classification || ''})`,
                      'Index Value'
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                    itemStyle={{ color: '#666' }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                  {/* Reference areas for different zones */}
                  <ReferenceLine y={25} stroke="#E74C3C" strokeDasharray="3 3" />
                  <ReferenceLine y={45} stroke="#E67E22" strokeDasharray="3 3" />
                  <ReferenceLine y={55} stroke="#F1C40F" strokeDasharray="3 3" />
                  <ReferenceLine y={75} stroke="#2ECC71" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Fear & Greed Index"
                    stroke="#666"
                    strokeWidth={2}
                    dot={CustomDot}
                    activeDot={CustomActiveDot}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">Index Zones</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-[#E74C3C] text-white">
                  <div>0-25</div>
                  <div>Extreme Fear</div>
                </div>
                <div className="p-2 rounded bg-[#E67E22] text-white">
                  <div>26-45</div>
                  <div>Fear</div>
                </div>
                <div className="p-2 rounded bg-[#F1C40F] text-white">
                  <div>46-55</div>
                  <div>Neutral</div>
                </div>
                <div className="p-2 rounded bg-[#2ECC71] text-white">
                  <div>56-75</div>
                  <div>Greed</div>
                </div>
                <div className="p-2 rounded bg-[#27AE60] text-white">
                  <div>76-100</div>
                  <div>Extreme Greed</div>
                </div>
              </div>
            </div>
          </div>
        </LazyChartSection>

        {/* Social Sentiment Analysis */}
        <LazyChartSection>
          {socialSentimentData.length > 0 && (
            <SocialSentiment data={socialSentimentData} />
          )}
        </LazyChartSection>

        {/* BTC Comparison */}
        <LazyChartSection>
          <BTCComparison data={btcComparisonData} />
        </LazyChartSection>

        {/* FAQ Section */}
        <LazyChartSection>
          <FAQSection />
        </LazyChartSection>
      </main>
    </div>
  );
}