import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, TrendingDown, Globe, Clock, DollarSign, BarChart2, ExternalLink, Twitter, FileText, ArrowLeft, Award, Users, Activity } from 'lucide-react';
import ChartClientWrapper from './ChartClientWrapper';

// Define the dynamic metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ coinId: string }> }): Promise<Metadata> {
  // Need to await the params since it's a Promise
  const { coinId } = await params;
  const coinData = await getCoinData(coinId);
  
  return {
    title: coinData ? `${coinData.name} (${coinData.symbol.toUpperCase()}) - Crypto Greed Index` : 'Coin Details - Crypto Greed Index',
    description: coinData ? `${coinData.name} price, market cap, volume, and more.` : 'Cryptocurrency details and market data.',
  };
}

// Fetch coin data from our own API endpoint
async function getCoinData(coinId: string) {
  try {
    // Use our own API endpoint to fetch coin data
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.cryptogreedindex.com';
    const response = await fetch(`${baseUrl}/api/coins/${coinId}`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch coin data: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.id) {
      throw new Error('Invalid response format from API');
    }
    
    // Return the enriched data from our API
    return data;
  } catch (error) {
    console.error('Error fetching coin data:', error);
    
    // Provide fallback data for demo purposes
    return {
      id: coinId,
      symbol: coinId,
      name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      current_price: 60000,
      market_cap: 1000000000000,
      market_cap_rank: 1,
      total_volume: 30000000000,
      high_24h: 61000,
      low_24h: 59000,
      price_change_24h: 1000,
      price_change_percentage_24h: 1.67,
      price_change_percentage_7d: 5.24,
      price_change_percentage_1h: 0.45,
      price_change_percentage_30d: 8.36,
      price_change_percentage_24h_formatted: '1.67',
      price_change_percentage_7d_formatted: '5.24',
      price_change_percentage_1h_formatted: '0.45',
      price_change_percentage_30d_formatted: '8.36',
      fully_diluted_valuation: 1200000000000,
      total_supply: 21000000,
      available_supply: 19000000,
      website_url: 'https://bitcoin.org',
      twitter_url: 'https://twitter.com/bitcoin',
      reddit_url: 'https://reddit.com/r/bitcoin',
      explorers: ['https://blockchain.info'],
      contract_address: null
    };
  }
}

