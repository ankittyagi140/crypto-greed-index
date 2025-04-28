'use client';

import { BarChart2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Use dynamic import with ssr: false in a client component
const CoinChart = dynamic(() => import('../../../components/CoinChart'), {
  loading: () => (
    <div className="mt-8 h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
      <div className="text-gray-400 flex flex-col items-center">
        <BarChart2 size={24} className="animate-pulse mb-2" />
        <span className="mt-2">Loading price chart...</span>
      </div>
    </div>
  ),
  ssr: false
});

interface ChartClientWrapperProps {
  coinId: string;
  period: string;
}

export default function ChartClientWrapper({ coinId, period }: ChartClientWrapperProps) {
  return <CoinChart coinId={coinId} initialPeriod={period} />;
} 