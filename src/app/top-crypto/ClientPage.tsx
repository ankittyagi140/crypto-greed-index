'use client';

import CoinList from '../../components/CoinList';
import Link from 'next/link';

export default function ClientPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-8 space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Top 100 Cryptocurrencies by Market Cap
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real-time prices and market data for the top 100 cryptocurrencies. Updated every 5 minutes to provide you with the most accurate market information.
          </p>
        </div>
        
        {/* CoinList Component */}
        <CoinList />
        
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
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
      </div>
    </>
  );
} 