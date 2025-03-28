'use client';

import { useEffect, Suspense } from 'react';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';

// Dynamically import components with loading fallbacks
const MarketMovers = dynamic(() => import('@/components/MarketMovers'), {
  loading: () => <MarketMoversSkeletonLoader />
});

const USMarketOverview = dynamic(() => import('@/components/USMarketOverview'), {
  loading: () => <USMarketOverviewSkeletonLoader />
});

const TopCompaniesByMarketCap = dynamic(() => import('@/components/TopCompaniesByMarketCap'), {
  loading: () => <TopCompaniesByMarketCapSkeletonLoader />
});

// Skeleton loaders with matching dimensions
function MarketMoversSkeletonLoader() {
  return (
    <div className="min-h-[400px]">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            {[...Array(5)].map((_, j) => (
              <div key={j} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function USMarketOverviewSkeletonLoader() {
  return (
    <div className="min-h-[200px]">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  );
}

function TopCompaniesByMarketCapSkeletonLoader() {
  return (
    <div className="min-h-[300px]">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  );
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface MarketMovers {
  gainers: StockData[];
  losers: StockData[];
  mostActive: StockData[];
}

export default function USMarkets() {

  const fetchData = async () => {
    const loadingToast = toast.loading('Updating market data...', {
      position: 'top-right',
    });
    try {
   
      const [marketData, moversData] = await Promise.all([
        fetch('/api/us-markets').then(res => res.json()),
        fetch('/api/market-movers').then(res => res.json())
      ]);

      if (marketData.error || moversData.error) {
        throw new Error(marketData.error || moversData.error);
      }

      toast.success('Market data updated', {
        id: loadingToast,
        duration: 2000,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load US markets data';
      console.error('Error fetching data:', error);
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>US Markets Live | S&P 500, NASDAQ, Dow Jones & Russell 2000 Today</title>
        <meta name="description" content="Track real-time US market data, stock indices, and market trends. Get live updates from major US markets including S&P 500, NASDAQ, Dow Jones, and Russell 2000. Updated every 5 minutes." />
        <meta name="keywords" content="us markets, us stock market, us stock market today, us stock market live, us market live, us market today, us stock market news, us stock market open, us stock market futures, us stock market index" />
        <meta property="og:title" content="US Markets Live | S&P 500, NASDAQ, Dow Jones & Russell 2000 Today" />
        <meta property="og:description" content="Track real-time US market data, stock indices, and market trends. Get live updates from major US markets including S&P 500, NASDAQ, Dow Jones, and Russell 2000." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.cryptogreedindex.com/us-markets" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="US Markets Live | S&P 500, NASDAQ, Dow Jones & Russell 2000 Today" />
        <meta name="twitter:description" content="Track real-time US market data, stock indices, and market trends. Get live updates from major US markets." />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-8xl">
          <header className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
              US Markets Live
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
              Real-time performance of major US stock indices
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2" aria-live="polite">
              Data updates every 5 minutes
            </p>
          </header>

          <nav aria-label="Market sections" className="mb-8">
            <ul className="flex flex-wrap justify-center gap-4">
              <li>
                <a href="#market-overview" className="text-sm font-medium text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                  Market Overview
                </a>
              </li>
              <li>
                <a href="#top-companies" className="text-sm font-medium text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                  Top Companies
                </a>
              </li>
              <li>
                <a href="#market-movers" className="text-sm font-medium text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                  Market Movers
                </a>
              </li>
            </ul>
          </nav>

          <div className="space-y-4 sm:space-y-8">
            <section id="market-overview" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6" aria-labelledby="market-overview-title">
              <h2 id="market-overview-title" className="text-xl font-bold text-gray-800 dark:text-white mb-4">Market Overview</h2>
              <Suspense fallback={<USMarketOverviewSkeletonLoader />}>
                <USMarketOverview />
              </Suspense>
            </section>
            
            <section id="top-companies" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6" aria-labelledby="top-companies-title">
              <h2 id="top-companies-title" className="text-xl font-bold text-gray-800 dark:text-white mb-4">Top Companies by Market Cap</h2>
              <Suspense fallback={<TopCompaniesByMarketCapSkeletonLoader />}>
                <TopCompaniesByMarketCap />
              </Suspense>
            </section>
            
            <section id="market-movers" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6" aria-labelledby="market-movers-title">
              <h2 id="market-movers-title" className="text-xl font-bold text-gray-800 dark:text-white mb-4">Market Movers</h2>
              <Suspense fallback={<MarketMoversSkeletonLoader />}>
                <MarketMovers index="sp500" />
              </Suspense>
            </section>
          </div>

          <footer className="mt-8 sm:mt-12 px-4 sm:px-6 py-6 sm:py-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center sm:text-left">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                    Market Data
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/us-markets/sp500" className="text-sm text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                        S&P 500
                      </Link>
                    </li>
                    <li>
                      <Link href="/us-markets/nasdaq" className="text-sm text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                        NASDAQ
                      </Link>
                    </li>
                    <li>
                      <Link href="/us-markets/dow-jones" className="text-sm text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                        Dow Jones
                      </Link>
                    </li>
                    <li>
                      <Link href="/us-markets/russell2000" className="text-sm text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                        Russell 2000
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                    Resources
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/market-analysis" className="text-sm text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                        Market Analysis
                      </Link>
                    </li>
                    <li>
                      <Link href="/economic-calendar" className="text-sm text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                        Economic Calendar
                      </Link>
                    </li>
                    <li>
                      <Link href="/market-news" className="text-sm text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                        Market News
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                    Tools
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/watchlist" className="text-sm text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                        Watchlist
                      </Link>
                    </li>
                    <li>
                      <Link href="/alerts" className="text-sm text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                        Price Alerts
                      </Link>
                    </li>
                    <li>
                      <Link href="/screener" className="text-sm text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                        Stock Screener
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                    About
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/about" className="text-sm text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="text-sm text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link href="/data-sources" className="text-sm text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white">
                        Data Sources
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Market data is provided by reliable financial sources and updated every 5 minutes.
                  </p>
                  <div className="flex items-center space-x-4">
                    <Link 
                      href="/privacy" 
                      className="text-xs text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white"
                    >
                      Privacy Policy
                    </Link>
                    <Link 
                      href="/terms" 
                      className="text-xs text-gray-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white"
                    >
                      Terms of Service
                    </Link>
                  </div>
                </div>
                <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                  © {new Date().getFullYear()} Cryptogreedindex.com. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "US Markets Live | S&P 500, NASDAQ, Dow Jones & Russell 2000 Today",
            "description": "Track real-time US market data, stock indices, and market trends. Get live updates from major US markets including S&P 500, NASDAQ, Dow Jones, and Russell 2000.",
            "url": "https://www.cryptogreedindex.com/us-markets",
            "mainEntity": {
              "@type": "DataFeed",
              "name": "US Markets Data",
              "description": "Real-time US market data and indices",
              "dataFeedElement": [
                {
                  "@type": "DataFeedItem",
                  "dateModified": new Date().toISOString(),
                  "item": {
                    "@type": "FinancialProduct",
                    "name": "S&P 500",
                    "category": "US Stock Market Index",
                    "marketStatus": "Open"
                  }
                },
                {
                  "@type": "DataFeedItem",
                  "dateModified": new Date().toISOString(),
                  "item": {
                    "@type": "FinancialProduct",
                    "name": "NASDAQ",
                    "category": "US Stock Market Index",
                    "marketStatus": "Open"
                  }
                },
                {
                  "@type": "DataFeedItem",
                  "dateModified": new Date().toISOString(),
                  "item": {
                    "@type": "FinancialProduct",
                    "name": "Dow Jones",
                    "category": "US Stock Market Index",
                    "marketStatus": "Open"
                  }
                },
                {
                  "@type": "DataFeedItem",
                  "dateModified": new Date().toISOString(),
                  "item": {
                    "@type": "FinancialProduct",
                    "name": "Russell 2000",
                    "category": "US Stock Market Index",
                    "marketStatus": "Open"
                  }
                }
              ]
            }
          })
        }}
      />
    </>
  );
}
