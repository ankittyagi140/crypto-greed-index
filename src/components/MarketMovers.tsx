import React, { useEffect, useState, useCallback } from 'react';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface MarketMoversProps {
  index: string;
}

export default function MarketMovers({ index }: MarketMoversProps) {
  const [gainers, setGainers] = useState<StockData[]>([]);
  const [losers, setLosers] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [asOf, setAsOf] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(index);
  const [marketStatus, setMarketStatus] = useState<'open' | 'closed'>('closed');
  const [lastUpdateTime, setLastUpdateTime] = useState<number | null>(null);
  const prevIndexRef = React.useRef(index);

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <table className="w-full">
        <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              NAME
            </th>
            <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              PRICE
            </th>
            <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              CHANGE
            </th>
            <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              CHANGE%
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {[...Array(8)].map((_, i) => (
            <tr key={i}>
              <td className="py-2 px-4 whitespace-normal">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </td>
              <td className="py-2 px-4 text-right">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
              </td>
              <td className="py-2 px-4 text-right">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
              </td>
              <td className="py-2 px-4 text-right">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Check if market is open
  const isMarketOpen = useCallback(() => {
    // Get current time in New York timezone
    const now = new Date();
    const options = { timeZone: 'America/New_York' };
    const nyTime = new Date(now.toLocaleString('en-US', options));
    
    // Extract day of week, hours, and minutes
    const day = nyTime.getDay();
    const hours = nyTime.getHours();
    const minutes = nyTime.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;
    
    // Market is open on weekdays (1 = Monday, 5 = Friday)
    if (day >= 1 && day <= 5) {
      // Pre-market: 4:00 AM - 9:30 AM and after-hours: 4:00 PM - 8:00 PM
      const preMarketOpenTime = 4 * 60; // 4:00 AM
      const afterHoursCloseTime = 20 * 60; // 8:00 PM
      
      // Check if within extended trading hours
      if (currentTimeInMinutes >= preMarketOpenTime && currentTimeInMinutes <= afterHoursCloseTime) {
        return true;
      }
    }
    
    return false;
  }, []);

  // Determine if we should fetch data based on market hours and last update time
  const shouldFetchData = useCallback(() => {
    // Always fetch if we don't have data yet
    if (gainers.length === 0 || losers.length === 0) {
      return true;
    }
    
    // Always fetch when index changes (track previous index in a ref)
    if (selectedIndex !== prevIndexRef.current) {
      prevIndexRef.current = selectedIndex;
      return true;
    }
    
    // Check if market is open
    const marketOpen = isMarketOpen();
    
    // If market is closed and we have data, don't fetch
    if (!marketOpen) {
      return false;
    }
    
    // If market is open, check when we last updated
    if (lastUpdateTime) {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateTime;
      
      // If market is open, update every 5 minutes (300000 ms)
      return timeSinceLastUpdate > 300000;
    }
    
    return true;
  }, [gainers.length, losers.length, lastUpdateTime, isMarketOpen, selectedIndex]);

  const fetchMarketMovers = useCallback(async () => {
    if (!shouldFetchData()) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/market-movers?index=${selectedIndex}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setGainers(result.data.gainers || []);
        setLosers(result.data.losers || []);
        setAsOf(result.data.asOf || '');
        setLastUpdateTime(Date.now());
        setMarketStatus(isMarketOpen() ? 'open' : 'closed');
      } else {
        console.error('Invalid market movers data:', result);
      }
    } catch (error) {
      console.error('Error fetching market movers:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedIndex, shouldFetchData, isMarketOpen]);

  useEffect(() => {
    // Initialize the prevIndexRef with the current selectedIndex
    prevIndexRef.current = selectedIndex;
    
    fetchMarketMovers();
    
    // Set up interval for updates - only if market is open
    const intervalId = setInterval(() => {
      if (isMarketOpen()) {
        fetchMarketMovers();
      }
    }, 300000); // Check every 5 minutes
    
    return () => clearInterval(intervalId);
  }, [selectedIndex, fetchMarketMovers, isMarketOpen]);

  const StockTable = ({ stocks, title }: { stocks: StockData[], title: string }) => (
    <div className="bg-white dark:bg-gray-800 w-full h-full">
      <div className="flex justify-between items-center px-4 pt-4 pb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {asOf && (
          <span className="text-sm text-gray-500">As on {asOf}</span>
        )}
      </div>
      <div className="min-h-[300px] lg:min-h-0">
        {loading ? (
          <div className="px-4 pb-4">
            <LoadingSkeleton />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NAME
                    </th>
                    <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PRICE
                    </th>
                    <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CHANGE
                    </th>
                    <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CHANGE%
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {stocks.length > 0 ? (
                    stocks.map((stock) => (
                      <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-2 px-4 whitespace-normal">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{stock.symbol}</div>
                          <div className="text-xs text-gray-500 truncate">{stock.name}</div>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {stock.price.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <span className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right">
                          <span className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500">
                        {marketStatus === 'closed' 
                          ? "Market is currently closed. Data shown is from last trading session."
                          : "No data available at this time."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Common function for tab click handling to reduce duplication
  const handleTabClick = (index: string) => {
    // Prevent scroll position change
    const scrollPosition = window.scrollY;
    
    // Set loading state and change index immediately
    setSelectedIndex(index);
    setLoading(true);
    
    // Clear existing data to ensure skeleton is shown
    setGainers([]);
    setLosers([]);
    
    fetch(`/api/market-movers?index=${index}`)
      .then(response => response.json())
      .then(result => {
        if (result.success && result.data) {
          setGainers(result.data.gainers || []);
          setLosers(result.data.losers || []);
          setAsOf(result.data.asOf || '');
          setLastUpdateTime(Date.now());
          setMarketStatus(isMarketOpen() ? 'open' : 'closed');
        }
        setLoading(false);
        // Restore scroll position
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto'
        });
      })
      .catch(error => {
        console.error('Error fetching market movers:', error);
        setLoading(false);
        // Restore scroll position
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto'
        });
      });
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="flex gap-4 mb-4 border-b border-gray-200 dark:border-gray-700 px-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('dow');
          }}
          className={`px-4 py-2 text-sm font-medium cursor-pointer ${
            selectedIndex === 'dow'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Dow Jones
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('nasdaq');
          }}
          className={`px-4 py-2 text-sm font-medium cursor-pointer ${
            selectedIndex === 'nasdaq'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Nasdaq
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('sp500');
          }}
          className={`px-4 py-2 text-sm font-medium cursor-pointer ${
            selectedIndex === 'sp500'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          S&P 500
        </button>
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-0 border-t border-gray-200 dark:border-gray-700">
        <div className="lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
          <StockTable stocks={gainers} title="Gainers" />
        </div>
        <div className="border-t lg:border-t-0">
          <StockTable stocks={losers} title="Losers" />
        </div>
      </div>
      {marketStatus === 'closed' && gainers.length > 0 && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
            Market is closed. Data shown is from last trading session.
          </div>
        </div>
      )}
      
      {/* SEO-friendly index description */}
    </div>
  );
} 