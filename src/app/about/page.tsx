'use client';

import { useState, useEffect } from 'react';
import Skeleton from '@/components/Skeleton';

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <Skeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            About Crypto Greed Index
        </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Empowering investors with data-driven market sentiment analysis
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              At Crypto Greed Index, we are dedicated to providing cryptocurrency investors with precise, 
              real-time market sentiment data. Our mission is to empower investors with actionable insights 
              that help them navigate the volatile cryptocurrency markets more effectively. By quantifying 
              market sentiment through our sophisticated index, we enable both retail and institutional 
              investors to make more informed investment decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Our Methodology
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              We employ a comprehensive, multi-factor analysis approach that combines various market indicators 
              to generate our Greed Index. Our methodology is based on six key components:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Market Volatility (25%)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Analysis of current volatility compared to average values over the past 30/90 days.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Market Momentum (25%)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Measurement of current market volume and momentum against historical averages.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Social Media (15%)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Sentiment analysis from major social platforms including Twitter, Reddit, and Telegram.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Market Dominance (10%)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Bitcoin&apos;s market dominance and its influence on overall market sentiment.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Our Technology
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our platform leverages cutting-edge technology to deliver accurate and timely market sentiment data:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Real-time data processing and analysis</li>
              <li>Advanced machine learning algorithms for sentiment analysis</li>
              <li>Automated data validation and verification systems</li>
              <li>High-frequency updates every 12 hours</li>
              <li>Robust API infrastructure for data delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Our Commitment
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We are committed to maintaining the highest standards of accuracy and reliability in our 
              sentiment analysis. Our team continuously monitors and refines our methodology to ensure 
              the index reflects the most accurate representation of market sentiment. We believe in 
              transparency and provide detailed documentation of our methodology and regular updates 
              about any changes or improvements to our system.
            </p>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Data Sources & Attributions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              We integrate data from several trusted sources to provide comprehensive market analysis:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Market Data & Sentiment</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>
                    <span className="font-medium">Alternative.me</span> - Core Fear & Greed Index data and historical metrics.
                    <a 
                      href="https://alternative.me/crypto/fear-and-greed-index/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 ml-1"
                    >
                      Visit Alternative.me
                    </a>
                  </li>
                  <li>
                    <span className="font-medium">CoinGecko API</span> - Real-time cryptocurrency prices, 
                    market capitalization, and trading volume data.
                    <a 
                      href="https://www.coingecko.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 ml-1"
                    >
                      Visit CoinGecko
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Social Sentiment Analysis</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>
                    <span className="font-medium">Twitter API</span> - Social media sentiment and engagement metrics.
                    <a 
                      href="https://developer.twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 ml-1"
                    >
                      Twitter Developer Platform
                    </a>
                  </li>
                  <li>
                    <span className="font-medium">Reddit API</span> - Community discussion and sentiment analysis.
                    <a 
                      href="https://www.reddit.com/dev/api" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 ml-1"
                    >
                      Reddit API Docs
                    </a>
                  </li>
                  <li>
                    <span className="font-medium">Telegram API</span> - Crypto community engagement and sentiment data.
                    <a 
                      href="https://core.telegram.org/api" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 ml-1"
                    >
                      Telegram API
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">API Usage & Terms</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  All data is sourced in accordance with each provider&apos;s terms of service and API usage guidelines. 
                  We maintain appropriate rate limits and data handling practices as specified by our data partners.
                </p>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                All trademarks, logos, and brand names are the property of their respective owners. 
                All company, product, and service names used in this website are for identification purposes only. 
                Use of these names, trademarks, and brands does not imply endorsement.
              </p>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              For inquiries about our Greed Index, partnership opportunities, or technical 
              support, please reach out to us at{' '}
              <a 
                href="mailto:cryptogreedindex@gmail.com" 
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                cryptogreedindex@gmail.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
} 