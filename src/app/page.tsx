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
    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center mb-8 text-slate-800">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="border border-slate-200 rounded-xl overflow-hidden"
            >
              <div className="p-4">
                <div className="h-6 bg-slate-100 rounded w-3/4"></div>
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
  loading: () => <div className="animate-pulse bg-slate-100 h-64 rounded-full"></div>,
  ssr: false
});

const FearAndGreedChart = dynamic(() => import('../components/FearAndGreedChart'), {
  loading: () => <div className="animate-pulse bg-slate-100 h-[400px] rounded-xl"></div>,
  ssr: false
});

const HistoricalValues = dynamic(() => import('../components/HistoricalValues'), {
  loading: () => (
    <div className="animate-pulse space-y-4 bg-white rounded-xl p-4 shadow-md border border-slate-200">
      <div className="h-6 bg-slate-200 rounded w-32"></div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="w-20 h-4 bg-slate-200 rounded"></div>
          <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
        </div>
      ))}
    </div>
  ),
  ssr: false
});

// Add intersection observer for lazy loading market cards
const MarketCard = dynamic(() => import('../components/MarketCard'), {
  loading: () => (
    <div className="animate-pulse bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="h-6 bg-slate-200 rounded w-32 mb-4"></div>
      <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
      <div className="h-4 bg-slate-200 rounded w-24"></div>
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
    <div className="min-h-screen bg-slate-50">
      {/* Market Stats Banner */}
      <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 shadow-xl">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/20">
                <ChartBarIcon className="h-4 w-4 text-emerald-300" />
                <span className="text-slate-200 font-medium">Market Cap:</span>
                <span className="text-white font-bold">{formatMarketCap(marketStats.marketCap.value)}</span>
                {parseFloat(marketStats.marketCap.change) !== 0 && (
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${parseFloat(marketStats.marketCap.change) > 0
                    ? 'text-emerald-200 bg-emerald-500/20 border border-emerald-400/30'
                    : 'text-red-200 bg-red-500/20 border border-red-400/30'
                    }`}>
                    {parseFloat(marketStats.marketCap.change) > 0 ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
                    {Math.abs(parseFloat(marketStats.marketCap.change))}%
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/20">
                <CurrencyDollarIcon className="h-4 w-4 text-emerald-300" />
                <span className="text-slate-200 font-medium">24h Vol:</span>
                <span className="text-white font-bold">${marketStats.volume.value}B</span>
                {parseFloat(marketStats.volume.change) !== 0 ? (
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${parseFloat(marketStats.volume.change) > 0
                    ? 'text-emerald-200 bg-emerald-500/20 border border-emerald-400/30'
                    : 'text-red-200 bg-red-500/20 border border-red-400/30'
                    }`}>
                    {parseFloat(marketStats.volume.change) > 0 ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
                    {Math.abs(parseFloat(marketStats.volume.change))}%
                  </span>
                ) : (
                  <span className="text-slate-300 text-xs">0%</span>
                )}
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/20">
                <ChartPieIcon className="h-4 w-4 text-blue-300" />
                <span className="text-slate-200 font-medium">Dominance:</span>
                <Link
                  href="/btc-dominance"
                  className="text-slate-300 hover:text-white transition-colors font-medium"
                >
                  BTC: {marketStats.btcDominance.value}%
                </Link>
                <Link
                  href="/eth-dominance"
                  className="text-slate-300 hover:text-white transition-colors font-medium"
                >
                  ETH: {marketStats.ethDominance.value}%
                </Link>
                <Link
                  href="/altcoin-dominance"
                  className="text-slate-300 hover:text-white transition-colors font-medium"
                >
                  Alt: {marketStats.altcoinDominance.value}%
                </Link>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/20">
                <GlobeAltIcon className="h-4 w-4 text-amber-300" />
                <span className="text-slate-200 font-medium">Sentiment:</span>
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
                <ShareIcon className="h-4 w-4 text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header Section - Optimized for LCP */}
        <div className="text-center py-16 sm:py-20 lg:py-24 mb-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

          <div className="relative z-10 max-w-5xl mx-auto px-4">


            {/* Google AdSense Banner */}
            <div className="w-full mb-8">
              <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1332831285527693" crossOrigin="anonymous"></script>
              {/* add banner for home page */}
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

        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6 sm:space-y-8 lg:space-y-12">
              {/* Gauge Section - Optimized for LCP */}
              <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-3xl shadow-2xl border border-slate-200 p-8 sm:p-10 lg:p-12 mb-8 sm:mb-12 lg:mb-16 min-h-[600px] relative overflow-hidden">
                {/* Enhanced Background Pattern */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-100/40 to-blue-100/40 rounded-full -mr-40 -mt-40 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-100/40 to-indigo-100/40 rounded-full -ml-40 -mb-40 blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-slate-100/30 to-blue-100/30 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                  {/* Enhanced Section Heading */}
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold">Live Market Sentiment</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-blue-600 bg-clip-text text-transparent mb-6 tracking-tight">
                      Fear & Greed Index
                    </h1>
                    <p className="text-slate-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
                      Professional sentiment analysis for cryptocurrency markets with real-time data and historical insights
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Enhanced Gauge Section */}
                    <div className="flex flex-col items-center">
                      <div className="w-full flex items-center justify-center">
                        {currentIndex ? (
                          <div className="w-full flex flex-col items-center">
                            <div className="relative group">
                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                              <GaugeIndicator
                                value={parseInt(currentIndex.value)}
                                classification={currentIndex.value_classification}
                              />
                            </div>

                            {/* Enhanced Status Display */}
                            <div className="mt-8 text-center space-y-4">
                              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-3 rounded-2xl shadow-lg border border-slate-300">
                                <ClockIcon className="h-5 w-5 text-slate-600" />
                                <span className="text-sm font-medium text-slate-700">
                                  Last Updated: {new Date(currentIndex.timestamp * 1000).toLocaleString()}
                                </span>
                              </div>

                              {/* Sentiment Classification Badge */}
                              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md ${currentIndex.value_classification === 'Extreme Fear' ? 'bg-red-100 text-red-700 border border-red-200' :
                                currentIndex.value_classification === 'Fear' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                  currentIndex.value_classification === 'Neutral' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                    currentIndex.value_classification === 'Greed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                      'bg-purple-100 text-purple-700 border border-purple-200'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${currentIndex.value_classification === 'Extreme Fear' ? 'bg-red-500' :
                                  currentIndex.value_classification === 'Fear' ? 'bg-orange-500' :
                                    currentIndex.value_classification === 'Neutral' ? 'bg-yellow-500' :
                                      currentIndex.value_classification === 'Greed' ? 'bg-emerald-500' :
                                        'bg-purple-500'
                                  }`}></div>
                                {currentIndex.value_classification}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full max-w-md animate-pulse">
                            <div className="h-80 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full mb-6"></div>
                            <div className="space-y-3">
                              <div className="h-4 bg-slate-200 rounded w-48 mx-auto"></div>
                              <div className="h-4 bg-slate-200 rounded w-32 mx-auto"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Historical Values Section */}
                    <div className="flex items-center justify-center">
                      <div className="w-full max-w-md">
                        {currentIndex && historicalData ? (
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50">
                            <div className="text-center mb-4">
                              <h3 className="text-lg font-bold text-slate-800 mb-1">Historical Sentiment</h3>
                              <p className="text-slate-600 text-xs">Track market sentiment over time</p>
                            </div>
                            <HistoricalValues data={formatHistoricalData(currentIndex, historicalData)} />
                          </div>
                        ) : (
                          <div className="animate-pulse space-y-3 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50">
                            <div className="text-center mb-4">
                              <div className="h-5 bg-slate-200 rounded w-28 mx-auto mb-1"></div>
                              <div className="h-3 bg-slate-200 rounded w-40 mx-auto"></div>
                            </div>
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <div className="w-16 h-3 bg-slate-200 rounded"></div>
                                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced CTA Section */}
                  <div className="mt-16 text-center">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white px-8 py-6 rounded-2xl shadow-2xl">
                      <div className="flex items-center gap-3">
                        <ChartBarIcon className="h-6 w-6 text-emerald-400" />
                        <span className="text-lg font-semibold">Ready for deeper analysis?</span>
                      </div>
                      <Link
                        href="/fear-greed-vs-btc"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        View Historical Analysis & BTC Comparison
                        <span className="text-lg">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts - Lazy loaded with fixed height */}
              <div className="w-full min-h-[400px] overflow-visible">
                <LazyChartSection>
                  <FearAndGreedChart />
                </LazyChartSection>
              </div>

              {/* Crypto Rankings Section */}
              <section className="w-full py-12">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-2 rounded-full mb-4 border border-emerald-200">
                      <CurrencyDollarIcon className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700">Live Crypto Rankings</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
                      Top Cryptocurrencies
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
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
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 rounded-full mb-4 border border-blue-200">
                          <GlobeAltIcon className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-700">Comprehensive Market Analysis</span>
                        </div>
                        <h2 id="market-sections" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
                          Market Intelligence Hub
                        </h2>
                        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
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
                        <div className="h-8 bg-slate-200 rounded w-64 mx-auto mb-4"></div>
                        <div className="h-10 bg-slate-200 rounded w-80 mx-auto mb-4"></div>
                        <div className="h-6 bg-slate-200 rounded w-96 mx-auto"></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-white rounded-xl shadow-lg p-6 min-h-[200px] border border-slate-200"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="h-8 bg-slate-200 rounded w-32"></div>
                              <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                            </div>
                            <div className="space-y-3">
                              <div className="h-4 bg-slate-200 rounded w-full"></div>
                              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                            </div>
                            <div className="mt-6 flex items-center">
                              <div className="h-4 bg-slate-200 rounded w-24"></div>
                              <div className="h-4 w-4 bg-slate-200 rounded-full ml-2"></div>
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