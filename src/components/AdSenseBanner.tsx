'use client';

import { useEffect } from 'react';

interface AdSenseBannerProps {
  adSlot: string;
  adClient: string;
  adFormat?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Extend Window interface for AdSense
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSenseBanner({ 
  adSlot, 
  adClient, 
  adFormat = "auto",
  className = "",
  style = {}
}: AdSenseBannerProps) {
  useEffect(() => {
    console.log('AdSenseBanner: Component mounted, adSlot:', adSlot);
    
    // Initialize AdSense ads
    const initializeAdSense = () => {
      console.log('AdSenseBanner: Initializing AdSense...');
      
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        console.log('AdSenseBanner: AdSense script found, pushing ad...');
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log('AdSenseBanner: Ad pushed successfully');
          
          // Hide fallback placeholder after successful ad load
          setTimeout(() => {
            const placeholder = document.getElementById(`ad-placeholder-${adSlot}`);
            if (placeholder) {
              console.log('AdSenseBanner: Hiding fallback placeholder');
              placeholder.style.opacity = '0';
            }
          }, 3000);
        } catch (error) {
          console.error('AdSenseBanner: AdSense initialization error:', error);
          // Show fallback placeholder if ad fails to load
          const placeholder = document.getElementById(`ad-placeholder-${adSlot}`);
          if (placeholder) {
            console.log('AdSenseBanner: Showing fallback due to error');
            placeholder.style.opacity = '1';
          }
        }
      } else {
        console.log('AdSenseBanner: AdSense script not found, showing fallback');
        // Show fallback if AdSense script not loaded
        setTimeout(() => {
          const placeholder = document.getElementById(`ad-placeholder-${adSlot}`);
          if (placeholder) {
            console.log('AdSenseBanner: Showing fallback - no AdSense script');
            placeholder.style.opacity = '1';
          }
        }, 2000);
      }
    };

    // Initialize AdSense after a short delay to ensure the DOM is ready
    const adSenseTimeout = setTimeout(initializeAdSense, 1500);

    return () => {
      clearTimeout(adSenseTimeout);
    };
  }, [adSlot]);

  return (
    <div className={`relative ${className}`}>
      {/* AdSense Ad Container */}
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block',
          minHeight: '90px',
          width: '100%',
          ...style
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
      
      {/* Fallback placeholder - shows if ad doesn't load */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 flex items-center justify-center transition-opacity duration-300" 
        id={`ad-placeholder-${adSlot}`}
        style={{ opacity: 1 }}
      >
        <div className="text-center">
          <div className="text-blue-600 text-sm font-medium mb-1">Advertisement</div>
          <div className="text-blue-400 text-xs">AdSense Ad Slot: {adSlot}</div>
          <div className="text-blue-400 text-xs mt-1">Loading ad content...</div>
        </div>
      </div>
    </div>
  );
}
