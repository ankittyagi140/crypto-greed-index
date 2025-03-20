'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Toaster, toast } from 'react-hot-toast';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  GlobeAsiaAustraliaIcon, 
  GlobeAmericasIcon, 
  GlobeEuropeAfricaIcon,
  SunIcon 
} from '@heroicons/react/24/solid';

interface IndexData {
  key: string;
  name: string;
  country: string;
  historicalData: { date: string; value: number; }[];
  currentStats: {
    price: number;
    change: number;
    changePercent: number;
    yearToDateChange: number;
    yearToDatePercent: number;
    high52Week: number;
    low52Week: number;
    volume: number;
    regularMarketTime?: Date;
  };
}

interface RegionData {
  [region: string]: IndexData[];
}

interface MarketHours {
  start: number;
  end: number;
}

interface AsianMarketHours {
  'Japan': MarketHours;
  'China': MarketHours;
  'Hong Kong': MarketHours;
  'South Korea': MarketHours;
  'Australia': MarketHours;
  'India': MarketHours;
  'Singapore': MarketHours;
  'Indonesia': MarketHours;
  'Taiwan': MarketHours;
}

interface EuropeanMarketHours {
  'United Kingdom': MarketHours;
  'Germany': MarketHours;
  'France': MarketHours;
  'Eurozone': MarketHours;
  'Spain': MarketHours;
  'Italy': MarketHours;
  'Netherlands': MarketHours;
  'Switzerland': MarketHours;
  'Sweden': MarketHours;
  'Russia': MarketHours;
}

interface AmericasMarketHours {
  'Brazil': MarketHours;
  'Mexico': MarketHours;
  'Canada': MarketHours;
  'Argentina': MarketHours;
  'Chile': MarketHours;
  'Colombia': MarketHours;
}

interface MiddleEastAfricaMarketHours {
  'Saudi Arabia': MarketHours;
  'Israel': MarketHours;
  'Qatar': MarketHours;
  'UAE': MarketHours;
  'Egypt': MarketHours;
  'South Africa': MarketHours;
}

const REGION_ICONS = {
  'Asia Pacific': GlobeAsiaAustraliaIcon,
  'Americas': GlobeAmericasIcon,
  'Europe': GlobeEuropeAfricaIcon,
  'Middle East & Africa': SunIcon,
};

const MARKET_HOURS = {
  'Asia Pacific': {
    // Hours in UTC
    open: {
      'Japan': { start: 0, end: 6 }, // 9:00-15:00 JST
      'China': { start: 1.5, end: 7 }, // 9:30-15:00 CST
      'Hong Kong': { start: 1.5, end: 8 }, // 9:30-16:00 HKT
      'South Korea': { start: 0, end: 6 }, // 9:00-15:00 KST
      'Australia': { start: 0, end: 6 }, // 10:00-16:00 AEST
      'India': { start: 3.5, end: 10 }, // 9:15-15:30 IST
      'Singapore': { start: 1, end: 9 }, // 9:00-17:00 SGT
      'Indonesia': { start: 1.5, end: 9 }, // 9:30-16:00 WIB
      'Taiwan': { start: 1, end: 5.5 }, // 9:00-13:30 TST
    } as AsianMarketHours
  },
  'Europe': {
    open: {
      'United Kingdom': { start: 8, end: 16.5 }, // 8:00-16:30 GMT/BST
      'Germany': { start: 7, end: 15.5 }, // 9:00-17:30 CET
      'France': { start: 7, end: 15.5 }, // 9:00-17:30 CET
      'Eurozone': { start: 7, end: 15.5 }, // 9:00-17:30 CET
      'Spain': { start: 7, end: 15.5 }, // 9:00-17:30 CET
      'Italy': { start: 7, end: 15.5 }, // 9:00-17:30 CET
      'Netherlands': { start: 7, end: 15.5 }, // 9:00-17:30 CET
      'Switzerland': { start: 7, end: 15.5 }, // 9:00-17:30 CET
      'Sweden': { start: 7, end: 15.5 }, // 9:00-17:30 CET
      'Russia': { start: 7, end: 15.5 }, // 10:00-18:30 MSK
    } as EuropeanMarketHours
  },
  'Americas': {
    open: {
      'Brazil': { start: 13, end: 20 }, // 10:00-17:00 BRT
      'Mexico': { start: 14.5, end: 21 }, // 8:30-15:00 CDT
      'Canada': { start: 13.5, end: 20 }, // 9:30-16:00 EDT
      'Argentina': { start: 14, end: 21 }, // 11:00-18:00 ART
      'Chile': { start: 13, end: 21 }, // 9:00-17:00 CLT
      'Colombia': { start: 14, end: 21 }, // 9:00-16:00 COT
    } as AmericasMarketHours
  },
  'Middle East & Africa': {
    open: {
      'Saudi Arabia': { start: 7, end: 13 }, // 10:00-16:00 AST
      'Israel': { start: 7, end: 14.5 }, // 9:00-16:30 IST
      'Qatar': { start: 7, end: 13 }, // 10:00-16:00 AST
      'UAE': { start: 6, end: 12 }, // 10:00-16:00 GST
      'Egypt': { start: 8, end: 14.5 }, // 10:00-16:30 EET
      'South Africa': { start: 7, end: 15 }, // 9:00-17:00 SAST
    } as MiddleEastAfricaMarketHours
  }
} as const;

