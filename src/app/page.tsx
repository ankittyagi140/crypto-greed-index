// pages/index.js
'use client'
import { useState, useEffect, Suspense } from 'react';
import { Line, ReferenceLine } from 'recharts';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Toaster, toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import Loader from '../components/Loader';

// Lazy load components
const MarketOverview = dynamic(() => import('../components/MarketOverview'), {
  loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-20"></div>,
  ssr: false
});

const TimeRangeSelector = dynamic(() => import('../components/TimeRangeSelector'), {
  loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-12"></div>
});

const FGIScore = dynamic(() => import('../components/FGIScore'));
const FAQSection = dynamic(() => import('../components/FAQSection'), {
  loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-96"></div>
});

const FearGreedMeter = dynamic(() => import('../components/FearGreedMeter'), {
  loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-64"></div>
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

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState<FearGreedData | null>(null);
  const [historicalData, setHistoricalData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  const [selectedRange, setSelectedRange] = useState("30");
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null);

  useEffect(() => {
    // Function to fetch the current fear and greed index and historical data
    const fetchData = async () => {
      const loadingToast = toast.loading('Fetching market data...');
      try {
        // Fetch 90 days of data to get quarterly comparison
        const response = await fetch('https://api.alternative.me/fng/?limit=90');
        const data = await response.json();
        
        if (data.data && data.data[0]) {
          setCurrentIndex(data.data[0]);
          
          // Set market sentiment data with actual historical values
          setMarketSentiment({
            now: {
              value: data.data[0].value,
              value_classification: data.data[0].value_classification
            },
            yesterday: {
              value: data.data[1]?.value || data.data[0].value,
              value_classification: data.data[1]?.value_classification || data.data[0].value_classification
            },
            lastWeek: {
              value: data.data[7]?.value || data.data[0].value,
              value_classification: data.data[7]?.value_classification || data.data[0].value_classification
            },
            lastMonth: {
              value: data.data[30]?.value || data.data[0].value,
              value_classification: data.data[30]?.value_classification || data.data[0].value_classification
            },
            lastQuarter: {
              value: data.data[89]?.value || data.data[0].value,
              value_classification: data.data[89]?.value_classification || data.data[0].value_classification
            }
          });

          // Format data for chart
          const formattedData = data.data
            .slice(0, parseInt(selectedRange))
            .map((item: FearGreedData) => ({
              date: new Date(item.timestamp * 1000).toLocaleDateString(),
              value: parseInt(item.value),
              classification: item.value_classification
            }))
            .reverse();
          
          setHistoricalData(formattedData);
          toast.success('Market data updated', {
            id: loadingToast,
            duration: 2000,
          });
        }
        
        setLoading(false);
      } catch (err:any) {
        const errorMessage = err.message ? err.message : 'Failed to fetch market data.';
        // setError(errorMessage);
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
  const CustomDot = (props: any) => {
    const { cx, cy, value, index } = props;
    return (
      <circle 
        key={`dot-${index}`}
        cx={cx} 
        cy={cy} 
        r={4} 
        fill={getIndexColor(value)}
        stroke={getIndexColor(value)}
      />
    );
  };

  // Custom active dot component
  const CustomActiveDot = (props: any) => {
    const { cx, cy, value, index } = props;
    return (
      <circle 
        key={`active-dot-${index}`}
        cx={cx} 
        cy={cy} 
        r={6} 
        fill={getIndexColor(value)}
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {loading && <Loader message="Loading data..." />}
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
      <Suspense fallback={<div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-20"></div>}>
        <MarketOverview />
      </Suspense>
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

        {/* FAQ Section */}
        <FAQSection />
      </main>
    </div>
  );
}