// Format large numbers
function formatLargeNumber(num: number) {
  if (num >= 1000000000000) {
    return `$${(num / 1000000000000).toFixed(2)}T`;
  }
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(2)}B`;
  }
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  }
  return `$${num.toFixed(2)}`;
}

function getChangeColor(change: number) {
  return change >= 0 ? 'text-green-500' : 'text-red-500';
}

function getChangeIcon(change: number, size = 16) {
  return change >= 0 
    ? <TrendingUp size={size} className="text-green-500" /> 
    : <TrendingDown size={size} className="text-red-500" />;
}

export default async function CoinDetailsPage({ params }: { params: Promise<{ coinId: string }> }) {
  // Need to await the params since it's a Promise
  const { coinId } = await params;
  const coinData = await getCoinData(coinId);
  
  if (!coinData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Coin Not Found</h1>
          <p className="mb-6">Sorry, we couldn&apos;t find data for this cryptocurrency.</p>
          <Link href="/top-crypto" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            Back to Top Cryptocurrencies
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 bg-white dark:bg-gray-900 min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Link href="/top-crypto" className="group flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Top Cryptocurrencies
        </Link>
      </div>
      
      {/* Header Section with Price */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center">
              {coinData.image && (
                <div className="mr-5">
                  <Image 
                    src={coinData.image} 
                    alt={coinData.name} 
                    width={64} 
                    height={64} 
                    className="rounded-full"
                  />
                </div>
              )}
              <div>
                <div className="flex items-center">
                  <h1 className="text-3xl font-bold mr-3">{coinData.name}</h1>
                  <span className="text-gray-500 text-lg font-medium py-1 px-2 bg-gray-100 dark:bg-gray-700 rounded-md">{coinData.symbol.toUpperCase()}</span>
                </div>
                <div className="flex items-center mt-2 space-x-2">
                  <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-sm">
                    <Award size={14} className="mr-1" />
                    <span>Rank #{coinData.market_cap_rank}</span>
                  </div>
                  {coinData.website_url && (
                    <a href={coinData.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <Globe size={14} className="mr-1" />
                      <span>Website</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="md:text-right">
              <div className="text-4xl font-bold">${coinData.current_price.toLocaleString()}</div>
              <div className="flex items-center mt-2 md:justify-end">
                {getChangeIcon(coinData.price_change_percentage_24h, 20)}
                <span className={`ml-1 text-lg ${getChangeColor(coinData.price_change_percentage_24h)}`}>
                  {coinData.price_change_percentage_24h.toFixed(2)}% (24h)
                </span>
              </div>
            </div>
          </div>

          {/* Price Chart */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Price Chart</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
            <ChartClientWrapper coinId={coinData.id} period="1w" />
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-gray-100 dark:border-gray-700">
          <div className="p-5 border-r border-gray-100 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Market Cap</div>
            <div className="text-xl font-semibold">{formatLargeNumber(coinData.market_cap)}</div>
          </div>
          <div className="p-5 border-r border-gray-100 dark:border-gray-700 md:border-r-0 lg:border-r">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">24h Volume</div>
            <div className="text-xl font-semibold">{formatLargeNumber(coinData.total_volume)}</div>
          </div>
          <div className="p-5 border-t border-r border-gray-100 dark:border-gray-700 md:border-t-0">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Circulating Supply</div>
            <div className="text-xl font-semibold">{(coinData.available_supply / 1000000).toFixed(2)}M {coinData.symbol.toUpperCase()}</div>
          </div>
          <div className="p-5 border-t border-gray-100 dark:border-gray-700 md:border-t-0">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Total Supply</div>
            <div className="text-xl font-semibold">{coinData.total_supply ? (coinData.total_supply / 1000000).toFixed(2) + 'M' : 'N/A'} {coinData.symbol.toUpperCase()}</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Price Changes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Price Performance</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">1 Hour</h3>
                  <div className="flex items-center">
                    {getChangeIcon(coinData.price_change_percentage_1h, 20)}
                    <span className={`ml-2 text-xl font-medium ${getChangeColor(coinData.price_change_percentage_1h)}`}>
                      {coinData.price_change_percentage_1h.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">24 Hours</h3>
                  <div className="flex items-center">
                    {getChangeIcon(coinData.price_change_percentage_24h, 20)}
                    <span className={`ml-2 text-xl font-medium ${getChangeColor(coinData.price_change_percentage_24h)}`}>
                      {coinData.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">7 Days</h3>
                  <div className="flex items-center">
                    {getChangeIcon(coinData.price_change_percentage_7d, 20)}
                    <span className={`ml-2 text-xl font-medium ${getChangeColor(coinData.price_change_percentage_7d)}`}>
                      {coinData.price_change_percentage_7d.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">30 Days</h3>
                  <div className="flex items-center">
                    {getChangeIcon(coinData.price_change_percentage_30d, 20)}
                    <span className={`ml-2 text-xl font-medium ${getChangeColor(coinData.price_change_percentage_30d)}`}>
                      {coinData.price_change_percentage_30d.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Price Range */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 p-6">
            <h2 className="text-xl font-semibold mb-4">24h Price Range</h2>
            <div className="relative h-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-2">
              <div 
                className="absolute h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" 
                style={{ 
                  width: `${((coinData.current_price - coinData.low_24h) / (coinData.high_24h - coinData.low_24h)) * 100}%` 
                }}
              ></div>
              <div 
                className="absolute w-4 h-4 bg-white shadow border-2 border-blue-500 rounded-full -mt-0 -ml-2 transform transition-all duration-200 hover:scale-110"
                style={{ 
                  left: `${((coinData.current_price - coinData.low_24h) / (coinData.high_24h - coinData.low_24h)) * 100}%` 
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <div className="text-gray-600 dark:text-gray-400">
                <span className="text-lg font-medium">${coinData.low_24h.toLocaleString()}</span>
                <span className="ml-2 text-xs uppercase tracking-wide">24h Low</span>
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-right">
                <span className="text-lg font-medium">${coinData.high_24h.toLocaleString()}</span>
                <span className="ml-2 text-xs uppercase tracking-wide">24h High</span>
              </div>
            </div>
          </div>
          
          {/* About Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold">About {coinData.name}</h2>
            </div>
            <div className="p-6">
              {coinData.symbol.toLowerCase() === 'btc' ? (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Bitcoin is the world&apos;s first decentralized cryptocurrency. It was created in 2009 by an anonymous person or group known as Satoshi Nakamoto. Bitcoin operates on a technology called blockchain, which is a distributed ledger enforced by a decentralized network of computers. It enables secure, peer-to-peer transactions without the need for intermediaries like banks or payment processors. Bitcoin has a fixed supply of 21 million coins, making it a deflationary asset often compared to digital gold.
                </p>
              ) : coinData.symbol.toLowerCase() === 'eth' ? (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Ethereum is a decentralized, open-source blockchain with smart contract functionality. It was proposed in 2013 by Vitalik Buterin and went live in 2015. Ethereum enables developers to build and deploy decentralized applications (dApps) and is the foundation for thousands of cryptocurrency projects. Unlike Bitcoin, which primarily serves as digital money, Ethereum&apos;s native token Ether (ETH) fuels the Ethereum network and is used to pay for transaction fees and computational services. Ethereum completed its transition to Proof of Stake in 2022, significantly reducing its energy consumption.
                </p>
              ) : (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {coinData.name} ({coinData.symbol.toUpperCase()}) is a cryptocurrency that&apos;s currently ranked #{coinData.market_cap_rank} by market capitalization. It trades at a current price of ${coinData.current_price.toLocaleString()} with a 24-hour trading volume of ${coinData.total_volume.toLocaleString()}. The circulating supply is {coinData.available_supply.toLocaleString()} {coinData.symbol.toUpperCase()}.
                </p>
              )}
              
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex flex-col items-center justify-center">
                  <Activity className="text-blue-500 mb-3" size={24} />
                  <div className="text-sm text-gray-500 dark:text-gray-400">Market Cap Rank</div>
                  <div className="font-bold text-lg">#{coinData.market_cap_rank}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 flex flex-col items-center justify-center">
                  <Users className="text-green-500 mb-3" size={24} />
                  <div className="text-sm text-gray-500 dark:text-gray-400">Popularity</div>
                  <div className="font-bold text-lg">High</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 flex flex-col items-center justify-center">
                  <Clock className="text-purple-500 mb-3" size={24} />
                  <div className="text-sm text-gray-500 dark:text-gray-400">Updated</div>
                  <div className="font-bold text-lg">{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          {/* Crypto Converter */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Crypto Converter</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                    <Image 
                      src={coinData.image} 
                      alt={coinData.name} 
                      width={28} 
                      height={28} 
                      className="rounded-full mr-3"
                    />
                    <div className="text-sm uppercase font-medium">{coinData.symbol}</div>
                    <input 
                      type="number" 
                      className="ml-auto bg-transparent text-right w-28 focus:outline-none" 
                      defaultValue="1"
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    <span className="text-gray-500">⇄</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                    <DollarSign size={22} className="mr-3 text-green-500" />
                    <div className="text-sm uppercase font-medium">USD</div>
                    <input 
                      type="text" 
                      className="ml-auto bg-transparent text-right focus:outline-none w-36" 
                      value={`$${coinData.current_price.toLocaleString()}`}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Links and Resources */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Links & Resources</h2>
            </div>
            <div className="p-3">
              <div className="space-y-2">
                {coinData.website_url && (
                  <a 
                    href={coinData.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3 flex-shrink-0">
                      <Globe size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">Official Website</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{coinData.website_url.replace(/^https?:\/\//, '')}</div>
                    </div>
                    <ExternalLink size={16} className="ml-2 text-gray-400" />
                  </a>
                )}
                
                {coinData.twitter_url && (
                  <a 
                    href={coinData.twitter_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 flex items-center justify-center mr-3 flex-shrink-0">
                      <Twitter size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">Twitter</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{coinData.twitter_url.replace(/^https?:\/\//, '')}</div>
                    </div>
                    <ExternalLink size={16} className="ml-2 text-gray-400" />
                  </a>
                )}
                
                {coinData.reddit_url && (
                  <a 
                    href={coinData.reddit_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center mr-3 flex-shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">Reddit</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{coinData.reddit_url.replace(/^https?:\/\//, '')}</div>
                    </div>
                    <ExternalLink size={16} className="ml-2 text-gray-400" />
                  </a>
                )}
                
                {coinData.explorers && coinData.explorers.length > 0 && (
                  <a 
                    href={coinData.explorers[0]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-3 flex-shrink-0">
                      <BarChart2 size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">Block Explorer</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{coinData.explorers[0].replace(/^https?:\/\//, '').split('/')[0]}</div>
                    </div>
                    <ExternalLink size={16} className="ml-2 text-gray-400" />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Related Assets */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Related Assets</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {coinData.symbol.toLowerCase() !== 'btc' && (
                  <Link 
                    href="/coins/bitcoin" 
                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mr-3">
                      <span className="font-medium text-orange-600 dark:text-orange-400">BTC</span>
                    </div>
                    <div>
                      <div className="font-medium">Bitcoin</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Digital Gold</div>
                    </div>
                  </Link>
                )}
                
                {coinData.symbol.toLowerCase() !== 'eth' && (
                  <Link 
                    href="/coins/ethereum" 
                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mr-3">
                      <span className="font-medium text-blue-600 dark:text-blue-400">ETH</span>
                    </div>
                    <div>
                      <div className="font-medium">Ethereum</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Smart Contract Platform</div>
                    </div>
                  </Link>
                )}
                
                {coinData.symbol.toLowerCase() !== 'usdt' && (
                  <Link 
                    href="/coins/tether" 
                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mr-3">
                      <span className="font-medium text-green-600 dark:text-green-400">USDT</span>
                    </div>
                    <div>
                      <div className="font-medium">Tether</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Stablecoin</div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 py-4 border-t border-gray-200 dark:border-gray-700">
        Data provided by CoinStats API • Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
} 