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
  BTCComparisonSkeleton,
  FAQSkeleton
} from '@/components/ChartSkeletons';

import TopCoins from '@/components/TopCoins';
import GaugeIndicator from '@/components/GaugeIndicator';
import TypewriterText from '@/components/TypewriterText';
import FearAndGreedChart from '@/components/FearAndGreedChart';


// Lazy load components with custom loading states
const MarketOverview = dynamic(() => import('@/components/MarketOverview'), {
  loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-20"></div>,
  ssr: false
});

const TimeRangeSelector = dynamic(() => import('@/components/TimeRangeSelector'));

// Lazy load chart components with custom loading states
const BTCComparison = dynamic(() => import('@/components/BTCComparison'), {
  loading: () => <BTCComparisonSkeleton />,
  ssr: false
});

const FAQSection = dynamic(() => import('@/components/FAQSection'), {
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

interface BTCData {
  date: string;
  fgi: number;
  btcPrice: number;
  fgiClassification: string;
}
export default function Home() {
  const [currentIndex, setCurrentIndex] = useState<FearGreedData | null>(null);
  const [historicalData, setHistoricalData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState('30');
  const [btcComparisonData, setBtcComparisonData] = useState<BTCData[]>([]);

  useEffect(() => {
    // Function to fetch all data
    const fetchData = async () => {
      const loadingToast = toast.loading('Fetching market data...');
      try {
        // Fetch all data in parallel
        const [fgiResponse, btcResponse] = await Promise.all([
          fetch('/api/fear-greed?limit=90'),
          fetch('/api/bitcoin-price?days=90'),
        ]);
        const [fgiData, btcData] = await Promise.all([
          fgiResponse.json(),
          btcResponse.json(),
        ]);

        if (fgiData.data && fgiData.data[0]) {
          setCurrentIndex(fgiData.data[0]);
                 
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
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4 tracking-tight">
            <TypewriterText 
              text="Crypto Fear & Greed Index"
              speed={50}
              delay={500}
              restartInterval={5000}
            />
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Make informed investment decisions by understanding market sentiment through our comprehensive analysis tools
          </p>
        </div>
        <MarketOverview />
        {currentIndex && (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              {/* Main content */}
              <div className="space-y-12">
                {/* Gauge Indicator Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12 transition-all duration-300 hover:shadow-xl">
                  <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center">
                      Crypto Fear and Greed Index today
                    </h2>
                    <GaugeIndicator 
                      value={parseInt(currentIndex.value)} 
                      classification={currentIndex.value_classification}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                      Last updated: {new Date(currentIndex.timestamp * 1000).toLocaleString()}
                    </p>
                  </div>
                </div>
               <FearAndGreedChart />
                
                {/* Historical Chart Section */}
                <LazyChartSection placeholder={<HistoricalChartSkeleton />}>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12 transition-all duration-300 hover:shadow-xl">
                    <div className="mb-8">
                      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3 text-center">
                        Fear & Greed Historical Trend Analysis
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 text-base text-center max-w-2xl mx-auto">
                        Track how market sentiment has evolved over time and identify patterns in investor behavior
                      </p>
                    </div>
                    
                    <TimeRangeSelector
                      selectedRange={selectedRange}
                      onRangeChange={(range) => setSelectedRange(range)}
                    />
                    
                    <div className="h-[400px] mt-8">
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
                    
                    <div className="mt-8 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                      <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4 text-center">Index Zones Explained</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-sm">
                        <div className="p-3 rounded-lg bg-[#E74C3C] text-white shadow-sm">
                          <div className="font-medium">0-25</div>
                          <div>Extreme Fear</div>
                        </div>
                        <div className="p-3 rounded-lg bg-[#E67E22] text-white shadow-sm">
                          <div className="font-medium">26-45</div>
                          <div>Fear</div>
                        </div>
                        <div className="p-3 rounded-lg bg-[#F1C40F] text-white shadow-sm">
                          <div className="font-medium">46-55</div>
                          <div>Neutral</div>
                        </div>
                        <div className="p-3 rounded-lg bg-[#2ECC71] text-white shadow-sm">
                          <div className="font-medium">56-75</div>
                          <div>Greed</div>
                        </div>
                        <div className="p-3 rounded-lg bg-[#27AE60] text-white shadow-sm">
                          <div className="font-medium">76-100</div>
                          <div>Extreme Greed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </LazyChartSection>

                {/* BTC Comparison */}
                <LazyChartSection>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12 transition-all duration-300 hover:shadow-xl">
                    <BTCComparison data={btcComparisonData} />
                  </div>
                </LazyChartSection>

                {/* Top Cryptocurrencies Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12 transition-all duration-300 hover:shadow-xl">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
                    Top 10 Cryptocurrencies
                  </h2>
                  <TopCoins />
                </div>

                {/* FAQ Section */}
                <LazyChartSection>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                    <FAQSection />
                  </div>
                </LazyChartSection>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}