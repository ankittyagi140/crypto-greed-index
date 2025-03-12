'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface MarketData {
  total_market_cap: number;
  total_volume: number;
  btc_dominance: number;
  market_cap_change_percentage_24h: number;
  volume_change_percentage_24h: number;
}

export default function MarketOverview() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const formatLargeNumber = useCallback((num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  }, []);

  const fetchMarketData = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch('/api/global', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'public, max-age=300' // 5 minutes cache
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
          market_cap_change_percentage_24h: data.data.market_cap_change_percentage_24h_usd,
          volume_change_percentage_24h: data.data.market_cap_change_percentage_24h_usd
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

    return () => {
      clearInterval(interval);
    };
  }, [fetchMarketData]);

  const marketCapCard = useMemo(() => (
    <div className="rounded-lg p-3 bg-red-50">
      <div className="text-gray-700 text-sm">Market Cap</div>
      <div className="flex items-baseline gap-2">
        <div className="text-lg font-bold text-gray-900">
          ${formatLargeNumber(marketData?.total_market_cap || 0)}
        </div>
        <div className="text-sm font-medium text-red-500">
          ▼ {Math.abs(marketData?.market_cap_change_percentage_24h || 0).toFixed(2)}%
        </div>
      </div>
    </div>
  ), [marketData?.total_market_cap, marketData?.market_cap_change_percentage_24h, formatLargeNumber]);

  const volumeCard = useMemo(() => (
    <div className="rounded-lg p-3 bg-green-50">
      <div className="text-gray-700 text-sm">Volume 24h</div>
      <div className="flex items-baseline gap-2">
        <div className="text-lg font-bold text-gray-900">
          ${formatLargeNumber(marketData?.total_volume || 0)}
        </div>
        <div className="text-sm font-medium text-green-500">
          ▲ 106.2%
        </div>
      </div>
    </div>
  ), [marketData?.total_volume, formatLargeNumber]);

  const btcDominanceCard = useMemo(() => (
    <div 
      className="rounded-lg p-3 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors" 
      onClick={() => router.push('/btc-dominance')}
    >
      <div className="text-gray-700 text-sm">BTC Dominance</div>
      <div className="flex items-baseline gap-2">
        <div className="text-lg font-bold text-gray-900">
          {(marketData?.btc_dominance || 0).toFixed(1)}%
        </div>
        <div className="text-sm font-medium text-green-500">
          ▲ 0.21%
        </div>
      </div>
    </div>
  ), [marketData?.btc_dominance, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-3 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg p-3 animate-pulse bg-gray-100 dark:bg-gray-800 h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (!marketData) return null;

  return (
    <div className="container mx-auto px-4 py-3 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {marketCapCard}
        {volumeCard}
        {btcDominanceCard}
      </div>
    </div>
  );
} 