'use client'

import { useEffect, useState } from "react";
import LazyChartSection from "@/components/LazyChartSection"
import { SocialSentimentSkeleton } from "@/components/ChartSkeletons";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";

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
            <main className="container mx-auto px-4 py-8 max-w-8xl">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                        Bitcoin Social Sentiment Analysis
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
                        Track and analyze Bitcoin sentiment across major social media platforms to understand market psychology and potential price movements
                    </p>
                </div>

             

                {/* Chart Section */}
                <LazyChartSection>
                    {socialSentimentData.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12 transition-all duration-300 hover:shadow-xl">
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3 text-center">
                                    Social Sentiment Trends
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 text-base text-center max-w-2xl mx-auto">
                                    Track sentiment trends and their correlation with Bitcoin price movements across major social platforms
                                </p>
                            </div>
                            <SocialSentiment data={socialSentimentData} />
                        </div>
                    )}
                </LazyChartSection>

                   {/* Information Section */}
                   <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12 transition-all duration-300 hover:shadow-xl">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                            Understanding Social Media Sentiment in Crypto Markets
                        </h2>
                        
                        <div className="space-y-6 text-gray-600 dark:text-gray-300">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                    What is Social Sentiment Analysis?
                                </h3>
                                <p className="leading-relaxed">
                                    Social sentiment analysis uses advanced natural language processing to measure the collective mood and opinion about Bitcoin across major social media platforms. By analyzing millions of posts, comments, and messages, we can gauge market sentiment and identify potential trend shifts before they appear in price action.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                    Platform Coverage
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Twitter</h4>
                                        <p className="text-sm">Real-time analysis of tweets, hashtags, and discussions from crypto influencers and traders.</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Reddit</h4>
                                        <p className="text-sm">Sentiment analysis from major cryptocurrency subreddits and trading communities.</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Telegram</h4>
                                        <p className="text-sm">Analysis of sentiment from popular crypto trading and discussion groups.</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                    How to Use This Tool
                                </h3>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Monitor sentiment shifts across different platforms</li>
                                    <li>Compare social sentiment with price movements</li>
                                    <li>Identify potential market tops and bottoms through social indicators</li>
                                    <li>Track social volume for trend confirmation</li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mt-6">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    <strong>Note:</strong> Social sentiment should be used as one of many tools in your analysis toolkit. While social media can provide valuable insights, it should not be the sole basis for trading decisions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SocialSentimentsBTC;