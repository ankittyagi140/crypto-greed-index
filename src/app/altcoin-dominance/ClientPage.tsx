'use client';

import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import AltcoinDominance from '@/components/AltcoinDominance';

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
      const loadingToast = toast.loading('Fetching altcoin dominance data...', {
        position: 'top-right',
      });
      try {
        const response = await fetch('/api/altcoin-dominance');
        const result = await response.json();

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again in a few minutes.');
          }
          throw new Error(result.error || 'Failed to fetch altcoin dominance data');
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to load altcoin dominance data';
        setError(errorMessage);
        toast.error(errorMessage, { 
          id: loadingToast,
          duration: 4000,
        });
        console.error('Error fetching altcoin dominance data:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-[500px]" />
        </div>
      </div>
    );
  }

  return (
    <>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Altcoin Market Dominance Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
              Track altcoins&apos; influence in the cryptocurrency market through their dominance metrics
            </p>
          </div>

          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                Try again
              </button>
            </div>
          ) : (
            data.length > 0 && <AltcoinDominance data={data} isDetailPage={true} />
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Understanding Altcoin Dominance
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Altcoin dominance represents the combined market capitalization of all cryptocurrencies except Bitcoin and Ethereum as a percentage of the total cryptocurrency market capitalization. This metric is crucial for understanding the relative strength and influence of altcoins in the crypto market.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    High Altcoin Dominance Implications
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Strong altcoin market position</li>
                    <li>Reduced Bitcoin/ETH market share</li>
                    <li>Potential altcoin season</li>
                    <li>Market diversification</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Low Altcoin Dominance Implications
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Strong Bitcoin/ETH market position</li>
                    <li>Market consolidation phase</li>
                    <li>Traditional market confidence</li>
                    <li>Potential market stability</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 