'use client';

import BTCDominance from '../../components/BTCDominance';
import BitcoinMetrics from '../../components/BitcoinMetrics';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <div className="h-10 w-3/4 bg-slate-200 rounded-lg mx-auto mb-4"></div>
            <div className="h-6 w-2/3 bg-slate-200 rounded-lg mx-auto"></div>
          </div>

          {/* Main Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Panel Skeleton */}
            <div className="w-full lg:col-span-7 bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-slate-200">
              <div className="animate-pulse">
                {/* Current BTC Dominance Box */}
                <div className="w-48 h-24 mx-auto bg-slate-100 rounded-lg mb-6"></div>

                {/* Time Range Selector */}
                <div className="flex justify-center gap-4 mb-8">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 w-20 bg-slate-100 rounded"></div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="h-[300px] bg-slate-100 rounded-lg"></div>
              </div>
            </div>

            {/* Right Panel Skeleton */}
            <div className="w-full lg:col-span-3 bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-slate-200">
              <div className="animate-pulse space-y-4">
                <div className="h-6 w-3/4 bg-slate-100 rounded mb-6"></div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-lg">
                      <div className="h-4 w-1/2 bg-slate-200 rounded mb-2"></div>
                      <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Understanding BTC Dominance Section Skeleton */}
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 mt-8 border border-slate-200">
            <div className="animate-pulse">
              <div className="h-8 w-1/2 bg-slate-200 rounded mb-6"></div>
              <div className="space-y-4 mb-8">
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-slate-50 p-4 sm:p-6 rounded-lg">
                    <div className="h-6 w-3/4 bg-slate-200 rounded mb-4"></div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-4 w-5/6 bg-slate-200 rounded"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section with Ad Banner */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 via-blue-100/30 to-indigo-100/50"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/40 to-blue-100/40 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100/40 to-indigo-100/40 rounded-full -ml-48 -mb-48 blur-3xl"></div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 sm:py-16 lg:py-20">
            {/* Google AdSense Banner */}
            <div className="w-full mb-8">
              <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1332831285527693" crossOrigin="anonymous"></script>
              {/* add banner for BTC dominance page */}
              <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-1332831285527693"
                data-ad-slot="5441357265"
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({ });
              </script>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Chart Section with H1 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent mb-6 tracking-tight">
              Bitcoin Market Dominance Analysis
            </h1>
            <p className="text-slate-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              Track Bitcoin&apos;s influence in the cryptocurrency market through its dominance metrics and monitor real-time market trends
            </p>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 shadow-lg">
              <p className="text-red-700 font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 sm:gap-8 lg:gap-10 mb-12">
              <div className="w-full lg:col-span-7 bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200">
                {data.length > 0 && <BTCDominance data={data} isDetailPage={true} />}
              </div>
              <div className="w-full lg:col-span-3 bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200">
                <BitcoinMetrics isDetailPage={true} />
              </div>
            </div>
          )}

          {/* Understanding BTC Dominance Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 mb-8 border border-slate-200">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6 text-center">
              Understanding BTC Dominance
            </h2>
            <div className="space-y-6 text-slate-600">
              <p className="text-lg leading-relaxed">
                Bitcoin dominance represents Bitcoin&apos;s market capitalization as a percentage of the total cryptocurrency market capitalization. This metric is crucial for understanding Bitcoin&apos;s relative strength and influence in the crypto market.
              </p>

              <p className="text-lg leading-relaxed">
                As the first and largest cryptocurrency, Bitcoin serves as the cornerstone of the entire crypto industry. Bitcoin dominance is widely considered a fundamental market indicator that reflects investor sentiment, market cycles, and capital flow dynamics within the broader digital asset landscape.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-8">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 sm:p-8 rounded-xl border border-emerald-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
                    High Dominance Implications
                  </h3>
                  <ul className="space-y-3 text-base">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Strong Bitcoin market position</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Reduced altcoin market share</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Potential consolidation phase</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Traditional market confidence</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Heightened institutional interest</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Risk-off sentiment in crypto markets</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 sm:p-8 rounded-xl border border-blue-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
                    Low Dominance Implications
                  </h3>
                  <ul className="space-y-3 text-base">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Altcoin season potential</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Market diversification</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Increased market maturity</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Innovation in altcoin space</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Broader crypto market expansion</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Higher risk appetite among investors</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bitcoin Dominance: Historical Perspective Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 mb-8 border border-slate-200">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6 text-center">
              Bitcoin Dominance: Historical Perspective
            </h2>
            <div className="space-y-6 text-slate-600">
              <p className="text-lg leading-relaxed">
                Since the inception of alternative cryptocurrencies, Bitcoin dominance has undergone significant fluctuations that mirror the evolution of the crypto ecosystem. Understanding these historical trends provides valuable context for market analysis.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 sm:p-8 rounded-xl border border-purple-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
                    Early Monopoly (2009-2017)
                  </h3>
                  <p className="text-base leading-relaxed">
                    Bitcoin enjoyed near-total market dominance in the early years of cryptocurrency, regularly maintaining over 80% of the total market capitalization until 2017 when the first major altcoin bull run dramatically reduced its dominance.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 sm:p-8 rounded-xl border border-orange-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
                    Market Cycles (2017-2022)
                  </h3>
                  <p className="text-base leading-relaxed">
                    Throughout multiple market cycles, Bitcoin dominance has typically increased during bear markets as investors seek the relative safety of BTC, while dominance tends to decrease during bull markets as capital flows into altcoins in search of higher returns.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 sm:p-8 rounded-xl border border-indigo-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
                    Institutional Era (2020-Present)
                  </h3>
                  <p className="text-base leading-relaxed">
                    The entrance of institutional investors into the cryptocurrency space has significantly impacted Bitcoin dominance patterns, with many large institutions preferring Bitcoin over other cryptocurrencies due to its established history, liquidity, and regulatory clarity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Strategies Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 mb-8 border border-slate-200">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6 text-center">
              Trading Strategies Based on BTC Dominance
            </h2>
            <div className="space-y-6 text-slate-600">
              <p className="text-lg leading-relaxed">
                Many traders and investors incorporate Bitcoin dominance analysis into their trading strategies to optimize market positioning:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-slate-800">Dominance breakouts:</span>
                      <span className="text-base"> Significant breaks in BTC dominance trend lines often signal major market rotations</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-slate-800">Divergence trading:</span>
                      <span className="text-base"> Monitoring divergence between BTC price and dominance can reveal hidden market dynamics</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-slate-800">Sector rotation timing:</span>
                      <span className="text-base"> Using dominance shifts to time movements between Bitcoin, large-cap altcoins, and smaller projects</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-slate-800">Market cycle identification:</span>
                      <span className="text-base"> Recognizing where in the market cycle we are based on historical dominance patterns</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-slate-800">Portfolio rebalancing:</span>
                      <span className="text-base"> Adjusting Bitcoin-to-altcoin ratios based on dominance trends to optimize risk-adjusted returns</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-lg leading-relaxed mt-6">
                Our real-time Bitcoin dominance tracker helps traders implement these strategies with accurate, up-to-date dominance data that responds quickly to changing market conditions.
              </p>
            </div>
          </div>

          {/* Factors Influencing Bitcoin Dominance Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 mb-8 border border-slate-200">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6 text-center">
              Factors Influencing Bitcoin Dominance
            </h2>
            <div className="space-y-6 text-slate-600">
              <p className="text-lg leading-relaxed">
                Multiple factors can influence shifts in Bitcoin dominance, including:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-8">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 sm:p-8 rounded-xl border border-yellow-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
                    Market Forces
                  </h3>
                  <ul className="space-y-3 text-base">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Macroeconomic conditions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Institutional investment flows</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Retail investor sentiment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Trading volume distribution</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Liquidity across exchanges</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 sm:p-8 rounded-xl border border-rose-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
                    Technological Developments
                  </h3>
                  <ul className="space-y-3 text-base">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Bitcoin network upgrades</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Layer 2 scaling solutions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Innovations in alternative blockchains</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>DeFi and NFT ecosystem growth</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Regulatory developments</span>
                    </li>
                  </ul>
                </div>
              </div>

              <p className="text-lg leading-relaxed mt-6">
                By tracking these factors alongside Bitcoin dominance metrics, investors can develop a more comprehensive understanding of market dynamics and potential future trends.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
} 