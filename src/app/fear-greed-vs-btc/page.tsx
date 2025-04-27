'use client'

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import TimeRangeSelector from '../../components/TimeRangeSelector';
import { HistoricalChartSkeleton, BTCComparisonSkeleton } from '../../components/ChartSkeletons';
import LazyChartSection from '../../components/LazyChartSection';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

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

interface BTCData {
    date: string;
    fgi: number;
    btcPrice: number;
    fgiClassification: string;
  }

interface DotProps {
  cx?: number;
  cy?: number;
  value?: number;
  index?: number;
}

const BTCComparison = dynamic(() => import('../../components/BTCComparison'), {
  loading: () => <BTCComparisonSkeleton />,
  ssr: false
});

export default function FearGreedVsBTCPage() {
  const [historicalData, setHistoricalData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState('30');
    const [btcComparisonData, setBtcComparisonData] = useState<BTCData[]>([]);

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

    useEffect(() => {
        const fetchData = async () => {
      const loadingToast = toast.loading('Fetching market data...');
      try {
        const [fgiResponse, btcResponse] = await Promise.all([
          fetch('/api/fear-greed?limit=90'),
          fetch('/api/bitcoin-price?days=90'),
        ]);
        const [fgiData, btcData] = await Promise.all([
          fgiResponse.json(),
          btcResponse.json(),
        ]);

        if (fgiData.data) {
          // Format data for historical chart
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
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch market data.';
        toast.error(errorMessage, {
          id: loadingToast,
          duration: 4000,
        });
        setLoading(false);
      }
    };

        fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <HistoricalChartSkeleton />
            <BTCComparisonSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-8xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Fear & Greed Index vs Bitcoin Price
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Analyze the relationship between market sentiment and Bitcoin price movements
            </p>
          </div>

          <div className="space-y-12">
            {/* Historical Chart Section */}
            <LazyChartSection>
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
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4 text-center">
                    Index Zones Explained
                  </h3>
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

          </div>
            {/* Theory Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12 transition-all duration-300 hover:shadow-xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                Understanding the Fear & Greed Index and Bitcoin Price Correlation
              </h2>
              
              <div className="space-y-6 text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    What is the Fear & Greed Index?
                  </h3>
                  <p className="leading-relaxed">
                    The Crypto Fear & Greed Index is a market sentiment indicator that measures two primary emotions driving cryptocurrency investors: fear and greed. The index ranges from 0 to 100, where 0 represents Extreme Fear and 100 indicates Extreme Greed. This metric is calculated daily using various data points including volatility, market momentum, social media sentiment, and trading volume.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    Market Psychology and Trading Strategy
                  </h3>
                  <p className="leading-relaxed">
                    The index serves as a contrarian investment tool based on the principle that excessive fear can drive prices unreasonably low, while excessive greed can create unsustainable price bubbles. When investors are overly fearful (0-25), it might indicate a buying opportunity as prices may be below their true value. Conversely, extreme greed (75-100) could signal a market correction or sell-off is due.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    Correlation with Bitcoin Price
                  </h3>
                  <p className="leading-relaxed">
                    The relationship between the Fear & Greed Index and Bitcoin price often shows interesting patterns:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                    <li>During periods of extreme fear, Bitcoin has historically shown strong rebounds after market capitulation</li>
                    <li>Extreme greed periods often precede significant market corrections</li>
                    <li>Sustained neutral readings (45-55) typically indicate stable market conditions</li>
                    <li>Rapid shifts in sentiment can precede volatile price movements</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    How to Use This Tool
                  </h3>
                  <p className="leading-relaxed">
                    To effectively use the Fear & Greed Index in your analysis:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                    <li>Compare current sentiment levels with historical patterns</li>
                    <li>Look for divergences between sentiment and price action</li>
                    <li>Consider the index as one of many tools in your investment strategy</li>
                    <li>Use the time range selector to analyze different market cycles</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mt-6">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Note:</strong> While the Fear & Greed Index is a valuable tool for market analysis, it should not be used as the sole indicator for making investment decisions. Always conduct thorough research and consider multiple factors before making any investment choices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}