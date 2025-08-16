'use client';

import { useEffect } from 'react';

interface AdUnitProps {
    adClient: string;
    adSlot: string;
    format?: 'auto' | 'fluid';
    responsive?: boolean;
    layoutKey?: string; // for fluid ads
    className?: string;
    style?: React.CSSProperties;
}

declare global {
    interface Window {
        adsbygoogle: unknown[] | undefined;
    }
}

export default function AdUnit({
    adClient,
    adSlot,
    format = 'auto',
    responsive = true,
    layoutKey,
    className,
    style,
}: AdUnitProps) {
    useEffect(() => {
        // Ensure script exists (in case global loader failed or on isolated page render)
        const existing = document.querySelector(
            'script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
        ) as HTMLScriptElement | null;
        if (!existing) {
            const s = document.createElement('script');
            s.async = true;
            s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
                adClient
            )}`;
            s.crossOrigin = 'anonymous';
            document.head.appendChild(s);
        }

        // Queue an ad render. Slight delay improves reliability while script initializes
        const timer = window.setTimeout(() => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (window.adsbygoogle = window.adsbygoogle || []) as any[];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (window.adsbygoogle as any[]).push({});
            } catch (err) {
                // Intentionally noop; AdSense manages its own errors
            }
        }, 300);
        return () => window.clearTimeout(timer);
    }, [adClient, adSlot, format, layoutKey, responsive]);

    return (
        <ins
            className={`adsbygoogle${className ? ` ${className}` : ''}`}
            style={{ display: 'block', ...(style || {}) }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            {...(format ? { 'data-ad-format': format } : {})}
            {...(responsive ? { 'data-full-width-responsive': 'true' } : {})}
            {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        />
    );
}
