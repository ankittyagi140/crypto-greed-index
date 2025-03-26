// pages/index.js
'use client'
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
// import HomeSkeleton from '@/components/HomeSkeleton';
import LazyChartSection from '@/components/LazyChartSection';
import { FAQSkeleton } from '@/components/ChartSkeletons';
import GaugeIndicator from '@/components/GaugeIndicator';
import FearAndGreedChart from '@/components/FearAndGreedChart';
import Link from 'next/link';
import HistoricalValues from '@/components/HistoricalValues';

// Lazy load components with custom loading states
const MarketOverview = dynamic(() => import('@/components/MarketOverview'), {
  loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-20"></div>,
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

interface HistoricalData {
  now: FearGreedData;
  yesterday: FearGreedData;
  lastWeek: FearGreedData;
  lastMonth: FearGreedData;
}

// Separate data fetching component to allow static content to render immediately
function FearGreedDataSection({ onDataLoaded, onHistoricalDataLoaded }: { 
  onDataLoaded: (data: FearGreedData) => void;
  onHistoricalDataLoaded: (data: HistoricalData) => void;
}) {
  const fetchData = useCallback(async () => {
    const loadingToast = toast.loading('Fetching market data...');
    try {
      const [currentResponse, historicalResponse] = await Promise.all([
        fetch('/api/fear-greed?limit=1', {
          headers: {
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache'
          }
        }),
        fetch('/api/fear-greed/historical', {
          headers: {
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache'
          }
        })
      ]);

      const [currentData, historicalData] = await Promise.all([
        currentResponse.json(),
        historicalResponse.json()
      ]);

      if (currentData.data && currentData.data[0]) {
        onDataLoaded(currentData.data[0]);
        onHistoricalDataLoaded(historicalData);
        
        toast.success('Market data updated', {
          id: loadingToast,
          duration: 2000,
        });
      }
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch market data.';
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 4000,
      });
    }
  }, [onDataLoaded, onHistoricalDataLoaded]);

  useEffect(() => {
    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };

    // Handle page show events (bfcache restoration)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was restored from bfcache
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);

    // Initial fetch
    fetchData();

    // Set up interval for periodic updates
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
      clearInterval(interval);
    };
  }, [fetchData]);

  return null;
}

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState<FearGreedData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);

  const formatHistoricalData = (data: FearGreedData | null, historical: HistoricalData | null) => {
    if (!data || !historical) return [];
    
    return [
      { label: 'Now', value: data.value, classification: data.value_classification },
      { label: 'Yesterday', value: historical.yesterday.value, classification: historical.yesterday.value_classification },
      { label: 'Last week', value: historical.lastWeek.value, classification: historical.lastWeek.value_classification },
      { label: 'Last month', value: historical.lastMonth.value, classification: historical.lastMonth.value_classification }
    ];
  };

  // Add event listener for page unload to cleanup resources

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Main container with fixed dimensions */}
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section - Fixed height to prevent shifts */}
        <div className="text-center h-[120px] sm:h-[140px] mb-8 sm:mb-4 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 tracking-tight">
            Crypto Fear & Greed Index
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
            Make informed investment decisions by understanding market sentiment through our comprehensive analysis tools
          </p>
        </div>

       

        {/* Start Data Fetching in Background */}
        <FearGreedDataSection onDataLoaded={setCurrentIndex} onHistoricalDataLoaded={setHistoricalData} />

        {/* Gauge Section - Fixed dimensions */}
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-8 sm:space-y-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 transition-all duration-300 hover:shadow-xl min-h-[500px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col items-center">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white text-center mb-4 sm:mb-6">
                      Crypto Fear and Greed Index today
                    </h2>
                    
                    <div className="w-full flex items-center justify-center">
                      {currentIndex ? (
                        <>
                          <div className="w-full flex flex-col items-center">
                            <GaugeIndicator 
                              value={parseInt(currentIndex.value)} 
                              classification={currentIndex.value_classification}
                            />
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3 sm:mt-4 text-center">
                              Last updated: {new Date(currentIndex.timestamp * 1000).toLocaleString()}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="w-full max-w-md animate-pulse">
                          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="w-full max-w-md">
                      {currentIndex && historicalData ? (
                        <HistoricalValues data={formatHistoricalData(currentIndex, historicalData)} />
                      ) : (
                        <div className="animate-pulse space-y-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link 
                    href="/fear-greed-vs-btc"
                    className="mt-4 sm:mt-6 text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center gap-1 justify-center"
                  >
                    View Historical Analysis & BTC Comparison
                    <span className="inline-block transform translate-y-px">→</span>
                  </Link>
                </div>
              </div>

 {/* Market Overview - Fixed height container */}
 <div className="min-h-[100px] mb-8">
          <MarketOverview />
        </div>
              {/* Charts - Fixed height container */}
              <div className="min-h-[400px]">
                <FearAndGreedChart />
              </div>
              
              {/* FAQ Section - Fixed height container */}
              <div className="min-h-[300px]">
                <LazyChartSection>
                  <FAQSection />
                </LazyChartSection>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}