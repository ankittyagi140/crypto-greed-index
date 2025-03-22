'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatNumber, formatDate } from '@/lib/utils';
import { ArrowLeft, TrendingUp, TrendingDown, Users, Code, Link as LinkIcon } from 'lucide-react';
import Script from 'next/script';
import { Toaster, toast } from 'react-hot-toast';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  volume24h: number;
  volumeChange24h: number;
  high24h: number;
  low24h: number;
  priceChange: {
    '24h': number;
    '7d': number;
    '30d': number;
  };
  marketCapChange24h: number;
  supply: {
    total: number;
    circulating: number;
    max: number | null;
  };
  links: {
    homepage: string | null;
    blockchain: string | null;
    forum: string | null;
    chat: string | null;
    announcements: string | null;
    twitter: string | null;
    facebook: string | null;
    telegram: string | null;
    reddit: string | null;
    github: string | null;
    bitbucket: string | null;
  };
  community: {
    facebook: number | null;
    twitter: number | null;
    reddit: number | null;
    telegram: number | null;
  };
  development: {
    forks: number;
    stars: number;
    subscribers: number;
    issues: {
      total: number;
      closed: number;
    };
    pullRequests: {
      merged: number;
      contributors: number;
    };
    activity: {
      additions: number;
      deletions: number;
      commits: number;
    };
  };
  historicalData: Array<{
    date: string;
    price: number;
  }>;
}

interface Props {
  id: string;
}

export default function ClientPage({ id }: Props) {
  const router = useRouter();
  const [data, setData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1D' | '7D' | '30D' | '1Y'>('1Y');

  useEffect(() => {
    const fetchData = async () => {
      const loadingToast = toast.loading('Fetching coin data...', {
        position: 'top-right',
      });
      try {
        const response = await fetch(`/api/coin/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch coin data');
        }
        const result = await response.json();
        setData(result.data);
        toast.success('Data updated successfully', { 
          id: loadingToast,
          duration: 3000,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load coin data';
        toast.error(errorMessage, { 
          id: loadingToast,
          duration: 4000,
        });
        console.error('Error fetching coin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Filter historical data based on selected time range
  const filteredHistoricalData = useMemo(() => {
    if (!data?.historicalData) return [];

    const now = new Date();
    const ranges = {
      '1D': 1,
      '7D': 7,
      '30D': 30,
      '1Y': 365,
    };

    const daysToKeep = ranges[timeRange];
    const cutoffDate = new Date(now.setDate(now.getDate() - daysToKeep));

    return data.historicalData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= cutoffDate;
    });
  }, [data?.historicalData, timeRange]);

  // Calculate high and low prices from filtered data
  const chartStats = useMemo(() => {
    if (!filteredHistoricalData.length) return { high: 0, low: 0 };
    
    const prices = filteredHistoricalData.map(item => item.price);
    return {
      high: Math.max(...prices),
      low: Math.min(...prices),
    };
  }, [filteredHistoricalData]);

  // Calculate price change for color gradient
  const getPriceChangeColor = () => {
    if (!filteredHistoricalData.length) return '#3B82F6';
    
    const firstPrice = filteredHistoricalData[0].price;
    const lastPrice = filteredHistoricalData[filteredHistoricalData.length - 1].price;
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
    
    return change >= 0 ? '#22C55E' : '#EF4444'; // green-500 : red-500
  };

  // Get price change color for text
  const getPriceChangeTextColor = (change: number | null | undefined) => {
    if (change === null || change === undefined) return 'text-gray-500';
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  // Generate structured data based on coin data
  const structuredData = useMemo(() => {
    if (!data) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Cryptocurrency",
      "name": data.name,
      "symbol": data.symbol.toUpperCase(),
      "description": `Detailed information about ${data.name} (${data.symbol.toUpperCase()}) cryptocurrency including price, market data, and technical analysis.`,
      "url": `https://www.cryptogreedindex.com/coin/${id}`,
      "image": `https://assets.coingecko.com/coins/images/1/${id}.png`,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.cryptogreedindex.com/coin/${id}`
      },
      "price": {
        "@type": "PriceSpecification",
        "price": data.currentPrice,
        "priceCurrency": "USD"
      },
      "marketCap": {
        "@type": "MonetaryAmount",
        "value": data.marketCap,
        "currency": "USD"
      },
      "volume24h": {
        "@type": "MonetaryAmount",
        "value": data.volume24h,
        "currency": "USD"
      },
      "priceChange": {
        "@type": "PriceSpecification",
        "priceChange24h": data.priceChange['24h'],
        "priceChange7d": data.priceChange['7d'],
        "priceChange30d": data.priceChange['30d']
      },
      "supply": {
        "@type": "QuantitativeValue",
        "circulatingSupply": data.supply.circulating,
        "totalSupply": data.supply.total,
        "maxSupply": data.supply.max
      },
      "community": {
        "@type": "Organization",
        "twitterFollowers": data.community.twitter,
        "redditSubscribers": data.community.reddit,
        "telegramMembers": data.community.telegram
      },
      "development": {
        "@type": "SoftwareApplication",
        "githubStars": data.development.stars,
        "githubForks": data.development.forks,
        "pullRequests": {
          "merged": data.development.pullRequests.merged,
          "contributors": data.development.pullRequests.contributors
        },
        "codeActivity": {
          "additions": data.development.activity.additions,
          "deletions": data.development.activity.deletions,
          "commits": data.development.activity.commits
        }
      }
    };
  }, [data, id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="animate-pulse space-y-6 sm:space-y-8">
          <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-48 sm:h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 sm:h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
            Coin not found
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The requested coin could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {structuredData && (
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {data.name} ({data.symbol.toUpperCase()})
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Rank #{data.marketCapRank}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {['1D', '7D', '30D', '1Y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as typeof timeRange)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                ${formatNumber(data.currentPrice)}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className={`flex items-center ${getPriceChangeTextColor(data.priceChange['24h'])}`}>
                  {data.priceChange['24h'] >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {Math.abs(data.priceChange['24h']).toFixed(2)}%
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  24h Volume: ${formatNumber(data.volume24h)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">24h High</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">${formatNumber(data.high24h)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">24h Low</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">${formatNumber(data.low24h)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">${formatNumber(data.marketCap)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Circulating Supply</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(data.supply.circulating)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredHistoricalData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getPriceChangeColor()} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={getPriceChangeColor()} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatDate(value)}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${formatNumber(value)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [`$${formatNumber(value)}`, 'Price']}
                  labelFormatter={(label) => formatDate(label)}
                />
                <ReferenceLine y={chartStats.high} stroke="#22C55E" strokeDasharray="3 3" />
                <ReferenceLine y={chartStats.low} stroke="#EF4444" strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={getPriceChangeColor()}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Community & Development Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Community Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Community
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {data.community.twitter && (
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Twitter</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(data.community.twitter)}</p>
                </div>
              )}
              {data.community.reddit && (
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reddit</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(data.community.reddit)}</p>
                </div>
              )}
              {data.community.telegram && (
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Telegram</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(data.community.telegram)}</p>
                </div>
              )}
              {data.community.facebook && (
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Facebook</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(data.community.facebook)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Development Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Code className="h-5 w-5 mr-2" />
              Development
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Stars</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(data.development.stars)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Forks</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(data.development.forks)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Subscribers</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(data.development.subscribers)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Issues</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(data.development.issues.total)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <LinkIcon className="h-5 w-5 mr-2" />
            Links
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(data.links).map(([key, value]) => {
              if (!value) return null;
              return (
                <a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <span className="capitalize">{key}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
} 