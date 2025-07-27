// pages/index.js
'use client'
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import LazyChartSection from '../components/LazyChartSection';
import Link from 'next/link';
import CryptoRankings from '../components/CryptoRankings';
import {
  ChartBarIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ShareIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

// Add social icons
import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';

// Lazy load components with custom loading states

const FAQSection = dynamic(() => import('../components/FAQSection'), {
  loading: () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: false
});

// Add lazy loading for other components
const GaugeIndicator = dynamic(() => import('../components/GaugeIndicator'), {
  loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-64 rounded-full"></div>,
  ssr: false
});

const FearAndGreedChart = dynamic(() => import('../components/FearAndGreedChart'), {
  loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-[400px] rounded-lg"></div>,
  ssr: false
});

const HistoricalValues = dynamic(() => import('../components/HistoricalValues'), {
  loading: () => (
    <div className="animate-pulse space-y-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      ))}
    </div>
  ),
  ssr: false
});

// Add intersection observer for lazy loading market cards
const MarketCard = dynamic(() => import('../components/MarketCard'), {
  loading: () => (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
    </div>
  ),
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

// Add intersection observer hook with proper types
const useIntersectionObserver = (options = {}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    if (ref) {
      observer.observe(ref);
    }

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [ref, options]);

  return [setRef, isVisible] as const;
};

// Add helper function to format market cap
const formatMarketCap = (value: string) => {
  const numValue = parseFloat(value);
  if (numValue >= 1000) {
    return `$${(numValue / 1000).toFixed(2)}T`;
  }
  return `$${numValue.toFixed(2)}B`;
};

// Helper function inline since it's only used here
// const classNames = (...classes: string[]) => {
//   return classes.filter(Boolean).join(' ');
// };

// const marketImplications = [
//   {
//     range: "Extreme Fear (0-25)",
//     implication: "Market capitulation signals - potential accumulation phase",
//     color: "text-red-600 dark:text-red-400",
//     bgColor: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
//     borderColor: "border-red-200 dark:border-red-800",
//     icon: ArrowTrendingDownIcon,
//     strategy: "Consider DCA strategy"
//   },
//   {
//     range: "Fear (26-45)",
//     implication: "Bearish sentiment with oversold conditions",
//     color: "text-orange-600 dark:text-orange-400",
//     bgColor: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
//     borderColor: "border-orange-200 dark:border-orange-800",
//     icon: ArrowTrendingDownIcon,
//     strategy: "Monitor for reversal signals"
//   },
//   {
//     range: "Neutral (46-55)",
//     implication: "Market equilibrium - sideways consolidation likely",
//     color: "text-yellow-600 dark:text-yellow-400",
//     bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
//     borderColor: "border-yellow-200 dark:border-yellow-800",
//     icon: ClockIcon,
//     strategy: "Wait for clear direction"
//   },
//   {
//     range: "Greed (56-75)",
//     implication: "Bullish momentum with overbought conditions",
//     color: "text-lime-600 dark:text-lime-400",
//     bgColor: "bg-gradient-to-br from-lime-50 to-lime-100 dark:from-lime-900/20 dark:to-lime-800/20",
//     borderColor: "border-lime-200 dark:border-lime-800",
//     icon: ArrowTrendingUpIcon,
//     strategy: "Consider profit taking"
//   },
//   {
//     range: "Extreme Greed (76-100)",
//     implication: "Market euphoria - potential distribution phase",
//     color: "text-green-600 dark:text-green-400",
//     bgColor: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
//     borderColor: "border-green-200 dark:border-green-800",
//     icon: ArrowTrendingUpIcon,
//     strategy: "Risk management crucial"
//   }
// ];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState<FearGreedData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [marketStats, setMarketStats] = useState({
    cryptos: '17,156',
    exchanges: '1,293',
    marketCap: { value: '2872.57', change: '-4.84' },
    volume: { value: '105.68', change: '0.00' },
    btcDominance: { value: '58.9', change: '0' },
    ethDominance: { value: '8.0', change: '0' },
    altcoinDominance: { value: '33.1', change: '0' },
    ethGas: { value: '0', change: '0' },
    fearGreedScore: '44'
  });

  // Add intersection observer for market cards section
  const [marketCardsRef, marketCardsVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Add intersection observer for FAQ section
  const [faqRef] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Combined fetch function to reduce number of effects and intervals
  const fetchAllData = useCallback(async () => {
      const loadingToast = toast.loading('Fetching market data...');
      try {
      // Fetch fear and greed data
      const [currentResponse, historicalResponse] = await Promise.all([
        fetch('/api/fear-greed?limit=1'),
        fetch('/api/fear-greed/historical')
      ]);

      const [currentData, historicalData] = await Promise.all([
        currentResponse.json(),
        historicalResponse.json()
      ]);

      if (currentData.data && currentData.data[0]) {
        setCurrentIndex(currentData.data[0]);
        setHistoricalData(historicalData);
      }

      // Fetch market stats with rate limiting
      const globalResponse = await fetch('https://api.coingecko.com/api/v3/global');
      const globalData = await globalResponse.json();

      if (globalData.data) {
        const btcDom = parseFloat(globalData.data.market_cap_percentage.btc.toFixed(1));
        const ethDom = parseFloat(globalData.data.market_cap_percentage.eth.toFixed(1));

        setMarketStats({
          cryptos: globalData.data.active_cryptocurrencies.toLocaleString(),
          exchanges: globalData.data.markets.toLocaleString(),
          marketCap: {
            value: (globalData.data.total_market_cap.usd / 1e9).toFixed(2),
            change: globalData.data.market_cap_change_percentage_24h_usd.toFixed(2)
          },
          volume: {
            value: (globalData.data.total_volume.usd / 1e9).toFixed(2),
            change: '0.00'
          },
          btcDominance: {
            value: btcDom.toString(),
            change: '0'
          },
          ethDominance: {
            value: ethDom.toString(),
            change: '0'
          },
          altcoinDominance: {
            value: (100 - btcDom - ethDom).toFixed(1),
            change: '0'
          },
          ethGas: {
            value: '0',
            change: '0'
          },
          fearGreedScore: currentData.data[0]?.value || '44'
        });
          }

          toast.success('Market data updated', {
            id: loadingToast,
            duration: 2000,
          });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch market data', {
          id: loadingToast,
          duration: 4000,
        });
      }
  }, []); // No dependencies needed

  useEffect(() => {
    // Initial fetch
    fetchAllData();

    // Set up interval for periodic updates - every 5 minutes
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, [fetchAllData]);

  const formatHistoricalData = (data: FearGreedData | null, historical: HistoricalData | null) => {
    if (!data || !historical) return [];

    return [
      { label: 'Now', value: data.value, classification: data.value_classification },
      { label: 'Yesterday', value: historical.yesterday.value, classification: historical.yesterday.value_classification },
      { label: 'Last week', value: historical.lastWeek.value, classification: historical.lastWeek.value_classification },
      { label: 'Last month', value: historical.lastMonth.value, classification: historical.lastMonth.value_classification }
    ];
  };

  return (
    <div className="min-h-screen ">
      {/* Market Stats Banner */}
      <div className="w-full bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 border-b border-blue-700 dark:border-gray-700 shadow-lg">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/20">
                <ChartBarIcon className="h-4 w-4 text-blue-200" />
                <span className="text-blue-100 font-medium">Market Cap:</span>
                <span className="text-white font-bold">{formatMarketCap(marketStats.marketCap.value)}</span>
                {parseFloat(marketStats.marketCap.change) !== 0 && (
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    parseFloat(marketStats.marketCap.change) > 0 
                      ? 'text-green-200 bg-green-500/20 border border-green-400/30' 
                      : 'text-red-200 bg-red-500/20 border border-red-400/30'
                  }`}>
                    {parseFloat(marketStats.marketCap.change) > 0 ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
                    {Math.abs(parseFloat(marketStats.marketCap.change))}%
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/20">
                <CurrencyDollarIcon className="h-4 w-4 text-green-200" />
                <span className="text-blue-100 font-medium">24h Vol:</span>
                <span className="text-white font-bold">${marketStats.volume.value}B</span>
                {parseFloat(marketStats.volume.change) !== 0 ? (
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    parseFloat(marketStats.volume.change) > 0 
                      ? 'text-green-200 bg-green-500/20 border border-green-400/30' 
                      : 'text-red-200 bg-red-500/20 border border-red-400/30'
                  }`}>
                    {parseFloat(marketStats.volume.change) > 0 ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
                    {Math.abs(parseFloat(marketStats.volume.change))}%
                  </span>
                ) : (
                  <span className="text-blue-200 text-xs">0%</span>
                )}
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/20">
                <ChartPieIcon className="h-4 w-4 text-purple-200" />
                <span className="text-blue-100 font-medium">Dominance:</span>
                <Link
                  href="/btc-dominance"
                  className="text-blue-200 hover:text-white transition-colors font-medium"
                >
                  BTC: {marketStats.btcDominance.value}%
                </Link>
                <Link
                  href="/eth-dominance"
                  className="text-blue-200 hover:text-white transition-colors font-medium"
                >
                  ETH: {marketStats.ethDominance.value}%
                </Link>
                <Link
                  href="/altcoin-dominance"
                  className="text-blue-200 hover:text-white transition-colors font-medium"
                >
                  Alt: {marketStats.altcoinDominance.value}%
                </Link>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/20">
                <GlobeAltIcon className="h-4 w-4 text-orange-200" />
                <span className="text-blue-100 font-medium">Sentiment:</span>
                <span className="text-white font-bold">{marketStats.fearGreedScore}/100</span>
              </div>
            </div>

            {/* Social Share Section - Now visible on mobile */}
            <div className="flex items-center justify-center gap-2 pt-2 sm:pt-0 sm:pl-4 sm:border-l border-white/20">
              <div className="flex items-center gap-1">
                <TwitterShareButton
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                  title={`Crypto Market Stats:
                    Market Cap: ${formatMarketCap(marketStats.marketCap.value)} (${marketStats.marketCap.change}%)
                    BTC Dominance: ${marketStats.btcDominance.value}%
                    ETH Dominance: ${marketStats.ethDominance.value}%
                    Altcoin Dominance: ${marketStats.altcoinDominance.value}%
                    Fear & Greed Index: ${marketStats.fearGreedScore}/100`}
                >
                  <TwitterIcon size={20} round className="hover:opacity-80 transition-opacity" />
                </TwitterShareButton>
                <FacebookShareButton
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                  hashtag="#CryptoMarkets #Bitcoin #Ethereum #Altcoins"
                >
                  <FacebookIcon size={20} round className="hover:opacity-80 transition-opacity" />
                </FacebookShareButton>
                <TelegramShareButton
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                  title={`Crypto Market Stats:
                  Market Cap: ${formatMarketCap(marketStats.marketCap.value)} (${marketStats.marketCap.change}%)
                  BTC Dominance: ${marketStats.btcDominance.value}%
                  ETH Dominance: ${marketStats.ethDominance.value}%
                  Altcoin Dominance: ${marketStats.altcoinDominance.value}%
                  Fear & Greed Index: ${marketStats.fearGreedScore}/100`}
                >
                  <TelegramIcon size={20} round className="hover:opacity-80 transition-opacity" />
                </TelegramShareButton>
                <WhatsappShareButton
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                  title={`Crypto Market Stats:
                  Market Cap: ${formatMarketCap(marketStats.marketCap.value)} (${marketStats.marketCap.change}%)
                  BTC Dominance: ${marketStats.btcDominance.value}%
                  ETH Dominance: ${marketStats.ethDominance.value}%
                  Altcoin Dominance: ${marketStats.altcoinDominance.value}%
                  Fear & Greed Index: ${marketStats.fearGreedScore}/100`}
                >
                  <WhatsappIcon size={20} round className="hover:opacity-80 transition-opacity" />
                </WhatsappShareButton>
              </div>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Crypto Market Stats',
                      text: `Crypto Market Stats:
                    Market Cap: ${formatMarketCap(marketStats.marketCap.value)} (${marketStats.marketCap.change}%)
                    BTC Dominance: ${marketStats.btcDominance.value}%
                    ETH Dominance: ${marketStats.ethDominance.value}%
                    Altcoin Dominance: ${marketStats.altcoinDominance.value}%
                    Fear & Greed Index: ${marketStats.fearGreedScore}/100`,
                      url: window.location.href,
                    })
                      .catch((error) => console.log('Error sharing:', error));
                  }
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ShareIcon className="h-4 w-4 text-blue-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header Section - Optimized for LCP */}
        <div className="text-center py-16 sm:py-20 lg:py-24 mb-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          
          <div className="relative z-10 max-w-5xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full mb-8 shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Live Market Data</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-6 sm:mb-8 tracking-tight">
              Crypto Fear & Greed Index
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 font-medium">
              Advanced market sentiment analysis for strategic cryptocurrency investment decisions
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Real-time Data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Professional Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="font-medium">Risk Assessment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6 sm:space-y-8 lg:space-y-12">
              {/* Gauge Section - Optimized for LCP */}
              <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-3xl shadow-2xl border border-blue-100 dark:border-blue-800/30 p-8 sm:p-10 lg:p-12 mb-8 sm:mb-12 lg:mb-16 min-h-[500px] relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 dark:from-blue-800/10 dark:to-indigo-800/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-100/30 to-pink-100/30 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full -ml-32 -mb-32"></div>
                
                <div className="relative z-10">
                  {/* <div className="text-center mb-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Fear & Greed Index
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                      Professional sentiment analysis for cryptocurrency markets
                    </p>
                  </div> */}
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="flex flex-col items-center">
                    <div className="w-full flex items-center justify-center">
                      {currentIndex ? (
                          <div className="w-full flex flex-col items-center">
                    <GaugeIndicator 
                      value={parseInt(currentIndex.value)} 
                      classification={currentIndex.value_classification}
                    />
                            <div className="mt-4 text-center">
                              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                                <ClockIcon className="h-4 w-4 text-gray-500" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  Updated: {new Date(currentIndex.timestamp * 1000).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
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
                  
                  <div className="mt-8 text-center">
                                      <Link
                      href="/fear-greed-vs-btc"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-lg"
                    >
                      <ChartBarIcon className="h-5 w-5" />
                      View Historical Analysis & BTC Comparison
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>



              {/* Charts - Lazy loaded with fixed height */}
              <div className="min-h-[400px] w-full">
                <LazyChartSection>
                  <FearAndGreedChart />
                </LazyChartSection>
              </div>

              {/* Crypto Rankings Section */}
              <section className="w-full py-12">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-4 py-2 rounded-full mb-4">
                      <CurrencyDollarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-green-700 dark:text-green-300">Live Crypto Rankings</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      Top Cryptocurrencies
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                      Real-time rankings by market cap, price, and trading volume
                    </p>
                  </div>
                  <CryptoRankings />
                </div>
              </section>

              {/* Market Cards Section - Professional Financial Design */}
              <section
                ref={marketCardsRef}
                className="py-12 sm:py-16 lg:py-20 w-full min-h-[500px]"
                aria-labelledby="market-sections"
              >
                <div className="max-w-7xl mx-auto">
                  {marketCardsVisible ? (
                    <div className="w-full">
                      <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-4 py-2 rounded-full mb-4">
                          <GlobeAltIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Comprehensive Market Analysis</span>
                        </div>
                        <h2 id="market-sections" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                          Market Intelligence Hub
                  </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                          Access professional-grade market data and analytics across multiple asset classes
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        <MarketCard
                          href="/us-markets"
                          title="US Markets"
                          description="Professional analysis of major US indices including S&P 500, NASDAQ, Dow Jones, and Russell 2000 with real-time performance tracking."
                          icon={ChartBarIcon}
                        />
                        <MarketCard
                          href="/global-markets"
                          title="Global Markets"
                          description="Comprehensive coverage of international markets including Asia Pacific, Europe, Americas, and emerging market indices."
                          icon={GlobeAltIcon}
                        />
                        <MarketCard
                          href="/top-crypto"
                          title="Cryptocurrency Markets"
                          description="Advanced cryptocurrency analytics with real-time pricing, market trends, volume analysis, and technical indicators."
                          icon={CurrencyDollarIcon}
                        />
                        <MarketCard
                          href="/top-crypto-exchanges"
                          title="Exchange Analytics"
                          description="Professional exchange comparison with trading volumes, liquidity metrics, and security assessments for informed decision-making."
                          icon={BanknotesIcon}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="animate-pulse">
                      <div className="text-center mb-12">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-80 mx-auto mb-4"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto"></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 min-h-[200px]"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            </div>
                            <div className="space-y-3">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                            </div>
                            <div className="mt-6 flex items-center">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full ml-2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

                {/* FAQ Section */}
              <section className="w-full py-12">
                <div className="max-w-4xl mx-auto px-4">
                  <div ref={faqRef}>
                    <FAQSection />
                  </div>
              </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}