'use client';

import { useEffect } from 'react';

export default function ClientAdsense() {
  useEffect(() => {
    // Create and append the AdSense script when component mounts (client-side only)
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1332831285527693';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.id = 'google-adsense';
    document.head.appendChild(script);

    // Cleanup function to remove the script when component unmounts
    return () => {
      const existingScript = document.getElementById('google-adsense');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // This component doesn't render anything visible
  return null;
} 