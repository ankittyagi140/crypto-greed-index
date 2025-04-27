'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import AltcoinDominance from '../../components/AltcoinDominance';
import AltcoinMetrics from '../../components/AltcoinMetrics';

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
      const loadingToast = toast.loading('Fetching altcoin dominance data...', {
        position: 'top-right',
      });
      try {
        const response = await fetch('/api/altcoin-dominance');
        const result = await response.json();

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again in a few minutes.');
          }
          throw new Error(result.error || 'Failed to fetch altcoin dominance data');
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to load altcoin dominance data';
        setError(errorMessage);
        toast.error(errorMessage, { 
          id: loadingToast,
          duration: 4000,
        });
        console.error('Error fetching altcoin dominance data:', error);
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
                {/* Current Altcoin Dominance Box */}
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

          {/* Understanding Altcoin Dominance Section Skeleton */}
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
              Altcoin Market Dominance Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-3xl mx-auto">
              Track altcoins&apos; influence in the cryptocurrency market through their dominance metrics and identify emerging market trends in real-time
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
                {data.length > 0 && <AltcoinDominance data={data} isDetailPage={true} />}
              </div>
              <div className="w-full lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
                <AltcoinMetrics isDetailPage={true} />
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mt-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              Understanding Altcoin Dominance
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="text-base sm:text-lg">
                Altcoin dominance represents the combined market capitalization of all cryptocurrencies except Bitcoin and Ethereum as a percentage of the total cryptocurrency market capitalization. This metric is crucial for understanding the relative strength and influence of altcoins in the crypto market.
              </p>
              
              <p className="text-base sm:text-lg">
                Beyond Bitcoin and Ethereum, thousands of alternative cryptocurrencies (altcoins) compete for market share, each with unique technologies, use cases, and communities. Altcoin dominance serves as a key indicator of market sentiment toward innovation, risk appetite, and capital distribution within the broader cryptocurrency ecosystem.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    High Dominance Implications
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-base sm:text-lg">
                    <li>Strong altcoin market position</li>
                    <li>Reduced Bitcoin/ETH market share</li>
                    <li>Potential altcoin season</li>
                    <li>Market diversification</li>
                    <li>Innovation and development in emerging projects</li>
                    <li>Increased retail investor participation</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Low Dominance Implications
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-base sm:text-lg">
                    <li>Strong Bitcoin/ETH market position</li>
                    <li>Market consolidation phase</li>
                    <li>Traditional market confidence</li>
                    <li>Potential market stability</li>
                    <li>Risk-off market sentiment</li>
                    <li>Institutional capital concentration</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mt-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              The Evolution of Altcoin Dominance
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="text-base sm:text-lg">
                The history of altcoin dominance reflects the ongoing maturation of the cryptocurrency market and the emergence of new blockchain technologies. Understanding these historical phases provides context for current market conditions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    First Altcoin Wave (2013-2016)
                  </h3>
                  <p className="text-base">
                    The first generation of altcoins emerged as alternatives to Bitcoin, introducing new consensus mechanisms, privacy features, and specialized use cases. Projects like Litecoin, Ripple, and Monero established the foundation for a diverse cryptocurrency ecosystem.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    ICO Boom (2017-2018)
                  </h3>
                  <p className="text-base">
                    Altcoin dominance reached unprecedented levels during the Initial Coin Offering boom, when thousands of new tokens launched on various platforms. This period saw massive capital inflow into the altcoin market but also introduced significant volatility and numerous failed projects.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    DeFi and L1 Competition (2020-Present)
                  </h3>
                  <p className="text-base">
                    The rise of decentralized finance (DeFi) and competing Layer 1 blockchains has driven recent altcoin dominance trends. Projects offering scalability, lower fees, and innovative financial applications have captured significant market share from traditional cryptocurrencies.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mt-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              Altcoin Categories Driving Market Dominance
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="text-base sm:text-lg">
                Various categories of altcoins contribute to overall altcoin dominance, each with distinct characteristics and market influence:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Smart Contract Platforms
                  </h3>
                  <p className="text-base">
                    Alternative Layer 1 blockchains like Solana, Avalanche, and Cardano compete with Ethereum by offering different approaches to scalability, security, and decentralization. Their combined market share significantly impacts altcoin dominance patterns.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    DeFi Tokens
                  </h3>
                  <p className="text-base">
                    Decentralized finance protocols offering lending, borrowing, trading, and yield farming services have created a substantial segment of the altcoin market. Projects like Uniswap, Aave, and Compound represent innovation in financial services on blockchain.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Web3 and Metaverse
                  </h3>
                  <p className="text-base">
                    Tokens powering the next generation of internet applications, including metaverse projects, decentralized social media, and gaming platforms, have emerged as a significant force in the altcoin landscape, attracting both users and investors.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Interoperability Solutions
                  </h3>
                  <p className="text-base">
                    Projects focused on connecting different blockchains and enabling cross-chain transactions, such as Polkadot, Cosmos, and Chainlink, provide essential infrastructure for the broader crypto ecosystem and represent a growing share of altcoin dominance.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mt-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              Trading Strategies Based on Altcoin Dominance
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="text-base sm:text-lg">
                Many sophisticated traders incorporate altcoin dominance analysis into their trading strategies:
              </p>
              
              <ul className="list-disc list-inside space-y-2 text-base sm:text-lg pl-4">
                <li><span className="font-medium">Rotation strategy:</span> Moving capital between BTC/ETH and altcoins based on dominance trend changes</li>
                <li><span className="font-medium">Category allocation:</span> Shifting investment focus among different altcoin categories as sector dominance shifts</li>
                <li><span className="font-medium">Market cycle timing:</span> Using altcoin dominance as an indicator for broader crypto market cycle phases</li>
                <li><span className="font-medium">Risk management:</span> Adjusting portfolio exposure based on altcoin dominance volatility</li>
                <li><span className="font-medium">Narrative trading:</span> Identifying emerging trends in altcoin categories before they gain mainstream attention</li>
              </ul>
              
              <p className="text-base sm:text-lg mt-4">
                Our real-time altcoin dominance tracker enables traders to implement these strategies with accurate, up-to-date market data that captures the rapidly evolving cryptocurrency landscape.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
} 