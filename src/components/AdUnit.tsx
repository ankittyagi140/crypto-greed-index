'use client';

import React, { useEffect, useRef } from 'react';

type AdUnitProps = {
    adClient: string;
    adSlot: string;
    format?: 'auto' | 'fluid';
    layoutKey?: string;
    responsive?: boolean;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Reliable Google AdSense unit that pushes after mount and retries
 * until the loader is ready. Avoids duplicate pushes on the same <ins>.
 */
const AdUnit: React.FC<AdUnitProps> = ({
    adClient,
    adSlot,
    format = 'auto',
    layoutKey,
    responsive = true,
    className,
    style,
}) => {
    const insRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        let retriesRemaining = 10;
        let retryTimer: number | undefined;

        const tryPush = () => {
            const node = insRef.current as unknown as HTMLElement | null;
            if (!node) return;

            // Prevent double initialization
            if (node.getAttribute('data-adsbygoogle-status') === 'done') return;

            // adsbygoogle queue is safe to push to even before script fully loads
            // but in some environments it may be undefined briefly – so we retry.
            // @ts-expect-error adsbygoogle is injected globally by AdSense script
            if (typeof window !== 'undefined' && window.adsbygoogle) {
                try {
                    // @ts-expect-error see above
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (_) {
                    // If push throws (e.g., not fully ready), retry a few times
                    if (retriesRemaining > 0) {
                        retriesRemaining -= 1;
                        retryTimer = window.setTimeout(tryPush, 800);
                    }
                }
            } else if (retriesRemaining > 0) {
                retriesRemaining -= 1;
                retryTimer = window.setTimeout(tryPush, 800);
            }
        };

        tryPush();

        return () => {
            if (retryTimer) {
                window.clearTimeout(retryTimer);
            }
        };
    }, []);

    return (
        <ins
            ref={insRef as unknown as React.LegacyRef<HTMLModElement>}
            className={`adsbygoogle ${className ?? ''}`.trim()}
            style={{ display: 'block', ...(style || {}) }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format={format}
            data-full-width-responsive={responsive ? 'true' : 'false'}
            {...(layoutKey ? { 'data-ad-layout-key': layoutKey } as any : {})}
        />
    );
};

export default AdUnit;


