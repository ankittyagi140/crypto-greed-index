'use client'

import { useEffect, useState } from "react";
import LazyChartSection from "@/components/LazyChartSection"
import { SocialSentimentSkeleton } from "@/components/ChartSkeletons";
import dynamic from "next/dynamic";
import toast, { Toaster } from "react-hot-toast";

interface SocialPlatformData {
    sentiment: number;
    volume: number;
    positiveCount?: number;
    negativeCount?: number;
}

interface SentimentDataPoint {
    date: string;
    btcPrice: number;
    btcPriceMin: number;
    btcPriceMax: number;
    twitter: SocialPlatformData;
    reddit: SocialPlatformData;
    telegram: SocialPlatformData;
    aggregate: {
        sentiment: number;
        volume: number;
    };
}

const SocialSentiment = dynamic(() => import('@/components/SocialSentiment'), {
    loading: () => <SocialSentimentSkeleton />,
    ssr: false
});
const SocialSentimentsBTC = () => {

    const [socialSentimentData, setSocialSentimentData] = useState<SentimentDataPoint[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchSocialSentimentData = async () => {
            const loadingToast = toast.loading('Fetching Social Sentiments data...');

            try {
                const response = await fetch('/api/social-sentiment?days=365');
                const socialData = await response.json();
                // Set social sentiment data directly since it now includes proper BTC price data
                if (socialData.success && Array.isArray(socialData.data)) {
                    setSocialSentimentData(socialData.data);
                }
                toast.success('Market data updated', {
                    id: loadingToast,
                    duration: 2000,
                });
                setLoading(false);
            } catch (err: Error | unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch market data.';
                toast.error(errorMessage, {
                    id: loadingToast,
                    duration: 4000,
                });
                setLoading(false);
            }
        };
        fetchSocialSentimentData();

    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <main className="container mx-auto px-4 py-8">
                    <SocialSentimentSkeleton />
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <LazyChartSection>
                    {socialSentimentData.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12 transition-all duration-300 hover:shadow-xl">
                            <SocialSentiment data={socialSentimentData} />
                        </div>
                    )}
                </LazyChartSection>
            </main>
        </div>
    )
}

export default SocialSentimentsBTC;