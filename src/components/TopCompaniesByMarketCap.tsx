import React, { useState, useCallback, useEffect } from 'react';

interface Company {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  change: number;
  changePercent: number;
  high52Week: number;
  low52Week: number;
  touchingHigh: boolean;
  touchingLow: boolean;
}

export default function TopCompaniesByMarketCap() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  );

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/top-companies');
      const result = await response.json();
      
      if (result.success && result.data) {
        setCompanies(result.data.companies);
        setLastUpdated(result.data.lastUpdated);
      } else {
        console.error('Invalid top companies data:', result);
      }
    } catch (error) {
      console.error('Error fetching top companies:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(fetchCompanies, 60000);
    fetchCompanies();
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchCompanies]);

  const stocksAtHighs = companies.filter(company => company.touchingHigh);
  const stocksAtLows = companies.filter(company => company.touchingLow);

  return (
    <div className="bg-white dark:bg-gray-800">
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="flex flex-col lg:flex-row">
          {/* 52 Week Data */}
          <div className="w-full lg:w-1/2 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
            <div className="flex flex-col space-y-6">
              {/* 52 Week Highs */}
              <div>
                <h3 className="text-base sm:text-lg font-bold mb-4">52 Week Highs</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-2 text-xs font-medium">Name</th>
                        <th className="py-2 text-xs font-medium text-right">Price</th>
                        <th className="py-2 text-xs font-medium text-right">Change%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stocksAtHighs.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-4 text-center text-sm text-gray-500">
                            No stocks at 52-week high
                          </td>
                        </tr>
                      ) : (
                        stocksAtHighs.map((company) => (
                          <tr key={company.symbol} className="border-b border-gray-100">
                            <td className="py-2 sm:py-3">
                              <div className="text-xs sm:text-sm font-medium">{company.symbol}</div>
                              <div className="text-xs text-gray-500">{company.name}</div>
                            </td>
                            <td className="py-2 sm:py-3 text-right text-xs sm:text-sm">
                              ${company.price.toFixed(2)}
                            </td>
                            <td className="py-2 sm:py-3 text-right text-xs sm:text-sm text-green-500">
                              +{company.changePercent.toFixed(2)}%
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 52 Week Lows */}
              <div>
                <h3 className="text-base sm:text-lg font-bold mb-4">52 Week Lows</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-2 text-xs font-medium">Name</th>
                        <th className="py-2 text-xs font-medium text-right">Price</th>
                        <th className="py-2 text-xs font-medium text-right">Change%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stocksAtLows.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-4 text-center text-sm text-gray-500">
                            No stocks at 52-week low
                          </td>
                        </tr>
                      ) : (
                        stocksAtLows.map((company) => (
                          <tr key={company.symbol} className="border-b border-gray-100">
                            <td className="py-2 sm:py-3">
                              <div className="text-xs sm:text-sm font-medium">{company.symbol}</div>
                              <div className="text-xs text-gray-500">{company.name}</div>
                            </td>
                            <td className="py-2 sm:py-3 text-right text-xs sm:text-sm">
                              ${company.price.toFixed(2)}
                            </td>
                            <td className="py-2 sm:py-3 text-right text-xs sm:text-sm text-red-500">
                              {company.changePercent.toFixed(2)}%
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Current Market Data */}
          <div className="w-full lg:w-1/2 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-bold">Top Companies by Market Cap</h2>
              {lastUpdated && (
                <span className="text-xs sm:text-sm text-gray-500">
                  As on {lastUpdated}
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 text-xs font-medium">Name</th>
                    <th className="py-2 text-xs font-medium text-right">Price</th>
                    <th className="py-2 text-xs font-medium text-right">Change</th>
                    <th className="py-2 text-xs font-medium text-right">Change%</th>
                    <th className="py-2 text-xs font-medium text-right">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.symbol} className="border-b border-gray-100">
                      <td className="py-2 sm:py-3">
                        <div className="text-xs sm:text-sm font-medium">{company.symbol}</div>
                        <div className="text-xs text-gray-500">{company.name}</div>
                      </td>
                      <td className="py-2 sm:py-3 text-right text-xs sm:text-sm">
                        ${company.price.toFixed(2)}
                      </td>
                      <td className={`py-2 sm:py-3 text-right text-xs sm:text-sm ${company.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {company.change >= 0 ? '+' : ''}{company.change.toFixed(2)}
                      </td>
                      <td className={`py-2 sm:py-3 text-right text-xs sm:text-sm ${company.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {company.change >= 0 ? '+' : ''}{company.changePercent.toFixed(2)}%
                      </td>
                      <td className="py-2 sm:py-3 text-right text-xs sm:text-sm">
                        {(company.marketCap / 1e9).toFixed(2)}B
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 