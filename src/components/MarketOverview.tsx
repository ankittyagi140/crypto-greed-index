'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import ShareButtons from './ShareButtons';

interface MarketData {
  total_market_cap: number;
  total_volume: number;
  btc_dominance: number;
  eth_dominance: number;
  market_cap_change_percentage_24h: number;
  volume_change_percentage_24h: number;
  fear_greed_value?: number;
  fear_greed_classification?: string;
}

export default function MarketOverview() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const formatLargeNumber = useCallback((num: number): string => {
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  }, []);

  const fetchMarketData = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/api/global', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'public, max-age=300'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data.data) {
        setMarketData({
          total_market_cap: data.data.total_market_cap.usd,
          total_volume: data.data.total_volume.usd,
          btc_dominance: data.data.market_cap_percentage.btc,
          eth_dominance: data.data.market_cap_percentage.eth,
          market_cap_change_percentage_24h: data.data.market_cap_change_percentage_24h_usd,
          volume_change_percentage_24h: data.data.volume_change_percentage_24h_usd,
          fear_greed_value: data.data.fear_greed_value,
          fear_greed_classification: data.data.fear_greed_classification
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        toast.error('Request timeout - retrying...');
      } else {
        toast.error('Failed to fetch market data');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  const marketCapCard = useMemo(() => {
    const changeValue = marketData?.market_cap_change_percentage_24h || 0;
    const isPositive = changeValue >= 0;
    
    return (
      <div className="rounded-lg p-2 sm:p-3 bg-white shadow-sm">
        <div className="text-gray-700 text-xs sm:text-sm">Market Cap</div>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <div className="text-base sm:text-lg font-bold text-gray-900">
            {formatLargeNumber(marketData?.total_market_cap || 0)}
          </div>
          <div className={`text-xs sm:text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '▲' : '▼'} {Math.abs(changeValue).toFixed(2)}%
          </div>
        </div>
      </div>
    );
  }, [marketData?.total_market_cap, marketData?.market_cap_change_percentage_24h, formatLargeNumber]);

  const volumeCard = useMemo(() => {
    const changeValue = marketData?.volume_change_percentage_24h || 0;
    const isPositive = changeValue >= 0;
    
    return (
      <div className="rounded-lg p-2 sm:p-3 bg-white shadow-sm">
        <div className="text-gray-700 text-xs sm:text-sm">Volume 24h</div>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <div className="text-base sm:text-lg font-bold text-gray-900">
            {formatLargeNumber(marketData?.total_volume || 0)}
          </div>
          <div className={`text-xs sm:text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '▲' : '▼'} {Math.abs(changeValue).toFixed(2)}%
          </div>
        </div>
      </div>
    );
  }, [marketData?.total_volume, marketData?.volume_change_percentage_24h, formatLargeNumber]);

  const btcDominanceCard = useMemo(() => {
    const previousBtcDominance = marketData?.btc_dominance || 0;
    const currentBtcDominance = marketData?.btc_dominance || 0;
    const isPositive = currentBtcDominance >= previousBtcDominance;
    
    return (
      <div 
        className="rounded-lg p-2 sm:p-3 bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors" 
        onClick={() => router.push('/btc-dominance')}
      >
        <div className="text-gray-700 text-xs sm:text-sm">BTC Dominance</div>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <div className="text-base sm:text-lg font-bold text-gray-900">
            {currentBtcDominance.toFixed(1)}%
          </div>
          <div className={`text-xs sm:text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            View Chart →
          </div>
        </div>
      </div>
    );
  }, [marketData?.btc_dominance, router]);

  const ethDominanceCard = useMemo(() => {
    const previousEthDominance = marketData?.eth_dominance || 0;
    const currentEthDominance = marketData?.eth_dominance || 0;
    const isPositive = currentEthDominance >= previousEthDominance;
    
    return (
      <div 
        className="rounded-lg p-2 sm:p-3 bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors" 
        onClick={() => router.push('/eth-dominance')}
      >
        <div className="text-gray-700 text-xs sm:text-sm">ETH Dominance</div>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <div className="text-base sm:text-lg font-bold text-gray-900">
            {currentEthDominance.toFixed(1)}%
          </div>
          <div className={`text-xs sm:text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            View Chart →
          </div>
        </div>
      </div>
    );
  }, [marketData?.eth_dominance, router]);

  const altcoinDominanceCard = useMemo(() => {
    if (!marketData) return null;
    const altcoinDominance = 100 - (marketData.btc_dominance + marketData.eth_dominance);
    const previousAltcoinDominance = altcoinDominance;
    const isPositive = altcoinDominance >= previousAltcoinDominance;
    
    return (
      <div 
        className="rounded-lg p-2 sm:p-3 bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors" 
        onClick={() => router.push('/altcoin-dominance')}
      >
        <div className="text-gray-700 text-xs sm:text-sm">Altcoin Dominance</div>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <div className="text-base sm:text-lg font-bold text-gray-900">
            {altcoinDominance.toFixed(1)}%
          </div>
          <div className={`text-xs sm:text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            View Chart →
          </div>
        </div>
      </div>
    );
  }, [marketData, router]);

  const shareText = useMemo(() => {
    if (!marketData) return '';
    const fearGreedText = marketData.fear_greed_value ? 
      `\nFear & Greed Index: ${marketData.fear_greed_value} (${marketData.fear_greed_classification})` : '';
    
    return `📊 Crypto Market Overview\n` +
           `Market Cap: ${formatLargeNumber(marketData.total_market_cap)}\n` +
           `24h Volume: ${formatLargeNumber(marketData.total_volume)}\n` +
           `BTC Dominance: ${marketData.btc_dominance.toFixed(1)}%\n` +
           `ETH Dominance: ${marketData.eth_dominance.toFixed(1)}%\n` +
           `Altcoin Dominance: ${((100 - (marketData.btc_dominance + marketData.eth_dominance)) || 0).toFixed(1)}%` +
           fearGreedText;
  }, [marketData, formatLargeNumber]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg p-2 sm:p-3 animate-pulse bg-gray-100 dark:bg-gray-800 h-16 sm:h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (!marketData) return null;

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 max-w-6xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Crypto Market Overview</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Real-time performance of the global cryptocurrency market
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
        {marketCapCard}
        {volumeCard}
        {btcDominanceCard}
        {ethDominanceCard}
        {altcoinDominanceCard}
      </div>
      <ShareButtons 
        title="Crypto Market Overview"
        text={shareText}
        hashtags={['crypto', 'bitcoin', 'ethereum', 'marketcap','feargreed','altcoin','dominance']}
      />
    </div>
  );
} 