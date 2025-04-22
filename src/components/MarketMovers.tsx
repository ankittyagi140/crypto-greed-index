import React, { useEffect, useState } from 'react';

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

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const StockTable = ({ stocks, title }: { stocks: StockData[], title: string }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {asOf && (
          <span className="text-sm text-gray-500">As on {asOf}</span>
        )}
      </div>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Change%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {stocks.map((stock) => (
                <tr key={stock.symbol}>
                  <td className="py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{stock.symbol}</div>
                    <div className="text-sm text-gray-500">{stock.name}</div>
                  </td>
                  <td className="py-4 text-right text-sm text-gray-900 dark:text-white">
                    {stock.price.toFixed(2)}
                  </td>
                  <td className={`py-4 text-right text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                  </td>
                  <td className={`py-4 text-right text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    const fetchMarketMovers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/market-movers?index=${selectedIndex}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setGainers(result.data.gainers || []);
          setLosers(result.data.losers || []);
          setAsOf(result.data.asOf || '');
        } else {
          console.error('Invalid market movers data:', result);
        }
      } catch (error) {
        console.error('Error fetching market movers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketMovers();
    const interval = setInterval(fetchMarketMovers, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [selectedIndex]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setSelectedIndex('dow')}
          className={`px-4 py-2 text-sm font-medium cursor-pointer ${
            selectedIndex === 'dow'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Dow Jones
        </button>
        <button
          onClick={() => setSelectedIndex('nasdaq')}
          className={`px-4 py-2 text-sm font-medium cursor-pointer ${
            selectedIndex === 'nasdaq'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Nasdaq
        </button>
        <button
          onClick={() => setSelectedIndex('sp500')}
          className={`px-4 py-2 text-sm font-medium cursor-pointer ${
            selectedIndex === 'sp500'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          S&P 500
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockTable stocks={gainers} title="Gainers" />
        <StockTable stocks={losers} title="Losers" />
      </div>
    </div>
  );
} 