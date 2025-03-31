'use client';

import React from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShareIcon,
  BellIcon,
  ChartPieIcon,
  MapIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-8xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About <Link href="https://www.cryptogreedindex.com" className="text-blue-600 hover:text-[#048F04] dark:text-blue-400 dark:hover:text-[#048F04]">CryptoGreedIndex.com</Link></h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              CryptoGreedIndex is your comprehensive platform for tracking cryptocurrency market sentiment and market movements. We provide real-time insights into the crypto market&rsquo;s emotional state and significant price movements across major cryptocurrencies.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              To provide accurate, real-time market sentiment analysis and price movement tracking to help investors make informed decisions in the cryptocurrency market.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ChartBarIcon className="h-6 w-6 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fear & Greed Index</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Track the market&rsquo;s emotional state with our real-time Fear & Greed Index, updated daily to reflect current market sentiment.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-green-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Gainers</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Monitor the best-performing cryptocurrencies with our Top Gainers section, showing significant price increases.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ArrowTrendingDownIcon className="h-6 w-6 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Losers</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Stay informed about significant price declines with our Top Losers section, helping you identify market downtrends.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ChartPieIcon className="h-6 w-6 text-purple-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market Dominance</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Track market dominance percentages for Bitcoin, Ethereum, and Altcoins to understand market structure.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <MapIcon className="h-6 w-6 text-indigo-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Global Markets</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Access comprehensive global market data including total market cap, 24h volume, and market trends across different regions.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <BuildingOfficeIcon className="h-6 w-6 text-orange-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">US Markets</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Track US-specific market data including trading volumes, market sentiment, and regulatory impacts on cryptocurrency markets.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ShareIcon className="h-6 w-6 text-blue-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Sharing</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Share market insights with others through integrated social media sharing buttons for Twitter, Facebook, Telegram, and WhatsApp.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <BellIcon className="h-6 w-6 text-yellow-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Real-time Updates</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Get instant updates on market movements and sentiment changes with our real-time data refresh system.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Data Sources</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We rely on trusted data sources to provide accurate market information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-6">
              <li>
                <a 
                  href="https://www.coingecko.com/api/documentation" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  CoinGecko API
                </a> - For cryptocurrency market data, prices, and market cap information
              </li>
              <li>
                <a 
                  href="https://alternative.me/crypto/api/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Alternative.me API
                </a> - For Fear & Greed Index data and market sentiment analysis
              </li>
              <li>Real-time market data from multiple exchanges for accurate price tracking</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Market Overview</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our platform provides comprehensive market insights including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-6">
              <li>Total market capitalization and 24h volume</li>
              <li>Bitcoin and Ethereum dominance tracking</li>
              <li>Altcoin market share analysis</li>
              <li>Historical Fear & Greed Index trends</li>
              <li>Significant price movements across major cryptocurrencies</li>
              <li>US market specific data and trends</li>
              <li>Global market overview and regional analysis</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Have questions or suggestions? We&rsquo;d love to hear from you:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
              <li>Email: <a href="mailto:cryptogreedindex@gmail.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">cryptogreedindex@gmail.com</a></li>
              <li>Website: <a href="https://www.cryptogreedindex.com/contact" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">https://www.cryptogreedindex.com/contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 