const IndexCard = ({ data }: { data: IndexData }) => {
  const { currentStats, historicalData, name, country } = data;
  
  // Get current time in UTC
  const now = new Date();
  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;

  // Check if market is closed based on trading hours and last update
  const isMarketClosed = () => {
    // If no recent update (more than 15 minutes), consider it closed
    if (!currentStats.regularMarketTime || 
        (now.getTime() - new Date(currentStats.regularMarketTime).getTime()) > 15 * 60 * 1000) {
      return true;
    }

    // Check Asian market hours
    const asianMarketHours = MARKET_HOURS['Asia Pacific']?.open;
    const asianCountry = country as keyof AsianMarketHours;
    if (asianMarketHours && asianCountry in asianMarketHours) {
      const hours = asianMarketHours[asianCountry];
      // Handle cases where market spans across UTC day boundary
      if (hours.start > hours.end) {
        return !(utcHours >= hours.start || utcHours <= hours.end);
      }
      return !(utcHours >= hours.start && utcHours <= hours.end);
    }

    // Check European market hours
    const europeanMarketHours = MARKET_HOURS['Europe']?.open;
    const europeanCountry = country as keyof EuropeanMarketHours;
    if (europeanMarketHours && europeanCountry in europeanMarketHours) {
      const hours = europeanMarketHours[europeanCountry];
      return !(utcHours >= hours.start && utcHours <= hours.end);
    }

    // Check Americas market hours
    const americasMarketHours = MARKET_HOURS['Americas']?.open;
    const americasCountry = country as keyof AmericasMarketHours;
    if (americasMarketHours && americasCountry in americasMarketHours) {
      const hours = americasMarketHours[americasCountry];
      return !(utcHours >= hours.start && utcHours <= hours.end);
    }

    // Check Middle East & Africa market hours
    const meaMarketHours = MARKET_HOURS['Middle East & Africa']?.open;
    const meaCountry = country as keyof MiddleEastAfricaMarketHours;
    if (meaMarketHours && meaCountry in meaMarketHours) {
      const hours = meaMarketHours[meaCountry];
      return !(utcHours >= hours.start && utcHours <= hours.end);
    }

    // For other markets, use the 15-minute rule
    return (now.getTime() - new Date(currentStats.regularMarketTime).getTime()) > 15 * 60 * 1000;
  };

  const marketClosed = isMarketClosed();
  

  const formattedTime = currentStats.regularMarketTime 
    ? new Date(currentStats.regularMarketTime).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : '';

  return (
    <article className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-200" aria-label={`${name} Market Index from ${country}`}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {name}
              </h3>
              {marketClosed && (
                <span className="px-3 py-1 text-xs font-medium bg-gray-900 text-white rounded-full">
                  CLOSED
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {country}
            </p>
            <p className="text-2xl sm:text-3xl font-bold mt-2" aria-label={`Current price: ${currentStats.price.toLocaleString()}`}>
              {currentStats.price.toLocaleString()}
            </p>
            <div className={`flex items-center mt-1 ${currentStats.change >= 0 ? 'text-green-500' : 'text-red-500'}`} 
                 aria-label={`Price change: ${currentStats.change >= 0 ? 'up' : 'down'} ${Math.abs(currentStats.change).toFixed(2)} points (${currentStats.changePercent.toFixed(2)}%)`}>
              {currentStats.change >= 0 ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" aria-hidden="true" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" aria-hidden="true" />
              )}
              <span className="text-sm sm:text-base">
                {currentStats.change >= 0 ? '+' : ''}{currentStats.change.toFixed(2)} ({currentStats.changePercent.toFixed(2)}%)
              </span>
            </div>
            {formattedTime && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" aria-label={`Last updated at ${formattedTime}`}>
                As of {formattedTime}
              </p>
            )}
          </div>
          <div className="w-24 h-16 sm:w-32 sm:h-20" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={currentStats.change >= 0 ? '#22c55e' : '#ef4444'}
                  strokeWidth={2}
                  dot={false}
                  opacity={marketClosed ? 0.6 : 1}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">YTD</p>
            <p className={`text-sm font-semibold ${currentStats.yearToDateChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
               aria-label={`Year to date change: ${currentStats.yearToDateChange >= 0 ? 'up' : 'down'} ${Math.abs(currentStats.yearToDatePercent).toFixed(2)}%`}>
              {currentStats.yearToDateChange >= 0 ? '+' : ''}{currentStats.yearToDatePercent.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300"
               aria-label={`Trading volume: ${(currentStats.volume / 1000000).toFixed(1)} million`}>
              {(currentStats.volume / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

const RegionSection = ({ title, data }: { title: string; data: IndexData[] }) => {
  const IconComponent = REGION_ICONS[title as keyof typeof REGION_ICONS];

  return (
    <section className="mb-8 sm:mb-12" aria-labelledby={`region-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        {IconComponent && <IconComponent className="h-6 w-6 text-gray-600 dark:text-gray-400" aria-hidden="true" />}
        <h2 id={`region-${title.toLowerCase().replace(/\s+/g, '-')}`} className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {data.map((index) => (
          <IndexCard key={index.key} data={index} />
        ))}
      </div>
    </section>
  );
};

export default function GlobalMarkets() {
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState<RegionData>({});
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchData = async () => {
    const loadingToast = toast.loading('Fetching global markets data...', {
      position: 'top-right',
    });
    try {
      setLoading(true);
      const response = await fetch('/api/global-markets');

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a few minutes.');
        }
        throw new Error('Failed to fetch global markets data');
      }

      const json = await response.json();

      if (json.success && json.data) {
        setMarketData(json.data);
        toast.success('Global markets data updated', {
          id: loadingToast,
          duration: 3000,
        });
      } else {
        throw new Error('Invalid data received from server');
      }

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load global markets data';
      console.error('Error fetching data:', error);
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <main className="container mx-auto px-4 py-8" aria-busy="true" aria-label="Loading global markets data">
          <div className="animate-pulse space-y-12">
            {['Asia Pacific', 'Europe', 'Americas', 'Middle East & Africa'].map((region) => (
              <div key={region} className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#059669',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#DC2626',
              color: '#fff',
            },
          },
          loading: {
            style: {
              background: '#2563EB',
              color: '#fff',
            },
          },
        }}
      />
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
            Global Markets Today
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            Real-time performance of major stock indices worldwide
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2" aria-live="polite">
            Last updated: {lastUpdated}
          </p>
        </header>

        {Object.entries(marketData).map(([region, indices]) => (
          <RegionSection key={region} title={region} data={indices} />
        ))}
      </main>
    </div>
  );
}