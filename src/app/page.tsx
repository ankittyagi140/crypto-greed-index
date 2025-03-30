// pages/index.js
'use client'
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import LazyChartSection from '@/components/LazyChartSection';
import Link from 'next/link';
import {
  ChartBarIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ShareIcon
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

const FAQSection = dynamic(() => import('@/components/FAQSection'), {
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
const GaugeIndicator = dynamic(() => import('@/components/GaugeIndicator'), {
  loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-64 rounded-full"></div>,
  ssr: false
});

const FearAndGreedChart = dynamic(() => import('@/components/FearAndGreedChart'), {
  loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-[400px] rounded-lg"></div>,
  ssr: false
});

const HistoricalValues = dynamic(() => import('@/components/HistoricalValues'), {
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
const MarketCard = dynamic(() => import('@/components/MarketCard'), {
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
const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

const marketImplications = [
  {
    range: "Extreme Fear (0-25)",
    implication: "Potential buying opportunity",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/10",
    borderColor: "border-red-200 dark:border-red-800"
  },
  {
    range: "Fear (26-45)",
    implication: "Caution with bearish bias",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-900/10",
    borderColor: "border-orange-200 dark:border-orange-800"
  },
  {
    range: "Neutral (46-55)",
    implication: "Market indecision",
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/10",
    borderColor: "border-yellow-200 dark:border-yellow-800"
  },
  {
    range: "Greed (56-75)",
    implication: "Caution with bullish bias",
    color: "text-lime-600 dark:text-lime-400",
    bgColor: "bg-lime-50 dark:bg-lime-900/10",
    borderColor: "border-lime-200 dark:border-lime-800"
  },
  {
    range: "Extreme Greed (76-100)",
    implication: "Potential selling opportunity",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/10",
    borderColor: "border-green-200 dark:border-green-800"
  }
];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Market Stats Banner */}
      <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">Market Cap: </span>
                <span className="text-gray-900 dark:text-white">{formatMarketCap(marketStats.marketCap.value)}</span>
                {parseFloat(marketStats.marketCap.change) !== 0 && (
                  <span className={parseFloat(marketStats.marketCap.change) > 0 ? 'text-green-500' : 'text-red-500'}>
                    {parseFloat(marketStats.marketCap.change) > 0 ? '↑' : '↓'} {Math.abs(parseFloat(marketStats.marketCap.change))}%
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">24h Vol: </span>
                <span className="text-gray-900 dark:text-white">${marketStats.volume.value}B</span>
                {parseFloat(marketStats.volume.change) !== 0 ? (
                  <span className={parseFloat(marketStats.volume.change) > 0 ? 'text-green-500' : 'text-red-500'}>
                    {parseFloat(marketStats.volume.change) > 0 ? '↑' : '↓'} {Math.abs(parseFloat(marketStats.volume.change))}%
                  </span>
                ) : (
                  <span className="text-gray-500"> 0%</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">Dominance: </span>
                <Link
                  href="/btc-dominance"
                  className="text-blue-600 dark:text-white hover:text-[#048F04] dark:hover:text-[#048F04] transition-colors"
                >
                  BTC: {marketStats.btcDominance.value}%
                </Link>
                <Link
                  href="/eth-dominance"
                  className="text-blue-600 dark:text-white hover:text-[#048F04] dark:hover:text-[#048F04] transition-colors"
                >
                  ETH: {marketStats.ethDominance.value}%
                </Link>
                <Link
                  href="/altcoin-dominance"
                  className="text-blue-600 dark:text-white hover:text-[#048F04] dark:hover:text-[#048F04] transition-colors"
                >
                  Altcoins: {marketStats.altcoinDominance.value}%
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">Fear & Greed: </span>
                <span className="text-gray-900 dark:text-white">{marketStats.fearGreedScore}/100</span>
              </div>
            </div>

            {/* Social Share Section - Now visible on mobile */}
            <div className="flex items-center justify-center gap-2 pt-2 sm:pt-0 sm:pl-4 sm:border-l border-gray-200 dark:border-gray-700">
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
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <ShareIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header Section - Optimized spacing and text sizes */}
        <div className="text-center h-[100px] sm:h-[120px] lg:h-[140px] mb-6 sm:mb-8 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3 lg:mb-4 tracking-tight">
            Crypto Fear & Greed Index
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            Make informed investment decisions by understanding market sentiment through our comprehensive analysis tools
          </p>
        </div>

        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6 sm:space-y-8 lg:space-y-12">
              {/* Gauge Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-3 sm:p-5 lg:p-8 mb-6 sm:mb-8 lg:mb-12 transition-all duration-300 hover:shadow-xl min-h-[500px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="flex flex-col items-center">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white text-center mb-4">
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

              {/* Understanding Market Sentiment */}
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Understanding Market Sentiment
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Key Indicators */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Key Indicators</h3>
                    <ul className="space-y-2">
                      {[
                        'Market Volatility',
                        'Trading Volume',
                        'Social Media Sentiment',
                        'Market Dominance',
                        'Trends and Momentum'
                      ].map((indicator) => (
                        <li key={indicator} className="flex items-center text-gray-600 dark:text-gray-400">
                          <span className="mr-2">•</span>
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Market Implications */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Market Implications</h3>
                    <div className="space-y-3">
                      {marketImplications.map((item) => (
                        <div
                          key={item.range}
                          className={classNames(
                            "rounded-lg border p-3 transition-all hover:shadow-md",
                            item.bgColor,
                            item.borderColor
                          )}
                        >
                          <div className={classNames("font-medium", item.color)}>
                            {item.range}
                          </div>
                          <div className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                            {item.implication}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Charts - Lazy loaded with fixed height */}
              <div className="min-h-[400px] w-full">
                <LazyChartSection>
                  <FearAndGreedChart />
                </LazyChartSection>
              </div>

              {/* Market Cards Section */}
              <section
                ref={marketCardsRef}
                className="py-8 sm:py-10 lg:py-12 w-full min-h-[500px]"
                aria-labelledby="market-sections"
              >
                <div className="max-w-7xl mx-auto">
                  {marketCardsVisible ? (
                    <div className="w-full">
                      <h2 id="market-sections" className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
                        Market Overview
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <MarketCard
                          href="/us-markets"
                          title="US Markets"
                          description="Track real-time performance of major US stock indices including S&P 500, NASDAQ, Dow Jones, and Russell 2000."
                          icon={ChartBarIcon}
                        />
                        <MarketCard
                          href="/global-markets"
                          title="Global Markets"
                          description="Monitor major stock indices worldwide including Asia Pacific, Europe, Americas, and Middle East markets."
                          icon={GlobeAltIcon}
                        />
                        <MarketCard
                          href="/top-crypto"
                          title="Top Cryptocurrencies"
                          description="Stay updated with real-time cryptocurrency prices, market trends, and trading volumes."
                          icon={CurrencyDollarIcon}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-6 sm:mb-8"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 min-h-[180px]"
                          >
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                              <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                            </div>
                            <div className="mt-4 flex items-center">
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
              <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
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

      {/* Disclaimer Section */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Disclaimer</h2>
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold mb-2">No Investment Advice</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              The information provided on this website does not constitute investment advice,
              financial advice, trading advice, or any other sort of advice and you should not
              treat any of the website&lsquo;s content as such. Alternative.me does not recommend
              that any cryptocurrency should be bought, sold, or held by you. Do conduct your
              own due diligence and consult your financial advisor before making any investment
              decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}