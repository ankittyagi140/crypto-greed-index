'use client';

import BTCDominance from '@/components/BTCDominance';
import BitcoinMetrics from '@/components/BitcoinMetrics';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface DominanceData {
  date: string;
  dominance: number;
}

export default function ClientPage() {
  const [data, setData] = useState<DominanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const loadingToast = toast.loading('Fetching BTC dominance data...', {
        position: 'top-right',
      });
      try {
        const response = await fetch('/api/btc-dominance');
        const result = await response.json();

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again in a few minutes.');
          }
          throw new Error(result.error || 'Failed to fetch BTC dominance data');
        }

        if (!result.data || !Array.isArray(result.data)) {
          throw new Error('Invalid data received from server');
        }

        setData(result.data);
        setError(null);
        toast.success('Data updated successfully', { 
          id: loadingToast,
          duration: 3000,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load BTC dominance data';
        setError(errorMessage);
        toast.error(errorMessage, { 
          id: loadingToast,
          duration: 4000,
        });
        console.error('Error fetching BTC dominance data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for periodic updates
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4"></div>
            <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto"></div>
          </div>

          {/* Main Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Panel Skeleton */}
            <div className="w-full lg:col-span-7 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
              <div className="animate-pulse">
                {/* Current BTC Dominance Box */}
                <div className="w-48 h-24 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg mb-6"></div>
                
                {/* Time Range Selector */}
                <div className="flex justify-center gap-4 mb-8">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 w-20 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="h-[300px] bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>

            {/* Right Panel Skeleton */}
            <div className="w-full lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 w-3/4 bg-gray-100 dark:bg-gray-700 rounded mb-6"></div>
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Understanding BTC Dominance Section Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mt-8">
            <div className="animate-pulse">
              <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
              <div className="space-y-4 mb-8">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-4 w-5/6 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Bitcoin Market Dominance Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-3xl mx-auto">
              Track Bitcoin&apos;s influence in the cryptocurrency market through its dominance metrics and monitor real-time market trends
            </p>
          </div>

          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6 lg:gap-8">
              <div className="w-full lg:col-span-7 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
                {data.length > 0 && <BTCDominance data={data} isDetailPage={true} />}
              </div>
              <div className="w-full lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
                <BitcoinMetrics isDetailPage={true} />
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mt-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              Understanding BTC Dominance
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="text-base sm:text-lg">
                Bitcoin dominance represents Bitcoin&apos;s market capitalization as a percentage of the total cryptocurrency market capitalization. This metric is crucial for understanding Bitcoin&apos;s relative strength and influence in the crypto market.
              </p>
              
              <p className="text-base sm:text-lg">
                As the first and largest cryptocurrency, Bitcoin serves as the cornerstone of the entire crypto industry. Bitcoin dominance is widely considered a fundamental market indicator that reflects investor sentiment, market cycles, and capital flow dynamics within the broader digital asset landscape.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    High Dominance Implications
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-base sm:text-lg">
                    <li>Strong Bitcoin market position</li>
                    <li>Reduced altcoin market share</li>
                    <li>Potential consolidation phase</li>
                    <li>Traditional market confidence</li>
                    <li>Heightened institutional interest</li>
                    <li>Risk-off sentiment in crypto markets</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Low Dominance Implications
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-base sm:text-lg">
                    <li>Altcoin season potential</li>
                    <li>Market diversification</li>
                    <li>Increased market maturity</li>
                    <li>Innovation in altcoin space</li>
                    <li>Broader crypto market expansion</li>
                    <li>Higher risk appetite among investors</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mt-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              Bitcoin Dominance: Historical Perspective
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="text-base sm:text-lg">
                Since the inception of alternative cryptocurrencies, Bitcoin dominance has undergone significant fluctuations that mirror the evolution of the crypto ecosystem. Understanding these historical trends provides valuable context for market analysis.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Early Monopoly (2009-2017)
                  </h3>
                  <p className="text-base">
                    Bitcoin enjoyed near-total market dominance in the early years of cryptocurrency, regularly maintaining over 80% of the total market capitalization until 2017 when the first major altcoin bull run dramatically reduced its dominance.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Market Cycles (2017-2022)
                  </h3>
                  <p className="text-base">
                    Throughout multiple market cycles, Bitcoin dominance has typically increased during bear markets as investors seek the relative safety of BTC, while dominance tends to decrease during bull markets as capital flows into altcoins in search of higher returns.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Institutional Era (2020-Present)
                  </h3>
                  <p className="text-base">
                    The entrance of institutional investors into the cryptocurrency space has significantly impacted Bitcoin dominance patterns, with many large institutions preferring Bitcoin over other cryptocurrencies due to its established history, liquidity, and regulatory clarity.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mt-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              Trading Strategies Based on BTC Dominance
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="text-base sm:text-lg">
                Many traders and investors incorporate Bitcoin dominance analysis into their trading strategies to optimize market positioning:
              </p>
              
              <ul className="list-disc list-inside space-y-2 text-base sm:text-lg pl-4">
                <li><span className="font-medium">Dominance breakouts:</span> Significant breaks in BTC dominance trend lines often signal major market rotations</li>
                <li><span className="font-medium">Divergence trading:</span> Monitoring divergence between BTC price and dominance can reveal hidden market dynamics</li>
                <li><span className="font-medium">Sector rotation timing:</span> Using dominance shifts to time movements between Bitcoin, large-cap altcoins, and smaller projects</li>
                <li><span className="font-medium">Market cycle identification:</span> Recognizing where in the market cycle we are based on historical dominance patterns</li>
                <li><span className="font-medium">Portfolio rebalancing:</span> Adjusting Bitcoin-to-altcoin ratios based on dominance trends to optimize risk-adjusted returns</li>
              </ul>
              
              <p className="text-base sm:text-lg mt-4">
                Our real-time Bitcoin dominance tracker helps traders implement these strategies with accurate, up-to-date dominance data that responds quickly to changing market conditions.
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mt-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              Factors Influencing Bitcoin Dominance
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="text-base sm:text-lg">
                Multiple factors can influence shifts in Bitcoin dominance, including:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Market Forces
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-base">
                    <li>Macroeconomic conditions</li>
                    <li>Institutional investment flows</li>
                    <li>Retail investor sentiment</li>
                    <li>Trading volume distribution</li>
                    <li>Liquidity across exchanges</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Technological Developments
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-base">
                    <li>Bitcoin network upgrades</li>
                    <li>Layer 2 scaling solutions</li>
                    <li>Innovations in alternative blockchains</li>
                    <li>DeFi and NFT ecosystem growth</li>
                    <li>Regulatory developments</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-base sm:text-lg mt-4">
                By tracking these factors alongside Bitcoin dominance metrics, investors can develop a more comprehensive understanding of market dynamics and potential future trends.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
} 