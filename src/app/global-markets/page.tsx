'use client';

import { useState, useEffect } from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { toast } from 'react-hot-toast';
import {
  GlobeAsiaAustraliaIcon,
  GlobeAmericasIcon,
  GlobeEuropeAfricaIcon,
  SunIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';


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
    dailyRange: {
      low: number;
      high: number;
      range: string;
    };
    fiftyTwoWeekRange: {
      low: number;
      high: number;
      range: string;
    };
    volume: number;
    previousClose: number;
    open: number;
    regularMarketTime?: Date;
    weekChange?: number;
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
      'India': { start: 3.75, end: 10 }, // 9:15-15:30 IST (UTC+5:30)
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

// Add countryToFlagCode mapping to convert country names to flag codes
const countryToFlagCode: Record<string, string> = {
  'Japan': 'jp',
  'China': 'cn',
  'Hong Kong': 'hk',
  'South Korea': 'kr',
  'Australia': 'au',
  'India': 'in',
  'Singapore': 'sg',
  'Indonesia': 'id',
  'Taiwan': 'tw',
  'United Kingdom': 'gb',
  'Germany': 'de',
  'France': 'fr',
  'Eurozone': 'eu',
  'Spain': 'es',
  'Italy': 'it',
  'Netherlands': 'nl',
  'Switzerland': 'ch',
  'Sweden': 'se',
  'Russia': 'ru',
  'Brazil': 'br',
  'Mexico': 'mx',
  'Canada': 'ca',
  'Argentina': 'ar',
  'Chile': 'cl',
  'Colombia': 'co',
  'Saudi Arabia': 'sa',
  'Israel': 'il',
  'Qatar': 'qa',
  'UAE': 'ae',
  'Egypt': 'eg',
  'South Africa': 'za',
  'United States': 'us',
};

const IndexRow = ({ data }: { data: IndexData }) => {
  const { currentStats, name, country, historicalData } = data;

  // Get current time in UTC with more precision
  const now = new Date();
  const utcHours = now.getUTCHours() + (now.getUTCMinutes() / 60);
  const utcDay = now.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  // Log the current time for debugging

  // Calculate week change
  const calculateWeekChange = () => {
    if (!data.historicalData || data.historicalData.length < 2) return 0;
    const latestPrice = data.historicalData[data.historicalData.length - 1].value;
    const sevenDaysAgoPrice = data.historicalData[0].value;
    return ((latestPrice - sevenDaysAgoPrice) / sevenDaysAgoPrice) * 100;
  };

  currentStats.weekChange = calculateWeekChange();

  // Check if market is open based on trading hours and last update
  const isMarketOpen = () => {
    // If it's Saturday or Sunday, market is closed
    if (utcDay === 0 || utcDay === 6) return false;

    // Get market hours for the current country
    const marketHours = getMarketHours();
    if (!marketHours) return false;

    // Check if current time is within market hours
    const isWithinHours = (hours: MarketHours) => {
      const { start, end } = hours;
      // Handle cases where market spans across UTC day boundary
      if (start > end) {
        return utcHours >= start || utcHours <= end;
      }
      return utcHours >= start && utcHours <= end;
    };

    // Check if we're within market hours
    const isWithinMarketHours = isWithinHours(marketHours);
    
    // Check for valid regularMarketTime
    const marketTime = currentStats.regularMarketTime;
    if (!marketTime) return isWithinMarketHours; // If no market time, just use hours

    // Parse the date safely
    let marketDate: Date;
    try {
      if (typeof marketTime === 'string' || marketTime instanceof Date) {
        marketDate = new Date(marketTime);
        if (isNaN(marketDate.getTime())) return isWithinMarketHours; // If invalid date, just use hours
      } else {
        return isWithinMarketHours; // If not a valid date input, just use hours
      }
    } catch (e) {
      console.error("Error parsing market date:", e, marketTime);
      return isWithinMarketHours; // If error, just use hours
    }

    // Check if we have recent data (last 30 minutes)
    const hasRecentUpdate = (now.getTime() - marketDate.getTime()) <= 30 * 60 * 1000; // Increased to 30 minutes
    
    // For debugging
    if (country === 'India') {
      console.log('India market check:', { 
        utcHours, 
        marketHours, 
        isWithinMarketHours,
        hasRecentUpdate, 
        marketDate: marketDate?.toISOString(),
        nowTime: now.toISOString()
      });
    }
    
    // Return true if within market hours and has recent update
    return isWithinMarketHours && hasRecentUpdate;
  };

  // Get market hours for the current country
  const getMarketHours = () => {
    // Check Asian market hours
    const asianMarketHours = MARKET_HOURS['Asia Pacific']?.open;
    const asianCountry = country as keyof AsianMarketHours;
    if (asianMarketHours && asianCountry in asianMarketHours) {
      return asianMarketHours[asianCountry];
    }

    // Check European market hours
    const europeanMarketHours = MARKET_HOURS['Europe']?.open;
    const europeanCountry = country as keyof EuropeanMarketHours;
    if (europeanMarketHours && europeanCountry in europeanMarketHours) {
      return europeanMarketHours[europeanCountry];
    }

    // Check Americas market hours
    const americasMarketHours = MARKET_HOURS['Americas']?.open;
    const americasCountry = country as keyof AmericasMarketHours;
    if (americasMarketHours && americasCountry in americasMarketHours) {
      return americasMarketHours[americasCountry];
    }

    // Check Middle East & Africa market hours
    const meaMarketHours = MARKET_HOURS['Middle East & Africa']?.open;
    const meaCountry = country as keyof MiddleEastAfricaMarketHours;
    if (meaMarketHours && meaCountry in meaMarketHours) {
      return meaMarketHours[meaCountry];
    }

    return null;
  };

  // Return the JSX with updated padding for mobile
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="py-2 sm:py-3 px-2 sm:px-4">
        <div className="flex items-center space-x-2">
          {country && countryToFlagCode[country] && (
            <div className="w-5 h-5 inline-block relative">
              <Image
                src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryToFlagCode[country].toUpperCase()}.svg`}
                alt={`${country} flag`}
                width={20}
                height={15}
                className="rounded-sm"
              />
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>
                {name}
              </span>
              {isMarketOpen() && (
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{country}</div>
          </div>
        </div>
      </td>
      <td className="py-2 sm:py-3 px-2 sm:px-4">
        <div className="w-20 h-12">
          {historicalData && historicalData.length > 0 && (
            <Sparklines data={historicalData.map(item => item.value)} svgHeight={40} svgWidth={80}>
              <SparklinesLine color={currentStats.change >= 0 ? "#10B981" : "#EF4444"} />
            </Sparklines>
          )}
        </div>
      </td>
      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-medium text-gray-900 dark:text-white">
        {currentStats.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </td>
      <td className={`py-2 sm:py-3 px-2 sm:px-4 text-right font-medium ${currentStats.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {currentStats.change >= 0 ? '+' : ''}{currentStats.change.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </td>
      <td className={`py-2 sm:py-3 px-2 sm:px-4 text-right font-medium ${currentStats.changePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {currentStats.changePercent >= 0 ? '+' : ''}{currentStats.changePercent.toFixed(2)}%
      </td>
      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">{currentStats.dailyRange.high.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">{currentStats.dailyRange.low.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">{currentStats.open.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">{currentStats.previousClose.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">{currentStats.fiftyTwoWeekRange.high.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">{currentStats.fiftyTwoWeekRange.low.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
    </tr>
  );
};

const RegionSection = ({ title, data }: { title: string; data: IndexData[] }) => {
  const IconComponent = REGION_ICONS[title as keyof typeof REGION_ICONS];

  return (
    <section className="mb-6 sm:mb-14" aria-labelledby={`region-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center gap-2 mb-4 px-2 sm:px-4">
        {IconComponent && <IconComponent className="h-6 w-6 text-gray-600 dark:text-gray-400" aria-hidden="true" />}
        <h2 id={`region-${title.toLowerCase().replace(/\s+/g, '-')}`} className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="overflow-x-auto -mx-0">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th scope="col" className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                7D Chart
              </th>
              <th scope="col" className="py-2 sm:py-3 px-2 sm:px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                LTP
              </th>
              <th scope="col" className="py-2 sm:py-3 px-2 sm:px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Change
              </th>
              <th scope="col" className="py-2 sm:py-3 px-2 sm:px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Chg%
              </th>
              <th scope="col" className="py-2 sm:py-3 px-2 sm:px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                High
              </th>
              <th scope="col" className="py-2 sm:py-3 px-2 sm:px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Low
              </th>
              <th scope="col" className="py-2 sm:py-3 px-2 sm:px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Open
              </th>
              <th scope="col" className="py-2 sm:py-3 px-2 sm:px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Prev. Close
              </th>
              <th scope="col" className="py-2 sm:py-3 px-2 sm:px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                52 W High
              </th>
              <th scope="col" className="py-2 sm:py-3 px-2 sm:px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                52 W Low
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((index) => (
              <IndexRow key={index.key} data={index} />
        ))}
          </tbody>
        </table>
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
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8" aria-busy="true" aria-label="Loading global markets data">
          <div className="animate-pulse space-y-12">
            {['Asia Pacific', 'Europe', 'Americas', 'Middle East & Africa'].map((region) => (
              <div key={region} className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-0 sm:px-6 py-4 sm:py-12 max-w-8xl">
        <header className="text-center mb-4 sm:mb-12 px-2 sm:px-0">
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

        <nav aria-label="Market regions" className="mb-4 sm:mb-8 px-2 sm:px-0">
          <ul className="flex flex-wrap justify-center gap-4">
            {Object.keys(marketData).map((region) => (
              <li key={region}>
                <a
                  href={`#region-${region.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm font-medium text-blue-600 hover:text-[#048F04] dark:text-gray-400 dark:hover:text-white"
                >
                  {region}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div role="region" aria-label="Global market data" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-0 sm:p-6">
          {Object.entries(marketData).map(([region, indices]) => (
            <RegionSection key={region} title={region} data={indices} />
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center text-sm text-gray-500 dark:text-gray-400 px-2 sm:px-0">
          <p>Data is updated every 5 minutes. Market hours are in UTC.</p>
          <p className="mt-2">
            <Link
              href="/about"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              aria-label="Learn more about our data sources"
            >
              Learn more about our data sources
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}