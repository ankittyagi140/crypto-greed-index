'use client';


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          About Us
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We aim to provide cryptocurrency investors with accurate and timely market sentiment data through our Fear & Greed Index. Our goal is to help investors make more informed decisions by understanding the emotional state of the market.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              What We Do
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Our Fear & Greed Index analyzes various data points in the cryptocurrency market to determine the overall market sentiment. We update our index every 12 hours to ensure you have the most current information available.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Our Technology
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We use advanced algorithms to analyze multiple factors including market volatility, volume, social media sentiment, and market dominance. This comprehensive approach provides a reliable indicator of market sentiment.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
} 