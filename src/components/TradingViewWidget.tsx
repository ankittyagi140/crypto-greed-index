'use client';

import { useEffect, useRef } from 'react';

interface TradingViewProps {
  symbol: string;
  theme?: 'light' | 'dark';
}

interface TradingViewWindow extends Window {
  TradingView?: {
    widget: new (config: TradingViewConfig) => void;
  };
}

interface TradingViewConfig {
  autosize: boolean;
  symbol: string;
  interval: string;
  timezone: string;
  theme: string;
  style: string;
  locale: string;
  toolbar_bg: string;
  enable_publishing: boolean;
  allow_symbol_change: boolean;
  container_id: string;
}

export default function TradingViewWidget({ symbol, theme = 'dark' }: TradingViewProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentContainer = container.current;
    const script = document.createElement('script');
    
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      const tradingView = (window as TradingViewWindow).TradingView;
      if (currentContainer && tradingView?.widget) {
        new tradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol}`,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: theme,
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_widget'
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, theme]);

  return (
    <div id="tradingview_widget" ref={container} className="w-full h-full" />
  );
} 