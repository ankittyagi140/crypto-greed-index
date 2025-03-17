'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQItemProps {
  title: string;
  description: string;
  isOpen: boolean;
  toggleOpen: () => void;
  index: number;
}

function FAQItem({ title, description, isOpen, toggleOpen, index }: FAQItemProps) {
  return (
    <motion.div 
      className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <button
        onClick={toggleOpen}
        className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        <ChevronDownIcon 
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>
      
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FAQSection() {
  // State to track which FAQ items are open
  const [openItems, setOpenItems] = useState<number[]>([]);

  // Toggle function for opening/closing FAQ items
  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index) 
        : [...prev, index]
    );
  };

  const faqs = [
    {
      title: "What Is Crypto Fear and Greed Index?",
      description: "The ups and downs of the crypto market can be quite steep and it's not rare for investors to get discouraged. The Crypto Fear and Greed Index makes an assessment of the dominant mood on the market, so the psychological factor is also taken into account. The atmosphere of Fear drives many investors to panic and sell their crypto assets. This is a potential buying opportunity. While the times of Greed foster a certain recklessness in investment decisions."
    },
    {
      title: "How Is Fear & Greed Calculated?",
      description: "The volatile crypto market is guided by the psychological currents running underneath it. The psychological backdrop of the crypto market finds its reflection in a number of mediums, from social media posts to Google Trends. The market itself, when interpreted in combination with data from those outside mediums, can tell us a lot about the investing environment."
    },
    {
      title: "How to Use Fear and Greed Index?",
      description: "If you're about to make an investment decision, but are unsure just how much that decision is affected by the general atmosphere of Fear or Greed on the market, checking the index can be quite helpful. The Fear Index era is all about selling, so valuable assets are sometimes thrown out. In contrast, the Greed Index era is characterized by careless investments in overvalued assets."
    },
    {
      title: "What Factors Affect the Index?",
      description: "The index considers multiple factors: Current Volatility (25%), Market Momentum/Volume (25%), Social Media Sentiment (15%), Surveys (15%), Bitcoin Dominance (10%), and Google Trends (10%). Each factor is weighted to provide a comprehensive view of market sentiment."
    }
  ];

  return (
    <div className="py-8 sm:py-16 bg-transparent">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index}
              title={faq.title} 
              description={faq.description} 
              isOpen={openItems.includes(index)}
              toggleOpen={() => toggleItem(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 