'use client';

import { useState, useEffect } from 'react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
    // Add small delay to allow content to render before scrolling
    setTimeout(() => {
      const element = document.getElementById(`faq-${index}`);
      if (element) {
        const yOffset = -100; // Adjust this value based on your header height
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  const faqs = [
    {
      question: "What is the Fear and Greed Index?",
      answer: "The Fear and Greed Index is a market sentiment indicator that measures two primary emotions driving cryptocurrency investors: fear and greed. It uses various data points to generate a score from 0 to 100, where 0 represents extreme fear and 100 represents extreme greed."
    },
    {
      question: "How is the Fear and Greed Index calculated?",
      answer: "The index considers multiple factors including market volatility, trading volume, social media sentiment, market dominance, and trends. Each factor is weighted to produce the final score that indicates the overall market sentiment."
    },
    {
      question: "How can I use this index for trading?",
      answer: "The index can be used as one of many tools for market analysis. Extreme fear (below 25) might indicate buying opportunities as markets may be oversold, while extreme greed (above 75) might suggest markets are due for a correction."
    },
    {
      question: "How often is the index updated?",
      answer: "The Fear and Greed Index is updated every 24 hours to reflect the current market sentiment. Historical data is also maintained to show trends over time."
    },
    {
      question: "Is this index reliable for making investment decisions?",
      answer: "While the index can provide insights into market sentiment, it should not be used as the sole indicator for making investment decisions. It's best used in conjunction with other technical and fundamental analysis tools."
    }
  ];

  if (!mounted) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              id={`faq-${index}`}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => handleToggle(index)}
                className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                <span className="ml-6 flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div
                  className="p-4 bg-gray-50 dark:bg-gray-700/50"
                  role="region"
                  aria-labelledby={`faq-${index}`}
                >
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection; 